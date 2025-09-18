/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate children by selector
  function getImmediateChildren(el, selector) {
    return Array.from(el.querySelectorAll(':scope > ' + selector));
  }

  // Find the main grid containing the two columns
  let mainGrid = element.querySelector('.aem-Grid.aem-Grid--8') || element.querySelector('.aem-Grid.aem-Grid--tablet--10');
  if (!mainGrid) {
    // Defensive fallback: try to find the deepest .aem-Grid with two children
    const allGrids = element.querySelectorAll('.aem-Grid');
    mainGrid = Array.from(allGrids).reverse().find(g => getImmediateChildren(g, 'div').length === 2);
  }
  if (!mainGrid) return;

  // Get the two column containers
  const columns = getImmediateChildren(mainGrid, 'div');
  if (columns.length < 2) return;

  // --- First column: mission text ---
  const leftCol = columns[0];
  // Instead of picking only specific blocks, grab all content in leftCol
  // This ensures we don't miss any text
  const leftContentBlocks = Array.from(leftCol.querySelectorAll(':scope > div'));
  const leftCellContent = [];
  leftContentBlocks.forEach(block => {
    // If block contains .cmp-text, add all its children
    const cmpText = block.querySelector('.cmp-text');
    if (cmpText) {
      Array.from(cmpText.childNodes).forEach(node => {
        leftCellContent.push(node.cloneNode(true));
      });
    }
    // If block contains an image, add it
    const img = block.querySelector('img');
    if (img) {
      leftCellContent.push(img.cloneNode(true));
    }
  });

  // --- Second column: image ---
  const rightCol = columns[1];
  // Grab all images and text in rightCol
  const rightCellContent = [];
  const rightBlocks = Array.from(rightCol.querySelectorAll(':scope > div'));
  rightBlocks.forEach(block => {
    // Add images
    const img = block.querySelector('img');
    if (img) {
      rightCellContent.push(img.cloneNode(true));
    }
    // Add all text nodes from .cmp-text
    const cmpText = block.querySelector('.cmp-text');
    if (cmpText) {
      Array.from(cmpText.childNodes).forEach(node => {
        rightCellContent.push(node.cloneNode(true));
      });
    }
  });

  // Table header
  const headerRow = ['Columns (columns15)'];
  // Table second row: two columns
  const secondRow = [leftCellContent, rightCellContent];

  // Create table
  const table = WebImporter.DOMUtils.createTable([headerRow, secondRow], document);

  // Replace the original element
  element.replaceWith(table);
}
