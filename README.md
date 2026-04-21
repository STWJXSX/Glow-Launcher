<div align="center">

# GLOW Launcher

**A feature-rich Electron desktop launcher for Fortnite**  
Built for Save the World, Battle Royale, and Epic account automation.

`v2.3.1` · `Electron 28` · `TypeScript` · `esbuild`

</div>

---

## Overview

GLOW Launcher is a fully custom Electron application with a frameless, dark-themed UI that acts as a control center for all things Fortnite. It authenticates against the Epic Games backend using device auth, manages multiple accounts simultaneously, and exposes a full surface of automation, cosmetics, and account tools across **29 pages** organized into **5 sidebar groups**.

All IPC communication follows a strict contextIsolation model — zero `nodeIntegration` exposure, everything proxied through a typed `window.glowAPI` preload surface.

---

## Features at a Glance

| Category | Features |
|---|---|
| **Multi-account** | Add accounts via Device Auth, Device Code, Exchange Code, or Authorization Code. Import from other launchers. Reorder, remove, set main account. |
| **STW Automation** | Auto-kick bots from missions, auto-collect daily login rewards, auto-manage expeditions, auto-claim V-Bucks mission alerts. |
| **STW Tools** | View mission alerts by zone, open llamas, manage quests & rerolls, activate XP boosts, dupe exploit, party management, player stalking. |
| **STW Base** | Homebase outpost viewer with zone levels, amplifier data, endurance wave records, and full base structure scan (walls/floors/stairs/traps). |
| **File Tweaks** | DevBuild toggle, DevStairs toggle, AirStrike toggle, trap height editor per GUID, worker power setter. All backed by direct game file patching. |
| **Taxi Bot** | Per-account automated party/taxi system with cosmetic selector (skin + emote), whitelist management, cooldown tracking, and activity logs. |
| **Party** | View party members, invite/kick/promote, toggle public/private, fix invite permissions, join by display name or ID. |
| **Status Spoofing** | Set custom XMPP presence status per account with message, platform (Win/PS/XBL/iOS/Android/Switch/Mac), and presence mode (Online/Away/DND). |
| **Auto Responder** | MITM HTTP/HTTPS proxy that intercepts all app traffic. Rule editor with pattern matching, file-backed response overrides, and a live traffic viewer. |
| **BR Shop** | Item Shop with full rarity/series color theming, owned tracking, in-app purchase and gifting. |
| **BR Locker** | Equip cosmetics from owned inventory with slot pickers and a locker card image generator (via sharp). |
| **Ghost Equip** | Equip cosmetics to your party presence without owning them (outfit, backpack, emote, shoes, banner, crown count, level). |
| **V-Bucks** | V-Bucks breakdown by type (purchased/earned/promotional) across all eligible platforms. |
| **Gifts** | Gift history viewer with per-sender expansion and item details fetched from fortnite-api.com. |
| **Epic Account** | Display name, email, phone, language edits; device auth list and deletion; ban check; EULA/Privacy acceptance tracking. |
| **Friends** | Full friends list with incoming/outgoing tabs. Add, remove, block, accept, reject, cancel, remove all, accept all. |
| **Epic Status** | Live Epic Games service health dashboard with per-service status, incident history, and auto-refresh every 3 minutes. |
| **Redeem Codes** | Redeem Epic and Fortnite codes, view friend code inventory. |
| **MCP Browser** | Schema-driven MCP operation browser showing all profile operations with payload field definitions, types, and required/optional tags. |
| **Auth Viewer** | Display and generate Device Auth info, Access Tokens, Exchange Codes, Continuation Tokens, and Token verification. |
| **FN Launch Settings** | Full Fortnite GameUserSettings.ini editor split into Video (Display/Graphics/Quality/Advanced), Launch Args, and Process Killer tabs. Arrow `‹ value ›` controls for all discrete settings. |
| **Discord RPC** | Configurable Discord Rich Presence showing current page and custom detail strings. |
| **Notifications** | In-app notification center with unread badge, per-category settings (sound, toast), and full history. |
| **Settings** | Per-page visibility toggles per group, Fortnite path, minimize-to-tray, launch-on-startup, Discord RPC, page backgrounds. |

---

## Pages Overview

### STW — Save the World

| Page | Label | Description |
|---|---|---|
| `alerts.ts` | Alerts | STW mission alerts by zone (Stonewood / Plankerton / Canny / Twine). Expandable mission rows with reward items. Real-time world info fetch with V-Bucks/SR/schematic filters on the home dashboard. |
| `llamas.ts` | Llamas | Open STW card-pack llamas per account. Game-accurate card UI per llama type with quantity and Claim / Claim All buttons. Activity log with live progress. Horizontally scrollable layout. |
| `quests.ts` | Quests | Daily and weekly STW quests with categories, completion states, daily reroll count, and per-quest reroll button. |
| `dupe.ts` | Dupe | Executes the STW lobby dupe exploit (requires FORTOUTPOST homebase state). Countdown timer display, automatic retry on profile-locked errors. |
| `party.ts` | Party | Full party management: member cards, invite/kick/promote, join by name or ID, public/private toggle, fix invite permissions, player search. |
| `xpboosts.ts` | XP Boosts | Activate Personal or Teammate STW XP Boosts. Inventory quantity display, boost type selector, amount controls, target player search for teammate boosts. |
| `stalk.ts` | Stalk | Real-time matchmaking session lookup for STW. Debounced display-name search returning active lobby sessions. |
| `outpost.ts` | Outpost | Homebase outpost viewer: zone levels, amplifier counts, endurance wave data. Full base structure scan showing walls, floors, stairs, and trap inventory with icons and counts. |

### Automated Systems

| Page | Label | Description |
|---|---|---|
| `files.ts` | Files | Game file tweaker: DevBuild toggle, DevStairs toggle, AirStrike toggle, Worker Power setter, and a full trap-height editor per GUID (with presets, revert, and family info). |
| `taxi.ts` | Taxi | Per-account taxi automation. Account cards with connect status, cosmetic picker (skin + emote), whitelist management, cooldown tracking, and per-account activity logs. |
| `autokick.ts` | AutoKick | Automated mission monitor that kicks unwanted players from STW missions per account. Per-account enable/disable cards with connection state (Connected / Connecting / Error / Disabled) and activity logs. |
| `autodaily.ts` | Auto Daily | Automatic STW daily login reward collection. Per-account toggle cards showing active/disabled state and last collection timestamp. |
| `expeditions.ts` | Expeditions | Fully automated STW expedition management. Config per account with reward type filters. Actions: send, collect, abandon. Live browser for sent/completed/available expeditions with power ratings and durations. |
| `status.ts` | Status | XMPP presence status manager: activate/deactivate per account, custom message, platform (Win/PS/XBL/iOS/Android/Switch/Mac), presence mode (Online/Away/DND). |
| `autoresponder.ts` | Auto Responder | MITM HTTP/HTTPS proxy intercepting all app traffic. Master toggle, live traffic counter, rule editor with URL pattern matching and file-backed overrides, full traffic viewer with request/response details. Certificate management included. |

### Epic Games

| Page | Label | Description |
|---|---|---|
| `friends.ts` | Friends | Friends list with Friends/Incoming/Outgoing tabs. Add by name or ID, remove, block, accept, reject, cancel, remove all, accept all. |
| `epicaccount.ts` | Epic Account | Multi-tab account manager: Security (device auth list, ban check, account info), Account (edit display name, email, phone, language), EULA (acceptance tracking for EULA and Privacy Policy). |
| `epicstatus.ts` | Epic Status | Epic Games service health dashboard. Per-service operational/degraded/outage indicators, active incidents with impact levels. Auto-refreshes every 3 minutes. |
| `redeemcodes.ts` | Redeem Codes | Redeem Epic Games and Fortnite codes on the active account. Auto-strips dashes. Shows success/error results and lists available friend codes. |

### Battle Royale

| Page | Label | Description |
|---|---|---|
| `shop.ts` | Shop | Item Shop with full rarity/series color theming (Common → Mythic/Exotic plus Marvel, DC, Star Wars, Icon, Gaming, Collab series). Collapsible sections, owned tracking, in-app purchase and gifting with message. Image retry logic (up to 14 retries). |
| `locker.ts` | Locker | Two-mode locker page: cosmetic equip picker (skins/backpacks/emotes/shoes) filtered by type/rarity/chapter/exclusive toggle; and locker card image generator using sharp (download as PNG). |
| `vbucks.ts` | V-Bucks | V-Bucks breakdown across all platforms — total, purchased, earned, promotional — shown as individual stat cards with account name and refresh. |
| `gifts.ts` | Gifts | Gift history viewer. Per-sender expandable cards showing gifted items with dates. Item details fetched from fortnite-api.com with local cache. Search all Athena items. |
| `ghostequip.ts` | Ghost Equip | Equip cosmetics to party presence without owning them. Tabs: Outfit, Backpack, Emote, Shoes, Banner, Crowns, Level. Full cosmetic picker with image caching and search. |

### Utility

| Page | Label | Description |
|---|---|---|
| `fnlaunch.ts` | FN Launch | Fortnite GameUserSettings.ini editor. Three tabs: **Video** (Display, Graphics, Graphics Quality, Advanced Graphics Quality sections with `‹ value ›` arrow controls), **Launch Args** (custom command-line flags), **Process Killer** (auto-kill target processes on launch). Save buttons show `Saved ✓` confirmation for 2 seconds. |
| `mcp.ts` | MCP | Schema-driven MCP operation browser. Lists all available profile operations with payload field definitions showing name, type, required/optional, and description. Execute any operation against any profile. |
| `authPage.ts` | Auth | Auth credential viewer. Cards for Device Auth info, Access Token, Exchange Code, Continuation Token, and Token Verifier (paste and verify any token). |

### Hidden / Special Pages

| Page | Access | Description |
|---|---|---|
| `home.ts` | Logo click | Dashboard with pre-fetched world info. Overview and Summary tabs. Mission alert browser filterable by reward type (V-Bucks, Legendary Schematic, etc). Data pre-fetched at app startup. |
| `accounts.ts` | Toolbar / First run | Account manager and TOS gate. Auth methods: Device Auth, Device Code, Exchange Code, Authorization Code. Import from other launchers. Account list with reorder, remove, set-main. |
| `settings.ts` | Toolbar gear | App configuration: Fortnite install path, per-group page visibility toggles, minimize-to-tray, launch-on-startup, Discord RPC enable, per-page background images, notification settings (sound/toast/categories). |

---

<div align="center">
Made with ☁️ by STWJXSX
</div>
