/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get background image URL from inline style
  function getBackgroundImageUrl(style) {
    if (!style) return null;
    const match = style.match(/background-image\s*:\s*url\(['"]?(.*?)['"]?\)/i);
    if (match && match[1]) {
      let url = match[1];
      // Remove escaped unicode for slashes
      url = url.replace(/\\2f\s*/g, '/');
      // Remove any whitespace
      url = url.trim();
      // Remove any leading 'null/'
      url = url.replace(/^null\//, '/');
      // If relative, prepend origin
      if (url.startsWith('/')) {
        url = window.location.origin + url;
      }
      return url;
    }
    return null;
  }

  // Find the innermost cmp-container with the background-image style
  let bgUrl = null;
  let bgContainer = null;
  const containers = element.querySelectorAll('.cmp-container');
  for (const c of containers) {
    const style = c.getAttribute('style');
    if (style && style.includes('background-image')) {
      bgUrl = getBackgroundImageUrl(style);
      bgContainer = c;
      break;
    }
  }

  // Create image element if background image exists
  let bgImgEl = null;
  if (bgUrl) {
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgUrl;
    bgImgEl.alt = '';
    bgImgEl.loading = 'lazy';
  }

  // Find the main content container (the innermost cmp-container)
  let contentContainer = null;
  if (bgContainer) {
    // Look for the next cmp-container inside bgContainer
    const innerContainer = bgContainer.querySelector('.cmp-container');
    contentContainer = innerContainer || bgContainer;
  } else {
    // Fallback: use the first cmp-container
    contentContainer = containers[0] || element;
  }

  // Extract text elements: eyebrow, heading, CTA
  let eyebrow = null;
  let heading = null;
  let cta = null;
  const grid = contentContainer.querySelector('.aem-Grid');
  if (grid) {
    // Eyebrow
    const eyebrowDiv = grid.querySelector('.eyebrow2 .cmp-text');
    if (eyebrowDiv) {
      eyebrow = eyebrowDiv;
    }
    // Heading
    const headingDiv = grid.querySelector('.h1 .cmp-text');
    if (headingDiv) {
      heading = headingDiv;
    }
    // CTA
    const ctaDiv = grid.querySelector('.button .cmp-button');
    if (ctaDiv) {
      cta = ctaDiv;
    }
  }

  // Compose content cell for row 3
  const contentCell = [];
  if (eyebrow) contentCell.push(eyebrow);
  if (heading) contentCell.push(heading);
  if (cta) contentCell.push(cta);

  // Table rows
  const headerRow = ['Hero (hero14)'];
  const imageRow = [bgImgEl ? bgImgEl : ''];
  const contentRow = [contentCell.length ? contentCell : ''];

  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
