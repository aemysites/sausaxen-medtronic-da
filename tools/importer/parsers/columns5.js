/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid containing the two columns
  const mainGrid = element.querySelector('.aem-Grid.aem-Grid--8, .aem-Grid.aem-Grid--tablet--12, .aem-Grid.aem-Grid--default--8, .aem-Grid.aem-Grid--phone--10');
  if (!mainGrid) return;

  // Find the two main columns: image and content
  let imageCol, contentCol;
  const gridChildren = Array.from(mainGrid.children);
  gridChildren.forEach((child) => {
    if (!imageCol && child.querySelector('img')) imageCol = child;
    else if (!contentCol && child.querySelector('.cmp-container')) contentCol = child;
  });
  if (!imageCol || !contentCol) return;

  // Get the image element (clone for replacement)
  const img = imageCol.querySelector('img');
  const imgClone = img ? img.cloneNode(true) : document.createElement('div');

  // Get the content container inside the right column
  const contentContainer = contentCol.querySelector('.cmp-container');
  if (!contentContainer) return;
  const contentGrid = contentContainer.querySelector('.aem-Grid');
  if (!contentGrid) return;

  // Gather content blocks in order: eyebrow, title, description, link
  const contentBlocks = [];
  Array.from(contentGrid.children).forEach((child) => {
    if (child.querySelector('.cmp-text, .cmp-title')) {
      // Instead of appending, collect the HTML as string
      contentBlocks.push(child.innerHTML);
    }
  });

  // Compose the right column cell as a single HTML string
  const rightColDiv = document.createElement('div');
  rightColDiv.innerHTML = contentBlocks.join('');

  // Build the table rows
  const headerRow = ['Columns block (columns5)'];
  const contentRow = [imgClone, rightColDiv];

  // Create the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element
  if (table) element.replaceWith(table);
}
