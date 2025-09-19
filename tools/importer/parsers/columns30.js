/* global WebImporter */
export default function parse(element, { document }) {
  // Get all direct children that are columns
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;
  const columnDivs = Array.from(grid.querySelectorAll(':scope > .teaser'));

  // Prepare table rows
  const cells = [];
  const headerRow = ['Columns (columns30)'];
  cells.push(headerRow);

  // Second row: one cell per column, remove empty <p> elements
  const contentRow = columnDivs.map(col => {
    const desc = col.querySelector('.cmp-teaser__description');
    if (!desc) return col;
    // Clone to avoid mutating the original
    const descClone = desc.cloneNode(true);
    // Remove all <p> that are empty or whitespace only
    descClone.querySelectorAll('p').forEach(p => {
      if (!p.textContent.trim() && p.children.length === 0) {
        p.remove();
      }
    });
    return descClone;
  });
  cells.push(contentRow);

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
