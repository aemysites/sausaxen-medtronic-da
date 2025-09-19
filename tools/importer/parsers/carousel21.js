/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract background-image url from style attribute
  function extractBgImageUrl(style) {
    if (!style) return null;
    const match = style.match(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/i);
    if (match && match[1]) {
      // Handle encoded slashes
      return match[1].replace(/\\2f /g, '/').replace(/ /g, '');
    }
    return null;
  }

  // Find all slides
  const slides = Array.from(element.querySelectorAll('.cmp-carousel__item'));
  const rows = [];

  // Always start with the required header row
  const headerRow = ['Carousel (carousel21)'];
  rows.push(headerRow);

  slides.forEach((slide) => {
    // Find the main container with background image
    const bgContainer = slide.querySelector('.cmp-container[style*="background-image"]');
    let imgEl = null;
    if (bgContainer) {
      const bgUrl = extractBgImageUrl(bgContainer.getAttribute('style'));
      if (bgUrl) {
        imgEl = document.createElement('img');
        imgEl.src = bgUrl;
      }
    }

    // Find the content container (with text/button)
    // Use the innermost .cmp-container with text/button children
    let contentContainer = null;
    const containers = slide.querySelectorAll('.cmp-container');
    containers.forEach((c) => {
      if (
        c.querySelector('.cmp-title, .cmp-text, .cmp-button') &&
        (!contentContainer || c.querySelector('.cmp-title'))
      ) {
        contentContainer = c;
      }
    });

    // Compose the right cell content by collecting all text elements in order
    let rightCellContent = [];
    if (contentContainer) {
      // Eyebrow (optional)
      const eyebrow = contentContainer.querySelector('.eyebrow2 .cmp-text');
      if (eyebrow) rightCellContent.push(eyebrow);
      // Title (h2)
      const title = contentContainer.querySelector('.cmp-title');
      if (title) rightCellContent.push(title);
      // All .cmp-text elements (excluding eyebrow) in order
      const cmpTexts = Array.from(contentContainer.querySelectorAll('.cmp-text'));
      cmpTexts.forEach((txt) => {
        if (!eyebrow || txt !== eyebrow) {
          // Avoid duplicate if already added as eyebrow
          rightCellContent.push(txt);
        }
      });
      // CTA button (link)
      const btn = contentContainer.querySelector('.cmp-button');
      if (btn) rightCellContent.push(btn);
    }
    // Remove duplicates
    rightCellContent = Array.from(new Set(rightCellContent));
    if (rightCellContent.length === 1) rightCellContent = rightCellContent[0];
    if (rightCellContent.length === 0) rightCellContent = '';

    // Add the row: [image, text content]
    rows.push([
      imgEl || '',
      rightCellContent,
    ]);
  });

  // Build the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
