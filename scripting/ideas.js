(function() {
    'use strict';

    const IDEAS = [
        // Added ---------------------
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
            name: 'Enviromental update 1',
            status: '1',
            description: 'Connects survival+weight system updates. Seasons, carry weight, resting, injuries, fast traveling, and time management.'
        },

        // Working on ---------------------

        {
            name: 'Enviromental update 2',
            status: '2',
            description: 'More features for survival-based gameplay.'
        },

        // Planned ---------------------

        {
            name: 'Combat update',
            status: '3',
            description: 'World bosses, armor rework, weapons rework, enchanting rework.'
        },
        {
            name: 'Magicka update',
            status: '3',
            description: 'Spells learning, spell books, magic potions.'
        },
        {
            name: 'Alchemy & Crafting update',
            status: '3',
            description: 'New alchemy and crafting system. Creating new potions with various effects, using different ingredients.'
        },
        {
            name: 'Adventure update',
            status: '3',
            description: 'Achievements, quests, side jobs.'
        },
        {
            name: 'PlaceholderAPI Support',
            status: '3',
            description: 'It\'s used in many plugins, why not here?'
        },
        {
            name: 'Per-Player',
            status: '3',
            description: 'Every single mob, loot, quest, etc.. will be different for every player.'
        },

        // Canceled ---------------------

        {
            name: 'NPC Support',
            status: '4',
            description: 'Too complex and not worth it. Server owners can still use Citizens and use quests from this plugin.'
        },
        {
            name: 'Texture pack & font',
            status: '4',
            description: 'Not worth it for now.'
        },
        {
            name: 'Different races',
            status: '4',
            description: 'Players will always chose to have the best race with the best starting stats.'
        },
        {
            name: 'New villages',
            status: '4',
            description: 'I\'m not exactly builder. And I have no idea how to add custom object generating to plugin.'
        },
    ];

    const STATUS_LABELS = {
        '1': 'added',
        '2': 'progress',
        '3': 'planned',
        '4': 'canceled'
    };

    const FILTERS = [
        { key: 'all', label: 'All' },
        { key: '1', label: 'Added' },
        { key: '2', label: 'In progress' },
        { key: '3', label: 'Planned' },
        { key: '4', label: 'Canceled' }
    ];

    const STATUS_ORDER = ['1', '2', '3', '4'];

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
