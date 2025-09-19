/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Extract background image URL from style
  function getBackgroundImageUrl(el) {
    const style = el.getAttribute('style') || '';
    const match = style.match(/background-image:\s*url\(([^)]+)\)/);
    if (match && match[1]) {
      let url = match[1]
        .replace(/\\2f/g, '/')
        .replace(/(^['"]|['"]$)/g, '')
        .replace(/\s/g, ''); // Remove any spaces
      if (url.startsWith('/')) {
        url = `https://www.medtronic.com${url}`;
      }
      return url;
    }
    return null;
  }

  // Find background image
  let bgUrl = null;
  const bgDiv = element.querySelector(':scope > div');
  if (bgDiv) {
    bgUrl = getBackgroundImageUrl(bgDiv);
  }

  // Compose background image cell
  let bgCell = '';
  if (bgUrl) {
    const img = document.createElement('img');
    img.src = bgUrl;
    img.alt = '';
    img.loading = 'lazy';
    bgCell = img;
  }

  // Find content container (the circle-content block)
  const contentCol = element.querySelector('.circle-content');
  let contentCell = '';
  if (contentCol) {
    // Eyebrow text
    const eyebrowTextDiv = contentCol.querySelector('.eyebrow2 .cmp-text');
    let eyebrowText = null;
    if (eyebrowTextDiv) {
      eyebrowText = eyebrowTextDiv.querySelector('p');
    }

    // Title
    const titleDiv = contentCol.querySelector('.title .cmp-title h2');
    let title = null;
    if (titleDiv) {
      title = titleDiv;
    }

    // Description
    const descDiv = contentCol.querySelector('.text.no-bottom-margin-p .cmp-text');
    let desc = null;
    if (descDiv) {
      desc = descDiv.querySelector('p');
    }

    // CTA Button
    const btnDiv = contentCol.querySelector('.button .cmp-button');
    let cta = null;
    if (btnDiv) {
      cta = btnDiv;
    }

    // Compose content cell
    const cellContent = [];
    if (eyebrowText) cellContent.push(eyebrowText);
    if (title) cellContent.push(title);
    if (desc) cellContent.push(desc);
    if (cta) cellContent.push(cta);
    contentCell = cellContent;
  }

  // Compose table rows
  const headerRow = ['Hero (hero26)'];
  const bgRow = [bgCell];
  const contentRow = [contentCell];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bgRow,
    contentRow
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
