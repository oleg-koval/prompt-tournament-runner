import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import type { ModelConfig, ModelProvider } from "./tournament-types.js";

const CONFIG_FILENAME = ".prompt-tournament-config.json";
const PROVIDERS: ModelProvider[] = ["claude", "codex", "ollama"];
const DEFAULT_CONFIG: ModelConfig = {
  provider: "claude",
  model: "claude-sonnet-4-6",
};

export function getConfigPath(workspaceRoot: string): string {
  return resolve(workspaceRoot, CONFIG_FILENAME);
}

export function normalizeModelConfig(value: unknown): ModelConfig {
  const entry = (value ?? {}) as Record<string, unknown>;
  const provider = PROVIDERS.includes(entry.provider as ModelProvider)
    ? (entry.provider as ModelProvider)
    : DEFAULT_CONFIG.provider;
  const model =
    typeof entry.model === "string" && entry.model.trim().length > 0
      ? entry.model.trim()
      : DEFAULT_CONFIG.model;
  return { provider, model };
}

export async function getModelConfig(
  workspaceRoot: string,
): Promise<ModelConfig> {
  try {
    const raw = await readFile(getConfigPath(workspaceRoot), "utf8");
    return normalizeModelConfig(JSON.parse(raw));
  } catch (error) {
    if (
      error instanceof Error &&
      (error as NodeJS.ErrnoException).code === "ENOENT"
    ) {
      return { ...DEFAULT_CONFIG };
    }
    throw error;
  }
}

export async function setModelConfig(
  workspaceRoot: string,
  value: unknown,
): Promise<ModelConfig> {
  const config = normalizeModelConfig(value);
  const path = getConfigPath(workspaceRoot);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(config, null, 2)}\n`, "utf8");
  return config;
}
