/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid containing the two columns
  let grid = element.querySelector('.aem-Grid.aem-Grid--8');
  if (!grid) {
    grid = element.querySelector('.aem-Grid.aem-Grid--tablet--12') || element.querySelector('.aem-Grid.aem-Grid--default--8');
  }
  if (!grid) return;

  // Get the two main columns: image and content
  const columns = Array.from(grid.children).filter(col =>
    col.classList.contains('image') || col.classList.contains('container')
  );

  // --- Column 1: Image ---
  let imageCell = '';
  const imageCol = columns.find(col => col.classList.contains('image'));
  if (imageCol) {
    const cmpImage = imageCol.querySelector('.cmp-image');
    if (cmpImage) {
      const img = cmpImage.querySelector('img');
      if (img) imageCell = img;
    }
  }

  // --- Column 2: Content ---
  let contentCell = [];
  const contentCol = columns.find(col => col.classList.contains('container'));
  if (contentCol) {
    let innerGrid = contentCol.querySelector('.aem-Grid.aem-Grid--4');
    if (!innerGrid) {
      innerGrid = contentCol.querySelector('.aem-Grid');
    }
    if (innerGrid) {
      const blocks = Array.from(innerGrid.children).filter(
        c => c.classList.contains('text') || c.classList.contains('title')
      );
      blocks.forEach(block => {
        if (block.classList.contains('title')) {
          const h3 = block.querySelector('h3');
          if (h3) contentCell.push(h3);
        } else {
          const cmpText = block.querySelector('.cmp-text');
          if (cmpText && cmpText.textContent.trim()) contentCell.push(cmpText);
        }
      });
    }
  }

  const headerRow = ['Columns block (columns1)'];
  const contentRow = [imageCell, contentCell];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);
  element.replaceWith(table);
}
