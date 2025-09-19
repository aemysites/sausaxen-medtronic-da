/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel root
  const carouselRoot = element.querySelector('.carousel.panelcontainer');
  if (!carouselRoot) return;

  // Find the carousel content container
  const carouselContent = carouselRoot.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // Get all carousel items
  const items = carouselContent.querySelectorAll('.cmp-carousel__item');
  if (!items.length) return;

  // Prepare the table rows
  const rows = [];
  // Header row: must match block name exactly
  rows.push(['Carousel (carousel18)']);

  items.forEach((item) => {
    // --- Image cell ---
    let imgCell = '';
    const imageCol = item.querySelector('.image .cmp-image');
    if (imageCol) {
      const img = imageCol.querySelector('img');
      if (img) {
        imgCell = img;
      }
    }

    // --- Text cell ---
    let textCell = '';
    const cardModule = item.querySelector('.card-module');
    if (cardModule) {
      // Compose content: eyebrow, title, description, CTA
      const contentParts = [];
      // Eyebrow (optional)
      const eyebrow = cardModule.querySelector('.eyebrow2 .cmp-text p');
      if (eyebrow) {
        contentParts.push(eyebrow.cloneNode(true));
      }
      // Title (optional)
      const title = cardModule.querySelector('.title .cmp-title__text');
      if (title) {
        contentParts.push(title.cloneNode(true));
      }
      // Description(s) and CTA(s)
      const textBlocks = cardModule.querySelectorAll('.text.no-bottom-margin-p .cmp-text p');
      textBlocks.forEach((p) => {
        contentParts.push(p.cloneNode(true));
      });
      // Only add if there's content
      if (contentParts.length) {
        // Wrap in a div for semantic grouping
        const textDiv = document.createElement('div');
        contentParts.forEach((el) => textDiv.appendChild(el));
        textCell = textDiv;
      }
    }

    rows.push([imgCell, textCell]);
  });

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
