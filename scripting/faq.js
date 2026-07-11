(function() {
    'use strict';

    function toggle(item) {
        const isOpen = item.classList.contains('is-open');
        const button = item.querySelector('.faq-question');

        item.classList.toggle('is-open', !isOpen);
        if (button) {
            button.setAttribute('aria-expanded', String(!isOpen));
        }
    }

    function init() {
        const items = document.querySelectorAll('.faq-item');

        items.forEach(item => {
            const button = item.querySelector('.faq-question');
            if (!button) return;

            button.addEventListener('click', () => toggle(item));
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
