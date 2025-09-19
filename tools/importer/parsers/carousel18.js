/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find all carousel items
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // Get all slides
  const slides = Array.from(carouselContent.querySelectorAll('.cmp-carousel__item'));
  if (!slides.length) return;

  // Table header
  const headerRow = ['Carousel (carousel18)'];
  const rows = [headerRow];

  slides.forEach((slide) => {
    // Each slide: find image and text content
    let imageCell = null;
    let textCell = null;

    // Find image container
    const imageContainer = slide.querySelector('.image');
    if (imageContainer) {
      // Use the actual image element (with link if present)
      const cmpImage = imageContainer.querySelector('.cmp-image');
      if (cmpImage) {
        imageCell = cmpImage;
      }
    }

    // Find text content container (card-module)
    const cardModule = slide.querySelector('.card-module');
    if (cardModule) {
      // We'll collect eyebrow, title, description, CTA
      const textFragments = [];

      // Eyebrow (optional)
      const eyebrow = cardModule.querySelector('.eyebrow2 .cmp-text');
      if (eyebrow) {
        textFragments.push(eyebrow);
      }

      // Title (h3)
      const title = cardModule.querySelector('.title .cmp-title');
      if (title) {
        textFragments.push(title);
      }

      // Description(s)
      const descriptions = cardModule.querySelectorAll('.no-bottom-margin-p .cmp-text');
      descriptions.forEach(desc => {
        // Only add if not a CTA
        const link = desc.querySelector('a');
        if (link && link.textContent && link.textContent.trim().toLowerCase() === 'see how') {
          // This is the CTA, add last
        } else {
          textFragments.push(desc);
        }
      });

      // CTA ("See how")
      descriptions.forEach(desc => {
        const link = desc.querySelector('a');
        if (link && link.textContent && link.textContent.trim().toLowerCase() === 'see how') {
          textFragments.push(desc);
        }
      });

      // Compose text cell
      if (textFragments.length) {
        textCell = textFragments;
      }
    }

    // Defensive: if no text cell, use empty string
    rows.push([imageCell, textCell || '']);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
