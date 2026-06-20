import { createServer } from "node:http";
import type { IncomingMessage } from "node:http";
import { createRunId, listRuns, saveRun } from "./tournament-store.js";
import { getModelConfig, setModelConfig } from "./model-config-store.js";
import { renderHtml } from "./tournament-html.js";
import type {
  PromptTournamentRun,
  PromptVariant,
  RunningServer,
  ServerOptions,
} from "./tournament-types.js";
import { pickWinnerVariant } from "./tournament-summary.js";

interface NormalizedTournamentInput {
  task: string;
  context: string;
  winnerVariantId: string;
  variants: PromptVariant[];
}

async function readJsonBody(
  request: IncomingMessage,
): Promise<Record<string, unknown>> {
  request.setEncoding("utf8");
  let raw = "";
  for await (const chunk of request as AsyncIterable<string>) {
    raw += chunk;
  }

  if (raw.trim().length === 0) {
    return {};
  }

  return JSON.parse(raw) as Record<string, unknown>;
}

function toStringValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function toNumberValue(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function normalizeVariant(value: unknown, index: number): PromptVariant | null {
  if (value === null || typeof value !== "object") {
    return null;
  }

  const entry = value as Record<string, unknown>;
  const name = toStringValue(entry.name);
  const prompt = toStringValue(entry.prompt);
  const output = toStringValue(entry.output);
  const notes = toStringValue(entry.notes);
  if (
    name.length === 0 &&
    prompt.length === 0 &&
    output.length === 0 &&
    notes.length === 0
  ) {
    return null;
  }

  return {
    id: toStringValue(entry.id) || `variant-${String(index + 1)}`,
    name: name || `Variant ${String(index + 1)}`,
    prompt,
    output,
    score: Math.max(
      1,
      Math.min(5, Math.round(toNumberValue(entry.score) || 3)),
    ),
    notes,
  };
}

function normalizeInput(
  body: Record<string, unknown>,
): NormalizedTournamentInput {
  const variants = Array.isArray(body.variants)
    ? body.variants
        .map((variant, index) => normalizeVariant(variant, index))
        .filter((variant): variant is PromptVariant => variant !== null)
    : [];

  return {
    task: toStringValue(body.task),
    context: toStringValue(body.context),
    winnerVariantId: toStringValue(body.winnerVariantId),
    variants,
  };
}

function makeRun(input: NormalizedTournamentInput): PromptTournamentRun {
  const now = new Date().toISOString();
  const winner = pickWinnerVariant(input.variants, input.winnerVariantId);
  const winnerVariantId = winner?.id ?? input.variants[0]?.id ?? "";

  return {
    id: createRunId(),
    createdAt: now,
    updatedAt: now,
    task: input.task,
    context: input.context,
    winnerVariantId,
    variants: input.variants,
  };
}

export async function startTournamentServer(
  options: ServerOptions,
): Promise<RunningServer> {
  const server = createServer(async (request, response) => {
    if (request.url === "/") {
      const runs = await listRuns(options.workspaceRoot);
      response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      response.end(renderHtml(runs));
      return;
    }

    if (request.url === "/health") {
      response.writeHead(200, { "content-type": "text/plain; charset=utf-8" });
      response.end("ok");
      return;
    }

    if (request.url === "/api/config" && request.method === "GET") {
      const config = await getModelConfig(options.workspaceRoot);
      response.writeHead(200, {
        "content-type": "application/json; charset=utf-8",
      });
      response.end(JSON.stringify(config, null, 2));
      return;
    }

    if (request.url === "/api/config" && request.method === "POST") {
      try {
        const body = await readJsonBody(request);
        const config = await setModelConfig(options.workspaceRoot, body);
        response.writeHead(200, {
          "content-type": "application/json; charset=utf-8",
        });
        response.end(JSON.stringify(config, null, 2));
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        response.writeHead(400, {
          "content-type": "text/plain; charset=utf-8",
        });
        response.end(message);
      }
      return;
    }

    if (request.url === "/api/runs" && request.method === "GET") {
      const runs = await listRuns(options.workspaceRoot);
      response.writeHead(200, {
        "content-type": "application/json; charset=utf-8",
      });
      response.end(JSON.stringify({ runs }, null, 2));
      return;
    }

    if (request.url === "/api/runs" && request.method === "POST") {
      try {
        const body = await readJsonBody(request);
        const input = normalizeInput(body);
        if (input.task.trim().length === 0) {
          throw new Error("Task is required");
        }
        if (input.variants.length < 3) {
          throw new Error("Add at least 3 prompt variants");
        }

        const saved = await saveRun(options.workspaceRoot, makeRun(input));
        response.writeHead(200, {
          "content-type": "application/json; charset=utf-8",
        });
        response.end(JSON.stringify(saved, null, 2));
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        response.writeHead(400, {
          "content-type": "text/plain; charset=utf-8",
        });
        response.end(message);
      }
      return;
    }

    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
  });

  await new Promise<void>((resolvePromise) => {
    server.listen(options.port, options.host, resolvePromise);
  });

  const address = server.address();
  const port =
    typeof address === "object" && address !== null
      ? address.port
      : options.port;

  return {
    port,
    stop: async () => {
      await new Promise<void>((resolvePromise, rejectPromise) => {
        server.close((error) => {
          if (error !== undefined) {
            rejectPromise(error);
            return;
          }
          resolvePromise();
        });
      });
    },
  };
}
