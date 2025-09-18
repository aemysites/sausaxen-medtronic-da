/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required
  const headerRow = ['Columns block (columns11)'];

  // Find the content column (the white circle with text/button)
  const colContent = element.querySelector('.circle-content .cmp-container');

  // Defensive fallback if not found
  let col = colContent;
  if (!col) {
    const fallback = element.querySelector('.circle-content');
    if (fallback) {
      col = fallback.querySelector('.cmp-container') || fallback;
    }
  }
  if (!col) col = element;

  // Extract columns: Each logical block (title, subtitle, paragraph, button) as a separate column
  // We'll treat each direct child of col as a column
  const colCells = Array.from(col.children)
    .filter(child => child.textContent.trim() || child.querySelector('img,a,button'));

  // If only one child, fallback: split by .title/.text/.button selectors
  let cells;
  if (colCells.length > 1) {
    cells = colCells;
  } else {
    // Try to split by selectors
    cells = [
      col.querySelector('.title.eyebrow'),
      col.querySelector('.title.avenir-regular'),
      col.querySelector('.text'),
      col.querySelector('.button')
    ].filter(Boolean);
  }

  // Build the table rows
  const rows = [
    headerRow,
    cells
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
