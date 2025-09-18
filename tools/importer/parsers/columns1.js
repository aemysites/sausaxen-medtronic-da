/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate child divs
  function getImmediateDivs(el) {
    return Array.from(el.querySelectorAll(':scope > div'));
  }

  // Find the deepest .aem-Grid with two main columns (image and text)
  let mainGrid;
  let imageCol;
  let textCol;

  // Defensive: Traverse to find the two columns
  const outerContainers = getImmediateDivs(element);
  for (const outer of outerContainers) {
    const gridCandidates = getImmediateDivs(outer);
    for (const grid of gridCandidates) {
      const innerContainers = getImmediateDivs(grid);
      if (innerContainers.length === 2) {
        // Check if one contains an image and the other contains text
        const [col1, col2] = innerContainers;
        if (col1.querySelector('.cmp-image img') && col2.querySelector('.cmp-title, .cmp-text')) {
          mainGrid = grid;
          imageCol = col1;
          textCol = col2;
          break;
        } else if (col2.querySelector('.cmp-image img') && col1.querySelector('.cmp-title, .cmp-text')) {
          mainGrid = grid;
          imageCol = col2;
          textCol = col1;
          break;
        }
      }
    }
    if (mainGrid) break;
  }

  // Fallback: If not found, try to find first image and first text block
  if (!imageCol || !textCol) {
    imageCol = element.querySelector('.cmp-image')?.parentElement;
    textCol = element.querySelector('.cmp-title')?.parentElement?.parentElement;
  }

  // Extract image element
  let imageEl = null;
  if (imageCol) {
    const imgWrap = imageCol.querySelector('.cmp-image');
    if (imgWrap) {
      imageEl = imgWrap.querySelector('img');
    }
  }

  // Extract ALL text content from the text column
  let textContentEls = [];
  if (textCol) {
    // Get all direct children that are .cmp-text or .cmp-title
    const blocks = Array.from(textCol.querySelectorAll('.cmp-text, .cmp-title'));
    blocks.forEach(block => {
      // For .cmp-title, use the h3 (with link)
      if (block.classList.contains('cmp-title')) {
        const h3 = block.querySelector('h3');
        if (h3) textContentEls.push(h3);
      } else {
        // For .cmp-text, push all child nodes (preserve paragraphs, links, etc)
        Array.from(block.childNodes).forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
            textContentEls.push(node.cloneNode(true));
          }
        });
      }
    });
  }

  // Build table rows
  const headerRow = ['Columns block (columns1)'];
  const contentRow = [imageEl, textContentEls];

  // Create table
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(table);
}
