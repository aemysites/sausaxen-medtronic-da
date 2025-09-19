/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract image from background-image style
  function extractBgImageUrl(style) {
    if (!style) return null;
    const match = style.match(/background-image\s*:\s*url\(([^)]+)\)/);
    if (match && match[1]) {
      let url = match[1].replace(/\\2f /g, '/').replace(/\\/g, '');
      // Remove quotes if present
      url = url.replace(/^['"]|['"]$/g, '');
      // If the URL is relative, prepend origin
      if (url.startsWith('/')) {
        url = document.location.origin + url;
      }
      return url;
    }
    return null;
  }

  // Helper to create an img element from a background image
  function createImgFromBg(style) {
    const url = extractBgImageUrl(style);
    if (!url) return null;
    const img = document.createElement('img');
    img.src = url;
    img.loading = 'lazy';
    return img;
  }

  // Find the carousel root
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Get all carousel items
  const items = carousel.querySelectorAll('.cmp-carousel__item');

  // Table header
  const headerRow = ['Carousel (carousel10)'];
  const rows = [headerRow];

  items.forEach((item) => {
    // Find the hero image container (should have background-image)
    const heroModule = item.querySelector('.hero-module');
    let imgEl = null;
    if (heroModule && heroModule.firstElementChild) {
      const bgStyle = heroModule.firstElementChild.getAttribute('style');
      imgEl = createImgFromBg(bgStyle);
    }
    // Defensive fallback: if no image found, skip this slide
    if (!imgEl) return;

    // Find the main text container (the innermost cmp-container)
    let textContainer = null;
    // The text content is inside a cmp-container with several .text children
    const containers = item.querySelectorAll('.cmp-container');
    containers.forEach((container) => {
      // Look for .text children
      if (container.querySelector('.text')) {
        textContainer = container;
      }
    });

    // Defensive: if no textContainer, skip
    if (!textContainer) return;

    // Compose the text cell
    // We'll collect all .text blocks, .button, and .isi-isw in order
    const textCellContent = [];
    // All .text blocks (order matters)
    textContainer.querySelectorAll('.text').forEach((t) => {
      textCellContent.push(t);
    });
    // Button (call-to-action)
    const button = textContainer.querySelector('.button');
    if (button) {
      textCellContent.push(button);
    }
    // ISI/ISW (additional info)
    const isiIsw = textContainer.querySelector('.isi-isw');
    if (isiIsw) {
      textCellContent.push(isiIsw);
    }

    rows.push([imgEl, textCellContent]);
  });

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
