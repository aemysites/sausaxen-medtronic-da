/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Hero (hero9)'];

  // 2. Background image row
  let bgImageUrl = null;
  const bgContainer = element.querySelector('[style*="background-image"]');
  if (bgContainer) {
    const style = bgContainer.getAttribute('style') || '';
    const match = style.match(/background-image:\s*url\(([^)]+)\)/i);
    if (match && match[1]) {
      bgImageUrl = match[1].replace(/\\2f /g, '/').replace(/\\/g, '');
      bgImageUrl = bgImageUrl.replace(/^['"]|['"]$/g, '');
    }
  }
  let bgImageCell;
  if (bgImageUrl) {
    const bgLink = document.createElement('a');
    bgLink.href = bgImageUrl;
    bgLink.textContent = bgImageUrl;
    bgImageCell = bgLink;
  } else {
    bgImageCell = '';
  }

  // 3. Content row (title as heading, subheading, etc.)
  const cellContent = [];
  // Find all .cmp-text blocks inside the deepest grid
  const grids = element.querySelectorAll('.aem-Grid');
  let textGrid = null;
  if (grids.length > 0) {
    textGrid = grids[grids.length - 1];
  }
  if (textGrid) {
    const cmpTexts = textGrid.querySelectorAll('.cmp-text');
    cmpTexts.forEach((cmpText) => {
      // For each cmp-text, append all its children (preserving tags)
      Array.from(cmpText.children).forEach((child) => {
        cellContent.push(child.cloneNode(true));
      });
    });
  }
  const contentCell = cellContent.length ? cellContent : '';

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    [bgImageCell],
    [contentCell],
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
