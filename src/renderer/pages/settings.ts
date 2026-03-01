import type { PageDefinition } from '../../shared/types';

let el: HTMLElement | null = null;
let fortnitePath = 'C:\\Program Files\\Epic Games\\Fortnite';

async function loadSettings(): Promise<void> {
  const settings = await window.glowAPI.storage.get<{ fortnitePath?: string }>('settings');
  fortnitePath = settings?.fortnitePath || 'C:\\Program Files\\Epic Games\\Fortnite';
}

async function saveFortnitePath(newPath: string): Promise<void> {
  fortnitePath = newPath;
  const settings = (await window.glowAPI.storage.get<Record<string, unknown>>('settings')) ?? {};
  settings.fortnitePath = newPath;
  await window.glowAPI.storage.set('settings', settings);
}

function draw(): void {
  if (!el) return;
  el.innerHTML = `
    <div class="page-settings">
      <h1 class="page-title">Settings</h1>
      <p class="page-subtitle">Configure your launcher</p>

      <div class="settings-section">
        <h2 class="settings-section-title">Game</h2>

        <div class="settings-item settings-item-stacked">
          <div class="settings-item-info">
            <span class="settings-item-label">Fortnite Installation Path</span>
            <span class="settings-item-desc">Path to your Fortnite installation folder (used by the Launch button)</span>
          </div>
          <div class="settings-path-row">
            <input type="text" class="settings-path-input" id="fortnite-path-input"
              value="${fortnitePath.replace(/"/g, '&quot;')}" spellcheck="false" />
            <button class="settings-path-btn" id="fortnite-path-browse" title="Browse...">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
              </svg>
              Browse
            </button>
          </div>
        </div>
      </div>

      <div class="settings-section">
        <h2 class="settings-section-title">General</h2>

        <div class="settings-item">
          <div class="settings-item-info">
            <span class="settings-item-label">App Version</span>
            <span class="settings-item-desc">Current version of GLOW Launcher</span>
          </div>
          <span class="settings-item-value">v1.6.0 STABLE</span>
        </div>

        <div class="settings-item">
          <div class="settings-item-info">
            <span class="settings-item-label">Data Storage</span>
            <span class="settings-item-desc">Settings are persisted locally as JSON files</span>
          </div>
          <span class="badge badge-accent">Active</span>
        </div>
      </div>

      <div class="settings-section">
        <h2 class="settings-section-title">About</h2>

        <div class="settings-item">
          <div class="settings-item-info">
            <span class="settings-item-label">Electron</span>
            <span class="settings-item-desc">Desktop runtime</span>
          </div>
          <span class="settings-item-value">v28+</span>
        </div>

        <div class="settings-item">
          <div class="settings-item-info">
            <span class="settings-item-label">TypeScript</span>
            <span class="settings-item-desc">Language</span>
          </div>
          <span class="settings-item-value">v5+</span>
        </div>
      </div>
    </div>
  `;

  bindEvents();
}

function bindEvents(): void {
  document.getElementById('fortnite-path-browse')?.addEventListener('click', async () => {
    const selected = await window.glowAPI.dialog.openDirectory();
    if (selected) {
      const input = document.getElementById('fortnite-path-input') as HTMLInputElement;
      input.value = selected;
      await saveFortnitePath(selected);
    }
  });

  const input = document.getElementById('fortnite-path-input') as HTMLInputElement | null;
  input?.addEventListener('change', async () => {
    const val = input.value.trim();
    if (val) {
      await saveFortnitePath(val);
    }
  });
}

export const settingsPage: PageDefinition = {
  id: 'settings',
  label: 'Settings',
  icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round"
          stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0
                   0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0
                   0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0
                   1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9
                   19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0
                   1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0
                   0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0
                   1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6
                   9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1
                   0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0
                   9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2
                   2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65
                   1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2
                   2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4
                   9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0
                   0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>`,
  order: 90,
  position: 'bottom',

  async render(container: HTMLElement): Promise<void> {
    el = container;
    await loadSettings();
    draw();
  },

  cleanup(): void {
    el = null;
  },
};
