(function () {
  'use strict';

  const hero = document.getElementById('hero');
  const statusProgress = document.querySelector('.status-progress');

  let lastScrollY = 0;
  let ticking = false;
  let progressAnimated = false;

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }


  function animateStatusBar() {
    if (statusProgress && !progressAnimated) {
      const progress = statusProgress.style.getPropertyValue('--progress') || '35%';

      statusProgress.style.width = '0';

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          statusProgress.style.width = progress;
          progressAnimated = true;
        });
      });
    }
  }

  function isInViewport(element, offset = 0) {
    if (!element) return false;

    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    return (
      rect.top < windowHeight - offset &&
      rect.bottom > 0
    );
  }

  function checkStatusBarVisibility() {
    if (!statusProgress || progressAnimated) return;

    if (isInViewport(statusProgress, 100)) {
      animateStatusBar();
    }
  }

  function onScroll() {
    const scrollY = window.scrollY;

    if (Math.abs(scrollY - lastScrollY) < 5) {
      ticking = false;
      return;
    }

    lastScrollY = scrollY;

    checkStatusBarVisibility();

    ticking = false;
  }

  function handleScroll() {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  }

  function init() {
    window.addEventListener('scroll', handleScroll, {
      passive: true
    });

    checkStatusBarVisibility();
  }

  function destroy() {
    window.removeEventListener('scroll', handleScroll);

    progressAnimated = false;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.LokAhstScroll = {
    init,
    destroy,
    isInViewport,
    animateStatusBar
  };

})();