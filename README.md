# GLOW Launcher v1.1.0

A minimalist, `open source`, dark-themed **Fortnite desktop launcher** built with **Electron 28 + TypeScript + esbuild**.
Manage multiple Epic Games accounts, equip cosmetics, monitor STW missions, taxi players, and much more — all from a single app. 

![GLOW Banner](assets/banner.png)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Pages / Modules](#pages--modules)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [API Surface (`window.glowAPI`)](#api-surface-windowglowapi)
- [Backend Modules](#backend-modules)
- [Endpoints Catalog](#endpoints-catalog)
- [Adding a New Page](#adding-a-new-page)
- [Commands](#commands)
- [Build & Distribution](#build--distribution)
- [Dependencies](#dependencies)
- [Image Assets](#image-assets)

---

## Overview

GLOW Launcher is a feature-rich, extensible desktop app that wraps the Epic Games / Fortnite ecosystem:

- **Custom frameless window** with a draggable title bar, account switcher toolbar, and Launch button
- **Multi-account management** — device auth, account switching, avatar caching
- **Sidebar navigation** auto-generated from a page registry (16+ pages)
- **Real-time features** — XMPP presence, party management, AutoKick monitor
- **JSON file-based storage** (no database) — settings persist across sessions
- **Page system** — add new sections by creating a single `.ts` file and registering it
- **esbuild** for near-instant builds
- **electron-builder** for Windows x64 NSIS installer generation

---

## Features

| Feature | Description |
|---|---|
| **Multi-Account** | Add unlimited Epic accounts via device auth or exchange codes. Switch instantly from the toolbar. |
| **Item Shop** | Browse the current BR item shop with images, prices, V-Bucks balance, and gift to friends. |
| **STW Alerts** | View Save the World mission alerts with rewards, elements, modifiers, and power levels. |
| **Locker Generator** | Generate cosmetic locker images filtered by type, rarity, chapter, and exclusivity. |
| **Friends Manager** | View friends / incoming / outgoing requests. Accept, reject, remove, block, add by display name. |
| **File Explorer** | Browse and save STW world info data. |
| **MCP Operations** | Execute raw MCP (Model Control Protocol) operations against any profile. |
| **Player Stalker** | Look up any player by display name — check if they're in a match and matchmaking details. |
| **Party Manager** | View party info, kick/invite/promote members, toggle privacy, fix invite issues. |
| **Ghost Equip** | Equip any cosmetic (skin, backpack, emote, shoes, banner) to your party card without owning it. Also set crowns and level. |
| **EULA Accepter** | Accept Fortnite EULA and privacy policy for accounts. |
| **Auth Tools** | View device auth info, generate access/exchange tokens, verify tokens. |
| **Status / Presence** | Set custom XMPP status messages across accounts with auto-reconnect. |
| **Taxi Service** | Automated STW taxi — hosts a party, manages whitelists, accepts responsibility dialogs, with cooldowns. |
| **AutoKick Monitor** | Monitors STW missions per account. Auto-kick intruders, collect rewards, leave missions, transfer materials, reinvite, auto-join. |
| **Security Panel** | View account security info, device auths, ban status, generate exchange URLs. |
| **Launch Fortnite** | Launch the game directly from the launcher. |

---

## Pages / Modules

All pages are registered in `src/renderer/pages/registry.ts` and auto-sorted into the sidebar.

| Order | Page | ID | Description |
|---|---|---|---|
| 10 | **Home** | `home` | Welcome dashboard (accessed via logo click) |
| 12 | **Item Shop** | `shop` | BR item shop browser with purchase & gifting |
| 15 | **Alerts** | `alerts` | STW mission alerts with filtering |
| 15 | **Locker** | `locker` | Cosmetic locker image generator |
| 16 | **Friends** | `friends` | Friends list management (3 tabs: friends / received / sent) |
| 17 | **Files** | `files` | STW world info viewer / saver |
| 18 | **MCP** | `mcp` | MCP operation executor |
| 19 | **Stalk** | `stalk` | Player lookup & matchmaking checker |
| 20 | **Security** | `security` | Account security, device auths, ban checker |
| 20 | **AutoKick** | `autokick` | STW mission monitor with auto-kick / auto-collect |
| 21 | **Party** | `party` | Party management (kick, invite, promote, privacy) |
| 22 | **Ghost Equip** | `ghostequip` | Equip any cosmetic without owning it |
| 22 | **EULA** | `eula` | EULA & privacy policy accepter |
| 23 | **Auth** | `auth` | Device auth info, token generation |
| 24 | **Status** | `status` | XMPP custom presence / status |
| 25 | **Taxi** | `taxi` | STW taxi automation |
| 50 | **Accounts** | `accounts` | Account manager (toolbar-only, not in sidebar) |
| 90 | **Settings** | `settings` | App settings (pinned to sidebar bottom) |

---

## Project Structure

```
GLOW LAUNCHER v0.1/
│
├── assets/                              # Image assets
│   ├── banner.png                       #   Header logo banner
│   ├── icon.png                         #   Taskbar / app icon
│   └── icons/                           #   Feature-specific icons
│       ├── accounts-manager.png
│       ├── ajustes.png / configs.png
│       ├── dupe/ friends/ kick/
│       └── stw/                         #   STW assets (currency, elements,
│           ├── currency/                #   ingredients, modifiers, rarities,
│           ├── difficulties/            #   resources, survivors, traps,
│           ├── elements/                #   world icons, etc.)
│           └── ...
│
├── scripts/
│   └── build.js                         # esbuild bundle + asset copy script
│
├── src/
│   ├── shared/
│   │   └── types.ts                     # Shared types (PageDefinition, GlowAPI,
│   │                                    #   StoredAccount, AutoKick configs, etc.)
│   │
│   ├── main/                            # Electron main process (Node.js)
│   │   ├── index.ts                     #   App entry — BrowserWindow, IPC, managers init
│   │   ├── ipc.ts                       #   IPC handler registration (~760 lines, 70+ handlers)
│   │   ├── storage.ts                   #   JSON file storage engine
│   │   │
│   │   ├── helpers/
│   │   │   ├── endpoints.ts             #   100+ Epic Games API endpoint constants
│   │   │   ├── auth/
│   │   │   │   ├── auth.ts              #   Device auth flow, account CRUD
│   │   │   │   ├── clients.ts           #   OAuth client credentials (Android, Fortnite)
│   │   │   │   ├── security.ts          #   Account info, device auths, ban check
│   │   │   │   └── tokenRefresh.ts      #   Token refresh & authenticatedRequest wrapper
│   │   │   ├── autokick/
│   │   │   │   ├── gameVerification.ts  #   Verify game state for autokick
│   │   │   │   ├── materialsTransfer.ts #   Auto-transfer storage materials
│   │   │   │   └── rewardsProcessor.ts  #   Auto-collect mission rewards
│   │   │   ├── cmd/
│   │   │   │   └── launcher.ts          #   Launch Fortnite from GLOW
│   │   │   ├── epic/
│   │   │   │   ├── authPage.ts          #   Device auth info, tokens, exchange codes
│   │   │   │   ├── eula.ts              #   EULA / privacy policy acceptance
│   │   │   │   ├── friends.ts           #   Friend list management
│   │   │   │   ├── ghostequip.ts        #   Ghost equip cosmetics via PartyManager
│   │   │   │   ├── mcp.ts              #   MCP operation execution
│   │   │   │   ├── party.ts             #   Party management helpers
│   │   │   │   ├── stalk.ts             #   Player lookup & matchmaking
│   │   │   │   ├── status.ts            #   XMPP presence management
│   │   │   │   └── taxi.ts              #   STW taxi service
│   │   │   └── stw/
│   │   │       ├── alerts.ts            #   STW mission alerts parser
│   │   │       └── worldinfo.ts         #   STW world info data
│   │   │
│   │   ├── managers/
│   │   │   ├── logger.ts               #   Logging utility
│   │   │   ├── expeditions/            #   Expedition management
│   │   │   ├── locker/                 #   Locker image generator (Sharp)
│   │   │   │   ├── generateLocker.ts
│   │   │   │   ├── images/ UI/ utils/
│   │   │   ├── party/                  #   Party system
│   │   │   │   ├── PartyManager.ts      #   Party state & API calls
│   │   │   │   ├── ClientPartyMember.ts #   Cosmetic setters, sendPatch
│   │   │   │   ├── ClientPartyMemberMeta.ts
│   │   │   │   └── Meta.ts / PartyMember.ts / PartyMemberMeta.ts / PartyMeta.ts
│   │   │   ├── shop/
│   │   │   │   └── ShopManager.ts       #   Item shop fetch, purchase, gifting
│   │   │   ├── status/
│   │   │   │   └── StatusManager.ts     #   XMPP status with stanza.io
│   │   │   └── taxi/
│   │   │       └── TaxiManager.ts       #   STW taxi automation
│   │   │
│   │   └── events/
│   │       └── autokick/
│   │           └── monitor.ts           #   AutoKick event loop
│   │
│   ├── preload/
│   │   └── index.ts                     # contextBridge — exposes window.glowAPI (18 namespaces)
│   │
│   └── renderer/                        # Browser / UI layer
│       ├── index.html                   #   HTML shell with CSP
│       ├── styles.css                   #   Full dark-theme stylesheet (~7300 lines)
│       ├── index.ts                     #   Renderer bootstrap
│       │
│       ├── core/
│       │   ├── header.ts               #   Custom frameless title bar
│       │   ├── toolbar.ts              #   Top toolbar (logo, account switcher, launch btn)
│       │   ├── sidebar.ts              #   Auto-generated sidebar from registry
│       │   └── router.ts               #   Page router with render/cleanup lifecycle
│       │
│       └── pages/
│           ├── registry.ts              #   ★ Master page list — import & register here
│           ├── home.ts                  #   Home dashboard
│           ├── shop.ts                  #   Item Shop browser
│           ├── alerts.ts               #   STW mission alerts
│           ├── locker.ts               #   Locker image generator
│           ├── friends.ts              #   Friends management (3 tabs)
│           ├── files.ts                #   STW world info viewer
│           ├── mcp.ts                  #   MCP executor
│           ├── stalk.ts               #   Player lookup
│           ├── security.ts            #   Account security panel
│           ├── autokick.ts            #   AutoKick monitor
│           ├── party.ts               #   Party management
│           ├── ghostequip.ts          #   Ghost Equip cosmetics
│           ├── eula.ts                #   EULA accepter
│           ├── auth.ts                #   Auth tools
│           ├── status.ts              #   Status / presence
│           ├── taxi.ts                #   Taxi service
│           ├── accounts.ts            #   Account manager
│           └── settings.ts            #   Settings (pinned bottom)
│
├── dist/                                # Build output (git-ignored)
├── release/                             # Installer output (git-ignored)
├── package.json
├── tsconfig.json
└── .gitignore
```

---

## How It Works

### Boot Sequence

1. **Electron starts** → `src/main/index.ts` runs
2. Main process creates a **frameless BrowserWindow** (min 780×480, background `#08080c`)
3. `Storage` engine initializes (JSON files in `userData/data/`)
4. **IPC handlers** registered (~70+ handlers across 18 namespaces)
5. **Preload script** exposes `window.glowAPI` via `contextBridge`
6. **Renderer loads** `index.html` → `bundle.js` runs
7. `src/renderer/index.ts` initializes **header → toolbar → sidebar → router**
8. Router renders the **Home** page
9. **Background managers** initialize: AutoKick monitor, StatusManager (XMPP), TaxiManager
10. DevTools open automatically in development mode

### Navigation Flow

```
User clicks sidebar button
  → sidebar calls router.navigate(pageId)
    → router calls cleanup() on the previous page
    → router clears #content
    → router calls render(container) on the new page
    → sidebar highlights the active button
```

### Account Switching

```
User selects account in toolbar dropdown
  → toolbar dispatches CustomEvent('glow:account-switched') on window
    → all listening pages (shop, friends, etc.) auto-refresh their data
    → avatar, display name, and V-Bucks update in toolbar
```

### Authentication

- Accounts are stored with **device auth** credentials (accountId, deviceId, secret)
- Token refresh uses the **Android client** (`3f69e56c7649492c8cc29f1af08a8a12`) by default, falls back to **Fortnite client** (`98f7e42c2e3a4f86a74eb43fbb41ed39`)
- `authenticatedRequest` wrapper auto-refreshes expired tokens on 401 responses
- Exchange codes can be generated for browser login

### Storage

Settings are persisted as individual JSON files inside `userData/data/`:

- Each key maps to a `.json` file (e.g. `accounts` → `accounts.json`, `autokick` → `autokick.json`)
- Accessible from renderer via `window.glowAPI.storage.get/set/delete`
- The main process reads/writes using `fs` — no database, no external dependencies

---

## API Surface (`window.glowAPI`)

The preload script exposes **18 namespaces** with **90+ methods**:

| Namespace | Methods | Purpose |
|---|---|---|
| `storage` | `get`, `set`, `delete` | Persistent JSON storage |
| `window` | `minimize`, `maximize`, `close` | Window controls |
| `shell` | `openExternal` | Open URLs in browser |
| `dialog` | `openDirectory` | Native folder picker |
| `accounts` | 13 methods | Account CRUD, device auth, avatars, TOS |
| `launch` | `start`, `onStatus`, `offStatus` | Launch Fortnite |
| `autokick` | 8 methods | AutoKick toggle, config, status & log streams |
| `security` | 6 methods | Account info, device auths, ban check, exchange URL |
| `alerts` | `getMissions`, `getMissionsForce` | STW mission alerts |
| `locker` | `generate`, `save` | Locker image generation & save |
| `files` | `getWorldInfo`, `save` | STW world info |
| `mcp` | `execute` | Raw MCP operation execution |
| `stalk` | `search`, `matchmaking` | Player lookup & match detection |
| `party` | 12 methods | Full party management |
| `eula` | `acceptEula`, `acceptPrivacy` | EULA acceptance |
| `authPage` | 5 methods | Token generation, device auth info |
| `status` | 8 methods | XMPP presence, activate/deactivate per account |
| `taxi` | 16 methods | STW taxi, whitelists, cooldowns, status streams |
| `shop` | 8 methods | Item shop, purchase, gift, V-Bucks, rotation events |
| `ghostequip` | 7 methods | Equip outfit/backpack/emote/shoes/banner/crowns/level |
| `friends` | 9 methods | Friends CRUD, accept/reject, block, bulk operations |

---

## Backend Modules

### Helpers (`src/main/helpers/`)

| Module | File | Purpose |
|---|---|---|
| **Endpoints** | `endpoints.ts` | 100+ Epic Games API endpoint constants |
| **Auth** | `auth/auth.ts` | Device auth flow, account management |
| **Clients** | `auth/clients.ts` | OAuth client IDs & secrets (Android, Fortnite) |
| **Security** | `auth/security.ts` | Account info, device auths, ban checker |
| **Token Refresh** | `auth/tokenRefresh.ts` | Token refresh, `authenticatedRequest` wrapper |
| **Launcher** | `cmd/launcher.ts` | Launch Fortnite process |
| **Auth Page** | `epic/authPage.ts` | Device auth info, access/exchange/continuation tokens |
| **EULA** | `epic/eula.ts` | EULA & privacy acceptance |
| **Friends** | `epic/friends.ts` | Friends summary, add, remove, accept, reject, block |
| **Ghost Equip** | `epic/ghostequip.ts` | Equip cosmetics via PartyManager PATCH |
| **MCP** | `epic/mcp.ts` | Execute MCP operations |
| **Party** | `epic/party.ts` | Party helpers (info, kick, invite, join, etc.) |
| **Stalk** | `epic/stalk.ts` | Player display name lookup, matchmaking status |
| **Status** | `epic/status.ts` | XMPP presence management |
| **Taxi** | `epic/taxi.ts` | STW taxi service automation |
| **Alerts** | `stw/alerts.ts` | STW mission alert parsing |
| **World Info** | `stw/worldinfo.ts` | STW world info data extraction |
| **Game Verify** | `autokick/gameVerification.ts` | Verify game state for AutoKick |
| **Materials** | `autokick/materialsTransfer.ts` | Auto-transfer storage materials |
| **Rewards** | `autokick/rewardsProcessor.ts` | Auto-collect mission rewards |

### Managers (`src/main/managers/`)

| Manager | Purpose |
|---|---|
| **PartyManager** | Party state, member tracking, meta PATCH calls, Epic API requests |
| **ClientPartyMember** | Cosmetic setters (`setOutfit`, `setBackpack`, etc.), `sendPatch` queue |
| **ShopManager** | Item shop rotation, purchase flow, gifting, V-Bucks query |
| **StatusManager** | XMPP connection with stanza.io, custom presence, auto-reconnect |
| **TaxiManager** | STW taxi automation, party hosting, whitelist, cooldowns |
| **Locker Generator** | Sharp-based image generation for cosmetic lockers |
| **Logger** | Structured logging utility |

---

## Endpoints Catalog

`src/main/helpers/endpoints.ts` defines **100+ API endpoints** organized by category:

| Category | Examples |
|---|---|
| **Auth** | OAuth token, device auth, exchange code, kill sessions |
| **Account** | Lookup by ID/display name, external auths |
| **Friends** | Friends list, blocklist |
| **Party** | BR party CRUD, member meta patches |
| **Matchmaking** | Session lookup, session tickets |
| **Store** | BR catalog, STW catalog, purchase, gifting eligibility |
| **Stats** | BR stats v2 |
| **STW** | World info, public profile, recipes |
| **Creative** | Discovery, favorites |
| **Tournaments** | Events, windows |
| **XMPP** | WebSocket presence |
| **Cloud Storage** | System/user cloud files |
| **Entitlements** | Account entitlements |
| **Library** | Playtime tracking |
| **Launcher** | EGL manifests |
| **Status** | Lightswitch service status |
| **GraphQL** | Accounts GQL |
| **EOS** | Epic Online Services |

---

## Adding a New Page

**3 steps — ~30 seconds:**

### 1. Create the page file

Create a new `.ts` file inside `src/renderer/pages/`, e.g. `tools.ts`:

```ts
import type { PageDefinition } from '../../shared/types';

export const toolsPage: PageDefinition = {
  id: 'tools',
  label: 'Tools',
  icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round"
          stroke-linejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77
                   a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91
                   a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
        </svg>`,
  order: 20,
  // position: 'bottom',  // uncomment to pin at the bottom

  render(container: HTMLElement): void {
    container.innerHTML = `
      <h1 class="page-title">Tools</h1>
      <p class="page-subtitle">Your custom tools go here</p>
    `;
  },

  cleanup(): void {
    // Optional: runs when navigating away from this page
  },
};
```

### 2. Register it

Open `src/renderer/pages/registry.ts` and add the import + entry:

```ts
import { toolsPage } from './tools';

export const pages: PageDefinition[] = [
  // ... existing pages
  toolsPage,   // ← add here
].sort((a, b) => a.order - b.order);
```

### 3. Add backend (if needed)

For pages that need main process functionality:

1. Create a helper in `src/main/helpers/` or a manager in `src/main/managers/`
2. Register IPC handlers in `src/main/ipc.ts`
3. Add preload bridge methods in `src/preload/index.ts`
4. Add type definitions in `src/shared/types.ts` under `GlowAPI`

### 4. Rebuild

```bash
npm run dev
```

The new button appears in the sidebar automatically.

---

## PageDefinition Reference

| Property | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | ✓ | Unique kebab-case identifier |
| `label` | `string` | ✓ | Sidebar button text |
| `icon` | `string` | ✓ | Inline SVG (18×18 recommended) |
| `order` | `number` | ✓ | Sort position — lower = higher in sidebar |
| `position` | `'top' \| 'bottom'` | | `'bottom'` pins to sidebar footer |
| `render` | `(container: HTMLElement) => void` | ✓ | Called when the page becomes active |
| `cleanup` | `() => void` | | Called when navigating away |

---

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Build + launch the app |
| `npm run build` | Compile only (no launch) |
| `npm start` | Launch from existing build |
| `npm run typecheck` | Run TypeScript type-checking |
| `npm run pack` | Build + package into folder (`release/win-unpacked/`) |
| `npm run dist` | Build + create NSIS installer (`release/GLOW Launcher Setup 0.1.0.exe`) |

---

## Build & Distribution

### Build Pipeline

`scripts/build.js` uses **esbuild** to produce 3 bundles:

| Bundle | Entry | Output | Format | Target |
|---|---|---|---|---|
| Main | `src/main/index.ts` | `dist/main/index.js` | CJS | Node 18 |
| Preload | `src/preload/index.ts` | `dist/preload/index.js` | CJS | Node 18 |
| Renderer | `src/renderer/index.ts` | `dist/renderer/bundle.js` | IIFE | Chrome 120 |

After bundling, the script copies: HTML, CSS, image assets, icons, locker UI resources and images.

### Distribution

Packaging is handled by **electron-builder** (v24):

| Setting | Value |
|---|---|
| **App ID** | `com.glow.launcher` |
| **Product Name** | GLOW Launcher |
| **Platform** | Windows x64 |
| **Installer** | NSIS (non-one-click, allows custom install dir) |
| **Output** | `release/` folder |
| **ASAR Unpacked** | Locker module, Sharp, @img (native modules) |

```bash
# Build installer
npm run dist

# Output: release/GLOW Launcher Setup 0.1.0.exe
```

---

## Dependencies

### Runtime

| Package | Version | Purpose |
|---|---|---|
| `axios` | ^1.6.0 | HTTP client for Epic Games APIs |
| `sharp` | ^0.34.5 | Image processing (locker generation) |
| `@sapphire/async-queue` | ^1.5.5 | Sequential async operation queue |
| `discord.js` | ^14.25.1 | Discord bot integration |
| `fnbr` | ^4.1.2 | Fortnite BR library |
| `stanza` | ^12.21.1 | XMPP client (presence / status) |

### Development

| Package | Version | Purpose |
|---|---|---|
| `electron` | ^28.1.0 | Desktop runtime |
| `electron-builder` | ^24.9.1 | Packaging & distribution |
| `esbuild` | ^0.19.11 | Blazing-fast bundler |
| `typescript` | ^5.3.3 | Type checking |
| `@types/node` | ^20.11.0 | Node.js type definitions |

---

## Image Assets

Place images in the `assets/` folder at the project root:

| File | Usage | Recommended Size |
|---|---|---|
| `assets/banner.png` | Header logo (top-left of title bar) | ~200×24 px |
| `assets/icon.png` | App icon (taskbar + window) | 256×256 px |
| `assets/icons/` | Feature-specific icons | Varies |
| `assets/icons/stw/` | STW resources (currency, elements, modifiers, etc.) | Varies |

The build script automatically copies all images from `assets/` into `dist/` so they're available at runtime.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Runtime** | Electron 28 (Chromium 120 + Node 18) |
| **Language** | TypeScript 5.3 |
| **Bundler** | esbuild |
| **Packager** | electron-builder |
| **HTTP** | Axios |
| **XMPP** | stanza.io |
| **Image** | Sharp |
| **UI** | Vanilla TS + CSS (no framework) |
| **Storage** | JSON files (fs-based) |

---

> **Author:** STWJXSX
> **Version:** 1.1.0
> **License:** No License
