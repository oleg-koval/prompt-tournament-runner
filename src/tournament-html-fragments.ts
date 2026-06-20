import type { PromptTournamentRun, PromptVariant } from "./tournament-types.js";

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function renderVariantFields(index: number): string {
  const slot = String(index);
  return `
    <section class="variant-card">
      <div class="variant-head">
        <h3>Variant ${slot}</h3>
        <span class="variant-hint">score 1-5</span>
      </div>
      <label for="variant-${slot}-name">Name</label>
      <input id="variant-${slot}-name" name="variant-${slot}-name" placeholder="Variant ${slot}" />
      <label for="variant-${slot}-prompt">Prompt</label>
      <textarea id="variant-${slot}-prompt" name="variant-${slot}-prompt" placeholder="Prompt template"></textarea>
      <label for="variant-${slot}-output">Output</label>
      <textarea id="variant-${slot}-output" name="variant-${slot}-output" placeholder="Paste output here"></textarea>
      <div class="variant-grid">
        <div>
          <label for="variant-${slot}-score">Score</label>
          <input id="variant-${slot}-score" name="variant-${slot}-score" type="number" min="1" max="5" step="1" value="3" />
        </div>
        <div>
          <label for="variant-${slot}-notes">Notes</label>
          <input id="variant-${slot}-notes" name="variant-${slot}-notes" placeholder="Why it won or lost" />
        </div>
      </div>
    </section>`;
}

export function renderRunSummary(run: PromptTournamentRun): string {
  const winner = run.variants.find(
    (variant) => variant.id === run.winnerVariantId,
  );
  const averageScore =
    run.variants.length === 0
      ? "n/a"
      : (
          run.variants.reduce((total, variant) => total + variant.score, 0) /
          run.variants.length
        ).toFixed(1);

  return `
    <details class="run-card">
      <summary>
        <strong>${escapeHtml(run.task)}</strong>
        <span>${winner === undefined ? "Winner not picked" : `Winner: ${escapeHtml(winner.name)}`}</span>
        <span>Avg score ${escapeHtml(averageScore)}</span>
      </summary>
      <div class="run-body">
        <p><strong>Context:</strong> ${escapeHtml(run.context || "-")}</p>
        <p><strong>Created:</strong> ${escapeHtml(new Date(run.createdAt).toISOString())}</p>
        <div class="run-variants">
          ${run.variants
            .map(
              (variant: PromptVariant) => `
                <article class="run-variant">
                  <div><strong>${escapeHtml(variant.name)}</strong> <span class="muted">score ${String(variant.score)}</span></div>
                  <p class="muted">${escapeHtml(variant.prompt || "No prompt")}</p>
                  <pre>${escapeHtml(variant.output || "No output")}</pre>
                  <p class="muted">${escapeHtml(variant.notes || "No notes")}</p>
                </article>`,
            )
            .join("")}
        </div>
      </div>
    </details>`;
}
