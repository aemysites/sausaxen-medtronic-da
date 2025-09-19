/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract background image URL from inline style
  function getBackgroundImageUrl(styleString) {
    if (!styleString) return null;
    const match = styleString.match(/background-image:\s*url\(([^)]+)\)/);
    if (match && match[1]) {
      // Remove any escaped chars and leading/trailing quotes
      let url = match[1].replace(/\\/g, '').replace(/^['"]|['"]$/g, '');
      return url;
    }
    return null;
  }

  // 1. Header row
  const headerRow = ['Hero (hero22)'];

  // 2. Background image row
  let bgImageUrl = null;
  let bgImageDiv = null;
  const divs = element.querySelectorAll('div');
  for (const div of divs) {
    const style = div.getAttribute('style');
    const url = getBackgroundImageUrl(style);
    if (url) {
      bgImageUrl = url;
      bgImageDiv = div;
      break;
    }
  }

  let bgImageCell;
  if (bgImageUrl) {
    // Create an <img> element for the background image
    const img = document.createElement('img');
    img.src = bgImageUrl;
    img.alt = '';
    bgImageCell = [img];
  } else {
    bgImageCell = [''];
  }

  // 3. Content row (headline, subheading, etc)
  let contentCell = [];
  // Find all .cmp-text divs
  const textBlocks = element.querySelectorAll('.cmp-text');
  for (const tb of textBlocks) {
    // Eyebrow (usually a <p> with small text)
    if (tb.parentElement.classList.contains('eyebrow2')) {
      contentCell.push(tb);
    }
    // Headline (usually <h1>)
    if (tb.querySelector('h1')) {
      contentCell.push(tb);
    }
    // Intro (paragraph after headline)
    if (tb.parentElement.classList.contains('intro-heading')) {
      contentCell.push(tb);
    }
  }

  // If nothing found, fallback to all text blocks
  if (contentCell.length === 0 && textBlocks.length > 0) {
    contentCell = Array.from(textBlocks);
  }

  // Build table rows
  const rows = [
    headerRow,
    [bgImageCell],
    [contentCell]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(block);
}
