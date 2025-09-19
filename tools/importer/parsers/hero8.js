/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get background image URL from inline style
  function getBackgroundImageUrl(el) {
    if (!el || !el.style || !el.style.backgroundImage) return null;
    const bg = el.style.backgroundImage;
    const match = bg.match(/url\(["']?(.*?)["']?\)/);
    if (match && match[1]) {
      let url = match[1];
      // Handle encoded slashes
      url = url.replace(/\\2f /g, '/').replace(/\\/g, '');
      // If relative, prepend domain
      if (url.startsWith('/')) {
        url = 'https://www.medtronic.com' + url;
      }
      return url;
    }
    return null;
  }

  // Find the inner container with background image
  const bgContainer = element.querySelector(':scope > div');
  const bgUrl = getBackgroundImageUrl(bgContainer);

  // --- ROW 1: Header ---
  const headerRow = ['Hero (hero8)'];

  // --- ROW 2: Background Image (optional) ---
  let bgImgEl = null;
  if (bgUrl) {
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgUrl;
    bgImgEl.alt = '';
    bgImgEl.style.display = 'none'; // Hide in preview, used for import
  }
  const bgRow = [bgImgEl ? bgImgEl : ''];

  // --- ROW 3: Content (title, subheading, CTA) ---
  // Find the main content column (circle-content)
  let contentCol = null;
  const cols = bgContainer ? bgContainer.querySelectorAll(':scope > .aem-Grid > div') : [];
  for (const col of cols) {
    if (col.classList.contains('circle-content')) {
      contentCol = col;
      break;
    }
  }

  // Defensive: If not found, fallback to first column
  if (!contentCol && cols.length) contentCol = cols[0];

  // Gather content elements
  let contentEls = [];
  if (contentCol) {
    // Eyebrow image (decorative, optional)
    const eyebrowImgWrap = contentCol.querySelector('.image .cmp-image img');
    if (eyebrowImgWrap) {
      contentEls.push(eyebrowImgWrap);
    }
    // Eyebrow text (optional)
    const eyebrowText = contentCol.querySelector('.eyebrow2 .cmp-text');
    if (eyebrowText) {
      contentEls.push(eyebrowText);
    }
    // Title
    const titleEl = contentCol.querySelector('.title .cmp-title h2');
    if (titleEl) {
      contentEls.push(titleEl);
    }
    // Paragraph
    const paraEl = contentCol.querySelector('.text.no-bottom-margin-p .cmp-text p');
    if (paraEl) {
      contentEls.push(paraEl);
    }
    // CTA button
    const btnEl = contentCol.querySelector('.button .cmp-button');
    if (btnEl) {
      contentEls.push(btnEl);
    }
  }
  // Defensive: If nothing found, fallback to all children
  if (contentEls.length === 0 && contentCol) {
    contentEls = Array.from(contentCol.children);
  }

  const contentRow = [contentEls.length ? contentEls : ''];

  // --- Assemble table ---
  const cells = [
    headerRow,
    bgRow,
    contentRow,
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
