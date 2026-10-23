"use client";

import { useState } from "react";
import { CAMPAIGNS, actionLabel, findCampaign, logMove, nextChannel, pad2, resetProgress, type Progress } from "@/lib/bookmarketing";

export default function Home() {
  const [campaignId, setCampaignId] = useState("field-notes");
  const [channelIndex, setChannelIndex] = useState(0);
  const [completed, setCompleted] = useState<Progress>({});
  const campaign = findCampaign(campaignId);
  const channel = campaign.channels[channelIndex] ?? campaign.channels[0];
  const finished = completed[campaign.id] ?? [];
  const currentDone = finished.includes(channelIndex);

  function chooseCampaign(id: string) { setCampaignId(id); setChannelIndex(0); }
  function advance() {
    setCompleted((current) => logMove(current, campaign.id, channelIndex));
    setChannelIndex(nextChannel(channelIndex, campaign.channels.length));
  }
  function resetCampaign() { setCompleted((current) => resetProgress(current, campaign.id)); setChannelIndex(0); }

  return (
    <main className="marketing-page">
      <div className="marketing-sheet">
        <header className="marketing-header"><div className="marketing-brand"><span className="brand-mark">BM</span><span>BOOKMARKETING</span></div><nav aria-label="Primary"><a href="#campaigns">Campaigns</a><a href="#sequence">Sequence</a><a href="#notes">Notes</a></nav><span className="issue-mark">ISSUE 04 / 2026</span></header>
        <section className="marketing-intro"><div><h1>One promise.<br /><em>Many echoes.</em></h1><p>A campaign desk for turning a book&apos;s clearest idea into a sequence of useful things to publish.</p></div><div className="editor-stamp"><span>EDITOR&apos;S DESK</span><strong>BM</strong><small>synthetic campaign study<br />not live analytics</small></div></section>
        <section className="campaign-workbench" id="campaigns"><aside className="campaign-rail"><div className="rail-cap"><span>CAMPAIGN FILES</span><strong>{CAMPAIGNS.length} OPEN</strong></div>{CAMPAIGNS.map((item) => <button key={item.id} type="button" className={item.id === campaign.id ? "campaign-row is-active" : "campaign-row"} onClick={() => chooseCampaign(item.id)} aria-pressed={item.id === campaign.id}><span>{item.mark}</span><strong>{item.title}</strong><small>{item.audience}</small></button>)}<div className="rail-caption"><span>WORKING RULE</span><p>Start with the sentence readers can repeat. Every channel earns its place by carrying it somewhere new.</p></div></aside>
          <div className="campaign-sheet" id="sequence"><div className="sheet-heading"><div><span>CAMPAIGN / {campaign.mark}</span><h2>{campaign.title}</h2><p>{campaign.audience}</p></div><div className="promise-quote">&ldquo;{campaign.hook}&rdquo;</div></div><div className="channel-track" aria-label="Campaign channel sequence">{campaign.channels.map((item, index) => <button key={item.name} type="button" className={index === channelIndex ? "channel-tab is-active" : "channel-tab"} onClick={() => setChannelIndex(index)} aria-pressed={index === channelIndex}><span className={finished.includes(index) ? "channel-check is-done" : "channel-check"}>{finished.includes(index) ? "DONE" : "NEXT"}</span><strong>{item.name}</strong><small>{item.role}</small></button>)}</div><div className="channel-brief"><div className="brief-label"><span>EDITORIAL MOVE</span><span>{pad2(channelIndex + 1)} / {pad2(campaign.channels.length)}</span></div><h3>{channel.name}</h3><p>{channel.task}</p><div className="proof-line"><span>HANDOFF PROOF</span><strong>{channel.proof}</strong></div><div className="brief-actions"><button type="button" className="ink-action" onClick={advance} disabled={currentDone}>{actionLabel(currentDone, channelIndex, campaign.channels.length)}</button><button type="button" className="paper-action" onClick={resetCampaign}>Reset file</button></div></div></div>
        </section>
        <section className="notes-strip" id="notes"><div><span>THE SIGNAL</span><strong>{campaign.hook}</strong></div><p>Each campaign in this desk is synthetic. The useful output is the sequence: a clear anchor, a deeper proof, and a reason to return.</p></section>
        <footer className="marketing-footer"><span>BOOKCHAOWALIT / BOOKMARKETING</span><span>EDITORIAL CAMPAIGN DESK · SYNTHETIC DATA</span></footer>
      </div>
    </main>
  );
}
