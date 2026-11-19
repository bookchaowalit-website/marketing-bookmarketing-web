// @vitest-environment happy-dom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Home from "@/app/page";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let root: Root;
let host: HTMLDivElement;
const $ = <T extends Element = HTMLElement>(selector: string) => host.querySelector(selector) as T | null;
const button = (text: string, scope: ParentNode = host) => [...scope.querySelectorAll("button")].find((b) => b.textContent?.trim().startsWith(text)) as HTMLButtonElement;
const pills = () => [...host.querySelectorAll(".as-row .as-pill")].map((p) => p.textContent);
const status = () => $('[role="status"]')!.textContent;
const press = (el: Element, detail = 1) => act(() => { el.dispatchEvent(new MouseEvent("click", { bubbles: true, detail })); });

beforeEach(() => {
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  act(() => root.render(<Home />));
});
afterEach(() => {
  act(() => root.unmount());
  host.remove();
  vi.useRealTimers();
});

describe("logging moves", () => {
  it("Log next move logs in order, announces the next one, and stops when all are logged", () => {
    press(button("Log next move"));
    expect(pills()).toEqual(["Logged", "Next up", "To do"]);
    expect(status()).toBe("Logged Landing page. Next up: Essay.");
    expect($(".as-progress")!.getAttribute("aria-valuenow")).toBe("1");
    press(button("Log next move"));
    press(button("Log next move"));
    expect(status()).toContain("Every move in this file is logged.");
    expect(button("All moves logged").disabled).toBe(true);
    expect($(".as-side")!.textContent).toContain("3");
  });

  it("checkboxes log and unlog any move", () => {
    const boxes = () => [...host.querySelectorAll<HTMLInputElement>(".as-check input")];
    press(boxes()[2]);
    expect(pills()).toEqual(["Next up", "To do", "Logged"]);
    expect(status()).toBe("Logged Newsletter.");
    press(boxes()[2]);
    expect(pills()).toEqual(["Next up", "To do", "To do"]);
    expect(status()).toBe("Newsletter is back on the list.");
  });

  it("each campaign keeps its own progress", () => {
    press(button("Log next move"));
    press(button("Quiet Tools", $(".as-side")!));
    expect($("h1")!.textContent).toBe("Quiet Tools");
    expect(pills()[0]).toBe("Next up");
    press(button("Field Notes", $(".as-side")!));
    expect(pills()[0]).toBe("Logged");
  });
});

describe("reset", () => {
  it("is disabled with nothing logged, offers Undo, and the toast closes on its own and on Escape", () => {
    vi.useFakeTimers();
    expect(button("Reset file").disabled).toBe(true);
    press(button("Log next move"));
    press(button("Reset file"), 0);
    expect(pills()[0]).toBe("Next up");
    expect(document.activeElement?.textContent).toBe("Undo");
    press(button("Undo"));
    expect(pills()[0]).toBe("Logged");
    press(button("Reset file"));
    act(() => { vi.advanceTimersByTime(6100); });
    expect($(".as-toast")).toBeNull();
    press(button("Log next move"));
    press(button("Reset file"));
    act(() => { $(".as-toast")!.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })); });
    expect($(".as-toast")).toBeNull();
  });
});
