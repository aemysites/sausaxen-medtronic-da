/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract background image from inline style
  function extractBackgroundImageUrl(style) {
    if (!style) return null;
    const match = style.match(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/i);
    if (match && match[1]) {
      // Unescape any encoded characters (e.g. \2f for /)
      return match[1].replace(/\\2f\s*/g, '/');
    }
    return null;
  }

  // 1. Header row
  const headerRow = ['Hero (hero8)'];

  // 2. Background image row
  // Find the first element with a background-image style
  let bgImageUrl = null;
  let bgImageEl = null;
  // Try to find background image from the main container or its first child
  const bgContainer = element.querySelector('[style*="background-image"]');
  if (bgContainer) {
    bgImageUrl = extractBackgroundImageUrl(bgContainer.getAttribute('style'));
  }
  if (bgImageUrl) {
    // Create an image element for the background image
    bgImageEl = document.createElement('img');
    // If the URL is relative, prefix with https://www.medtronic.com
    if (bgImageUrl.startsWith('/')) {
      bgImageEl.src = 'https://www.medtronic.com' + bgImageUrl;
    } else {
      bgImageEl.src = bgImageUrl;
    }
    bgImageEl.alt = '';
    bgImageEl.setAttribute('loading', 'eager');
    // Try to get width/height from the style if available (not present here)
  }
  const bgRow = [bgImageEl ? bgImageEl : ''];

  // 3. Content row (title, subheading, CTA)
  // Find content container (the one with the circle and text/button)
  // It's the first .circle-content or the deepest .cmp-container
  let contentContainer = element.querySelector('.circle-content .cmp-container');
  if (!contentContainer) {
    // fallback: try the first .cmp-container inside .circle-content
    const circle = element.querySelector('.circle-content');
    if (circle) {
      contentContainer = circle.querySelector('.cmp-container');
    }
  }
  if (!contentContainer) {
    // fallback: try the first .cmp-container inside element
    contentContainer = element.querySelector('.cmp-container');
  }

  // Compose content: eyebrow image, eyebrow text, title, description, button
  const contentParts = [];
  if (contentContainer) {
    // Eyebrow image (optional)
    const eyebrowImg = contentContainer.querySelector('.image img');
    if (eyebrowImg) contentParts.push(eyebrowImg);

    // Eyebrow text (optional)
    const eyebrowText = contentContainer.querySelector('.eyebrow2 .cmp-text');
    if (eyebrowText) {
      // Only keep non-empty paragraphs
      Array.from(eyebrowText.querySelectorAll('p')).forEach(p => {
        if (p.textContent && p.textContent.trim() && p.textContent.trim() !== '\u00A0') {
          contentParts.push(p);
        }
      });
    }

    // Title (h2)
    const title = contentContainer.querySelector('.title .cmp-title__text');
    if (title) contentParts.push(title);

    // Description (first .text after title)
    // There may be multiple .text blocks; use the one after the title
    const textBlocks = contentContainer.querySelectorAll('.text .cmp-text');
    textBlocks.forEach(textBlock => {
      // Only add if not already in contentParts
      if (!contentParts.includes(textBlock)) {
        contentParts.push(textBlock);
      }
    });

    // CTA button (optional)
    const button = contentContainer.querySelector('.button a');
    if (button) contentParts.push(button);
  }

  const contentRow = [contentParts];

  // Compose table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bgRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
