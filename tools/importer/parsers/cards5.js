/* global WebImporter */
export default function parse(element, { document }) {
  // Find all card-module blocks (these are the cards)
  const cardBlocks = Array.from(element.querySelectorAll('.card-module'));

  // Table header row as required
  const headerRow = ['Cards (cards5)'];
  const rows = [headerRow];

  cardBlocks.forEach(card => {
    // Image extraction (mandatory)
    let imageEl = null;
    const img = card.querySelector('.cmp-image img');
    if (img) imageEl = img.cloneNode(true);

    // Eyebrow (optional)
    let eyebrow = '';
    const eyebrowDiv = card.querySelector('.cmp-text p');
    if (eyebrowDiv) {
      eyebrow = eyebrowDiv.textContent.trim();
    }

    // Title (mandatory)
    let titleEl = null;
    const titleContainer = card.querySelector('.cmp-title');
    if (titleContainer) {
      const heading = titleContainer.querySelector('h1, h2, h3');
      if (heading) titleEl = heading.cloneNode(true);
    }

    // CTA (optional, "Learn more" link)
    let ctaEl = null;
    const textBlocks = card.querySelectorAll('.cmp-text');
    if (textBlocks.length > 1) {
      const lastTextBlock = textBlocks[textBlocks.length - 1];
      const link = lastTextBlock.querySelector('a');
      if (link) ctaEl = link.cloneNode(true);
    }

    // Compose text cell content
    const textCell = document.createElement('div');
    if (eyebrow) {
      const eyebrowDiv = document.createElement('div');
      eyebrowDiv.textContent = eyebrow;
      textCell.appendChild(eyebrowDiv);
    }
    if (titleEl) {
      textCell.appendChild(titleEl);
    }
    if (ctaEl) {
      const ctaDiv = document.createElement('div');
      ctaDiv.appendChild(ctaEl);
      textCell.appendChild(ctaDiv);
    }
    // If no eyebrow/title/cta, fallback to all text
    if (!eyebrow && !titleEl && textBlocks.length > 0) {
      textCell.appendChild(textBlocks[0].cloneNode(true));
    }

    // Only add row if image and text content are present
    if (imageEl && textCell.textContent.trim()) {
      rows.push([imageEl, textCell]);
    }
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
