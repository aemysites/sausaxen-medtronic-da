/* global WebImporter */
export default function parse(element, { document }) {
  // Find all card modules
  const cardModules = element.querySelectorAll('.container.card-module');
  const rows = [];
  // Header row as required by block spec
  rows.push(['Cards (cards5)']);

  cardModules.forEach(card => {
    // 1. Image (first column)
    let imageEl = null;
    const imageContainer = card.querySelector('.image .cmp-image');
    if (imageContainer) {
      imageEl = imageContainer.querySelector('img');
    }

    // 2. Text content (second column)
    const textContent = document.createElement('div');

    // Eyebrow (optional, all-caps small text above title)
    const eyebrow = card.querySelector('.text.eyebrow2 p');
    if (eyebrow) {
      const eyebrowDiv = document.createElement('div');
      eyebrowDiv.textContent = eyebrow.textContent;
      eyebrowDiv.style.fontSize = '0.85em';
      eyebrowDiv.style.letterSpacing = '0.05em';
      eyebrowDiv.style.textTransform = 'uppercase';
      textContent.appendChild(eyebrowDiv);
    }

    // Title (mandatory, as heading)
    const title = card.querySelector('.title .cmp-title__text');
    if (title) {
      // Clone the heading node to preserve <h3> and any links
      textContent.appendChild(title.cloneNode(true));
    }

    // CTA (optional, "Learn more")
    const cta = card.querySelector('.text.no-top-margin a');
    if (cta) {
      // Place CTA at the bottom, in its own div
      const ctaDiv = document.createElement('div');
      ctaDiv.appendChild(cta.cloneNode(true));
      textContent.appendChild(ctaDiv);
    }

    // Only add row if image and title exist
    if (imageEl && title) {
      rows.push([
        imageEl,
        textContent
      ]);
    }
  });

  // Create the table block and replace original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
