/* global WebImporter */
export default function parse(element, { document }) {
  // Find all card modules
  const cardModules = Array.from(
    element.querySelectorAll(':scope .card-module')
  );

  // Table header row
  const headerRow = ['Cards (cards10)'];
  const rows = [headerRow];

  cardModules.forEach((cardModule) => {
    const grid = cardModule.querySelector('.aem-Grid');
    if (!grid) return;
    const gridChildren = Array.from(grid.children);

    // Image (first column)
    let imageEl = null;
    const imageDiv = gridChildren.find((div) => div.classList.contains('image'));
    if (imageDiv) {
      const img = imageDiv.querySelector('img');
      if (img) imageEl = img;
    }

    // Eyebrow (subtitle, optional)
    let eyebrow = '';
    const eyebrowDiv = gridChildren.find((div) => div.classList.contains('eyebrow2'));
    if (eyebrowDiv) {
      const eyebrowText = eyebrowDiv.querySelector('.cmp-text');
      if (eyebrowText) eyebrow = eyebrowText.innerHTML.trim();
    }

    // Title (h3, required)
    let title = '';
    const titleDiv = gridChildren.find((div) => div.classList.contains('title'));
    if (titleDiv) {
      const h3 = titleDiv.querySelector('h3');
      if (h3) title = h3.outerHTML;
    }

    // CTA (last .text with a link)
    let cta = '';
    const textDivs = gridChildren.filter((div) => div.classList.contains('text'));
    for (let i = textDivs.length - 1; i >= 0; i--) {
      const link = textDivs[i].querySelector('a');
      if (link) {
        const ctaText = textDivs[i].querySelector('.cmp-text');
        if (ctaText) cta = ctaText.outerHTML;
        break;
      }
    }

    // Compose text cell content (eyebrow, title, CTA)
    const textCellParts = [];
    if (eyebrow) textCellParts.push(`<div class="eyebrow">${eyebrow}</div>`);
    if (title) textCellParts.push(title);
    if (cta) textCellParts.push(cta);
    const textCell = document.createElement('div');
    textCell.innerHTML = textCellParts.join('\n');

    // Add row: [image, text content]
    rows.push([
      imageEl || '',
      textCell.childNodes.length ? Array.from(textCell.childNodes) : '',
    ]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
