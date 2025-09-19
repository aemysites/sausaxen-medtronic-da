/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row
  const headerRow = ['Embed (embedVideo21)'];

  // Find the main video wrapper
  const dynamicMedia = element.querySelector('[data-asset-type="videoavs"]');
  let posterUrl = null;
  let videoUrl = null;

  if (dynamicMedia) {
    // Get poster from .s7videoelement or <video> tag
    const videoElement = dynamicMedia.querySelector('.s7videoelement, video');
    if (videoElement) {
      posterUrl = videoElement.getAttribute('poster') || videoElement.querySelector('video')?.getAttribute('poster');
    }
    // Construct a video URL from data attributes
    const assetPath = dynamicMedia.getAttribute('data-asset-path');
    const videoServer = dynamicMedia.getAttribute('data-videoserver');
    if (assetPath && videoServer) {
      videoUrl = `${videoServer}${assetPath}.mp4`;
    }
  }

  // Only include poster image and video link (no extraneous text)
  const cellContent = [];
  if (posterUrl) {
    const img = document.createElement('img');
    img.src = posterUrl;
    img.alt = '';
    cellContent.push(img);
  }
  if (videoUrl) {
    if (cellContent.length > 0) cellContent.push(document.createElement('br'));
    const a = document.createElement('a');
    a.href = videoUrl;
    a.textContent = videoUrl;
    cellContent.push(a);
  }

  // Fallback: if no video URL, output a message
  if (!videoUrl) {
    const fallback = document.createElement('div');
    fallback.textContent = '[video embed could not be determined]';
    cellContent.push(fallback);
  }

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    [cellContent],
  ], document);

  element.replaceWith(table);
}
