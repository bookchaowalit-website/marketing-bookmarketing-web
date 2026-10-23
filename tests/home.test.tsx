import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";

const text = (html: string) => html.replace(/<!-- -->/g, "");

describe("home page", () => {
  it("renders the desk, the first campaign file and the synthetic-data notice", () => {
    const html = text(renderToString(<Home />));
    expect(html).toContain("One promise.");
    expect(html).toContain("Field Notes for a Solo Empire");
    expect(html).toContain("not live analytics");
    expect(html).toContain("EDITORIAL CAMPAIGN DESK · SYNTHETIC DATA");
  });

  it("starts on the first channel with nothing logged", () => {
    const html = text(renderToString(<Home />));
    expect(html).toContain("01 / 03");
    expect(html).toContain("Log and open next");
    expect(html).not.toContain(">DONE<");
  });
});
