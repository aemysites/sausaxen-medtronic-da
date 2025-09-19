/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main 2-column grid
  const mainGrid = element.querySelector('.aem-Grid.aem-Grid--8');
  if (!mainGrid) return;
  const gridChildren = Array.from(mainGrid.children);

  // Identify image and content columns
  let imageCol = null;
  let contentCol = null;
  gridChildren.forEach((child) => {
    if (!imageCol && child.querySelector('.cmp-image')) {
      imageCol = child;
    } else if (!contentCol && child.querySelector('.cmp-container')) {
      contentCol = child;
    }
  });

  // Get the image element (reference, do not clone)
  let imageEl = null;
  if (imageCol) {
    const cmpImage = imageCol.querySelector('.cmp-image img');
    if (cmpImage) imageEl = cmpImage;
  }

  // Get the content elements in order: eyebrow, title, description, CTA
  let eyebrow = null, title = null, desc = null, cta = null;
  if (contentCol) {
    const textBlocks = contentCol.querySelectorAll('.cmp-text');
    if (textBlocks.length > 0) eyebrow = textBlocks[0];
    if (contentCol.querySelector('.cmp-title')) {
      title = contentCol.querySelector('.cmp-title');
    }
    if (textBlocks.length > 1) desc = textBlocks[1];
    if (textBlocks.length > 2) cta = textBlocks[2];
  }

  // Compose the right column content as a fragment (preserve semantic structure)
  const frag = document.createDocumentFragment();
  if (eyebrow) frag.appendChild(eyebrow);
  if (title) frag.appendChild(title);
  if (desc) frag.appendChild(desc);
  if (cta) frag.appendChild(cta);

  // Build the table rows
  const headerRow = ['Columns block (columns4)'];
  const contentRow = [imageEl, frag];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
