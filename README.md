# Pocket Binder

Track your Pokémon card collection on your phone: set checklists, what your cards are worth on Cardmarket, what you are missing, and what you can trade. Works offline, no account, no server.

Pocket Binder is an unofficial fan app. Pokémon and Pokémon card names and images are trademarks and copyright of Nintendo, Creatures, GAME FREAK and The Pokémon Company. Card data and prices come from [TCGdex](https://tcgdex.dev).

It is built by Optio's teams as a live demo: product writes the spec, engineering's agents build each task through Optio's loop, and content makes the short videos.

## Stack

- Vite + TypeScript, no UI framework
- Vitest for unit tests
- A web app manifest and a service worker, so it installs and works offline
- Card data from the TCGdex API (`https://api.tcgdex.net/v2/`), called from the browser
- GitHub Pages for hosting (`.github/workflows/deploy.yml`)

## Commands

```bash
npm ci
npm test
npm run build
```

## Rules for changes

- Every feature comes with unit tests for its logic.
- Logic lives in plain TypeScript modules under `src/`, separate from the DOM code, so it can be tested. API calls go through one module so tests can stub them.
- Phone first: one column, touch targets at least 44 px.
- No new runtime dependencies without a reason in the pull request.
- `optio.toml` and `.github/workflows/` are the trust root: agents never change them.
