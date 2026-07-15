(function() {
    'use strict';

    const STORAGE_KEY = 'lokahst-theme';
    const DARK = 'dark';
    const LIGHT = 'light';

    function getPreferred() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === DARK || saved === LIGHT) return saved;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK : LIGHT;
    }

    function apply(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(STORAGE_KEY, theme);
        const btn = document.getElementById('themeToggle');
        if (btn) btn.setAttribute('aria-label', theme === DARK ? 'Switch to light mode' : 'Switch to dark mode');
    }

    function toggle() {
        const current = document.documentElement.getAttribute('data-theme');
        apply(current === DARK ? LIGHT : DARK);
    }

    apply(getPreferred());

    function init() {
        const btn = document.getElementById('themeToggle');
        if (btn) btn.addEventListener('click', toggle);

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!localStorage.getItem(STORAGE_KEY)) {
                apply(e.matches ? DARK : LIGHT);
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.LokAhstTheme = { toggle, apply };
})();