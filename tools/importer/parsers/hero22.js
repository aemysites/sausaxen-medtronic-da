/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Extract background image URL from style attribute
  function getBackgroundImageUrl(el) {
    const style = el.getAttribute('style') || '';
    const match = style.match(/background-image:\s*url\(([^)]+)\)/i);
    if (match && match[1]) {
      let url = match[1]
        .replace(/\\2f/g, '/')
        .replace(/\\/g, '')
        .replace(/^['"]|['"]$/g, '')
        .trim();
      // Remove any whitespace
      url = url.replace(/\s+/g, '');
      // If relative, prepend origin
      if (url.startsWith('/')) {
        url = window.location.origin + url;
      }
      return url;
    }
    return null;
  }

  // 1. Header row
  const headerRow = ['Hero (hero22)'];

  // 2. Background image row (optional)
  let bgImgUrl = null;
  let bgImgEl = null;
  const bgDiv = element.querySelector('[style*="background-image"]');
  if (bgDiv) {
    bgImgUrl = getBackgroundImageUrl(bgDiv);
    if (bgImgUrl) {
      bgImgEl = document.createElement('img');
      bgImgEl.src = bgImgUrl;
      bgImgEl.alt = '';
      bgImgEl.setAttribute('loading', 'lazy');
    }
  }
  const bgImgRow = [bgImgEl ? bgImgEl : ''];

  // 3. Content row: Title, Subheading, CTA
  let contentRowContent = [];
  // Find the deepest .aem-Grid
  const grids = element.querySelectorAll('.aem-Grid');
  let deepestGrid = null;
  let maxDepth = 0;
  grids.forEach(g => {
    let depth = 0;
    let parent = g;
    while (parent && parent !== element) {
      parent = parent.parentElement;
      depth++;
    }
    if (depth > maxDepth) {
      maxDepth = depth;
      deepestGrid = g;
    }
  });
  if (deepestGrid) {
    const textBlocks = deepestGrid.querySelectorAll(':scope > .text');
    textBlocks.forEach(block => {
      const cmpText = block.querySelector('.cmp-text');
      if (cmpText) {
        Array.from(cmpText.children).forEach(child => {
          contentRowContent.push(child);
        });
      }
    });
  }
  const contentRow = [contentRowContent.length ? contentRowContent : ''];

  // Compose table
  const cells = [
    headerRow,
    bgImgRow,
    contentRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
