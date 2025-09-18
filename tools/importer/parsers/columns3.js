/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get immediate children by selector
  function getDirectChildren(parent, selector) {
    return Array.from(parent.children).filter(el => el.matches(selector));
  }

  // Find the two main columns: left (text), right (image)
  // The structure is deeply nested, so we need to traverse down to the two columns
  // 1. Find the first .aem-Grid with both a text and image column
  let mainGrid = element.querySelector('.aem-Grid.aem-Grid--tablet--12');
  if (!mainGrid) mainGrid = element.querySelector('.aem-Grid.aem-Grid--12');
  if (!mainGrid) return;

  // Find the two column containers (text and image)
  const columns = [];
  // Text column: look for .container.responsivegrid.card-module.text.wide-card
  let textCol = mainGrid.querySelector(
    '.container.responsivegrid.card-module.text.wide-card'
  );
  // Image column: look for .image (direct child of mainGrid)
  let imageCol = mainGrid.querySelector('.image');

  // Defensive: If not found, try fallback
  if (!textCol) {
    // Try any .container.responsivegrid with a .cmp-text inside
    textCol = Array.from(mainGrid.querySelectorAll('.container.responsivegrid')).find(c => c.querySelector('.cmp-text'));
  }
  if (!imageCol) {
    imageCol = Array.from(mainGrid.querySelectorAll('.image')).find(c => c.querySelector('img'));
  }

  // Build left column content (text block)
  let leftContent = [];
  if (textCol) {
    // Find all direct .cmp-text and .cmp-title blocks in order
    const grid = textCol.querySelector('.aem-Grid');
    if (grid) {
      const textBlocks = Array.from(grid.children).map(child => {
        // Only include .cmp-text or .cmp-title
        const txt = child.querySelector('.cmp-text');
        const ttl = child.querySelector('.cmp-title');
        if (txt) return txt;
        if (ttl) return ttl;
        return null;
      }).filter(Boolean);
      leftContent = textBlocks;
    } else {
      // Fallback: just grab all .cmp-text and .cmp-title inside textCol
      leftContent = Array.from(textCol.querySelectorAll('.cmp-text, .cmp-title'));
    }
  }

  // Build right column content (image)
  let rightContent = [];
  if (imageCol) {
    // Find the .cmp-image inside imageCol
    const cmpImage = imageCol.querySelector('.cmp-image');
    if (cmpImage) {
      const img = cmpImage.querySelector('img');
      if (img) rightContent = [img];
    }
  }

  // Compose the table rows
  const headerRow = ['Columns (columns3)'];
  const contentRow = [leftContent, rightContent];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
