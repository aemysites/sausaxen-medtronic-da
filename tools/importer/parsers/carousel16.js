/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract background-image URL from style string
  function extractBgUrl(style) {
    if (!style) return null;
    const match = style.match(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/i);
    if (match && match[1]) {
      // Remove escaped slashes (\2f) and decode URI
      let url = match[1].replace(/\\2f\s*/gi, '/');
      url = url.replace(/\s/g, '');
      return url;
    }
    return null;
  }

  // Helper to create an <img> element from a URL
  function createImg(url) {
    const img = document.createElement('img');
    img.src = url;
    img.loading = 'lazy';
    return img;
  }

  // Find all carousel items
  const items = Array.from(element.querySelectorAll(':scope > .cmp-carousel__item'));

  // Build table rows
  const rows = [];
  // Header row
  const headerRow = ['Carousel (carousel16)'];
  rows.push(headerRow);

  items.forEach((item) => {
    // Find background image from the nested .cmp-container with background-image style
    let bgImgUrl = null;
    let bgContainer = item.querySelector('.cmp-container[style*="background-image"]');
    if (bgContainer) {
      bgImgUrl = extractBgUrl(bgContainer.getAttribute('style'));
    }
    let imgEl = null;
    if (bgImgUrl) {
      imgEl = createImg(bgImgUrl);
    }

    // Find the innermost .cmp-container that holds the text content
    let contentContainer = item.querySelector('.cmp-container > .container > .cmp-container');
    let contentEls = [];
    if (contentContainer) {
      // Instead of picking specific selectors, grab all direct children in order
      // This ensures all text content is captured
      const children = Array.from(contentContainer.children);
      children.forEach(child => {
        // For .eyebrow2, .title, .text, .button, etc.
        // Grab their inner content
        if (child.classList.contains('text') || child.classList.contains('eyebrow2')) {
          const cmpText = child.querySelector('.cmp-text');
          if (cmpText) {
            // Push all children (p, span, etc.)
            Array.from(cmpText.childNodes).forEach(node => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                contentEls.push(node);
              } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                // Wrap text node in a <span> for preservation
                const span = document.createElement('span');
                span.textContent = node.textContent;
                contentEls.push(span);
              }
            });
          }
        } else if (child.classList.contains('title')) {
          const cmpTitle = child.querySelector('.cmp-title__text');
          if (cmpTitle) {
            contentEls.push(cmpTitle);
          }
        } else if (child.classList.contains('button')) {
          const btn = child.querySelector('a.cmp-button');
          if (btn) {
            contentEls.push(btn);
          }
        }
      });
    }
    // Defensive: if no content found, fallback to all text in item
    if (contentEls.length === 0) {
      // Try to get all text nodes
      const ps = item.querySelectorAll('p, h1, h2, h3, h4, h5, h6, a');
      if (ps.length) {
        contentEls = Array.from(ps);
      }
    }

    // Build row: [image, content]
    rows.push([
      imgEl || '',
      contentEls.length ? contentEls : '',
    ]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
