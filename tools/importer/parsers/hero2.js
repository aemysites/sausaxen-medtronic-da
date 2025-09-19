/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get background image from inline style
  function getBackgroundImageUrl(el) {
    const style = el.getAttribute('style') || '';
    const match = style.match(/background-image\s*:\s*url\(([^)]+)\)/);
    if (match && match[1]) {
      let url = match[1]
        .replace(/\\2f/g, '/')
        .replace(/\\/g, '')
        .replace(/^['"]|['"]$/g, '');
      url = url.replace(/\s*\/\s*/g, '/').replace(/\s+/g, '');
      // Remove window.location.origin logic (do not prepend null)
      return url;
    }
    return null;
  }

  // Find the background image
  let bgImageUrl = null;
  const bgContainer = element.querySelector('[style*="background-image"]');
  if (bgContainer) {
    bgImageUrl = getBackgroundImageUrl(bgContainer);
  }

  // Compose background image cell
  let bgCell = '';
  if (bgImageUrl) {
    const img = document.createElement('img');
    img.src = bgImageUrl;
    img.alt = '';
    bgCell = img;
  }

  // Gather all text and button content for the text cell
  let contentCell = [];
  // Find all .cmp-text elements inside the block
  const cmpTexts = element.querySelectorAll('.cmp-text');
  cmpTexts.forEach((cmpText) => {
    Array.from(cmpText.children).forEach((child) => {
      contentCell.push(child.cloneNode(true));
    });
  });
  // Find all .cmp-button links
  const cmpButtons = element.querySelectorAll('.cmp-button');
  cmpButtons.forEach((btn) => {
    contentCell.push(btn.cloneNode(true));
  });

  const headerRow = ['Hero (hero2)'];
  const bgRow = [bgCell || ''];
  const contentRow = [contentCell.length ? contentCell : ''];

  const cells = [headerRow, bgRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(table);
}
