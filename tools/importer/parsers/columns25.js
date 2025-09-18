/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns25)'];

  // Defensive: Get all immediate children of the main grid
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;
  const teasers = Array.from(grid.querySelectorAll(':scope > .teaser'));

  // Each teaser contains a cmp-teaser__description with the content
  const columns = teasers.map(teaser => {
    const desc = teaser.querySelector('.cmp-teaser__description');
    // Defensive: If not found, fallback to the teaser itself
    return desc || teaser;
  });

  // Only create the second row if there is at least one column
  if (!columns.length) return;

  // Build the table rows
  const rows = [headerRow, columns];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
