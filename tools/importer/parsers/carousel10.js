/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract background image URL from style attribute
  function getBgImageUrl(style) {
    if (!style) return null;
    const match = style.match(/background-image:\s*url\(([^)]+)\)/);
    if (match && match[1]) {
      let url = match[1].replace(/\\2f/g, '/').replace(/\\/g, '');
      url = url.replace(/^['"]|['"]$/g, '');
      // Remove spaces at start/end and in path
      url = url.trim().replace(/\s+/g, '');
      return url;
    }
    return null;
  }

  // Find carousel block
  const carousel = element.querySelector('.cmp-carousel__content');
  if (!carousel) return;

  // Get all slides
  const slides = Array.from(carousel.querySelectorAll(':scope > .cmp-carousel__item'));

  // Table header
  const headerRow = ['Carousel (carousel10)'];
  const rows = [headerRow];

  slides.forEach(slide => {
    // Find hero image (background-image)
    let heroImgUrl = null;
    let heroImgElem = null;
    // Find the deepest .cmp-container with background-image
    const containers = slide.querySelectorAll('.cmp-container');
    for (const c of containers) {
      const url = getBgImageUrl(c.getAttribute('style'));
      if (url) {
        heroImgUrl = url;
        break;
      }
    }
    if (heroImgUrl) {
      heroImgElem = document.createElement('img');
      heroImgElem.src = heroImgUrl;
      heroImgElem.alt = '';
      heroImgElem.loading = 'lazy';
    }

    // Find text content container (the innermost .cmp-container with text/buttons)
    let textContainer = null;
    for (const c of containers) {
      // If it contains .cmp-text or .cmp-button, it's the right one
      if (c.querySelector('.cmp-text, .cmp-button')) {
        textContainer = c;
        break;
      }
    }
    if (!textContainer) textContainer = slide;

    // Compose text cell contents
    const textCellContent = [];
    const eyebrow = textContainer.querySelector('.eyebrow2 .cmp-text');
    if (eyebrow) {
      textCellContent.push(eyebrow);
    }
    const heading = textContainer.querySelector('h2, h3');
    if (heading) {
      textCellContent.push(heading);
    }
    const paragraphs = textContainer.querySelectorAll('.cmp-text p');
    paragraphs.forEach(p => {
      if (!textCellContent.includes(p.parentElement)) {
        textCellContent.push(p);
      }
    });
    const button = textContainer.querySelector('.cmp-button');
    if (button) {
      textCellContent.push(button);
    }
    const isiLink = textContainer.querySelector('.isi-isw a');
    if (isiLink) {
      textCellContent.push(isiLink);
    }

    rows.push([
      heroImgElem || '',
      textCellContent.length ? textCellContent : ''
    ]);
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
