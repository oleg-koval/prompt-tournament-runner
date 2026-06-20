import { describe, expect, it } from "vitest";
import { parseCliArgs } from "../src/index.js";

describe("parseCliArgs", () => {
  it("parses serve arguments", () => {
    expect(
      parseCliArgs(["serve", "--host", "0.0.0.0", "--port", "8787"]),
    ).toEqual({
      command: "serve",
      host: "0.0.0.0",
      port: 8787,
      dryRun: false,
      resume: false,
    });
  });

  it("defaults serve to the Tailscale-friendly bind", () => {
    expect(parseCliArgs(["serve"])).toEqual({
      command: "serve",
      host: "0.0.0.0",
      port: 8787,
      dryRun: false,
      resume: false,
    });
  });

  it("parses init arguments", () => {
    expect(parseCliArgs(["init", "playbooks/refactor.md"])).toEqual({
      command: "init",
      host: "0.0.0.0",
      port: 8787,
      dryRun: false,
      resume: false,
      initPath: "playbooks/refactor.md",
    });
  });
});
