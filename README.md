<p align="center">
  <img src="./logo.svg" width="110" height="110" alt="Prompt Tournament Runner logo">
</p>

<h1 align="center">Prompt Tournament Runner</h1>

<p align="center">
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT"></a>
  <a href="./tsconfig.json"><img src="https://img.shields.io/badge/TypeScript-strict-3178c6.svg" alt="TypeScript"></a>
  <a href="#privacy"><img src="https://img.shields.io/badge/local--first-no%20cloud-success.svg" alt="Local-first"></a>
</p>

---

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

TypeScript (strict), a dependency-light Node HTTP server, and Vitest. 10 tests, typechecked, single-binary build via tsup.

## License

MIT © [Oleg Koval](https://github.com/oleg-koval)
