/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest grid containing two columns: left (text), right (image)
  let grid = element.querySelector('.aem-Grid.aem-Grid--6, .aem-Grid.aem-Grid--12, .aem-Grid.aem-Grid--tablet--12, .aem-Grid.aem-Grid--default--12, .aem-Grid.aem-Grid--tablet--10');
  let leftCol = null;
  let rightCol = null;
  if (grid) {
    const children = Array.from(grid.children);
    leftCol = children.find(child => child.classList.contains('container') && child.classList.contains('text'));
    rightCol = children.find(child => child.classList.contains('image'));
  }
  // Fallbacks if not found
  if (!leftCol) {
    leftCol = element.querySelector('.container.text');
  }
  if (!rightCol) {
    rightCol = element.querySelector('.image');
  }

  // Gather all text blocks for left column
  let leftContent = [];
  if (leftCol) {
    // Get all cmp-text and cmp-title in order
    leftCol.querySelectorAll('.cmp-text, .cmp-title').forEach(node => leftContent.push(node));
  }
  // Defensive fallback: all text blocks in element
  if (leftContent.length === 0) {
    element.querySelectorAll('.cmp-text, .cmp-title').forEach(node => leftContent.push(node));
  }

  // Gather image for right column
  let rightContent = [];
  if (rightCol) {
    const img = rightCol.querySelector('img');
    if (img) rightContent.push(img);
  }
  // Defensive fallback: any img in element
  if (rightContent.length === 0) {
    const img = element.querySelector('img');
    if (img) rightContent.push(img);
  }

  // Compose the table
  const headerRow = ['Columns (columns3)'];
  const contentRow = [leftContent, rightContent];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
