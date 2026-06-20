import type {
  PromptTournamentRun,
  PromptVariant,
  TournamentSummary,
} from "./tournament-types.js";

export function nonEmptyVariants(variants: PromptVariant[]): PromptVariant[] {
  return variants.filter(
    (variant) =>
      variant.name.trim().length > 0 ||
      variant.prompt.trim().length > 0 ||
      variant.output.trim().length > 0,
  );
}

export function pickWinnerVariant(
  variants: PromptVariant[],
  winnerVariantId: string | undefined,
): PromptVariant | undefined {
  const explicitWinner = variants.find(
    (variant) => variant.id === winnerVariantId,
  );
  if (explicitWinner !== undefined) {
    return explicitWinner;
  }

  return variants.reduce<PromptVariant | undefined>((winner, variant) => {
    if (winner === undefined) {
      return variant;
    }

    if (variant.score > winner.score) {
      return variant;
    }

    return winner;
  }, undefined);
}

export function summarizeRuns(runs: PromptTournamentRun[]): TournamentSummary {
  if (runs.length === 0) {
    return {
      runCount: 0,
      averageScore: null,
      latestUpdatedAt: null,
    };
  }

  const scores = runs
    .flatMap((run) => run.variants.map((variant) => variant.score))
    .filter((score) => Number.isFinite(score));
  const averageScore =
    scores.length === 0
      ? null
      : Math.round(
          (scores.reduce((total, score) => total + score, 0) / scores.length) *
            10,
        ) / 10;

  return {
    runCount: runs.length,
    averageScore,
    latestUpdatedAt: runs.reduce<string | null>((latest, run) => {
      if (latest === null || run.updatedAt > latest) {
        return run.updatedAt;
      }

      return latest;
    }, null),
  };
}
