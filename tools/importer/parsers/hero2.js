/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Hero (hero2)'];

  // 2. Background image row (row 2)
  // Find the background-image style in the first .cmp-container
  let bgUrl = null;
  const container = element.querySelector('.cmp-container[style*="background-image"]');
  if (container) {
    const style = container.getAttribute('style') || '';
    const match = style.match(/background-image:\s*url\(([^)]+)\)/i);
    if (match && match[1]) {
      // Clean up escaped slashes
      bgUrl = match[1].replace(/\\2f /g, '/').replace(/(^['"]|['"]$)/g, '').trim();
      // Remove any leading/trailing slashes or whitespace
      bgUrl = bgUrl.replace(/^\/+/,'');
      // Prepend origin if relative
      if (bgUrl && !/^https?:\//.test(bgUrl)) {
        bgUrl = `${window.location.origin}${bgUrl.startsWith('/') ? '' : '/'}${bgUrl}`;
      }
    }
  }
  let bgImgEl = null;
  if (bgUrl) {
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgUrl;
    bgImgEl.alt = '';
  }
  const bgRow = [bgImgEl ? bgImgEl : ''];

  // 3. Content row (row 3)
  // Find the innermost .cmp-container (with the text/button content)
  let innerContainer = element.querySelector('.cmp-container .aem-Grid');
  if (!innerContainer) {
    // fallback: try to find the deepest .aem-Grid
    const grids = element.querySelectorAll('.aem-Grid');
    innerContainer = grids[grids.length - 1];
  }

  // We'll collect content in order: eyebrow, intro, heading, button
  let contentEls = [];
  if (innerContainer) {
    // Eyebrow
    const eyebrow = innerContainer.querySelector('.eyebrow2 .cmp-text');
    if (eyebrow) contentEls.push(eyebrow);
    // Intro
    const intro = innerContainer.querySelector('.intro-heading .cmp-text');
    if (intro) contentEls.push(intro);
    // Heading
    const heading = innerContainer.querySelector('.h1 .cmp-text');
    if (heading) contentEls.push(heading);
    // Button
    const button = innerContainer.querySelector('.button a.cmp-button');
    if (button) contentEls.push(button);
  }
  const contentRow = [contentEls.length ? contentEls : ''];

  // Assemble table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bgRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
