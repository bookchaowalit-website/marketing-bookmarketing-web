"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AppFoot, AppTop, ListButton, Pill, type Tone } from "@/components/app-shell";
import { CAMPAIGNS, findCampaign, firstOpen, logMove, resetProgress, unlogMove, type Progress } from "@/lib/bookmarketing";

// Every reset inside the Undo window joins one batch: one Undo puts back the moves of each file it cleared.
type Reset = { campaignId: string; done: number[] };
type Undo = { resets: Reset[]; viaKeyboard: boolean };
const files = (n: number) => `${n} ${n === 1 ? "file" : "files"}`;

export default function Home() {
  const [campaignId, setCampaignId] = useState(CAMPAIGNS[0].id);
  const [progress, setProgress] = useState<Progress>({});
  const [announcement, setAnnouncement] = useState("");
  const [undo, setUndoState] = useState<Undo | null>(null);
  // The latest batch, so two resets before a re-render still both land in it.
  const pendingRef = useRef<Undo | null>(null);
  const setUndo = (next: Undo | null) => { pendingRef.current = next; setUndoState(next); };
  const [toastFocused, setToastFocused] = useState(false);
  const undoRef = useRef<HTMLButtonElement>(null);
  const toastRef = useRef<HTMLDivElement>(null);
  const resetRef = useRef<HTMLButtonElement>(null);
  const logRef = useRef<HTMLButtonElement>(null);
  const focusAfterClose = useRef(false);
  const campaign = findCampaign(campaignId);
  const done = progress[campaign.id] ?? [];
  const total = campaign.channels.length;
  const next = firstOpen(progress, campaign);

  useEffect(() => { if (undo?.viaKeyboard) undoRef.current?.focus(); }, [undo]);
  // When the toast closes after Undo or Escape, focus goes to Reset file once it is enabled again (after Undo),
  // else to the Log next move button, else the first checkbox.
  useEffect(() => {
    if (undo || !focusAfterClose.current) return;
    focusAfterClose.current = false;
    const target = [resetRef.current, logRef.current].find((button) => button && !button.disabled);
    (target ?? document.querySelector<HTMLInputElement>(".as-check input"))?.focus();
  }, [undo, progress]);
  // While the toast shows, reserve its height (plus its 24px offset and a gap) at the bottom of the page and in
  // scroll-padding, so the last moves and anything focused behind it can scroll clear of it.
  const toastShown = undo !== null;
  useLayoutEffect(() => {
    const toast = toastRef.current;
    if (!toastShown || !toast) return;
    const rootStyle = document.documentElement.style;
    const reserve = () => rootStyle.setProperty("--as-toast-space", `${toast.offsetHeight + 32}px`);
    reserve();
    const observer = typeof ResizeObserver === "function" ? new ResizeObserver(reserve) : null;
    observer?.observe(toast);
    return () => { observer?.disconnect(); rootStyle.removeProperty("--as-toast-space"); };
  }, [toastShown]);
  // The Undo toast closes 6 s after the latest reset (each reset restarts it), but never while it holds focus.
  useEffect(() => {
    if (!undo || toastFocused) return;
    const timer = window.setTimeout(() => { pendingRef.current = null; setUndoState(null); }, 6000);
    return () => window.clearTimeout(timer);
  }, [undo, toastFocused]);

  function toggle(index: number, checked: boolean) {
    const name = campaign.channels[index].name;
    setProgress((current) => (checked ? logMove(current, campaign.id, index) : unlogMove(current, campaign.id, index)));
    setAnnouncement(checked ? `Logged ${name}.` : `${name} is back on the list.`);
  }

  function logNext() {
    if (next < 0) return;
    const after = logMove(progress, campaign.id, next);
    setProgress(after);
    const following = firstOpen(after, campaign);
    setAnnouncement(`Logged ${campaign.channels[next].name}. ${following < 0 ? "Every move in this file is logged." : `Next up: ${campaign.channels[following].name}.`}`);
  }

  function reset(viaKeyboard: boolean) {
    const resets = [...(pendingRef.current?.resets ?? []), { campaignId: campaign.id, done }];
    setUndo({ resets, viaKeyboard });
    setProgress((current) => resetProgress(current, campaign.id));
    setAnnouncement(resets.length === 1 ? `Reset ${campaign.title}. Undo is available for a few seconds.` : `Reset ${files(resets.length)}. Undo is available for a few seconds.`);
  }

  function closeToast() {
    focusAfterClose.current = true;
    setUndo(null);
    setToastFocused(false);
  }

  function restore() {
    const resets = pendingRef.current?.resets;
    if (!resets?.length) return;
    // Each file gets back the moves it had when reset, plus any logged since.
    setProgress((current) => resets.reduce((next, { campaignId: id, done: moves }) => ({ ...next, [id]: [...new Set([...(next[id] ?? []), ...moves])].sort((a, b) => a - b) }), current));
    setAnnouncement(resets.length === 1 ? "Restored the logged moves." : `Restored the logged moves in ${files(resets.length)}.`);
    closeToast();
  }

  const status = (index: number): { tone: Tone; label: string } =>
    done.includes(index) ? { tone: "green", label: "Logged" } : index === next ? { tone: "amber", label: "Next up" } : { tone: "grey", label: "To do" };

  return (
    <div className="as">
      <a className="as-skip" href="#main">Skip to content</a>
      <AppTop name="BookMarketing" tagline="One promise, many echoes" />

      <div className="as-body">
        <aside className="as-side" aria-label="Campaign files">
          <h2>Campaigns · moves logged</h2>
          <ul className="as-lists">
            {CAMPAIGNS.map((item) => (
              <ListButton key={item.id} label={item.title} count={(progress[item.id] ?? []).length} current={item.id === campaign.id} onSelect={() => setCampaignId(item.id)} />
            ))}
          </ul>
        </aside>

        <main id="main" className="as-main">
          <div className="as-head">
            <div>
              <h1>{campaign.title}</h1>
              <p>For {campaign.audience}</p>
            </div>
            <div className="as-tools">
              <button ref={resetRef} type="button" className="as-plain as-danger" onClick={(event) => reset(event.detail === 0)} disabled={done.length === 0}>Reset file</button>
              <button ref={logRef} type="button" className="as-button" onClick={logNext} disabled={next < 0}>{next < 0 ? "All moves logged" : "Log next move"}</button>
            </div>
          </div>

          <p className="bm-hook">“{campaign.hook}”<small>The sentence every channel carries somewhere new.</small></p>

          <div className="as-progress-card">
            <div className="as-progress-text"><strong>{done.length} of {total}</strong><span>moves logged in this file</span></div>
            <div className="as-progress" role="progressbar" aria-label="Moves logged" aria-valuemin={0} aria-valuemax={total} aria-valuenow={done.length}><span style={{ width: `${(done.length / total) * 100}%` }} /></div>
          </div>

          <ol className="as-list" aria-label={`${campaign.title} sequence`}>
            {campaign.channels.map((channel, index) => {
              const { tone, label } = status(index);
              const logged = done.includes(index);
              return (
                <li className="as-row as-row-check" key={channel.name} data-done={logged ? "true" : undefined}>
                  <label className="as-check">
                    <input type="checkbox" checked={logged} onChange={(event) => toggle(index, event.target.checked)} aria-label={`Logged: ${channel.name}`} />
                    <span aria-hidden="true" />
                  </label>
                  <div>
                    <p className="bm-step">Move {index + 1} of {total} · {channel.role}</p>
                    <h3>{channel.name}</h3>
                    <p className="bm-task">{channel.task}</p>
                    <p className="bm-proof">Handoff proof: <strong>{channel.proof}</strong></p>
                  </div>
                  <Pill tone={tone}>{label}</Pill>
                </li>
              );
            })}
          </ol>

          <section className="bm-rule" aria-labelledby="rule-heading">
            <h2 id="rule-heading">Working rule</h2>
            <p>Start with the sentence readers can repeat. Every channel earns its place by carrying it somewhere new: an anchor, a deeper proof, and a reason to return.</p>
          </section>

          <p className="as-note">The three campaign files are synthetic design studies, not live analytics or real results. Progress lasts for this visit only; nothing is saved or sent.</p>
        </main>
      </div>

      <p className="as-sr" role="status" aria-live="polite">{announcement}</p>
      {undo ? (
        <div
          ref={toastRef}
          className="as-toast"
          role="group"
          aria-label="Undo reset"
          onFocus={() => setToastFocused(true)}
          onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setToastFocused(false); }}
          onKeyDown={(event) => { if (event.key === "Escape") closeToast(); }}
        >
          <span>{undo.resets.length === 1 ? "Reset the logged moves" : `Reset ${files(undo.resets.length)}`}</span>
          <button ref={undoRef} type="button" className="as-plain" onClick={restore} aria-label={undo.resets.length === 1 ? undefined : `Undo reset of ${files(undo.resets.length)}`}>Undo</button>
        </div>
      ) : null}

      <AppFoot source="https://github.com/bookchaowalit-website/marketing-bookmarketing-web" />
    </div>
  );
}
