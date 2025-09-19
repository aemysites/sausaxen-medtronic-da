/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid containing both the image and the text
  let slideGrid = null;
  const grids = element.querySelectorAll('.aem-Grid');
  for (const grid of grids) {
    const hasImage = grid.querySelector('.image');
    const hasText = grid.querySelector('.wide-card');
    if (hasImage && hasText) {
      slideGrid = grid;
      break;
    }
  }
  if (!slideGrid) return;

  // Get the image element (reference, not clone)
  const imageContainer = slideGrid.querySelector('.image');
  let imgEl = null;
  if (imageContainer) {
    imgEl = imageContainer.querySelector('img');
  }

  // Get the text content from .wide-card
  let textCellContent = [];
  const textContainer = slideGrid.querySelector('.wide-card');
  if (textContainer) {
    const textGrid = textContainer.querySelector('.aem-Grid');
    if (textGrid) {
      // Only direct children (columns)
      const blocks = Array.from(textGrid.children);
      blocks.forEach((block) => {
        // Find the content div inside each block
        const contentDiv = block.querySelector('div');
        if (contentDiv) {
          textCellContent.push(contentDiv);
        }
      });
    }
  }

  // Table header row (must match block name exactly)
  const headerRow = ['Carousel (carousel2)'];
  // Table slide row: [image, text content]
  const slideRow = [imgEl, textCellContent];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    slideRow,
  ], document);

  element.replaceWith(table);
}
