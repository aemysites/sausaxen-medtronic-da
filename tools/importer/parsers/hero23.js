/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Hero (hero23)'];

  // 2. Extract background image from style attribute
  let bgImgUrl = '';
  const bgDiv = element.querySelector('[style*="background-image"]');
  if (bgDiv) {
    const style = bgDiv.getAttribute('style') || '';
    const match = style.match(/background-image:\s*url\(([^)]+)\)/i);
    if (match && match[1]) {
      // Clean up the url (handle escaped slashes)
      bgImgUrl = match[1]
        .replace(/\\2f /g, '/')
        .replace(/\\/g, '')
        .replace(/^['"]|['"]$/g, '');
      // If relative, prepend origin
      if (bgImgUrl.startsWith('/')) {
        bgImgUrl = `${document.location.origin}${bgImgUrl}`;
      }
    }
  }

  let bgImgElem = '';
  if (bgImgUrl) {
    bgImgElem = document.createElement('img');
    bgImgElem.src = bgImgUrl;
    bgImgElem.alt = '';
  }

  // 3. Extract text content (eyebrow, heading, subheading, CTA)
  // Find the deepest .aem-Grid with text/button children
  const grid = element.querySelector('.aem-Grid.aem-Grid--11');
  let eyebrow = '', heading = '', subheading = '', cta = '';
  if (grid) {
    // Eyebrow
    const eyebrowDiv = grid.querySelector('.eyebrow2 .cmp-text p');
    if (eyebrowDiv) {
      eyebrow = eyebrowDiv.cloneNode(true);
    }
    // Heading ("Engineering the extraordinary")
    const headingDiv = grid.querySelector('.h1 .cmp-text');
    if (headingDiv) {
      // Merge all <p> into one <div>
      const hDiv = document.createElement('div');
      Array.from(headingDiv.children).forEach(child => {
        hDiv.appendChild(child.cloneNode(true));
      });
      heading = hDiv;
    }
    // Subheading (long h1)
    const subheadingDiv = grid.querySelector('.intro-heading .cmp-title__text');
    if (subheadingDiv) {
      // Use as <h2> for semantics
      const h2 = document.createElement('h2');
      h2.textContent = subheadingDiv.textContent;
      subheading = h2;
    }
    // CTA button
    const ctaDiv = grid.querySelector('.button .cmp-button');
    if (ctaDiv) {
      cta = ctaDiv.cloneNode(true);
    }
  }

  // Compose content cell for row 3
  const contentCell = [];
  if (eyebrow) contentCell.push(eyebrow);
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  if (cta) contentCell.push(cta);

  // Build table rows
  const rows = [
    headerRow,
    [bgImgElem ? bgImgElem : ''],
    [contentCell.length ? contentCell : ''],
  ];

  // Create block table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
