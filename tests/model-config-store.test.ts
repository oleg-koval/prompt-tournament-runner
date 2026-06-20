import { afterEach, describe, expect, it } from "vitest";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  getModelConfig,
  setModelConfig,
  normalizeModelConfig,
} from "../src/index.js";

const dirs: string[] = [];

async function workspace(): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), "ptr-config-"));
  dirs.push(dir);
  return dir;
}

afterEach(async () => {
  await Promise.all(dirs.splice(0).map((dir) => rm(dir, { recursive: true })));
});

describe("model-config-store", () => {
  it("returns the claude default when no config file exists", async () => {
    const config = await getModelConfig(await workspace());
    expect(config).toEqual({ provider: "claude", model: "claude-sonnet-4-6" });
  });

  it("round-trips a saved config", async () => {
    const root = await workspace();
    const saved = await setModelConfig(root, {
      provider: "ollama",
      model: "llama3.1",
    });
    expect(saved).toEqual({ provider: "ollama", model: "llama3.1" });
    expect(await getModelConfig(root)).toEqual(saved);
  });

  it("rejects unknown providers and blank models", () => {
    expect(normalizeModelConfig({ provider: "evil", model: "" })).toEqual({
      provider: "claude",
      model: "claude-sonnet-4-6",
    });
    expect(
      normalizeModelConfig({ provider: "codex", model: "  gpt  " }),
    ).toEqual({ provider: "codex", model: "gpt" });
  });
});
