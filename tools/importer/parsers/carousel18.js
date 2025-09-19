/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel content block
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // Table header
  const headerRow = ['Carousel (carousel18)'];
  const rows = [headerRow];

  // Get all carousel slides
  const slides = Array.from(carouselContent.querySelectorAll(':scope > .cmp-carousel__item'));

  slides.forEach((slide) => {
    // --- IMAGE COLUMN ---
    let imageCell = null;
    const imageBlock = slide.querySelector('.cmp-image img');
    if (imageBlock) {
      // Reference the actual image element
      imageCell = imageBlock;
    }

    // --- TEXT COLUMN ---
    const textColumn = [];

    // Eyebrow (first .cmp-text p)
    const eyebrowBlock = slide.querySelector('.cmp-text p');
    if (eyebrowBlock) {
      textColumn.push(eyebrowBlock.cloneNode(true));
    }

    // Title (h3.cmp-title__text)
    const titleBlock = slide.querySelector('.cmp-title__text');
    if (titleBlock) {
      textColumn.push(titleBlock.cloneNode(true));
    }

    // Description(s): all .cmp-text (after eyebrow) that are not just CTA
    const textBlocks = Array.from(slide.querySelectorAll('.cmp-text'));
    textBlocks.forEach((block, idx) => {
      // Only consider blocks after the first (eyebrow)
      if (idx === 0) return;
      const p = block.querySelector('p');
      if (p) {
        // If this is a CTA ("See how"), skip for now
        const a = p.querySelector('a');
        if (!a || p.textContent.trim().toLowerCase() !== 'see how') {
          textColumn.push(p.cloneNode(true));
        }
      }
    });

    // CTA: last .cmp-text p containing a link with text "See how"
    let ctaBlock = null;
    for (let i = textBlocks.length - 1; i >= 0; i--) {
      const p = textBlocks[i].querySelector('p');
      if (p) {
        const a = p.querySelector('a');
        if (a && p.textContent.trim().toLowerCase() === 'see how') {
          ctaBlock = p.cloneNode(true);
          break;
        }
      }
    }
    if (ctaBlock) {
      textColumn.push(ctaBlock);
    }

    // Add row for this slide
    rows.push([
      imageCell,
      textColumn.length > 0 ? textColumn : ''
    ]);
  });

  // Create and replace with table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
