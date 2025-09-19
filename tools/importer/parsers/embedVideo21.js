/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per block requirement
  const headerRow = ['Embed (embedVideo21)'];

  // Find the main dynamic media div
  const dm = element.querySelector('[data-asset-path][data-asset-type]');
  let videoUrl = null;
  let posterUrl = null;

  if (dm) {
    // Try to construct a public video URL from asset-path and asset-name
    const assetPath = dm.getAttribute('data-asset-path');
    const assetName = dm.getAttribute('data-asset-name');
    const videoServer = dm.getAttribute('data-videoserver') || 'https://medtronic.scene7.com/is/content/';
    if (assetPath && assetName && videoServer) {
      videoUrl = `${videoServer}${assetPath}/${assetName}`;
    }
    // Poster image
    const videoEl = dm.querySelector('video');
    if (videoEl && videoEl.hasAttribute('poster')) {
      posterUrl = videoEl.getAttribute('poster');
    } else {
      const videoDiv = dm.querySelector('[poster]');
      if (videoDiv && videoDiv.getAttribute('poster')) {
        posterUrl = videoDiv.getAttribute('poster');
      }
    }
  }

  // Compose the cell content as per block requirement: image above link
  const cellContent = [];
  if (posterUrl) {
    const imgEl = document.createElement('img');
    imgEl.src = posterUrl;
    imgEl.alt = '';
    cellContent.push(imgEl);
  }
  if (videoUrl) {
    const linkEl = document.createElement('a');
    linkEl.href = videoUrl;
    linkEl.textContent = videoUrl;
    cellContent.push(document.createElement('br'), linkEl);
  }

  // Only include text that is visually relevant and not UI chrome
  // We'll look for visually prominent headings or paragraphs
  // For this block, we want to include only main visible text, not UI labels
  // Find all <h1>, <h2>, <h3>, <h4>, <h5>, <h6>, <p> inside the element
  const textEls = element.querySelectorAll('h1, h2, h3, h4, h5, h6, p');
  textEls.forEach(te => {
    if (te.textContent.trim()) {
      const textDiv = document.createElement('div');
      textDiv.textContent = te.textContent.trim();
      cellContent.push(document.createElement('br'), textDiv);
    }
  });

  // If neither video nor poster, fallback to the whole element's content
  if (!cellContent.length) {
    cellContent.push(...element.childNodes);
  }

  const tableRows = [
    headerRow,
    [cellContent]
  ];

  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
