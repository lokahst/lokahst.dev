(function() {
    'use strict';

    const IDEAS = [
        {
            name: 'Magicka system',
            status: '3',
            description: 'It is there but have no purpose. But it could add even more functions to this plugin.'
        },
        {
            name: 'PlaceholderAPI Support',
            status: '3',
            description: 'It\'s used in many plugins, why not here?'
        },
        {
            name: 'NPC Support',
            status: '3',
            description: 'Maybe in very late version, there will be settings to add some quests to NPCs.'
        },
        {
            name: 'World Bosses',
            status: '3',
            description: 'Adding dragons to overworld, with different damage and health, depending on player\'s level.'
        },
        {
            name: 'Fishing system',
            status: '1',
            description: 'Complex fishing system with different types of fish, sizes, weights, rarities and maybe some specials.'
        },
        {
            name: 'Economy system',
            status: '1',
            description: 'Ability to use this plugin with other economy plugins. Sell/buy items as armor, weapons or mentioned fish.'
        },
        {
            name: 'Use of font',
            status: '3',
            description: 'Change font used in GUIs, chats, or any interactions without use of texture packs. In config.'
        },
        {
            name: 'Custom texture pack',
            status: '3',
            description: 'Specifically for LOTN. GUIs, weapons and armor, food.'
        },
        {
            name: 'Different races',
            status: '3',
            description: 'Different races with different abilities.'
        },
        {
            name: 'Per-Player',
            status: '3',
            description: 'Every single mob, loot, quest, etc.. will be different for every player.'
        },
    ];

    const STATUS_LABELS = {
        '1': 'added',
        '2': 'progress',
        '3': 'considering'
    };

    const FILTERS = [
        { key: 'all', label: 'All' },
        { key: '1', label: 'Added' },
        { key: '2', label: 'In progress' },
        { key: '3', label: 'Considering' }
    ];

    const STATUS_ORDER = ['1', '2', '3'];

    let activeFilter = 'all';
    let board = null;
    let toolbar = null;

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function renderFilters() {
        if (!toolbar) return;

        toolbar.innerHTML = FILTERS.map(f => `
            <button class="idea-filter${f.key === activeFilter ? ' is-active' : ''}" data-filter="${f.key}" type="button">
                ${f.label}
            </button>
        `).join('');

        toolbar.querySelectorAll('.idea-filter').forEach(btn => {
            btn.addEventListener('click', () => {
                activeFilter = btn.dataset.filter;
                renderFilters();
                renderIdeas();
            });
        });
    }

    function renderIdeas() {
        if (!board) return;

        const ordered = [...IDEAS].sort((a, b) => {
            const indexA = STATUS_ORDER.indexOf(a.status);
            const indexB = STATUS_ORDER.indexOf(b.status);
            return indexA - indexB;
        });

        const filtered = activeFilter === 'all'
            ? ordered
            : ordered.filter(i => i.status === activeFilter);

        if (filtered.length === 0) {
            board.innerHTML = '<p class="ideas-empty">We have felt the whisper of a Word.</p>';
            return;
        }

        board.innerHTML = filtered.map(idea => `
            <article class="idea-card fade-up" data-status="${idea.status}">
                <div class="idea-status">
                    <span class="idea-status-dot"></span>
                    <span class="idea-status-label">${STATUS_LABELS[idea.status] || idea.status}</span>
                </div>
                <h3 class="idea-title">${escapeHtml(idea.name)}</h3>
                <p class="idea-desc">${escapeHtml(idea.description)}</p>
            </article>
        `).join('');

        if (window.LokAhstAnimations) {
            window.LokAhstAnimations.refresh();
        }
    }

    function init() {
        board = document.getElementById('ideasBoard');
        toolbar = document.getElementById('ideasFilters');

        if (!board || !toolbar) return;

        renderFilters();
        renderIdeas();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.LokAhstIdeas = {
        init,
        renderIdeas,
        setFilter: (key) => {
            if (!FILTERS.some(f => f.key === key)) return;
            activeFilter = key;
            renderFilters();
            renderIdeas();
        }
    };
})();