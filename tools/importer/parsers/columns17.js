/* global WebImporter */
export default function parse(element, { document }) {
  // Only parse carousel actions blocks
  if (!element.classList.contains('cmp-carousel__actions')) return;

  // Block header row
  const headerRow = ['Columns (columns17)'];

  // Get all carousel action buttons (previous/next)
  const buttons = Array.from(element.querySelectorAll('button'));

  // Each button goes in its own cell for a two-column layout
  const contentRow = buttons.map(btn => btn);

  // Build the table rows
  const rows = [headerRow, contentRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new block table
  element.replaceWith(block);
}
