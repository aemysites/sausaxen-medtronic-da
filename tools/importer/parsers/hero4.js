/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the background image URL from inline style
  function extractBgImageUrl(style) {
    if (!style) return null;
    const match = style.match(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/i);
    if (match && match[1]) {
      // Unescape any encoded characters (e.g., \2f for /)
      return match[1].replace(/\\2f\s*/g, '/');
    }
    return null;
  }

  // 1. Header row
  const headerRow = ['Hero (hero4)'];

  // 2. Background image row
  let bgImgRow = [''];
  // Find the first container with a background-image style
  const bgContainer = element.querySelector('[style*="background-image"]');
  if (bgContainer) {
    const bgUrl = extractBgImageUrl(bgContainer.getAttribute('style'));
    if (bgUrl) {
      const img = document.createElement('img');
      img.src = bgUrl;
      bgImgRow = [img];
    }
  }

  // 3. Content row: Title, Subheading, CTA (if any)
  // We'll collect all text blocks in visual order
  let contentRow = [''];
  // Find the deepest .aem-Grid with text blocks
  const grids = element.querySelectorAll('.aem-Grid');
  let textGrid = null;
  for (const grid of grids) {
    if (grid.querySelector('.cmp-text')) {
      textGrid = grid;
      break;
    }
  }
  if (textGrid) {
    // Get all .cmp-text elements in order
    const textBlocks = textGrid.querySelectorAll('.cmp-text');
    const contentElements = [];
    textBlocks.forEach(tb => {
      // Defensive: only add if has content
      if (tb.textContent.trim()) {
        // Use the <div class="cmp-text"> directly
        contentElements.push(tb);
      }
    });
    if (contentElements.length) {
      contentRow = [contentElements];
    }
  }

  // Compose the table
  const cells = [
    headerRow,
    bgImgRow,
    contentRow,
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
