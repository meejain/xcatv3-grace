/* global WebImporter */

/**
 * Parser for columns-culture block
 *
 * Source: https://grace.com/
 * Base Block: columns
 *
 * Block Structure:
 * - Row: [column1 content | column2 content]
 *
 * Source HTML Pattern:
 * <div class="row">
 *   <div class="col-lg-6">
 *     <img src="...">
 *     <p>Text content</p>
 *     <a href="/path">CTA</a>
 *   </div>
 *   <div class="col-lg-6">
 *     ...
 *   </div>
 * </div>
 *
 * Generated: 2026-01-11
 */
export default function parse(element, { document }) {
  // Find column containers
  const columns = Array.from(element.querySelectorAll('.col-lg-6, .col-md-6, [class*="column"]'));

  // If no columns found, try direct children
  if (columns.length === 0) {
    const children = Array.from(element.children);
    if (children.length >= 2) {
      columns.push(...children.slice(0, 2));
    }
  }

  const cells = [];
  const row = [];

  columns.forEach(col => {
    const colContent = [];

    // Extract image with link
    const imgLink = col.querySelector('a img, a picture');
    const img = col.querySelector('img') || col.querySelector('picture img');
    const imgAnchor = img ? img.closest('a') : null;

    if (img) {
      if (imgAnchor) {
        const linkedImg = document.createElement('a');
        linkedImg.href = imgAnchor.href;
        linkedImg.appendChild(img.cloneNode(true));
        colContent.push(linkedImg);
      } else {
        colContent.push(img.cloneNode(true));
      }
    }

    // Extract text paragraphs
    const paragraphs = col.querySelectorAll('p:not(:empty)');
    paragraphs.forEach(p => {
      if (p.textContent.trim()) {
        const pEl = document.createElement('p');
        pEl.textContent = p.textContent.trim();
        colContent.push(pEl);
      }
    });

    // Extract CTA buttons/links
    const ctas = col.querySelectorAll('a.btn, a.button, a[class*="cta"]');
    ctas.forEach(cta => {
      const linkEl = document.createElement('p');
      const a = document.createElement('a');
      a.href = cta.href;
      a.textContent = cta.textContent.trim();
      linkEl.appendChild(a);
      colContent.push(linkEl);
    });

    row.push(colContent);
  });

  if (row.length > 0) {
    cells.push(row);
  }

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns-Culture', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
