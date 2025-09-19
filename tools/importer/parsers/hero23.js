/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Hero (hero23)'];

  // 2. Background image row (extract from inline style)
  let bgImageRow;
  // Find the deepest container with a background-image style
  const bgContainer = element.querySelector('[style*="background-image"]');
  let bgImgEl = null;
  if (bgContainer) {
    const style = bgContainer.getAttribute('style');
    const match = style.match(/background-image:\s*url\(([^)]+)\)/);
    if (match && match[1]) {
      // Clean up the URL (decode any escaped chars)
      let url = match[1].replace(/\\2f/g, '/').replace(/\s/g, '');
      // Remove any leading/trailing quotes
      url = url.replace(/^['"]|['"]$/g, '');
      // Create image element
      bgImgEl = document.createElement('img');
      bgImgEl.src = url;
      bgImgEl.alt = '';
      bgImageRow = [bgImgEl];
    }
  }
  if (!bgImageRow) {
    bgImageRow = ['']; // fallback empty cell
  }

  // 3. Content row (title, subheading, CTA)
  // Find text blocks
  const grid = element.querySelector('.aem-Grid.aem-Grid--11');
  let contentEls = [];
  if (grid) {
    // Eyebrow (Who we are)
    const eyebrow = grid.querySelector('.eyebrow2 .cmp-text');
    if (eyebrow) {
      contentEls.push(eyebrow);
    }
    // Subheading (Engineering the extraordinary)
    const subheading = grid.querySelector('.h1 .cmp-text');
    if (subheading) {
      contentEls.push(subheading);
    }
    // Title (Groundbreaking healthcare...)
    const title = grid.querySelector('.intro-heading .cmp-title');
    if (title) {
      contentEls.push(title);
    }
    // CTA button
    const button = grid.querySelector('.button .cmp-button');
    if (button) {
      contentEls.push(button);
    }
  }
  // Defensive: if nothing found, fallback to all text children
  if (contentEls.length === 0) {
    contentEls = Array.from(element.querySelectorAll('p, h1, h2, h3, a'));
  }
  const contentRow = [contentEls];

  // Build the table
  const cells = [
    headerRow,
    bgImageRow,
    contentRow,
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
