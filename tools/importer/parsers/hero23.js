/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row
  const headerRow = ['Hero (hero23)'];

  // 2. Background image row
  let bgImgRow = [''];
  // Find background image from inline style
  let bgUrl = '';
  const bgContainer = element.querySelector('[style*="background-image"]');
  if (bgContainer) {
    const style = bgContainer.getAttribute('style');
    const match = style.match(/background-image:\s*url\(([^)]+)\)/);
    if (match && match[1]) {
      bgUrl = match[1]
        .replace(/\\2f/g, '/')
        .replace(/\s+/g, '') // Remove all whitespace
        .replace(/'/g, '')
        .replace(/\"/g, '')
        .trim();
      // Remove leading slash if present
      if (!bgUrl.startsWith('/')) bgUrl = '/' + bgUrl;
      // Create image element
      const img = document.createElement('img');
      img.src = bgUrl;
      bgImgRow = [img];
    }
  }

  // 3. Content row: Title, Subheading, CTA
  // We'll collect all relevant content from the nested grid structure
  const contentEls = [];
  // Eyebrow
  const eyebrow = element.querySelector('.eyebrow2 .cmp-text');
  if (eyebrow) {
    contentEls.push(eyebrow);
  }
  // Main heading ("Engineering the extraordinary")
  const mainHeading = element.querySelector('.h1 .cmp-text');
  if (mainHeading) {
    // Convert to h2 for semantic heading if not already
    const h2 = document.createElement('h2');
    h2.innerHTML = mainHeading.innerHTML;
    contentEls.push(h2);
  }
  // Subheading (longer text)
  const subheading = element.querySelector('.intro-heading .cmp-title');
  if (subheading) {
    const h1 = subheading.querySelector('h1');
    if (h1) {
      const p = document.createElement('p');
      p.innerHTML = h1.innerHTML;
      contentEls.push(p);
    }
  }
  // CTA button
  const cta = element.querySelector('.button a.cmp-button');
  if (cta) {
    contentEls.push(cta);
  }

  const contentRow = [contentEls];

  // Assemble table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bgImgRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
