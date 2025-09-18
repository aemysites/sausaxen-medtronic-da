/* global WebImporter */
export default function parse(element, { document }) {
  // Find the inner content column
  let contentCol = null;
  const gridDiv = element.querySelector('.aem-Grid');
  if (gridDiv) {
    contentCol = gridDiv.querySelector('.circle-content');
  }
  if (!contentCol) contentCol = element;
  const cmpContainer = contentCol.querySelector('.cmp-container') || contentCol;

  // Extract content blocks
  // Eyebrow title (h3 with link)
  const eyebrowTitle = cmpContainer.querySelector('.eyebrow .cmp-title__text, .eyebrow h3');
  const mainTitle = cmpContainer.querySelector('h2.cmp-title__text');
  const desc = cmpContainer.querySelector('.cmp-text p');
  const button = cmpContainer.querySelector('.cmp-button');

  // Compose left column (all text and button)
  const leftCol = document.createElement('div');
  if (eyebrowTitle) {
    leftCol.appendChild(eyebrowTitle.closest('.cmp-title') || eyebrowTitle);
  }
  if (mainTitle) {
    leftCol.appendChild(mainTitle.closest('.cmp-title') || mainTitle);
  }
  if (desc) {
    leftCol.appendChild(desc.closest('.cmp-text') || desc);
  }
  if (button) {
    leftCol.appendChild(button);
  }

  // Compose right column (background image)
  let bgDiv = null;
  const divs = Array.from(element.querySelectorAll(':scope > div'));
  for (const div of divs) {
    if (div.style && div.style.backgroundImage) {
      bgDiv = div;
      break;
    }
  }
  let imgEl = null;
  if (bgDiv && bgDiv.style.backgroundImage) {
    const urlMatch = bgDiv.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
    if (urlMatch && urlMatch[1]) {
      const imgUrl = urlMatch[1].replace(/\\/g, '');
      imgEl = document.createElement('img');
      imgEl.src = imgUrl;
      imgEl.alt = '';
    }
  }

  // Always output two columns for this layout if both have content
  const columns = [];
  columns.push(leftCol); // left column always present
  if (imgEl) columns.push(imgEl); // right column only if image exists

  const headerRow = ['Columns block (columns11)'];
  const cells = [headerRow, columns];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
