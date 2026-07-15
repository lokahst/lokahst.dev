(function () {
  'use strict';

  const PROJECT_SLUG = 'lotn';
  const API_BASE = 'https://api.modrinth.com/v2';
  const FALLBACK_TEXT = 'Unavailable';

  const ELEMENT_IDS = {
    version: 'modrinth-version',
    downloads: 'modrinth-downloads',
    minecraft: 'modrinth-minecraft',
    release: 'modrinth-release'
  };

  function formatDownloads(count) {
    if (typeof count !== 'number' || isNaN(count)) {
      return FALLBACK_TEXT;
    }
    return count.toLocaleString();
  }

  function formatDate(dateString) {
    if (!dateString) {
      return FALLBACK_TEXT;
    }

    try {
      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        return FALLBACK_TEXT;
      }

      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return FALLBACK_TEXT;
    }
  }

  function formatVersion(version) {
    return version || FALLBACK_TEXT;
  }

  function formatMinecraftVersion(versions) {
    if (!versions || versions.length === 0) {
      return FALLBACK_TEXT;
    }

    const mcVersions = versions.filter(v => /^\d+\.\d+(\.\d+)?$/.test(v));

    if (mcVersions.length === 0) {
      return FALLBACK_TEXT;
    }

    mcVersions.sort((a, b) => {
      const partsA = a.split('.').map(Number);
      const partsB = b.split('.').map(Number);

      for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
        const numA = partsA[i] || 0;
        const numB = partsB[i] || 0;
        if (numA !== numB) return numA - numB;
      }
      return 0;
    });

    if (mcVersions.length === 1) {
      return mcVersions[0];
    }

    return `${mcVersions[0]} - ${mcVersions[mcVersions.length - 1]}`;
  }

  async function fetchProject() {
    try {
      const response = await fetch(`${API_BASE}/project/${PROJECT_SLUG}`);

      if (!response.ok) {
        console.warn(`Modrinth API: Project "${PROJECT_SLUG}" not found (${response.status})`);
        return null;
      }

      return await response.json();
    } catch (error) {
      console.warn('Modrinth API: Failed to fetch project', error.message);
      return null;
    }
  }

  async function fetchVersions() {
    try {
      const response = await fetch(`${API_BASE}/project/${PROJECT_SLUG}/version`);

      if (!response.ok) {
        console.warn(`Modrinth API: Versions not found (${response.status})`);
        return null;
      }

      return await response.json();
    } catch (error) {
      console.warn('Modrinth API: Failed to fetch versions', error.message);
      return null;
    }
  }

  function getLatestVersion(versions) {
    if (!versions || versions.length === 0) {
      return null;
    }

    const releases = versions.filter(v => v.version_type === 'release');

    const candidates = releases.length > 0 ? releases : versions;

    candidates.sort((a, b) => new Date(b.date_published) - new Date(a.date_published));

    return candidates[0] || null;
  }

  function getTotalDownloads(project) {
    return project?.downloads || 0;
  }

  function updateElement(elementId, value) {
    const element = document.getElementById(elementId);

    if (element) {
      element.textContent = value;
    }
  }

  function updateDisplay(project, latestVersion) {
    updateElement(
      ELEMENT_IDS.version,
      formatVersion(latestVersion?.version_number || latestVersion?.name)
    );

    updateElement(
      ELEMENT_IDS.downloads,
      formatDownloads(getTotalDownloads(project))
    );

    updateElement(
      ELEMENT_IDS.minecraft,
      formatMinecraftVersion(latestVersion?.game_versions)
    );

    updateElement(
      ELEMENT_IDS.release,
      formatDate(latestVersion?.date_published)
    );
  }

  function setUnavailable() {
    Object.values(ELEMENT_IDS).forEach(id => {
      updateElement(id, FALLBACK_TEXT);
    });
  }

  async function init() {
    const [project, versions] = await Promise.all([
      fetchProject(),
      fetchVersions()
    ]);

    if (!project) {
      setUnavailable();
      return;
    }

    const latestVersion = getLatestVersion(versions);

    updateDisplay(project, latestVersion);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.LokAhstModrinth = {
    init,
    fetchProject,
    fetchVersions,
    formatDownloads,
    formatDate
  };

})();