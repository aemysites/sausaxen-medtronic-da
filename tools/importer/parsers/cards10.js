/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children by class
  function getDirectChildrenByClass(parent, className) {
    return Array.from(parent.children).filter((child) => child.classList.contains(className));
  }

  // Find all card modules (each card)
  const cardModules = element.querySelectorAll('.container.responsivegrid.card-module');

  // Table header row
  const headerRow = ['Cards (cards10)'];
  const rows = [headerRow];

  cardModules.forEach((cardModule) => {
    // Each cardModule contains a cmp-container > aem-Grid
    const cmpContainer = cardModule.querySelector('.cmp-container');
    if (!cmpContainer) return;
    const grid = cmpContainer.querySelector('.aem-Grid');
    if (!grid) return;
    const gridChildren = Array.from(grid.children);

    // 1. Image (first cell)
    let imageCell = '';
    const imageDiv = gridChildren.find((div) => div.classList.contains('image'));
    if (imageDiv) {
      // Find the img inside
      const img = imageDiv.querySelector('img');
      if (img) {
        imageCell = img;
      }
    }

    // 2. Text content (second cell)
    // Eyebrow (optional), Title (mandatory), CTA (optional)
    let eyebrow = '';
    let title = '';
    let cta = '';

    // Eyebrow: find .text.eyebrow2
    const eyebrowDiv = gridChildren.find((div) => div.classList.contains('eyebrow2'));
    if (eyebrowDiv) {
      const eyebrowText = eyebrowDiv.querySelector('.cmp-text');
      if (eyebrowText) {
        eyebrow = eyebrowText;
      }
    }

    // Title: find .title
    const titleDiv = gridChildren.find((div) => div.classList.contains('title'));
    if (titleDiv) {
      const titleEl = titleDiv.querySelector('.cmp-title');
      if (titleEl) {
        title = titleEl;
      }
    }

    // CTA: find .text.no-top-margin
    const ctaDiv = gridChildren.find((div) => div.classList.contains('no-top-margin'));
    if (ctaDiv) {
      const ctaText = ctaDiv.querySelector('.cmp-text');
      if (ctaText) {
        cta = ctaText;
      }
    }

    // Compose text cell content
    const textCell = [];
    if (eyebrow) textCell.push(eyebrow);
    if (title) textCell.push(title);
    if (cta) textCell.push(cta);

    rows.push([imageCell, textCell]);
  });

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
