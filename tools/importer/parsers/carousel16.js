/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel root element
  let carouselRoot = element.closest('.cmp-carousel');
  if (!carouselRoot) carouselRoot = element.parentElement;
  if (!carouselRoot) return;

  // Find all slides (be less specific)
  let slides = carouselRoot.querySelectorAll('.cmp-carousel__slide');
  if (!slides.length) slides = carouselRoot.querySelectorAll(':scope > div');
  if (!slides.length) slides = [carouselRoot]; // fallback: treat root as slide

  const headerRow = ['Carousel (carousel16)']; // Header row must be ONE column only
  const rows = [headerRow];

  slides.forEach((slide) => {
    // First cell: image
    let img = slide.querySelector('img');
    if (!img) {
      // Try background-image
      const bg = slide.style.backgroundImage;
      if (bg && bg.startsWith('url(')) {
        const url = bg.slice(4, -1).replace(/"/g, '');
        img = document.createElement('img');
        img.src = url;
      }
    }
    if (!img) return;

    // Second cell: gather all text content (be less specific)
    const cellContent = document.createElement('div');
    let hasContent = false;

    // Gather all text blocks except navigation buttons
    Array.from(slide.childNodes).forEach((node) => {
      if (node.nodeType === 1) { // Element
        if (
          node.matches('img') ||
          node.classList.contains('cmp-carousel__actions') ||
          node.classList.contains('cmp-carousel__action')
        ) {
          return;
        }
        cellContent.appendChild(node.cloneNode(true));
        hasContent = true;
      } else if (node.nodeType === 3 && node.textContent.trim()) { // Text
        const p = document.createElement('p');
        p.textContent = node.textContent.trim();
        cellContent.appendChild(p);
        hasContent = true;
      }
    });

    // If still no content, try to get any heading or paragraph inside
    if (!hasContent) {
      const heading = slide.querySelector('h1, h2, h3, .cmp-carousel__title');
      if (heading) {
        cellContent.appendChild(heading.cloneNode(true));
        hasContent = true;
      }
      const descs = slide.querySelectorAll('p, .cmp-carousel__description');
      descs.forEach((desc) => {
        cellContent.appendChild(desc.cloneNode(true));
        hasContent = true;
      });
      const cta = slide.querySelector('a');
      if (cta) {
        cellContent.appendChild(cta.cloneNode(true));
        hasContent = true;
      }
    }

    // Always push two columns per row (second cell empty if no content)
    rows.push([img, hasContent ? cellContent : '']);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
