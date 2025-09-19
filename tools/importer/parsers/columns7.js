/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get immediate child by class
  function getChildByClass(parent, className) {
    return Array.from(parent.children).find(child => child.classList.contains(className));
  }

  // Find the main grid that splits into two columns
  const mainGrid = element.querySelector('.aem-Grid');
  if (!mainGrid) return;

  // LEFT COLUMN: image
  let imageEl = null;
  const leftCol = getChildByClass(mainGrid, 'image');
  if (leftCol) {
    const cmpImage = leftCol.querySelector('.cmp-image');
    if (cmpImage) {
      const img = cmpImage.querySelector('img');
      if (img) imageEl = img;
    }
  }

  // RIGHT COLUMN: all text content (eyebrow, title, description)
  let rightColContent = [];
  const rightCol = getChildByClass(mainGrid, 'wide-card');
  if (rightCol) {
    const innerGrid = rightCol.querySelector('.aem-Grid');
    if (innerGrid) {
      // Eyebrow
      const eyebrow = getChildByClass(innerGrid, 'eyebrow2');
      if (eyebrow) {
        const cmpText = eyebrow.querySelector('.cmp-text');
        if (cmpText) rightColContent.push(cmpText);
      }
      // Title
      const title = getChildByClass(innerGrid, 'title');
      if (title) {
        const cmpTitle = title.querySelector('.cmp-title');
        if (cmpTitle) rightColContent.push(cmpTitle);
      }
      // Description
      const desc = getChildByClass(innerGrid, 'no-bottom-margin-p');
      if (desc) {
        const cmpText = desc.querySelector('.cmp-text');
        if (cmpText) rightColContent.push(cmpText);
      }
    }
  }

  // Compose table
  const headerRow = ['Columns (columns7)'];
  const contentRow = [imageEl, ...rightColContent];
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
