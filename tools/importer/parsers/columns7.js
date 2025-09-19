/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid containing the two columns
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Find the two main columns (image and content)
  const columns = Array.from(grid.children).filter(child => child.classList.contains('aem-GridColumn'));
  if (columns.length < 2) return;

  // LEFT COLUMN: Find the image element (reference, do not clone)
  let leftImage = null;
  const imageCol = columns[0];
  const cmpImage = imageCol.querySelector('.cmp-image img');
  if (cmpImage) {
    leftImage = cmpImage;
  }

  // RIGHT COLUMN: Compose the right content (eyebrow, title, description)
  const rightCol = columns[1];
  let rightContent = document.createDocumentFragment();
  const rightContainer = rightCol.querySelector('.cmp-container');
  if (rightContainer) {
    const rightGrid = rightContainer.querySelector('.aem-Grid');
    if (rightGrid) {
      // Eyebrow (optional)
      const eyebrow = rightGrid.querySelector('.eyebrow2 .cmp-text');
      if (eyebrow) {
        Array.from(eyebrow.childNodes).forEach(node => rightContent.appendChild(node.cloneNode(true)));
      }
      // Title (h3)
      const title = rightGrid.querySelector('.cmp-title .cmp-title__text');
      if (title) {
        rightContent.appendChild(title.cloneNode(true));
      }
      // Description (p)
      const desc = rightGrid.querySelector('.no-bottom-margin-p .cmp-text');
      if (desc) {
        Array.from(desc.childNodes).forEach(node => rightContent.appendChild(node.cloneNode(true)));
      }
    }
  }

  // Build the table rows
  const headerRow = ['Columns block (columns7)'];
  const contentRow = [leftImage, rightContent];

  // Create the table (using references, not clones, for images)
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
