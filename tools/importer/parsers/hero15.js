/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find the main background image (right side image)
  function findMainImage(el) {
    // Look for the largest image in the block (not the blue bar)
    const imgs = el.querySelectorAll('img');
    let maxArea = 0;
    let mainImg = null;
    imgs.forEach((img) => {
      const area = (parseInt(img.width, 10) || 0) * (parseInt(img.height, 10) || 0);
      // Exclude the blue bar (very small height)
      if (area > maxArea && img.height > 20) {
        maxArea = area;
        mainImg = img;
      }
    });
    return mainImg;
  }

  // Helper to collect all text content (including eyebrow, heading, subheading, cta)
  function collectTextContent(el) {
    // Get all .cmp-text blocks in order
    const textBlocks = Array.from(el.querySelectorAll('.cmp-text'));
    const content = [];
    textBlocks.forEach(tb => {
      // Clone to avoid removing from DOM
      const tbClone = tb.cloneNode(true);
      // Remove empty <p> or <br> at end
      tbClone.querySelectorAll('p').forEach(p => {
        if (!p.textContent.trim() && !p.querySelector('a')) p.remove();
      });
      content.push(...tbClone.childNodes);
    });
    return content.filter(node => {
      // Only include elements or text nodes with content
      if (node.nodeType === Node.ELEMENT_NODE) return node.textContent.trim().length > 0 || node.querySelector('a');
      if (node.nodeType === Node.TEXT_NODE) return node.textContent.trim().length > 0;
      return false;
    });
  }

  // 1. Header row
  const headerRow = ['Hero (hero15)'];

  // 2. Background image row
  const mainImg = findMainImage(element);
  const bgImgRow = [mainImg ? mainImg : ''];

  // 3. Content row (all text content in order)
  const textContent = collectTextContent(element);
  const contentRow = [textContent.length ? textContent : ''];

  // Compose the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bgImgRow,
    contentRow,
  ], document);

  // Replace the element
  element.replaceWith(table);
}
