/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract background image URL from inline style
  function extractBgUrl(style) {
    if (!style) return null;
    const match = style.match(/background-image:\s*url\(([^)]+)\)/i);
    if (match && match[1]) {
      // Remove leading \2f and decode URI if present
      let url = match[1].replace(/^['"]?|['"]?$/g, '');
      // Handle encoded \2f (escaped slash)
      url = url.replace(/\\2f\s*/g, '/');
      // Remove any leading whitespace
      url = url.trim();
      return url;
    }
    return null;
  }

  // 1. Header row
  const headerRow = ['Hero (hero4)'];

  // 2. Background image row
  let bgImgRow = [''];
  // Try to find the background image from inline style
  let bgUrl = null;
  // The background image is on the 2nd level container
  const firstContainer = element.querySelector(':scope > div');
  if (firstContainer && firstContainer.hasAttribute('style')) {
    bgUrl = extractBgUrl(firstContainer.getAttribute('style'));
  }
  if (bgUrl) {
    const img = document.createElement('img');
    img.src = bgUrl;
    bgImgRow = [img];
  }

  // 3. Content row (title, subheading, CTA)
  // Find the inner grid that contains text blocks
  let contentRow = [''];
  let contentParts = [];
  // The structure is: element > div > div > div > div > div.aem-Grid
  let grid = element.querySelector('.aem-Grid.aem-Grid--10');
  if (grid) {
    // Find all text containers inside the grid
    const textBlocks = grid.querySelectorAll(':scope > div');
    textBlocks.forEach((block) => {
      // Find the cmp-text child (the actual content)
      const cmpText = block.querySelector('.cmp-text');
      if (cmpText && cmpText.textContent.trim().length > 0) {
        // Use the cmp-text div directly for structure resilience
        contentParts.push(cmpText);
      }
    });
  }
  if (contentParts.length) {
    contentRow = [contentParts];
  }

  // Compose the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bgImgRow,
    contentRow,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
