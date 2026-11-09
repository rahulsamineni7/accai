import React, { useState } from 'react';
import { useDigits } from '../../context/DigitsContext';

export const ReconciliationsView: React.FC = () => {
  const { transactions } = useDigits();
  const [activeAccountTab, setActiveAccountTab] = useState<'mercury' | 'chase' | 'brex'>('mercury');
  const [isLocked, setIsLocked] = useState(false);
  const [isLocking, setIsLocking] = useState(false);
  const [showProofPackAlert, setShowProofPackAlert] = useState(false);
  const [brexDiscrepancyResolved, setBrexDiscrepancyResolved] = useState(false);

  // Inflow Selection Checkboxes
  const [inflowChecked, setInflowChecked] = useState<{ [key: string]: boolean }>({
    in1: true,
    in2: true,
    in3: true,
    in4: true
  });

  // Outflow Selection Checkboxes
  const [outflowChecked, setOutflowChecked] = useState<{ [key: string]: boolean }>({
    out1: true,
    out2: true,
    out3: true,
    out4: true
  });

  const toggleInflow = (id: string) => {
    setInflowChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleOutflow = (id: string) => {
    setOutflowChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleLockStatement = () => {
    if (isLocked) return;
    setIsLocking(true);
    setTimeout(() => {
      setIsLocking(false);
      setIsLocked(true);
    }, 1200);
  };

  const handleAcceptDiscrepancyMatch = () => {
    setBrexDiscrepancyResolved(true);
  };

  const handleDownloadProofPack = () => {
    setShowProofPackAlert(true);
    setTimeout(() => setShowProofPackAlert(false), 3000);
  };

  return (
    <div className="w-full relative">
      {/* Ambient Luminous Mesh Lighting Nodes */}
      <div className="absolute -top-16 right-10 w-96 h-96 bg-[#68dba9]/20 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-80 left-24 w-80 h-80 bg-[#6ffbbe]/25 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Primary Page Body Container with Generous Framing */}
      <div className="max-w-[1400px] w-full mx-auto px-6 py-6 flex flex-col gap-6">
        {/* Top Metadata Header Strip */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#006948] font-bold tracking-widest uppercase bg-[#f2f3ff] px-3 py-0.5 rounded-full border border-[#eaedff]">
                Autonomous GL v4.2 • Period Verification
              </span>
              <span className="text-[#bccac0] text-xs">•</span>
              <span className="font-mono text-xs text-[#3d4a42]">
                {activeAccountTab === 'mercury'
                  ? 'Ledger: 1010-00 Cash & Equivalents'
                  : activeAccountTab === 'chase'
                  ? 'Ledger: 1020-00 Treasury Yield Fund'
                  : 'Ledger: 2010-00 Corporate Credit Card'}
              </span>
            </div>
            <div className="flex items-baseline gap-3 flex-wrap">
              <h1 className="text-3xl text-[#131b2e] font-bold tracking-tight">
                Bank & Credit Card Reconciliation
              </h1>
              <span className="text-sm text-[#3d4a42] font-medium">
                October 2024 — Acme Technologies Inc.
              </span>
            </div>
          </div>

          {/* Action Cluster */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadProofPack}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#eaedff] hover:bg-[#dae2fd] text-[#131b2e] text-xs font-semibold transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-base text-[#006948]">download</span>
              <span>Proof Pack (.pdf)</span>
            </button>
            <button
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#eaedff] hover:bg-[#dae2fd] text-[#131b2e] text-xs font-semibold transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-base text-[#3d4a42]">history</span>
              <span>Audit Log</span>
            </button>
          </div>
        </div>

        {/* Proof Pack Notification Toast */}
        {showProofPackAlert && (
          <div className="p-3 bg-[#6cf8bb]/30 border border-[#006c49]/30 rounded-2xl flex items-center gap-2 text-xs text-[#005137] font-semibold animate-in fade-in">
            <span className="material-symbols-outlined text-sm">verified</span>
            <span>Proof Pack (Acme_GL_Reconciliation_Oct2024.pdf) generated with cryptographic SHA-256 seal.</span>
          </div>
        )}

        {/* Difference Meter & Proof Banner (Frosted Glass Architecture) */}
        <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-2xl shadow-[0_12px_40px_-8px_rgba(0,105,72,0.08)] border border-[#eaedff] p-6 flex flex-col xl:flex-row items-stretch justify-between gap-6">
          <div className="absolute inset-0 bg-gradient-to-r from-[#85f8c4]/20 via-white/40 to-transparent pointer-events-none" />

          {/* Proof Balance Metric Triangle */}
          <div className="relative z-10 flex flex-wrap lg:flex-nowrap items-center gap-6 flex-1">
            {/* Ending Balance Cardlet */}
            <div className="flex flex-col min-w-[210px] p-4 rounded-xl bg-[#f2f3ff]/60 border border-[#eaedff] shadow-sm">
              <span className="text-[11px] text-[#3d4a42] uppercase tracking-wider font-semibold">
                Statement Ending Balance
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="font-mono text-2xl text-[#131b2e] font-semibold tracking-tight">
                  {activeAccountTab === 'mercury'
                    ? '$4,210,900.00'
                    : activeAccountTab === 'chase'
                    ? '$8,500,000.00'
                    : '$142,500.00'}
                </span>
              </div>
              <span className="text-xs text-[#3d4a42] mt-0.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs text-[#006c49]">verified</span>
                Bank statement confirmed 10/31
              </span>
            </div>

            {/* Minus Operator Symbol */}
            <div className="hidden sm:flex text-[#3d4a42] text-2xl font-light">−</div>

            {/* Cleared Book Balance Cardlet */}
            <div className="flex flex-col min-w-[210px] p-4 rounded-xl bg-[#f2f3ff]/60 border border-[#eaedff] shadow-sm">
              <span className="text-[11px] text-[#3d4a42] uppercase tracking-wider font-semibold">
                Cleared Book Balance
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="font-mono text-2xl text-[#131b2e] font-semibold tracking-tight">
                  {activeAccountTab === 'mercury'
                    ? '$4,210,900.00'
                    : activeAccountTab === 'chase'
                    ? '$8,500,000.00'
                    : brexDiscrepancyResolved
                    ? '$142,500.00'
                    : '$142,920.50'}
                </span>
              </div>
              <span className="text-xs text-[#3d4a42] mt-0.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs text-[#006c49]">sync</span>
                Matched {activeAccountTab === 'brex' && !brexDiscrepancyResolved ? '311 of 312' : '92 of 92'} line items
              </span>
            </div>

            {/* Equals Operator Symbol */}
            <div className="hidden sm:flex text-[#3d4a42] text-2xl font-light">=</div>

            {/* Live Variance Proof Pillar */}
            <div className="flex-1 min-w-[240px] p-4 rounded-xl bg-[#6cf8bb]/30 border border-[#6cf8bb]/40 shadow-sm flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs text-[#006c49] uppercase font-bold tracking-wider">
                  Live Net Variance
                </span>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`font-mono text-2xl font-bold ${activeAccountTab === 'brex' && !brexDiscrepancyResolved ? 'text-[#ba1a1a]' : 'text-[#006c49]'}`}>
                    {activeAccountTab === 'brex' && !brexDiscrepancyResolved ? '-$420.50' : '$0.00'}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide flex items-center gap-1 shadow-sm ${
                    activeAccountTab === 'brex' && !brexDiscrepancyResolved
                      ? 'bg-[#ffdad6] text-[#93000a]'
                      : 'bg-[#006c49] text-white'
                  }`}>
                    <span className="material-symbols-outlined text-xs">
                      {activeAccountTab === 'brex' && !brexDiscrepancyResolved ? 'warning' : 'check_circle'}
                    </span>
                    {activeAccountTab === 'brex' && !brexDiscrepancyResolved ? 'Variance Detected' : 'Perfect Match'}
                  </span>
                </div>
                <span className="text-xs text-[#006c49] mt-0.5">
                  Mathematical proof verified by Gemini Autonomous GL
                </span>
              </div>

              {/* Micro Sparkline SVG Proof of Zero Variance */}
              <div className="hidden md:flex flex-col items-end pr-2">
                <svg className="w-24 h-8 text-[#006c49] overflow-visible" fill="none" viewBox="0 0 96 32">
                  <path
                    d="M0 16 L20 16 L28 12 L36 20 L44 16 L60 16 L68 14 L76 16 L96 16"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                  <circle cx="96" cy="16" fill="currentColor" r="3" />
                </svg>
                <span className="font-mono text-[10px] text-[#006c49] tracking-widest mt-1">
                  DELTA: {activeAccountTab === 'brex' && !brexDiscrepancyResolved ? '-0.295%' : '0.0000%'}
                </span>
              </div>
            </div>
          </div>

          {/* Immutable Period Locking CTA */}
          <div className="relative z-10 flex flex-col justify-center items-start xl:items-end min-w-[280px]">
            <button
              onClick={handleLockStatement}
              disabled={isLocking}
              className={`w-full xl:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-bold transition-all shadow-sm ${
                isLocked
                  ? 'bg-[#6cf8bb] text-[#00714d] cursor-default'
                  : 'bg-[#006948] hover:bg-[#00855d] text-white shadow-[0_4px_16px_0_rgba(0,105,72,0.35)] active:scale-98'
              }`}
              type="button"
            >
              <span className={`material-symbols-outlined text-lg ${isLocking ? 'animate-spin' : ''}`}>
                {isLocking ? 'refresh' : isLocked ? 'verified' : 'lock'}
              </span>
              <span>
                {isLocking
                  ? 'Securing Ledger Snapshot...'
                  : isLocked
                  ? 'Period Locked & Signed (Oct 2024)'
                  : 'Seal & Lock Statement for Oct 2024'}
              </span>
            </button>
            <span className="font-mono text-xs text-[#3d4a42] mt-2 text-left xl:text-right">
              SHA-256 Ledger Seal • Irrevocable on signature
            </span>
          </div>
        </div>

        {/* Secondary Account Reconciliation Status Selector Rail */}
        <div className="flex items-center gap-4 overflow-x-auto pb-1">
          {/* Tab 1: Mercury Operating (Active) */}
          <button
            onClick={() => setActiveAccountTab('mercury')}
            className={`group flex items-center gap-3 p-3.5 rounded-2xl text-left shrink-0 transition-all border ${
              activeAccountTab === 'mercury'
                ? 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-[#006948]/30 ring-1 ring-[#006948]'
                : 'bg-[#f2f3ff]/70 hover:bg-white border-[#eaedff]'
            }`}
            type="button"
          >
            <div className="w-10 h-10 rounded-full bg-[#6cf8bb]/40 flex items-center justify-center text-[#006c49]">
              <span className="material-symbols-outlined text-xl">account_balance</span>
            </div>
            <div className="flex flex-col pr-3">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-[#131b2e]">Mercury Operating</span>
                <span className="font-mono text-[10px] text-[#3d4a42]">• 4821</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-[#006c49] inline-block" />
                <span className="text-xs text-[#006c49] font-semibold">Cleared</span>
                <span className="text-[#bccac0] text-xs">•</span>
                <span className="font-mono text-xs font-bold text-[#131b2e]">$0.00 Diff</span>
              </div>
            </div>
            <span className={`material-symbols-outlined ml-auto ${activeAccountTab === 'mercury' ? 'text-[#006c49]' : 'text-[#bccac0]'}`}>
              {activeAccountTab === 'mercury' ? 'radio_button_checked' : 'radio_button_unchecked'}
            </span>
          </button>

          {/* Tab 2: Chase Treasury (Cleared) */}
          <button
            onClick={() => setActiveAccountTab('chase')}
            className={`group flex items-center gap-3 p-3.5 rounded-2xl text-left shrink-0 transition-all border ${
              activeAccountTab === 'chase'
                ? 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-[#006948]/30 ring-1 ring-[#006948]'
                : 'bg-[#f2f3ff]/70 hover:bg-white border-[#eaedff]'
            }`}
            type="button"
          >
            <div className="w-10 h-10 rounded-full bg-[#eaedff] flex items-center justify-center text-[#3d4a42]">
              <span className="material-symbols-outlined text-xl">savings</span>
            </div>
            <div className="flex flex-col pr-3">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-[#131b2e]">Chase Treasury</span>
                <span className="font-mono text-[10px] text-[#3d4a42]">• 9012</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-[#006c49] inline-block" />
                <span className="text-xs text-[#006c49] font-semibold">Cleared</span>
                <span className="text-[#bccac0] text-xs">•</span>
                <span className="font-mono text-xs font-semibold text-[#131b2e]">$0.00 Diff</span>
              </div>
            </div>
            <span className={`material-symbols-outlined ml-auto ${activeAccountTab === 'chase' ? 'text-[#006c49]' : 'text-[#bccac0]'}`}>
              {activeAccountTab === 'chase' ? 'radio_button_checked' : 'radio_button_unchecked'}
            </span>
          </button>

          {/* Tab 3: Brex Corporate Card (Needs Review) */}
          <button
            onClick={() => setActiveAccountTab('brex')}
            className={`group flex items-center gap-3 p-3.5 rounded-2xl text-left shrink-0 transition-all border ${
              activeAccountTab === 'brex'
                ? 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-[#006948]/30 ring-1 ring-[#006948]'
                : 'bg-[#f2f3ff]/70 hover:bg-white border-[#eaedff]'
            }`}
            type="button"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              brexDiscrepancyResolved ? 'bg-[#6cf8bb]/40 text-[#006c49]' : 'bg-[#ffdad6]/60 text-[#ba1a1a]'
            }`}>
              <span className="material-symbols-outlined text-xl">credit_card</span>
            </div>
            <div className="flex flex-col pr-3">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-[#131b2e]">Brex Corporate Card</span>
                <span className="font-mono text-[10px] text-[#3d4a42]">• 1144</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`w-2 h-2 rounded-full inline-block ${
                  brexDiscrepancyResolved ? 'bg-[#006c49]' : 'bg-[#ba1a1a] animate-pulse'
                }`} />
                <span className={`text-xs font-semibold ${
                  brexDiscrepancyResolved ? 'text-[#006c49]' : 'text-[#ba1a1a]'
                }`}>
                  {brexDiscrepancyResolved ? 'Cleared' : 'Needs Review'}
                </span>
                <span className="text-[#bccac0] text-xs">•</span>
                <span className={`font-mono text-xs font-bold ${
                  brexDiscrepancyResolved ? 'text-[#131b2e]' : 'text-[#ba1a1a]'
                }`}>
                  {brexDiscrepancyResolved ? '$0.00 Diff' : '-$420.50 Diff'}
                </span>
              </div>
            </div>
            <span className={`material-symbols-outlined ml-auto ${activeAccountTab === 'brex' ? 'text-[#006c49]' : 'text-[#bccac0]'}`}>
              {activeAccountTab === 'brex' ? 'radio_button_checked' : 'radio_button_unchecked'}
            </span>
          </button>

          {/* Manage Accounts Micro Button */}
          <button
            className="flex items-center gap-1 px-4 py-3 rounded-2xl bg-[#f2f3ff] hover:bg-[#eaedff] text-[#3d4a42] text-xs shrink-0 transition-colors border border-[#eaedff]"
            type="button"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span>Connect Ledger Link</span>
          </button>
        </div>

        {/* Reconcile Workspace: Split Dual-Ledger Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* LEFT COLUMN: Cleared Deposits & Inflows */}
          <div className="flex flex-col rounded-2xl bg-white/90 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-[#eaedff] overflow-hidden">
            {/* Sub-Header with Totals and Auto-Reconcile Button */}
            <div className="p-5 bg-[#f2f3ff]/50 border-b border-[#eaedff] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#006c49]" />
                  <h2 className="text-base font-bold text-[#131b2e]">Cleared Deposits & Inflows</h2>
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-mono text-base font-bold text-[#006c49]">+$1,420,800.00</span>
                  <span className="text-xs text-[#3d4a42]">across 28 items verified</span>
                </div>
              </div>
              <button
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#6cf8bb] text-[#00714d] hover:bg-[#85f8c4] text-xs font-semibold transition-all shadow-sm"
                type="button"
              >
                <span className="material-symbols-outlined text-base">auto_fix_high</span>
                <span>1-Click Auto-Reconcile</span>
              </button>
            </div>

            {/* Inflows Filter Bar */}
            <div className="px-5 py-2.5 bg-[#f2f3ff]/20 border-b border-[#eaedff] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <input
                  checked={Object.values(inflowChecked).every(Boolean)}
                  onChange={() => {
                    const allChecked = Object.values(inflowChecked).every(Boolean);
                    setInflowChecked({
                      in1: !allChecked,
                      in2: !allChecked,
                      in3: !allChecked,
                      in4: !allChecked
                    });
                  }}
                  className="w-4 h-4 rounded accent-[#006948] cursor-pointer"
                  type="checkbox"
                />
                <span className="text-xs text-[#3d4a42] font-semibold uppercase tracking-wider">
                  Select All (28)
                </span>
              </div>
              <span className="font-mono text-xs text-[#006c49] font-medium">100% matched to Stripe & Plaid</span>
            </div>

            {/* Inflows Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f2f3ff]/30 text-[10px] text-[#3d4a42] uppercase tracking-wider border-b border-[#eaedff]">
                  <tr>
                    <th className="py-2.5 px-4 w-10" />
                    <th className="py-2.5 px-2">Date</th>
                    <th className="py-2.5 px-2">Origin / Payer</th>
                    <th className="py-2.5 px-2">Plaid Trace ID</th>
                    <th className="py-2.5 px-4 text-right">Amount</th>
                    <th className="py-2.5 px-2 text-center">Match</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eaedff]">
                  {/* Item 1 */}
                  <tr className="hover:bg-[#f2f3ff]/40 transition-colors">
                    <td className="py-3 px-4">
                      <input
                        checked={inflowChecked.in1}
                        onChange={() => toggleInflow('in1')}
                        className="w-4 h-4 rounded accent-[#006948] cursor-pointer"
                        type="checkbox"
                      />
                    </td>
                    <td className="py-3 px-2 font-mono text-xs text-[#3d4a42] whitespace-nowrap">10/30/24</td>
                    <td className="py-3 px-2">
                      <div className="flex flex-col">
                        <span className="font-semibold text-[#131b2e]">Stripe Payments Payout</span>
                        <span className="text-[11px] text-[#3d4a42]">Merchant Settlement • US/CA</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 font-mono text-[11px] text-[#3d4a42]">tr_plaid_99014a</td>
                    <td className="py-3 px-4 text-right font-mono text-xs font-bold text-[#006c49] whitespace-nowrap">
                      +$580,000.00
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#6cf8bb]/50 text-[#006c49] text-[10px] font-semibold">
                        <span className="material-symbols-outlined text-[12px]">verified</span> 100%
                      </span>
                    </td>
                  </tr>

                  {/* Item 2 */}
                  <tr className="hover:bg-[#f2f3ff]/40 transition-colors">
                    <td className="py-3 px-4">
                      <input
                        checked={inflowChecked.in2}
                        onChange={() => toggleInflow('in2')}
                        className="w-4 h-4 rounded accent-[#006948] cursor-pointer"
                        type="checkbox"
                      />
                    </td>
                    <td className="py-3 px-2 font-mono text-xs text-[#3d4a42] whitespace-nowrap">10/28/24</td>
                    <td className="py-3 px-2">
                      <div className="flex flex-col">
                        <span className="font-semibold text-[#131b2e]">Sequoia Seed Series Reserve</span>
                        <span className="text-[11px] text-[#3d4a42]">Treasury Wire Inflow</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 font-mono text-[11px] text-[#3d4a42]">tr_wire_883011</td>
                    <td className="py-3 px-4 text-right font-mono text-xs font-bold text-[#006c49] whitespace-nowrap">
                      +$500,000.00
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#6cf8bb]/50 text-[#006c49] text-[10px] font-semibold">
                        <span className="material-symbols-outlined text-[12px]">verified</span> 100%
                      </span>
                    </td>
                  </tr>

                  {/* Item 3 */}
                  <tr className="hover:bg-[#f2f3ff]/40 transition-colors">
                    <td className="py-3 px-4">
                      <input
                        checked={inflowChecked.in3}
                        onChange={() => toggleInflow('in3')}
                        className="w-4 h-4 rounded accent-[#006948] cursor-pointer"
                        type="checkbox"
                      />
                    </td>
                    <td className="py-3 px-2 font-mono text-xs text-[#3d4a42] whitespace-nowrap">10/24/24</td>
                    <td className="py-3 px-2">
                      <div className="flex flex-col">
                        <span className="font-semibold text-[#131b2e]">Salesforce Enterprise ARR</span>
                        <span className="text-[11px] text-[#3d4a42]">Invoice INV-2024-818</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 font-mono text-[11px] text-[#3d4a42]">tr_ach_440192</td>
                    <td className="py-3 px-4 text-right font-mono text-xs font-bold text-[#006c49] whitespace-nowrap">
                      +$240,000.00
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#6cf8bb]/50 text-[#006c49] text-[10px] font-semibold">
                        <span className="material-symbols-outlined text-[12px]">verified</span> 100%
                      </span>
                    </td>
                  </tr>

                  {/* Item 4 */}
                  <tr className="hover:bg-[#f2f3ff]/40 transition-colors">
                    <td className="py-3 px-4">
                      <input
                        checked={inflowChecked.in4}
                        onChange={() => toggleInflow('in4')}
                        className="w-4 h-4 rounded accent-[#006948] cursor-pointer"
                        type="checkbox"
                      />
                    </td>
                    <td className="py-3 px-2 font-mono text-xs text-[#3d4a42] whitespace-nowrap">10/18/24</td>
                    <td className="py-3 px-2">
                      <div className="flex flex-col">
                        <span className="font-semibold text-[#131b2e]">Mercury Treasury Yield Inflow</span>
                        <span className="text-[11px] text-[#3d4a42]">4.92% 30-Day T-Bill Reinvest</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 font-mono text-[11px] text-[#3d4a42]">tr_int_210940</td>
                    <td className="py-3 px-4 text-right font-mono text-xs font-bold text-[#006c49] whitespace-nowrap">
                      +$100,800.00
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#6cf8bb]/50 text-[#006c49] text-[10px] font-semibold">
                        <span className="material-symbols-outlined text-[12px]">verified</span> 100%
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Footnote count */}
            <div className="p-4 bg-[#f2f3ff]/30 border-t border-[#eaedff] text-center text-xs text-[#3d4a42]">
              + 24 additional verified deposits —{' '}
              <button className="text-[#006948] font-semibold hover:underline" type="button">
                Expand Full Inflow Ledger
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Cleared Checks, Debits & Outflows */}
          <div className="flex flex-col rounded-2xl bg-white/90 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-[#eaedff] overflow-hidden">
            {/* Sub-Header with Outflow Totals */}
            <div className="p-5 bg-[#f2f3ff]/50 border-b border-[#eaedff] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#6d7a72]" />
                  <h2 className="text-base font-bold text-[#131b2e]">Cleared Checks & Outflows</h2>
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-mono text-base font-bold text-[#131b2e]">-$840,250.00</span>
                  <span className="text-xs text-[#3d4a42]">across 64 items cleared</span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-xs text-[#006c49] bg-[#6cf8bb]/30 px-3 py-1 rounded-full border border-[#6cf8bb]/40">
                <span className="material-symbols-outlined text-sm">done_all</span> All cleared in transit
              </span>
            </div>

            {/* Outflows Filter Bar */}
            <div className="px-5 py-2.5 bg-[#f2f3ff]/20 border-b border-[#eaedff] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <input
                  checked={Object.values(outflowChecked).every(Boolean)}
                  onChange={() => {
                    const allChecked = Object.values(outflowChecked).every(Boolean);
                    setOutflowChecked({
                      out1: !allChecked,
                      out2: !allChecked,
                      out3: !allChecked,
                      out4: !allChecked
                    });
                  }}
                  className="w-4 h-4 rounded accent-[#006948] cursor-pointer"
                  type="checkbox"
                />
                <span className="text-xs text-[#3d4a42] font-semibold uppercase tracking-wider">
                  Select All (64)
                </span>
              </div>
              <span className="font-mono text-xs text-[#3d4a42]">0 Uncleared Pending</span>
            </div>

            {/* Outflows Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f2f3ff]/30 text-[10px] text-[#3d4a42] uppercase tracking-wider border-b border-[#eaedff]">
                  <tr>
                    <th className="py-2.5 px-4 w-10" />
                    <th className="py-2.5 px-2">Date</th>
                    <th className="py-2.5 px-2">Vendor / Description</th>
                    <th className="py-2.5 px-2">GL Code</th>
                    <th className="py-2.5 px-2 text-center">Status</th>
                    <th className="py-2.5 px-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eaedff]">
                  {/* Item 1 */}
                  <tr className="hover:bg-[#f2f3ff]/40 transition-colors">
                    <td className="py-3 px-4">
                      <input
                        checked={outflowChecked.out1}
                        onChange={() => toggleOutflow('out1')}
                        className="w-4 h-4 rounded accent-[#006948] cursor-pointer"
                        type="checkbox"
                      />
                    </td>
                    <td className="py-3 px-2 font-mono text-xs text-[#3d4a42] whitespace-nowrap">10/31/24</td>
                    <td className="py-3 px-2">
                      <div className="flex flex-col">
                        <span className="font-semibold text-[#131b2e]">Rippling PEO Payroll</span>
                        <span className="text-[11px] text-[#3d4a42]">Semi-Monthly Salaried Staff</span>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span className="font-mono text-[11px] bg-[#eaedff] px-2 py-0.5 rounded text-[#3d4a42]">
                        6100-Wages
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-[#eaedff] text-[10px] text-[#3d4a42] font-semibold">
                        Cleared
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs font-semibold text-[#131b2e] whitespace-nowrap">
                      -$425,000.00
                    </td>
                  </tr>

                  {/* Item 2 */}
                  <tr className="hover:bg-[#f2f3ff]/40 transition-colors">
                    <td className="py-3 px-4">
                      <input
                        checked={outflowChecked.out2}
                        onChange={() => toggleOutflow('out2')}
                        className="w-4 h-4 rounded accent-[#006948] cursor-pointer"
                        type="checkbox"
                      />
                    </td>
                    <td className="py-3 px-2 font-mono text-xs text-[#3d4a42] whitespace-nowrap">10/27/24</td>
                    <td className="py-3 px-2">
                      <div className="flex flex-col">
                        <span className="font-semibold text-[#131b2e]">Amazon Web Services</span>
                        <span className="text-[11px] text-[#3d4a42]">GPU Cluster Production Invoice</span>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span className="font-mono text-[11px] bg-[#eaedff] px-2 py-0.5 rounded text-[#3d4a42]">
                        5100-Cloud
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-[#eaedff] text-[10px] text-[#3d4a42] font-semibold">
                        Cleared
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs font-semibold text-[#131b2e] whitespace-nowrap">
                      -$182,450.00
                    </td>
                  </tr>

                  {/* Item 3 */}
                  <tr className="hover:bg-[#f2f3ff]/40 transition-colors">
                    <td className="py-3 px-4">
                      <input
                        checked={outflowChecked.out3}
                        onChange={() => toggleOutflow('out3')}
                        className="w-4 h-4 rounded accent-[#006948] cursor-pointer"
                        type="checkbox"
                      />
                    </td>
                    <td className="py-3 px-2 font-mono text-xs text-[#3d4a42] whitespace-nowrap">10/22/24</td>
                    <td className="py-3 px-2">
                      <div className="flex flex-col">
                        <span className="font-semibold text-[#131b2e]">WeWork Corp Lease</span>
                        <span className="text-[11px] text-[#3d4a42]">HQ Suite 1200 SF Monthly</span>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span className="font-mono text-[11px] bg-[#eaedff] px-2 py-0.5 rounded text-[#3d4a42]">
                        6200-Rent
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-[#eaedff] text-[10px] text-[#3d4a42] font-semibold">
                        Cleared
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs font-semibold text-[#131b2e] whitespace-nowrap">
                      -$48,500.00
                    </td>
                  </tr>

                  {/* Item 4 */}
                  <tr className="hover:bg-[#f2f3ff]/40 transition-colors">
                    <td className="py-3 px-4">
                      <input
                        checked={outflowChecked.out4}
                        onChange={() => toggleOutflow('out4')}
                        className="w-4 h-4 rounded accent-[#006948] cursor-pointer"
                        type="checkbox"
                      />
                    </td>
                    <td className="py-3 px-2 font-mono text-xs text-[#3d4a42] whitespace-nowrap">10/15/24</td>
                    <td className="py-3 px-2">
                      <div className="flex flex-col">
                        <span className="font-semibold text-[#131b2e]">Gunderson Dettmer LLP</span>
                        <span className="text-[11px] text-[#3d4a42]">Retainer & IP Patent Filing</span>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span className="font-mono text-[11px] bg-[#eaedff] px-2 py-0.5 rounded text-[#3d4a42]">
                        6300-Legal
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-[#eaedff] text-[10px] text-[#3d4a42] font-semibold">
                        Cleared
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs font-semibold text-[#131b2e] whitespace-nowrap">
                      -$34,300.00
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Footnote count */}
            <div className="p-4 bg-[#f2f3ff]/30 border-t border-[#eaedff] text-center text-xs text-[#3d4a42]">
              + 60 additional cleared debit entries —{' '}
              <button className="text-[#006948] font-semibold hover:underline" type="button">
                Expand Full Outflow Ledger
              </button>
            </div>
          </div>
        </div>

        {/* Discrepancy Resolver Preview Widget with Gemini Intelligence */}
        <div className="relative rounded-2xl bg-white/80 backdrop-blur-xl p-6 shadow-[0_10px_35px_rgba(0,0,0,0.03)] border border-[#eaedff] flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#6cf8bb]/50 flex items-center justify-center text-[#00714d]">
                <span className="material-symbols-outlined text-lg">psychology</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-[#131b2e]">
                  Autonomous Discrepancy Radar & Gemini Suggestions
                </h3>
                <span className="text-xs text-[#3d4a42]">
                  {brexDiscrepancyResolved
                    ? 'All connected ledgers 100% reconciled and audit-locked.'
                    : 'Mercury Operating Ledger is 100% resolved. 1 cross-ledger discrepancy detected in auxiliary cards.'}
                </span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eaedff] text-[#131b2e] font-mono text-xs">
              <span className="material-symbols-outlined text-[#006c49] text-sm">check_circle</span>
              Audit Proof Status: Uncompromised
            </span>
          </div>

          {/* Discrepancy Card Preview for Brex Card Discrepancy */}
          {!brexDiscrepancyResolved ? (
            <div className="rounded-xl bg-[#f2f3ff]/70 border border-[#eaedff] p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-base">warning</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-sm font-bold text-[#131b2e]">
                      Brex Card #1144: Anthropic API Micro-Charge
                    </span>
                    <span className="font-mono text-xs text-[#ba1a1a] font-bold">-$420.50</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#e2e7ff] text-[#3d4a42] text-[10px]">
                      Plaid Sync: 10/31 11:58 PM
                    </span>
                  </div>
                  <p className="text-xs text-[#3d4a42] mt-1">
                    <strong className="text-[#006c49] font-semibold">Gemini Suggestion:</strong> The transaction posted at month-end boundary. Match found against pending expense receipt uploaded by VP Eng (Sarah Jenkins). Classify to{' '}
                    <code className="bg-[#dae2fd] px-1 rounded text-[#131b2e] font-mono">5200 - AI Infrastructure</code> to clear the remaining variance.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                <button
                  onClick={handleAcceptDiscrepancyMatch}
                  className="px-4 py-1.5 rounded-full bg-[#006c49] text-white text-xs font-semibold hover:bg-[#00855d] transition-all shadow-sm"
                  type="button"
                >
                  Accept Match & Zero Variance
                </button>
                <button
                  className="px-4 py-1.5 rounded-full bg-[#eaedff] hover:bg-[#dae2fd] text-[#131b2e] text-xs font-semibold transition-all"
                  type="button"
                >
                  Inspect Document
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-[#6cf8bb]/20 border border-[#6cf8bb]/40 p-4 flex items-center gap-3 text-xs text-[#005137]">
              <span className="material-symbols-outlined text-base">task_alt</span>
              <span>
                <strong>Discrepancy Resolved:</strong> Brex Card #1144 classified to GL #5200 AI Infrastructure. Net variance has converged to $0.0000.
              </span>
            </div>
          )}
        </div>

        {/* Editorial Proof Signature Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-2 text-[#3d4a42] text-xs border-t border-[#eaedff]">
          <div className="flex items-center gap-2 font-mono">
            <span className="material-symbols-outlined text-[#006c49] text-base">enhanced_encryption</span>
            <span>Cryptographically verified on immutable Double-Entry Journal</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span>Prepared by: <strong className="text-[#131b2e]">Sarah Jenkins (Controller)</strong></span>
            <span>Attestation: <strong className="text-[#131b2e]">AICPA SOC-1 Type II Compliant</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
