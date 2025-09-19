/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel block
  const carousel = element.querySelector('.carousel, .cmp-carousel');
  if (!carousel) return;

  // Find carousel content
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Get all carousel items
  const items = Array.from(content.querySelectorAll('.cmp-carousel__item'));
  if (!items.length) return;

  // Table header must match the block name exactly
  const headerRow = ['Carousel (carousel18)'];
  const rows = [headerRow];

  items.forEach((item) => {
    // --- IMAGE CELL ---
    let imageCell = null;
    const imageBlock = item.querySelector('.image .cmp-image');
    if (imageBlock) {
      const img = imageBlock.querySelector('img');
      if (img) {
        imageCell = img;
      }
    }
    if (!imageCell) return; // skip slide if no image

    // --- TEXT CELL ---
    const textCell = document.createElement('div');
    textCell.style.display = 'contents'; // avoid extra wrapper
    const cardModule = item.querySelector('.card-module');
    if (cardModule) {
      // Eyebrow (optional, usually first)
      const eyebrow = cardModule.querySelector('.eyebrow2 .cmp-text p');
      if (eyebrow) {
        textCell.appendChild(eyebrow.cloneNode(true));
      }
      // Title (h3, required)
      const title = cardModule.querySelector('.cmp-title__text');
      if (title) {
        textCell.appendChild(title.cloneNode(true));
      }
      // Description (all .cmp-text not eyebrow or CTA)
      const descBlocks = Array.from(cardModule.querySelectorAll('.cmp-text'));
      descBlocks.forEach((block) => {
        // Only add paragraphs that are not eyebrow or CTA
        if (!block.classList.contains('eyebrow2')) {
          const p = block.querySelector('p');
          if (p && (!p.querySelector('a') || p.textContent.trim() !== 'See how')) {
            textCell.appendChild(p.cloneNode(true));
          }
        }
      });
      // CTA (last .cmp-text p with a link)
      const cta = Array.from(cardModule.querySelectorAll('.cmp-text p a')).pop();
      if (cta) {
        const ctaP = document.createElement('p');
        ctaP.appendChild(cta.cloneNode(true));
        textCell.appendChild(ctaP);
      }
    }
    rows.push([imageCell, textCell]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
