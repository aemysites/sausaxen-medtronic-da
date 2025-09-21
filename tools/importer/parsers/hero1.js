/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Hero (hero1)'];

  // 2. Background image row (row 2)
  // Find .cmp-container with background-image style, but ignore section-level backgrounds
  let bgImageUrl = null;
  const bgContainers = element.querySelectorAll('.cmp-container[style*="background-image"]');
  
  for (const bgContainer of bgContainers) {
    // Skip if this is a section-level container or too high in the hierarchy
    if (bgContainer.classList.contains('section') || 
        bgContainer.classList.contains('cmp-container--section') ||
        bgContainer.parentElement === element ||
        bgContainer === element) {
      continue;
    }
    
    // Only consider containers that are likely hero-specific (nested deeper in the DOM)
    // and have hero-related classes or are within hero content areas
    const isHeroSpecific = bgContainer.closest('.hero') || 
                          bgContainer.classList.contains('hero') ||
                          bgContainer.querySelector('.cmp-image, .cmp-teaser, img, .cmp-text, .button');
    
    if (!isHeroSpecific) {
      continue;
    }
    
    if (bgContainer.style && bgContainer.style.backgroundImage) {
      // backgroundImage is like: url(/content/dam/medtronic-wide/public/brand-corporate-assets/imagery/concept/cardiac-surgeries-graphic.jpg)
      const match = bgContainer.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
      if (match && match[1]) {
        bgImageUrl = match[1];
        // If the URL is relative, make it absolute if needed
        if (bgImageUrl.startsWith('/')) {
          try {
            bgImageUrl = new URL(bgImageUrl, document.location.origin).href;
          } catch (e) {
            // fallback: leave as is
          }
        }
        break; // Found a valid hero-specific background image
      }
    }
  }

  let imageEl = null;
  if (bgImageUrl) {
    imageEl = document.createElement('img');
    imageEl.src = bgImageUrl;
    imageEl.alt = '';
  }

  const bgRow = [imageEl ? imageEl : ''];

  // 3. Content row (row 3)
  // Find the inner .cmp-container (with the text/button content)
  let contentContainer = null;
  const cmpContainers = element.querySelectorAll('.cmp-container');
  if (cmpContainers.length > 1) {
    // The second .cmp-container is the inner one with text/button
    contentContainer = cmpContainers[1];
  } else if (cmpContainers.length === 1) {
    contentContainer = cmpContainers[0];
  }

  // Defensive: fallback to element if not found
  if (!contentContainer) contentContainer = element;

  // Find the text and button blocks inside the content container
  // We'll collect them in order
  const contentEls = [];
  // Eyebrow (first text block)
  const eyebrow = contentContainer.querySelector('.text.eyebrow2 .cmp-text');
  if (eyebrow) contentEls.push(eyebrow);
  // Intro/paragraph (second text block)
  const intro = contentContainer.querySelector('.text.intro-heading .cmp-text');
  if (intro) contentEls.push(intro);
  // Main heading (third text block)
  const heading = contentContainer.querySelector('.text.h1 .cmp-text');
  if (heading) contentEls.push(heading);
  // Button (optional)
  const button = contentContainer.querySelector('.button a');
  if (button) contentEls.push(button);

  // If nothing found, fallback to all children
  if (contentEls.length === 0) {
    Array.from(contentContainer.children).forEach((el) => contentEls.push(el));
  }

  const contentRow = [contentEls];

  // Compose the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bgRow,
    contentRow,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
