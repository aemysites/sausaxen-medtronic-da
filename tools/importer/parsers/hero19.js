/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract background image URL from inline style
  function getBgImageUrl(style) {
    if (!style) return null;
    const match = style.match(/background-image:\s*url\(([^)]+)\)/i);
    if (match && match[1]) {
      let url = match[1].replace(/\\2f /g, '/').replace(/\\/g, '');
      url = url.replace(/^['"]|['"]$/g, ''); // Remove surrounding quotes
      return url;
    }
    return null;
  }

  // 1. Header row
  const headerRow = ['Hero (hero19)'];

  // 2. Background image row
  let bgUrl = null;
  let bgImgEl = null;
  // Find the first element with a background-image style
  const containers = element.querySelectorAll('[style]');
  for (const c of containers) {
    const url = getBgImageUrl(c.getAttribute('style'));
    if (url) {
      bgUrl = url;
      break;
    }
  }
  if (bgUrl) {
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgUrl;
    bgImgEl.alt = '';
  }
  const bgRow = [bgImgEl ? bgImgEl : ''];

  // 3. Content row
  // Collect all relevant text elements in visual order
  let contentEls = [];
  // Instead of targeting only .aem-Grid--11, grab all .cmp-text and .cmp-title inside the main grid
  const mainGrid = element.querySelector('.aem-Grid');
  if (mainGrid) {
    // Get all .cmp-text and .cmp-title blocks in order
    const blocks = mainGrid.querySelectorAll('.cmp-text, .cmp-title');
    blocks.forEach(block => {
      // For .cmp-title, use the heading element
      if (block.classList.contains('cmp-title')) {
        const heading = block.querySelector('h1, h2, h3, h4, h5, h6');
        if (heading) contentEls.push(heading.cloneNode(true));
      } else {
        // For .cmp-text, include all children (usually <p>)
        Array.from(block.childNodes).forEach(child => {
          // Only add elements with text content
          if (child.nodeType === 1 && child.textContent.trim()) {
            contentEls.push(child.cloneNode(true));
          }
        });
      }
    });
  }
  const contentRow = [contentEls.length ? contentEls : ''];

  // Compose table
  const rows = [headerRow, bgRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
