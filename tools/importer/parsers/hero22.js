/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract background image URL from inline style
  function getBackgroundImageUrl(style) {
    if (!style) return null;
    const match = style.match(/background-image:\s*url\(['"]?(.*?)['"]?\)/i);
    if (match && match[1]) {
      // Some URLs may be encoded with \2f for '/'
      return match[1].replace(/\\2f\s*/g, '/');
    }
    return null;
  }

  // 1. Header row
  const headerRow = ['Hero (hero22)'];

  // 2. Background image row
  let bgImgCell = '';
  // Find the first container with a background-image style
  const bgContainer = element.querySelector('[style*="background-image"]');
  if (bgContainer) {
    const bgUrl = getBackgroundImageUrl(bgContainer.getAttribute('style'));
    if (bgUrl) {
      // Create an image element for the background asset
      const img = document.createElement('img');
      img.src = bgUrl;
      img.alt = '';
      bgImgCell = img;
    }
  }

  // 3. Content row (headline, subheading, etc)
  // Find all text blocks in order
  const textBlocks = [];
  // Find all .cmp-text elements inside the block, in order
  element.querySelectorAll('.cmp-text').forEach((cmpText) => {
    // Only add non-empty blocks
    if (cmpText.textContent.trim()) {
      textBlocks.push(cmpText);
    }
  });

  // Compose content cell
  let contentCell = '';
  if (textBlocks.length) {
    // Compose a fragment to keep all text blocks together
    const frag = document.createDocumentFragment();
    textBlocks.forEach((block) => {
      frag.appendChild(block);
    });
    contentCell = frag;
  }

  // Assemble table rows
  const rows = [
    headerRow,
    [bgImgCell],
    [contentCell]
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
