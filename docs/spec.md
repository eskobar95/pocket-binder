# Pocket Binder MVP

- Status: draft
- Product: Pocket Binder, a demo product built, marketed and kept by Optio's teams in a demo workspace
- Goal: show Optio's Product, Engineering and Content teams shipping and launching a real consumer app end to end
- Date: 2026-11-19
- Milestone: none yet
- Tasks: none yet

## Recommendation

Build a small, fast, offline checklist app whose one strong moment is **"this set is complete"**, with the value and cost-to-complete numbers around it. That moment and the running value counter are what collectors film and share, and they are cheap to build on TCGdex's keyless API. Keep everything on the device: no accounts, no backend, so the app costs nothing to run and the demo has no data to protect.

What we give up: camera scanning (the feature the big apps lead with), graded and sealed products, and sync between devices. Pocket Binder will not beat Collectr or Dex on breadth; it wins on being quick, free, offline and pleasant to film. The risk is IP: card images belong to The Pokémon Company and friends. Fan tools with a clear disclaimer are common and tolerated; we follow that norm, never use official logos, and earn no money from the app.

## Problem

A collector who watches pack openings and binder tours on TikTok, YouTube Shorts and Reels comes home with a few packs. Today they keep their collection in their head, a spreadsheet, or a big app that wants an account, pushes a subscription and leads with a camera scanner that is slow in bad light. Three questions stay hard to answer on the spot:

- **Do I already have this card?** In the shop, at a trade night, or mid-opening, they cannot check a 200-card set quickly, and they buy or trade for doubles.
- **How close am I to finishing the set, and what will the rest cost?** "Master set" collectors (every reverse holo and variant too) face 250+ slots and have no idea whether finishing costs 40 EUR or 400.
- **What is my binder worth, and what can I trade?** Values live on Cardmarket one card at a time; duplicates sit in a shoebox because listing them is tedious.

Who: collectors aged roughly 14 to 35 in Europe (Cardmarket is the price they know), collecting the current Scarlet & Violet and Mega Evolution era sets, opening packs weekly or monthly, often with a 9-pocket binder per set. Many are casual (a few sets), some are master-set chasers. They are on their phone, often in a shop with poor signal.

## Solution

Pocket Binder is a free app on the phone's home screen. You pick a set, it downloads once and works offline. You tap cards to mark them owned (tap again for a second copy, long-press for variants), and the set's completion bar, its value and its cost to complete update as you go. Finishing a set gets a proper moment. Your duplicates become a trade list you can share as a link, and the binder planner shows which card goes in which pocket of a 9-pocket page. Everything stays on your phone; a backup file moves it to a new one.

## User stories

1. As a collector, I want to add a card in two taps right after opening a pack, so that logging keeps up with opening.
2. As a collector, I want to browse a list of all English sets, newest first, with logo-free names, release date and card count, so that I find my set fast.
3. As a collector, I want to choose per set whether I track the **official set** (the numbered cards, e.g. 165) or the **master set** (every variant, e.g. 207 plus reverse holos), so that completion means what I mean by it.
4. As a collector, I want each card's slot to show owned, missing or duplicate at a glance, with the number and name, so that I can check a card in a second.
5. As a collector, I want to record how many copies of each variant I own (normal, reverse holo, holo, first edition), so that my count and trade list are right.
6. As a collector, I want to search by name ("Charizard") or by the number printed on the card ("136/189", "TG05"), so that I find the card in my hand without knowing its set name.
7. As a collector, I want to see my collection's total value and each set's value in EUR, or in DKK if I choose, so that I know what my binder is worth.
8. As a collector, I want to see when the prices were last updated, so that I do not trust an old number.
9. As a master-set chaser, I want the cost to complete a set (sum of the missing cards' prices), so that I can decide whether to buy singles or packs.
10. As a collector, I want to star cards I want, and see my wishlist with its total cost, so that I know what to look for at a trade night.
11. As a collector, I want my duplicates collected into a trade list I can share as a link or as text, so that a friend sees what I can trade without installing anything.
12. As a friend who gets a trade list link, I want to open it in the browser and see the cards, so that I can answer in my own chat.
13. As a collector, I want a binder planner that shows each 9-pocket page of a set, with owned cards filled in and missing ones as empty pockets, so that I know where to slide in a new card and how many pages I need.
14. As a collector, I want the app to work in a shop with no signal, for every set I have downloaded, so that I can check before buying.
15. As a collector, I want to export my collection to a file and import it on a new phone, so that I never lose it.
16. As a collector, I want to be warned if I have not backed up for 30 days, so that clearing my browser does not erase my collection.
17. As a collector filming my collection, I want to hide all prices with one switch, so that I can show my binder without showing its value.
18. As a first-time user, I want an empty state that tells me to pick my first set, so that I know where to start.
19. As a user offline who opens a set not yet downloaded, I want a plain message and a retry, so that I know why nothing loads.
20. As a user whose card has no Cardmarket price, I want to see "no price" rather than 0 EUR, so that totals are not misleading.
21. As anyone, I want to see clearly that this is an unofficial fan app and where the data comes from, so that I am not misled about who made it.

## Experience

No mocks in this version of the spec: the screens are element lists, at 375 px, one column, 44 px touch targets, iPhone safe areas respected, light and dark following the system. A bottom bar with four tabs: **Sets**, **Search**, **Trade**, **More**.

**Sets (home)**
- Header: collection value (or "Prices hidden"), cards owned, sets started.
- My sets: one row per set started: name, completion bar with "128 / 165" and %, set value, a small "Master" label when tracking master set.
- "Add a set" button, opening the set picker.
- Empty state: one line and the "Add a set" button.

**Set picker**
- All English sets, newest first, grouped by series; name, release year, official card count.
- Filter field. A downloaded mark on sets already saved offline.
- Choosing a set downloads it with a progress bar ("Downloading 84 of 207"), then opens it.

**Set page**
- Header: set name, completion bar and count, Official / Master switch, set value, cost to complete.
- Toolbar: filter (All, Missing, Owned, Duplicates, Wishlist), view (Grid, Binder).
- Grid: three cards per row, card image with number; missing cards dimmed; a count badge for copies above one; a small star for wishlist.
- Tap a card: +1 of its main variant (with a short haptic and a count tick). Long-press: the card sheet.
- Completion moment: when the last missing card is added, a full-width "Set complete" moment with the set name, final count and value, a short animation (none when the system asks for reduced motion), and a "Share" button with a plain image-free text.

**Card sheet** (bottom sheet)
- Large image, name, number "136/189", rarity, illustrator.
- One row per variant that exists for the card: name, minus / count / plus, price for that variant.
- Wishlist star. Price updated date. "Unofficial; data from TCGdex" line.

**Binder view** (in the set page)
- One 9-pocket page at a time (3 × 3), swipe for the next; "Page 4 of 19"; set order, variants after the base card in master mode.
- Owned pockets show the card, missing pockets show the number in an empty slot.

**Search**
- One field. A number like "136/189" or "TG05" matches by printed number (and the set's official count); anything else matches names.
- Results list: image, name, number, set; tap opens the card sheet. Offline: searches downloaded sets only, and says so.

**Trade**
- Duplicates grouped by set, with copy count and value; wishlist below with its total.
- "Share trade list": a link and a text version through the phone's share sheet.
- A shared link opens a read-only trade list page; no data from the sender's phone beyond the list.

**More**
- Currency: EUR or DKK. Hide prices switch. Offline storage used.
- Backup: Export, Import, "Last backup: 12 days ago".
- About: the disclaimer, TCGdex credit, the app's version.

## Decisions

- **Data source.** TCGdex v2, English only, called from the browser through one API module. The set endpoint gives the checklist (numbers, names, images) in one request; variants, rarity and prices come per card.
- **Downloading a set.** Adding a set fetches its card details once, at most four requests at a time with a small pause between batches, resumable if interrupted. Card details are cached on the device for 30 days; the set list for 7 days. Images use TCGdex's low-resolution asset in grids and the high one in the card sheet, cached by the service worker with a size cap (oldest dropped first).
- **Rate courtesy.** No background polling. Prices refresh only for downloaded sets, when the app is opened online and the cached price is older than 24 hours (TCGdex updates daily), using the same throttle. A request carries no identifying data.
- **Storage.** The collection, wishlist and card cache in IndexedDB; settings in local storage. The app asks the browser for persistent storage. Nothing leaves the phone except API requests and a trade list the user chooses to share.
- **Offline.** The app shell is precached and opens offline. Downloaded sets, their cached images and last-known prices work fully offline. A set not downloaded shows "Not available offline" with retry. Editing the collection never needs the network.
- **Prices.** Cardmarket **trend** price in EUR from TCGdex, reverse-holo variants use the "-holo" price when it is there, else the base price; a null or zero price counts as "no price" and is left out of totals (which then say "excluding 4 cards with no price"). Every price shows its update date; older than 7 days is shown greyed as "old price". Prices are labelled indicative. TCGplayer USD prices are not shown.
- **DKK.** A fixed rate of 7.46 DKK per EUR, shown as "≈". The krone is pegged to the euro (ERM II, central rate 7.46038), so a fixed rate is accurate within a fraction of a percent and needs no FX source.
- **Completion.** Official set: each numbered card counts once whatever its variant. Master set: each existing variant of each card counts once, secret rares and above-number cards included. Cost to complete is the sum of the missing slots' prices in the chosen mode.
- **Number search.** "N/M" matches cards numbered N in sets whose official count is M; letter-prefixed numbers (TG, GG, SV, promo) match by printed number.
- **Trade list link.** The list is encoded in the link's fragment (the part after #), so it is never sent to any server; links carry card ids and counts only, at most 300 entries, and fall back to text above that.
- **Backup.** Export is one JSON file with a schema version. Import shows what it contains (sets, cards) and replaces the collection after a confirm; the previous collection is kept until the next import so one undo is possible.
- **IP and disclaimer.** An unofficial fan app. The About screen and the first-run screen say: Pokémon names and images are trademarks and copyright of Nintendo, Creatures, GAME FREAK and The Pokémon Company; Pocket Binder is not affiliated with or endorsed by them; data and prices from TCGdex. Our own name, icon and colours; no Pokémon logo, Poké Ball or official type symbols as branding. No ads, no payments.

## Proof

Vitest tests through the logic modules, with the API module stubbed (the README's rule):

- Completion and counts for official and master mode, from a fixture set (including secret rares and a card with only a holo variant).
- Value and cost to complete: trend selection, reverse-holo fallback, null and zero as "no price", EUR and DKK, totals that report excluded cards.
- Price staleness: fresh, refresh due (over 24 h), old (over 7 days).
- Number and name search: "136/189", "TG05", "charizard", no match.
- Binder pagination: pages of 9 in set order, variants placed after their card in master mode.
- Trade link: encode and decode round trip, the 300-entry limit.
- Backup: export and import round trip, an older schema version, a broken file rejected with a message.
- The API module's throttle and resume: never more than four requests at once; an interrupted download continues where it stopped.

Before release, on a real iPhone and an Android phone against the Pages build: install to the home screen, download a set, switch to airplane mode, reopen and log cards, and hit the completion moment.

**Success after release** (no analytics, by design): the app installs and works offline on both phones; a 165-card set downloads in under a minute on 4G; a filmed test logs a full pack in under 30 seconds; the Content team's first five videos are posted with the app on screen. Views, saves and comments on those videos are the Content team's measure, read on the platforms.

## Out of scope

- Camera scanning. A later version adds scanning by number with the camera (reading "136/189" from the card corner), not image recognition.
- Accounts, sync between devices, a backend, analytics, push notifications.
- Languages other than English, and Japanese sets.
- Card condition, grading, purchase price and profit, sealed products, price history charts, price alerts.
- TCGplayer USD prices, live FX rates, other currencies.
- Buying or selling: no Cardmarket links or affiliate deals.
- Free arrangement of the binder (drag to reorder), custom binders across sets, 4- and 12-pocket pages. A later version adds custom binders.
- Decks, the game's rules, Pokémon TCG Pocket (the mobile game).
- Posting to social accounts: Nicklas's decision.

## Launch and content

**Audience.** The same collectors as above: they watch pack openings, binder tours, "completed the set" and "how much is my collection worth" videos. They respond to card art, big hits, a number going up, and a finished binder.

**Angles** (screen recordings of the app, with real cards where we have them; no scripts yet):

1. **Pack to binder in 30 seconds**: open a pack, tap each card in, the set bar and value tick up.
2. **The last card**: 164 / 165, the final card added, the "Set complete" moment.
3. **What does the master set really cost?**: official vs master switch, the cost to complete jumps.
4. **How much is my binder worth?**: hide prices on, then off for the reveal.
5. **Planning the binder**: swiping through 9-pocket pages, empty pockets filling in.

**What the app must have on screen to film well**

- The completion moment, bold and full width, with the set name and count large enough to read on a phone in a feed.
- A value and completion counter that animates as it changes, not one that jumps.
- Large card art in the grid and the sheet, low-res images loaded fast enough not to pop in on camera.
- The hide-prices switch, and a clean screen: no debug text, no personal data, no browser chrome when installed.
- A 9:16-friendly layout that reads at small size: big type for the key numbers, safe areas so nothing hides under captions or the notch.

## Further notes

- Open for Nicklas: whether to buy real cards to film, and how far to go with card art in public videos (see the report).
- Risk: TCGdex is a free community API with no stated SLA. If it is down, downloaded sets keep working; a new set cannot be added until it is back.
- Risk: browsers may clear site data (Safari after weeks of no use for a non-installed site). The persistent-storage request, the home-screen install and the 30-day backup nudge are the mitigations.

## Reviews

- 2026-11-19: written from the coordinator's brief. The design steps (wireframes, design review, visual) are skipped for this demo spec at the brief's request: screens are element lists, no mocks. No technical read: the API's behaviour was checked directly (set endpoint, per-card pricing, CORS, no GraphQL pricing field).

## Questions and answers

None yet.

## Changes

None yet.
