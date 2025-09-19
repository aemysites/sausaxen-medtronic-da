/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid containing columns
  const outerGrid = element.querySelector('.aem-Grid');
  if (!outerGrid) return;

  // Find the two main column containers (image and text)
  let imageCol = null, textCol = null;
  const colContainers = Array.from(outerGrid.children).filter((el) => el.classList.contains('container'));
  for (const col of colContainers) {
    if (!imageCol && col.querySelector('.cmp-image img')) imageCol = col;
    if (!textCol && (col.querySelector('.cmp-title, .cmp-text'))) textCol = col;
  }
  if (!imageCol || !textCol) return;

  // --- COLUMN 1: IMAGE ---
  let imgEl = imageCol.querySelector('.cmp-image img');
  imgEl = imgEl ? imgEl.cloneNode(true) : null;

  // --- COLUMN 2: TEXT ---
  const textColGrid = textCol.querySelector('.aem-Grid');
  let textColContent = [];
  if (textColGrid) {
    // Only extract the actual content blocks: .cmp-title and .cmp-text (flattened)
    textColContent = Array.from(textColGrid.querySelectorAll('.cmp-title, .cmp-text')).map((el) => el.cloneNode(true));
  } else {
    textColContent = Array.from(textCol.querySelectorAll('.cmp-title, .cmp-text')).map((el) => el.cloneNode(true));
  }

  // Compose the table rows
  const headerRow = ['Columns block (columns5)'];
  const contentRow = [imgEl, textColContent];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
