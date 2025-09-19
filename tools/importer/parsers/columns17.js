/* global WebImporter */
export default function parse(element, { document }) {
  // Only process cmp-carousel__actions
  if (!element || !element.classList.contains('cmp-carousel__actions')) return;

  // Find the two navigation buttons (previous, next)
  const buttons = Array.from(element.querySelectorAll(':scope > button'));
  if (buttons.length === 0) return;

  // Columns block header as per spec
  const headerRow = ['Columns (columns17)'];

  // Each button (with its SVG image) is a column
  const contentRow = buttons.map((btn) => btn);

  // Compose the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the carousel actions with the columns block
  element.replaceWith(table);
}
