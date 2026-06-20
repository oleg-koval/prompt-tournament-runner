import { tournamentDemos } from "./tournament-demo-data.js";

export function renderClientScript(): string {
  const demos = JSON.stringify(tournamentDemos).replaceAll("<", "\\u003c");
  return `
      const demos = ${demos};
      const statusNode = document.getElementById('status');
      const form = document.getElementById('tournament-form');
      const winnerSelect = document.getElementById('winnerVariantId');
      const resetButton = document.getElementById('reset-form');
      const variantIndexes = [1, 2, 3, 4, 5];

      function byId(id) { return document.getElementById(id); }

      function variantFields(index) {
        return {
          id: 'variant-' + String(index),
          name: byId('variant-' + String(index) + '-name'),
          prompt: byId('variant-' + String(index) + '-prompt'),
          output: byId('variant-' + String(index) + '-output'),
          score: byId('variant-' + String(index) + '-score'),
          notes: byId('variant-' + String(index) + '-notes'),
        };
      }

      function rebuildWinnerOptions() {
        const options = variantIndexes.map((index) => {
          const field = variantFields(index);
          const name = field.name.value.trim() || 'Variant ' + String(index);
          return '<option value="' + field.id + '">' + name + '</option>';
        });
        winnerSelect.innerHTML = options.join('');
      }

      function pickBestWinner() {
        let winner = null;
        for (const index of variantIndexes) {
          const field = variantFields(index);
          const name = field.name.value.trim();
          const score = Number(field.score.value || '0');
          if (name.length === 0) {
            continue;
          }
          if (winner === null || score > winner.score) {
            winner = { id: field.id, score };
          }
        }
        if (winner !== null) {
          winnerSelect.value = winner.id;
        }
      }

      function fillDemo(demoId) {
        const demo = demos.find((item) => item.id === demoId);
        if (demo === undefined) {
          return;
        }

        byId('task').value = demo.task;
        byId('context').value = demo.context;
        variantIndexes.forEach((index) => {
          const source = demo.variants[index - 1];
          const field = variantFields(index);
          if (source === undefined) {
            field.name.value = '';
            field.prompt.value = '';
            field.output.value = '';
            field.score.value = '3';
            field.notes.value = '';
            return;
          }
          field.name.value = source.name;
          field.prompt.value = source.prompt;
          field.output.value = source.output;
          field.score.value = String(source.score);
          field.notes.value = source.notes;
        });
        rebuildWinnerOptions();
        pickBestWinner();
        statusNode.textContent = 'Loaded demo: ' + demo.label + '.';
      }

      document.querySelectorAll('[data-demo-id]').forEach((button) => {
        button.addEventListener('click', () => {
          fillDemo(button.getAttribute('data-demo-id'));
        });
      });

      variantIndexes.forEach((index) => {
        const field = variantFields(index);
        ['input', 'change'].forEach((eventName) => {
          field.name.addEventListener(eventName, () => {
            rebuildWinnerOptions();
            pickBestWinner();
          });
          field.score.addEventListener(eventName, pickBestWinner);
        });
      });

      winnerSelect.addEventListener('change', () => {
        statusNode.textContent = 'Winner set to ' + winnerSelect.value + '.';
      });

      resetButton.addEventListener('click', () => {
        form.reset();
        rebuildWinnerOptions();
        pickBestWinner();
        statusNode.textContent = 'Form cleared.';
      });

      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const payload = {
          task: byId('task').value,
          context: byId('context').value,
          winnerVariantId: winnerSelect.value,
          variants: variantIndexes.map((index) => {
            const field = variantFields(index);
            return {
              id: field.id,
              name: field.name.value,
              prompt: field.prompt.value,
              output: field.output.value,
              score: Number(field.score.value || '0'),
              notes: field.notes.value,
            };
          }),
        };

        statusNode.textContent = 'Saving...';
        const response = await fetch('/api/runs', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const body = await response.text();
          statusNode.textContent = 'Save failed: ' + body;
          return;
        }

        statusNode.textContent = 'Saved. Reloading...';
        window.location.reload();
      });

      rebuildWinnerOptions();
      pickBestWinner();

      const providerSelect = byId('provider');
      const modelInput = byId('model');
      const saveConfigButton = byId('save-config');
      const configStatus = byId('config-status');
      const providerDefaults = { claude: 'claude-sonnet-4-6', codex: '', ollama: '' };

      async function loadConfig() {
        try {
          const res = await fetch('/api/config');
          if (!res.ok) { return; }
          const cfg = await res.json();
          providerSelect.value = cfg.provider || 'claude';
          modelInput.value = cfg.model || '';
        } catch (error) { /* manual paste still works */ }
      }

      providerSelect.addEventListener('change', () => {
        if (modelInput.value.trim() === '') {
          modelInput.value = providerDefaults[providerSelect.value] || '';
        }
      });

      saveConfigButton.addEventListener('click', async () => {
        configStatus.textContent = 'Saving...';
        try {
          const res = await fetch('/api/config', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ provider: providerSelect.value, model: modelInput.value }),
          });
          configStatus.textContent = res.ok ? 'Saved.' : 'Save failed.';
        } catch (error) {
          configStatus.textContent = 'Save failed.';
        }
      });

      loadConfig();
  `;
}
