/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified
  const headerRow = ['Columns (columns29)'];

  // Get direct children that are columns (teaser blocks)
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;
  const columns = Array.from(grid.children).filter((col) => col.classList.contains('teaser'));

  // Defensive: Only proceed if we have at least 2 columns
  if (columns.length < 2) return;

  // For each column, extract the main content (the cmp-teaser__description div)
  const contentCells = columns.map((col) => {
    const desc = col.querySelector('.cmp-teaser__description');
    // Defensive: fallback to the column itself if not found
    return desc || col;
  });

  // Second row: one cell per column
  const contentRow = contentCells;

  // Build table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace original element
  element.replaceWith(table);
}
