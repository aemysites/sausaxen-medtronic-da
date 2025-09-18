/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid containing the two columns
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Get the two main column containers
  const columns = Array.from(grid.children).filter(
    (child) => child.classList.contains('aem-GridColumn')
  );
  if (columns.length < 2) return;

  // --- First column: image ---
  let imageCell = null;
  const imageDiv = columns[0].querySelector('.cmp-image');
  if (imageDiv) {
    const img = imageDiv.querySelector('img');
    if (img) imageCell = img;
  }

  // --- Second column: content ---
  const contentGrid = columns[1].querySelector('.aem-Grid');
  const contentCell = document.createElement('div');
  if (contentGrid) {
    // Eyebrow
    const eyebrow = contentGrid.querySelector('.eyebrow2 .cmp-text');
    if (eyebrow) {
      Array.from(eyebrow.childNodes).forEach(node => contentCell.appendChild(node.cloneNode(true)));
    }
    // Title
    const title = contentGrid.querySelector('.cmp-title');
    if (title) {
      Array.from(title.childNodes).forEach(node => contentCell.appendChild(node.cloneNode(true)));
    }
    // Description
    const desc = contentGrid.querySelector('.no-bottom-margin-p .cmp-text');
    if (desc) {
      Array.from(desc.childNodes).forEach(node => contentCell.appendChild(node.cloneNode(true)));
    }
  }

  // Only build table if at least one cell has content
  if (!imageCell && !contentCell.hasChildNodes()) return;

  const headerRow = ['Columns (columns7)'];
  const contentRow = [imageCell, contentCell.hasChildNodes() ? contentCell : null];
  const cells = [headerRow, contentRow];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
