# Pocket Binder MVP: tasks

Source: `docs/spec.md` (MVP, 2026-11-19). Cut by engineering as vertical slices, one PR each (about 300 changed lines or fewer, not counting `package-lock.json`). The tasks land in order: each is blocked by the one before it, so every PR starts from a green `main` and no two touch the screen registry or storage at once. Every task ends with `npm test` and `npm run build` green and, from task 1, something new to see on the deployed app.

| # | Title | Blocked by |
|---|-------|-----------|
| 1 | Scaffold the app with its four-tab shell and About text | none |
| 2 | Make the app installable and open offline | 1 |
| 3 | Show all English sets in the set picker | 2 |
| 4 | Download a set for offline use and list it under My sets | 3 |
| 5 | Show a set's cards and log them with a tap | 4 |
| 6 | Add the card sheet with variants and the Master set mode | 5 |
| 7 | Show prices, values and cost to complete | 6 |
| 8 | Search cards by name or printed number | 7 |
| 9 | Add the wishlist, the set filters and the Trade tab | 8 |
| 10 | Share the trade list as a link and as text | 9 |
| 11 | Add the binder view and the Set complete moment | 10 |
| 12 | Back up and restore the collection from More | 11 |

## Shared conventions

Every task follows these; tasks do not repeat them.

**Folders**
- `src/main.ts` boots the app. `src/router.ts` maps the URL hash to a screen (hash routing, so a refresh works on Pages).
- `src/core/`: plain TypeScript logic, no DOM, no `fetch`, no storage calls. Completion, prices, search, binder pages, trade link, backup, money, dates. Each file has a `*.test.ts` beside it.
- `src/api/tcgdex.ts`: the only module that touches the network (below).
- `src/storage/`: a `Store` interface with an IndexedDB implementation and an in-memory one (tests use the in-memory one); `settings.ts` wraps localStorage. Collection, wishlist and the card cache live in IndexedDB.
- `src/ui/`: DOM code, one file per screen or component, thin, no business logic. Styles in `src/ui/styles.css`.
- `src/test/fixtures/`: small hand-written TCGdex responses (a set, cards with several variants, a card with only a holo variant, a secret rare numbered above the official count, a card with no price, a `TG05`-style card). Tests import these; no test calls the network.
- `public/`: manifest, icons, service worker. English only, in code, UI and docs.

**The TCGdex client** (`src/api/tcgdex.ts`)
- `createClient({ fetch, now })` returns `listSets()`, `getSet(id)`, `getCard(id)` and `imageUrl(card, 'low' | 'high')`. Base URL `https://api.tcgdex.net/v2/en/`. The real app passes `window.fetch`; tests pass a stub.
- All requests go through one throttle: never more than four in flight, a short pause between batches, no identifying headers, no cookies. A failed request rejects with a typed `NetworkError`; callers show the plain offline message, never a stack trace.
- Responses are mapped to our own types in `src/api/types.ts` (a `Set`, a `Card` with `variants`, `rarity`, `illustrator`, `localId`, `image`, and prices `{ trend, trendHolo, updated }` in EUR). The rest of the app never sees raw API JSON. Read the TCGdex docs (tcgdex.dev) for the field names, then pin them in the fixtures.

**Dates, money, ids**
- The clock is always injected (`now: () => number`, epoch ms), never `Date.now()` inside logic, so tests are exact. Dates from the API are ISO strings; "12 days ago" and "old price" come from one function in `src/core/dates.ts`. Show dates in the user's locale; store them as ISO UTC.
- Money is integer euro cents inside logic; format only in `src/core/money.ts`. DKK is `round(cents * 7.46)` and is always shown with "≈". A missing, null or zero price is `null` ("no price"), never 0, and totals report how many cards they left out.
- A card id is the TCGdex id (for example `sv03.5-136`). A collection entry is keyed `cardId + variant`; variants are `normal`, `reverse`, `holo`, `firstEdition`.

**Phone and accessibility**
- Design at 375 px, one column, no horizontal scroll. Touch targets at least 44 x 44 px. Respect safe areas (`env(safe-area-inset-*)`) at the bottom bar and the sheet.
- Light and dark follow the system via CSS custom properties; text contrast at least WCAG AA in both. Own name, icon and colours; no Pokémon logo, Poké Ball or type symbols as branding.
- Real `<button>`, `<label>`, `<nav>`; visible keyboard focus; images carry alt text (card name and number); counters that change use `aria-live="polite"`. Nothing works only on hover. Animation honours `prefers-reduced-motion`.
- URLs in code are relative to `import.meta.env.BASE_URL`, never a leading `/`: the deploy builds with `--base=/pocket-binder/`.
- Short UI copy, no debug text on screen, no console noise in the happy path.

**Repo rules**
- No new runtime dependencies. Dev dependencies only when a task names them, with the reason in the PR. Do not touch `optio.toml` or `.github/workflows/`.
- `npm run build` must end in `vite build` (a type check before it is fine) so the deploy's `-- --base=/pocket-binder/` reaches Vite.

---

## 1. Scaffold the app with its four-tab shell and About text

**Description**
Start the app so Pages has something to deploy and every later task has a place to add code (docs/spec.md "Experience", "Decisions: IP and disclaimer", story 21). Create the Vite + TypeScript + Vitest project in the repo root with the folders from the shared conventions, a global stylesheet with the colour and spacing tokens, a bottom bar with four tabs (Sets, Search, Trade, More) driven by `src/router.ts`, and an empty placeholder on each tab except More. More shows the About block: the disclaimer text from the spec, the TCGdex credit and the app version from `package.json`. The Sets tab shows its empty state line ("Pick your first set") with a disabled "Add a set" button for now. Area: repo root config, `src/main.ts`, `src/router.ts`, `src/ui/`, `index.html`.

**Acceptance criteria**
- [ ] `package.json` has `test` (`vitest run`) and `build` (a type check, then `vite build`, nothing after it); `package-lock.json` is committed; `npm ci && npm test && npm run build` pass from a clean checkout.
- [ ] `npm run build -- --base=/pocket-binder/` succeeds and `dist/index.html` refers to its assets under `/pocket-binder/`.
- [ ] The built app shows the four tabs at 375 px with 44 px targets and safe-area padding; switching tabs changes the hash and the screen; a reload on any tab stays on it; an unknown hash falls back to Sets.
- [ ] More shows the disclaimer from the spec (trademarks of Nintendo, Creatures, GAME FREAK and The Pokémon Company; not affiliated or endorsed; data and prices from TCGdex) and the app version. Light and dark both render readably.
- [ ] Unit test `src/router.test.ts` covers hash parsing (each tab, a nested path such as `#/set/sv01`, unknown hash, empty hash).
- [ ] `README.md` Commands section still matches reality; nothing under `.github/` or `optio.toml` changed.

**Blocked by:** none

---

## 2. Make the app installable and open offline

**Description**
The PWA basics (docs/spec.md "Decisions: Offline", "Storage", story 14). Add a web app manifest (name Pocket Binder, our own icon in 192, 512 and maskable sizes, standalone display, theme colours for light and dark, `start_url` and `scope` relative to the base), a hand-written service worker in `public/sw.js` registered from `src/main.ts`, and a persistent-storage request. The worker caches the app shell so the app opens with no signal after the first visit: navigations are network-first with the cached `index.html` as fallback, same-origin build assets are cache-first. It also provides the image cache the later tasks use: images from TCGdex's asset host are cache-first with a size cap, oldest dropped first; the cap decision is a pure function in `src/core/cache-cap.ts`. Pages cannot send a cache-busting header, so the worker takes a version from the build (a small Vite plugin in `vite.config.ts` stamps it into `sw.js`) and drops old caches on activate. The app tells the user plainly when a new version is ready ("Update ready, reload"). Area: `public/`, `vite.config.ts`, `src/main.ts`, `src/core/`.

**Acceptance criteria**
- [ ] `manifest.webmanifest` is linked from `index.html`; icons exist in 192, 512 and maskable 512; `start_url` and `scope` work under `/pocket-binder/` and at `/`.
- [ ] The service worker registers only in production builds, with a URL built from `import.meta.env.BASE_URL`; after one online load the built app (`npm run build && npm run preview`) reloads in airplane mode on every tab.
- [ ] Old caches are removed when a new version activates; a new version shows the "Update ready" prompt and reloads on tap.
- [ ] `navigator.storage.persist()` is requested once at start, guarded so browsers without it do nothing.
- [ ] Unit test `src/core/cache-cap.test.ts`: under the cap nothing is dropped, over the cap the oldest entries go first until under it, an entry larger than the cap alone is not cached, an empty cache is fine.
- [ ] Unit test for the version-stamping function the Vite plugin uses (a source string with the placeholder gets the version; no placeholder is an error).
- [ ] No new runtime dependency (a hand-written worker, no Workbox).

**Blocked by:** 1

---

## 3. Show all English sets in the set picker

**Description**
First real data on screen (docs/spec.md "Set picker", "Decisions: Data source", stories 2 and 18). Build the TCGdex client from the shared conventions with `listSets()` only so far, its throttle and typed errors, and the storage layer: the `Store` interface, an IndexedDB implementation, an in-memory one, and a small time-to-live cache on top (`getOrFetch(key, ttl, fetcher)`). The set list is cached for 7 days. "Add a set" on the Sets tab opens the picker: all English sets newest first, grouped by series, each row with name, release year and official card count, plus a filter field (name, case-insensitive). Set logos are not shown: names are text only (story 2's "logo-free"). Offline with no cached list shows the plain message with a Retry button (story 19). Choosing a set does nothing yet. Dev dependency allowed: `fake-indexeddb`, to test the IndexedDB implementation. Area: `src/api/`, `src/storage/`, `src/core/` (`sets.ts`: sort, group, filter), `src/ui/`.

**Acceptance criteria**
- [ ] The picker lists sets newest first, grouped by series, with name, year, official count; the filter narrows the list as you type and shows "No sets match" when empty.
- [ ] A second open within 7 days does not call the API (stub call count asserted); after 7 days it does; an expired cache is still shown when the network fails, with a note that it may be old.
- [ ] Offline with nothing cached shows a plain message and a working Retry.
- [ ] Unit tests (stubbed fetch, fixtures): `listSets` maps the fixture to our `Set` type; the throttle never has more than four requests in flight and pauses between batches (fake timers); a failed request rejects with `NetworkError`; sort, group and filter in `core/sets.ts`; the TTL cache for fresh, expired and failing fetcher; the IndexedDB store round trip (get, set, delete, list by prefix) through `fake-indexeddb`.
- [ ] No test or code path in CI calls the real network.

**Blocked by:** 2

---

## 4. Download a set for offline use and list it under My sets

**Description**
Adding a set (docs/spec.md "Decisions: Downloading a set", "Offline", "Experience: Sets, Set picker", stories 14, 18, 19). Choosing a set in the picker fetches the set (the checklist) and then each card's details, with the throttle from task 3, and stores them in IndexedDB; card details are cached for 30 days. A progress bar shows "Downloading 84 of 207". Progress is saved after every batch, so an interrupted download (tab closed, signal lost) resumes at the card it stopped at and only fetches what is missing. When it finishes the app opens the set page, which for now is a plain list of card numbers and names (task 5 builds the grid). The Sets tab now lists "My sets": one row per started set with name, a completion bar "0 / 165" and a percentage; the picker marks downloaded sets. Open a set that is not downloaded while offline: "Not available offline" with Retry. First-run: the empty Sets screen shows the unofficial fan app notice with a "Got it" that is remembered (stories 18, 21). Area: `src/core/download.ts`, `src/api/`, `src/storage/`, `src/ui/`.

**Acceptance criteria**
- [ ] Downloading a fixture set stores the set and every card; the bar counts up; the set then appears in My sets and the picker shows it as downloaded.
- [ ] Killing the download mid-way and starting it again fetches only the missing cards (stub call log asserted); a card cached under 30 days old is not fetched again; one over 30 days old is.
- [ ] A download failure shows the plain message with Retry and keeps the cards already saved.
- [ ] Opening a set that is not downloaded, offline, shows "Not available offline" and Retry.
- [ ] The first-run notice shows once, stays dismissed after "Got it", and has the spec's wording.
- [ ] Unit tests (stub API, in-memory store): full download; resume after an interruption at card N; never more than four requests at once during a download; the 30-day card expiry; a failed card does not lose earlier ones.

**Blocked by:** 3

---

## 5. Show a set's cards and log them with a tap

**Description**
The first useful screen (docs/spec.md "Experience: Set page: Grid", "Decisions: Completion", stories 1, 4, 5). The set page header shows the set name, the completion bar and count ("128 / 165"). Below it, the grid: three cards per row, each with its low-resolution image and number, missing cards dimmed, a count badge for copies above one. Tap a card adds one copy of its main variant (the first that exists of normal, holo, reverse, first edition), with a short vibration where `navigator.vibrate` exists and a count tick animation (none under reduced motion). Add the collection model in `src/core/collection.ts` and its IndexedDB storage: counts per card and variant, never below 0. Completion here is for the official set only (cards numbered 1 to the official count; letter-prefixed and above-count cards do not count); the Official / Master switch comes in task 6. A card with several variants still counts once in the official set. The Sets tab rows and header ("cards owned, sets started") now update from the collection. Everything works with no network. Area: `src/core/collection.ts`, `src/storage/`, `src/ui/`.

**Acceptance criteria**
- [ ] The set page shows a three-per-row grid at 375 px, number on each card, missing dimmed, badge from 2 copies up, and the header bar and count update on each tap.
- [ ] Tapping a card owned once makes it 2 (a badge appears); a tap never produces a negative count; the collection survives a reload and works in airplane mode.
- [ ] The main variant of a card with only a holo variant is the holo variant.
- [ ] The Sets tab shows owned count and started sets, and each My sets row shows the new "n / total" and percentage.
- [ ] Unit tests (fixture set, in-memory store): official completion with a secret rare above the official count (not counted), a letter-prefixed card (not counted), a card owned in two variants (counted once), a card with only a holo variant; main-variant choice; add never below zero; collection save and load.
- [ ] Images are lazy-loaded and every card image has alt text with name and number.

**Blocked by:** 4

---

## 6. Add the card sheet with variants and the Master set mode

**Description**
Long-press a card to see and edit it (docs/spec.md "Experience: Card sheet", "Decisions: Completion", stories 3, 5, 21). The card sheet is a bottom sheet opened by long-press (and by a "Details" button for people who cannot long-press): the high-resolution image, name, number "136/189", rarity, illustrator, and one row per variant that exists for the card with minus, count and plus buttons. It carries the line "Unofficial; data from TCGdex". The set page header gets the Official / Master switch, remembered per set. In Master mode each existing variant of each card is its own slot, secret rares and above-number cards included, and the grid shows a slot per variant (variants after their base card); the header count and bar follow the mode. Extend `core/collection.ts` with master completion. Prices come in task 7. Area: `src/core/collection.ts`, `src/ui/` (sheet, set header), `src/storage/` (per-set mode).

**Acceptance criteria**
- [ ] Long-press and the Details button open the sheet; it shows one row per existing variant, minus and plus change the count (not below 0), and the grid and header update behind it. The sheet closes by swipe down, a close button or Escape, and returns focus to the card.
- [ ] The switch changes the header total (for example 165 to 207 in the fixture) and the grid slots; the choice is remembered per set after a reload.
- [ ] A set's tap in Master mode adds the variant of the slot tapped.
- [ ] Unit tests (fixture set): master completion counts every existing variant once, including a secret rare and a holo-only card; official and master totals differ as expected; owning one variant of a three-variant card gives 1 of 3 slots in master and 1 of 1 in official; variant order after the base card; mode saved and loaded per set.
- [ ] The sheet fits 375 px with safe-area padding and 44 px buttons; image has alt text.

**Blocked by:** 5

---

## 7. Show prices, values and cost to complete

**Description**
Money on screen (docs/spec.md "Decisions: Prices, DKK", "Experience: Sets, Set page, Card sheet, More", stories 7, 9, 17, 20). Add `core/prices.ts`: the price of a card variant is the Cardmarket trend in EUR; the reverse variant uses the trend-holo price when present, else the base price; null or zero is "no price". Collection value is the sum of count times price over all owned copies; a set's value is the same over that set, whatever the mode. Cost to complete is the sum of the missing slots' prices in the chosen mode (the main variant's price for an official slot). Totals report how many cards they left out ("excluding 4 cards with no price"). Show them on the Sets header, each My sets row, the set page header and each variant row in the sheet; a card with no price shows "no price". More gets its first settings, stored in localStorage via `storage/settings.ts`: Currency (EUR, or DKK at a fixed 7.46 shown with "≈") and a Hide prices switch that replaces every value with "Prices hidden" (and hides cost to complete). Values and the counter animate between numbers, not jump (instant under reduced motion). Area: `src/core/prices.ts`, `src/core/money.ts`, `src/storage/settings.ts`, `src/ui/`.

**Acceptance criteria**
- [ ] Prices appear on the Sets header and rows, the set header (value and cost to complete), and the sheet's variant rows; "no price" instead of 0; totals show the exclusion note.
- [ ] Switching currency to DKK reprices every number with "≈"; Hide prices hides every price and value everywhere, including the sheet; both settings survive a reload.
- [ ] Unit tests (fixtures with prices): trend selected; reverse variant uses trend-holo, falls back to trend when it is missing; null and zero are "no price" and left out of totals; collection and set value; cost to complete in official and master mode; the exclusion count; EUR to DKK at 7.46 with rounding in cents; formatting for both currencies; the animation helper's interpolation steps (pure) end exactly on the target.
- [ ] No price is formatted with floating-point drift (a test sums 0.10 + 0.20 and expects 30 cents).

**Blocked by:** 6

---

## 8. Search cards by name or printed number

**Description**
Find the card in your hand (docs/spec.md "Experience: Search", "Decisions: Number search", story 6, offline part of 14 and 19). The Search tab has one field. Add `core/search.ts`: "N/M" (such as "136/189") matches cards numbered N in sets whose official count is M; a letter-prefixed number such as "TG05" or "SV12" matches by printed number across sets; anything else matches names, case-insensitive, accent-insensitive, any word order. Search runs over downloaded sets only; the screen says so ("Searching sets saved on this phone") and shows a hint to add a set when none are downloaded. Results list the image, name, number and set; tapping opens the card sheet from task 6, where the user can add copies. Results are capped at 50 with a "Narrow your search" note; typing is debounced. Area: `src/core/search.ts`, `src/ui/`.

**Acceptance criteria**
- [ ] Typing "charizard" lists matching cards from all downloaded sets; "136/189" finds that card in the set with official count 189 only; "TG05" finds the trainer-gallery card; no match shows "No cards found".
- [ ] Works offline for downloaded sets; with no sets downloaded the empty state points to Sets.
- [ ] Results open the card sheet and a count change there is saved.
- [ ] Unit tests (fixtures): "N/M" matches by number and official count and not a card with the same number in another-size set; "TG05" and a promo-style number; name match is case-insensitive, accent-insensitive and word-order-free; empty and whitespace queries return nothing; the cap at 50 with the "more" flag; no match.

**Blocked by:** 7

---

## 9. Add the wishlist, the set filters and the Trade tab

**Description**
Wishlist and duplicates (docs/spec.md "Experience: Set page toolbar, Card sheet, Trade", stories 10, 11 (the list; sharing is task 10), 4). Add a wishlist star in the card sheet and a small star on wishlisted cards in the grid. The set page gets a filter toolbar: All, Missing, Owned, Duplicates, Wishlist (Duplicates and Owned follow the Official / Master mode). Add `core/trade.ts`: a duplicate is a variant owned more than once; the spare copies are count minus one. The Trade tab lists duplicates grouped by set with copy counts and value (honouring currency and Hide prices), and below it the wishlist with its total cost (excluding cards with no price, with the exclusion note). Empty states say how to fill each list. Wishlist is stored in IndexedDB beside the collection. Area: `src/core/trade.ts`, `src/storage/`, `src/ui/` (toolbar, sheet, Trade tab).

**Acceptance criteria**
- [ ] Starring in the sheet shows the star in the grid; the Wishlist filter shows only starred cards; Missing, Owned and Duplicates filters show the right cards and follow the mode.
- [ ] The Trade tab lists spares grouped by set with counts and value, and the wishlist with a total; prices hidden or in DKK follow the settings.
- [ ] Wishlist and duplicates survive a reload and work offline.
- [ ] Unit tests (fixtures): duplicates are variants with count above one, spare copies are count minus one; a card owned once is not a duplicate; grouping by set; wishlist total with a no-price card excluded and counted; each filter predicate in both modes.

**Blocked by:** 8

---

## 10. Share the trade list as a link and as text

**Description**
Let a friend see the list without installing anything (docs/spec.md "Decisions: Trade list link", "Experience: Trade", stories 11 and 12). On the Trade tab, "Share trade list" offers a link and a text version through `navigator.share`, falling back to copying to the clipboard with a confirmation. The link is `<app url>#/t/<payload>`: the list is encoded in the fragment (compact JSON, base64url), so it never reaches a server. It carries card ids and spare counts only, at most 300 entries; above that only the text version is offered and the screen says why. Opening such a link shows a read-only trade list page: no tabs, no edit controls, the cards grouped by set with name, number, image and count, plus a short line about the app and an "Open Pocket Binder" link. The page learns card names and images by fetching each distinct set once (one request per set, via the throttled client), not each card; prices are not shown on it. A malformed or tampered link shows a plain "This link does not work" page. Area: `src/core/trade-link.ts`, `src/api/tcgdex.ts` (`getSet` already exists), `src/ui/` (share button, shared-list page), `src/router.ts`.

**Acceptance criteria**
- [ ] "Share trade list" produces a link and a text version; with no share sheet it copies and confirms.
- [ ] Opening the link in a fresh browser profile shows the read-only list (stubbed API in tests, real app online) with no tabs and no way to change the sender's data; nothing about the sender but the list is in the link.
- [ ] Over 300 entries: no link is offered, the text version still is, with the reason shown.
- [ ] A broken or truncated link shows the plain error page, never a blank screen.
- [ ] Unit tests: encode then decode round trip for a normal list and an empty list; exactly 300 entries encode, 301 are refused; garbage, truncated and wrong-version payloads decode to an error; the set-id extraction from card ids with dots (`sv03.5-136`); the text version's format (grouped by set, counts).

**Blocked by:** 9

---

## 11. Add the binder view and the Set complete moment

**Description**
The two things that make the set page shareable (docs/spec.md "Experience: Binder view, Set page completion moment", "Launch and content", stories 13 and 1). Two parts, both on the set page, kept small. (a) Binder: the set page toolbar gets a Grid / Binder switch. The binder shows one 3 x 3 page at a time, swipe sideways (CSS scroll-snap) or use Previous and Next buttons, with "Page 4 of 19"; set order, variants after their base card in Master mode; owned pockets show the card, missing pockets show the number in an empty slot. Add `core/binder.ts` for pagination. (b) Completion: when the last missing slot is filled, a full-width "Set complete" moment shows the set name, the final count and the set value (hidden when Hide prices is on) in large type, a short animation (none under reduced motion), and a "Share" button that shares a plain, image-free text line through the share sheet, with the clipboard fallback. It shows once per completion, can be closed, and does not reappear on reload unless a slot is emptied and filled again. Add `core/completion-event.ts` to detect the transition. Area: `src/core/binder.ts`, `src/core/completion-event.ts`, `src/ui/`.

**Acceptance criteria**
- [ ] The binder shows 9 pockets per page, "Page n of N", owned pockets with the card image, missing pockets with the number; Previous and Next work and swiping snaps to a page; Master mode puts a card's variants right after it.
- [ ] Adding the last missing card shows the moment with set name, "165 / 165" (or the master total) and the value; the moment is readable at 375 px and respects safe areas and reduced motion; Close dismisses it; Share sends the text.
- [ ] The moment does not show on an incomplete set, on reload of a complete set, or on removing a card; it shows again after removing and re-adding the last card.
- [ ] Unit tests: pagination of 207 slots gives 23 pages of 9 with a short last page; official and master slot order (variants after the base card); an empty set gives one empty page; the transition detector fires only when the missing count goes from 1 to 0, not on load, not on decrements, not for a set that was already complete.

**Blocked by:** 10

---

## 12. Back up and restore the collection from More

**Description**
Never lose the collection (docs/spec.md "Decisions: Backup", "Experience: More", stories 15, 16 and the "Offline storage used" line). More gets a Backup section: Export downloads one JSON file (`pocket-binder-YYYY-MM-DD.json`) with a schema version, the collection, the wishlist, per-set modes, started sets and settings, but not the card cache (it is re-downloadable). Import reads a file, shows what it contains ("3 sets, 412 cards") and replaces the collection only after a confirm; the previous collection is kept until the next import, with one "Undo last import" button. A broken file, a file from a newer schema or a wrong file type is rejected with a plain message and changes nothing; an older schema version is migrated. "Last backup: 12 days ago" is shown, and when no backup was made for 30 days (or never, after the user has logged at least one card) a dismissible nudge appears on the Sets tab (story 16). More also shows the offline storage used (`navigator.storage.estimate`, hidden when unsupported). Sets whose card data is not on this phone after an import show as needing download, and open the normal download flow. Area: `src/core/backup.ts`, `src/storage/`, `src/ui/`.

**Acceptance criteria**
- [ ] Export produces a downloadable `.json` file; importing it on a cleared profile restores collection, wishlist, modes and settings; started sets without cards show "Download" and work after it.
- [ ] Import shows the contents and asks to confirm before replacing; Cancel changes nothing; Undo last import restores the previous collection once.
- [ ] A truncated, non-JSON, wrong-shaped or newer-version file is rejected with a message and leaves the data intact.
- [ ] "Last backup" shows the right age; the nudge shows after 30 days or when there was never a backup and cards exist, and its dismissal lasts until the next day.
- [ ] Unit tests: export then import round trip equals the original; an older schema fixture migrates; broken JSON, wrong shape and a newer schema version are rejected with the expected error; the undo slot holds the previous collection and is replaced on the next import; the backup-age and nudge logic with an injected clock (never, 29 days, 30 days, dismissed today).
- [ ] After merge, the manual pass from docs/spec.md "Proof" (install on an iPhone and an Android phone, download a set, airplane mode, log cards, completion moment) is listed in the PR as the release gate's check.

**Blocked by:** 11
