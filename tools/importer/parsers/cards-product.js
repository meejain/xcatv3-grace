/* global WebImporter */

/**
 * Parser for cards-product block
 *
 * Source: https://grace.com/
 * Base Block: cards
 *
 * Block Structure:
 * - Each row: [image | title + description]
 *
 * Source HTML Pattern:
 * <div class="card">
 *   <img src="..." alt="...">
 *   <div class="card-body">
 *     <h4>Title</h4>
 *     <p>Description</p>
 *     <a href="/path">Link</a>
 *   </div>
 * </div>
 *
 * Generated: 2026-01-11
 */
export default function parse(element, { document }) {
  // Find all card items
  const cards = Array.from(element.querySelectorAll('.card, [class*="card-item"], .col-lg-3'));

  // If no cards found, try to parse element itself as a single card
  if (cards.length === 0) {
    cards.push(element);
  }

  const cells = [];

  cards.forEach(card => {
    // Extract image
    const img = card.querySelector('img') ||
                card.querySelector('picture img');

    // Extract title
    const title = card.querySelector('h3, h4, h5, .card-title, [class*="title"]');

    // Extract description
    const desc = card.querySelector('p, .card-text, [class*="description"]');

    // Extract link
    const link = card.querySelector('a');

    // Build row: [image | content]
    const imageCell = [];
    if (img) {
      imageCell.push(img.cloneNode(true));
    }

    const contentCell = [];
    if (title && link) {
      // Create linked title
      const titleEl = document.createElement('p');
      const a = document.createElement('a');
      a.href = link.href;
      a.innerHTML = `<strong>${title.textContent}</strong>`;
      titleEl.appendChild(a);
      contentCell.push(titleEl);
    } else if (title) {
      const titleEl = document.createElement('p');
      titleEl.innerHTML = `<strong>${title.textContent}</strong>`;
      contentCell.push(titleEl);
    }

    if (desc) {
      const descEl = document.createElement('p');
      descEl.textContent = desc.textContent;
      contentCell.push(descEl);
    }

    if (imageCell.length > 0 || contentCell.length > 0) {
      cells.push([imageCell, contentCell]);
    }
  });

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards-Product', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
