/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get poster image URL from video block
  function getPosterUrl(el) {
    // Try to find a div with a poster attribute
    const posterDiv = el.querySelector('[poster]');
    if (posterDiv && posterDiv.getAttribute('poster')) {
      return posterDiv.getAttribute('poster');
    }
    // Try to find a video element with poster
    const video = el.querySelector('video[poster]');
    if (video && video.getAttribute('poster')) {
      return video.getAttribute('poster');
    }
    return null;
  }

  // Helper: Get external video URL from data attributes
  function getVideoUrl(el) {
    // Look for a data-asset-path and data-asset-type
    const root = el.querySelector('[data-asset-path][data-asset-type]');
    if (root) {
      const assetPath = root.getAttribute('data-asset-path');
      const assetType = root.getAttribute('data-asset-type');
      // Only handle videoavs type
      if (assetType && assetType.toLowerCase().includes('video')) {
        // Try to construct a public video URL
        // Medtronic Scene7 videos are typically served via is/content/...
        // Example: https://medtronic.scene7.com/is/content/Medtronic/hcp-landing-video-AVS
        const videoServer = root.getAttribute('data-videoserver') || 'https://medtronic.scene7.com/is/content/';
        let url = videoServer;
        if (!url.endsWith('/')) url += '/';
        url += assetPath;
        // Add file extension if available
        const assetName = root.getAttribute('data-asset-name');
        if (assetName && assetName.match(/\.mp4$/)) {
          url += '.mp4';
        }
        return url;
      }
    }
    return null;
  }

  // Helper: Extract all visible text content from the block
  function getVisibleText(el) {
    // Remove script/style/noscript
    const clone = el.cloneNode(true);
    Array.from(clone.querySelectorAll('script, style, noscript')).forEach(n => n.remove());
    // Remove elements that are visually hidden
    Array.from(clone.querySelectorAll('[aria-hidden="true"], [style*="display: none"], [style*="opacity: 0"]')).forEach(n => n.remove());
    // Get text content, trim, and collapse whitespace
    return clone.textContent.replace(/\s+/g, ' ').trim();
  }

  const headerRow = ['Embed (embedVideo21)'];

  // Find poster image
  const posterUrl = getPosterUrl(element);
  let posterImg = null;
  if (posterUrl) {
    posterImg = document.createElement('img');
    posterImg.src = posterUrl;
    posterImg.alt = '';
  }

  // Find video URL
  const videoUrl = getVideoUrl(element);

  // Compose cell contents
  const cellContent = [];
  if (posterImg) {
    cellContent.push(posterImg);
  }
  if (videoUrl) {
    const link = document.createElement('a');
    link.href = videoUrl;
    link.textContent = videoUrl;
    if (posterImg) cellContent.push(document.createElement('br'));
    cellContent.push(link);
  }

  // Defensive fallback: If no videoUrl, just show poster
  if (!videoUrl && posterImg) {
    cellContent.push(document.createElement('br'));
    cellContent.push(document.createTextNode('Video unavailable'));
  }

  // Add all visible text content from the block (for completeness)
  const text = getVisibleText(element);
  if (text) {
    cellContent.push(document.createElement('br'));
    cellContent.push(document.createTextNode(text));
  }

  // Compose table
  const rows = [
    headerRow,
    [cellContent]
  ];

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
