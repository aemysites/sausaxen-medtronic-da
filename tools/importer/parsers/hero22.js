/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract background image URL from inline style
  function extractBgImageUrl(style) {
    if (!style) return null;
    const match = style.match(/background-image:\s*url\(([^)]+)\)/i);
    if (match && match[1]) {
      // Remove any leading \ and decode URI
      let url = match[1].replace(/\\/g, '');
      // Remove surrounding quotes if present
      url = url.replace(/^['"]|['"]$/g, '');
      return url;
    }
    return null;
  }

  // 1. Header row
  const headerRow = ['Hero (hero22)'];

  // 2. Background image row
  // Find the first .cmp-container with a background-image style
  let bgImgUrl = null;
  let bgContainer = null;
  const containers = element.querySelectorAll('[class*="cmp-container"]');
  for (const c of containers) {
    const style = c.getAttribute('style');
    const url = extractBgImageUrl(style);
    if (url) {
      bgImgUrl = url;
      bgContainer = c;
      break;
    }
  }

  let bgImgCell = '';
  if (bgImgUrl) {
    // Create an <img> element for the background image
    const img = document.createElement('img');
    img.src = bgImgUrl;
    img.alt = '';
    bgImgCell = img;
  }

  // 3. Content row: Title, Subheading, CTA
  // The content is inside nested .cmp-container > .aem-Grid > .text blocks
  // We'll collect all .cmp-text blocks in visual order
  const cmpTexts = element.querySelectorAll('.cmp-text');
  const contentNodes = [];
  cmpTexts.forEach((cmpText) => {
    // Defensive: skip if empty
    if (cmpText.textContent.trim()) {
      // Push the inner content (children) instead of the wrapper div
      // This avoids extra wrappers in the output
      contentNodes.push(...Array.from(cmpText.children.length ? cmpText.children : cmpText.childNodes));
    }
  });

  // Compose the table
  const tableRows = [
    headerRow,
    [bgImgCell],
    [contentNodes]
  ];

  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
