/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children by class
  function getDirectChildByClass(parent, className) {
    return Array.from(parent.children).find((el) => el.classList.contains(className));
  }

  // Find the main grid containing the image and the text card
  const mainGrid = element.querySelector('.aem-Grid.aem-Grid--8');
  if (!mainGrid) return;

  // Get the two main columns: image and content
  const imageCol = getDirectChildByClass(mainGrid, 'image');
  const textCol = getDirectChildByClass(mainGrid, 'container');

  // Defensive: ensure both columns exist
  if (!imageCol || !textCol) return;

  // Get the image element
  let imgEl = null;
  const cmpImage = imageCol.querySelector('.cmp-image');
  if (cmpImage) {
    imgEl = cmpImage.querySelector('img');
  }

  // Get the content column's inner grid
  const textInnerGrid = textCol.querySelector('.aem-Grid');
  if (!textInnerGrid) return;

  // Gather content blocks in order
  const contentBlocks = Array.from(textInnerGrid.children)
    .map((col) => col.querySelector('.cmp-text, .cmp-title'))
    .filter(Boolean);

  // Compose the content cell
  const contentCell = contentBlocks.map((block) => block);

  // Table rows
  const headerRow = ['Columns block (columns4)'];
  const contentRow = [imgEl, contentCell];

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
