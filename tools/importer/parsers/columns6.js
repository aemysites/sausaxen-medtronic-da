/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate children by selector
  function getImmediateChildrenByClass(parent, className) {
    return Array.from(parent.children).filter(child => child.classList.contains(className));
  }

  // Find the two main columns: left (text) and right (image)
  // The structure is deeply nested, so we need to traverse carefully
  // Step 1: Find the innermost grid that contains the two columns
  let mainGrid = element.querySelector('.aem-Grid.aem-Grid--8');
  if (!mainGrid) {
    // fallback: try to find the deepest grid
    const grids = element.querySelectorAll('.aem-Grid');
    mainGrid = grids[grids.length - 1];
  }
  if (!mainGrid) return;

  // Step 2: Find the two column containers
  // Left: text (contains eyebrow, title, description, link)
  // Right: image
  const columns = Array.from(mainGrid.children).filter(child =>
    child.classList.contains('container') || child.classList.contains('image')
  );

  // Defensive: expect two columns
  let leftCol, rightCol;
  if (columns.length === 2) {
    // Determine which is text and which is image
    if (columns[0].classList.contains('container')) {
      leftCol = columns[0];
      rightCol = columns[1];
    } else {
      leftCol = columns[1];
      rightCol = columns[0];
    }
  } else {
    // fallback: try to find by class
    leftCol = mainGrid.querySelector('.container');
    rightCol = mainGrid.querySelector('.image');
  }
  if (!leftCol || !rightCol) return;

  // LEFT COLUMN: Gather all text blocks in order
  let leftContent = [];
  // The leftCol has a .cmp-container > .aem-Grid > several text/title blocks
  let leftGrid = leftCol.querySelector('.aem-Grid');
  if (leftGrid) {
    // Get all direct children (text, title, etc.)
    leftContent = Array.from(leftGrid.children).map(child => {
      // Each child contains a div.cmp-text or div.cmp-title
      const textBlock = child.querySelector('.cmp-text, .cmp-title');
      return textBlock ? textBlock : null;
    }).filter(Boolean);
  } else {
    // fallback: just grab all .cmp-text and .cmp-title under leftCol
    leftContent = Array.from(leftCol.querySelectorAll('.cmp-text, .cmp-title'));
  }

  // RIGHT COLUMN: Find the image element
  let img = rightCol.querySelector('img');
  let rightContent = img ? [img] : [];

  // Build the table rows
  const headerRow = ['Columns block (columns6)'];
  const contentRow = [leftContent, rightContent];
  const tableRows = [headerRow, contentRow];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
