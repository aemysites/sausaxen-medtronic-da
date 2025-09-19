/* global WebImporter */
export default function parse(element, { document }) {
  // Find all card blocks (direct children)
  const cardBlocks = Array.from(
    element.querySelectorAll(':scope > div > div > div > div > div.container.card-module')
  );

  // Table header must match target block name exactly
  const headerRow = ['Cards (cards5)'];
  const rows = [headerRow];

  cardBlocks.forEach(card => {
    // --- IMAGE (mandatory, referenced element) ---
    let imageEl = null;
    const imageCmp = card.querySelector('.image .cmp-image');
    if (imageCmp) {
      const img = imageCmp.querySelector('img');
      if (img) imageEl = img;
    }

    // --- EYEBROW (optional, styled as small text above title) ---
    let eyebrowEl = null;
    const eyebrowContainer = card.querySelector('.text.eyebrow2');
    if (eyebrowContainer) {
      const eyebrowP = eyebrowContainer.querySelector('p');
      if (eyebrowP) eyebrowEl = eyebrowP;
    }

    // --- TITLE (mandatory, heading) ---
    let titleEl = null;
    const titleContainer = card.querySelector('.title .cmp-title__text');
    if (titleContainer) {
      // Use heading element directly (h3)
      titleEl = titleContainer;
    }

    // --- CTA (optional, linked text at bottom) ---
    let ctaEl = null;
    const ctaContainer = card.querySelector('.text.no-top-margin');
    if (ctaContainer) {
      const ctaLink = ctaContainer.querySelector('a');
      if (ctaLink) ctaEl = ctaContainer;
    }

    // Compose text cell, preserving order and semantics
    const textCellContent = [];
    if (eyebrowEl) textCellContent.push(eyebrowEl.cloneNode(true));
    if (titleEl) textCellContent.push(titleEl.cloneNode(true));
    if (ctaEl) textCellContent.push(ctaEl.cloneNode(true));

    // Defensive: skip if no image or title
    if (!imageEl || !titleEl) return;

    rows.push([
      imageEl,
      textCellContent
    ]);
  });

  // Only one table, no Section Metadata block, no <hr>
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
