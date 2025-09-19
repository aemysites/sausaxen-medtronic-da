/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get immediate children matching selector
  function getDirectChildren(parent, selector) {
    return Array.from(parent.children).filter(child => child.matches(selector));
  }

  // Find the innermost grid containing the two column children
  let grid = element;
  // Defensive: descend until we find a grid with two main children (text and image)
  let found = false;
  while (!found && grid) {
    const grids = grid.querySelectorAll(':scope > .aem-Grid');
    for (const g of grids) {
      // Look for a grid with two direct children, one with image, one with text
      const children = Array.from(g.children);
      const hasImage = children.some(c => c.classList.contains('image'));
      const hasText = children.some(c => c.classList.contains('text'));
      if (children.length === 2 && hasImage && hasText) {
        grid = g;
        found = true;
        break;
      }
    }
    if (!found) {
      // Go one level deeper
      const next = grid.querySelector(':scope > .cmp-container, :scope > .aem-Grid');
      if (next && next !== grid) {
        grid = next;
      } else {
        break;
      }
    }
  }

  // Fallback: If not found, try to find the two main columns manually
  let leftCol, rightCol;
  if (found) {
    // Two children: one text, one image
    const children = Array.from(grid.children);
    leftCol = children.find(c => c.classList.contains('container')) || children.find(c => c.classList.contains('text'));
    rightCol = children.find(c => c.classList.contains('image'));
  } else {
    // Defensive: try to find first container/text and first image
    leftCol = element.querySelector('.container, .text');
    rightCol = element.querySelector('.image');
  }

  // Left column: gather all text blocks and eyebrow bar image
  let leftContent = [];
  if (leftCol) {
    // Find all .image and .text blocks inside leftCol
    const eyebrowImgWrap = leftCol.querySelector('.image');
    if (eyebrowImgWrap) {
      leftContent.push(eyebrowImgWrap);
    }
    const textBlocks = leftCol.querySelectorAll('.text');
    textBlocks.forEach(tb => {
      leftContent.push(tb);
    });
  }

  // Right column: main image
  let rightContent = [];
  if (rightCol) {
    // Defensive: if rightCol contains .cmp-image, use that
    const cmpImg = rightCol.querySelector('.cmp-image');
    if (cmpImg) {
      rightContent.push(cmpImg);
    } else {
      rightContent.push(rightCol);
    }
  }

  // Table structure
  const headerRow = ['Columns (columns15)'];
  const contentRow = [leftContent, rightContent];

  // Create block table
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
