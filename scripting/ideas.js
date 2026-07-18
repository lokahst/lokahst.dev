(function () {
   'use strict';

   const IDEAS = [
      // Added ---------------------
      {
         name: 'Fishing system',
         status: '1',
         description: 'A fishing system with different fish types, sizes, weights, rarities, and special catches.'
      },
      {
         name: 'Economy system',
         status: '1',
         description: 'Support for economy plugins so players can buy, sell, and trade armor, weapons, and fish.'
      },
      {
         name: 'Enviromental update 1',
         status: '1',
         description: 'Connects survival+weight system updates. Seasons, carry weight, resting, injuries, fast traveling, and time management.'
      },
      {
         name: 'Enviromental update 2',
         status: '1',
         description: 'More survival-like features.'
      },
      {
         name: 'Re-effecting update',
         status: '1',
         description: 'Adds new spell effects, particles, potions, and combat visuals.'
      },
      {
         name: 'Adventure update',
         status: '1',
         description: 'Achievements, quests, side jobs.'
      },
      {
         name: 'Per-Player',
         status: '1',
         description: 'Every single mob, loot, quest, etc.. will be different for every player.'
      },
      {
         name: 'PlaceholderAPI Support',
         status: '1',
         description: 'Add PlaceholderAPI support for compatibility with other plugins.'
      },
      {
         name: 'Combat update',
         status: '1',
         description: 'World bosses, armor rework, weapons rework, enchanting rework.'
      },
      {
         name: 'Alchemy & Crafting update',
         status: '1',
         description: 'New alchemy and crafting system. Creating new potions with various effects, using different ingredients.'
      },

      // Working on ---------------------

      {
         name: 'Shouts',
         status: '2',
         description: 'Skyrim-like shouts with cooldowns, using double shift mechanism.'
      },
      {
         name: 'Word walls',
         status: '2',
         description: 'Custom-built word walls, that randomly spawns around the world.'
      },

      // Planned ---------------------
      {
         name: 'Web Panel',
         status: '3',
         description: 'A web-based control panel for managing whole plugin.'
      },
      {
         name: 'Magicka update',
         status: '3',
         description: 'Spells learning, spell books, magic potions.'
      },
      {
         name: 'Reimagination update',
         status: '3',
         description: 'Completely custom realistically generated world. Disabled Nether & End. '
      },
      {
         name: 'Dragon Update',
         status: '3',
         description: 'Spawns dragons in overworld.'
      },
      {
         name: 'Different races',
         status: '3',
         description: 'Introduce races with distinct starting stats and abilities.'
      },
      {
         name: 'Spell tomes',
         status: '3',
         description: 'Learning how magicka and magic work?'
      },

      // Canceled ---------------------

      {
         name: 'NPC Support',
         status: '4',
         description: 'NPC support is too complex for now; server owners can use Citizens instead.'
      },
      {
         name: 'Texture pack & font',
         status: '4',
         description: 'Deferred for now.'
      },
      {
         name: 'New villages',
         status: '4',
         description: 'Custom village generation is not planned at this stage.'
      },
   ];

   const STATUS_LABELS = {
      '1': 'added',
      '2': 'progress',
      '3': 'planned',
      '4': 'canceled'
   };

   const FILTERS = [{
         key: 'all',
         label: 'All'
      },
      {
         key: '1',
         label: 'Added'
      },
      {
         key: '2',
         label: 'In progress'
      },
      {
         key: '3',
         label: 'Planned'
      },
      {
         key: '4',
         label: 'Canceled'
      }
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

      const filtered = activeFilter === 'all' ?
         ordered :
         ordered.filter(i => i.status === activeFilter);

      if (filtered.length === 0) {
         board.innerHTML = '<p class="ideas-empty">No ideas match this filter.</p>';
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
})();
