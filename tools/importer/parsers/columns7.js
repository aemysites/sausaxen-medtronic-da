/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid containing the two columns
  const mainGrid = element.querySelector('.aem-Grid');
  if (!mainGrid) return;
  const gridChildren = Array.from(mainGrid.children);

  // Identify image and content columns
  let imageCol = null;
  let contentCol = null;
  gridChildren.forEach((child) => {
    if (child.querySelector('.cmp-image')) {
      imageCol = child;
    } else if (child.querySelector('.card-module')) {
      contentCol = child;
    }
  });
  // Only proceed if at least one column has content
  if (!imageCol && !contentCol) return;

  // --- Left column: Image ---
  let imgCell = null;
  if (imageCol) {
    const imgWrapper = imageCol.querySelector('.cmp-image');
    if (imgWrapper) {
      imgCell = document.createElement('div');
      const img = imgWrapper.querySelector('img');
      if (img) imgCell.appendChild(img.cloneNode(true));
    }
  }

  // --- Right column: Content ---
  let rightCell = null;
  if (contentCol) {
    const cardGrid = contentCol.querySelector('.aem-Grid');
    if (cardGrid) {
      rightCell = document.createElement('div');
      // Collect all text and title blocks in order
      const blocks = cardGrid.querySelectorAll('.cmp-text, .cmp-title');
      blocks.forEach((block) => {
        rightCell.appendChild(block.cloneNode(true));
      });
    }
  }

  // Build the table only with columns that have actual content
  const headerRow = ['Columns (columns7)'];
  const contentRow = [];
  if (imgCell && imgCell.childNodes.length > 0) contentRow.push(imgCell);
  if (rightCell && rightCell.childNodes.length > 0) contentRow.push(rightCell);
  if (contentRow.length === 0) return; // Don't create empty columns

  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(table);
}
