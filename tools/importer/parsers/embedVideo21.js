/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get the poster image from the video block
  function getPosterImg(el) {
    const posterDiv = el.querySelector('[poster]');
    let posterUrl = null;
    if (posterDiv) {
      posterUrl = posterDiv.getAttribute('poster');
    } else {
      const video = el.querySelector('video[poster]');
      if (video) {
        posterUrl = video.getAttribute('poster');
      }
    }
    if (posterUrl) {
      const img = document.createElement('img');
      img.src = posterUrl;
      img.alt = '';
      return img;
    }
    return null;
  }

  // Helper: get the video URL from the data attributes
  function getVideoUrl(el) {
    const videoRoot = el.querySelector('[data-asset-path][data-asset-name][data-videoserver]');
    if (videoRoot) {
      const videoserver = videoRoot.getAttribute('data-videoserver');
      const assetPath = videoRoot.getAttribute('data-asset-path');
      const assetName = videoRoot.getAttribute('data-asset-name');
      if (videoserver && assetPath && assetName) {
        let url = `${videoserver}${assetPath}/${assetName}`;
        if (!url.endsWith('.mp4')) {
          url += '.mp4';
        }
        return url;
      }
    }
    const video = el.querySelector('video');
    if (video && video.src && !video.src.startsWith('blob:')) {
      return video.src;
    }
    return null;
  }

  // Helper: get visible text content from the block
  function getTextContent(el) {
    // Grab all visible text nodes, excluding script/style and hidden elements
    let texts = [];
    // Only consider direct children of the root element for text blocks
    Array.from(el.children).forEach(child => {
      // Check if the child is visually significant (e.g., not a video container)
      // For this block, look for large banners or headings
      if (child.offsetHeight > 0 && child.offsetWidth > 0) {
        // Get all text nodes inside this child
        const walker = document.createTreeWalker(child, NodeFilter.SHOW_TEXT, {
          acceptNode: function(node) {
            if (node.textContent && node.textContent.trim().length > 0) {
              return NodeFilter.FILTER_ACCEPT;
            }
            return NodeFilter.FILTER_REJECT;
          }
        });
        let node;
        while ((node = walker.nextNode())) {
          texts.push(node.textContent.trim());
        }
      }
    });
    // Remove duplicates and join
    return Array.from(new Set(texts)).join(' ');
  }

  const headerRow = ['Embed (embedVideo21)'];
  const cells = [headerRow];

  const posterImg = getPosterImg(element);
  const videoUrl = getVideoUrl(element);
  const textContent = getTextContent(element);

  const cellContent = [];
  if (posterImg) {
    cellContent.push(posterImg);
  }
  if (videoUrl) {
    const link = document.createElement('a');
    link.href = videoUrl;
    link.textContent = videoUrl;
    cellContent.push(link);
  }
  if (textContent) {
    cellContent.push(textContent);
  }
  if (cellContent.length === 0) {
    cellContent.push(element);
  }

  cells.push([cellContent]);

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
