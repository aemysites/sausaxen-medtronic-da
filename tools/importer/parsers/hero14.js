/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Extract background image URL from inline style
  function getBgImageUrl(el) {
    const style = el.getAttribute('style') || '';
    const match = style.match(/background-image:\s*url\(['"]?(.*?)['"]?\)/);
    if (match && match[1]) {
      // Remove any escaped characters
      return match[1].replace(/\\/g, '');
    }
    return null;
  }

  // Find the main container with background image
  const bgContainer = element.querySelector('[style*="background-image"]');
  let bgImgUrl = null;
  if (bgContainer) {
    bgImgUrl = getBgImageUrl(bgContainer);
  }

  // Create image element if background image exists
  let bgImgEl = null;
  if (bgImgUrl) {
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgImgUrl;
    bgImgEl.alt = '';
  }

  // Find text content and CTA
  // Defensive: get all direct descendants of the deepest grid
  let contentContainer = null;
  const gridContainers = element.querySelectorAll('.aem-Grid');
  if (gridContainers.length) {
    // Use the deepest grid
    contentContainer = gridContainers[gridContainers.length - 1];
  }

  // Collect text blocks (eyebrow, heading, etc.) and button
  let textEls = [];
  let buttonEl = null;
  if (contentContainer) {
    const children = Array.from(contentContainer.children);
    children.forEach((child) => {
      if (child.classList.contains('text')) {
        // Find the actual text content div
        const cmpText = child.querySelector('.cmp-text');
        if (cmpText) textEls.push(cmpText);
      } else if (child.classList.contains('button')) {
        // Find the button link
        const btn = child.querySelector('a');
        if (btn) buttonEl = btn;
      }
    });
  }

  // Compose content cell: text blocks + button (if present)
  const contentCell = [];
  if (textEls.length) {
    contentCell.push(...textEls);
  }
  if (buttonEl) {
    contentCell.push(buttonEl);
  }

  // Table rows
  const headerRow = ['Hero (hero14)'];
  const bgImgRow = [bgImgEl ? bgImgEl : ''];
  const contentRow = [contentCell.length ? contentCell : ''];

  const cells = [headerRow, bgImgRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(block);
}
