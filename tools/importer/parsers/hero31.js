/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Extract background image URL from inline style
  function getBackgroundImageUrl(el) {
    const style = el.getAttribute('style') || '';
    const match = style.match(/background-image:\s*url\(([^)]+)\)/);
    if (match && match[1]) {
      let url = match[1].replace(/^['"]|['"]$/g, ''); // Remove quotes
      url = url.replace(/\\([0-9a-fA-F]{2})/g, (m, hex) => {
        const char = String.fromCharCode(parseInt(hex, 16));
        return char === '/' ? '/' : m;
      });
      url = url.replace(/\s+/g, '');
      if (url && !/^https?:\//.test(url)) {
        const a = document.createElement('a');
        a.href = url;
        url = a.href;
      }
      return url;
    }
    return null;
  }

  // Find the deepest container with a background image
  let bgContainer = element.querySelector('[style*="background-image"]');
  let bgUrl = bgContainer ? getBackgroundImageUrl(bgContainer) : null;

  // Create background image element if URL found
  let bgImageEl = null;
  if (bgUrl) {
    bgImageEl = document.createElement('img');
    bgImageEl.src = bgUrl;
    bgImageEl.alt = '';
    bgImageEl.setAttribute('loading', 'lazy');
  }

  // Find content container (where text/button lives)
  let contentContainer = element.querySelector('.cmp-container[data-hlx-imp-bgcolor]') || element;

  // Extract all text and button elements inside contentContainer
  const contentCell = [];
  // Get all text blocks (including eyebrow, title, paragraphs)
  contentContainer.querySelectorAll('.cmp-text').forEach((textBlock) => {
    Array.from(textBlock.childNodes).forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
        // Only push non-empty text nodes
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '') return;
        contentCell.push(node.cloneNode(true));
      }
    });
  });
  // Get button (if any)
  const buttonDiv = contentContainer.querySelector('.button a');
  if (buttonDiv) contentCell.push(buttonDiv.cloneNode(true));

  // Build table rows
  const headerRow = ['Hero (hero31)'];
  const bgRow = [bgImageEl ? bgImageEl : ''];
  const contentRow = [contentCell.length ? contentCell : ''];

  const cells = [headerRow, bgRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
