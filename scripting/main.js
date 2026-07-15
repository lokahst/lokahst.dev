(function() {
    'use strict';

    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    function handleNavScroll() {
        const scrollY = window.scrollY;
        const hero = document.getElementById('hero');
        
        // If no hero element, apply scrolled style immediately
        if (!hero) {
            nav.classList.add('scrolled');
            return;
        }
        
        const heroHeight = hero.offsetHeight;
        const triggerPoint = heroHeight * 0.3;

        if (scrollY > triggerPoint) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }

    function toggleMobileNav() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('nav-open');
    }

    function closeMobileNav() {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('nav-open');
    }

    function handleNavClick(e) {
        const href = e.currentTarget.getAttribute('href');

        closeMobileNav();

        if (href && href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                smoothScrollTo(target);
            }
        }
    }

    function smoothScrollTo(element) {
        const navHeight = nav.offsetHeight;
        const targetPosition = element.getBoundingClientRect().top + window.scrollY - navHeight;
        const startPosition = window.scrollY;
        const distance = targetPosition - startPosition;
        const duration = 800;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);

            const ease = 1 - Math.pow(1 - progress, 3);

            window.scrollTo(0, startPosition + distance * ease);

            if (progress < 1) {
                requestAnimationFrame(animation);
            }
        }

        requestAnimationFrame(animation);
    }

    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + nav.offsetHeight + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    function prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    const throttledNavScroll = throttle(handleNavScroll, 100);
    const throttledActiveNav = throttle(updateActiveNavLink, 100);

    window.addEventListener('scroll', throttledNavScroll);
    window.addEventListener('scroll', throttledActiveNav);

    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileNav);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMobileNav();
        }
    });

    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') &&
            !navMenu.contains(e.target) &&
            !navToggle.contains(e.target)) {
            closeMobileNav();
        }
    });

    const heroCta = document.querySelector('.hero-cta');
    if (heroCta) {
        heroCta.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(heroCta.getAttribute('href'));
            if (target) {
                smoothScrollTo(target);
            }
        });
    }

    handleNavScroll();
    updateActiveNavLink();

    window.LokAhst = {
        smoothScrollTo,
        prefersReducedMotion,
        throttle
    };

})();