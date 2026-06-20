import type { PromptTournamentRun } from "./tournament-types.js";
import {
  renderRunSummary,
  renderVariantFields,
} from "./tournament-html-fragments.js";
import { summarizeRuns } from "./tournament-summary.js";
import { tournamentDemos } from "./tournament-demo-data.js";
import { renderClientScript } from "./tournament-client-script.js";

export function renderHtml(runs: PromptTournamentRun[]): string {
  const summary = summarizeRuns(runs);
  const demoButtons = tournamentDemos
    .map(
      (demo) => `
        <button type="button" class="demo-card" data-demo-id="${demo.id}">
          <strong>${demo.label}</strong>
          <span>${demo.description}</span>
        </button>`,
    )
    .join("");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Prompt Tournament Runner</title>
    <style>
      :root { color-scheme: dark; --bg: #0a1020; --panel: #10172a; --panel-2: #151f36; --line: #27324d; --text: #e8eefb; --muted: #9aa8c2; --accent: #7dd3fc; }
      * { box-sizing: border-box; }
      body { margin: 0; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif; background: radial-gradient(circle at top, rgba(125, 211, 252, 0.12), transparent 28%), linear-gradient(180deg, #050916 0%, var(--bg) 100%); color: var(--text); }
      main { max-width: 1240px; margin: 0 auto; padding: 24px 18px 56px; }
      header, section, details { border: 1px solid var(--line); border-radius: 22px; background: rgba(16, 23, 42, 0.92); box-shadow: 0 18px 50px rgba(0,0,0,0.22); }
      header { padding: 24px; }
      section { padding: 20px; margin-top: 16px; }
      h1, h2, h3, p { margin: 0; }
      h1 { font-size: clamp(2rem, 4vw, 3.4rem); }
      .lede { margin-top: 10px; max-width: 72ch; color: var(--muted); }
      .meta { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin-top: 18px; }
      .pill { border: 1px solid var(--line); border-radius: 16px; padding: 14px; background: rgba(21, 31, 54, 0.75); }
      .pill-label { color: var(--muted); font-size: 0.86rem; }
      .pill-value { margin-top: 4px; font-size: 1.05rem; font-weight: 700; }
      .demo-grid, .variant-grid, .run-variants { display: grid; gap: 12px; }
      .demo-grid { grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
      .demo-card { display: grid; gap: 6px; text-align: left; width: 100%; border: 1px solid var(--line); border-radius: 16px; padding: 14px; background: linear-gradient(135deg, rgba(125, 211, 252, 0.1), rgba(167, 139, 250, 0.08)); color: inherit; cursor: pointer; }
      .demo-card span, .muted, .variant-hint { color: var(--muted); }
      form { display: grid; gap: 16px; }
      label { display: block; margin: 0 0 8px; font-weight: 600; }
      input, textarea, select { width: 100%; border-radius: 14px; border: 1px solid var(--line); background: #0c1324; color: inherit; padding: 12px; font: inherit; }
      textarea { min-height: 92px; resize: vertical; }
      .task-grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: 12px; }
      .variant-card { border: 1px solid var(--line); border-radius: 18px; background: var(--panel-2); padding: 16px; display: grid; gap: 10px; }
      .variant-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
      .variant-grid { grid-template-columns: 1fr 1.2fr; }
      .actions { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
      button.primary { border: 0; border-radius: 999px; padding: 12px 16px; background: linear-gradient(135deg, #38bdf8, #8b5cf6); color: white; font-weight: 800; cursor: pointer; }
      .secondary { border: 1px solid var(--line); border-radius: 999px; padding: 12px 16px; background: transparent; color: inherit; cursor: pointer; }
      details.run-card { margin-top: 12px; overflow: clip; }
      details.run-card summary { cursor: pointer; list-style: none; display: flex; flex-wrap: wrap; gap: 10px; align-items: center; justify-content: space-between; padding: 16px 18px; }
      details.run-card summary::-webkit-details-marker { display: none; }
      .run-body { padding: 0 18px 18px; color: var(--text); }
      .run-variants { grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); margin-top: 12px; }
      .run-variant { border: 1px solid var(--line); border-radius: 16px; background: rgba(7, 12, 24, 0.8); padding: 14px; display: grid; gap: 10px; }
      pre { margin: 0; padding: 12px; overflow: auto; border-radius: 14px; border: 1px solid var(--line); background: #08101f; white-space: pre-wrap; word-break: break-word; }
      .status { margin-top: 12px; color: var(--muted); }
      details.settings { padding: 0; margin-top: 16px; }
      details.settings > summary { cursor: pointer; list-style: none; padding: 18px 20px; display: flex; flex-wrap: wrap; gap: 10px; align-items: baseline; }
      details.settings > summary::-webkit-details-marker { display: none; }
      .settings-body { padding: 0 20px 20px; display: grid; gap: 14px; }
      @media (max-width: 860px) { .meta, .task-grid, .variant-grid { grid-template-columns: 1fr; } }
    </style>
  </head>
  <body>
    <main>
      <header>
        <p class="muted">MVP scaffold</p>
        <h1>Prompt Tournament Runner</h1>
        <p class="lede">Compare 3 to 5 prompt variants on one task, score the outputs, and save the winner. This scaffold is local-first and keeps the workflow brutally simple.</p>
        <div class="meta">
          <div class="pill"><div class="pill-label">Saved runs</div><div class="pill-value">${String(summary.runCount)}</div></div>
          <div class="pill"><div class="pill-label">Average score</div><div class="pill-value">${summary.averageScore === null ? "n/a" : String(summary.averageScore)}</div></div>
          <div class="pill"><div class="pill-label">Latest update</div><div class="pill-value">${summary.latestUpdatedAt ?? "n/a"}</div></div>
        </div>
      </header>

      <details class="settings" id="model-settings">
        <summary><strong>Connect a model</strong> <span class="muted">optional &mdash; run variants with your Claude/Codex subscription or a local model</span></summary>
        <div class="settings-body">
          <div class="task-grid">
            <div>
              <label for="provider">Provider</label>
              <select id="provider" name="provider">
                <option value="claude">Claude (your subscription, via claude CLI)</option>
                <option value="codex">ChatGPT / Codex (your subscription, via codex CLI)</option>
                <option value="ollama">Local (Ollama, free)</option>
              </select>
            </div>
            <div>
              <label for="model">Model</label>
              <input id="model" name="model" placeholder="claude-sonnet-4-6" />
            </div>
          </div>
          <div class="actions">
            <button class="primary" type="button" id="save-config">Save model settings</button>
            <span class="muted" id="config-status"></span>
          </div>
          <p class="muted">No API keys are stored &mdash; auth lives in the CLIs you already sign into. Manual paste still works without any of this. (Running variants ships next.)</p>
        </div>
      </details>

      <section>
        <h2>Demo tournaments</h2>
        <p class="lede">One click fills the form with a realistic run so the UX is easy to dogfood.</p>
        <div class="demo-grid" id="demo-grid">${demoButtons}</div>
      </section>

      <section>
        <h2>Create tournament</h2>
        <form id="tournament-form">
          <div class="task-grid">
            <div>
              <label for="task">Task</label>
              <textarea id="task" name="task" placeholder="What are the prompts trying to solve?"></textarea>
            </div>
            <div>
              <label for="context">Context</label>
              <textarea id="context" name="context" placeholder="Tone, audience, constraints, or source material."></textarea>
              <label for="winnerVariantId">Winner</label>
              <select id="winnerVariantId" name="winnerVariantId"></select>
            </div>
          </div>

          ${[1, 2, 3, 4, 5].map((index) => renderVariantFields(index)).join("")}

          <div class="actions">
            <button class="primary" type="submit">Save tournament</button>
            <button class="secondary" type="button" id="reset-form">Reset</button>
          </div>
        </form>
        <p class="status" id="status">Ready.</p>
      </section>

      <section>
        <h2>Saved runs</h2>
        <p class="lede">A compact archive of the last runs so the winner is not lost in tab hell.</p>
        <div id="runs">${runs.map((run) => renderRunSummary(run)).join("") || '<p class="muted">No runs saved yet.</p>'}</div>
      </section>
    </main>

    <script>${renderClientScript()}</script>
  </body>
</html>`;
}
