/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid containing the two columns
  const mainGrid = element.querySelector('.aem-Grid.aem-Grid--6');
  if (!mainGrid) return;

  // The left column: all .text/.title blocks (in order)
  const leftColumnEls = [];
  const selectors = [
    '.eyebrow2 .cmp-text',
    '.title .cmp-title',
    '.text:not(.eyebrow2):not(:has(.cmp-title)) .cmp-text',
  ];
  selectors.forEach(sel => {
    mainGrid.querySelectorAll(sel).forEach(el => {
      if (!leftColumnEls.includes(el)) leftColumnEls.push(el);
    });
  });

  // The last .text block is the CTA ("Learn more")
  const cta = mainGrid.querySelector('.text .cmp-text:last-of-type');
  if (cta && !leftColumnEls.includes(cta)) leftColumnEls.push(cta);

  // The right column: the image
  const rightColumnEls = [];
  const imageCol = element.querySelector('.image');
  if (imageCol) {
    const img = imageCol.querySelector('img');
    if (img) rightColumnEls.push(img);
  }

  // Defensive: if no left or right content, abort
  if (leftColumnEls.length === 0 && rightColumnEls.length === 0) return;

  // Build the table
  const headerRow = ['Columns (columns3)'];
  const contentRow = [
    leftColumnEls,
    rightColumnEls
  ];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
