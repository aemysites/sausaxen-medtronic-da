/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all direct child divs of a given element
  function getDirectDivs(el) {
    return Array.from(el.querySelectorAll(':scope > div'));
  }

  // Find the deepest grid with the two main columns
  let mainGrid;
  let imageCol, textCol;

  // Defensive: traverse down to the two main columns
  let current = element;
  for (let i = 0; i < 5; i++) {
    const divs = getDirectDivs(current);
    // Find the grid with exactly two children (columns)
    const grid = divs.find(div => {
      const children = getDirectDivs(div);
      return children.length === 2;
    });
    if (grid) {
      mainGrid = grid;
      break;
    }
    // Otherwise, descend into the first child
    current = divs[0];
  }
  if (!mainGrid) {
    // Fallback: try to find the grid with two columns
    mainGrid = element.querySelector('.aem-Grid.aem-Grid--8, .aem-Grid.aem-Grid--tablet--10');
  }

  // Get the two columns
  const columns = getDirectDivs(mainGrid);
  // Defensive: ensure we have two columns
  if (columns.length < 2) {
    // Fallback: try to find two columns
    const allColumns = Array.from(mainGrid.querySelectorAll(':scope > div'));
    imageCol = allColumns[1];
    textCol = allColumns[0];
  } else {
    textCol = columns[0];
    imageCol = columns[1];
  }

  // --- Left column: collect all content blocks (image, eyebrow, heading, paragraph, link) ---
  let leftContent = [];
  if (textCol) {
    // Get all direct children (should be 3-4 blocks)
    const leftBlocks = getDirectDivs(textCol);
    leftBlocks.forEach(block => {
      // Only add if it contains content
      if (block.textContent.trim() || block.querySelector('img')) {
        leftContent.push(block);
      }
    });
  }

  // --- Right column: main image ---
  let rightContent = [];
  if (imageCol) {
    // Find the image block
    const imgBlock = imageCol.querySelector('.cmp-image');
    if (imgBlock) {
      rightContent.push(imgBlock);
    } else {
      // Fallback: grab all content
      rightContent.push(imageCol);
    }
  }

  // Compose table rows
  const headerRow = ['Columns (columns15)'];
  const contentRow = [leftContent, rightContent];

  // Create the block table
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
