/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract background image from style attribute
  function extractBackgroundImage(el) {
    let url = '';
    if (el && el.style && el.style.backgroundImage) {
      const match = el.style.backgroundImage.match(/url\((['"]?)(.*?)\1\)/);
      if (match && match[2]) {
        url = match[2];
      }
    }
    return url;
  }

  // Find the outermost container with a background image
  const bgContainer = element.querySelector(':scope > div');
  const bgUrl = extractBackgroundImage(bgContainer);
  let bgImgEl = null;
  if (bgUrl) {
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgUrl;
    bgImgEl.alt = '';
    bgImgEl.loading = 'lazy';
  }

  // Find all possible text blocks inside the hero content
  // Use less specific selectors to capture all text content
  let contentCell = [];
  const heroContent = element.querySelectorAll('.cmp-container');
  let found = false;
  for (const container of heroContent) {
    // Collect all paragraphs and headings in order
    const blocks = container.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a.cmp-button');
    if (blocks.length > 0) {
      blocks.forEach((el) => {
        // For CTA, include the entire anchor
        if (el.matches('a.cmp-button')) {
          contentCell.push(el);
        } else {
          contentCell.push(el);
        }
      });
      found = true;
      break;
    }
  }
  // Fallback: if nothing found, try to get all text content
  if (!found) {
    const blocks = element.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a.cmp-button');
    blocks.forEach((el) => {
      contentCell.push(el);
    });
  }

  // Build table rows
  const headerRow = ['Hero (hero31)'];
  const imageRow = [bgImgEl ? bgImgEl : ''];
  const contentRow = [contentCell];

  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with the new table
  element.replaceWith(table);
}
