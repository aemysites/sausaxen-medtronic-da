/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct child by class
  function getDirectChildByClass(parent, className) {
    return Array.from(parent.children).find(child => child.classList.contains(className));
  }

  // Find the main grid
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Get left column: image
  const imageCol = Array.from(grid.children).find(child => child.classList.contains('image'));
  let imageCell = null;
  if (imageCol) {
    const cmpImage = getDirectChildByClass(imageCol, 'cmp-image');
    if (cmpImage) {
      const img = cmpImage.querySelector('img');
      if (img) imageCell = img;
    }
  }

  // Get right column: content
  const cardCol = Array.from(grid.children).find(child => child.classList.contains('wide-card'));
  let contentCell = document.createElement('div');
  if (cardCol) {
    const cardGrid = cardCol.querySelector('.aem-Grid');
    if (cardGrid) {
      // Eyebrow
      const eyebrow = getDirectChildByClass(cardGrid, 'eyebrow2');
      if (eyebrow) {
        const cmpText = getDirectChildByClass(eyebrow, 'cmp-text');
        if (cmpText) {
          Array.from(cmpText.childNodes).forEach(n => contentCell.appendChild(n.cloneNode(true)));
        }
      }
      // Title
      const title = getDirectChildByClass(cardGrid, 'title');
      if (title) {
        const cmpTitle = getDirectChildByClass(title, 'cmp-title');
        if (cmpTitle) {
          Array.from(cmpTitle.childNodes).forEach(n => contentCell.appendChild(n.cloneNode(true)));
        }
      }
      // Text
      const text = getDirectChildByClass(cardGrid, 'no-bottom-margin-p');
      if (text) {
        const cmpText2 = getDirectChildByClass(text, 'cmp-text');
        if (cmpText2) {
          Array.from(cmpText2.childNodes).forEach(n => contentCell.appendChild(n.cloneNode(true)));
        }
      }
    }
  }

  // Only create table if at least one cell has content
  if (!imageCell && !contentCell.hasChildNodes()) return;

  const headerRow = ['Columns (columns7)'];
  const contentRow = [imageCell, contentCell];
  const rows = [headerRow, contentRow];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
