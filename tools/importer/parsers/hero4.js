/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract background image URL from inline style
  function getBackgroundImageUrl(style) {
    if (!style) return null;
    const match = style.match(/background-image\s*:\s*url\(([^)]+)\)/i);
    if (match && match[1]) {
      let url = match[1].replace(/\\2f /g, '/').replace(/\s/g, '');
      // Remove any surrounding quotes
      url = url.replace(/^['"]|['"]$/g, '');
      return url;
    }
    return null;
  }

  // 1. Header row
  const headerRow = ['Hero (hero4)'];

  // 2. Background image row
  let bgImageUrl = null;
  // Find the first child with a background-image style
  const bgDiv = Array.from(element.querySelectorAll('div')).find(div => {
    return div.style && div.style.backgroundImage;
  });
  if (bgDiv && bgDiv.style.backgroundImage) {
    bgImageUrl = getBackgroundImageUrl(bgDiv.getAttribute('style'));
  }
  let bgImageCell;
  if (bgImageUrl) {
    const img = document.createElement('img');
    img.src = bgImageUrl;
    img.alt = '';
    bgImageCell = img;
  } else {
    bgImageCell = '';
  }

  // 3. Content row (title, subheading, etc)
  // Find the deepest .aem-Grid with text children
  let contentGrid = null;
  const grids = element.querySelectorAll('.aem-Grid');
  for (const grid of grids) {
    if (grid.querySelector('.text.h1, .text.intro-heading')) {
      contentGrid = grid;
      break;
    }
  }

  let title = '', subheading = '', cta = '';
  if (contentGrid) {
    // Title: .text.h1 > .cmp-text > p
    const titleDiv = contentGrid.querySelector('.text.h1 .cmp-text p');
    if (titleDiv) {
      const h1 = document.createElement('h1');
      h1.textContent = titleDiv.textContent.trim();
      title = h1;
    }
    // Subheading: .text.intro-heading > .cmp-text > p
    const subheadingDiv = contentGrid.querySelector('.text.intro-heading .cmp-text p');
    if (subheadingDiv) {
      const p = document.createElement('p');
      p.textContent = subheadingDiv.textContent.trim();
      subheading = p;
    }
    // CTA: Not present in this example, but if there is a link, add it
    const ctaLink = contentGrid.querySelector('a');
    if (ctaLink) {
      cta = ctaLink;
    }
  }

  // Compose content cell
  const contentCell = [];
  if (title) contentCell.push(title);
  if (subheading) contentCell.push(subheading);
  if (cta) contentCell.push(cta);

  // Table rows
  const rows = [
    headerRow,
    [bgImageCell],
    [contentCell]
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
