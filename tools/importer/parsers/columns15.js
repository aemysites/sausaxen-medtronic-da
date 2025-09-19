/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get all immediate children of a given element matching a selector
  function getDirectChildren(parent, selector) {
    return Array.from(parent.children).filter((el) => el.matches(selector));
  }

  // Find the deepest grid with two main children (left and right columns)
  let mainGrid = element.querySelector('.aem-Grid.aem-Grid--8');
  if (!mainGrid) {
    // Fallback: try to find the first .aem-Grid with at least two children
    mainGrid = element.querySelectorAll('.aem-Grid');
    mainGrid = Array.from(mainGrid).find(g => g.children.length >= 2);
  }
  if (!mainGrid) return;

  // Find left column (text + blue bar image) and right column (graphic image)
  const leftColContainer = mainGrid.querySelector('.container');
  const rightColImage = Array.from(mainGrid.children).find(
    (el) => el.classList.contains('image')
  );

  // Defensive: If not found, fallback to first/second child
  let leftColContent;
  if (leftColContainer) {
    const leftGrid = leftColContainer.querySelector('.aem-Grid');
    if (leftGrid) {
      leftColContent = Array.from(leftGrid.children);
    } else {
      leftColContent = Array.from(leftColContainer.children);
    }
  }

  // Compose left column cell: blue bar image, mission heading, subheading, description, and link
  let leftCellElements = [];
  if (leftColContent) {
    leftColContent.forEach((el) => {
      if (el.classList.contains('image')) {
        // Only include blue bar image (height=6)
        const img = el.querySelector('img');
        if (img && img.height === 6) {
          leftCellElements.push(el);
        }
      }
      if (el.classList.contains('text')) {
        leftCellElements.push(el);
      }
    });
  }

  // Compose right column cell: main graphic image
  let rightCellElements = [];
  if (rightColImage) {
    const img = rightColImage.querySelector('img');
    if (img && img.height > 100) {
      rightCellElements.push(rightColImage);
    }
  }

  // Defensive: If not found, fallback to first/second child of mainGrid
  if (leftCellElements.length === 0 && mainGrid.children[0]) {
    leftCellElements = [mainGrid.children[0]];
  }
  if (rightCellElements.length === 0 && mainGrid.children[1]) {
    rightCellElements = [mainGrid.children[1]];
  }

  // Step 2: Build table rows
  const headerRow = ['Columns (columns15)'];
  const contentRow = [leftCellElements, rightCellElements];

  // Step 3: Create table and replace
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
