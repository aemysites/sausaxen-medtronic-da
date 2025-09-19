/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid containing both columns
  const mainGrid = element.querySelector('.aem-Grid.aem-Grid--8');
  if (!mainGrid) return;

  // Find left column (text content)
  const leftCol = mainGrid.querySelector('.container.text.wide-card');
  // Find right column (image)
  const rightCol = mainGrid.querySelector('.image');

  if (!leftCol || !rightCol) return;

  // LEFT COLUMN: Collect all relevant content blocks in order
  const leftContent = [];

  // Eyebrow (small heading)
  const eyebrow = leftCol.querySelector('.eyebrow2 .cmp-text');
  if (eyebrow) leftContent.push(eyebrow);

  // Title (h3 with link)
  const title = leftCol.querySelector('.title .cmp-title');
  if (title) leftContent.push(title);

  // Main text (paragraph)
  const mainText = leftCol.querySelector('.text:not(.eyebrow2):not(:has(.cmp-title)) .cmp-text');
  if (mainText) leftContent.push(mainText);

  // CTA (Learn more link)
  const cta = leftCol.querySelector('.text:not(.eyebrow2):not(:has(.cmp-title)) + .text .cmp-text');
  if (cta) leftContent.push(cta);

  // RIGHT COLUMN: Reference the image element directly
  const imageEl = rightCol.querySelector('img');
  const rightContent = imageEl ? [imageEl] : [];

  // Compose table rows
  const headerRow = ['Columns block (columns6)'];
  const contentRow = [leftContent, rightContent];

  // Create and replace with table
  const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);
  element.replaceWith(table);
}
