/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract background image url from style attribute
  function extractBgImageUrl(style) {
    if (!style) return null;
    const match = style.match(/background-image\s*:\s*url\(['"]?(.*?)['"]?\)/i);
    if (match && match[1]) {
      let url = match[1];
      // Unescape encoded slashes
      url = url.replace(/\\2f /g, '/').replace(/\\2f/g, '/');
      url = url.replace(/\s/g, '');
      // Remove leading slash if present
      if (url.startsWith('/')) url = url.slice(1);
      return url;
    }
    return null;
  }

  // Find the carousel block
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Get all slide items
  const items = carousel.querySelectorAll('.cmp-carousel__item');

  // Table header
  const headerRow = ['Carousel (carousel20)'];
  const rows = [headerRow];

  items.forEach((item) => {
    // Find image background from the hero container
    const heroContainer = item.querySelector('.hero-module');
    let imageUrl = null;
    let imageEl = null;
    if (heroContainer) {
      const cmpContainer = heroContainer.querySelector('.cmp-container');
      if (cmpContainer) {
        imageUrl = extractBgImageUrl(cmpContainer.getAttribute('style'));
        if (imageUrl) {
          imageEl = document.createElement('img');
          imageEl.src = imageUrl;
        }
      }
    }

    // Compose text content (title, description, CTA)
    const textCells = [];
    // Eyebrow (optional)
    const eyebrow = item.querySelector('.eyebrow2 .cmp-text');
    if (eyebrow) {
      textCells.push(eyebrow);
    }
    // Title (h2/h3)
    let title = item.querySelector('.cmp-text h2, .cmp-text h3');
    if (title) {
      textCells.push(title);
    }
    // Intro heading (optional)
    const intro = item.querySelector('.intro-heading .cmp-text');
    if (intro) {
      textCells.push(intro);
    }
    // Description (first p after title)
    const desc = item.querySelector('.no-bottom-margin-p .cmp-text, .top-margin-sm .cmp-text');
    if (desc) {
      textCells.push(desc);
    }
    // CTA button (if present)
    const button = item.querySelector('.button .cmp-button');
    if (button) {
      textCells.push(button);
    }
    // ISI/Warnings (if present)
    const isi = item.querySelector('.isi-isw .pull-left.position-isi');
    if (isi) {
      textCells.push(isi);
    }

    // If no text content, use empty string
    const textContent = textCells.length ? textCells : '';

    // Add row: [image, textContent]
    rows.push([imageEl, textContent]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(block);
}
