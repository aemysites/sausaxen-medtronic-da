/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract background image URL from inline style
  function getBackgroundImageUrl(style) {
    if (!style) return null;
    const match = style.match(/background-image:\s*url\(([^)]+)\)/);
    if (match && match[1]) {
      let url = match[1].trim();
      // Remove any escaped characters
      url = url.replace(/\\/g, '');
      // Remove any surrounding quotes
      url = url.replace(/^['"]|['"]$/g, '');
      // If relative, prepend origin
      if (url.startsWith('/')) {
        url = window.location.origin + url;
      }
      return url;
    }
    return null;
  }

  // 1. Header row
  const headerRow = ['Hero (hero19)'];

  // 2. Background image row
  let bgImgUrl = null;
  // Find the first element with a background-image style
  let bgDiv = null;
  const allDivs = element.querySelectorAll('div');
  for (const div of allDivs) {
    const style = div.getAttribute('style');
    if (style && style.includes('background-image')) {
      bgImgUrl = getBackgroundImageUrl(style);
      bgDiv = div;
      break;
    }
  }

  let bgImgEl = null;
  if (bgImgUrl) {
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgImgUrl;
    bgImgEl.alt = '';
    bgImgEl.loading = 'eager';
    bgImgEl.style.width = '100%';
    bgImgEl.style.height = 'auto';
  }
  const bgRow = [bgImgEl ? bgImgEl : ''];

  // 3. Content row (title, subheading, paragraph)
  // Find all text blocks in the deepest grid
  let contentRow = [''];
  let contentContainer = null;
  // Find the deepest aem-Grid
  let grids = element.querySelectorAll('.aem-Grid');
  let deepestGrid = null;
  let maxDepth = -1;
  for (const grid of grids) {
    let depth = 0;
    let node = grid;
    while (node.parentElement && node.parentElement !== element) {
      node = node.parentElement;
      depth++;
    }
    if (depth > maxDepth) {
      maxDepth = depth;
      deepestGrid = grid;
    }
  }
  if (deepestGrid) {
    // Get all direct children with class 'text'
    const textBlocks = deepestGrid.querySelectorAll(':scope > div.text');
    // Compose a container for all text blocks
    contentContainer = document.createElement('div');
    for (const block of textBlocks) {
      // Find the cmp-text child
      const cmpText = block.querySelector('.cmp-text');
      if (cmpText) {
        // Append all children (paragraphs)
        for (const child of cmpText.children) {
          contentContainer.appendChild(child.cloneNode(true));
        }
      }
    }
    contentRow = [contentContainer];
  }

  // Compose table
  const cells = [
    headerRow,
    bgRow,
    contentRow
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
