# Tiny Todo

A simple todo list for your phone. Install it to your home screen; it works offline. No account, no server.

Your todos are stored on your device (localStorage). It is built by Optio's engineering loop as a live demo: product writes the spec, engineering cuts it into tasks, and agents plan, build and review each one before a person says yes.

## Stack

- Vite + TypeScript, no UI framework
- Vitest for unit tests
- A web app manifest and a service worker, so it installs and works offline
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
- Phone first: one column, touch targets at least 44 px.
- No new runtime dependencies without a reason in the pull request.
- `optio.toml` and `.github/workflows/` are the trust root: agents never change them.
