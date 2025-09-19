/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid for the columns
  let mainGrid = element.querySelector('.aem-Grid.aem-Grid--8') || element.querySelector('.aem-Grid.aem-Grid--12');
  if (!mainGrid) {
    mainGrid = element.querySelector('.aem-Grid');
  }
  if (!mainGrid) {
    mainGrid = element;
  }

  // Find all direct children that are columns (container or image)
  const columns = Array.from(mainGrid.children).filter((c) =>
    c.classList.contains('container') || c.classList.contains('image')
  );

  // For each column, extract all content blocks (text, image, etc.)
  const contentRow = columns.map((col) => {
    // If it's a container, flatten its cmp-container > .aem-Grid > children
    if (col.classList.contains('container')) {
      const cmpContainer = col.querySelector('.cmp-container');
      const innerGrid = cmpContainer ? cmpContainer.querySelector('.aem-Grid') : null;
      if (innerGrid) {
        // Collect all content blocks (text, image, etc.)
        return Array.from(innerGrid.children).map((child) => {
          // If child contains .cmp-text, return that node
          const cmpText = child.querySelector('.cmp-text');
          if (cmpText) return cmpText;
          // If child contains an image, return the <img>
          const img = child.querySelector('img');
          if (img) return img;
          // Otherwise, return the child itself
          return child;
        });
      } else if (cmpContainer) {
        // Fallback: just return cmp-container's children
        return Array.from(cmpContainer.children);
      } else {
        // Fallback: just return the col
        return [col];
      }
    } else if (col.classList.contains('image')) {
      // For image columns, just return the <img> if present
      const img = col.querySelector('img');
      if (img) return [img];
      return [col];
    }
    return [col];
  });

  // Flatten any single-element arrays
  const normalizedContentRow = contentRow.map((cell) => (cell.length === 1 ? cell[0] : cell));

  const headerRow = ['Columns (columns15)'];
  const cells = [headerRow, normalizedContentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
