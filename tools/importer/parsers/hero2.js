/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Extract background image from style attribute
  function getBackgroundImageUrl(el) {
    const style = el.getAttribute('style') || '';
    const match = style.match(/background-image:\s*url\(([^)]+)\)/);
    if (match && match[1]) {
      let url = match[1].replace(/(^['"]|['"]$)/g, '');
      url = url.replace(/\\2f/g, '/').replace(/\\/g, '');
      url = url.replace(/\s+/g, '');
      if (url.startsWith('/')) {
        return url;
      }
      return url;
    }
    return null;
  }

  // Find the background image URL from the first container with style
  const bgContainer = element.querySelector('[style*="background-image"]');
  const bgUrl = bgContainer ? getBackgroundImageUrl(bgContainer) : null;

  // Create image element if background image exists
  let bgImgEl = null;
  if (bgUrl) {
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgUrl;
    bgImgEl.alt = '';
  }

  // Find the deepest .aem-Grid
  let grid = element.querySelector('.aem-Grid.aem-Grid--12.aem-Grid--tablet--12.aem-Grid--default--12.aem-Grid--phone--12');
  if (!grid) {
    // fallback: find any .aem-Grid
    grid = element.querySelector('.aem-Grid');
  }

  // Collect all .text and .button blocks inside the grid
  let textBlocks = [];
  if (grid) {
    textBlocks = Array.from(grid.querySelectorAll('.text, .button'));
  }

  // Compose content cell (row 3)
  const contentCell = [];
  textBlocks.forEach((block) => {
    // For .text blocks, extract their .cmp-text children (usually contains <p> or <h3>)
    const cmpText = block.querySelector('.cmp-text');
    if (cmpText) {
      // Clone to avoid moving from original DOM
      contentCell.push(cmpText.cloneNode(true));
    }
    // For .button blocks, extract the <a> element
    if (block.classList.contains('button')) {
      const a = block.querySelector('a');
      if (a) contentCell.push(a.cloneNode(true));
    }
  });

  // Build table rows
  const headerRow = ['Hero (hero2)'];
  const imageRow = [bgImgEl ? bgImgEl : ''];
  const contentRow = [contentCell.length ? contentCell : ''];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
