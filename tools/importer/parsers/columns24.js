/* global WebImporter */
export default function parse(element, { document }) {
  // Get all direct teaser columns in order
  const grid = element.querySelector('.aem-Grid');
  const teasers = grid ? Array.from(grid.children).filter(e => e.classList.contains('teaser')) : [];

  // Defensive fallback if structure is unexpected
  const columns = teasers.length ? teasers : Array.from(element.querySelectorAll(':scope > .teaser'));

  // For each column, extract the .cmp-teaser__description content (preserves headings, paragraphs, etc)
  const columnCells = columns.map(col => {
    const desc = col.querySelector('.cmp-teaser__description');
    // Defensive: fallback to column itself if no description
    return desc || col;
  });

  // Table header must match target block name exactly
  const headerRow = ['Columns (columns24)'];
  const contentRow = columnCells;
  const tableRows = [headerRow, contentRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element
  element.replaceWith(block);
}
