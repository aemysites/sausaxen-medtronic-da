/* global WebImporter */
export default function parse(element, { document }) {
  // Get the two teaser columns
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;
  const teasers = Array.from(grid.children).filter(div => div.querySelector('.cmp-teaser__description'));
  if (teasers.length === 0) return;

  // For each teaser, extract the .cmp-teaser__description div (the content block)
  const cells = teasers.map(teaser => {
    const desc = teaser.querySelector('.cmp-teaser__description');
    // Defensive: fallback to the teaser itself if not found
    return desc || teaser;
  });

  // Table header must be exactly as required
  const headerRow = ['Columns (columns29)'];
  const contentRow = cells;

  // Create the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
