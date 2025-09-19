/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid containing the columns
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Find all direct child .teaser columns
  const teasers = Array.from(grid.querySelectorAll(':scope > .teaser'));
  if (teasers.length === 0) return;

  // For each teaser, extract the cmp-teaser__description (preserving semantic HTML)
  const columnCells = teasers.map(teaser => {
    const desc = teaser.querySelector('.cmp-teaser__description');
    // Defensive: If missing, fallback to teaser itself
    if (desc) {
      // Use the actual element reference, not a clone
      return desc;
    } else {
      return teaser;
    }
  });

  // Build the table rows
  const headerRow = ['Columns (columns25)']; // Must match target block name exactly
  const contentRow = columnCells;

  // Create the table using WebImporter.DOMUtils.createTable
  const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
