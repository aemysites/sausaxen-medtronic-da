/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required
  const headerRow = ['Columns (columns30)'];

  // Defensive: find the direct grid container
  const grid = element.querySelector(':scope > .aem-Grid');
  if (!grid) {
    // fallback: replace with just header
    const table = WebImporter.DOMUtils.createTable([headerRow], document);
    element.replaceWith(table);
    return;
  }

  // Get all direct children of the grid (each column)
  const columns = Array.from(grid.children).filter(child => child.classList.contains('teaser'));

  // For each column, extract the cmp-teaser__description div (which holds the content)
  const columnCells = columns.map(col => {
    const desc = col.querySelector('.cmp-teaser__description');
    // Defensive: if not found, use the whole column
    const content = desc || col;
    // Remove empty <p> elements
    content.querySelectorAll('p').forEach(p => {
      if (!p.textContent.trim() && p.children.length === 0) {
        p.remove();
      }
    });
    return content;
  });

  // Build rows: header, then one row with N columns
  const rows = [
    headerRow,
    columnCells
  ];

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
