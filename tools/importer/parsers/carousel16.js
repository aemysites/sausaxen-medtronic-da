/* global WebImporter */
export default function parse(element, { document }) {
  // Only process carousel actions container
  if (!element.classList.contains('cmp-carousel__actions')) return;

  // Block header row must be exactly one column
  const headerRow = ['Carousel (carousel16)'];
  const rows = [headerRow];

  // Find the carousel root (assume parent of actions)
  const carousel = element.closest('.cmp-carousel');
  if (carousel) {
    // Find all slides using less specific selector for flexibility
    // Accept any direct child with 'slide' in class, but only if it contains an image
    const slides = Array.from(carousel.querySelectorAll('[class*="slide"]'));
    slides.forEach((slide) => {
      // Image: look for <img> inside the slide
      const imgEl = slide.querySelector('img');
      let imgCell = '';
      if (imgEl) {
        imgCell = imgEl.cloneNode(true);
      } else {
        // If no image, skip this slide (image is mandatory)
        return;
      }
      // Text content: include all visible text and links inside the slide
      let textCell = '';
      const textFragments = [];
      // Headings
      slide.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(h => {
        const heading = document.createElement(h.tagName.toLowerCase());
        heading.textContent = h.textContent.trim();
        textFragments.push(heading);
      });
      // Paragraphs
      slide.querySelectorAll('p').forEach(p => {
        const para = document.createElement('p');
        para.textContent = p.textContent.trim();
        textFragments.push(para);
      });
      // Links
      slide.querySelectorAll('a').forEach(a => {
        const link = document.createElement('a');
        link.href = a.href;
        link.textContent = a.textContent.trim();
        textFragments.push(link);
      });
      // If no headings/paragraphs/links, fallback to all text
      if (textFragments.length === 0) {
        const text = slide.textContent.trim();
        if (text) {
          const div = document.createElement('div');
          div.textContent = text;
          textFragments.push(div);
        }
      }
      if (textFragments.length > 0) {
        const container = document.createElement('div');
        textFragments.forEach(f => container.appendChild(f));
        textCell = container;
      }
      rows.push([imgCell, textCell]);
    });
  }

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
