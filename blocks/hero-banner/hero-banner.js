// Hero Banner variant - full-width hero with background image
export default function decorate(block) {
  // Hero banner decoration - background image handling
  const picture = block.querySelector('picture');
  if (picture) {
    // Move picture to be a background element
    picture.classList.add('hero-banner-background');
  }
}
