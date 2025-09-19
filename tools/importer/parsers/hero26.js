/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Extract background image from style attribute
  function getBackgroundImageUrl(el) {
    const style = el.getAttribute('style') || '';
    const match = style.match(/background-image:\s*url\(['"]?(.*?)['"]?\)/);
    if (match && match[1]) {
      // decode any escaped chars
      return match[1].replace(/\\2f /g, '/').replace(/\\/g, '');
    }
    return null;
  }

  // Find the background image from the innermost .cmp-container or fallback to top-level
  let bgImageUrl = null;
  const containers = element.querySelectorAll(':scope > div > div');
  for (const c of containers) {
    bgImageUrl = getBackgroundImageUrl(c);
    if (bgImageUrl) break;
  }
  if (!bgImageUrl) {
    bgImageUrl = getBackgroundImageUrl(element);
  }

  // Compose background image cell (row 2)
  let bgImageCell = '';
  if (bgImageUrl) {
    let src = bgImageUrl;
    if (!/^https?:\/\//.test(src)) {
      src = 'https://www.medtronic.com' + src;
    }
    const img = document.createElement('img');
    img.src = src;
    img.alt = '';
    bgImageCell = img;
  }

  // Find the main content container (circle-content preferred)
  let contentContainer = element.querySelector('.circle-content');
  if (!contentContainer) {
    contentContainer = element.querySelector('.cmp-container');
  }

  // Compose content cell (row 3): only necessary elements, no wrappers or empty paragraphs
  const contentParts = [];
  if (contentContainer) {
    // Eyebrow text (skip empty or whitespace-only)
    const eyebrowText = contentContainer.querySelector('.eyebrow2 .cmp-text');
    if (eyebrowText) {
      // Only include non-empty text
      const eyebrowClone = eyebrowText.cloneNode(true);
      // Remove empty or whitespace-only paragraphs
      eyebrowClone.querySelectorAll('p').forEach(p => { if (!p.textContent.trim()) p.remove(); });
      if (eyebrowClone.textContent.trim()) {
        contentParts.push(...Array.from(eyebrowClone.childNodes));
      }
    }
    // Title (h2)
    const title = contentContainer.querySelector('.cmp-title h2');
    if (title) {
      contentParts.push(title.cloneNode(true));
    }
    // Paragraph (skip empty or whitespace-only)
    const paragraph = contentContainer.querySelector('.no-bottom-margin-p .cmp-text');
    if (paragraph) {
      const paraClone = paragraph.cloneNode(true);
      // Remove empty or whitespace-only paragraphs
      paraClone.querySelectorAll('p').forEach(p => { if (!p.textContent.trim()) p.remove(); });
      if (paraClone.textContent.trim()) {
        contentParts.push(...Array.from(paraClone.childNodes));
      }
    }
    // CTA Button
    const button = contentContainer.querySelector('.cmp-button');
    if (button) {
      contentParts.push(button.cloneNode(true));
    }
  }

  // Build table rows
  const headerRow = ['Hero (hero26)'];
  const bgRow = [bgImageCell];
  const contentRow = [contentParts];

  const cells = [headerRow, bgRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(block);
}
