/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get background image URL from inline style
  function getBgImageUrl(style) {
    if (!style) return null;
    const match = style.match(/background-image\s*:\s*url\(([^)]+)\)/);
    if (match && match[1]) {
      let url = match[1].replace(/\\2f /g, '/').replace(/\\/g, '');
      url = url.replace(/^['"]|['"]$/g, '');
      return url;
    }
    return null;
  }

  // Helper to create an <img> from a background image URL
  function createImg(url) {
    if (!url) return null;
    const img = document.createElement('img');
    img.src = url;
    img.loading = 'lazy';
    return img;
  }

  // Helper to extract all text content blocks from the text container
  function extractTextContent(textContainer) {
    const content = [];
    // Eyebrow (optional)
    const eyebrow = textContainer.querySelector('.eyebrow2 .cmp-text');
    if (eyebrow) {
      content.push(eyebrow.cloneNode(true));
    }
    // Title (h2)
    const title = textContainer.querySelector('.title .cmp-title__text');
    if (title) {
      content.push(title.cloneNode(true));
    }
    // All description paragraphs (not eyebrow)
    const descBlocks = textContainer.querySelectorAll('.text:not(.eyebrow2) .cmp-text p');
    descBlocks.forEach(p => {
      content.push(p.cloneNode(true));
    });
    // CTA button (optional)
    const button = textContainer.querySelector('.button a.cmp-button');
    if (button) {
      content.push(button.cloneNode(true));
    }
    return content.length > 0 ? content : [''];
  }

  // Find all carousels in the block
  const carousels = Array.from(element.querySelectorAll(':scope > div.carousel'));
  const headerRow = ['Carousel (carousel16)'];
  const rows = [headerRow];

  carousels.forEach(carousel => {
    // Each carousel has .cmp-carousel__content > .cmp-carousel__item (one per slide)
    const items = Array.from(carousel.querySelectorAll('.cmp-carousel__content > .cmp-carousel__item'));
    items.forEach(item => {
      // Find the image background
      const heroContainer = item.querySelector('.cmp-container[style*="background-image"]');
      const bgUrl = heroContainer ? getBgImageUrl(heroContainer.getAttribute('style')) : null;
      const img = bgUrl ? createImg(bgUrl) : '';

      // Find the text content container (usually a .cmp-container inside the hero)
      let textContainer = null;
      const sectionContainer = heroContainer ? heroContainer.querySelector('.section .cmp-container') : null;
      if (sectionContainer) {
        textContainer = sectionContainer;
      }

      // Compose the text cell
      let textCellContent = [''];
      if (textContainer) {
        textCellContent = extractTextContent(textContainer);
      }

      rows.push([
        img,
        textCellContent
      ]);
    });
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
