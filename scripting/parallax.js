(function() {
    'use strict';

    const CONFIG = {
        distantSpeed: 0.1,
        midSpeed: 0.2,
        foregroundSpeed: 0.35,
        closeSpeed: 0.5,
        throttleMs: 16,
        maxTranslate: 200
    };

    const hero = document.getElementById('hero');
    const mountainDistant = document.querySelector('.mountain-distant');
    const mountainMid = document.querySelector('.mountain-mid');
    const mountainForeground = document.querySelector('.mountain-foreground');
    const mountainClose = document.querySelector('.mountain-close');

    const clouds = document.querySelectorAll('.cloud');

    let ticking = false;
    let lastScrollY = 0;

    function prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function applyParallax(element, speed, scrollY) {
        if (!element) return;

        const heroHeight = hero ? hero.offsetHeight : window.innerHeight;
        const progress = scrollY / heroHeight;

        let translate = scrollY * speed;
        translate = Math.min(translate, CONFIG.maxTranslate);
        translate = Math.max(translate, 0);

        if (scrollY < heroHeight * 1.5) {
            element.style.transform = `translateY(${translate}px)`;
        }
    }

    function applyCloudParallax(scrollY) {
        if (!clouds.length) return;

        const heroHeight = hero ? hero.offsetHeight : window.innerHeight;

        clouds.forEach((cloud, index) => {
            if (scrollY < heroHeight) {
                const speed = 0.05 + (index * 0.02);
                const translate = scrollY * speed;
                cloud.style.transform = `translateY(${translate}px)`;
            }
        });
    }

    function updateParallax() {
        const scrollY = window.scrollY;

        if (Math.abs(scrollY - lastScrollY) < 2) {
            ticking = false;
            return;
        }

        lastScrollY = scrollY;

        applyParallax(mountainDistant, CONFIG.distantSpeed, scrollY);
        applyParallax(mountainMid, CONFIG.midSpeed, scrollY);
        applyParallax(mountainForeground, CONFIG.foregroundSpeed, scrollY);
        applyParallax(mountainClose, CONFIG.closeSpeed, scrollY);

        applyCloudParallax(scrollY);

        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }

    function init() {
        if (prefersReducedMotion()) {
            return;
        }

        window.addEventListener('scroll', onScroll, { passive: true });

        updateParallax();
    }

    function destroy() {
        window.removeEventListener('scroll', onScroll);

        [mountainDistant, mountainMid, mountainForeground, mountainClose].forEach(el => {
            if (el) el.style.transform = '';
        });

        clouds.forEach(cloud => {
            cloud.style.transform = '';
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.LokAhstParallax = {
        init,
        destroy,
        update: updateParallax
    };

})();