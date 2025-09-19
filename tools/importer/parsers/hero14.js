/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract background image from style attribute
  function getBackgroundImageUrl(style) {
    if (!style) return null;
    const match = style.match(/background-image:\s*url\(([^)]+)\)/i);
    if (match && match[1]) {
      let url = match[1].replace(/^['"]|['"]$/g, '');
      // Remove any escaped characters
      url = url.replace(/\\/g, '');
      // If relative, prepend origin
      if (url.startsWith('/')) {
        url = window.location.origin + url;
      }
      return url;
    }
    return null;
  }

  // 1. Header row
  const headerRow = ['Hero (hero14)'];

  // 2. Background image row
  let bgImageRow = [''];
  // Find the first container with a background image
  const bgContainer = element.querySelector('[style*="background-image"]');
  if (bgContainer) {
    const bgUrl = getBackgroundImageUrl(bgContainer.getAttribute('style'));
    if (bgUrl) {
      // Create image element
      const img = document.createElement('img');
      img.src = bgUrl;
      img.alt = '';
      bgImageRow = [img];
    }
  }

  // 3. Content row: Title, Subheading, CTA
  // Find the deepest grid (contains text/button)
  let contentRow = [''];
  const innerGrid = element.querySelector('.aem-Grid.aem-Grid--11');
  if (innerGrid) {
    // Get all direct children (text and button blocks)
    const children = Array.from(innerGrid.children);
    const contentElements = [];
    children.forEach((child) => {
      // Text blocks
      if (child.classList.contains('text')) {
        const cmpText = child.querySelector('.cmp-text');
        if (cmpText) {
          // Use the <p> directly
          const p = cmpText.querySelector('p');
          if (p) contentElements.push(p);
        }
      }
      // Button blocks
      if (child.classList.contains('button')) {
        const btn = child.querySelector('a');
        if (btn) contentElements.push(btn);
      }
    });
    // If we found content, use it
    if (contentElements.length) {
      contentRow = [contentElements];
    }
  }

  // Compose table
  const cells = [
    headerRow,
    bgImageRow,
    contentRow,
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
