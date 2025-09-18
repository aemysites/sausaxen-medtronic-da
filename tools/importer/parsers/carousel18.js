/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel block
  const carousel = element.querySelector('.carousel.panelcontainer.carousel-slider');
  if (!carousel) return;
  const cmpCarouselContent = carousel.querySelector('.cmp-carousel__content');
  if (!cmpCarouselContent) return;

  // Get all carousel slides
  const slides = Array.from(cmpCarouselContent.querySelectorAll('.cmp-carousel__item'));
  if (slides.length === 0) return;

  // Table header: block name only
  const headerRow = ['Carousel (carousel18)'];
  const rows = [headerRow];

  slides.forEach((slide) => {
    // --- First column: Image ---
    let imageEl = null;
    const imageContainer = slide.querySelector('.image .cmp-image');
    if (imageContainer) {
      const img = imageContainer.querySelector('img');
      if (img) imageEl = img;
    }
    // Fallback: any img in slide
    if (!imageEl) {
      imageEl = slide.querySelector('img');
    }

    // --- Second column: Text content ---
    const cardContainer = slide.querySelector('.wide-card');
    const textNodes = [];
    if (cardContainer) {
      // Eyebrow (optional)
      const eyebrow = cardContainer.querySelector('.eyebrow2 .cmp-text p');
      if (eyebrow) textNodes.push(eyebrow);
      // Title (h3)
      const title = cardContainer.querySelector('.cmp-title__text');
      if (title) textNodes.push(title);
      // Description (first .cmp-text after title)
      const descriptions = cardContainer.querySelectorAll('.no-bottom-margin-p .cmp-text p');
      if (descriptions.length > 0) {
        textNodes.push(descriptions[0]);
        // CTA (if present)
        if (descriptions.length > 1) textNodes.push(descriptions[1]);
      }
    }
    // Fallback: any .cmp-title__text, .cmp-text p in slide
    if (textNodes.length === 0) {
      const fallbackTitle = slide.querySelector('.cmp-title__text');
      if (fallbackTitle) textNodes.push(fallbackTitle);
      slide.querySelectorAll('.cmp-text p').forEach((p) => textNodes.push(p));
    }

    // Only reference elements, do not clone or create new ones
    const row = [imageEl, textNodes];
    rows.push(row);
  });

  // Create the carousel block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(blockTable);
}
