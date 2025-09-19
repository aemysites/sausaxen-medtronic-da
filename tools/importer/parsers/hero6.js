/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero image (background image for hero6)
  let imageEl = null;
  const imageContainer = element.querySelector('.image .cmp-image img');
  if (imageContainer) {
    imageEl = imageContainer;
  }

  // Gather all hero text blocks (eyebrow, title, description, CTA)
  let textBlocks = [];
  // Find all .cmp-title and .cmp-text elements in order
  const textEls = element.querySelectorAll('.cmp-title, .cmp-text');
  textBlocks = Array.from(textEls);

  // Compose table rows
  const headerRow = ['Hero (hero6)'];
  const imageRow = [imageEl ? imageEl : ''];
  const textRow = [textBlocks.length ? textBlocks : ''];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    textRow,
  ], document);

  element.replaceWith(table);
}
