/* global WebImporter */
export default function parse(element, { document }) {
  // Find all card-module containers
  const cards = Array.from(element.querySelectorAll('.card-module'));
  if (!cards.length) return;

  // Table header as per block spec
  const headerRow = ['Cards (cards5)'];
  const rows = [headerRow];

  cards.forEach(card => {
    // Image: first .cmp-image img
    const imgDiv = card.querySelector('.cmp-image img');
    const imgCell = imgDiv ? imgDiv : '';

    // Eyebrow: .eyebrow2 .cmp-text > p (optional)
    let eyebrow = '';
    const eyebrowDiv = card.querySelector('.eyebrow2 .cmp-text p');
    if (eyebrowDiv) eyebrow = eyebrowDiv.cloneNode(true);

    // Title: .cmp-title h1-h6 (mandatory)
    let title = '';
    const titleDiv = card.querySelector('.cmp-title');
    if (titleDiv) {
      const heading = titleDiv.querySelector('h1,h2,h3,h4,h5,h6');
      if (heading) title = heading.cloneNode(true);
    }

    // CTA: .text.no-top-margin .cmp-text a (optional)
    let cta = '';
    const ctaDiv = card.querySelector('.text.no-top-margin .cmp-text a');
    if (ctaDiv) cta = ctaDiv.cloneNode(true);

    // Compose text cell
    const textCell = document.createElement('div');
    if (eyebrow) textCell.appendChild(eyebrow);
    if (title) textCell.appendChild(title);
    if (cta) {
      // Add line break before CTA if there's other content
      if (eyebrow || title) textCell.appendChild(document.createElement('br'));
      textCell.appendChild(cta);
    }

    rows.push([imgCell, textCell.childNodes.length ? textCell : '']);
  });

  // Create and replace with table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
