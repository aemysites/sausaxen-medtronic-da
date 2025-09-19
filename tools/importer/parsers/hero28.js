/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract background image URL from inline style
  function extractBackgroundImageUrl(style) {
    if (!style) return null;
    const match = style.match(/background-image:\s*url\(([^)]+)\)/i);
    if (match && match[1]) {
      // Remove any leading \ and decode URI
      let url = match[1].replace(/^\\/g, '').replace(/\\/g, '/');
      // Remove any surrounding quotes
      url = url.replace(/^['"]|['"]$/g, '');
      // If the URL does not start with http, prepend the site root
      if (!/^https?:/.test(url)) {
        url = url.startsWith('/') ? url : '/' + url;
      }
      return url;
    }
    return null;
  }

  // 1. Header row
  const headerRow = ['Hero (hero28)'];

  // 2. Background image row
  let bgImgRow = [''];
  // Find the first element with a background-image style
  let bgImgUrl = null;
  let bgImgElem = null;
  const bgDiv = element.querySelector('[style*="background-image"]');
  if (bgDiv) {
    bgImgUrl = extractBackgroundImageUrl(bgDiv.getAttribute('style'));
    if (bgImgUrl) {
      bgImgElem = document.createElement('img');
      bgImgElem.src = bgImgUrl;
      bgImgElem.alt = '';
      bgImgRow = [bgImgElem];
    }
  }

  // 3. Content row (title, subheading, paragraph, CTA)
  // Find the content container (the one with the text/button)
  let contentContainer = null;
  // Look for the innermost .cmp-container with .title and .text
  const containers = element.querySelectorAll('.cmp-container');
  for (const cont of containers) {
    if (cont.querySelector('.title') && cont.querySelector('.text')) {
      contentContainer = cont;
      break;
    }
  }
  // Defensive fallback: if not found, use the first cmp-container
  if (!contentContainer && containers.length) {
    contentContainer = containers[0];
  }

  // Compose the content cell
  let contentCell = '';
  if (contentContainer) {
    // We'll collect the following: eyebrow (h3), title (h2), paragraph, button
    const contentParts = [];
    // Eyebrow (h3 with link)
    const eyebrow = contentContainer.querySelector('.eyebrow h3, .eyebrow .cmp-title__text');
    if (eyebrow) {
      // If it's a link, keep the link
      contentParts.push(eyebrow.cloneNode(true));
    }
    // Title (h2)
    const title = contentContainer.querySelector('h2.cmp-title__text');
    if (title) {
      contentParts.push(title.cloneNode(true));
    }
    // Paragraph
    const para = contentContainer.querySelector('.cmp-text p');
    if (para) {
      contentParts.push(para.cloneNode(true));
    }
    // Button (CTA)
    const button = contentContainer.querySelector('.cmp-button');
    if (button) {
      // Remove icon span, keep only text and link
      const btn = button.cloneNode(true);
      // Remove icon span if present
      const icon = btn.querySelector('.cmp-button__icon');
      if (icon) icon.remove();
      contentParts.push(btn);
    }
    contentCell = contentParts;
  }

  const tableCells = [
    headerRow,
    bgImgRow,
    [contentCell],
  ];

  const block = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(block);
}
