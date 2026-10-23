import { describe, expect, it } from "vitest";
import { CAMPAIGNS, actionLabel, findCampaign, logMove, nextChannel, pad2, resetProgress } from "@/lib/bookmarketing";

describe("campaign files", () => {
  it("has three synthetic campaigns of three channels each (anchor, depth, return)", () => {
    expect(CAMPAIGNS.map((c) => c.id)).toEqual(["field-notes", "quiet-tools", "maker-log"]);
    for (const campaign of CAMPAIGNS) expect(campaign.channels.map((c) => c.role)).toEqual(["anchor", "depth", "return"]);
  });

  it("falls back to the first file for an unknown id", () => {
    expect(findCampaign("nope").id).toBe("field-notes");
  });
});

describe("logging moves", () => {
  it("logs a move once, in order, per campaign", () => {
    let progress = logMove({}, "quiet-tools", 2);
    progress = logMove(progress, "quiet-tools", 0);
    progress = logMove(progress, "quiet-tools", 2);
    expect(progress).toEqual({ "quiet-tools": [0, 2] });
  });

  it("keeps other campaigns untouched and resets only one", () => {
    const progress = logMove(logMove({}, "field-notes", 0), "maker-log", 1);
    expect(resetProgress(progress, "maker-log")).toEqual({ "field-notes": [0], "maker-log": [] });
  });

  it("opens the next channel and stays on the last", () => {
    expect(nextChannel(0, 3)).toBe(1);
    expect(nextChannel(2, 3)).toBe(2);
  });

  it("labels the action for each state", () => {
    expect(actionLabel(false, 0, 3)).toBe("Log and open next");
    expect(actionLabel(false, 2, 3)).toBe("Log final move");
    expect(actionLabel(true, 1, 3)).toBe("Move logged");
  });

  it("pads counters", () => {
    expect(pad2(3)).toBe("03");
  });
});
