/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest grid containing the two columns
  let grid = element;
  while (grid.querySelector(':scope > .aem-Grid')) {
    grid = grid.querySelector(':scope > .aem-Grid');
  }

  // Get the two column containers (text and image)
  const containers = Array.from(grid.children).filter(child =>
    child.classList.contains('container') || child.classList.contains('image')
  );

  // Defensive fallback if not found
  let textCol = null;
  let imageCol = null;
  if (containers.length === 2) {
    // Heuristic: text is usually the first, image the second
    if (containers[0].classList.contains('container')) {
      textCol = containers[0];
      imageCol = containers[1];
    } else {
      imageCol = containers[0];
      textCol = containers[1];
    }
  } else {
    textCol = grid.querySelector('.container');
    imageCol = grid.querySelector('.image');
  }

  // --- Column 1: Gather all text content (including headings, links, etc.) ---
  let textContent = [];
  if (textCol) {
    // Select all direct children that are .text or .title
    const textParts = Array.from(textCol.querySelectorAll(':scope > .text, :scope > .title'));
    textParts.forEach(part => {
      // Grab the inner div (which contains the actual content)
      const content = part.querySelector(':scope > div');
      if (content) {
        textContent.push(...Array.from(content.childNodes));
      }
    });
  }

  // --- Column 2: Image ---
  let imageContent = null;
  if (imageCol) {
    const img = imageCol.querySelector('img');
    if (img) {
      imageContent = img;
    }
  }

  // Compose the content row, ensuring all text content is included
  const contentRow = [textContent, imageContent].filter(cell => cell && (Array.isArray(cell) ? cell.length : true));

  // Always use the correct header row
  const headerRow = ['Columns block (columns6)'];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element with the new block table
  element.replaceWith(table);
}
