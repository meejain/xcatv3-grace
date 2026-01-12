/* global WebImporter */

/**
 * DOM cleanup transformer for Grace.com pages
 *
 * Purpose: Remove unwanted elements before block parsing
 *
 * Generated: 2026-01-11
 */
export default function transform(document) {
  // Remove navigation elements
  const nav = document.querySelectorAll('nav, header, .header, .navigation, .nav-wrapper');
  nav.forEach(el => el.remove());

  // Remove footer elements
  const footer = document.querySelectorAll('footer, .footer, .site-footer');
  footer.forEach(el => el.remove());

  // Remove cookie banners
  const cookies = document.querySelectorAll('[class*="cookie"], [class*="consent"], #onetrust-consent-sdk');
  cookies.forEach(el => el.remove());

  // Remove scripts and styles
  const scripts = document.querySelectorAll('script, style, noscript');
  scripts.forEach(el => el.remove());

  // Remove hidden elements
  const hidden = document.querySelectorAll('[hidden], [aria-hidden="true"], .hidden, .visually-hidden');
  hidden.forEach(el => el.remove());

  // Remove social share widgets
  const social = document.querySelectorAll('[class*="social-share"], [class*="share-buttons"]');
  social.forEach(el => el.remove());

  // Clean up empty elements
  const empties = document.querySelectorAll('div:empty, span:empty, p:empty');
  empties.forEach(el => {
    if (!el.querySelector('img, picture, video, iframe')) {
      el.remove();
    }
  });
}
