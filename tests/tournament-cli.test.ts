import { describe, expect, it } from "vitest";
import { parseTournamentCliArgs } from "../src/index.js";

describe("parseTournamentCliArgs", () => {
  it("uses the default bind and port", () => {
    expect(parseTournamentCliArgs([])).toEqual({
      host: "0.0.0.0",
      port: 8790,
      root: process.cwd(),
    });
  });

  it("parses host, port, and root flags", () => {
    expect(
      parseTournamentCliArgs([
        "--host",
        "127.0.0.1",
        "--port",
        "9001",
        "--root",
        ".",
      ]),
    ).toEqual({
      host: "127.0.0.1",
      port: 9001,
      root: process.cwd(),
    });
  });
});
