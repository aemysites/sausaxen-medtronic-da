/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children by class
  function findChildByClass(parent, className) {
    return Array.from(parent.children).find((el) => el.classList.contains(className));
  }

  // 1. Find the two main columns: left (image), right (content)
  // The structure is: element > .container > .cmp-container > .aem-Grid > [image div, content div]
  const mainGrid = element.querySelector('.aem-Grid');
  if (!mainGrid) return;

  // Find the image column (left)
  const imageCol = Array.from(mainGrid.children).find((div) => div.querySelector('.cmp-image'));
  // Find the content column (right)
  const contentCol = Array.from(mainGrid.children).find((div) => div !== imageCol);

  // Defensive: If either column is missing, abort
  if (!imageCol || !contentCol) return;

  // Get the image element
  const cmpImage = imageCol.querySelector('.cmp-image');
  let imgEl = cmpImage ? cmpImage.querySelector('img') : null;

  // Get the content column's grid (contains text/title/desc)
  const contentGrid = contentCol.querySelector('.aem-Grid');
  if (!contentGrid) return;

  // Extract content elements in order
  const contentEls = [];
  // Eyebrow
  const eyebrow = contentGrid.querySelector('.eyebrow2 .cmp-text');
  if (eyebrow) contentEls.push(eyebrow);
  // Title
  const title = contentGrid.querySelector('.cmp-title');
  if (title) contentEls.push(title);
  // Description
  const desc = contentGrid.querySelector('.no-bottom-margin-p .cmp-text');
  if (desc) contentEls.push(desc);

  // Compose the table rows
  const headerRow = ['Columns (columns7)'];
  const columnsRow = [imgEl, contentEls];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow,
  ], document);

  element.replaceWith(table);
}
