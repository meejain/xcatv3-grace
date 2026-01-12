/* global WebImporter */

/**
 * Parser for hero-banner block
 *
 * Source: https://grace.com/
 * Base Block: hero
 *
 * Block Structure:
 * - Row 1: Background image
 * - Row 2: Heading + CTA button
 *
 * Source HTML Pattern:
 * <section class="hero__section">
 *   <div class="generic-hero">
 *     <img src="..." alt="...">
 *     <h2>Heading text</h2>
 *     <a href="/path">CTA text</a>
 *   </div>
 * </section>
 *
 * Generated: 2026-01-11
 */
export default function parse(element, { document }) {
  // Extract background image
  const bgImage = element.querySelector('img') ||
                  element.querySelector('picture img') ||
                  element.querySelector('[class*="hero"] img');

  // Extract heading - look for h1, h2, or heading class
  const heading = element.querySelector('h1') ||
                  element.querySelector('h2') ||
                  element.querySelector('[class*="title"]') ||
                  element.querySelector('[class*="heading"]');

  // Extract CTA links
  const ctaLinks = Array.from(element.querySelectorAll('a.btn, a.button, a[class*="cta"], .hero__section a'));

  // Build cells array
  const cells = [];

  // Row 1: Background image (if present)
  if (bgImage) {
    cells.push([bgImage.cloneNode(true)]);
  }

  // Row 2: Content - heading and CTAs
  const contentCell = [];
  if (heading) {
    const h1 = document.createElement('h1');
    h1.innerHTML = `<strong>${heading.textContent}</strong>`;
    contentCell.push(h1);
  }

  ctaLinks.forEach(cta => {
    const link = document.createElement('p');
    const a = document.createElement('a');
    a.href = cta.href;
    a.innerHTML = `<strong>${cta.textContent}</strong>`;
    link.appendChild(a);
    contentCell.push(link);
  });

  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Hero-Banner', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
