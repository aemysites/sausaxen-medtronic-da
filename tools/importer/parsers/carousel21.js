/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Extract background-image URL from inline style string
  function extractBgImageUrl(style) {
    if (!style) return null;
    const match = style.match(/background-image:\s*url\(([^)]+)\)/);
    if (match && match[1]) {
      let url = match[1].replace(/(^['"]|['"]$)/g, '');
      url = url.replace(/\\2f/g, '/').replace(/\s/g, '');
      url = url.replace(/^\//, '');
      if (!/^https?:\/\//.test(url)) url = '/' + url;
      return url;
    }
    return null;
  }

  // Find all carousel items
  const items = Array.from(element.querySelectorAll(':scope > .cmp-carousel__item'));
  if (items.length === 0) {
    const fallback = element.querySelectorAll(':scope > div');
    if (fallback.length === 1) {
      items.push(fallback[0]);
    }
  }

  const rows = [];
  const headerRow = ['Carousel (carousel21)'];
  rows.push(headerRow);

  items.forEach((item) => {
    // Find the main container with background image
    const bgContainer = item.querySelector('.cmp-container[style*="background-image"]');
    let imageElem = null;
    if (bgContainer) {
      const bgUrl = extractBgImageUrl(bgContainer.getAttribute('style'));
      if (bgUrl) {
        imageElem = document.createElement('img');
        imageElem.src = bgUrl;
        imageElem.setAttribute('loading', 'lazy');
      }
    }

    // Compose text content cell
    let textCellContent = [];
    // Find all .cmp-container children (for flexibility)
    const contentContainers = bgContainer ? bgContainer.querySelectorAll('.cmp-container') : [];
    if (contentContainers.length === 0 && bgContainer) {
      // Sometimes the content is directly inside bgContainer
      contentContainers[0] = bgContainer;
    }
    // Collect all text from all .cmp-container children
    contentContainers.forEach((contentContainer) => {
      // Eyebrow
      const eyebrow = contentContainer.querySelector('.eyebrow2 .cmp-text p');
      if (eyebrow) {
        const eyebrowP = document.createElement('p');
        eyebrowP.textContent = eyebrow.textContent;
        eyebrowP.style.fontSize = '0.85em';
        eyebrowP.style.letterSpacing = '0.05em';
        textCellContent.push(eyebrowP);
      }
      // Title
      const title = contentContainer.querySelector('.title .cmp-title__text');
      if (title) {
        const h2 = document.createElement('h2');
        h2.textContent = title.textContent;
        textCellContent.push(h2);
      }
      // All paragraphs in .text:not(.eyebrow2)
      const descPs = contentContainer.querySelectorAll('.text:not(.eyebrow2) .cmp-text p');
      descPs.forEach((desc) => {
        const descP = document.createElement('p');
        descP.textContent = desc.textContent;
        textCellContent.push(descP);
      });
      // CTA Button
      const btn = contentContainer.querySelector('.button a.cmp-button');
      if (btn) {
        const link = document.createElement('a');
        link.href = btn.href;
        link.textContent = btn.querySelector('.cmp-button__text')?.textContent || btn.textContent;
        link.className = 'carousel-cta';
        textCellContent.push(link);
      }
    });
    // Defensive: If no content, fallback to empty string
    if (textCellContent.length === 0) textCellContent = [''];

    rows.push([imageElem || '', textCellContent]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
