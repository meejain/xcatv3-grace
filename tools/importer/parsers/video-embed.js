/* global WebImporter */

/**
 * Parser for video-embed block
 *
 * Source: https://grace.com/
 * Base Block: video
 *
 * Block Structure:
 * - Row 1: Title + subtitle (optional)
 * - Row 2: Poster image + video URL
 *
 * Source HTML Pattern:
 * <div class="media-callout">
 *   <h2>We Are Grace</h2>
 *   <p>Subtitle text</p>
 *   <img src="poster.jpg">
 *   <iframe src="youtube.com/embed/..."></iframe>
 * </div>
 *
 * Generated: 2026-01-11
 */
export default function parse(element, { document }) {
  // Extract title
  const title = element.querySelector('h2, h3, [class*="title"]');

  // Extract subtitle/description
  const subtitle = element.querySelector('p, [class*="subtitle"], [class*="description"]');

  // Extract poster image
  const posterImg = element.querySelector('img') ||
                    element.querySelector('picture img');

  // Extract video URL from iframe or link
  let videoUrl = '';
  const iframe = element.querySelector('iframe[src*="youtube"], iframe[src*="vimeo"]');
  const videoLink = element.querySelector('a[href*="youtube"], a[href*="youtu.be"]');

  if (iframe) {
    // Convert embed URL to watch URL
    const src = iframe.src;
    const match = src.match(/embed\/([a-zA-Z0-9_-]+)/);
    if (match) {
      videoUrl = `https://www.youtube.com/watch?v=${match[1]}`;
    } else {
      videoUrl = src;
    }
  } else if (videoLink) {
    videoUrl = videoLink.href;
  }

  const cells = [];

  // Row 1: Title and subtitle (if present)
  if (title || subtitle) {
    const titleCell = [];
    if (title) {
      const h2 = document.createElement('h2');
      h2.textContent = title.textContent.trim();
      titleCell.push(h2);
    }
    if (subtitle) {
      const p = document.createElement('p');
      p.textContent = subtitle.textContent.trim();
      titleCell.push(p);
    }
    cells.push(titleCell);
  }

  // Row 2: Poster image and video URL
  const videoCell = [];
  if (posterImg) {
    videoCell.push(posterImg.cloneNode(true));
  }
  if (videoUrl) {
    const urlP = document.createElement('p');
    const a = document.createElement('a');
    a.href = videoUrl;
    a.textContent = videoUrl;
    urlP.appendChild(a);
    videoCell.push(urlP);
  }

  if (videoCell.length > 0) {
    cells.push(videoCell);
  }

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Video-Embed', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
