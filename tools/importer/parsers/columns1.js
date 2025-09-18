/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main inner grid containing the two columns
  const innerGrid = element.querySelector('.aem-Grid.aem-Grid--8, .aem-Grid.aem-Grid--tablet--12, .aem-Grid.aem-Grid--default--8');
  if (!innerGrid) return;

  // Find the two main columns: image and card content
  const imageCol = innerGrid.querySelector('.image');
  const cardCol = innerGrid.querySelector('.card-module');

  // --- IMAGE COLUMN ---
  let imageCellContent = [];
  if (imageCol) {
    // Reference the actual image element (not clone)
    const img = imageCol.querySelector('img');
    if (img) imageCellContent.push(img);
  }

  // --- CARD CONTENT COLUMN ---
  let cardCellContent = [];
  if (cardCol) {
    // The cardCol contains another grid with text/title/desc/link
    const cardGrid = cardCol.querySelector('.aem-Grid');
    if (cardGrid) {
      // Collect ALL .cmp-text and .cmp-title blocks in order
      const blocks = Array.from(cardGrid.querySelectorAll('.cmp-text, .cmp-title'));
      blocks.forEach((block) => {
        cardCellContent.push(block);
      });
    }
  }

  // Build the table rows
  const headerRow = ['Columns block (columns1)'];
  const contentRow = [imageCellContent, cardCellContent];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
