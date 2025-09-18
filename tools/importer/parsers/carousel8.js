/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as required
  const headerRow = ['Carousel (carousel8)'];

  // Extract background image from container style
  let bgImgUrl = '';
  const containerDiv = element.querySelector('.cmp-container[style*="background-image"]');
  if (containerDiv && containerDiv.style.backgroundImage) {
    const match = containerDiv.style.backgroundImage.match(/url\(([^)]+)\)/);
    if (match && match[1]) {
      bgImgUrl = match[1]
        .replace(/\\2f /g, '/')
        .replace(/"/g, '')
        .replace(/'/g, '')
        .trim();
      if (bgImgUrl.startsWith('/')) {
        bgImgUrl = 'https://www.medtronic.com' + bgImgUrl;
      }
    }
  }

  // Create image element for slide (first cell only contains image)
  let slideImg = '';
  if (bgImgUrl) {
    slideImg = document.createElement('img');
    slideImg.src = bgImgUrl;
    slideImg.alt = '';
    slideImg.setAttribute('loading', 'lazy');
    slideImg.style.maxWidth = '100%';
  }

  // Extract all relevant text content from the source html (second cell)
  let textFrag = document.createDocumentFragment();

  // Eyebrow image (blue bar)
  const eyebrowImg = element.querySelector('.cmp-image img');
  if (eyebrowImg) {
    textFrag.appendChild(eyebrowImg.cloneNode(true));
  }
  // Eyebrow text (skip empty or nbsp)
  const eyebrowText = element.querySelector('.eyebrow2 .cmp-text');
  if (eyebrowText) {
    Array.from(eyebrowText.querySelectorAll('p'))
      .filter(p => p.textContent.trim() && p.textContent.trim() !== '\u00A0')
      .forEach(p => textFrag.appendChild(p.cloneNode(true)));
  }
  // Title (h2)
  const title = element.querySelector('.cmp-title__text');
  if (title) {
    textFrag.appendChild(title.cloneNode(true));
  }
  // Description (paragraphs)
  const desc = element.querySelector('.no-bottom-margin-p .cmp-text');
  if (desc) {
    Array.from(desc.querySelectorAll('p'))
      .filter(p => p.textContent.trim())
      .forEach(p => textFrag.appendChild(p.cloneNode(true)));
  }
  // CTA button (keep the actual element)
  const btn = element.querySelector('.cmp-button');
  if (btn) {
    textFrag.appendChild(btn.cloneNode(true));
  }

  // If no image or no text, do not output a slide row
  if (!slideImg && textFrag.childNodes.length === 0) {
    const block = WebImporter.DOMUtils.createTable([headerRow], document);
    element.replaceWith(block);
    return;
  }

  // Build table rows: header + slide row (2 columns)
  const rows = [headerRow];
  rows.push([
    slideImg ? slideImg : '', // image only in first cell
    textFrag.childNodes.length > 0 ? textFrag : '' // text only in second cell
  ]);

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
