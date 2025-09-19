/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get immediate children of a given element
  function getImmediateChildrenByClass(parent, className) {
    return Array.from(parent.children).filter(child => child.classList.contains(className));
  }

  // 1. Header row
  const headerRow = ['Columns block (columns7)'];

  // 2. Find the two main columns
  // The source HTML has a grid with two main columns: one for the image, one for the content
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Left column: image
  let leftCol = null;
  let rightCol = null;
  const gridChildren = Array.from(grid.children);
  // Find image and card-module columns
  gridChildren.forEach(child => {
    if (child.classList.contains('image')) {
      leftCol = child;
    } else if (child.classList.contains('card-module')) {
      rightCol = child;
    }
  });

  // Defensive: if missing columns, abort
  if (!leftCol || !rightCol) return;

  // Get the image element (use existing img)
  const cmpImage = leftCol.querySelector('.cmp-image');
  let imgEl = null;
  if (cmpImage) {
    imgEl = cmpImage.querySelector('img');
  }

  // Right column: text content
  // The right column contains a grid of text blocks
  const rightGrid = rightCol.querySelector('.aem-Grid');
  let rightContentEls = [];
  if (rightGrid) {
    // Get all non-empty content blocks (text, title)
    Array.from(rightGrid.children).forEach(child => {
      // Only add if it contains a cmp-text or cmp-title
      const cmpText = child.querySelector('.cmp-text');
      const cmpTitle = child.querySelector('.cmp-title');
      if (cmpText) {
        rightContentEls.push(cmpText);
      }
      if (cmpTitle) {
        rightContentEls.push(cmpTitle);
      }
    });
  }

  // Also add the summary text (the second cmp-text)
  // (already handled above)

  // Compose the right column cell
  // Combine all rightContentEls into one cell
  const rightColCell = rightContentEls;

  // Compose the table
  const cells = [
    headerRow,
    [imgEl, rightColCell], // 2 columns: image, content
  ];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
