import { describe, expect, it } from "vitest";
import {
  pickWinnerVariant,
  summarizeRuns,
  nonEmptyVariants,
} from "../src/index.js";
import type { PromptTournamentRun } from "../src/tournament-types.js";

describe("pickWinnerVariant", () => {
  it("returns the highest-scoring variant when no explicit winner exists", () => {
    const winner = pickWinnerVariant(
      [
        { id: "a", name: "A", prompt: "", output: "", score: 2, notes: "" },
        { id: "b", name: "B", prompt: "", output: "", score: 5, notes: "" },
        { id: "c", name: "C", prompt: "", output: "", score: 4, notes: "" },
      ],
      undefined,
    );

    expect(winner?.id).toBe("b");
  });

  it("honors the explicit winner id", () => {
    const winner = pickWinnerVariant(
      [
        { id: "a", name: "A", prompt: "", output: "", score: 2, notes: "" },
        { id: "b", name: "B", prompt: "", output: "", score: 5, notes: "" },
      ],
      "a",
    );

    expect(winner?.id).toBe("a");
  });
});

describe("nonEmptyVariants", () => {
  it("filters out blank prompt slots", () => {
    expect(
      nonEmptyVariants([
        { id: "a", name: "", prompt: "", output: "", score: 3, notes: "" },
        { id: "b", name: "B", prompt: "", output: "", score: 3, notes: "" },
        {
          id: "c",
          name: "",
          prompt: "Prompt",
          output: "",
          score: 3,
          notes: "",
        },
      ]),
    ).toHaveLength(2);
  });
});

describe("summarizeRuns", () => {
  it("computes run count, average score, and latest timestamp", () => {
    const runs: PromptTournamentRun[] = [
      {
        id: "1",
        createdAt: "2026-06-14T08:00:00.000Z",
        updatedAt: "2026-06-14T08:10:00.000Z",
        task: "Task 1",
        context: "",
        winnerVariantId: "a",
        variants: [
          { id: "a", name: "A", prompt: "", output: "", score: 4, notes: "" },
          { id: "b", name: "B", prompt: "", output: "", score: 2, notes: "" },
        ],
      },
      {
        id: "2",
        createdAt: "2026-06-14T09:00:00.000Z",
        updatedAt: "2026-06-14T09:20:00.000Z",
        task: "Task 2",
        context: "",
        winnerVariantId: "c",
        variants: [
          { id: "c", name: "C", prompt: "", output: "", score: 5, notes: "" },
        ],
      },
    ];

    expect(summarizeRuns(runs)).toEqual({
      runCount: 2,
      averageScore: 3.7,
      latestUpdatedAt: "2026-06-14T09:20:00.000Z",
    });
  });
});
