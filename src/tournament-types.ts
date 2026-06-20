export type ModelProvider = "claude" | "codex" | "ollama";

export interface ModelConfig {
  provider: ModelProvider;
  model: string;
}

export interface PromptVariant {
  id: string;
  name: string;
  prompt: string;
  output: string;
  score: number;
  notes: string;
}

export interface PromptTournamentRun {
  id: string;
  createdAt: string;
  updatedAt: string;
  task: string;
  context: string;
  winnerVariantId: string;
  variants: PromptVariant[];
}

export interface PromptTournamentRunInputVariant {
  id?: string;
  name?: string;
  prompt?: string;
  output?: string;
  score?: number;
  notes?: string;
}

export interface PromptTournamentRunInput {
  task?: string;
  context?: string;
  winnerVariantId?: string;
  variants: PromptTournamentRunInputVariant[];
}

export interface TournamentStoreData {
  runs: PromptTournamentRun[];
}

export interface TournamentSummary {
  runCount: number;
  averageScore: number | null;
  latestUpdatedAt: string | null;
}

export interface RunningServer {
  port: number;
  stop: () => Promise<void>;
}

export interface ServerOptions {
  host: string;
  port: number;
  workspaceRoot: string;
}
