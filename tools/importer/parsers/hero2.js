/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Extract background image URL from inline style or img
  function getBgImageUrl(el) {
    const style = el.getAttribute('style') || '';
    const match = style.match(/background-image:\s*url\(['"]?(.*?)['"]?\)/i);
    if (match && match[1]) {
      let url = match[1]
        .replace(/\\2f/g, '/')
        .replace(/\\/g, '')
        .replace(/\s+/g, '');
      url = url.replace(/^\//, '');
      if (!/^https?:\/\//.test(url)) {
        url = `${document.location.origin}/${url}`;
      }
      return url;
    }
    // Check for img tag
    const img = el.querySelector('img');
    if (img && img.src) {
      return img.src;
    }
    return null;
  }

  // Helper: Create image element from URL
  function createImage(url) {
    const img = document.createElement('img');
    img.src = url;
    img.setAttribute('loading', 'lazy');
    return img;
  }

  // Try to find a background image in parent or siblings
  let bgUrl = null;
  let el = element;
  while (el && el !== document.body) {
    const url = getBgImageUrl(el);
    if (url) {
      bgUrl = url;
      break;
    }
    el = el.parentElement;
  }
  if (!bgUrl) {
    const img = element.querySelector('img');
    if (img && img.src) {
      bgUrl = img.src;
    }
  }

  // Gather all visible text content (headings, paragraphs, etc.), preserving order
  const contentCell = [];
  // Use a TreeWalker to preserve document order
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_ELEMENT,
    {
      acceptNode: (node) => {
        if (node.closest('.cmp-carousel__actions')) return NodeFilter.FILTER_REJECT;
        if (node.tagName && node.tagName.toLowerCase() === 'img') return NodeFilter.FILTER_SKIP;
        // Accept headings, paragraphs, links, buttons, and divs with text
        if ([
          'h1','h2','h3','h4','h5','h6','p','a','button','span','strong','em','b','i','div','ul','ol','li'
        ].includes(node.tagName && node.tagName.toLowerCase())) {
          if (node.textContent && node.textContent.trim()) return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_SKIP;
      }
    }
  );
  let n;
  while ((n = walker.nextNode())) {
    if (!contentCell.some(e => e.isSameNode && e.isSameNode(n))) {
      contentCell.push(n.cloneNode(true));
    }
  }

  const headerRow = ['Hero (hero2)'];
  const rows = [headerRow];
  rows.push([bgUrl ? createImage(bgUrl) : '']);
  // Always add a third row for content, even if empty (to match required structure)
  rows.push([contentCell.length ? contentCell : '']);
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
