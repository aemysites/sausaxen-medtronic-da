/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract background image URL from inline style
  function getBackgroundImageUrl(style) {
    const match = /background-image\s*:\s*url\(([^)]+)\)/.exec(style);
    if (match && match[1]) {
      // Remove any escaped chars and leading/trailing quotes
      return match[1].replace(/\\/g, '').replace(/^['"]|['"]$/g, '');
    }
    return null;
  }

  // 1. Header row
  const headerRow = ['Hero (hero28)'];

  // 2. Background image row
  let bgImgRow = [''];
  // Find the div with background-image style
  const bgDiv = element.querySelector('[style*="background-image"]');
  if (bgDiv) {
    const bgUrl = getBackgroundImageUrl(bgDiv.getAttribute('style') || '');
    if (bgUrl) {
      // Create an img element for the background image
      const img = document.createElement('img');
      img.src = bgUrl;
      img.alt = '';
      bgImgRow = [img];
    }
  }

  // 3. Content row (title, subheading, paragraph, CTA)
  let contentRow = [''];
  // Find the main content container (the one with the text/button)
  const contentDiv = element.querySelector('.circle-content');
  if (contentDiv) {
    // We'll collect the following:
    // - Eyebrow (h3 with link)
    // - Title (h2)
    // - Paragraph (p)
    // - Button (a.cmp-button)
    const parts = [];
    // Eyebrow
    const eyebrow = contentDiv.querySelector('.eyebrow h3, .eyebrow .cmp-title__text');
    if (eyebrow) {
      parts.push(eyebrow);
    }
    // Title
    const title = contentDiv.querySelector('.avenir-regular h2, .avenir-regular .cmp-title__text');
    if (title) {
      parts.push(title);
    }
    // Paragraph
    const para = contentDiv.querySelector('.cmp-text p');
    if (para) {
      parts.push(para);
    }
    // Button
    const btn = contentDiv.querySelector('.cmp-button');
    if (btn) {
      parts.push(btn);
    }
    if (parts.length) {
      contentRow = [parts];
    }
  }

  // Compose table
  const cells = [
    headerRow,
    bgImgRow,
    contentRow,
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
