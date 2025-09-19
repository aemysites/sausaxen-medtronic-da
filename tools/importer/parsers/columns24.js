/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns24)'];

  // Defensive: Get all immediate children that are columns
  const grid = element.querySelector('.aem-Grid');
  let columnDivs = [];
  if (grid) {
    // Get all direct children of grid that are columns
    columnDivs = Array.from(grid.children).filter(
      (child) => child.classList.contains('teaser')
    );
  } else {
    // Fallback: try to find columns directly in element
    columnDivs = Array.from(element.children).filter(
      (child) => child.classList.contains('teaser')
    );
  }

  // For each column, extract the main content block
  const contentRow = columnDivs.map((col) => {
    // Defensive: Find the description content
    const desc = col.querySelector('.cmp-teaser__description');
    // If found, use the whole description block (preserves headings and paragraphs)
    if (desc) {
      return desc;
    }
    // Fallback: use the column itself
    return col;
  });

  // Build the table
  const tableCells = [headerRow, contentRow];
  const blockTable = WebImporter.DOMUtils.createTable(tableCells, document);

  // Replace the original element
  element.replaceWith(blockTable);
}
