/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get background image URL from inline style
  function extractBgUrl(style) {
    if (!style) return null;
    const match = style.match(/background-image:\s*url\(["']?(.*?)["']?\)/i);
    if (match && match[1]) {
      // Unescape any encoded characters (e.g., \2f for /)
      return match[1].replace(/\\2f\s*/g, '/');
    }
    return null;
  }

  // 1. Header row
  const headerRow = ['Hero (hero11)'];

  // 2. Background image row
  let bgImgUrl = null;
  let bgImgEl = null;
  // Find the first element with inline background-image style
  const bgDiv = element.querySelector('[style*="background-image"]');
  if (bgDiv) {
    bgImgUrl = extractBgUrl(bgDiv.getAttribute('style'));
    if (bgImgUrl) {
      bgImgEl = document.createElement('img');
      bgImgEl.src = bgImgUrl;
      bgImgEl.alt = '';
    }
  }
  const bgRow = [bgImgEl ? bgImgEl : ''];

  // 3. Content row (title, subheading, paragraph, CTA)
  // Find the content container (the innermost .cmp-container)
  let contentContainer = null;
  const containers = element.querySelectorAll('.cmp-container');
  if (containers.length > 0) {
    // Use the deepest one (last in DOM order)
    contentContainer = containers[containers.length - 1];
  }
  // Defensive: fallback to the whole element if not found
  const contentCell = [contentContainer ? contentContainer : ''];

  // Compose the table
  const cells = [
    headerRow,
    bgRow,
    contentCell
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
