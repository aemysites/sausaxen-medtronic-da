/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get background image URL from inline style
  function extractBgUrl(style) {
    if (!style) return null;
    const match = style.match(/background-image\s*:\s*url\(([^)]+)\)/i);
    if (match && match[1]) {
      let url = match[1]
        .replace(/\\2f/g, '/') // decode \2f to /
        .replace(/\s/g, '') // remove spaces
        .replace(/'/g, '') // remove single quotes
        .replace(/"/g, ''); // remove double quotes
      // Remove any leading slash if present after decoding
      if (url.startsWith('/')) {
        url = url;
      }
      // If relative, prepend origin
      if (typeof window !== 'undefined' && url && url.startsWith('/')) {
        url = window.location.origin + url;
      }
      return url;
    }
    return null;
  }

  // 1. Header row
  const headerRow = ['Hero (hero14)'];

  // 2. Background image row
  let bgImgCell = '';
  let bgContainer = element.querySelector('[style*="background-image"]');
  if (bgContainer) {
    const bgUrl = extractBgUrl(bgContainer.getAttribute('style'));
    if (bgUrl) {
      const img = document.createElement('img');
      img.src = bgUrl;
      img.alt = '';
      bgImgCell = img;
    }
  }

  // 3. Content row (title, subheading, CTA)
  let contentCell = [];
  let contentContainer = element.querySelector('.cmp-container .aem-Grid');
  if (!contentContainer) {
    const cmpContainers = element.querySelectorAll('.cmp-container');
    for (const cmp of cmpContainers) {
      const grid = cmp.querySelector('.aem-Grid');
      if (grid) {
        contentContainer = grid;
        break;
      }
    }
  }
  if (contentContainer) {
    // Collect all cmp-text and button elements as nodes
    const textBlocks = contentContainer.querySelectorAll('.cmp-text');
    textBlocks.forEach((tb) => {
      // Use the children of cmp-text to avoid nested divs
      Array.from(tb.childNodes).forEach((node) => {
        contentCell.push(node.cloneNode(true));
      });
    });
    const btn = contentContainer.querySelector('a.cmp-button');
    if (btn) {
      contentCell.push(btn.cloneNode(true));
    }
  }

  // Table rows
  const rows = [
    headerRow,
    [bgImgCell],
    [contentCell]
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(block);
}
