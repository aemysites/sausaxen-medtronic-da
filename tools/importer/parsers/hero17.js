/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Hero (hero17)'];

  // 2. Background image row (always include, even if empty)
  let bgImgUrl = '';
  const bgEl = element.querySelector('[style*="background-image"]');
  if (bgEl && bgEl.style.backgroundImage) {
    const match = bgEl.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
    if (match && match[1]) {
      bgImgUrl = match[1].replace(/\\2f /g, '/').replace(/\\/g, '');
      if (!/^https?:/.test(bgImgUrl)) {
        bgImgUrl = bgImgUrl.replace(/^\/+/, '/');
      }
    }
  }
  let bgImgEl = '';
  if (bgImgUrl) {
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgImgUrl;
    bgImgEl.alt = '';
  }
  const bgRow = [bgImgEl || ''];

  // 3. Content row: headline, subheading, CTA
  // Compose content cell as a single <div> containing all parts
  const contentDiv = document.createElement('div');
  const eyebrow = element.querySelector('.eyebrow2 .cmp-text');
  if (eyebrow) contentDiv.append(...Array.from(eyebrow.childNodes));
  const headline = element.querySelector('.h1 .cmp-text');
  if (headline) contentDiv.append(...Array.from(headline.childNodes));
  const subheading = element.querySelector('.intro-heading .cmp-title__text');
  if (subheading) contentDiv.append(subheading.cloneNode(true));
  const cta = element.querySelector('.button .cmp-button');
  if (cta) contentDiv.append(cta.cloneNode(true));
  const contentRow = [contentDiv];

  // Build table: always 3 rows (header, bg image, content)
  const cells = [
    headerRow,
    bgRow,
    contentRow,
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
