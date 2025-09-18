/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest grid with two main children (text and image columns)
  let mainGrid = element;
  while (mainGrid) {
    const grids = mainGrid.querySelectorAll(':scope > div');
    if (grids.length === 1) {
      mainGrid = grids[0];
    } else {
      break;
    }
  }

  // Find the two main column containers (text and image)
  let columns = mainGrid.querySelectorAll(':scope > div');
  if (columns.length > 2) {
    columns = Array.from(columns).filter((col) => {
      return col.classList.contains('text') || col.classList.contains('image') || col.querySelector('.cmp-text, .cmp-title, .cmp-image');
    });
  }

  // Find the text column (contains .cmp-text or .cmp-title)
  const textCol = Array.from(columns).find(col => col.classList.contains('text') || col.querySelector('.cmp-text, .cmp-title'));
  // Find the image column (contains .cmp-image)
  const imageCol = Array.from(columns).find(col => col.classList.contains('image') || col.querySelector('.cmp-image'));

  // Fallbacks if not found
  const leftCol = textCol || columns[0];
  const rightCol = imageCol || columns[1];

  // Gather left column content (all .cmp-text and .cmp-title in order)
  let leftContent = [];
  if (leftCol) {
    const textBlocks = leftCol.querySelectorAll('.cmp-text, .cmp-title');
    textBlocks.forEach(block => {
      leftContent.push(block);
    });
  }

  // Gather right column content (first .cmp-image)
  let rightContent = [];
  if (rightCol) {
    const imageBlock = rightCol.querySelector('.cmp-image');
    if (imageBlock) {
      rightContent.push(imageBlock);
    }
  }

  // Build the table rows
  const headerRow = ['Columns block (columns6)'];
  const contentRow = [leftContent, rightContent];

  // Create the columns block table
  const block = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(block);
}
