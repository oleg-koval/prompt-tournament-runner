import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { startTournamentServer } from "../src/index.js";

let cleanup: Array<() => Promise<void>> = [];

afterEach(async () => {
  for (const dispose of cleanup.reverse()) {
    await dispose();
  }
  cleanup = [];
});

describe("prompt tournament server", () => {
  it("serves the ui and saves runs over http", async () => {
    const root = await mkdtemp(join(tmpdir(), "prompt-tournament-server-"));
    cleanup.push(async () => {
      await rm(root, { recursive: true, force: true });
    });

    const server = await startTournamentServer({
      host: "127.0.0.1",
      port: 0,
      workspaceRoot: root,
    });
    cleanup.push(async () => {
      await server.stop();
    });

    const baseUrl = `http://127.0.0.1:${String(server.port)}`;

    const health = await fetch(`${baseUrl}/health`);
    expect(health.status).toBe(200);
    expect(await health.text()).toBe("ok");

    const home = await fetch(`${baseUrl}/`);
    expect(home.status).toBe(200);
    expect(await home.text()).toContain("Prompt Tournament Runner");

    const saveResponse = await fetch(`${baseUrl}/api/runs`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        task: "Pick a winner",
        context: "Short copy test",
        winnerVariantId: "variant-b",
        variants: [
          {
            id: "variant-a",
            name: "A",
            prompt: "Prompt A",
            output: "Output A",
            score: 2,
            notes: "",
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
            score: 3,
            notes: "",
          },
        ],
      }),
    });

    expect(saveResponse.status).toBe(200);
    const saved = (await saveResponse.json()) as {
      task: string;
      winnerVariantId: string;
    };
    expect(saved.task).toBe("Pick a winner");
    expect(saved.winnerVariantId).toBe("variant-b");

    const runsResponse = await fetch(`${baseUrl}/api/runs`);
    const runs = (await runsResponse.json()) as {
      runs: Array<{ task: string }>;
    };
    expect(runs.runs).toHaveLength(1);
    expect(runs.runs[0]?.task).toBe("Pick a winner");
  });
});
