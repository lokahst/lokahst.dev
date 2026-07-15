(function () {
  'use strict';

  const CONFIG = {
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1,

    animationClass: 'fade-up',
    activeClass: 'animated',

    staggerDelay: 0
  };

  let elements = [];
  let observer = null;

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function onIntersection(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;

        const delay = element.dataset.delay || 0;

        if (prefersReducedMotion()) {
          element.classList.add(CONFIG.activeClass);
        } else {
          setTimeout(() => {
            element.classList.add(CONFIG.activeClass);
          }, delay);
        }

        observer.unobserve(element);
      }
    });
  }

  function createObserver() {
    const options = {
      root: null,
      rootMargin: CONFIG.rootMargin,
      threshold: CONFIG.threshold
    };

    observer = new IntersectionObserver(onIntersection, options);
  }

  function collectElements() {
    elements = document.querySelectorAll(`.${CONFIG.animationClass}`);
  }

  function applyStaggerDelays() {
    const containers = new Map();

    elements.forEach(element => {
      const parent = element.parentElement;

      if (!containers.has(parent)) {
        containers.set(parent, []);
      }
      containers.get(parent).push(element);
    });

    containers.forEach((groupElements, container) => {
      groupElements.forEach((element, index) => {
        if (!element.dataset.delay) {
          element.dataset.delay = (index * CONFIG.staggerDelay).toString();
        }
      });
    });
  }

  function observeElements() {
    if (!observer) return;

    elements.forEach(element => {
      observer.observe(element);
    });
  }

  function animateAllImmediately() {
    elements.forEach(element => {
      element.classList.add(CONFIG.activeClass);
    });
  }

  function init() {
    collectElements();

    if (elements.length === 0) return;

    if (prefersReducedMotion()) {
      animateAllImmediately();
      return;
    }

    applyStaggerDelays();

    createObserver();
    observeElements();
  }

  function refresh() {
    if (observer) {
      observer.disconnect();
    }

    collectElements();

    if (!prefersReducedMotion()) {
      applyStaggerDelays();
      observeElements();
    }
  }

  function destroy() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }

    elements.forEach(element => {
      element.classList.remove(CONFIG.activeClass);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.LokAhstAnimations = {
    init,
    refresh,
    destroy,
    animateAllImmediately
  };

})();