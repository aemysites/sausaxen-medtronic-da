/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel root
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Find all slides
  const slides = carousel.querySelectorAll('.cmp-carousel__item');

  // Build header row
  const headerRow = ['Carousel (carousel18)'];
  const rows = [headerRow];

  slides.forEach((slide) => {
    // Each slide: find image (first col), text content (second col)
    let imageCell = '';
    let textCell = '';

    // Find image
    const imageDiv = slide.querySelector('.image');
    if (imageDiv) {
      const img = imageDiv.querySelector('img');
      if (img) {
        imageCell = img;
      }
    }

    // Find text content (the card-module container)
    const cardModule = slide.querySelector('.card-module');
    if (cardModule) {
      // We'll collect all relevant text blocks in order
      const textBlocks = [];
      // Eyebrow (optional)
      const eyebrow = cardModule.querySelector('.eyebrow2 .cmp-text');
      if (eyebrow) {
        textBlocks.push(eyebrow);
      }
      // Title (should be h3 inside .title)
      const title = cardModule.querySelector('.title .cmp-title');
      if (title) {
        textBlocks.push(title);
      }
      // Description and CTA
      const descs = cardModule.querySelectorAll('.no-bottom-margin-p .cmp-text');
      if (descs.length > 0) {
        for (let i = 0; i < descs.length; i++) {
          textBlocks.push(descs[i]);
        }
      }
      textCell = textBlocks;
    }

    rows.push([imageCell, textCell]);
  });

  // Create table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
