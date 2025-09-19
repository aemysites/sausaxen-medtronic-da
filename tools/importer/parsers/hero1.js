/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract background image URL from inline style
  function extractBackgroundImageUrl(style) {
    if (!style) return null;
    const match = style.match(/background-image:\s*url\(["']?(.*?)["']?\)/i);
    if (match && match[1]) {
      // Unescape any encoded slashes
      return match[1].replace(/\\2f /g, '/').replace(/\\/g, '');
    }
    return null;
  }

  // 1. Header row
  const headerRow = ['Hero (hero1)'];

  // 2. Background image row
  let bgImgUrl = null;
  // Find the first child with a background-image style
  const bgDiv = element.querySelector('[style*="background-image"]');
  if (bgDiv) {
    bgImgUrl = extractBackgroundImageUrl(bgDiv.getAttribute('style'));
  }
  let bgImgEl = null;
  if (bgImgUrl) {
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgImgUrl;
    bgImgEl.alt = '';
  }
  const bgRow = [bgImgEl ? bgImgEl : ''];

  // 3. Content row: Title, Subheading, CTA
  // Find the deepest .cmp-container (the one with the text/button content)
  let contentContainer = null;
  const cmpContainers = element.querySelectorAll('.cmp-container');
  if (cmpContainers.length > 0) {
    contentContainer = cmpContainers[cmpContainers.length - 1];
  }
  // Defensive: fallback to element if not found
  if (!contentContainer) contentContainer = element;

  // Get all direct children of the contentContainer (should be a .aem-Grid)
  let grid = contentContainer.querySelector('.aem-Grid');
  if (!grid) grid = contentContainer;
  // We'll collect the text blocks and button
  let eyebrowEl = null, introEl = null, titleEl = null, ctaEl = null;
  const gridChildren = Array.from(grid.children);
  gridChildren.forEach(child => {
    if (child.classList.contains('eyebrow2')) {
      eyebrowEl = child.querySelector('.cmp-text');
    } else if (child.classList.contains('intro-heading')) {
      introEl = child.querySelector('.cmp-text');
    } else if (child.classList.contains('h1')) {
      titleEl = child.querySelector('.cmp-text');
    } else if (child.classList.contains('button')) {
      ctaEl = child.querySelector('a');
    }
  });

  // Compose content for the content cell, preserving order
  const contentCell = [];
  if (eyebrowEl) contentCell.push(eyebrowEl);
  if (introEl) contentCell.push(introEl);
  if (titleEl) contentCell.push(titleEl);
  if (ctaEl) contentCell.push(ctaEl);

  // If nothing found, fallback to all text content
  if (contentCell.length === 0) {
    contentCell.push(...gridChildren);
  }

  const contentRow = [contentCell];

  // Assemble the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bgRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
