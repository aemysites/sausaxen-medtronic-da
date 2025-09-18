/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid containing the two columns
  const mainGrid = element.querySelector('.aem-Grid.aem-Grid--12.aem-Grid--default--12');
  if (!mainGrid) return;

  // Find the two main column containers: left (text), right (image)
  let leftCol = mainGrid.querySelector('.container.responsivegrid.card-module.text.wide-card');
  let rightCol = mainGrid.querySelector('.image');
  if (!leftCol || !rightCol) return;

  // LEFT COLUMN: Collect all text content in visual order
  const leftGrid = leftCol.querySelector('.aem-Grid');
  let leftContent = [];
  if (leftGrid) {
    // Collect all .cmp-text and .cmp-title elements in order
    const blocks = leftGrid.querySelectorAll('.cmp-text, .cmp-title');
    leftContent = Array.from(blocks);
  } else {
    // Fallback: grab all .cmp-text and .cmp-title
    leftContent = Array.from(leftCol.querySelectorAll('.cmp-text, .cmp-title'));
  }

  // RIGHT COLUMN: Get image element only
  let imageEl = rightCol.querySelector('img');
  let rightContent = [];
  if (imageEl) {
    rightContent.push(imageEl);
  }

  // Build table
  const headerRow = ['Columns (columns3)'];
  const contentRow = [leftContent, rightContent];
  const cells = [headerRow, contentRow];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
