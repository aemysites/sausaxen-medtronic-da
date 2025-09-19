/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the required block name as the header row
  const headerRow = ['Columns (columns22)'];

  // Get the immediate children of the main container
  const grid = element.querySelector(':scope > .aem-Grid');
  if (!grid) return;

  // Find all direct children of the grid that represent columns
  const columnDivs = Array.from(grid.children).filter(div => div.classList.contains('teaser'));

  // Defensive: Only proceed if we have at least one column
  if (columnDivs.length === 0) return;

  // For each column, extract the main content block (the .cmp-teaser__description)
  const cells = columnDivs.map(col => {
    const desc = col.querySelector('.cmp-teaser__description');
    // Defensive: fallback to column if description not found
    return desc || col;
  });

  // Compose the table rows: header, then one row with the columns
  const tableRows = [
    headerRow,
    cells
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
