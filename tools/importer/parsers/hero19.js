/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract background image URL from inline style
  function extractBackgroundImageUrl(style) {
    if (!style) return null;
    const match = style.match(/background-image\s*:\s*url\(([^)]+)\)/);
    if (match && match[1]) {
      let url = match[1].replace(/\\2f /g, '/').replace(/\\/g, '');
      url = url.replace(/^['"]|['"]$/g, '');
      return url;
    }
    return null;
  }

  // 1. Header row
  const headerRow = ['Hero (hero19)'];

  // 2. Background image row
  let bgImgUrl = null;
  let bgImgEl = null;
  const bgContainer = element.querySelector('[style*="background-image"]');
  if (bgContainer) {
    bgImgUrl = extractBackgroundImageUrl(bgContainer.getAttribute('style'));
    if (bgImgUrl) {
      bgImgEl = document.createElement('img');
      bgImgEl.src = bgImgUrl;
      bgImgEl.alt = '';
      bgImgEl.style.display = 'none'; // Hide for import, used for asset reference
    }
  }
  const bgRow = [bgImgEl ? bgImgEl : ''];

  // 3. Content row: Collect all visible text blocks in order
  const contentCell = [];
  // Use a less specific selector to get all text/title blocks
  const textBlocks = element.querySelectorAll('.cmp-text, .cmp-title');
  textBlocks.forEach((block) => {
    // If it's a .cmp-title, preserve heading tag
    if (block.classList.contains('cmp-title')) {
      const h1 = block.querySelector('h1');
      if (h1) {
        contentCell.push(h1.cloneNode(true));
      }
    }
    // For .cmp-text, add all paragraphs
    block.querySelectorAll('p').forEach((p) => {
      contentCell.push(p.cloneNode(true));
    });
  });
  const contentRow = [contentCell.length ? contentCell : ''];

  // Compose table
  const cells = [
    headerRow,
    bgRow,
    contentRow,
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
