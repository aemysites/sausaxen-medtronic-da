/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract background image URL from inline style
  function getBackgroundImageUrl(style) {
    if (!style) return null;
    const match = style.match(/background-image\s*:\s*url\(([^)]+)\)/);
    if (match && match[1]) {
      let url = match[1].replace(/\\2f /g, '/').replace(/\\/g, '');
      url = url.replace(/^['"]|['"]$/g, ''); // Remove quotes
      return url;
    }
    return null;
  }

  // Find the background image from the most outer container with inline style
  const outerContainer = element.querySelector('[style*="background-image"]');
  let bgImgUrl = null;
  if (outerContainer) {
    bgImgUrl = getBackgroundImageUrl(outerContainer.getAttribute('style'));
  }

  // Create image element if background image exists
  let bgImgEl = null;
  if (bgImgUrl) {
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgImgUrl;
    bgImgEl.alt = '';
    bgImgEl.loading = 'lazy';
  }

  // Extract text content blocks
  // Find the innermost .aem-Grid with text/title children
  const textGrid = element.querySelector('.aem-Grid.aem-Grid--11');
  let contentEls = [];
  if (textGrid) {
    // Get all direct children that are text/title blocks
    const children = Array.from(textGrid.children);
    children.forEach((child) => {
      // Only include text/title containers
      if (
        child.classList.contains('text') ||
        child.classList.contains('title')
      ) {
        // The actual content is the first child (cmp-text or cmp-title)
        const content = child.firstElementChild;
        if (content) {
          contentEls.push(content);
        }
      }
    });
  }

  // Compose table rows
  const headerRow = ['Hero (hero19)'];
  const imageRow = [bgImgEl ? bgImgEl : ''];
  const contentRow = [contentEls.length ? contentEls : ''];

  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
