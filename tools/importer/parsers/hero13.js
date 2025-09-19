/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the background-image URL from inline style
  function extractBackgroundImageUrl(style) {
    if (!style) return null;
    const match = style.match(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/i);
    if (match && match[1]) {
      // Unescape any encoded characters (e.g., \2f for /)
      return match[1].replace(/\\2f\s?/g, '/');
    }
    return null;
  }

  // 1. Header row
  const headerRow = ['Hero (hero13)'];

  // 2. Background image row
  // Find the first child with a background-image style
  let bgImgUrl = null;
  let bgImgEl = null;
  const containerDiv = element.querySelector('div.cmp-container[style*="background-image"]');
  if (containerDiv && containerDiv.getAttribute('style')) {
    bgImgUrl = extractBackgroundImageUrl(containerDiv.getAttribute('style'));
  }
  if (bgImgUrl) {
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgImgUrl;
    bgImgEl.alt = '';
  }
  const bgImgRow = [bgImgEl ? bgImgEl : ''];

  // 3. Content row: title, subheading, etc.
  // Find all text containers in correct order
  // We'll look for .cmp-text blocks in the deepest .aem-Grid
  let contentRowContent = [];
  const textBlocks = element.querySelectorAll('.cmp-text');
  textBlocks.forEach((tb) => {
    // Only add if it has content
    if (tb.textContent && tb.textContent.trim().length > 0) {
      // Use the inner div, not just the text node
      contentRowContent.push(tb);
    }
  });
  // If multiple text blocks, put them together
  const contentRow = [contentRowContent];

  // Compose the table
  const tableCells = [
    headerRow,
    bgImgRow,
    contentRow,
  ];

  const table = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(table);
}
