(function() {
    'use strict';

    function splitTableRow(line) {
        const cells = [];
        let cell = '';
        let escaped = false;

        for (const character of line) {
            if (escaped) {
                cell += character === '|' || character === '\\' ? character : `\\${character}`;
                escaped = false;
            } else if (character === '\\') {
                escaped = true;
            } else if (character === '|') {
                cells.push(cell.trim());
                cell = '';
            } else {
                cell += character;
            }
        }

        if (escaped) cell += '\\';
        cells.push(cell.trim());
        return cells;
    }

    function renderWikiTable(source) {
        const rows = source.innerHTML
            .split(/\r?\n/)
            .map(line => line.trim())
            .filter(Boolean)
            .map(splitTableRow);

        if (rows[1]?.every(cell => /^:?-{3,}:?$/.test(cell))) rows.splice(1, 1);

        const columnCount = rows[0]?.length || 0;
        const invalidRow = rows.findIndex(row => row.length !== columnCount);
        if (rows.length < 2 || columnCount < 2 || invalidRow !== -1) {
            const error = document.createElement('p');
            error.className = 'wiki-table-error';
            error.textContent = invalidRow === -1 ?
                'You either forgot header or wrows.' :
                `Table row ${invalidRow + 1} has ${rows[invalidRow].length} cells; expected ${columnCount}. Or check if you have header.`;
            source.replaceWith(error);
            return;
        }

        const table = document.createElement('table');
        const caption = source.dataset.caption;
        if (caption) {
            const captionElement = document.createElement('caption');
            captionElement.textContent = caption;
            table.append(captionElement);
        }

        const head = table.createTHead();
        const headerRow = head.insertRow();
        rows[0].forEach(content => {
            const heading = document.createElement('th');
            heading.scope = 'col';
            heading.innerHTML = content;
            headerRow.append(heading);
        });

        const body = table.createTBody();
        rows.slice(1).forEach(row => {
            const tableRow = body.insertRow();
            row.forEach(content => {
                const cell = tableRow.insertCell();
                cell.innerHTML = content;
            });
        });

        const wrapper = document.createElement('div');
        wrapper.className = 'wiki-table-scroll';
        wrapper.append(table);
        source.replaceWith(wrapper);
    }

    document.querySelectorAll('template[data-wiki-table]').forEach(renderWikiTable);

    document.querySelectorAll('.wiki-content > table').forEach(table => {
        const wrapper = document.createElement('div');
        wrapper.className = 'wiki-table-scroll';
        table.before(wrapper);
        wrapper.append(table);
    });

    document.querySelectorAll('[data-file-src]').forEach(async code => {
        const copyButton = document.querySelector(`[data-copy-file="${code.id}"]`);

        try {
            const response = await fetch(code.dataset.fileSrc);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            code.textContent = await response.text();
            if (copyButton) copyButton.disabled = false;
        } catch (error) {
            code.textContent = `Unable to load ${code.dataset.fileSrc}.`;
            code.closest('.file-spoiler-content')?.classList.add('file-load-error');
        }
    });

    document.querySelectorAll('.file-copy-button').forEach(button => {
        button.addEventListener('click', async () => {
            const code = document.getElementById(button.dataset.copyFile);
            if (!code) return;

            const originalLabel = button.textContent;
            try {
                await navigator.clipboard.writeText(code.textContent);
                button.textContent = 'Copied!';
            } catch (error) {
                button.textContent = 'Copy failed';
            }

            window.setTimeout(() => {
                button.textContent = originalLabel;
            }, 1800);
        });
    });

    const resource = document.body.dataset.resource;
    const current = document.body.dataset.page || 'overview';
    const depth = Number(document.body.dataset.depth || 0);
    const root = '../'.repeat(depth);
    const resources = {
        lotn: {
            name: 'Legends of the North',
            groups: [
                ['Start here', [
                    ['overview', 'Overview', 'index.html'],
                ]],
                ['Reference', [
                    ['commands', 'Commands', 'commands.html'],
                    ['placeholders', 'Placeholders', 'placeholders.html'],
                ]],
                ['Functions', [
                    ['perks', 'Perks', 'functions/perks.html'],
                ]]
            ]
        },
        valentines: {
            name: 'Valentines',
            groups: [
                ['Start here', [
                    ['overview', 'Overview', 'index.html'],
                ]],
                ['Reference', [
                    ['commands', 'Commands', 'commands.html'],
                    ['permissions', 'Permissions', 'permissions.html'],
                    ['configuration', 'Configuration', 'configuration.html'],
                    ['placeholders', 'Placeholders', 'placeholders.html'],
                ]],
                ['Functions', [
                    ['achievements', 'Achievements', 'functions/achievements.html'],
                    ['effects', 'Effects', 'functions/effects.html'],
                    ['friends', 'Friends', 'functions/friends.html'],
                    ['interactions', 'Interactions', 'functions/interactions.html'],
                    ['marriage', 'Marriage', 'functions/marriage.html'],
                    ['moods', 'Moods', 'functions/moods.html'],
                ]]
            ]
        }
    };
    if (!resource || !resources[resource]) {
        return;
    }
    const info = resources[resource];
    const base = depth === 2 ? '../' : '';
    const resolve = path => base + path;
    const header = document.querySelector('.wiki-header');
    const sidebar = document.querySelector('.wiki-sidebar');
    if (header) header.innerHTML = `<button class="sidebar-toggle" type="button" aria-label="Open documentation menu" aria-expanded="false">☰</button><a class="wiki-brand" href="${root}index.html"><span>Lokahst Wiki</span></a><span class="wiki-header-spacer"></span><a class="main-site-link" href="${root}../index.html">Main website ↗</a>`;
    if (sidebar) {
        sidebar.innerHTML = `<label class="plugin-select-label" for="pluginSelect">Resource</label><select class="plugin-select" id="pluginSelect"><option value="lotn"${resource==='lotn'?' selected':''}>Legends of the North</option><option value="valentines"${resource==='valentines'?' selected':''}>Valentines</option></select><nav class="sidebar-nav" aria-label="Documentation">${info.groups.map(group => `<section class="nav-group"><h2 class="nav-group-title">${group[0]}</h2><ul>${group[1].map(item => `<li><a href="${resolve(item[2])}"${item[0]===current?' class="active" aria-current="page"':''}>${item[1]}</a></li>`).join('')}</ul></section>`).join('')}</nav>`;
    }
    const content = document.querySelector('.wiki-content');
    if (content) {
        const title = document.querySelector('h1')?.textContent || 'Documentation';
        const crumbs = document.createElement('ol');
        crumbs.className = 'breadcrumbs';
        crumbs.setAttribute('aria-label', 'Breadcrumb');
        crumbs.innerHTML = `<li><a href="${root}index.html">Wiki</a></li><li><a href="${resolve('index.html')}">${info.name}</a></li><li aria-current="page">${title}</li>`;
        content.prepend(crumbs);
        content.querySelectorAll('h2,h3').forEach(heading => {
            if (heading.closest('a')) return;
            if (!heading.id) heading.id = heading.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            const anchor = document.createElement('a');
            anchor.className = 'heading-anchor';
            anchor.href = '#' + heading.id;
            anchor.setAttribute('aria-label', 'Link to ' + heading.textContent);
            anchor.textContent = '#';
            heading.append(anchor);
        });
    }
    const toggle = document.querySelector('.sidebar-toggle');

    function close() {
        sidebar?.classList.remove('open');
        toggle?.setAttribute('aria-expanded', 'false');
        document.querySelector('.sidebar-backdrop')?.remove();
    }
    toggle?.addEventListener('click', () => {
        const open = sidebar.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(open));
        if (open) {
            const backdrop = document.createElement('div');
            backdrop.className = 'sidebar-backdrop';
            backdrop.addEventListener('click', close);
            document.body.append(backdrop);
        } else close();
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') close();
    });

    if (!document.querySelector('link[rel="icon"]')) {
        const favicon = document.createElement('link');
        favicon.rel = 'icon';
        favicon.href = `${root}assets/lokahst.png`;
        document.head.appendChild(favicon);
    }

    if (sidebar) {
        const scrollKey = `wiki-sidebar-scroll-${resource}`;

        const savedScroll = sessionStorage.getItem(scrollKey);
        if (savedScroll) {
            setTimeout(() => {
                sidebar.scrollTop = parseInt(savedScroll, 10);
            }, 0);
        }

        sidebar.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem(scrollKey, sidebar.scrollTop);
            }
        });
    }

    document.getElementById('pluginSelect')?.addEventListener('change', e => {
        if (sidebar) {
            const scrollKey = `wiki-sidebar-scroll-${e.target.value}`;
            sessionStorage.setItem(scrollKey, sidebar.scrollTop);
        }
        window.location.href = `${root}${e.target.value}/index.html`;
    });
})();