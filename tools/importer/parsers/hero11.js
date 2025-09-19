/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract background image URL from inline style
  function extractBgUrl(style) {
    if (!style) return '';
    const match = style.match(/background-image:\s*url\(([^)]+)\)/i);
    if (match && match[1]) {
      // Remove any escaped slashes and quotes
      return match[1].replace(/\\/g, '').replace(/^['"]|['"]$/g, '');
    }
    return '';
  }

  // 1. Header row
  const headerRow = ['Hero (hero11)'];

  // 2. Background image row
  // Find the div with the background image style
  let bgUrl = '';
  let bgDiv = null;
  const containerDivs = element.querySelectorAll('div');
  for (const div of containerDivs) {
    if (div.style && div.style.backgroundImage) {
      bgUrl = extractBgUrl(div.getAttribute('style'));
      bgDiv = div;
      break;
    }
  }
  let bgImgEl = null;
  if (bgUrl) {
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgUrl;
    bgImgEl.alt = '';
  }
  const bgRow = [bgImgEl ? bgImgEl : ''];

  // 3. Content row
  // Find the content container (the one with the titles, text, button)
  // We look for the innermost .cmp-container inside a .circle-content
  let contentContainer = null;
  const circleContent = element.querySelector('.circle-content');
  if (circleContent) {
    contentContainer = circleContent.querySelector('.cmp-container');
  }
  // Defensive fallback
  if (!contentContainer) {
    contentContainer = element;
  }

  // Extract title, subheading, text, CTA
  let titleEl = null;
  let subheadingEl = null;
  let textEl = null;
  let ctaEl = null;

  // Eyebrow (h3 with link)
  const eyebrow = contentContainer.querySelector('.eyebrow h3, .eyebrow .cmp-title__text');
  if (eyebrow) {
    titleEl = eyebrow;
  }
  // Main title (h2)
  const h2 = contentContainer.querySelector('h2');
  if (h2) {
    subheadingEl = h2;
  }
  // Paragraph
  const p = contentContainer.querySelector('p');
  if (p) {
    textEl = p;
  }
  // CTA button (a.cmp-button)
  const cta = contentContainer.querySelector('a.cmp-button');
  if (cta) {
    ctaEl = cta;
  }

  // Compose content cell
  const contentCell = [];
  if (titleEl) contentCell.push(titleEl);
  if (subheadingEl) contentCell.push(subheadingEl);
  if (textEl) contentCell.push(textEl);
  if (ctaEl) contentCell.push(ctaEl);

  const contentRow = [contentCell];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bgRow,
    contentRow,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
