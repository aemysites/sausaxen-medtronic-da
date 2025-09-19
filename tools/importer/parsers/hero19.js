/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get background image from inline style
  function getBackgroundImageUrl(style) {
    if (!style) return null;
    const match = style.match(/background-image\s*:\s*url\(([^)]+)\)/i);
    if (match && match[1]) {
      let url = match[1].replace(/\\2f /g, '/').replace(/\\/g, '');
      // Remove any surrounding quotes
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
  // Find the first container with a background-image style
  const bgContainer = element.querySelector('[style*="background-image"]');
  if (bgContainer) {
    bgImgUrl = getBackgroundImageUrl(bgContainer.getAttribute('style'));
    if (bgImgUrl) {
      bgImgEl = document.createElement('img');
      bgImgEl.src = bgImgUrl;
      bgImgEl.setAttribute('loading', 'lazy');
      bgImgEl.alt = '';
    }
  }
  const bgImgRow = [bgImgEl ? bgImgEl : ''];

  // 3. Content row (title, subheading, etc)
  // Defensive: Find all text blocks in the deepest grid
  let contentRow = [''];
  const innerGrid = element.querySelector('.aem-Grid.aem-Grid--11');
  if (innerGrid) {
    // Get all direct children divs (text/title blocks)
    const blocks = Array.from(innerGrid.children);
    const contentEls = [];
    blocks.forEach((block) => {
      // Find the actual content container inside each block
      const content = block.querySelector('.cmp-text, .cmp-title');
      if (content) {
        // For title, use heading element directly
        const heading = content.querySelector('h1, h2, h3, h4, h5, h6');
        if (heading) {
          contentEls.push(heading);
        } else {
          // For text, use all paragraphs
          const paragraphs = content.querySelectorAll('p');
          paragraphs.forEach((p) => contentEls.push(p));
        }
      }
    });
    if (contentEls.length > 0) {
      contentRow = [contentEls];
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
