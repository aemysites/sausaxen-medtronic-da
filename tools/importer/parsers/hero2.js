/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract background-image url from style attribute
  function extractBgUrl(style) {
    if (!style) return null;
    const match = style.match(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/i);
    if (match && match[1]) {
      // Unescape any encoded slashes
      return match[1].replace(/\\2f /g, '/').replace(/\\/g, '');
    }
    return null;
  }

  // 1. Header row
  const headerRow = ['Hero (hero2)'];

  // 2. Background image row
  // Look for the first element with a background-image style
  let bgUrl = null;
  let bgDiv = null;
  // Search direct children and one level deeper for background-image
  const containers = [element, ...element.querySelectorAll('*')];
  for (const el of containers) {
    const style = el.getAttribute && el.getAttribute('style');
    const url = extractBgUrl(style);
    if (url) {
      bgUrl = url;
      bgDiv = el;
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
  // Find content elements: eyebrow, intro, h1, button
  // These are inside nested .aem-Grid > .text or .button
  let eyebrow = null, intro = null, h1 = null, cta = null;
  const grids = element.querySelectorAll('.aem-Grid');
  for (const grid of grids) {
    // Eyebrow
    if (!eyebrow) {
      eyebrow = grid.querySelector('.text.eyebrow2 .cmp-text');
    }
    // Intro
    if (!intro) {
      intro = grid.querySelector('.text.intro-heading .cmp-text');
    }
    // H1
    if (!h1) {
      h1 = grid.querySelector('.text.h1 .cmp-text');
    }
    // CTA
    if (!cta) {
      cta = grid.querySelector('.button a.cmp-button');
    }
  }

  // Compose content cell
  const contentCell = [];
  if (eyebrow) contentCell.push(eyebrow);
  if (intro) contentCell.push(intro);
  if (h1) contentCell.push(h1);
  if (cta) contentCell.push(cta);
  const contentRow = [contentCell.length ? contentCell : ''];

  // Compose table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bgRow,
    contentRow,
  ], document);

  // Replace original element
  element.replaceWith(table);
}
