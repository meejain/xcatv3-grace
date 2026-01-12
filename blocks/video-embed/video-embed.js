export default function decorate(block) {
  const link = block.querySelector('a');
  const picture = block.querySelector('picture');

  if (link) {
    const url = new URL(link.href);
    let videoId = '';

    // Extract YouTube video ID
    if (url.hostname.includes('youtube.com') || url.hostname.includes('youtube-nocookie.com')) {
      videoId = url.searchParams.get('v') || url.pathname.split('/').pop();
    } else if (url.hostname.includes('youtu.be')) {
      videoId = url.pathname.slice(1);
    }

    if (videoId) {
      const wrapper = document.createElement('div');
      wrapper.className = 'video-embed-wrapper';

      // Create poster with play button
      if (picture) {
        const posterWrapper = document.createElement('div');
        posterWrapper.className = 'video-embed-poster';
        posterWrapper.appendChild(picture);

        const playButton = document.createElement('button');
        playButton.className = 'video-embed-play';
        playButton.setAttribute('aria-label', 'Play video');
        playButton.innerHTML = '<span></span>';
        posterWrapper.appendChild(playButton);

        wrapper.appendChild(posterWrapper);

        // Click handler to load video
        posterWrapper.addEventListener('click', () => {
          const iframe = document.createElement('iframe');
          iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;
          iframe.setAttribute('frameborder', '0');
          iframe.setAttribute('allowfullscreen', '');
          iframe.setAttribute('allow', 'autoplay; encrypted-media');
          wrapper.innerHTML = '';
          wrapper.appendChild(iframe);
        });
      }

      block.innerHTML = '';
      block.appendChild(wrapper);
    }
  }
}
