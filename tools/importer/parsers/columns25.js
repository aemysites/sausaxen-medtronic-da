/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must match the target block name exactly
  const headerRow = ['Columns (columns25)'];

  // Find the main grid container
  const grid = element.querySelector('.aem-Grid');
  if (!grid) {
    // Defensive fallback: just output header
    const table = WebImporter.DOMUtils.createTable([headerRow], document);
    element.replaceWith(table);
    return;
  }

  // Find all direct children of the grid that are teasers (columns)
  const columns = Array.from(grid.children).filter(col => col.classList.contains('teaser'));

  // For each column, extract its cmp-teaser__description content, preserving semantic HTML
  const columnCells = columns.map(col => {
    const desc = col.querySelector('.cmp-teaser__description');
    // Defensive: fallback to the column itself if description not found
    // Always reference existing elements, do not clone
    return desc || col;
  });

  // Only create one table, no Section Metadata block required
  // Table rows: header, then one row with all columns
  const tableRows = [
    headerRow,
    columnCells
  ];

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
