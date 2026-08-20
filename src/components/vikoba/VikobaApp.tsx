"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronRight,
  CircleDollarSign,
  Download,
  FileCheck2,
  Landmark,
  LockKeyhole,
  MoreHorizontal,
  Receipt,
  ShieldCheck,
  Sparkles,
  Users,
  WalletCards,
} from "lucide-react";

type View = "meeting" | "passbook";

const money = (value: string) => (
  <span className="vikoba-money"><small>TZS</small>{value}</span>
);

function Header({ view, setView }: { view: View; setView: (view: View) => void }) {
  return (
    <header className="vikoba-header">
      <div className="vikoba-header-top">
        <div className="vikoba-brand"><span className="vikoba-brand-mark"><Landmark size={17} strokeWidth={2.5} /></span><span>VIKOBA <b>Digital</b></span></div>
        <button className="vikoba-icon-button header-menu" aria-label="More options"><MoreHorizontal size={21} /></button>
      </div>
      {view === "meeting" ? (
        <>
          <div className="vikoba-kicker">Weekly meeting reconciliation</div>
          <div className="vikoba-meeting-name">Furaha VIKOBA <span className="vikoba-sync"><span />Offline mode · Synced locally</span></div>
          <div className="vikoba-date"><CalendarDays size={14} /> Saturday, 18 May 2024 <span>·</span> 14:30 EAT</div>
        </>
      ) : (
        <>
          <div className="vikoba-kicker">Member passbook</div>
          <div className="vikoba-meeting-name">Your financial snapshot</div>
          <div className="vikoba-date"><ShieldCheck size={14} /> Private to your device <span>·</span> Synced locally</div>
        </>
      )}
      <div className="vikoba-view-switch" role="tablist" aria-label="VIKOBA views">
        <button className={view === "meeting" ? "active" : ""} onClick={() => setView("meeting")} role="tab" aria-selected={view === "meeting"}>Meeting session</button>
        <button className={view === "passbook" ? "active" : ""} onClick={() => setView("passbook")} role="tab" aria-selected={view === "passbook"}>My passbook</button>
      </div>
    </header>
  );
}

function Metric({ icon: Icon, label, value, note, accent }: { icon: typeof WalletCards; label: string; value: string; note: string; accent?: string }) {
  return <article className="vikoba-metric"><div className={`vikoba-metric-icon ${accent ?? ""}`}><Icon size={16} /></div><div className="vikoba-metric-label">{label}</div><div className="vikoba-metric-value">{value}</div><div className="vikoba-metric-note">{note}</div></article>;
}

function Status({ children, type }: { children: React.ReactNode; type: "verified" | "pending" }) {
  return <span className={`vikoba-status ${type}`}>{type === "verified" ? <Check size={12} /> : <span className="vikoba-status-dot" />}{children}</span>;
}

function MeetingView() {
  return <main className="vikoba-content">
    <div className="vikoba-section-heading"><div><span className="vikoba-overline">Session totals</span><h1>Today at a glance</h1></div><span className="vikoba-count"><Users size={14} /> 12 members</span></div>
    <section className="vikoba-metrics" aria-label="Session totals">
      <Metric icon={WalletCards} label="Cash collected" value="486,000" note="+ 6.4% vs last week" accent="cyan" />
      <Metric icon={CircleDollarSign} label="Shares purchased" value="24" note="hisa this meeting" accent="gold" />
      <Metric icon={ArrowUpRight} label="Loan collections" value="215,000" note="TZS repaid today" accent="green" />
    </section>
    <section className="vikoba-feed-section">
      <div className="vikoba-section-heading"><div><span className="vikoba-overline">Live activity</span><h2>Member contributions</h2></div><button className="vikoba-text-button">View all <ChevronRight size={15} /></button></div>
      <div className="vikoba-activity-card">
        <div className="vikoba-feed-row"><div className="vikoba-avatar blue">AN</div><div className="vikoba-feed-main"><strong>Amina N.</strong><span>Shares contribution · 4 hisa</span></div><div className="vikoba-feed-side"><b>+ 40,000</b><Status type="verified">Verified</Status></div></div>
        <div className="vikoba-feed-row"><div className="vikoba-avatar purple">JM</div><div className="vikoba-feed-main"><strong>Juma M.</strong><span>Loan repayment · Week 12</span></div><div className="vikoba-feed-side"><b>+ 75,000</b><Status type="pending">Pending signature</Status></div></div>
        <div className="vikoba-feed-row"><div className="vikoba-avatar orange">SK</div><div className="vikoba-feed-main"><strong>Salma K.</strong><span>Shares contribution · 2 hisa</span></div><div className="vikoba-feed-side"><b>+ 20,000</b><Status type="verified">Verified</Status></div></div>
        <div className="vikoba-feed-row"><div className="vikoba-avatar teal">HM</div><div className="vikoba-feed-main"><strong>Hassan M.</strong><span>Emergency fund · Weekly</span></div><div className="vikoba-feed-side"><b>+ 10,000</b><Status type="verified">Verified</Status></div></div>
      </div>
      <div className="vikoba-notice"><FileCheck2 size={18} /><div><strong>1 contribution needs attention</strong><span>Ask Juma to sign before locking the session.</span></div><ChevronRight size={17} /></div>
    </section>
    <div className="vikoba-secure-note"><LockKeyhole size={14} /> All records are encrypted on this device</div>
  </main>;
}

function Ring({ value, label, className }: { value: string; label: string; className: string }) {
  return <div className={`vikoba-ring ${className}`}><div><strong>{value}</strong><span>{label}</span></div></div>;
}

function PassbookView() {
  return <main className="vikoba-content passbook-content">
    <section className="vikoba-equity-card"><div className="vikoba-equity-top"><div><span className="vikoba-overline light">Total savings equity</span><div className="vikoba-equity-value">TZS 1,240,000</div><span className="vikoba-equity-caption">As of today · Member since Jan 2023</span></div><div className="vikoba-equity-icon"><Sparkles size={19} /></div></div><div className="vikoba-rings"><Ring value="78%" label="Shares" className="shares" /><Ring value="22%" label="Emergency" className="emergency" /><div className="vikoba-ring-summary"><div><i className="dot blue-dot" />Shares <b>TZS 967,200</b></div><div><i className="dot gold-dot" />Emergency fund <b>TZS 272,800</b></div></div></div></section>
    <section className="vikoba-loan-card"><div className="vikoba-section-heading"><div><span className="vikoba-overline">Active loan</span><h2>Business expansion</h2></div><span className="vikoba-loan-status">On track</span></div><div className="vikoba-loan-numbers"><div><span>Principal paid</span><strong>TZS 840,000</strong></div><div><span>Balance remaining</span><strong>TZS 360,000</strong></div></div><div className="vikoba-progress"><span /></div><div className="vikoba-progress-footer"><span>70% paid</span><span>Due 28 May 2024</span></div></section>
    <section className="vikoba-transactions"><div className="vikoba-section-heading"><div><span className="vikoba-overline">Your history</span><h2>Recent transactions</h2></div><button className="vikoba-text-button">See all <ChevronRight size={15} /></button></div><div className="vikoba-transaction-list"><Transaction date="18 MAY" label="Weekly shares · 2 hisa" amount="+ TZS 20,000" /><Transaction date="11 MAY" label="Weekly shares · 2 hisa" amount="+ TZS 20,000" /><Transaction date="04 MAY" label="Loan repayment · Week 11" amount="+ TZS 70,000" /><Transaction date="27 APR" label="Emergency fund" amount="+ TZS 10,000" /></div></section>
    <div className="vikoba-secure-note"><ShieldCheck size={14} /> Your passbook is up to date</div>
  </main>;
}

function Transaction({ date, label, amount }: { date: string; label: string; amount: string }) {
  return <div className="vikoba-transaction"><div className="vikoba-receipt-icon"><Receipt size={17} /></div><div className="vikoba-transaction-copy"><strong>{label}</strong><span>{date} 2024 · Furaha VIKOBA</span></div><div className="vikoba-transaction-end"><b>{amount}</b><button aria-label={`Download receipt for ${label}`}><Download size={15} /></button></div></div>;
}

export function VikobaApp() {
  const [view, setView] = useState<View>("meeting");
  const [locked, setLocked] = useState(false);
  return <div className="vikoba-app"><div className="vikoba-phone-shell"><Header view={view} setView={setView} />{view === "meeting" ? <MeetingView /> : <PassbookView />}<div className="vikoba-bottom-bar">{view === "meeting" ? <button className="vikoba-lock-button" onClick={() => setLocked(true)}><LockKeyhole size={17} />{locked ? "Meeting session locked" : "Reconcile & lock meeting session"}</button> : <button className="vikoba-lock-button" onClick={() => setView("meeting")}><ArrowLeft size={17} /> Back to meeting session</button>}</div></div></div>;
}
