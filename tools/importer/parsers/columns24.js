/* global WebImporter */
export default function parse(element, { document }) {
  // Get the two teaser columns
  const teasers = Array.from(element.querySelectorAll(':scope > div > div.teaser'));
  // For each teaser, extract the cmp-teaser__description (preserves headings, paragraphs, etc)
  const cells = teasers.map(teaser => {
    const desc = teaser.querySelector('.cmp-teaser__description');
    // Defensive: If not found, fallback to teaser itself
    return desc || teaser;
  });

  // Build the Columns block table
  const headerRow = ['Columns'];
  const contentRow = cells;
  const rows = [headerRow, contentRow];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
