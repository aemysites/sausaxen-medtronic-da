/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract background image from style attribute
  function extractBackgroundImage(el) {
    let url = '';
    if (el && el.hasAttribute('style')) {
      const style = el.getAttribute('style');
      const match = style.match(/background-image\s*:\s*url\(([^)]+)\)/);
      if (match && match[1]) {
        url = match[1]
          .replace(/\\2f/g, '/') // Replace \2f with /
          .replace(/\s/g, '');
        // Remove any surrounding quotes
        url = url.replace(/^['"]|['"]$/g, '');
        // If relative, prepend origin
        if (url.startsWith('/')) {
          url = document.location.origin + url;
        }
      }
    }
    return url;
  }

  // Find the background image from the first .cmp-container with style
  const bgContainer = element.querySelector('.cmp-container[style]');
  const bgUrl = extractBackgroundImage(bgContainer);

  let bgImgEl = null;
  if (bgUrl) {
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgUrl;
    bgImgEl.alt = '';
    bgImgEl.loading = 'lazy';
    bgImgEl.style.maxWidth = '100%';
  }

  // Find the main content container (deepest .cmp-container)
  const contentContainer = element.querySelector('.cmp-container:not([style])');
  let contentGrid = contentContainer;
  if (!contentGrid) {
    contentGrid = element;
  }

  // Find all text blocks and button
  const texts = Array.from(contentGrid.querySelectorAll('.cmp-text'));
  const buttonEl = contentGrid.querySelector('.cmp-button');

  // Compose content cell
  const contentCell = [];
  texts.forEach((txt) => {
    if (txt && txt.textContent.trim()) {
      contentCell.push(txt);
    }
  });
  if (buttonEl) {
    contentCell.push(buttonEl);
  }

  // Table structure
  const headerRow = ['Hero (hero2)'];
  const imageRow = [bgImgEl ? bgImgEl : ''];
  const contentRow = [contentCell.length ? contentCell : ''];

  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
