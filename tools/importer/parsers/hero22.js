/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Hero (hero22)'];

  // 2. Background image row: extract background-image from style attribute
  let bgImageUrl = '';
  let bgImageEl = null;
  // Find the first element with a style containing background-image
  const bgStyleEl = element.querySelector('[style*="background-image"]');
  if (bgStyleEl) {
    const style = bgStyleEl.getAttribute('style');
    const match = style.match(/background-image:\s*url\(([^)]+)\)/i);
    if (match && match[1]) {
      // Clean up the URL (handle \2f escapes)
      bgImageUrl = match[1].replace(/\\2f /g, '/').replace(/\\2f/g, '/').replace(/'/g, '').replace(/\"/g, '').trim();
      // Remove leading slash if present
      if (bgImageUrl.startsWith('/')) bgImageUrl = bgImageUrl;
      // Create image element
      bgImageEl = document.createElement('img');
      bgImageEl.src = bgImageUrl;
      bgImageEl.alt = '';
    }
  }
  const bgImageRow = [bgImageEl ? bgImageEl : ''];

  // 3. Content row: extract headline, subheading, and intro
  // We'll grab the deepest .aem-Grid inside the block (the one with the text content)
  let contentRowContent = [];
  const grids = element.querySelectorAll('.aem-Grid');
  let textGrid = null;
  if (grids.length > 0) {
    // The last .aem-Grid is the one with the text content
    textGrid = grids[grids.length - 1];
  }
  if (textGrid) {
    // Get all direct children .text blocks
    const textBlocks = Array.from(textGrid.children).filter(el => el.classList.contains('text'));
    textBlocks.forEach(tb => {
      // Each .text contains a .cmp-text with the actual content
      const cmpText = tb.querySelector('.cmp-text');
      if (cmpText) {
        // Push all children (preserving elements)
        Array.from(cmpText.children).forEach(child => {
          contentRowContent.push(child);
        });
      }
    });
  }
  const contentRow = [contentRowContent];

  // Compose the table
  const tableCells = [
    headerRow,
    bgImageRow,
    contentRow,
  ];

  const table = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(table);
}
