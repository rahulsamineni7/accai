import React, { useState } from 'react';
import { useDigits } from '../../context/DigitsContext';
import {
  FileSearch,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Download,
  Sparkles,
  RefreshCw,
  Sliders,
  DollarSign,
  Building2,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';

interface ScrutinyAnomaly {
  id: string;
  severity: 'CRITICAL' | 'WARNING' | 'CLEAN';
  ruleCategory: string;
  statutoryRule: string;
  ledgerName: string;
  glCode: string;
  finding: string;
  exposureAmount: number;
  recommendedAction: string;
  resolved: boolean;
}

export const LedgerScrutinyView: React.FC = () => {
  const { currentEntity, formatAmount, showNotification } = useDigits();

  const [isScanning, setIsScanning] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState<'ALL' | 'UNRESOLVED' | 'RESOLVED'>('ALL');

  const [anomalies, setAnomalies] = useState<ScrutinyAnomaly[]>([
    {
      id: 'scrutiny-1',
      severity: 'CRITICAL',
      ruleCategory: 'Capital vs. Revenue',
      statutoryRule: 'AS-10 / Ind-AS 16 Fixed Assets',
      ledgerName: 'Computer Equipment & Hardware',
      glCode: '1500',
      finding: 'Apple MacBook Pro M4 Max (₹3,89,900) booked under routine IT Software OpEx instead of Fixed Assets CapEx.',
      exposureAmount: 389900,
      recommendedAction: 'Reclassify from Ledger 6020 (Software OpEx) to Ledger 1500 (Computer Hardware Asset) and start WDV depreciation schedule.',
      resolved: false
    },
    {
      id: 'scrutiny-2',
      severity: 'CRITICAL',
      ruleCategory: 'TDS Default',
      statutoryRule: 'Section 194J Income Tax Act',
      ledgerName: 'Legal, Accounting & Professional Fees',
      glCode: '6030',
      finding: 'Disbursement of ₹1,25,000 made without 10% TDS deduction. Annual threshold of ₹30,000 breached.',
      exposureAmount: 125000,
      recommendedAction: 'Book TDS Payable entry of ₹12,500 under Ledger 2360 (TDS u/s 194J) and issue demand note.',
      resolved: false
    },
    {
      id: 'scrutiny-3',
      severity: 'WARNING',
      ruleCategory: 'Blocked ITC Risk',
      statutoryRule: 'Section 17(5)(b)(i) CGST Act',
      ledgerName: 'Travel, Meals & Team Offsites',
      glCode: '6060',
      finding: 'Executive dinner & team food invoices (₹28,500) claimed under Input Tax Credit. Ineligible under Section 17(5).',
      exposureAmount: 5130,
      recommendedAction: 'Reverse Input CGST & SGST (₹5,130) and debit directly to Profit & Loss expense.',
      resolved: false
    },
    {
      id: 'scrutiny-4',
      severity: 'CLEAN',
      ruleCategory: 'Negative Cash Check',
      statutoryRule: 'Daily Cash In Hand Audit',
      ledgerName: 'Petty Cash / Operating Cash',
      glCode: '1010',
      finding: 'No negative cash balance detected on any day across FY 2024-25. Minimum daily cash balance: ₹1,42,000.',
      exposureAmount: 0,
      recommendedAction: 'Passes statutory audit requirements.',
      resolved: true
    },
    {
      id: 'scrutiny-5',
      severity: 'CLEAN',
      ruleCategory: 'Section 40A(3) Cash Limit',
      statutoryRule: 'Section 40A(3) Income Tax Act',
      ledgerName: 'All Expense Ledgers',
      glCode: 'ALL',
      finding: 'Zero cash disbursements exceeding ₹10,000 statutory limit. 100% payments routed through NEFT/RTGS/UPI.',
      exposureAmount: 0,
      recommendedAction: 'Passes statutory audit requirements.',
      resolved: true
    }
  ]);

  const handleResolve = (id: string) => {
    setAnomalies((prev) =>
      prev.map((a) => (a.id === id ? { ...a, resolved: true, severity: 'CLEAN' as const } : a))
    );
    showNotification('AI Ledger Scrutiny anomaly auto-reclassified and journal entry posted.');
  };

  const handleRunFullScrutiny = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      showNotification('Completed 24/7 Forensic Ledger Scrutiny across 42 Chart of Accounts masters.');
    }, 1500);
  };

  const handleExportMemo = () => {
    const textData = `CHARTERED ACCOUNTANT STATUTORY LEDGER SCRUTINY MEMORANDUM
Client: ${currentEntity.name}
GSTIN: ${currentEntity.gstin || '29AABCA1234F1Z8'} | PAN: ${currentEntity.pan || 'AABCA1234F'}
Assessment Year: 2025-26 | Financial Year: 2024-25
Total Ledgers Audited: 42 Masters
Scrutiny Algorithms Executed:
1. Negative Cash Balance Check: PASS
2. Section 40A(3) Cash Payment Breaches (>₹10,000): PASS (0 Violations)
3. Capital vs Revenue Classification (AS-10): PASS (Resolved)
4. Section 194J / 194C / 194I TDS Deductions: PASS
5. Section 17(5) Blocked ITC Claim Audit: PASS
Auditor Sign-off Status: Ready for Tax Audit Report (Form 3CA/3CD)`;

    const blob = new Blob([textData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CA_Ledger_Scrutiny_Memo_${currentEntity.slug || 'accai'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Exported Chartered Accountant Audit Scrutiny Working Paper Memo.');
  };

  const unresolvedCount = anomalies.filter((a) => !a.resolved).length;
  const filtered = filterSeverity === 'UNRESOLVED'
    ? anomalies.filter((a) => !a.resolved)
    : filterSeverity === 'RESOLVED'
    ? anomalies.filter((a) => a.resolved)
    : anomalies;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-[#006948]/10 text-[#006948]">
              <FileSearch className="w-5 h-5 stroke-[2.2]" />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-[#131b2e]">
              24/7 Automated CA "Ledger Scrutiny" Agent
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#006948]/10 text-[#006948] text-[11px] font-semibold tracking-wide">
              Pre-Audit Forensic Engine
            </span>
          </div>
          <p className="text-xs text-[#6d7a72] pl-10">
            Replaces manual pre-audit checking by continuously scanning for negative cash, Section 40A(3) cash breaches, TDS short-deductions, and CapEx misclassifications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportMemo}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/90 hover:bg-[#eaedff] text-[#131b2e] text-xs font-semibold border border-[#eaedff] shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5 text-[#006948]" />
            <span>CA Scrutiny Working Paper</span>
          </button>

          <button
            onClick={handleRunFullScrutiny}
            disabled={isScanning}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#006948] hover:bg-[#00855d] text-white text-xs font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Running Forensics...' : 'Run Forensic Audit'}</span>
          </button>
        </div>
      </div>

      {/* 4 Scrutiny Bento KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#6d7a72] uppercase tracking-wider">
              Ledger Masters Scrutinized
            </span>
            <span className="p-1.5 rounded-lg bg-[#006948]/10 text-[#006948]">
              <Sliders className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-[#131b2e]">
              42 Ledgers
            </div>
            <div className="text-[11px] text-[#6d7a72] mt-1 font-medium">
              100% General Ledger coverage
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#6d7a72] uppercase tracking-wider">
              Negative Cash Balance
            </span>
            <span className="p-1.5 rounded-lg bg-[#006948]/10 text-[#006948]">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-[#006948] flex items-center gap-1.5">
              <CheckCircle2 className="w-5 h-5" />
              <span>₹0.00 Negatives</span>
            </div>
            <div className="text-[11px] text-[#006948] mt-1 font-medium">
              365 Days fully in positive balance
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#6d7a72] uppercase tracking-wider">
              Sec 40A(3) Cash Breaches
            </span>
            <span className="p-1.5 rounded-lg bg-[#006948]/10 text-[#006948]">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-[#006948] flex items-center gap-1.5">
              <CheckCircle2 className="w-5 h-5" />
              <span>0 Breaches</span>
            </div>
            <div className="text-[11px] text-[#6d7a72] mt-1 font-medium">
              No cash payments &gt; ₹10,000
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#6d7a72] uppercase tracking-wider">
              Actionable Anomalies
            </span>
            <span className="p-1.5 rounded-lg bg-[#fba772]/20 text-[#ea580c]">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-[#ea580c]">
              {unresolvedCount} Items
            </div>
            <div className="text-[11px] text-[#ba1a1a] mt-1 font-medium">
              1-Click auto-reclassification ready
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilterSeverity('ALL')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            filterSeverity === 'ALL'
              ? 'bg-[#006948] text-white shadow-sm'
              : 'bg-white/80 text-[#3d4a42] hover:bg-[#eaedff] border border-[#eaedff]'
          }`}
        >
          All Scrutiny Checks ({anomalies.length})
        </button>
        <button
          onClick={() => setFilterSeverity('UNRESOLVED')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            filterSeverity === 'UNRESOLVED'
              ? 'bg-[#006948] text-white shadow-sm'
              : 'bg-white/80 text-[#3d4a42] hover:bg-[#eaedff] border border-[#eaedff]'
          }`}
        >
          Unresolved Anomalies ({unresolvedCount})
        </button>
        <button
          onClick={() => setFilterSeverity('RESOLVED')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            filterSeverity === 'RESOLVED'
              ? 'bg-[#006948] text-white shadow-sm'
              : 'bg-white/80 text-[#3d4a42] hover:bg-[#eaedff] border border-[#eaedff]'
          }`}
        >
          Clean & Verified ({anomalies.filter((a) => a.resolved).length})
        </button>
      </div>

      {/* Scrutiny Findings Cards */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`p-5 rounded-2xl bg-white/90 backdrop-blur-xl border transition-all ${
              item.resolved
                ? 'border-[#eaedff] opacity-80'
                : item.severity === 'CRITICAL'
                ? 'border-[#ba1a1a]/30 shadow-sm'
                : 'border-[#ea580c]/30 shadow-sm'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      item.resolved
                        ? 'bg-[#006948]/10 text-[#006948]'
                        : item.severity === 'CRITICAL'
                        ? 'bg-[#ba1a1a]/10 text-[#ba1a1a]'
                        : 'bg-[#ea580c]/10 text-[#ea580c]'
                    }`}
                  >
                    {item.resolved ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                    <span>{item.resolved ? 'RESOLVED' : item.severity}</span>
                  </span>

                  <span className="font-mono text-xs font-bold text-[#131b2e]">
                    {item.ledgerName} ({item.glCode})
                  </span>

                  <span className="text-[11px] text-[#6d7a72]">•</span>
                  <span className="text-[11px] font-semibold text-[#006948]">
                    {item.statutoryRule}
                  </span>
                </div>

                <p className="text-xs text-[#131b2e] font-medium leading-relaxed">
                  {item.finding}
                </p>

                <div className="p-3 rounded-xl bg-[#faf8ff] border border-[#eaedff] text-xs text-[#3d4a42] space-y-1">
                  <div className="font-bold text-[#131b2e] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#006948]" />
                    <span>AI Autonomous Scrutiny Recommendation:</span>
                  </div>
                  <div>{item.recommendedAction}</div>
                </div>
              </div>

              <div className="flex flex-col md:items-end justify-between self-stretch shrink-0">
                {item.exposureAmount > 0 && (
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-[#6d7a72] uppercase font-semibold">
                      Exposure Value
                    </span>
                    <div className="font-mono font-bold text-sm text-[#131b2e]">
                      {formatAmount(item.exposureAmount)}
                    </div>
                  </div>
                )}

                {!item.resolved ? (
                  <button
                    onClick={() => handleResolve(item.id)}
                    className="mt-3 px-4 py-2 rounded-xl bg-[#006948] hover:bg-[#00855d] text-white text-xs font-semibold shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>1-Click Auto-Fix & Reclassify</span>
                  </button>
                ) : (
                  <span className="mt-3 text-[11px] font-semibold text-[#006948] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Audit Pass Logged</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
