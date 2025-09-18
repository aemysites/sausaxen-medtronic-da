/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name in the header row
  const headerRow = ['Hero (hero27)'];

  // Find the largest containing div (hero container)
  let heroContainer = element.closest('div');
  if (!heroContainer) heroContainer = element;

  // Find a background image (img not inside carousel controls)
  let imageCell = '';
  const imgs = heroContainer.querySelectorAll('img');
  for (const img of imgs) {
    if (!img.closest('.cmp-carousel__actions')) {
      imageCell = document.createElement('img');
      imageCell.src = img.src;
      break;
    }
  }

  // Extract all visible text content from ALL descendants (not inside carousel controls)
  // Use less specific selector to include all text blocks
  let contentCell = '';
  let contentBlock = document.createElement('div');
  heroContainer.querySelectorAll('*:not(.cmp-carousel__actions *)').forEach(el => {
    // Only include elements with visible text and not images or carousel controls
    if (
      el.nodeType === 1 &&
      !el.closest('.cmp-carousel__actions') &&
      el !== imageCell &&
      el.textContent && el.textContent.trim() &&
      !el.matches('img')
    ) {
      contentBlock.appendChild(el.cloneNode(true));
    }
  });
  if (contentBlock.childNodes.length) {
    contentCell = contentBlock;
  }

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    [imageCell],
    [contentCell],
  ], document);
  element.replaceWith(table);
}
