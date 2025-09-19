/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel root
  const carousel = element.querySelector('.carousel.panelcontainer, .carousel');
  if (!carousel) return;

  // Find the cmp-carousel__content container
  const cmpContent = carousel.querySelector('.cmp-carousel__content');
  if (!cmpContent) return;

  // Get all slide items
  const slides = cmpContent.querySelectorAll('.cmp-carousel__item');
  if (!slides.length) return;

  // Prepare table rows
  const rows = [];
  // Header row
  rows.push(['Carousel (carousel18)']);

  slides.forEach((slide) => {
    // Each slide has two main columns: image and text
    // Find the image (first .image .cmp-image img)
    let imgEl = null;
    const imageContainer = slide.querySelector('.image .cmp-image');
    if (imageContainer) {
      imgEl = imageContainer.querySelector('img');
    }

    // Find the text content (the card module)
    let textContent = null;
    const cardModule = slide.querySelector('.card-module');
    if (cardModule) {
      // We'll collect eyebrow, title, description, CTA in order
      const contentParts = [];
      // Eyebrow (optional)
      const eyebrow = cardModule.querySelector('.eyebrow2 .cmp-text');
      if (eyebrow) {
        // Use the p element directly
        const p = eyebrow.querySelector('p');
        if (p) contentParts.push(p);
      }
      // Title (h3 with link)
      const title = cardModule.querySelector('.title .cmp-title__text');
      if (title) {
        // Use the h3 element directly
        contentParts.push(title);
      }
      // Description (first .cmp-text after title)
      // Find all .cmp-text in cardModule
      const allTexts = cardModule.querySelectorAll('.cmp-text');
      // Exclude eyebrow (already added) and CTA (which is a link only)
      allTexts.forEach((cmpText) => {
        // If this cmp-text contains a link only, treat as CTA
        const p = cmpText.querySelector('p');
        const onlyLink = p && p.querySelector('a') && p.childNodes.length === 1;
        // If it's not eyebrow, not CTA, and not already added
        if (
          !cmpText.closest('.eyebrow2') &&
          !onlyLink &&
          (!p || !contentParts.includes(p))
        ) {
          // Add the p element (description)
          if (p) contentParts.push(p);
        }
      });
      // CTA (link in .cmp-text)
      allTexts.forEach((cmpText) => {
        const p = cmpText.querySelector('p');
        if (p && p.querySelector('a') && p.childNodes.length === 1) {
          // Only the link
          contentParts.push(p);
        }
      });
      // Wrap all content in a div for the cell
      if (contentParts.length) {
        const div = document.createElement('div');
        contentParts.forEach((el) => div.appendChild(el.cloneNode(true)));
        textContent = div;
      }
    }
    // Add the row: [image, textContent]
    rows.push([
      imgEl || '',
      textContent || ''
    ]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original carousel with the table
  carousel.replaceWith(table);
}
