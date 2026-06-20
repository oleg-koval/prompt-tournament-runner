import { mkdtemp, readFile, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { initPlaybook } from "../src/index.js";

let cleanup: Array<() => Promise<void>> = [];

afterEach(async () => {
  for (const dispose of cleanup.reverse()) {
    await dispose();
  }
  cleanup = [];
});

describe("initPlaybook", () => {
  it("creates a starter playbook at the default path", async () => {
    const root = await mkdtemp(join(tmpdir(), "playbook-init-"));
    cleanup.push(async () => {
      await rm(root, { recursive: true, force: true });
    });

    const result = await initPlaybook({ workspaceRoot: root });
    const created = await stat(result.path);
    const markdown = await readFile(result.path, "utf8");

    expect(result.path).toBe(join(root, "playbooks/refactor.md"));
    expect(created.isFile()).toBe(true);
    expect(markdown).toContain("# Refactor API client");
    expect(markdown).toContain("## Objective");
    expect(markdown).toContain("npm run typecheck");
  });
});
