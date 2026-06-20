import { describe, expect, it } from "vitest";
import {
  escapeHtml,
  renderRunSummary,
  renderVariantFields,
} from "../src/tournament-html-fragments.js";

describe("tournament html fragments", () => {
  it("escapes html and renders variant fields", () => {
    expect(escapeHtml("<tag>&\"'")).toBe("&lt;tag&gt;&amp;&quot;&#39;");
    expect(renderVariantFields(2)).toContain("variant-2-name");
    expect(renderVariantFields(2)).toContain("Variant 2");
  });

  it("renders a saved run summary", () => {
    const html = renderRunSummary({
      id: "run-1",
      createdAt: "2026-06-14T08:00:00.000Z",
      updatedAt: "2026-06-14T08:10:00.000Z",
      task: "Task <1>",
      context: "Context & more",
      winnerVariantId: "variant-b",
      variants: [
        {
          id: "variant-a",
          name: "A",
          prompt: "Prompt A",
          output: "Output A",
          score: 2,
          notes: "",
        },
        {
          id: "variant-b",
          name: "B",
          prompt: "Prompt B",
          output: "Output B",
          score: 5,
          notes: "winner",
        },
      ],
    });

    expect(html).toContain("Task &lt;1&gt;");
    expect(html).toContain("Winner: B");
    expect(html).toContain("score 5");
  });
});
