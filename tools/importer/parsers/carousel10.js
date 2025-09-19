/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract background image URL from inline style
  function extractBgUrl(style) {
    if (!style) return null;
    const match = style.match(/background-image:\s*url\(['"]?(.*?)['"]?\)/);
    if (match && match[1]) {
      let url = match[1];
      // Remove escaped slashes
      url = url.replace(/\\2f /g, '/').replace(/\\2f/g, '/').replace(/\s/g, '');
      // If relative, prepend origin
      if (url.startsWith('/')) {
        url = document.location.origin + url;
      }
      return url;
    }
    return null;
  }

  // Helper to create an <img> from a background-image style
  function bgImgElement(style) {
    const url = extractBgUrl(style);
    if (!url) return null;
    const img = document.createElement('img');
    img.src = url;
    img.loading = 'lazy';
    return img;
  }

  // Find carousel items
  const carouselRoot = element.querySelector('.cmp-carousel__content');
  if (!carouselRoot) return;
  const items = carouselRoot.querySelectorAll(':scope > .cmp-carousel__item');

  // Table header
  const headerRow = ['Carousel (carousel10)'];
  const rows = [headerRow];

  items.forEach((item) => {
    // Find image (from background-image style)
    let img = null;
    let textCellContent = [];

    // Find the hero container with background-image
    const hero = item.querySelector('.hero-module');
    if (hero) {
      const heroBg = hero.querySelector('.cmp-container[style*="background-image"]');
      if (heroBg) {
        img = bgImgElement(heroBg.getAttribute('style'));
      }
      // Find all text blocks inside the hero
      const textBlocks = heroBg ? heroBg.querySelectorAll('.cmp-text') : [];
      textBlocks.forEach((tb) => {
        // Only add if not empty
        if (tb.textContent.trim()) {
          textCellContent.push(tb);
        }
      });
      // Find CTA button (if present)
      const btn = heroBg ? heroBg.querySelector('.cmp-button') : null;
      if (btn) {
        textCellContent.push(btn);
      }
      // Find ISI/ISW link (if present)
      const isiIsw = heroBg ? heroBg.querySelector('.isi-isw a') : null;
      if (isiIsw) {
        textCellContent.push(isiIsw);
      }
    }

    // Defensive: If no image found, skip this slide
    if (!img) return;
    // Defensive: If no text, use empty string
    if (textCellContent.length === 0) textCellContent = [''];

    rows.push([img, textCellContent]);
  });

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
