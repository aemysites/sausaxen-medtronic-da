/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Find background image from inline style
  function extractBgImageUrl(style) {
    if (!style) return null;
    const match = style.match(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/i);
    if (match && match[1]) {
      // Unescape any encoded slashes (\2f)
      return match[1].replace(/\\2f /g, '/').replace(/\\2f/g, '/');
    }
    return null;
  }

  // 1. Header row
  const headerRow = ['Hero (hero14)'];

  // 2. Background image row
  let bgImgRow = [''];
  // Find the container with the background image style
  const bgContainer = element.querySelector('[style*="background-image"]');
  let bgImgUrl = null;
  if (bgContainer) {
    bgImgUrl = extractBgImageUrl(bgContainer.getAttribute('style'));
  }
  if (bgImgUrl) {
    // Create an <img> element for the background image
    const img = document.createElement('img');
    img.src = bgImgUrl;
    bgImgRow = [img];
  }

  // 3. Content row (title, subheading, cta)
  // Find the deepest .aem-Grid inside the block (contains text/button)
  let contentGrid = null;
  const grids = element.querySelectorAll('.aem-Grid');
  if (grids.length) {
    // Use the deepest grid (last one)
    contentGrid = grids[grids.length - 1];
  }

  // Collect content: eyebrow, heading, cta
  let contentFragments = [];
  if (contentGrid) {
    // Eyebrow (optional)
    const eyebrow = contentGrid.querySelector('.eyebrow2 .cmp-text');
    if (eyebrow) {
      contentFragments.push(eyebrow);
    }
    // Heading (optional)
    const heading = contentGrid.querySelector('.h1 .cmp-text');
    if (heading) {
      // Convert <p> to <h1> for semantic heading if needed
      const p = heading.querySelector('p');
      if (p) {
        const h1 = document.createElement('h1');
        h1.innerHTML = p.innerHTML;
        contentFragments.push(h1);
      } else {
        contentFragments.push(heading);
      }
    }
    // CTA (optional)
    const ctaBtn = contentGrid.querySelector('.button a');
    if (ctaBtn) {
      contentFragments.push(ctaBtn);
    }
  }
  // Defensive fallback: if nothing found, use the whole contentGrid
  if (contentFragments.length === 0 && contentGrid) {
    contentFragments = [contentGrid];
  }
  const contentRow = [contentFragments];

  // Build table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bgImgRow,
    contentRow,
  ], document);

  // Replace original element
  element.replaceWith(table);
}
