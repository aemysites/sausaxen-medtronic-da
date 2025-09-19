/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the card content from a card-module container
  function extractCard(card) {
    // Find image (first .image img)
    let img = card.querySelector('.image img');
    // Find the eyebrow (category/label), title, and CTA
    let eyebrow = card.querySelector('.eyebrow2, .eyebrow2.top-margin, .eyebrow2.top-margin.no-bottom-margin-p');
    let title = card.querySelector('.title h3, .title .cmp-title__text');
    let cta = null;
    // CTA is always the last .text block, which contains a link
    let textBlocks = card.querySelectorAll('.text');
    if (textBlocks.length > 0) {
      // Find the .text block that contains a link
      for (let i = textBlocks.length - 1; i >= 0; i--) {
        if (textBlocks[i].querySelector('a')) {
          cta = textBlocks[i];
          break;
        }
      }
    }
    // Compose the text cell: eyebrow (optional), title (mandatory), CTA (optional)
    const textCellContent = document.createElement('div');
    if (eyebrow) {
      // Use strong for semantic label
      const strong = document.createElement('strong');
      strong.textContent = eyebrow.textContent.trim();
      textCellContent.appendChild(strong);
      textCellContent.appendChild(document.createElement('br'));
    }
    if (title) {
      // Use heading level 3 for title
      const h3 = document.createElement('h3');
      // If the title is a link, preserve it
      const link = title.querySelector('a');
      if (link) {
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = link.textContent;
        h3.appendChild(a);
      } else {
        h3.textContent = title.textContent.trim();
      }
      textCellContent.appendChild(h3);
    }
    if (cta) {
      // Only include the link, not the surrounding <p>
      const link = cta.querySelector('a');
      if (link) {
        const p = document.createElement('p');
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = link.textContent;
        p.appendChild(a);
        textCellContent.appendChild(p);
      }
    }
    // Return [image, text cell]
    return [img, textCellContent];
  }

  // Find all card modules
  const cardModules = element.querySelectorAll('.card-module');
  const rows = [];
  // Header row
  rows.push(['Cards (cards5)']);
  // For each card, extract image and text content
  cardModules.forEach((cardModule) => {
    // Defensive: cardModule may have a .cmp-container inside
    let cardContainer = cardModule.querySelector('.cmp-container') || cardModule;
    rows.push(extractCard(cardContainer));
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
