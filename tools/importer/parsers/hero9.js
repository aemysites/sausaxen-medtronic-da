/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get background image URL from inline style
  function getBackgroundImageUrl(el) {
    const style = el.getAttribute('style') || '';
    const match = style.match(/background-image\s*:\s*url\(([^)]+)\)/i);
    if (match && match[1]) {
      let url = match[1].replace(/^['"]|['"]$/g, '');
      // Clean up encoded slashes
      url = url.replace(/\\2f /g, '/').replace(/\\/g, '');
      return url;
    }
    return null;
  }

  // Find the deepest container with the background image
  let bgUrl = null;
  let bgContainer = null;
  const containers = element.querySelectorAll('[style*="background-image"]');
  for (const c of containers) {
    const url = getBackgroundImageUrl(c);
    if (url) {
      bgUrl = url;
      bgContainer = c;
      break;
    }
  }

  // Compose the background image cell
  let bgCell = '';
  if (bgUrl) {
    const img = document.createElement('img');
    img.src = bgUrl;
    img.alt = '';
    bgCell = img;
  }

  // Find the headline and subheading text
  let title = '';
  let subheading = '';
  let cta = '';

  // Find .h1 block
  const h1Block = element.querySelector('.h1 .cmp-text p');
  if (h1Block) {
    const h1 = document.createElement('h1');
    h1.innerHTML = h1Block.innerHTML;
    title = h1;
  }

  // Find .intro-heading block
  const introBlock = element.querySelector('.intro-heading .cmp-text p');
  if (introBlock) {
    const p = document.createElement('p');
    p.innerHTML = introBlock.innerHTML;
    subheading = p;
  }

  // Compose the text cell
  const textCell = [];
  if (title) textCell.push(title);
  if (subheading) textCell.push(subheading);
  if (cta) textCell.push(cta);

  // Build the table rows
  const headerRow = ['Hero (hero9)'];
  const bgRow = [bgCell];
  const textRow = [textCell];

  const cells = [headerRow, bgRow, textRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
