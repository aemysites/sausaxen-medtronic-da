/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract background-image url from style string
  function extractBgUrl(style) {
    if (!style) return null;
    const match = style.match(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/i);
    if (match && match[1]) {
      // Clean up escaped slashes
      return match[1].replace(/\\/g, '');
    }
    return null;
  }

  // Helper to create an <img> from a background-image style
  function bgImgToImgEl(style, alt = '') {
    const url = extractBgUrl(style);
    if (!url) return null;
    const img = document.createElement('img');
    img.src = url;
    if (alt) img.alt = alt;
    return img;
  }

  // Find all carousel items (slides)
  const slides = Array.from(element.querySelectorAll(':scope > .cmp-carousel__item'));
  const rows = [];
  // Header row as per block guidelines
  const headerRow = ['Carousel (carousel16)'];
  rows.push(headerRow);

  slides.forEach((slide) => {
    // Find the hero container with background image
    const hero = slide.querySelector('.lg-hero.hero-module');
    let imgEl = null;
    let altText = '';
    let textCellContent = [];
    if (hero) {
      const bgDiv = hero.querySelector('.cmp-container[style*="background-image"]');
      if (bgDiv) {
        // Try to find a title for alt text
        const titleEl = bgDiv.querySelector('.cmp-title__text');
        if (titleEl) {
          altText = titleEl.textContent.trim();
        }
        imgEl = bgImgToImgEl(bgDiv.getAttribute('style'), altText);

        // Eyebrow (optional)
        const eyebrow = bgDiv.querySelector('.eyebrow2 .cmp-text p');
        if (eyebrow) {
          const eyebrowClone = document.createElement('div');
          eyebrowClone.textContent = eyebrow.textContent;
          textCellContent.push(eyebrowClone);
        }
        // Title (h2)
        const title = bgDiv.querySelector('.cmp-title__text');
        if (title) {
          const titleClone = document.createElement('h2');
          titleClone.textContent = title.textContent;
          textCellContent.push(titleClone);
        }
        // Description (p)
        const desc = bgDiv.querySelector('.no-top-margin .cmp-text p, .no-top-margin.no-bottom-margin-p .cmp-text p');
        if (desc) {
          const descClone = document.createElement('p');
          descClone.textContent = desc.textContent;
          textCellContent.push(descClone);
        }
        // CTA button (a)
        const btn = bgDiv.querySelector('.button a.cmp-button');
        if (btn) {
          const btnClone = btn.cloneNode(true);
          textCellContent.push(btnClone);
        }
      }
    }
    // Defensive: fallback if no image found
    if (!imgEl) {
      imgEl = document.createElement('img');
      imgEl.alt = altText || '';
    }
    // Defensive: if nothing found, leave cell empty
    if (textCellContent.length === 0) textCellContent = [''];

    rows.push([imgEl, textCellContent]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
