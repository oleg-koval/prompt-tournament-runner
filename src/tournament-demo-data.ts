export interface TournamentDemo {
  id: string;
  label: string;
  description: string;
  task: string;
  context: string;
  variants: {
    id: string;
    name: string;
    prompt: string;
    output: string;
    score: number;
    notes: string;
  }[];
}

export const tournamentDemos: TournamentDemo[] = [
  {
    id: "support-reply",
    label: "Support reply",
    description: "A practical customer support comparison run.",
    task: "Reply to a customer asking why their invoice changed after a plan upgrade.",
    context:
      "Tone: calm, concise, human. Keep it under 120 words and mention next steps.",
    variants: [
      {
        id: "a",
        name: "Direct",
        prompt: "Write a brief, helpful support reply.",
        output:
          "Hi - the invoice changed because your plan upgraded on the next billing cycle. I can walk you through the exact line items if you want. Reply with the invoice number and I will check it.",
        score: 4,
        notes: "Clear but a bit terse.",
      },
      {
        id: "b",
        name: "Reassuring",
        prompt: "Write a brief reply that reduces anxiety.",
        output:
          "Thanks for flagging this. The invoice changed because your plan upgrade took effect on the next billing cycle, so the new plan was billed at the updated rate. If you send the invoice number, I will verify each line item and explain any adjustment.",
        score: 5,
        notes: "Best balance of clarity and empathy.",
      },
      {
        id: "c",
        name: "Policy-first",
        prompt: "Write a policy-grounded reply.",
        output:
          "Per billing policy, plan changes are applied on the next cycle. Please review the account settings for details or contact support if you need help.",
        score: 2,
        notes: "Too stiff.",
      },
    ],
  },
  {
    id: "landing-page-copy",
    label: "Landing page copy",
    description: "A headline and subhead test for a tiny SaaS.",
    task: "Write a headline and subhead for a prompt comparison app.",
    context: "Audience: founders and ops people. Keep it concrete, not clever.",
    variants: [
      {
        id: "a",
        name: "Plain",
        prompt: "Write a clear headline and subhead.",
        output:
          "Test prompts side by side. Compare outputs, score them fast, and keep the winner.",
        score: 5,
        notes: "Direct and readable.",
      },
      {
        id: "b",
        name: "Playful",
        prompt: "Make it a little punchier.",
        output:
          "Stop guessing. Run prompt tournaments and keep the best result.",
        score: 4,
        notes: "Short, but less specific.",
      },
      {
        id: "c",
        name: "Verbose",
        prompt: "Explain the workflow in full.",
        output:
          "Compare three to five prompt variants on the same task, review the responses together, and pick the prompt that actually works.",
        score: 3,
        notes: "Correct, but too wordy for a headline.",
      },
    ],
  },
];
