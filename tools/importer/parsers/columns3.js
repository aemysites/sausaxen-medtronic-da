/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid that contains the two columns
  const mainGrid = element.querySelector('.aem-Grid.aem-Grid--12.aem-Grid--default--12');
  if (!mainGrid) return;

  // Find the inner grid with columns
  const innerGrid = mainGrid.querySelector('.aem-Grid.aem-Grid--12.aem-Grid--tablet--12.aem-Grid--default--12.aem-Grid--phone--12');
  if (!innerGrid) return;

  // Find left and right columns
  let leftCol = Array.from(innerGrid.children).find(child => child.classList.contains('container') && child.classList.contains('wide-card'));
  let rightCol = Array.from(innerGrid.children).find(child => child.classList.contains('image'));

  // Defensive fallback
  if (!leftCol) leftCol = innerGrid.children[0];
  if (!rightCol) rightCol = innerGrid.children[1];

  // --- LEFT COLUMN ---
  // Collect all content blocks in left column
  let leftContent = [];
  if (leftCol) {
    const leftGrid = leftCol.querySelector('.aem-Grid');
    if (leftGrid) {
      leftContent = Array.from(leftGrid.children).map(block => {
        const text = block.querySelector('.cmp-text');
        const title = block.querySelector('.cmp-title');
        if (title) return title;
        if (text) return text;
        return null;
      }).filter(Boolean);
    }
  }

  // --- RIGHT COLUMN ---
  // Get image element only (reference, not clone)
  let imageEl = null;
  if (rightCol) {
    const cmpImage = rightCol.querySelector('.cmp-image');
    if (cmpImage) {
      imageEl = cmpImage.querySelector('img');
    }
  }

  // Compose table rows
  const headerRow = ['Columns (columns3)'];
  const contentRow = [leftContent, imageEl ? imageEl : ''];

  // Create table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace original element
  element.replaceWith(table);
}
