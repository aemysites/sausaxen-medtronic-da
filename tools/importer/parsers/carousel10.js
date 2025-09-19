/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract image from background-image style
  function extractBgImageUrl(style) {
    if (!style) return null;
    const match = style.match(/background-image:\s*url\(([^)]+)\)/);
    if (match && match[1]) {
      let url = match[1].trim();
      // Remove any escaped chars
      url = url.replace(/\\/g, '');
      // Remove surrounding quotes if present
      url = url.replace(/^['"]|['"]$/g, '');
      // If relative, prepend origin
      if (url.startsWith('/')) {
        url = window.location.origin + url;
      }
      return url;
    }
    return null;
  }

  // Find carousel block
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const items = carousel.querySelectorAll('.cmp-carousel__item');

  // Table header
  const headerRow = ['Carousel (carousel10)'];
  const rows = [headerRow];

  items.forEach((item) => {
    // Each slide
    // Find hero container with background image
    const hero = item.querySelector('.hero-module');
    let imgEl = null;
    if (hero) {
      const cmpContainer = hero.querySelector('.cmp-container');
      if (cmpContainer) {
        const bgUrl = extractBgImageUrl(cmpContainer.getAttribute('style'));
        if (bgUrl) {
          imgEl = document.createElement('img');
          imgEl.src = bgUrl;
          imgEl.loading = 'lazy';
        }
      }
    }

    // Compose text cell
    const textCellContent = [];
    // Eyebrow
    const eyebrow = item.querySelector('.eyebrow2 .cmp-text');
    if (eyebrow) {
      // Use <p> only
      const p = eyebrow.querySelector('p');
      if (p) textCellContent.push(p);
    }
    // Title (h2 or h3)
    let title = item.querySelector('.text .cmp-text h2, .text .cmp-text h3');
    if (title) textCellContent.push(title);
    // Intro/description
    const intro = item.querySelector('.intro-heading .cmp-text p');
    if (intro) textCellContent.push(intro);
    // Additional description
    const desc = item.querySelector('.text.no-bottom-margin-p .cmp-text p');
    if (desc) textCellContent.push(desc);
    // CTA button
    const button = item.querySelector('.button a.cmp-button, .button a.cmp-button.ext_link');
    if (button) textCellContent.push(button);
    // ISI/ISW link (safety/warnings)
    const isiLink = item.querySelector('.isi-isw a');
    if (isiLink) textCellContent.push(isiLink);

    rows.push([
      imgEl || '',
      textCellContent.length ? textCellContent : '',
    ]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
