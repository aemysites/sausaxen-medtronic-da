/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Extract background image URL from inline style
  function getBackgroundImageUrl(el) {
    const style = el.getAttribute('style') || '';
    const match = style.match(/background-image:\s*url\(([^)]+)\)/);
    if (match && match[1]) {
      let url = match[1].replace(/\\2f/g, '/').replace(/\s+/g, '').replace(/(^['"]|['"]$)/g, '');
      url = url.trim();
      // Only return if it looks like a valid path
      if (/^https?:\/\//.test(url) || url.startsWith('/')) {
        return url;
      }
    }
    return null;
  }

  // 1. Header row
  const headerRow = ['Hero (hero19)'];

  // 2. Background image row
  let bgImgUrl = null;
  const bgDiv = element.querySelector('[style*="background-image"]');
  if (bgDiv) {
    bgImgUrl = getBackgroundImageUrl(bgDiv);
  }
  let bgImgEl = null;
  if (bgImgUrl) {
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgImgUrl;
    bgImgEl.alt = '';
  }
  const bgRow = [bgImgEl ? bgImgEl : ''];

  // 3. Content row (eyebrow, title, subheading)
  let contentGrid = null;
  const grids = element.querySelectorAll('.aem-Grid');
  if (grids.length) {
    contentGrid = grids[grids.length - 1];
  }
  if (!contentGrid) contentGrid = element;

  // Extract text blocks
  const textBlocks = contentGrid.querySelectorAll(':scope > div .cmp-text');
  const contentCell = [];
  // Remove empty spans and style title as heading
  textBlocks.forEach((block, i) => {
    Array.from(block.childNodes).forEach(node => {
      if (node.nodeType === 1) {
        // element
        // For the title block, wrap first <p> as heading
        if (i === 1 && node.tagName === 'P') {
          const h = document.createElement('h2');
          h.innerHTML = node.innerHTML;
          contentCell.push(h);
        } else if (node.tagName === 'P' && node.textContent.trim() !== '') {
          contentCell.push(node.cloneNode(true));
        }
      } else if (node.nodeType === 3) {
        // text
        if (node.textContent.trim() !== '') {
          const span = document.createElement('span');
          span.textContent = node.textContent;
          contentCell.push(span);
        }
      }
    });
  });

  const contentRow = [contentCell.length ? contentCell : ''];

  const cells = [
    headerRow,
    bgRow,
    contentRow,
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
