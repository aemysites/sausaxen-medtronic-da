/* global WebImporter */
export default function parse(element, { document }) {
  // Find the image element for the hero block
  let imageEl = null;
  const imgContainer = element.querySelector('.image .cmp-image img');
  if (imgContainer) {
    imageEl = imgContainer;
  }

  // Find the main text container
  let textContainer = null;
  const containers = element.querySelectorAll('.cmp-container');
  for (const c of containers) {
    if (
      c.querySelector('.cmp-title') ||
      c.querySelector('.cmp-text')
    ) {
      textContainer = c;
      break;
    }
  }
  if (!textContainer) textContainer = element;

  // Extract eyebrow (optional)
  const eyebrow = textContainer.querySelector('.eyebrow2 .cmp-text p');
  // Extract title (h3 with link)
  const title = textContainer.querySelector('.cmp-title__text');
  // Extract description paragraph
  let desc = null;
  const descCandidates = Array.from(textContainer.querySelectorAll('.cmp-text p'));
  desc = descCandidates.find(p => !p.closest('.eyebrow2') && !p.querySelector('a'));
  // Extract CTA (paragraph with link)
  const cta = descCandidates.find(p => p.querySelector('a'));

  // Compose content cell
  const contentEls = [];
  if (eyebrow) contentEls.push(eyebrow);
  if (title) contentEls.push(title);
  if (desc) contentEls.push(desc);
  if (cta) contentEls.push(cta);

  // Table rows
  const headerRow = ['Hero (hero6)'];
  const imageRow = [imageEl ? imageEl : ''];
  const contentRow = [contentEls.length ? contentEls : ''];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
