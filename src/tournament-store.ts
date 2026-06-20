import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { randomUUID } from "node:crypto";
import type {
  PromptTournamentRun,
  TournamentStoreData,
} from "./tournament-types.js";

const STORE_FILENAME = ".prompt-tournament-runs.json";

export function getStorePath(workspaceRoot: string): string {
  return resolve(workspaceRoot, STORE_FILENAME);
}

async function readStoreFile(path: string): Promise<TournamentStoreData> {
  try {
    const raw = await readFile(path, "utf8");
    const parsed = JSON.parse(raw) as Partial<TournamentStoreData>;
    return {
      runs: Array.isArray(parsed.runs) ? parsed.runs : [],
    };
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      (error as NodeJS.ErrnoException).code === "ENOENT"
    ) {
      return { runs: [] };
    }

    throw error;
  }
}

async function writeStoreFile(
  path: string,
  data: TournamentStoreData,
): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export async function listRuns(
  workspaceRoot: string,
): Promise<PromptTournamentRun[]> {
  const store = await readStoreFile(getStorePath(workspaceRoot));
  return [...store.runs].sort((left, right) =>
    right.updatedAt.localeCompare(left.updatedAt),
  );
}

export async function saveRun(
  workspaceRoot: string,
  run: PromptTournamentRun,
): Promise<PromptTournamentRun> {
  const storePath = getStorePath(workspaceRoot);
  const store = await readStoreFile(storePath);
  const nextRuns = [run, ...store.runs.filter((entry) => entry.id !== run.id)];
  await writeStoreFile(storePath, { runs: nextRuns });
  return run;
}

export function createRunId(): string {
  return randomUUID();
}
