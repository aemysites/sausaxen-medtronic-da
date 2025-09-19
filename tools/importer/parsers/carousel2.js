/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid containing the carousel slide
  let slideGrid = null;
  // Traverse to find the grid with both image and text containers
  const traverse = (el) => {
    for (const child of el.children) {
      if (child.classList.contains('aem-Grid')) {
        const imageDiv = child.querySelector('.image');
        const textDiv = child.querySelector('.wide-card');
        if (imageDiv && textDiv) {
          slideGrid = child;
          return;
        }
        traverse(child);
      } else {
        traverse(child);
      }
    }
  };
  traverse(element);
  if (!slideGrid) return;

  // Get image and text containers
  const imageDiv = slideGrid.querySelector('.image');
  const textDiv = slideGrid.querySelector('.wide-card');

  // Get the image element (reference, not clone)
  const imgEl = imageDiv && imageDiv.querySelector('img');
  if (!imgEl) return;

  // Collect text content, preserving semantic meaning
  const textCells = [];
  if (textDiv) {
    // Eyebrow (optional)
    const eyebrow = textDiv.querySelector('.eyebrow2 .cmp-text p');
    if (eyebrow) {
      textCells.push(eyebrow);
    }
    // Title (optional, as heading)
    const title = textDiv.querySelector('.title .cmp-title h3, .title .cmp-title__text');
    if (title) {
      textCells.push(title);
    }
    // Description (optional)
    // Find any .cmp-text that is not eyebrow or CTA
    const descs = Array.from(textDiv.querySelectorAll('.cmp-text p')).filter(p => {
      // Not eyebrow
      if (p.closest('.eyebrow2')) return false;
      // Not CTA
      if (p.querySelector('a')) return false;
      return true;
    });
    descs.forEach(d => textCells.push(d));
    // CTA (optional)
    const ctaLink = textDiv.querySelector('.cmp-text a');
    if (ctaLink) {
      // Use parent <p> if possible
      const ctaParent = ctaLink.closest('p') || ctaLink;
      textCells.push(ctaParent);
    }
  }

  // Compose the table
  const headerRow = ['Carousel (carousel2)'];
  const slideRow = [imgEl, textCells];
  const table = WebImporter.DOMUtils.createTable([headerRow, slideRow], document);

  // Replace original element
  element.replaceWith(table);
}
