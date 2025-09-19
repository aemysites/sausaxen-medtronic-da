/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: extract background image URL from inline style
  function getBackgroundImageUrl(style) {
    if (!style) return null;
    const match = style.match(/background-image\s*:\s*url\(([^)]+)\)/);
    if (match && match[1]) {
      let url = match[1].replace(/^['"]|['"]$/g, '');
      url = url.replace(/\\/g, '');
      // If relative, prepend origin
      if (url.startsWith('/')) {
        url = window.location.origin + url;
      }
      return url;
    }
    return null;
  }

  // 1. Header row
  const headerRow = ['Hero (hero19)'];

  // 2. Background image row
  let bgImageUrl = null;
  let bgImageEl = null;
  // Find the deepest container with a background image
  const containers = element.querySelectorAll('[style*="background-image"]');
  for (const c of containers) {
    const url = getBackgroundImageUrl(c.getAttribute('style'));
    if (url) {
      bgImageUrl = url;
      break;
    }
  }
  if (bgImageUrl) {
    bgImageEl = document.createElement('img');
    bgImageEl.src = bgImageUrl;
    bgImageEl.alt = '';
    bgImageEl.setAttribute('loading', 'lazy');
  }
  const imageRow = [bgImageEl ? bgImageEl : ''];

  // 3. Content row: Collect all heading and paragraph text in order
  // Find all .cmp-text and .cmp-title blocks inside .text or .title containers
  const contentCell = [];
  // Get .cmp-text <p>
  element.querySelectorAll('.cmp-text p').forEach(p => {
    contentCell.push(p);
  });
  // Get .cmp-title <h1>
  element.querySelectorAll('.cmp-title h1').forEach(h1 => {
    contentCell.push(h1);
  });
  // If nothing found, fallback to all <h1>, <h2>, <h3>, <p> in order
  if (contentCell.length === 0) {
    element.querySelectorAll('h1, h2, h3, p').forEach(el => {
      if (el.textContent.trim()) contentCell.push(el);
    });
  }
  const contentRow = [contentCell];

  // Build table
  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
