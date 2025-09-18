/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract background image from inline style
  function getBackgroundImageUrl(style) {
    if (!style) return null;
    const match = style.match(/background-image:\s*url\(([^)]+)\)/i);
    if (match && match[1]) {
      let url = match[1].replace(/\\2f /g, '/').replace(/\\/g, '');
      // Remove any surrounding quotes
      url = url.replace(/^['"]|['"]$/g, '');
      // If relative, prepend origin
      if (url.startsWith('/')) {
        url = window.location.origin + url;
      }
      return url;
    }
    return null;
  }

  // 1. Header row
  const headerRow = ['Hero (hero19)'];

  // 2. Background image row
  let bgImageUrl = null;
  // Find the deepest container with a background-image style
  const containers = element.querySelectorAll('[style*="background-image"]');
  for (const c of containers) {
    const url = getBackgroundImageUrl(c.getAttribute('style'));
    if (url) {
      bgImageUrl = url;
      break;
    }
  }
  let bgImageCell = '';
  if (bgImageUrl) {
    const img = document.createElement('img');
    img.src = bgImageUrl;
    img.alt = '';
    bgImageCell = img;
  }

  // 3. Content row (title, subheading, etc.)
  // Gather the text blocks in order
  // - Eyebrow: .eyebrow2 .cmp-text p
  // - Headline: .h1 .cmp-text p
  // - Title: .intro-heading .cmp-title h1
  const contentElements = [];

  // Eyebrow
  const eyebrow = element.querySelector('.eyebrow2 .cmp-text p');
  if (eyebrow) {
    contentElements.push(eyebrow);
  }
  // Headline
  const headline = element.querySelector('.h1 .cmp-text p');
  if (headline) {
    contentElements.push(headline);
  }
  // Title (main heading)
  const title = element.querySelector('.intro-heading .cmp-title h1');
  if (title) {
    contentElements.push(title);
  }

  // Compose content cell
  let contentCell = '';
  if (contentElements.length) {
    contentCell = contentElements;
  }

  // Compose table rows
  const rows = [
    headerRow,
    [bgImageCell],
    [contentCell]
  ];

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(block);
}
