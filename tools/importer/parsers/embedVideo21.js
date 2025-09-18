/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Find the poster image for the video
  function getPosterImage() {
    const video = element.querySelector('video[poster]');
    if (video && video.getAttribute('poster')) {
      const posterUrl = video.getAttribute('poster');
      const img = document.createElement('img');
      img.src = posterUrl;
      img.alt = '';
      return img;
    }
    const vjsDiv = element.querySelector('div[poster]');
    if (vjsDiv && vjsDiv.getAttribute('poster')) {
      const posterUrl = vjsDiv.getAttribute('poster');
      const img = document.createElement('img');
      img.src = posterUrl;
      img.alt = '';
      return img;
    }
    return null;
  }

  // Helper: Find the external video URL
  function getVideoUrl() {
    const dmDiv = element.querySelector('[data-asset-path][data-asset-type]');
    if (dmDiv) {
      const assetType = dmDiv.getAttribute('data-asset-type');
      const assetPath = dmDiv.getAttribute('data-asset-path');
      if (assetType && assetType.toLowerCase().includes('video')) {
        const videoServer = dmDiv.getAttribute('data-videoserver') || dmDiv.getAttribute('data-contenturl');
        if (videoServer && assetPath) {
          const server = videoServer.replace(/\/$/, '');
          return server + '/' + assetPath;
        }
      }
    }
    const video = element.querySelector('video[src]');
    if (video) {
      const src = video.getAttribute('src');
      if (src && !src.startsWith('blob:')) {
        return src;
      }
    }
    return null;
  }

  // Helper: Get only visually significant headline/intro text
  function getMainText() {
    // Try to find a large headline or intro text
    const headline = element.querySelector('h1, h2, h3, h4, h5, h6');
    if (headline && headline.textContent.trim()) {
      return headline.textContent.trim();
    }
    // Try to find a large visible block of text
    const bigText = element.querySelector('[style*="font-size"], [class*="title"], [class*="headline"], [class*="intro"]');
    if (bigText && bigText.textContent.trim()) {
      return bigText.textContent.trim();
    }
    // Fallback: get the first non-empty paragraph
    const p = element.querySelector('p');
    if (p && p.textContent.trim()) {
      return p.textContent.trim();
    }
    return '';
  }

  const headerRow = ['Embed (embedVideo21)'];
  const cells = [headerRow];

  const cellContent = [];
  // Add main headline/intro text if present
  const mainText = getMainText();
  if (mainText) {
    cellContent.push(document.createTextNode(mainText));
    cellContent.push(document.createElement('br'));
  }
  const posterImg = getPosterImage();
  if (posterImg) {
    cellContent.push(posterImg);
  }
  const videoUrl = getVideoUrl();
  if (videoUrl) {
    const link = document.createElement('a');
    link.href = videoUrl;
    link.textContent = videoUrl;
    cellContent.push(document.createElement('br'));
    cellContent.push(link);
  }

  // Defensive: If no video URL found, just output the image if present
  if (cellContent.length === 0) {
    cellContent.push(element);
  }

  cells.push([cellContent]);

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
