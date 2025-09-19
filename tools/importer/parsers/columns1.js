/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid containing the two columns
  const mainGrid = element.querySelector('.aem-Grid.aem-Grid--8');
  if (!mainGrid) return;

  // Find the image column and the text column
  let imageCol = null;
  let textCol = null;
  for (const child of mainGrid.children) {
    if (!imageCol && child.querySelector('.cmp-image img')) {
      imageCol = child;
    } else if (!textCol && child.querySelector('.cmp-container')) {
      textCol = child;
    }
  }
  if (!imageCol || !textCol) return;

  // Get the image element (reference, not clone)
  const imgEl = imageCol.querySelector('.cmp-image img');

  // Gather all text blocks from the text column, preserving semantic structure
  const textBlocks = [];
  const textContainer = textCol.querySelector('.cmp-container');
  if (textContainer) {
    const innerGrid = textContainer.querySelector('.aem-Grid');
    if (innerGrid) {
      for (const block of innerGrid.children) {
        const txt = block.querySelector('.cmp-text, .cmp-title');
        if (txt) textBlocks.push(txt);
      }
    }
  }

  // Compose the table rows
  const headerRow = ['Columns block (columns1)'];
  const contentRow = [imgEl ? imgEl : '', textBlocks.length ? textBlocks : ''];
  const rows = [headerRow, contentRow];

  // Create and replace with the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
