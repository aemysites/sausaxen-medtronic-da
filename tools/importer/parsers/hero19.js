/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Hero (hero19)'];

  // 2. Background image extraction
  let bgImgEl = null;
  const bgEl = element.querySelector('[style*="background-image"]');
  if (bgEl && bgEl.style.backgroundImage) {
    const match = bgEl.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
    if (match && match[1]) {
      let bgImageUrl = match[1];
      // Make absolute if needed
      const a = document.createElement('a');
      a.href = bgImageUrl;
      bgImageUrl = a.href;
      bgImgEl = document.createElement('img');
      bgImgEl.src = bgImageUrl;
      bgImgEl.alt = '';
    }
  }

  // 3. Content extraction
  let contentContainer = null;
  const gridContainers = element.querySelectorAll('.aem-Grid');
  for (const grid of gridContainers) {
    if (grid.querySelector('.cmp-text, .cmp-title')) {
      contentContainer = grid;
      break;
    }
  }
  if (!contentContainer) contentContainer = element;

  let eyebrow = null, heading = null, subheading = null;
  const eyebrowEl = contentContainer.querySelector('.eyebrow2 .cmp-text > p');
  if (eyebrowEl) eyebrow = eyebrowEl;
  const headingEl = contentContainer.querySelector('.h1 .cmp-text > p');
  if (headingEl) heading = headingEl;
  const subheadingEl = contentContainer.querySelector('.intro-heading .cmp-title h1');
  if (subheadingEl) subheading = subheadingEl;

  const contentCell = [];
  if (eyebrow) contentCell.push(eyebrow);
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);

  // 4. Build the table rows (ALWAYS 3 rows: header, bg image, content)
  const rows = [
    headerRow,
    [bgImgEl ? bgImgEl : ''],
    [contentCell.length ? contentCell : ''],
  ];

  // 5. Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
