/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get background image URL from inline style
  function getBackgroundImageUrl(style) {
    if (!style) return null;
    const match = style.match(/background-image:\s*url\(['"]?(.*?)['"]?\)/i);
    if (match && match[1]) {
      // Unescape any escaped slashes
      return match[1].replace(/\\/g, '');
    }
    return null;
  }

  // 1. Header row
  const headerRow = ['Hero (hero14)'];

  // 2. Background image row
  let bgImgRow = [''];
  // Find the first inner container with a background-image style
  let bgUrl = null;
  let bgContainer = element.querySelector('[style*="background-image"]');
  if (bgContainer) {
    bgUrl = getBackgroundImageUrl(bgContainer.getAttribute('style'));
  }
  if (bgUrl) {
    const img = document.createElement('img');
    img.src = bgUrl;
    img.alt = '';
    bgImgRow = [img];
  }

  // 3. Content row (title, subheading, CTA)
  // We'll collect all text and button content in visual order
  let contentElems = [];
  // Find the deepest .cmp-container (the one with the text/button)
  let innerContainer = element.querySelector('.cmp-container .aem-Grid');
  if (innerContainer) {
    // Get all direct children (columns)
    const columns = Array.from(innerContainer.children);
    columns.forEach(col => {
      // Eyebrow (subheading)
      if (col.classList.contains('eyebrow2')) {
        const eyebrow = col.querySelector('.cmp-text');
        if (eyebrow) contentElems.push(eyebrow);
      }
      // Heading
      else if (col.classList.contains('h1')) {
        const heading = col.querySelector('.cmp-text');
        if (heading) contentElems.push(heading);
      }
      // CTA button
      else if (col.classList.contains('button')) {
        const btn = col.querySelector('a');
        if (btn) contentElems.push(btn);
      }
    });
  }
  // Defensive: fallback to all text and button descendants if above fails
  if (contentElems.length === 0) {
    contentElems = Array.from(element.querySelectorAll('.cmp-text, a.cmp-button'));
  }
  const contentRow = [contentElems];

  // Build table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bgImgRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
