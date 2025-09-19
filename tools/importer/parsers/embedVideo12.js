/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the required block name as the header
  const headerRow = ['Embed (video) (embedVideo12)'];

  // Find the main dynamic media container
  const dm = element.querySelector('[data-asset-type="videoavs"]');

  let posterUrl = null;
  let videoUrl = null;

  if (dm) {
    // Poster image
    const videoContainer = dm.querySelector('div[poster]');
    if (videoContainer && videoContainer.hasAttribute('poster')) {
      posterUrl = videoContainer.getAttribute('poster');
    } else {
      const videoTag = dm.querySelector('video[poster]');
      if (videoTag) {
        posterUrl = videoTag.getAttribute('poster');
      }
    }

    // Video URL
    const assetPath = dm.getAttribute('data-asset-path');
    const assetType = dm.getAttribute('data-asset-type');
    if (assetPath && assetType === 'videoavs') {
      videoUrl = `https://medtronic.scene7.com/is/content/${assetPath}`;
    }
    if (!videoUrl) {
      const videoTag = dm.querySelector('video[src]');
      if (videoTag) {
        const src = videoTag.getAttribute('src');
        if (src && !src.startsWith('blob:')) {
          videoUrl = src;
        }
      }
    }

    // Compose the cell: image (if present) above the link
    const cellContent = [];
    if (posterUrl) {
      const posterImgEl = document.createElement('img');
      posterImgEl.src = posterUrl;
      posterImgEl.loading = 'lazy';
      posterImgEl.alt = '';
      cellContent.push(posterImgEl);
    }
    if (videoUrl) {
      const link = document.createElement('a');
      link.href = videoUrl;
      link.textContent = videoUrl;
      cellContent.push(link);
    }
    if (cellContent.length === 0) {
      cellContent.push(document.createTextNode('Video unavailable'));
    }

    // Build the table
    const table = WebImporter.DOMUtils.createTable([
      headerRow,
      [cellContent],
    ], document);
    element.replaceWith(table);
    return;
  }

  // Fallback: if not found, just replace with a minimal block
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ['Video unavailable'],
  ], document);
  element.replaceWith(table);
}
