// Campaign desk: three synthetic campaign files and the "log a move" rules. Session state only; nothing is saved.

export type Channel = { name: string; role: string; task: string; proof: string };
export type Campaign = { id: string; mark: string; title: string; hook: string; audience: string; channels: Channel[] };

export const CAMPAIGNS: Campaign[] = [
  { id: "field-notes", mark: "FN", title: "Field Notes for a Solo Empire", hook: "Build a life that can explain itself.", audience: "operators who want a calmer system", channels: [
    { name: "Landing page", role: "anchor", task: "Clarify the promise in one screen and give the reader a reason to keep the note.", proof: "one sentence / one action" },
    { name: "Essay", role: "depth", task: "Tell the operating story through one constraint, one failure, and the rule that survived.", proof: "900 words / one lived example" },
    { name: "Newsletter", role: "return", task: "Send the smallest useful excerpt with a clear invitation to read the full field note.", proof: "Friday / direct reply" },
  ] },
  { id: "quiet-tools", mark: "QT", title: "Quiet Tools", hook: "Software that leaves room for the work.", audience: "independent makers choosing less noise", channels: [
    { name: "Positioning", role: "anchor", task: "Name the noisy category and draw a clean boundary around the tool's one job.", proof: "three contrasts / no jargon" },
    { name: "Demo script", role: "depth", task: "Show the tool handling a real small task from first input to a visible handoff.", proof: "90 seconds / one task" },
    { name: "Community note", role: "return", task: "Ask one honest question that lets early readers shape the next useful release.", proof: "one prompt / open replies" },
  ] },
  { id: "maker-log", mark: "ML", title: "The Maker Log", hook: "A public record of what actually shipped.", audience: "curious builders who value evidence", channels: [
    { name: "Case study", role: "anchor", task: "Put the shipped artifact before the backstory and let the evidence carry the claim.", proof: "artifact / decision / result" },
    { name: "Short post", role: "depth", task: "Compress one tradeoff into a note that another builder could use this week.", proof: "120 words / one rule" },
    { name: "Follow-up", role: "return", task: "Return to the original promise with what changed after real use.", proof: "two weeks / one revision" },
  ] },
];

export type Progress = Record<string, number[]>;

export function findCampaign(id: string): Campaign {
  return CAMPAIGNS.find((item) => item.id === id) ?? CAMPAIGNS[0];
}

/** Marks one channel of a campaign as logged (idempotent, kept in order). */
export function logMove(progress: Progress, campaignId: string, index: number): Progress {
  const done = new Set([...(progress[campaignId] ?? []), index]);
  return { ...progress, [campaignId]: [...done].sort((a, b) => a - b) };
}

/** After logging, open the next channel; stay on the last one. */
export function nextChannel(index: number, total: number): number {
  return Math.min(index + 1, total - 1);
}

export function resetProgress(progress: Progress, campaignId: string): Progress {
  return { ...progress, [campaignId]: [] };
}

export function actionLabel(done: boolean, index: number, total: number): string {
  if (done) return "Move logged";
  return index === total - 1 ? "Log final move" : "Log and open next";
}

export function pad2(value: number): string {
  return String(value).padStart(2, "0");
}
