/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get background image from inline style
  function getBackgroundImageUrl(el) {
    const style = el.getAttribute('style') || '';
    const match = style.match(/background-image\s*:\s*url\(([^)]+)\)/i);
    if (match && match[1]) {
      // Remove any escaped characters
      let url = match[1].replace(/\\/g, '');
      // Remove surrounding quotes if present
      url = url.replace(/^['"]|['"]$/g, '');
      // If relative, prepend domain
      if (url.startsWith('/')) {
        url = `https://www.medtronic.com${url}`;
      }
      return url;
    }
    return null;
  }

  // Find the main container with background image
  const bgContainer = element.querySelector(':scope > div');
  const bgImageUrl = bgContainer ? getBackgroundImageUrl(bgContainer) : null;

  // Compose background image element if present
  let bgImageEl = null;
  if (bgImageUrl) {
    bgImageEl = document.createElement('img');
    bgImageEl.src = bgImageUrl;
    bgImageEl.alt = '';
    bgImageEl.setAttribute('loading', 'eager');
    bgImageEl.style.width = '100%';
    bgImageEl.style.height = 'auto';
  }

  // Find the content area (the circle-content container)
  let contentContainer = null;
  const grid = bgContainer ? bgContainer.querySelector('.aem-Grid') : null;
  if (grid) {
    contentContainer = grid.querySelector('.circle-content');
  }

  // Defensive: If not found, fallback to first .cmp-container inside
  if (!contentContainer && bgContainer) {
    contentContainer = bgContainer.querySelector('.cmp-container');
  }

  // Extract content elements
  let eyebrowImg = null, eyebrowText = null, title = null, description = null, cta = null;
  if (contentContainer) {
    // Eyebrow image (decorative bar)
    const imgWrap = contentContainer.querySelector('.image .cmp-image img');
    if (imgWrap) {
      eyebrowImg = imgWrap;
    }
    // Eyebrow text
    const eyebrowDiv = contentContainer.querySelector('.text.eyebrow2 .cmp-text p');
    if (eyebrowDiv && eyebrowDiv.textContent.trim()) {
      eyebrowText = eyebrowDiv;
    }
    // Title
    const titleDiv = contentContainer.querySelector('.title .cmp-title h2');
    if (titleDiv) {
      title = titleDiv;
    }
    // Description
    const descDiv = contentContainer.querySelector('.text.no-bottom-margin-p .cmp-text p');
    if (descDiv) {
      description = descDiv;
    }
    // CTA button
    const ctaLink = contentContainer.querySelector('.button a.cmp-button');
    if (ctaLink) {
      cta = ctaLink;
    }
  }

  // Compose content cell for row 3
  const contentCell = [];
  if (eyebrowImg) contentCell.push(eyebrowImg);
  if (eyebrowText) contentCell.push(eyebrowText);
  if (title) contentCell.push(title);
  if (description) contentCell.push(description);
  if (cta) contentCell.push(cta);

  // Compose the table rows
  const headerRow = ['Hero (hero26)'];
  const bgRow = [bgImageEl ? bgImageEl : ''];
  const contentRow = [contentCell.length ? contentCell : ''];

  // Create the block table
  const cells = [headerRow, bgRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
