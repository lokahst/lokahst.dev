(function () {
   'use strict';

   const api = window.LokAhstResources;
   if (!api) return;

   function slugify(value) {
      return String(value || 'release').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
   }

   function excerpt(value, length) {
      const plain = String(value || '')
         .replace(/[#*_`>\[\]()]/g, '')
         .replace(/\r\n/g, '\n')
         .replace(/ *\n */g, '\n')
         .replace(/[ \t]+/g, ' ')
         .trim();
      return plain.length > length ? `${plain.slice(0, length).trim()}…` : (plain || 'No release notes were provided.');
   }

   function renderLatest(container, release) {
      const anchor = slugify(release.tag_name);
      container.innerHTML = `
      <div class="release-heading">
        <div><span class="eyebrow">Latest update</span><h3>${api.escapeHtml(release.name || release.tag_name)}</h3></div>
        ${release.prerelease ? '<span class="status-badge status-early">Prerelease</span>' : '<span class="status-badge">Release</span>'}
      </div>
      <div class="release-meta"><span>${api.escapeHtml(release.tag_name)}</span><span>${api.formatDate(release.published_at)}</span></div>
      <p>${api.escapeHtml(excerpt(release.body, 260)).replace(/\n/g, '<br>')}</p>
      <div class="inline-actions">
        <a class="btn btn-primary" href="changelog.html#${anchor}">Complete changelog</a>
        <a class="text-link" href="${api.safeUrl(release.html_url)}" target="_blank" rel="noopener noreferrer">View on GitHub <span aria-hidden="true">↗</span></a>
      </div>`;
   }

   function renderRelease(release) {
      const assets = Array.isArray(release.assets) ? release.assets : [];
      return `<article class="release-entry" id="${slugify(release.tag_name)}">
      <div class="release-heading">
        <div><span class="eyebrow">${api.escapeHtml(release.tag_name)}</span><h2>${api.escapeHtml(release.name || release.tag_name)}</h2></div>
        ${release.prerelease ? '<span class="status-badge status-early">Prerelease</span>' : '<span class="status-badge">Release</span>'}
      </div>
      <p class="release-date">Published ${api.formatDate(release.published_at)}</p>
      <div class="release-notes">${api.markdownToSafeHtml(release.body)}</div>
      ${assets.length ? `<div class="release-assets"><h3>Downloads</h3>${assets.map(asset => `<a href="${api.safeUrl(asset.browser_download_url)}" target="_blank" rel="noopener noreferrer"><i class="fas fa-download" aria-hidden="true"></i> ${api.escapeHtml(asset.name)}</a>`).join('')}</div>` : ''}
      <a class="text-link" href="${api.safeUrl(release.html_url)}" target="_blank" rel="noopener noreferrer">Original GitHub release <span aria-hidden="true">↗</span></a>
      <a class="release-anchor" href="#${slugify(release.tag_name)}" aria-label="Link to ${api.escapeHtml(release.tag_name)}">#</a>
    </article>`;
   }

   async function initLatest(container) {
      const resource = api.getResource(container.dataset.latestRelease);
      if (!resource?.githubReleasesApi) {
         const section = container.closest('section');
         if (section) section.hidden = true;
         else container.hidden = true;
         return;
      }
      try {
         renderLatest(container, await api.fetchGitHubReleases(container.dataset.latestRelease, true));
      } catch {
         container.innerHTML = '<p class="notice notice-warning">Latest release information is temporarily unavailable. Visit GitHub for the complete release list.</p>';
      }
   }

   async function initList(container) {
      const resource = api.getResource(container.dataset.releaseList);
      if (!resource?.githubReleasesApi) {
         const section = container.closest('section, main');
         if (section) section.hidden = true;
         else container.hidden = true;
         return;
      }
      try {
         const releases = await api.fetchGitHubReleases(container.dataset.releaseList, false);
         const ordered = Array.isArray(releases) ? [...releases].sort((a, b) => new Date(b.published_at) - new Date(a.published_at)) : [];
         container.innerHTML = ordered.length ? ordered.map(renderRelease).join('') : '<p class="notice">No public releases are available.</p>';
      } catch {
         container.innerHTML = '<p class="notice notice-warning">The GitHub release list is temporarily unavailable. Please try again later or use the GitHub link above.</p>';
      }
   }

   document.querySelectorAll('[data-latest-release]').forEach(initLatest);
   document.querySelectorAll('[data-release-list]').forEach(initList);
})();