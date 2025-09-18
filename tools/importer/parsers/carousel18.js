/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel root
  const carousel = element.querySelector('.carousel.panelcontainer.carousel-no-action-buttons.carousel-slider');
  if (!carousel) return;

  // Find the cmp-carousel__content which contains all slides
  const carouselContent = carousel.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // Get all slides
  const slides = carouselContent.querySelectorAll('.cmp-carousel__item');

  // Prepare table rows
  const rows = [];
  // Always use the required header row
  rows.push(['Carousel (carousel18)']);

  slides.forEach((slide) => {
    // Each slide has two main columns: image and text content
    let imageCell = '';
    let textCell = '';

    // Defensive: find .image inside this slide
    const imageCol = slide.querySelector('.image');
    if (imageCol) {
      // Use the actual <img> element inside
      const img = imageCol.querySelector('img');
      if (img) {
        imageCell = img;
      }
    }

    // Find the text content column (the card-module container)
    const cardCol = slide.querySelector('.card-module');
    if (cardCol) {
      // We'll collect all text content in order: eyebrow, title, description, CTA
      const textContent = [];
      // Eyebrow (first .cmp-text inside .eyebrow2)
      const eyebrow = cardCol.querySelector('.eyebrow2 .cmp-text');
      if (eyebrow) {
        const p = eyebrow.querySelector('p');
        if (p) textContent.push(p);
      }
      // Title (first .cmp-title)
      const title = cardCol.querySelector('.cmp-title');
      if (title) {
        const heading = title.querySelector('h1, h2, h3, h4, h5, h6');
        if (heading) textContent.push(heading);
      }
      // Description and CTA (all .cmp-text)
      const cmpTexts = cardCol.querySelectorAll('.cmp-text');
      cmpTexts.forEach((cmpText) => {
        const p = cmpText.querySelector('p');
        if (p && !textContent.includes(p)) {
          const a = p.querySelector('a');
          if (a && p.childNodes.length === 1) {
            textContent.push(p); // CTA
          } else {
            textContent.push(p); // Description
          }
        }
      });
      textCell = textContent;
    }

    rows.push([
      imageCell || '',
      textCell || '',
    ]);
  });

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
