/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract background image URL from inline style
  function getBackgroundImageUrl(style) {
    if (!style) return null;
    const match = style.match(/background-image:\s*url\(([^)]+)\)/);
    if (match && match[1]) {
      let url = match[1].replace(/\\/g, '');
      url = url.replace(/^['"]|['"]$/g, '');
      if (url.startsWith('/')) {
        url = window.location.origin + url;
      }
      return url;
    }
    return null;
  }

  // 1. Header row
  const headerRow = ['Hero (hero28)'];

  // 2. Background Image row
  let bgImageUrl = null;
  const bgContainer = element.querySelector('[style*="background-image"]');
  if (bgContainer) {
    bgImageUrl = getBackgroundImageUrl(bgContainer.getAttribute('style'));
  }
  let bgImageCell = '';
  if (bgImageUrl) {
    const img = document.createElement('img');
    img.src = bgImageUrl;
    img.alt = '';
    bgImageCell = img;
  }

  // 3. Content row (title, subheading, paragraph, CTA)
  let contentContainer = null;
  const containers = element.querySelectorAll(':scope > div > div > div');
  for (const cont of containers) {
    if (cont.classList.contains('circle-content')) {
      contentContainer = cont;
      break;
    }
  }
  if (!contentContainer) {
    contentContainer = element.querySelector('.cmp-container');
  }

  let titleElem = null;
  let subheadingElem = null;
  let paragraphElem = null;
  let ctaElem = null;

  if (contentContainer) {
    const eyebrow = contentContainer.querySelector('.eyebrow .cmp-title__text');
    if (eyebrow) {
      titleElem = eyebrow;
    }
    const subheading = contentContainer.querySelector('.avenir-regular .cmp-title__text');
    if (subheading) {
      subheadingElem = subheading;
    }
    const paragraph = contentContainer.querySelector('.cmp-text p');
    if (paragraph) {
      paragraphElem = paragraph;
    }
    const button = contentContainer.querySelector('.cmp-button');
    if (button) {
      ctaElem = button;
    }
  }

  const contentCell = [];
  if (titleElem) contentCell.push(titleElem);
  if (subheadingElem) contentCell.push(subheadingElem);
  if (paragraphElem) contentCell.push(paragraphElem);
  if (ctaElem) contentCell.push(ctaElem);

  const rows = [
    headerRow,
    [bgImageCell],
    [contentCell]
  ];

  const block = WebImporter.DOMUtils.createTable(rows, document);

  element.replaceWith(block);
}
