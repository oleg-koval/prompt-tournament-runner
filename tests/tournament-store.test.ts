import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { listRuns, saveRun } from "../src/index.js";
import type { PromptTournamentRun } from "../src/tournament-types.js";

let cleanup: Array<() => Promise<void>> = [];

afterEach(async () => {
  for (const dispose of cleanup.reverse()) {
    await dispose();
  }
  cleanup = [];
});

describe("tournament store", () => {
  it("saves and reloads runs from the workspace store file", async () => {
    const root = await mkdtemp(join(tmpdir(), "prompt-tournament-runner-"));
    cleanup.push(async () => {
      await rm(root, { recursive: true, force: true });
    });

    const run: PromptTournamentRun = {
      id: "run-1",
      createdAt: "2026-06-14T08:00:00.000Z",
      updatedAt: "2026-06-14T08:10:00.000Z",
      task: "Compare three prompts",
      context: "Founder task",
      winnerVariantId: "variant-b",
      variants: [
        {
          id: "variant-a",
          name: "A",
          prompt: "Prompt A",
          output: "Output A",
          score: 3,
          notes: "ok",
        },
        {
          id: "variant-b",
          name: "B",
          prompt: "Prompt B",
          output: "Output B",
          score: 5,
          notes: "winner",
        },
        {
          id: "variant-c",
          name: "C",
          prompt: "Prompt C",
          output: "Output C",
          score: 2,
          notes: "weak",
        },
      ],
    };

    await saveRun(root, run);
    const runs = await listRuns(root);
    const storeFile = await readFile(
      join(root, ".prompt-tournament-runs.json"),
      "utf8",
    );

    expect(runs).toHaveLength(1);
    expect(runs[0]?.id).toBe("run-1");
    expect(storeFile).toContain("Compare three prompts");
    expect(storeFile).toContain("variant-b");
  });
});
