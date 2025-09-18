/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find all immediate child teasers (columns)
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;
  const teasers = Array.from(grid.querySelectorAll(':scope > .teaser'));

  // Each teaser contains a cmp-teaser__description with the content
  const columns = teasers.map(teaser => {
    const desc = teaser.querySelector('.cmp-teaser__description');
    // Defensive: If no description, skip
    if (!desc) return document.createElement('div');
    return desc;
  });

  // Table header row
  const headerRow = ['Columns (columns25)'];
  // Table content row: one cell per column
  const contentRow = columns;

  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(table);
}
