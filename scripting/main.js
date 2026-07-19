const PLUGINS = [
  {
    slug: 'lotn',
    icon: 'assets/lotn.webp',
    modrinthUrl: 'https://modrinth.com/plugin/lotn',
  },
  {
    slug: 'valentines',
    icon: 'assets/valentines.webp',
    modrinthUrl: 'https://modrinth.com/plugin/valentines',
  },
];

const GITHUB_RELEASES_API =
  'https://api.github.com/repos/lokahst/lotn/releases';

function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatNumber(n) {
  if (n == null) return '—';
  return n.toLocaleString('en-US');
}

async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);

  if (!res.ok) {
    const error = new Error(`${res.status} ${res.statusText}`);
    error.status = res.status;
    throw error;
  }

  return res.json();
}

async function fetchLatestGithubRelease() {
  const options = {
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  };

  // GitHub's /latest endpoint ignores prereleases. LotN may currently only
  // have prerelease builds, so fall back to the normal releases list.
  try {
    return await fetchJson(`${GITHUB_RELEASES_API}/latest`, options);
  } catch (error) {
    if (error.status !== 404) throw error;
  }

  const releases = await fetchJson(`${GITHUB_RELEASES_API}?per_page=10`, options);
  const latest = releases.find((release) => !release.draft);

  if (!latest) {
    const error = new Error('No published GitHub releases found.');
    error.status = 404;
    throw error;
  }

  return latest;
}

function renderMarkdown(md) {
  const escapeHtml = (value) =>
    value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

  const inline = (value) =>
    escapeHtml(value)
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2">')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  const lines = md.replace(/\r\n?/g, '\n').split('\n');
  const html = [];
  let paragraph = [];
  let listType = null;
  let inCode = false;
  let codeLines = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    html.push(`<p>${inline(paragraph.join(' '))}</p>`);
    paragraph = [];
  };

  const closeList = () => {
    if (!listType) return;
    html.push(`</${listType}>`);
    listType = null;
  };

  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      flushParagraph();
      closeList();

      if (inCode) {
        html.push(`<pre><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
        codeLines = [];
        inCode = false;
      } else {
        inCode = true;
      }
      continue;
    }

    if (inCode) {
      codeLines.push(line);
      continue;
    }

    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      closeList();
      continue;
    }

    const heading = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      closeList();
      const level = heading[1].length;
      html.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      continue;
    }

    const ordered = trimmed.match(/^\d+\.\s+(.+)$/);
    const unordered = trimmed.match(/^[-*]\s+(.+)$/);

    if (ordered || unordered) {
      flushParagraph();
      const wantedType = ordered ? 'ol' : 'ul';

      if (listType !== wantedType) {
        closeList();
        html.push(`<${wantedType}>`);
        listType = wantedType;
      }

      html.push(`<li>${inline((ordered || unordered)[1])}</li>`);
      continue;
    }

    closeList();
    paragraph.push(trimmed);
  }

  flushParagraph();
  closeList();

  if (inCode) {
    html.push(`<pre><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
  }

  return html.join('');
}

async function loadPlugin(plugin) {
  const card = document.querySelector(`.plugin-card[data-slug="${plugin.slug}"]`);
  if (!card) return;

  const icon = card.querySelector('.plugin-icon');
  icon.src = plugin.icon;
  icon.alt = `${plugin.slug} plugin icon`;

  try {
    const data = await fetchJson(
      `https://api.modrinth.com/v2/project/${plugin.slug}`
    );

    icon.alt = `${data.title || plugin.slug} plugin icon`;
    card.querySelector('.plugin-name').textContent = data.title || plugin.slug;
    card.querySelector('.plugin-summary').textContent =
      data.description || 'No description provided.';

    const versionEl = card.querySelector('.stat-version');
    const updatedEl = card.querySelector('.stat-updated');

    versionEl.textContent = '—';
    updatedEl.textContent = formatDate(data.updated);

    try {
      const versions = await fetchJson(
        `https://api.modrinth.com/v2/project/${plugin.slug}/version`
      );
      if (Array.isArray(versions) && versions.length > 0) {
        const latest = versions[0];
        versionEl.textContent = latest.version_number || latest.name || '—';
        updatedEl.textContent = formatDate(latest.date_published || data.updated);

        const dlBtn = card.querySelector('.plugin-download');
        const primary = latest.files?.[0];
        if (primary?.url) {
          dlBtn.href = primary.url;
          if (primary.filename) dlBtn.setAttribute('download', primary.filename);
        } else {
          dlBtn.href = plugin.modrinthUrl;
        }
      }
    } catch {
      card.querySelector('.plugin-download').href = plugin.modrinthUrl;
    }

    card.querySelector('.stat-downloads').textContent = formatNumber(
      data.downloads
    );

    card.removeAttribute('aria-busy');
  } catch (err) {
    card.querySelector('.plugin-summary').textContent =
      'Could not load plugin data from Modrinth right now.';
    card.querySelector('.plugin-download').href = plugin.modrinthUrl;
    card.removeAttribute('aria-busy');
    console.error(`Failed to load ${plugin.slug}:`, err);
  }
}

async function loadChangelog() {
  const card = document.getElementById('changelog-card');
  const nameEl = card.querySelector('.changelog-name');
  const tagEl = card.querySelector('.changelog-tag');
  const bodyEl = document.getElementById('changelog-body');
  const linkEl = document.getElementById('changelog-link');

  try {
    const release = await fetchLatestGithubRelease();

    nameEl.textContent = release.name || release.tag_name || 'Latest release';
    tagEl.textContent = release.tag_name || 'latest';
    bodyEl.innerHTML = renderMarkdown(release.body || 'No changelog provided.');
    if (release.html_url) linkEl.href = release.html_url;

    card.removeAttribute('aria-busy');
  } catch (err) {
    nameEl.textContent = 'Unable to load changelog';
    tagEl.textContent = 'error';
    bodyEl.textContent =
      err.status === 403
        ? 'GitHub API rate limit reached. Try again later or open the releases page directly.'
        : 'Could not fetch the latest release from GitHub. Try the GitHub releases page directly.';
    console.error('Changelog fetch failed:', err);
    card.removeAttribute('aria-busy');
  }
}

document.getElementById('year').textContent = new Date().getFullYear();

Promise.all(PLUGINS.map(loadPlugin)).catch((e) =>
  console.error('Plugin load error:', e)
);
loadChangelog();