/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid containing the columns
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;
  // Get all direct children with class 'teaser' (these are the columns)
  const teasers = Array.from(grid.children).filter(child => child.classList.contains('teaser'));
  if (teasers.length === 0) return;

  // For each teaser, extract its cmp-teaser__description (or fallback to teaser itself)
  const columns = teasers.map(teaser => {
    const desc = teaser.querySelector('.cmp-teaser__description');
    return desc || teaser;
  });

  // Build the table rows
  const headerRow = ['Columns (columns23)'];
  const contentRow = columns;
  const tableRows = [headerRow, contentRow];

  // Create the table using WebImporter.DOMUtils.createTable
  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element with the table
  element.replaceWith(table);
}
