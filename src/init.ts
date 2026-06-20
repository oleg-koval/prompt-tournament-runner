import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { starterPlaybookMarkdown } from "./starter.js";

export interface InitPlaybookOptions {
  workspaceRoot: string;
  initPath?: string;
}

export interface InitPlaybookResult {
  path: string;
}

export async function initPlaybook(
  options: InitPlaybookOptions,
): Promise<InitPlaybookResult> {
  const targetPath = resolve(
    options.workspaceRoot,
    options.initPath ?? "playbooks/refactor.md",
  );

  await mkdir(dirname(targetPath), { recursive: true });

  try {
    await writeFile(targetPath, starterPlaybookMarkdown, {
      encoding: "utf8",
      flag: "wx",
    });
  } catch (error: unknown) {
    const code =
      error instanceof Error ? (error as { code?: string }).code : undefined;
    if (code === "EEXIST") {
      throw new Error(`Playbook already exists: ${targetPath}`);
    }

    throw error;
  }

  return { path: targetPath };
}
