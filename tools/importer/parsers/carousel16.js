/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract background-image url from style string
  function extractBgUrl(style) {
    if (!style) return null;
    const match = style.match(/background-image:\s*url\(([^)]+)\)/);
    if (match && match[1]) {
      let url = match[1].replace(/^['"]|['"]$/g, '');
      url = url.replace(/\\2f/g, '/');
      url = url.replace(/\\/g, '');
      url = url.replace(/\s+/g, '');
      url = url.replace(/^\//, '');
      if (url && !/^https?:\/\//.test(url)) {
        url = `${document.location.origin}/${url}`;
      }
      return url;
    }
    return null;
  }

  const carousels = Array.from(element.querySelectorAll('.cmp-carousel'));
  const rows = [];
  const headerRow = ['Carousel (carousel16)'];
  rows.push(headerRow);

  carousels.forEach((carousel) => {
    const items = Array.from(carousel.querySelectorAll('.cmp-carousel__item'));
    items.forEach((item) => {
      let bgUrl = null;
      let imgEl = null;
      const bgDiv = item.querySelector('[style*="background-image"]');
      if (bgDiv) {
        bgUrl = extractBgUrl(bgDiv.getAttribute('style'));
      }
      if (bgUrl) {
        imgEl = document.createElement('img');
        imgEl.src = bgUrl;
        imgEl.loading = 'lazy';
        imgEl.alt = '';
      }
      // Compose the text cell
      const textCell = [];
      // Eyebrow (optional)
      const eyebrow = item.querySelector('.eyebrow2 .cmp-text p');
      if (eyebrow) {
        textCell.push(eyebrow.textContent.trim());
      }
      // Title (h2)
      const title = item.querySelector('.title .cmp-title__text');
      if (title) {
        const h2 = document.createElement('h2');
        h2.innerHTML = title.innerHTML;
        textCell.push(h2);
      }
      // Description: all .cmp-text p that are not eyebrow
      const allPs = Array.from(item.querySelectorAll('.cmp-text p'));
      allPs.forEach((p) => {
        if (!eyebrow || p !== eyebrow) {
          const pClone = p.cloneNode(true);
          Array.from(pClone.querySelectorAll('.underline')).forEach(u => u.remove());
          textCell.push(pClone);
        }
      });
      // CTA button (optional)
      const btn = item.querySelector('.button .cmp-button');
      if (btn) {
        const link = document.createElement('a');
        link.href = btn.getAttribute('href') || btn.getAttribute('data-url') || btn.getAttribute('data-remote');
        link.target = btn.getAttribute('target') || '_self';
        const btnText = btn.querySelector('.cmp-button__text');
        link.textContent = btnText ? btnText.textContent : btn.textContent.trim();
        textCell.push(link);
      }
      // Compose the row
      rows.push([
        imgEl || '',
        textCell.length ? textCell : ''
      ]);
    });
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
