/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract background image URL from inline style
  function extractBgImageUrl(style) {
    if (!style) return null;
    const match = style.match(/background-image:\s*url\((['"]?)(.*?)\1\)/i);
    if (match && match[2]) {
      // Handle escaped slashes
      let url = match[2].replace(/\\2f /g, '/').replace(/\\/g, '');
      // Remove leading /content if present
      if (url.startsWith('/content')) url = url;
      return url;
    }
    return null;
  }

  // 1. Header row
  const headerRow = ['Hero (hero19)'];

  // 2. Background image row
  // Find the first child with a background-image style
  let bgImageUrl = null;
  let bgDiv = null;
  // Defensive: look for any div with background-image style
  element.querySelectorAll('div').forEach((div) => {
    const style = div.getAttribute('style');
    if (style && style.includes('background-image')) {
      bgImageUrl = extractBgImageUrl(style);
      bgDiv = div;
    }
  });
  let bgImgEl = null;
  if (bgImageUrl) {
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgImageUrl;
    bgImgEl.alt = '';
  }
  const bgImageRow = [bgImgEl ? bgImgEl : ''];

  // 3. Content row (title, subheading, paragraph)
  // Find the innermost .aem-Grid containing the text blocks
  let contentGrid = null;
  const grids = element.querySelectorAll('.aem-Grid');
  if (grids.length) {
    // Pick the deepest grid (last one)
    contentGrid = grids[grids.length - 1];
  }
  // Defensive: fallback to element itself if not found
  const contentRoot = contentGrid || element;

  // Gather all direct text blocks in order
  const textBlocks = [];
  contentRoot.querySelectorAll(':scope > div').forEach((block) => {
    if (block.classList.contains('text')) {
      const cmpText = block.querySelector('.cmp-text');
      if (cmpText) textBlocks.push(cmpText);
    }
  });
  // Compose content cell
  const contentCell = textBlocks.length ? textBlocks : [''];
  const contentRow = [contentCell];

  // Compose table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bgImageRow,
    contentRow
  ], document);

  // Replace original element
  element.replaceWith(table);
}
