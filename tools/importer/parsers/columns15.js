/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get all direct children with a class
  function getDirectChildrenByClass(parent, className) {
    return Array.from(parent.children).filter(child => child.classList.contains(className));
  }

  // Find the two main columns in the visual layout
  // 1. Left column: contains the blue bar image, mission text, heading, description, link
  // 2. Right column: contains the large illustration image

  // The structure is deeply nested, so we need to traverse down to the two main columns
  // Step 1: Find the first .aem-Grid with 8 columns (left+right)
  const outerGrid = element.querySelector('.aem-Grid.aem-Grid--8');
  if (!outerGrid) return;

  // Step 2: Find the left and right column containers
  // Left: .container.responsivegrid.left-pad.right-pad
  // Right: .image.aem-GridColumn--default--5
  let leftCol, rightCol;
  const children = Array.from(outerGrid.children);
  // The left column is the first .container.responsivegrid
  leftCol = children.find(child => child.classList.contains('container') && child.classList.contains('responsivegrid'));
  // The right column is the first .image (not inside leftCol)
  rightCol = children.find(child => child.classList.contains('image'));

  // Defensive: If not found, fallback to first and second child
  if (!leftCol || !rightCol) {
    leftCol = children[0];
    rightCol = children[1];
  }

  // LEFT COLUMN: Compose all content blocks in leftCol
  // It has a .aem-Grid with 3 content blocks: blue bar image, eyebrow text, heading, description, link
  let leftContent = [];
  const leftGrid = leftCol.querySelector('.aem-Grid');
  if (leftGrid) {
    const leftBlocks = Array.from(leftGrid.children);
    leftBlocks.forEach(block => {
      // Only add blocks that have content
      if (block.textContent.trim() || block.querySelector('img')) {
        leftContent.push(block);
      }
    });
  } else {
    leftContent.push(leftCol);
  }

  // RIGHT COLUMN: The image is inside a .cmp-image
  let rightContent = [];
  const cmpImage = rightCol.querySelector('.cmp-image');
  if (cmpImage) {
    rightContent.push(cmpImage);
  } else {
    // fallback: any images
    const imgs = rightCol.querySelectorAll('img');
    rightContent = Array.from(imgs);
  }

  // Compose the table rows
  const headerRow = ['Columns (columns15)'];
  const contentRow = [leftContent, rightContent];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
