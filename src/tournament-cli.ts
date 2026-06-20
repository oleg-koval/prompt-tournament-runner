#!/usr/bin/env node
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { startTournamentServer } from "./tournament-server.js";

function parsePort(value: string | undefined, fallback: number): number {
  if (value === undefined) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    throw new Error(`Invalid port: ${value}`);
  }

  return parsed;
}

export function parseTournamentCliArgs(argv: string[]): {
  host: string;
  port: number;
  root: string;
} {
  const args = [...argv];
  let host = "0.0.0.0";
  let port = 8790;
  let root = process.cwd();

  for (let index = 0; index < args.length; index += 1) {
    const token = args[index];
    if (token === undefined) {
      continue;
    }

    switch (token) {
      case "--host":
        host = args[index + 1] ?? host;
        index += 1;
        break;
      case "--port":
        port = parsePort(args[index + 1], port);
        index += 1;
        break;
      case "--root":
        root = resolve(args[index + 1] ?? root);
        index += 1;
        break;
      default:
        break;
    }
  }

  return { host, port, root };
}

async function main(): Promise<void> {
  const args = parseTournamentCliArgs(process.argv.slice(2));
  const server = await startTournamentServer({
    host: args.host,
    port: args.port,
    workspaceRoot: args.root,
  });

  console.log(
    `Prompt Tournament Runner listening on http://${args.host}:${String(server.port)}`,
  );
  console.log(
    "Bind to 0.0.0.0 and open the page in a browser or through Tailscale.",
  );
}

const entryPoint =
  process.argv[1] === undefined ? undefined : resolve(process.argv[1]);
if (entryPoint !== undefined && fileURLToPath(import.meta.url) === entryPoint) {
  void main();
}
