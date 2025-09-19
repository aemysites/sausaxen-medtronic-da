/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get background image from inline style
  function extractBackgroundImageUrl(style) {
    if (!style) return null;
    const match = style.match(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/i);
    if (match && match[1]) {
      // Remove any escaped chars (\2f for /)
      return match[1].replace(/\\2f /g, '/').replace(/\\2f/g, '/');
    }
    return null;
  }

  // 1. Header row
  const headerRow = ['Hero (hero26)'];

  // 2. Background image row
  let bgImgUrl = null;
  let bgImgEl = null;
  const containerDiv = element.querySelector(':scope > div');
  if (containerDiv && containerDiv.getAttribute('style')) {
    bgImgUrl = extractBackgroundImageUrl(containerDiv.getAttribute('style'));
  }
  if (bgImgUrl) {
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgImgUrl.startsWith('http') ? bgImgUrl : `https://www.medtronic.com${bgImgUrl}`;
    bgImgEl.alt = '';
  }
  const bgRow = [bgImgEl ? bgImgEl : ''];

  // 3. Content row: Title, subheading, CTA
  let contentContainer = null;
  const cmpContainers = element.querySelectorAll('.cmp-container');
  if (cmpContainers.length > 1) {
    contentContainer = cmpContainers[cmpContainers.length - 1];
  } else if (cmpContainers.length === 1) {
    contentContainer = cmpContainers[0];
  }

  let contentParts = [];
  if (contentContainer) {
    // Eyebrow image (optional)
    const eyebrowImg = contentContainer.querySelector('.cmp-image img');
    // Eyebrow text (optional)
    const eyebrowText = contentContainer.querySelector('.eyebrow2 .cmp-text p');
    if (eyebrowImg) {
      contentParts.push(eyebrowImg);
    }
    if (eyebrowText && eyebrowText.textContent.replace(/\u00a0/g, '').trim()) {
      contentParts.push(eyebrowText);
    }
    // Title (h2)
    const title = contentContainer.querySelector('.cmp-title__text');
    if (title) {
      contentParts.push(title);
    }
    // Description (first .cmp-text after title)
    const desc = contentContainer.querySelector('.no-bottom-margin-p .cmp-text p');
    if (desc) {
      contentParts.push(desc);
    }
    // CTA button (a.cmp-button)
    const cta = contentContainer.querySelector('a.cmp-button');
    if (cta) {
      contentParts.push(cta);
    }
  }
  const contentRow = [contentParts.length ? contentParts : ''];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bgRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
