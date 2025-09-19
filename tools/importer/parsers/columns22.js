/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns22)'];

  // Defensive: get the main grid
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Get all immediate children of the grid (these are the columns)
  const columns = Array.from(grid.querySelectorAll(':scope > .teaser'));

  // For each column, extract the main content block
  const contentCells = columns.map(col => {
    // Find the cmp-teaser__description inside each column
    const desc = col.querySelector('.cmp-teaser__description');
    // Defensive: fallback to the column itself if not found
    return desc || col;
  });

  // Build the table rows
  const rows = [headerRow, contentCells];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
