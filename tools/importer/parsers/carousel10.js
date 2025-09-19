/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract background image URL from style attribute
  function extractBgUrl(style) {
    if (!style) return null;
    const match = style.match(/background-image:\s*url\(['"]?(.*?)['"]?\)/);
    if (match && match[1]) {
      let url = match[1];
      // Remove escaped characters
      url = url.replace(/\\2f /g, '/').replace(/\\/g, '');
      // If relative, prepend origin
      if (url.startsWith('/')) {
        url = window.location.origin + url;
      }
      return url;
    }
    return null;
  }

  // Helper to create an image element from a URL
  function createImg(url) {
    if (!url) return null;
    const img = document.createElement('img');
    img.src = url;
    img.loading = 'lazy';
    return img;
  }

  // Find the carousel block
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Get all slides
  const slides = carousel.querySelectorAll('.cmp-carousel__item');

  // Table header
  const headerRow = ['Carousel (carousel10)'];
  const rows = [headerRow];

  slides.forEach((slide) => {
    // Find the hero container with background image
    const hero = slide.querySelector('.hero-module');
    let imgUrl = null;
    if (hero) {
      const heroBg = hero.querySelector('.cmp-container');
      if (heroBg) {
        imgUrl = extractBgUrl(heroBg.getAttribute('style'));
      }
    }
    const imgEl = createImg(imgUrl);

    // Compose text content
    const textContent = document.createElement('div');
    // Eyebrow
    const eyebrow = slide.querySelector('.eyebrow2 .cmp-text');
    if (eyebrow) {
      textContent.appendChild(eyebrow.cloneNode(true));
    }
    // Heading/title
    let heading = slide.querySelector('.text:not(.eyebrow2) .cmp-text h1, .text:not(.eyebrow2) .cmp-text h2, .text:not(.eyebrow2) .cmp-text h3');
    if (!heading) {
      // Sometimes heading is inside .cmp-text directly
      heading = slide.querySelector('.cmp-text h1, .cmp-text h2, .cmp-text h3');
    }
    if (heading) {
      textContent.appendChild(heading.cloneNode(true));
    }
    // Intro/description
    const intro = slide.querySelector('.intro-heading .cmp-text');
    if (intro) {
      textContent.appendChild(intro.cloneNode(true));
    }
    // Additional description
    const desc = slide.querySelector('.text.no-bottom-margin-p .cmp-text');
    if (desc) {
      textContent.appendChild(desc.cloneNode(true));
    }
    // CTA button
    const button = slide.querySelector('.button .cmp-button');
    if (button) {
      textContent.appendChild(button.cloneNode(true));
    }
    // ISI/ISW link
    const isiIsw = slide.querySelector('.isi-isw .redirect-isi-isw, .isi-isw .ext_link');
    if (isiIsw) {
      textContent.appendChild(isiIsw.cloneNode(true));
    }

    // Only add text cell if it has content
    const textCell = textContent.childNodes.length > 0 ? textContent : '';
    rows.push([imgEl, textCell]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
