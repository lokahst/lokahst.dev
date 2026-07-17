(function () {
  'use strict';

  const API_BASE = 'https://api.modrinth.com/v2';
  const FALLBACK = 'Unavailable';

  const resources = Object.freeze({
    lotn: Object.freeze({
      name: 'Legends of the North',
      shortName: 'LOTN',
      description: 'Skyrim-Inspired RPG plugin with everything you need in one place.',
      modrinthProject: 'lotn',
      localPage: 'resources/lotn/',
      wikiPage: 'wiki/lotn/',
      modrinthUrl: 'https://modrinth.com/plugin/lotn',
      spigotUrl: 'https://www.spigotmc.org/resources/rpg-legends-of-the-north-early-access-versions.136849/',
      githubUrl: 'https://github.com/lokahst/lotn/releases',
      githubReleasesApi: 'https://api.github.com/repos/lokahst/lotn/releases',
      githubReleasesUrl: 'https://github.com/lokahst/lotn/releases',
      status: 'Early Access'
    }),
    valentines: Object.freeze({
      name: 'Valentines',
      shortName: 'Valentines',
      description: 'Original Valentines plugin. Everything in one. Let your players be together!',
      modrinthProject: 'valentines',
      localPage: 'resources/valentines/',
      wikiPage: 'wiki/valentines/',
      modrinthUrl: 'https://modrinth.com/plugin/valentines',
      spigotUrl: 'https://www.spigotmc.org/resources/valentines.132274/',
      githubUrl: 'https://github.com/lokahst/Valentines',
      githubReleasesApi: null,
      githubReleasesUrl: null,
      status: 'Available'
    })
  });

  const cache = new Map();

  function requestJson(url) {
    if (!cache.has(url)) {
      cache.set(url, fetch(url, { headers: { Accept: 'application/json' } }).then(response => {
        if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
        return response.json();
      }).catch(error => {
        cache.delete(url);
        throw error;
      }));
    }
    return cache.get(url);
  }

  function getResource(key) {
    return resources[key] || null;
  }

  function getLatestVersion(versions) {
    if (!Array.isArray(versions) || !versions.length) return null;
    return [...versions].sort((a, b) => new Date(b.date_published) - new Date(a.date_published))[0] || null;
  }

  async function fetchResource(key) {
    const resource = getResource(key);
    if (!resource) throw new Error(`Unknown resource: ${key}`);
    const projectUrl = `${API_BASE}/project/${encodeURIComponent(resource.modrinthProject)}`;
    const versionsUrl = `${projectUrl}/version`;
    const results = await Promise.allSettled([requestJson(projectUrl), requestJson(versionsUrl)]);
    const project = results[0].status === 'fulfilled' ? results[0].value : null;
    const versions = results[1].status === 'fulfilled' ? results[1].value : null;
    return {
      key,
      config: resource,
      project,
      versions,
      latest: getLatestVersion(versions),
      errors: results.filter(result => result.status === 'rejected').map(result => result.reason)
    };
  }

  async function fetchGitHubReleases(key, latestOnly) {
    const resource = getResource(key);
    if (!resource?.githubReleasesApi) return null;
    const url = latestOnly ? `${resource.githubReleasesApi}/latest` : resource.githubReleasesApi;
    if (!latestOnly) return requestJson(url);
    try { return await requestJson(url); }
    catch {
      const releases = await requestJson(resource.githubReleasesApi);
      return Array.isArray(releases) ? releases[0] : releases;
    }
  }

  function formatDownloads(value, compact) {
    if (!Number.isFinite(value)) return FALLBACK;
    if (!compact) return value.toLocaleString();
    return new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 1 }).format(value);
  }

  function formatDate(value) {
    const date = value ? new Date(value) : null;
    if (!date || Number.isNaN(date.getTime())) return FALLBACK;
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function formatMinecraftVersions(versions) {
    if (!Array.isArray(versions) || !versions.length) return FALLBACK;
    const values = [...new Set(versions.filter(value => /^\d+(?:\.\d+){1,2}$/.test(value)))];
    if (!values.length) return FALLBACK;
    return values.length <= 4 ? values.join(', ') : `${values[0]} – ${values[values.length - 1]}`;
  }

  function formatLoaders(loaders) {
    if (!Array.isArray(loaders) || !loaders.length) return FALLBACK;
    return [...new Set(loaders)].map(loader => loader.charAt(0).toUpperCase() + loader.slice(1)).join(', ');
  }

  function primaryDownload(latest, fallbackUrl) {
    if (!latest?.files?.length) return fallbackUrl;
    const file = latest.files.find(item => item.primary) || latest.files[0];
    return file?.url || fallbackUrl;
  }

  function updateText(scope, field, value) {
    scope.querySelectorAll(`[data-field="${field}"]`).forEach(element => {
      element.textContent = value == null || value === '' ? FALLBACK : value;
      element.classList.remove('is-loading');
    });
  }

  function updateResourceScope(scope, data) {
    const fallbackUrl = data.config.modrinthUrl;
    updateText(scope, 'downloads', data.project ? formatDownloads(data.project.downloads) : FALLBACK);
    updateText(scope, 'downloads-compact', data.project ? formatDownloads(data.project.downloads, true) : FALLBACK);
    updateText(scope, 'version', data.latest?.version_number || FALLBACK);
    updateText(scope, 'published', formatDate(data.latest?.date_published));
    updateText(scope, 'minecraft', formatMinecraftVersions(data.latest?.game_versions || data.project?.game_versions));
    updateText(scope, 'loaders', formatLoaders(data.latest?.loaders || data.project?.loaders));
    scope.querySelectorAll('[data-download-link]').forEach(link => {
      link.href = primaryDownload(data.latest, fallbackUrl);
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
      link.removeAttribute('aria-disabled');
    });
    scope.classList.toggle('has-api-warning', data.errors.length > 0);
    scope.querySelectorAll('[data-modrinth-gallery]').forEach(gallery => {
      const images = Array.isArray(data.project?.gallery) ? data.project.gallery : [];
      if (!images.length) return;
      gallery.innerHTML = images.slice(0, 6).map((item, index) => `<figure><img src="${escapeHtml(safeUrl(item.url))}" alt="${escapeHtml(item.title || `${data.config.name} screenshot ${index + 1}`)}" loading="lazy"><figcaption>${escapeHtml(item.title || data.config.name)}</figcaption></figure>`).join('');
    });
  }

  async function hydratePage() {
    const scopes = [...document.querySelectorAll('[data-resource]')];
    const keys = [...new Set(scopes.map(scope => scope.dataset.resource).filter(Boolean))];
    const results = await Promise.all(keys.map(async key => {
      try { return await fetchResource(key); }
      catch (error) { return { key, config: getResource(key), project: null, versions: null, latest: null, errors: [error] }; }
    }));
    results.forEach(data => scopes.filter(scope => scope.dataset.resource === data.key).forEach(scope => updateResourceScope(scope, data)));

    const totalElements = document.querySelectorAll('[data-combined-downloads]');
    const successful = results.filter(result => Number.isFinite(result.project?.downloads));
    const total = successful.reduce((sum, result) => sum + result.project.downloads, 0);
    totalElements.forEach(element => {
      element.textContent = successful.length ? total.toLocaleString() : FALLBACK;
      element.classList.remove('is-loading');
    });
    document.querySelectorAll('[data-combined-status]').forEach(element => {
      const missing = results.length - successful.length;
      element.textContent = missing ? `Calculated from available data; ${missing} ${missing === 1 ? 'resource has' : 'resources have'} unavailable live data.` : 'Live total across all listed Modrinth resources.';
    });
    document.dispatchEvent(new CustomEvent('lokahst:resources-ready', { detail: results }));
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  }

  function safeUrl(value) {
    try {
      const url = new URL(value, window.location.href);
      return ['http:', 'https:'].includes(url.protocol) ? url.href : '#';
    } catch { return '#'; }
  }

  function inlineMarkdown(value) {
    let text = escapeHtml(value);
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) => `<a href="${escapeHtml(safeUrl(url))}" target="_blank" rel="noopener noreferrer">${label}</a>`);
    return text;
  }

  function markdownToSafeHtml(markdown) {
    const lines = String(markdown || '').replace(/\r/g, '').split('\n');
    const html = [];
    let inCode = false;
    let code = [];
    let listType = null;
    const closeList = () => { if (listType) { html.push(`</${listType}>`); listType = null; } };
    lines.forEach(line => {
      if (line.trim().startsWith('```')) {
        closeList();
        if (inCode) { html.push(`<pre><code>${escapeHtml(code.join('\n'))}</code></pre>`); code = []; }
        inCode = !inCode;
        return;
      }
      if (inCode) { code.push(line); return; }
      const heading = line.match(/^(#{1,4})\s+(.+)$/);
      const unordered = line.match(/^\s*[-*]\s+(.+)$/);
      const ordered = line.match(/^\s*\d+\.\s+(.+)$/);
      if (heading) { closeList(); const level = Math.min(4, heading[1].length + 2); html.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`); }
      else if (unordered || ordered) {
        const type = unordered ? 'ul' : 'ol';
        if (listType !== type) { closeList(); listType = type; html.push(`<${type}>`); }
        html.push(`<li>${inlineMarkdown((unordered || ordered)[1])}</li>`);
      } else if (!line.trim()) closeList();
      else { closeList(); html.push(`<p>${inlineMarkdown(line)}</p>`); }
    });
    closeList();
    if (inCode) html.push(`<pre><code>${escapeHtml(code.join('\n'))}</code></pre>`);
    return html.join('');
  }

  window.LokAhstResources = {
    resources, FALLBACK, getResource, fetchResource, fetchGitHubReleases,
    formatDownloads, formatDate, formatMinecraftVersions, formatLoaders,
    primaryDownload, markdownToSafeHtml, escapeHtml, safeUrl, hydratePage
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', hydratePage);
  else hydratePage();
})();