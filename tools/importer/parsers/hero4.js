/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract background-image URL from inline style
  function extractBackgroundImageUrl(style) {
    if (!style) return null;
    const match = style.match(/background-image:\s*url\((['"]?)(.*?)\1\)/i);
    if (match && match[2]) {
      let url = match[2];
      // Clean up escaped slashes (\2f => /)
      url = url.replace(/\\2f\s*/g, '/');
      return url;
    }
    return null;
  }

  // 1. Header row
  const headerRow = ['Hero (hero4)'];

  // 2. Background image row
  let bgUrl = null;
  let bgDiv = null;
  element.querySelectorAll('div').forEach((div) => {
    if (div.hasAttribute('style') && div.style.backgroundImage) {
      bgUrl = extractBackgroundImageUrl(div.getAttribute('style'));
      bgDiv = div;
    }
  });
  let bgCell = '';
  if (bgUrl) {
    const img = document.createElement('img');
    img.src = bgUrl;
    img.loading = 'lazy';
    bgCell = img;
  }

  // 3. Content row (title, subheading, cta)
  let title = '';
  let subheading = '';
  let cta = '';

  const cmpTexts = element.querySelectorAll('.cmp-text');
  if (cmpTexts.length > 0) {
    const titleDiv = cmpTexts[0];
    const titleP = titleDiv.querySelector('p, h1, h2, h3, h4, h5, h6');
    if (titleP) {
      const h1 = document.createElement('h1');
      h1.innerHTML = titleP.innerHTML;
      title = h1;
    }
    if (cmpTexts.length > 1) {
      const subDiv = cmpTexts[1];
      const subP = subDiv.querySelector('p, h2, h3, h4, h5, h6');
      if (subP) {
        const p = document.createElement('p');
        p.innerHTML = subP.innerHTML;
        subheading = p;
      }
    }
  }

  const ctaEl = element.querySelector('a');
  if (ctaEl) {
    const ctaLink = document.createElement('a');
    ctaLink.href = ctaEl.href;
    ctaLink.innerHTML = ctaEl.innerHTML;
    cta = ctaLink;
  }

  const contentCell = [];
  if (title) contentCell.push(title);
  if (subheading) contentCell.push(subheading);
  if (cta) contentCell.push(cta);

  const rows = [
    headerRow,
    [bgCell],
    [contentCell],
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);

  element.replaceWith(table);
}
