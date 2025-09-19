/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate child divs
  function getImmediateDivs(el) {
    return Array.from(el.querySelectorAll(':scope > div'));
  }

  // Find the main grid container (the first aem-Grid inside the top container)
  let mainGrid = element.querySelector('.aem-Grid');
  if (!mainGrid) {
    mainGrid = getImmediateDivs(element)[0];
  }

  // Only use columns that have actual content (image or text block)
  let columns = getImmediateDivs(mainGrid).filter(col => {
    // Check for image, cmp-title, cmp-text, or non-empty text
    if (col.querySelector('img')) return true;
    if (col.querySelector('.cmp-title')) return true;
    if (col.querySelector('.cmp-text')) return true;
    if (col.textContent && col.textContent.trim().length > 0) return true;
    return false;
  });

  // For each column, collect all visible content (images, text, etc)
  const secondRow = columns.map((col) => {
    // If column contains an image, include the image element
    const img = col.querySelector('img');
    // Collect all .cmp-title and .cmp-text blocks (in order)
    const textEls = Array.from(col.querySelectorAll('.cmp-title, .cmp-text'));
    let content = [];
    // Get all direct children in column, in order
    Array.from(col.children).forEach(child => {
      if (child.querySelector('img')) {
        const image = child.querySelector('img');
        if (image) content.push(image);
      }
      if (child.classList.contains('cmp-title') || child.classList.contains('cmp-text')) {
        content.push(child);
      }
    });
    // Fallback: if nothing found, try image and textEls
    if (content.length === 0) {
      if (img) content.push(img);
      if (textEls.length) content = content.concat(textEls);
    }
    // If still empty, fallback to all text content
    if (content.length === 0) {
      const txt = col.textContent.trim();
      if (txt) content.push(txt);
    }
    // If only one element, don't wrap in array
    if (content.length === 1) return content[0];
    return content;
  })
  // Remove empty cells from the row
  .filter(cell => {
    if (!cell) return false;
    if (Array.isArray(cell) && cell.length === 0) return false;
    if (typeof cell === 'string' && cell.trim().length === 0) return false;
    // If cell is an element and has no text and no children, treat as empty
    if (cell.nodeType === 1 && !cell.textContent.trim() && !cell.children.length) return false;
    return true;
  });

  // Remove leading empty columns if any
  while (secondRow.length && (secondRow[0] == null || (Array.isArray(secondRow[0]) && secondRow[0].length === 0) || (typeof secondRow[0] === 'string' && secondRow[0].trim().length === 0) || (secondRow[0].nodeType === 1 && !secondRow[0].textContent.trim() && !secondRow[0].children.length))) {
    secondRow.shift();
  }

  const headerRow = ['Columns block (columns1)'];
  const cells = [
    headerRow,
    secondRow
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
