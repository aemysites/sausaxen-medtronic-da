/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Extract background image URL from inline style and encode spaces
  function getBackgroundImageUrl(el) {
    const style = el.getAttribute('style') || '';
    const match = style.match(/background-image\s*:\s*url\(([^)]+)\)/i);
    if (match && match[1]) {
      let url = match[1].trim();
      // Remove any escaped characters
      url = url.replace(/\\2f/g, '/').replace(/\\/g, '');
      // Remove any surrounding quotes
      url = url.replace(/^['"]|['"]$/g, '');
      // Encode spaces as %20
      url = url.replace(/\s/g, '%20');
      return url;
    }
    return null;
  }

  // 1. Header row
  const headerRow = ['Hero (hero14)'];

  // 2. Background image row
  let bgImageUrl = null;
  let bgContainer = null;
  const containers = element.querySelectorAll('[style*="background-image"]');
  if (containers.length > 0) {
    bgContainer = containers[containers.length - 1]; // Use deepest
    bgImageUrl = getBackgroundImageUrl(bgContainer);
  }
  let bgImageCell = '';
  if (bgImageUrl) {
    // Create an image element for the background
    const img = document.createElement('img');
    img.src = bgImageUrl;
    img.alt = '';
    bgImageCell = img;
  }

  // 3. Content row: Title, Subheading, CTA
  let grid = element.querySelector('.aem-Grid.aem-Grid--11') || element.querySelector('.aem-Grid.aem-Grid--12');
  if (!grid) {
    grid = element.querySelector('.aem-Grid');
  }
  let contentParts = [];
  if (grid) {
    const children = Array.from(grid.children);
    children.forEach((child) => {
      if (child.classList.contains('text')) {
        const cmpText = child.querySelector('.cmp-text');
        if (cmpText) {
          contentParts.push(cmpText);
        }
      } else if (child.classList.contains('button')) {
        const btn = child.querySelector('a');
        if (btn) {
          contentParts.push(btn);
        }
      }
    });
  }

  if (contentParts.length === 0) {
    contentParts = Array.from(element.querySelectorAll('.cmp-text, .cmp-button'));
  }

  const rows = [
    headerRow,
    [bgImageCell],
    [contentParts]
  ];

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
