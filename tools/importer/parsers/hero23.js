/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get background image URL from style attribute
  function getBackgroundImageUrl(style) {
    if (!style) return null;
    const match = style.match(/background-image:\s*url\(([^)]+)\)/i);
    if (match && match[1]) {
      let url = match[1].replace(/\\2f /g, '/').replace(/\\/g, '');
      // Remove any surrounding quotes
      url = url.replace(/^['"]|['"]$/g, '');
      // Remove leading spaces
      url = url.trim();
      // If relative, prepend origin
      if (url.startsWith('/')) {
        url = window.location.origin + url;
      }
      return url;
    }
    return null;
  }

  // 1. Header row
  const headerRow = ['Hero (hero23)'];

  // 2. Background image row
  // Find the first container with a background-image style
  let bgImageUrl = null;
  let bgContainer = null;
  const containers = element.querySelectorAll('[style*="background-image"]');
  if (containers.length > 0) {
    bgContainer = containers[0];
    bgImageUrl = getBackgroundImageUrl(bgContainer.getAttribute('style'));
  }
  let bgImgEl = null;
  if (bgImageUrl) {
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgImageUrl;
    bgImgEl.alt = '';
    bgImgEl.loading = 'lazy';
  }
  const bgRow = [bgImgEl ? bgImgEl : ''];

  // 3. Content row: Title, Subheading, CTA
  // Find text blocks
  let titleEls = [];
  let subheadingEls = [];
  let eyebrowEls = [];
  let ctaEl = null;

  // Find the main grid
  const mainGrid = element.querySelector('.aem-Grid.aem-Grid--11');
  if (mainGrid) {
    // Eyebrow
    const eyebrow = mainGrid.querySelector('.eyebrow2 .cmp-text');
    if (eyebrow) {
      eyebrowEls = Array.from(eyebrow.childNodes);
    }
    // Title (large text)
    const h1Block = mainGrid.querySelector('.h1 .cmp-text');
    if (h1Block) {
      titleEls = Array.from(h1Block.childNodes);
    }
    // Subheading (intro-heading)
    const introHeading = mainGrid.querySelector('.intro-heading .cmp-title');
    if (introHeading) {
      const h1 = introHeading.querySelector('h1');
      if (h1) {
        subheadingEls = [h1];
      }
    }
    // CTA button
    const buttonBlock = mainGrid.querySelector('.button .cmp-button');
    if (buttonBlock) {
      ctaEl = buttonBlock;
    }
  }

  // Compose content row
  const contentRowElements = [];
  if (eyebrowEls.length) {
    contentRowElements.push(...eyebrowEls);
  }
  if (titleEls.length) {
    contentRowElements.push(...titleEls);
  }
  if (subheadingEls.length) {
    contentRowElements.push(...subheadingEls);
  }
  if (ctaEl) {
    contentRowElements.push(ctaEl);
  }
  const contentRow = [contentRowElements.length ? contentRowElements : ''];

  // Build the table
  const cells = [
    headerRow,
    bgRow,
    contentRow,
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
