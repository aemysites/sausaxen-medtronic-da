/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid containing the two columns
  const grid = element.querySelector('.aem-Grid--8') || element.querySelector('.aem-Grid--12') || element;
  if (!grid) return;

  // Find the image column (left)
  const imageCol = Array.from(grid.children).find(child => child.classList.contains('image'));
  let imageEl = null;
  if (imageCol) {
    imageEl = imageCol.querySelector('img');
  }

  // Find the content column (right)
  const contentCol = Array.from(grid.children).find(child => child.classList.contains('wide-card'));
  let contentFragment = document.createDocumentFragment();
  if (contentCol) {
    // Get all content blocks in the content column, preserving order and semantics
    const contentGrid = contentCol.querySelector('.aem-Grid') || contentCol;
    Array.from(contentGrid.children).forEach(block => {
      // Only append blocks with actual content
      const cmpText = block.querySelector('.cmp-text');
      const cmpTitle = block.querySelector('.cmp-title');
      if (cmpText) {
        // Append all children (preserve p, a, etc.)
        Array.from(cmpText.childNodes).forEach(n => contentFragment.appendChild(n.cloneNode(true)));
      } else if (cmpTitle) {
        Array.from(cmpTitle.childNodes).forEach(n => contentFragment.appendChild(n.cloneNode(true)));
      }
    });
  }

  // Compose the table rows
  const headerRow = ['Columns block (columns1)'];
  const contentRow = [imageEl, contentFragment];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
