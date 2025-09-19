/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid containing the columns
  const grid = element.querySelector('.aem-Grid.aem-Grid--12, .aem-Grid.aem-Grid--default--12, .aem-Grid.aem-Grid--tablet--12');
  if (!grid) return;

  // Find all direct children that are columns (text or image)
  const columns = [];
  Array.from(grid.children).forEach((child) => {
    // Text column: contains .cmp-text or .cmp-title
    if (child.querySelector('.cmp-text, .cmp-title')) {
      const innerGrid = child.querySelector('.aem-Grid');
      let colContent = [];
      if (innerGrid) {
        Array.from(innerGrid.children).forEach((block) => {
          const textEl = block.querySelector('.cmp-text');
          const titleEl = block.querySelector('.cmp-title');
          if (textEl) colContent.push(textEl);
          if (titleEl) colContent.push(titleEl);
        });
      } else {
        colContent = Array.from(child.querySelectorAll('.cmp-text, .cmp-title'));
      }
      if (colContent.length) columns.push(colContent.length === 1 ? colContent[0] : colContent);
    }
    // Image column
    if (child.classList.contains('image')) {
      const imgEl = child.querySelector('img');
      if (imgEl) columns.push(imgEl);
    }
  });

  // Only proceed if we have at least two columns
  if (columns.length < 2) return;

  // Compose the table
  const headerRow = ['Columns block (columns3)'];
  const cells = [headerRow, columns];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element to ensure DOM is modified
  element.replaceWith(block);
}
