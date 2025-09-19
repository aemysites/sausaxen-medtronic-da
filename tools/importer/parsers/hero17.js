/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Extract background image URL from inline style
  function extractBackgroundImageUrl(el) {
    if (!el) return null;
    const style = el.getAttribute('style') || '';
    const match = style.match(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/i);
    if (match && match[1]) {
      // Unescape any encoded slashes (e.g. \2f)
      let url = match[1].replace(/\\2f\s*/g, '/');
      url = url.trim();
      return url;
    }
    return null;
  }

  // 1. Header row
  const headerRow = ['Hero (hero17)'];

  // 2. Background image row
  let bgUrl = null;
  let bgContainer = element.querySelector('[style*="background-image"]');
  bgUrl = extractBackgroundImageUrl(bgContainer);

  let bgCell = '';
  if (bgUrl) {
    const img = document.createElement('img');
    img.src = bgUrl;
    img.loading = 'lazy';
    bgCell = img;
  }

  // 3. Content row (eyebrow, headings, subheading, CTA)
  // Find the deepest grid containing the content
  const contentGrid = element.querySelector('.aem-Grid.aem-Grid--11') || element;

  // Eyebrow
  let eyebrow = '';
  const eyebrowDiv = contentGrid.querySelector('.text.eyebrow2 .cmp-text');
  if (eyebrowDiv) {
    eyebrow = eyebrowDiv;
  }

  // Main heading (can be multiple <p>s)
  let mainHeading = [];
  const mainHeadingDiv = contentGrid.querySelector('.text.h1 .cmp-text');
  if (mainHeadingDiv) {
    mainHeading = Array.from(mainHeadingDiv.childNodes);
  }

  // Subheading (optional)
  let subheading = '';
  const subheadingDiv = contentGrid.querySelector('.title.intro-heading .cmp-title__text');
  if (subheadingDiv) {
    subheading = subheadingDiv;
  }

  // CTA (optional)
  let cta = '';
  const ctaDiv = contentGrid.querySelector('.button .cmp-button');
  if (ctaDiv) {
    cta = ctaDiv;
  }

  // Compose content cell
  // Order: eyebrow, mainHeading, subheading, cta
  const contentCell = [];
  if (eyebrow) contentCell.push(eyebrow);
  if (mainHeading && mainHeading.length) contentCell.push(...mainHeading);
  if (subheading) contentCell.push(subheading);
  if (cta) contentCell.push(cta);

  // Build table
  const rows = [
    headerRow,
    [bgCell],
    [contentCell]
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
