/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid containing the two main columns
  let grid = element.querySelector('.aem-Grid.aem-Grid--6');
  if (!grid) grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // LEFT COLUMN: Compose all text blocks in correct order
  const leftColumnNodes = [];
  // Eyebrow
  const eyebrow = grid.querySelector('.eyebrow2 .cmp-text');
  if (eyebrow) leftColumnNodes.push(eyebrow);
  // Title
  const title = grid.querySelector('.cmp-title');
  if (title) leftColumnNodes.push(title);
  // Description + list
  const descList = Array.from(grid.querySelectorAll('.cmp-text')).find(el => {
    // Has a <ul>
    return el.querySelector('ul');
  });
  if (descList) leftColumnNodes.push(descList);
  // CTA (Learn more)
  const cta = Array.from(grid.querySelectorAll('.cmp-text')).find(el => {
    // Has a link and is not eyebrow or descList
    if (el === eyebrow || el === descList) return false;
    return el.querySelector('a');
  });
  if (cta) leftColumnNodes.push(cta);

  // RIGHT COLUMN: Find the image
  let imageEl = null;
  const imageContainer = element.querySelector('.image .cmp-image');
  if (imageContainer) {
    imageEl = imageContainer.querySelector('img');
  }
  // Fallback: any .cmp-image img
  if (!imageEl) {
    const fallbackImg = element.querySelector('.cmp-image img');
    if (fallbackImg) imageEl = fallbackImg;
  }

  // Compose columns for table
  const leftColumn = leftColumnNodes;
  const rightColumn = imageEl ? [imageEl] : [];

  // Table header must match block name exactly
  const headerRow = ['Columns block (columns3)'];
  const contentRow = [leftColumn, rightColumn];
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(table);
}
