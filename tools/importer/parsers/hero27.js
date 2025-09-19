/* global WebImporter */
export default function parse(element, { document }) {
  // Block name header row
  const headerRow = ['Hero (hero27)'];

  // Find background image: look for an <img> in previous siblings or parent
  let backgroundImg = '';
  let imgEl = null;
  if (element.previousElementSibling) {
    imgEl = element.previousElementSibling.querySelector('img');
  }
  if (!imgEl && element.parentElement) {
    imgEl = element.parentElement.querySelector('img');
  }
  if (imgEl && imgEl.src) {
    const img = document.createElement('img');
    img.src = imgEl.src;
    backgroundImg = img;
  }
  const imageRow = [backgroundImg || ''];

  // Find content: headings, paragraphs, CTA (from next sibling or parent)
  let contentBlock = '';
  let found = false;
  // Find the first element after the carousel nav that is not a nav or button group
  let contentContainer = element.nextElementSibling;
  // If next sibling is not a content container, search parent for a likely content area
  if (!contentContainer || contentContainer.classList.contains('cmp-carousel__actions')) {
    // Try to find a main content container inside the parent
    const candidates = Array.from(element.parentElement.children).filter(
      el => el !== element && !el.classList.contains('cmp-carousel__actions')
    );
    contentContainer = candidates.find(
      el => el.querySelector('h1, h2, h3, h4, h5, h6, p, a, button')
    );
  }
  if (contentContainer) {
    const frag = document.createDocumentFragment();
    // Headings
    ['h1','h2','h3','h4','h5','h6'].forEach(tag => {
      contentContainer.querySelectorAll(tag).forEach(el => {
        frag.appendChild(el.cloneNode(true));
        found = true;
      });
    });
    // Paragraphs
    contentContainer.querySelectorAll('p').forEach(el => {
      frag.appendChild(el.cloneNode(true));
      found = true;
    });
    // CTA links/buttons
    contentContainer.querySelectorAll('a,button').forEach(el => {
      frag.appendChild(el.cloneNode(true));
      found = true;
    });
    if (found) {
      const wrapper = document.createElement('div');
      wrapper.appendChild(frag);
      contentBlock = wrapper;
    }
  }
  // Always output three rows per block spec
  const rows = [headerRow, imageRow, [contentBlock || '']];

  const table = WebImporter.DOMUtils.createTable(rows, document);

  element.replaceWith(table);
}
