/* global WebImporter */
export default function parse(element, { document }) {
  // Extract background image from video poster
  function getBackgroundImageEl(el) {
    let posterUrl = null;
    const videoWithPoster = el.querySelector('video[poster]');
    if (videoWithPoster && videoWithPoster.getAttribute('poster')) {
      posterUrl = videoWithPoster.getAttribute('poster');
    } else {
      const divWithPoster = el.querySelector('[poster]');
      if (divWithPoster && divWithPoster.getAttribute('poster')) {
        posterUrl = divWithPoster.getAttribute('poster');
      }
    }
    if (posterUrl) {
      const img = document.createElement('img');
      img.src = posterUrl;
      img.alt = '';
      return img;
    }
    return '';
  }

  // Extract all visible text overlay (title, subheading, CTA, etc.)
  function getTextContentEl(el) {
    const excludeSelectors = [
      '.s7controlbar',
      '.s7socialshare',
      '.s7emaildialog',
      '.s7embeddialog',
      '.s7linkdialog',
      '.s7waiticon',
      '.s7iconeffect',
      '.s7mutablevolume',
      '.s7fullscreenbutton',
      '.s7audiocaptions',
      '.s7closedcaptionbutton',
      '.s7scrollbuttoncontainer',
    ];
    let candidates = Array.from(el.querySelectorAll('div'));
    candidates = candidates.filter(div => !excludeSelectors.some(sel => div.closest(sel)));
    let best = null;
    let maxTextLen = 0;
    candidates.forEach(div => {
      const text = typeof div.innerText === 'string' ? div.innerText.trim() : '';
      if (text.length > maxTextLen) {
        best = div;
        maxTextLen = text.length;
      }
    });
    if (best && maxTextLen > 0) {
      return best.cloneNode(true);
    }
    return '';
  }

  const headerRow = ['Hero (hero21)'];
  const backgroundImageEl = getBackgroundImageEl(element);
  const secondRow = [backgroundImageEl];
  const textContentEl = getTextContentEl(element);
  const thirdRow = textContentEl ? [textContentEl] : null;

  // Always include three rows: header, image, and text (even if text is empty string)
  const rows = [headerRow, secondRow];
  if (thirdRow) {
    rows.push(thirdRow);
  } else {
    rows.push(['']);
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
