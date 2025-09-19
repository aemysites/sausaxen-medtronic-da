/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per block requirements
  const headerRow = ['Columns (columns23)'];

  // Defensive: Find the direct child grid container
  const grid = element.querySelector(':scope > .aem-Grid');
  if (!grid) {
    // fallback: if grid not found, do nothing
    return;
  }

  // Get all direct children of the grid (should be the two teaser columns)
  const columns = Array.from(grid.children).filter((col) =>
    col.classList.contains('teaser')
  );

  // For each column, extract the main content (the cmp-teaser__description)
  const columnContents = columns.map((col) => {
    const desc = col.querySelector('.cmp-teaser__description');
    // Defensive: fallback to the column itself if description not found
    return desc || col;
  });

  // Build the table rows: header, then one row with as many columns as found
  const tableRows = [
    headerRow,
    columnContents
  ];

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element with the table
  element.replaceWith(table);
}
