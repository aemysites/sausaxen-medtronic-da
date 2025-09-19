/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required
  const headerRow = ['Columns block (columns6)'];

  // Defensive: find the main grid that holds the two columns
  const mainGrid = element.querySelector('.aem-Grid.aem-Grid--8, .aem-Grid.aem-Grid--tablet--10, .aem-Grid.aem-Grid--default--8, .aem-Grid.aem-Grid--phone--9');
  if (!mainGrid) return;

  // Find the two main column containers (text and image)
  const columns = Array.from(mainGrid.children).filter((child) => {
    // One is text (wide-card), one is image
    return (
      child.classList.contains('wide-card') ||
      child.classList.contains('image')
    );
  });

  // Defensive: must have exactly 2 columns
  if (columns.length !== 2) return;

  // --- Left Column: All text blocks ---
  const leftCol = columns.find(col => col.classList.contains('wide-card'));
  let leftColContent = [];
  if (leftCol) {
    // Get all direct children that are text or title blocks
    const textBlocks = Array.from(leftCol.querySelectorAll(':scope > div > div > div'));
    // Only keep those with .cmp-text or .cmp-title
    textBlocks.forEach(block => {
      const inner = block.querySelector('.cmp-text, .cmp-title');
      if (inner) leftColContent.push(inner);
    });
  }

  // --- Right Column: Image ---
  const rightCol = columns.find(col => col.classList.contains('image'));
  let rightColContent = [];
  if (rightCol) {
    // Find the image element
    const imgWrap = rightCol.querySelector('.cmp-image');
    if (imgWrap) {
      const img = imgWrap.querySelector('img');
      if (img) rightColContent.push(img);
    }
  }

  // Build the table rows
  const tableRows = [
    headerRow,
    [leftColContent, rightColContent],
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element
  element.replaceWith(block);
}
