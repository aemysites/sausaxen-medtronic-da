/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract background-image url from style string
  function extractBgUrl(style) {
    if (!style) return null;
    const match = style.match(/background-image:\s*url\(["']?(.*?)["']?\)/i);
    if (match && match[1]) {
      // Remove escaped chars (e.g., \2f)
      let url = match[1].replace(/\\([0-9a-f]{2})/gi, (m, hex) => String.fromCharCode(parseInt(hex, 16)));
      url = url.replace(/^\/\//, '/');
      url = url.replace(/\s+/g, '');
      return url;
    }
    return null;
  }

  // Helper to build a slide row: [image, content]
  function buildSlideRow(carouselItem) {
    // Find the deepest container with background-image
    let bgContainer = carouselItem.querySelector('[style*="background-image"]');
    let imageUrl = bgContainer ? extractBgUrl(bgContainer.getAttribute('style')) : null;
    let imgEl = null;
    if (imageUrl) {
      imgEl = document.createElement('img');
      imgEl.src = imageUrl;
      imgEl.setAttribute('loading', 'lazy');
    }

    // Find the content container (the innermost .cmp-container inside the slide)
    let contentContainer = carouselItem.querySelector('.cmp-container');
    let contentElements = [];
    if (contentContainer) {
      // Get all direct children in order, and collect their text content
      Array.from(contentContainer.children).forEach((child) => {
        // Eyebrow
        const eyebrow = child.querySelector('.eyebrow2 .cmp-text');
        if (eyebrow) {
          contentElements.push(eyebrow.cloneNode(true));
        }
        // Title
        const title = child.querySelector('.title .cmp-title__text');
        if (title) {
          if (title.tagName.toLowerCase() === 'h2') {
            contentElements.push(title.cloneNode(true));
          } else {
            const h2 = document.createElement('h2');
            h2.innerHTML = title.innerHTML;
            contentElements.push(h2);
          }
        }
        // Description (any .cmp-text not in eyebrow)
        const descs = child.querySelectorAll('.cmp-text');
        descs.forEach((desc) => {
          if (!desc.closest('.eyebrow2')) {
            contentElements.push(desc.cloneNode(true));
          }
        });
        // CTA
        const btn = child.querySelector('.button a.cmp-button');
        if (btn) {
          contentElements.push(btn.cloneNode(true));
        }
      });
    }
    // Remove duplicates (by node outerHTML)
    const seen = new Set();
    contentElements = contentElements.filter((el) => {
      const html = el.outerHTML;
      if (seen.has(html)) return false;
      seen.add(html);
      return true;
    });
    return [imgEl, contentElements.length ? contentElements : ''];
  }

  const carousels = Array.from(element.querySelectorAll('.carousel, .carousel-slider'));
  const rows = [];
  const headerRow = ['Carousel (carousel16)'];
  rows.push(headerRow);

  carousels.forEach((carousel) => {
    const content = carousel.querySelector('.cmp-carousel__content');
    if (!content) return;
    const items = Array.from(content.querySelectorAll('.cmp-carousel__item'));
    items.forEach((item) => {
      rows.push(buildSlideRow(item));
    });
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
