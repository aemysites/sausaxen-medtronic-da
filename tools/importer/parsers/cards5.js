/* global WebImporter */
export default function parse(element, { document }) {
  // Find all card-module blocks
  const cardModules = Array.from(element.querySelectorAll('.card-module'));
  const rows = [];
  // Header row
  const headerRow = ['Cards (cards5)'];
  rows.push(headerRow);

  cardModules.forEach(card => {
    // Image (mandatory)
    let imageEl = null;
    const img = card.querySelector('.cmp-image img');
    if (img) imageEl = img;

    // Eyebrow (optional)
    let eyebrow = '';
    const eyebrowEl = card.querySelector('.eyebrow2 p');
    if (eyebrowEl) eyebrow = eyebrowEl.textContent.trim();

    // Title (mandatory)
    let titleEl = null;
    const h3 = card.querySelector('.title .cmp-title__text');
    if (h3) titleEl = h3;

    // Description (optional)
    let descEl = null;
    // Find all text blocks, exclude eyebrow and CTA
    const textEls = Array.from(card.querySelectorAll('.text .cmp-text p'));
    // Remove eyebrow and CTA
    let descText = '';
    textEls.forEach(p => {
      // If it's not eyebrow and not a CTA link
      if (!p.querySelector('a') && p.textContent.trim() !== eyebrow) {
        descText += p.textContent.trim() + '\n';
      }
    });
    if (descText.trim()) {
      descEl = document.createElement('div');
      descEl.textContent = descText.trim();
    }

    // CTA (optional)
    let ctaEl = null;
    const ctaLink = card.querySelector('.text .cmp-text a');
    if (ctaLink) ctaEl = ctaLink;

    // Compose text cell
    const textCell = document.createElement('div');
    if (eyebrow) {
      const eyebrowDiv = document.createElement('div');
      eyebrowDiv.textContent = eyebrow;
      eyebrowDiv.className = 'eyebrow';
      textCell.appendChild(eyebrowDiv);
    }
    if (titleEl) textCell.appendChild(titleEl);
    if (descEl) textCell.appendChild(descEl);
    if (ctaEl) textCell.appendChild(ctaEl);

    rows.push([imageEl, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
