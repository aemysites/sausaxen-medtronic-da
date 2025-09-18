/* global WebImporter */
export default function parse(element, { document }) {
  // Always use block name as header
  const headerRow = ['Columns'];

  // Defensive: get immediate children that are columns
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;
  const columnDivs = Array.from(grid.children).filter(child => child.classList.contains('teaser'));

  // For each column, extract the cmp-teaser__description content
  const columns = columnDivs.map(col => {
    const desc = col.querySelector('.cmp-teaser__description');
    // Defensive: fallback to column if description missing
    return desc || col;
  });

  // The second row is the columns side by side
  const tableRows = [headerRow, columns];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element
  element.replaceWith(block);
}
