# PlantSip

Remember to water your houseplants. No account, no subscription, no server.

PlantSip is a small web app that runs in the browser. You add your plants with how often they need water, and it shows what is due today. Your plants are stored in the browser (localStorage). Reminders come from a calendar file you add to your own calendar.

It is built by Optio's engineering loop as a live demo: every change is a task in Optio, planned, built and reviewed by agents, and landed after a person says yes.

## Stack

- Vite + TypeScript, no UI framework
- Vitest for unit tests
- GitHub Pages for hosting (`.github/workflows/deploy.yml`)

## Commands

```bash
npm ci
npm test
npm run build
```

## Rules for changes

- Every feature comes with unit tests for its logic.
- Logic lives in plain TypeScript modules under `src/`, separate from the DOM code, so it can be tested.
- Works on a phone first: one column, touch targets at least 44 px.
- No new runtime dependencies without a reason in the pull request.
- `optio.toml` and `.github/workflows/` are the trust root: agents never change them.
