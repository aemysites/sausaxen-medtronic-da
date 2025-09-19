/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid that splits into two columns visually
  const mainGrid = element.querySelector('.aem-Grid.aem-Grid--12, .aem-Grid.aem-Grid--tablet--12');
  if (!mainGrid) return;

  // Find the left (text) and right (image) column containers
  let leftCol = mainGrid.querySelector('.container.text.wide-card');
  let rightCol = mainGrid.querySelector('.image');
  if (!leftCol || !rightCol) return;

  // LEFT COLUMN: Gather all relevant text content in order
  const leftInnerGrid = leftCol.querySelector('.aem-Grid');
  let leftContent = [];
  if (leftInnerGrid) {
    // Collect all .cmp-text and .cmp-title blocks in order
    const blocks = leftInnerGrid.querySelectorAll('.cmp-text, .cmp-title');
    blocks.forEach(block => leftContent.push(block));
  }

  // RIGHT COLUMN: Find the image element
  let rightContent = [];
  const imageCmp = rightCol.querySelector('.cmp-image');
  if (imageCmp) {
    const img = imageCmp.querySelector('img');
    if (img) rightContent.push(img);
  }

  // Table structure: header row, then one row with two columns
  const headerRow = ['Columns (columns3)'];
  const contentRow = [leftContent, rightContent];
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(table);
}
