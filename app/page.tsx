"use client";

import { useEffect, useRef, useState } from "react";
import { AppFoot, AppTop, ListButton, Pill, type Tone } from "@/components/app-shell";
import { CAMPAIGNS, findCampaign, firstOpen, logMove, resetProgress, unlogMove, type Progress } from "@/lib/bookmarketing";

type Undo = { campaignId: string; done: number[]; viaKeyboard: boolean };

export default function Home() {
  const [campaignId, setCampaignId] = useState(CAMPAIGNS[0].id);
  const [progress, setProgress] = useState<Progress>({});
  const [announcement, setAnnouncement] = useState("");
  const [undo, setUndo] = useState<Undo | null>(null);
  const [toastFocused, setToastFocused] = useState(false);
  const undoRef = useRef<HTMLButtonElement>(null);
  const campaign = findCampaign(campaignId);
  const done = progress[campaign.id] ?? [];
  const total = campaign.channels.length;
  const next = firstOpen(progress, campaign);

  useEffect(() => { if (undo?.viaKeyboard) undoRef.current?.focus(); }, [undo]);
  // The Undo toast closes 6 s after a reset, but never while it holds focus.
  useEffect(() => {
    if (!undo || toastFocused) return;
    const timer = window.setTimeout(() => setUndo(null), 6000);
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
    setUndo({ campaignId: campaign.id, done, viaKeyboard });
    setProgress((current) => resetProgress(current, campaign.id));
    setAnnouncement(`Reset ${campaign.title}. Undo is available for a few seconds.`);
  }

  function restore() {
    if (!undo) return;
    setProgress((current) => ({ ...current, [undo.campaignId]: undo.done }));
    setAnnouncement("Restored the logged moves.");
    setUndo(null);
    setToastFocused(false);
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
              <button type="button" className="as-plain as-danger" onClick={(event) => reset(event.detail === 0)} disabled={done.length === 0}>Reset file</button>
              <button type="button" className="as-button" onClick={logNext} disabled={next < 0}>{next < 0 ? "All moves logged" : "Log next move"}</button>
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
          className="as-toast"
          role="group"
          aria-label="Undo reset"
          onFocus={() => setToastFocused(true)}
          onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setToastFocused(false); }}
          onKeyDown={(event) => { if (event.key === "Escape") { setUndo(null); setToastFocused(false); } }}
        >
          <span>Reset the logged moves</span>
          <button ref={undoRef} type="button" className="as-plain" onClick={restore}>Undo</button>
        </div>
      ) : null}

      <AppFoot source="https://github.com/bookchaowalit-website/marketing-bookmarketing-web" />
    </div>
  );
}
