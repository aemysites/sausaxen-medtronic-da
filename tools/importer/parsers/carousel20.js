/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract background-image url from style attribute
  function extractBgUrl(style) {
    if (!style) return null;
    const match = style.match(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/i);
    if (match && match[1]) {
      // Some URLs may be encoded, decode if necessary
      return match[1].replace(/\\2f /g, '/').replace(/\\/g, '');
    }
    return null;
  }

  // Helper to create an <img> element from a background-image style
  function createImgFromBg(style, alt = '') {
    const url = extractBgUrl(style);
    if (!url) return null;
    const img = document.createElement('img');
    img.src = url;
    img.alt = alt;
    return img;
  }

  // Find the carousel block root
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Find all slides
  const slides = carousel.querySelectorAll('.cmp-carousel__item');
  if (!slides.length) return;

  // Table header
  const headerRow = ['Carousel (carousel20)'];
  const rows = [headerRow];

  slides.forEach((slide) => {
    // Find the hero-module container with background-image
    const heroModule = slide.querySelector('.hero-module');
    let imgEl = null;
    if (heroModule) {
      // The direct child with style contains the bg image
      const bgDiv = heroModule.querySelector('.cmp-container[style*="background-image"]');
      if (bgDiv && bgDiv.style) {
        imgEl = createImgFromBg(bgDiv.getAttribute('style'));
      }
    }

    // Defensive: if no image, skip this slide
    if (!imgEl) return;

    // Gather text content (title, description, cta, etc)
    // The innermost .cmp-container holds the text blocks
    let textContainer = null;
    if (heroModule) {
      // Find the innermost .cmp-container (skip the one with background-image)
      const containers = heroModule.querySelectorAll('.cmp-container');
      if (containers.length > 1) {
        textContainer = containers[containers.length - 1];
      }
    }

    // Compose the text cell
    let textCellContent = [];
    if (textContainer) {
      // Collect all direct children (text, button, isi-isw)
      const children = Array.from(textContainer.children);
      children.forEach((child) => {
        // If button, include the <a>
        if (child.classList.contains('button')) {
          const btn = child.querySelector('a');
          if (btn) textCellContent.push(btn);
        } else if (child.classList.contains('isi-isw')) {
          // ISI/ISW link (usually a <a> inside)
          const isiLink = child.querySelector('a');
          if (isiLink) textCellContent.push(isiLink);
        } else {
          // For text blocks, include their content
          const cmpText = child.querySelector('.cmp-text');
          if (cmpText) {
            // If cmpText has only one child, use it directly
            if (cmpText.children.length === 1) {
              textCellContent.push(cmpText.children[0]);
            } else {
              // Otherwise, push the cmpText itself
              textCellContent.push(cmpText);
            }
          }
        }
      });
    }
    // If nothing found, leave cell empty
    if (textCellContent.length === 1) textCellContent = textCellContent[0];
    else if (textCellContent.length === 0) textCellContent = '';

    rows.push([imgEl, textCellContent]);
  });

  // Build the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
