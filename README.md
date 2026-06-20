# Prompt Tournament Runner

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6.svg)](./tsconfig.json)
[![Local-first](https://img.shields.io/badge/local--first-no%20cloud-success.svg)](#privacy)

Compare prompt variants head-to-head, score the outputs, and keep a record of which prompt actually won — all locally, no account, no API keys.

> You rewrote the prompt five times and _think_ the third one was best. Prove it. Run a tournament, score the outputs side by side, and save the result so you never re-litigate the same prompt again.

## Why

Prompt iteration is usually vibes: you tweak wording, eyeball the output, and forget what you tried. This is a tiny, local scoreboard for that loop — structured comparison instead of guesswork, with a saved history you can look back on.

No SaaS, no telemetry, no keys. It runs on your machine and stores runs in a plain JSON file you own.

## Quick start

```bash
npm ci
npm run serve        # builds, then serves the UI on http://localhost:8790
```

Open the printed URL. Flags:

```bash
npm run serve -- --port 8790 --host 0.0.0.0 --root .
```

`--host 0.0.0.0` makes it reachable over your LAN / Tailscale so you can score from your phone.

## The loop

1. Capture the **task** (and optional context) you're prompting for.
2. Enter **3–5 prompt variants**.
3. Run them in your model of choice, paste the outputs back in.
4. **Score** each 1–5 and pick a **winner**.
5. The run is **saved locally** for later review.

## Privacy

100% local. The app never calls an external API and has no analytics. Runs are written to `.prompt-tournament-runs.json` in your working directory — yours to keep, diff, or delete.

## Built with

TypeScript (strict), a dependency-light Node HTTP server, and Vitest. 21 tests, typechecked, single-binary build via tsup.

## License

MIT © [Oleg Koval](https://github.com/oleg-koval)
