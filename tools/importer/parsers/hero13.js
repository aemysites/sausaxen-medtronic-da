/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Extract background image URL from inline style
  function extractBackgroundImageUrl(el) {
    if (!el) return null;
    const style = el.getAttribute('style') || '';
    const match = style.match(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/i);
    if (match && match[1]) {
      // Unescape encoded slashes
      return match[1].replace(/\\2f /g, '/').replace(/\\/g, '');
    }
    return null;
  }

  // 1. Header row
  const headerRow = ['Hero (hero13)'];

  // 2. Background image row
  let bgUrl = null;
  let bgDiv = element.querySelector('[style*="background-image"]');
  if (bgDiv) {
    bgUrl = extractBackgroundImageUrl(bgDiv);
  }
  let bgImgEl = null;
  if (bgUrl) {
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgUrl;
    bgImgEl.alt = '';
  }
  const bgRow = [bgImgEl ? bgImgEl : ''];

  // 3. Content row: collect all .cmp-text children in order
  const textBlocks = Array.from(element.querySelectorAll('.cmp-text'));
  const contentFragment = document.createDocumentFragment();
  textBlocks.forEach(tb => {
    Array.from(tb.children).forEach(child => {
      contentFragment.appendChild(child.cloneNode(true));
    });
  });
  const contentRow = [contentFragment];

  // Compose table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bgRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
