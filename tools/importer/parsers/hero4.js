/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract background image URL from style attribute
  function getBackgroundImageUrl(el) {
    const style = el.getAttribute('style') || '';
    const match = style.match(/background-image\s*:\s*url\(([^)]+)\)/);
    if (match && match[1]) {
      let url = match[1].replace(/\\2f /g, '/').replace(/\\/g, '');
      // Remove any surrounding quotes
      url = url.replace(/^['"]|['"]$/g, '');
      // If relative, prepend origin
      if (url.startsWith('/')) {
        url = window.location.origin + url;
      }
      return url;
    }
    return null;
  }

  // 1. Header row
  const headerRow = ['Hero (hero4)'];

  // 2. Background image row
  let bgImgUrl = null;
  // Try to find the background image from the first cmp-container
  const container = element.querySelector('.cmp-container');
  if (container) {
    bgImgUrl = getBackgroundImageUrl(container);
  }
  let bgImgCell = '';
  if (bgImgUrl) {
    const img = document.createElement('img');
    img.src = bgImgUrl;
    img.alt = '';
    bgImgCell = img;
  }
  const bgImgRow = [bgImgCell];

  // 3. Content row (title, subheading, CTA)
  // Find the inner text containers
  let title = '';
  let subheading = '';
  let cta = '';

  // Find the deepest .aem-Grid (should contain the text)
  const innerGrid = element.querySelector('.aem-Grid.aem-Grid--10');
  if (innerGrid) {
    // Title (h1)
    const h1Div = innerGrid.querySelector('.h1 .cmp-text p');
    if (h1Div) {
      const h1 = document.createElement('h1');
      h1.textContent = h1Div.textContent.trim();
      title = h1;
    }
    // Subheading (intro-heading)
    const introDiv = innerGrid.querySelector('.intro-heading .cmp-text p');
    if (introDiv) {
      const p = document.createElement('p');
      p.textContent = introDiv.textContent.trim();
      subheading = p;
    }
    // CTA: Not present in this HTML, but if there is a button or link, add it
    const ctaLink = innerGrid.querySelector('a');
    if (ctaLink) {
      cta = ctaLink;
    }
  }

  // Compose content cell
  const contentCell = [];
  if (title) contentCell.push(title);
  if (subheading) contentCell.push(subheading);
  if (cta) contentCell.push(cta);
  const contentRow = [contentCell];

  // Build the table
  const cells = [
    headerRow,
    bgImgRow,
    contentRow,
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
