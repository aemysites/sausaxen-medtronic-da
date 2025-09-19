/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid containing the two columns
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;
  const cols = Array.from(grid.children);
  if (cols.length < 2) return;

  // --- LEFT COLUMN ---
  // Find the image element (reference, not clone)
  const leftImage = cols[0].querySelector('img');
  const leftCell = leftImage || '';

  // --- RIGHT COLUMN ---
  // Find the nested grid for right column content
  const rightGrid = cols[1].querySelector('.aem-Grid');
  let rightCellContent = [];
  if (rightGrid) {
    // Eyebrow text (first .cmp-text)
    const eyebrow = rightGrid.querySelector('.cmp-text');
    if (eyebrow) rightCellContent.push(eyebrow);
    // Title (h3)
    const title = rightGrid.querySelector('.cmp-title');
    if (title) rightCellContent.push(title);
    // Description (second .cmp-text)
    const texts = rightGrid.querySelectorAll('.cmp-text');
    if (texts.length > 1) rightCellContent.push(texts[1]);
  }
  // If nothing found, fallback to empty string
  const rightCell = rightCellContent.length > 0 ? rightCellContent : '';

  // Table header must match block name exactly
  const headerRow = ['Columns (columns7)'];
  const row = [leftCell, rightCell];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    row,
  ], document);

  element.replaceWith(table);
}
