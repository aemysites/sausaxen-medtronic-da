/* global WebImporter */
export default function parse(element, { document }) {
  // Find the innermost grid containing the two columns
  const grid = element.querySelector('.aem-Grid.aem-Grid--4')?.parentElement;
  if (!grid) return;

  // Find the left column (text) and right column (image)
  const leftCol = grid.querySelector('.aem-Grid.aem-Grid--4');
  const rightCol = grid.querySelector('.image');
  if (!leftCol || !rightCol) return;

  // Gather all text/title blocks in left column
  const leftContent = [];
  leftCol.querySelectorAll('.cmp-text, .cmp-title').forEach(el => leftContent.push(el));

  // Gather image in right column
  const rightContent = [];
  const img = rightCol.querySelector('img');
  if (img) rightContent.push(img);

  // Compose table rows
  const headerRow = ['Columns block (columns6)'];
  const contentRow = [leftContent, rightContent];

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);
  element.replaceWith(table);
}
