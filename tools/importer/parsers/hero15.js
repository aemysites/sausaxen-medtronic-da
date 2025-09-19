/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get first descendant matching selector under a root
  function findFirst(root, selector) {
    const el = root.querySelector(selector);
    return el || null;
  }

  // 1. Header row
  const headerRow = ['Hero (hero15)'];

  // 2. Find the background image (the right-side image)
  // It's the second .image in the deepest .aem-Grid
  let backgroundImg = null;
  const grid8 = element.querySelector('.aem-Grid.aem-Grid--8');
  if (grid8) {
    const images = grid8.querySelectorAll(':scope > .image');
    if (images.length > 1) {
      const imgDiv = images[1];
      backgroundImg = imgDiv.querySelector('img');
    }
  }
  // Defensive: fallback to any image if not found
  if (!backgroundImg) {
    backgroundImg = element.querySelectorAll('img')[1] || element.querySelector('img');
  }

  // 3. Compose the text content (title, subheading, CTA)
  // The left column contains: eyebrow, h3, paragraph, link
  let textContent = [];
  if (grid8) {
    // Find the left column container
    const leftCol = grid8.querySelector('.aem-Grid.aem-Grid--3');
    if (leftCol) {
      // Eyebrow (OUR MISSION)
      const eyebrow = findFirst(leftCol, '.eyebrow2');
      if (eyebrow) {
        textContent.push(eyebrow);
      }
      // Heading (h3)
      const heading = findFirst(leftCol, 'h3');
      if (heading) {
        textContent.push(heading);
      }
      // Paragraphs (main text and CTA)
      const textBlocks = leftCol.querySelectorAll('.cmp-text');
      textBlocks.forEach(tb => {
        // Only push if not already included
        if (!textContent.includes(tb)) {
          textContent.push(tb);
        }
      });
    }
  }
  // Defensive: fallback to any .cmp-text in the block
  if (textContent.length === 0) {
    element.querySelectorAll('.cmp-text').forEach(tb => textContent.push(tb));
  }

  // 4. Build table rows
  const rows = [
    headerRow,
    [backgroundImg ? backgroundImg : ''],
    [textContent.length ? textContent : ''],
  ];

  // 5. Create table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
