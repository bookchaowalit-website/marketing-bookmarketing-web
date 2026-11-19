import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";

const text = (html: string) => html.replace(/<!-- -->/g, "");

describe("home page on the App shell", () => {
  const html = text(renderToString(<Home />));

  it("opens the first campaign file with nothing logged and the synthetic-data notice", () => {
    expect(html).toContain('class="as"');
    expect(html).toContain("<h1>Field Notes for a Solo Empire</h1>");
    expect(html).toContain("0 of 3");
    expect(html).toMatch(/data-tone="amber"[^>]*>Next up</);
    expect(html).not.toContain(">Logged<");
    expect(html).toContain("synthetic design studies, not live analytics");
    expect(html).not.toMatch(/ISSUE 04|CAMPAIGN FILES/);
  });

  it("lists every campaign, has one filled button and a footer back to the hub", () => {
    for (const title of ["Field Notes for a Solo Empire", "Quiet Tools", "The Maker Log"]) expect(html).toContain(title);
    expect(html.match(/class="as-button"/g)).toHaveLength(1);
    expect(html).toContain('href="https://bookchaowalit.com/"');
  });
});

describe("robots and sitemap", () => {
  it("use marketing.bookchaowalit.com", () => {
    expect(robots().sitemap).toBe("https://marketing.bookchaowalit.com/sitemap.xml");
    expect(sitemap()[0].url).toBe("https://marketing.bookchaowalit.com/");
  });
});
