/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Extract background image URL from inline style
  function getBackgroundImageUrl(el) {
    const style = el.getAttribute('style') || '';
    const match = style.match(/background-image\s*:\s*url\(([^)]+)\)/);
    if (match && match[1]) {
      let url = match[1].replace(/\\2f /g, '/').replace(/\\/g, '');
      url = url.replace(/^['"]|['"]$/g, ''); // Remove quotes
      // If relative, prepend origin
      if (/^\//.test(url)) {
        url = window.location.origin + url;
      }
      return url;
    }
    return null;
  }

  // 1. Header row
  const headerRow = ['Hero (hero23)'];

  // 2. Background image row
  let bgContainer = element.querySelector('[style*="background-image"]');
  let bgUrl = bgContainer ? getBackgroundImageUrl(bgContainer) : null;
  let bgImgEl = null;
  if (bgUrl) {
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgUrl;
    bgImgEl.alt = '';
    bgImgEl.loading = 'eager';
    bgImgEl.style.width = '100%';
  }
  const bgRow = [bgImgEl ? bgImgEl : ''];

  // 3. Content row
  // Only immediate children of the deepest .aem-Grid
  let grid = element.querySelector('.aem-Grid.aem-Grid--11') || element.querySelector('.aem-Grid.aem-Grid--12');
  let contentEls = [];
  if (grid) {
    // Eyebrow (Who we are)
    const eyebrow = grid.querySelector('.eyebrow2 .cmp-text');
    if (eyebrow) contentEls.push(eyebrow);
    // Main heading (Engineering the extraordinary)
    const h1block = grid.querySelector('.h1 .cmp-text');
    if (h1block) contentEls.push(h1block);
    // Subheading (Groundbreaking healthcare...)
    const introHeading = grid.querySelector('.intro-heading .cmp-title');
    if (introHeading) contentEls.push(introHeading);
    // Button (See how)
    const ctaBtn = grid.querySelector('.button .cmp-button');
    if (ctaBtn) contentEls.push(ctaBtn);
  }
  const contentRow = [contentEls.length ? contentEls : ''];

  // Build table
  const cells = [headerRow, bgRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
