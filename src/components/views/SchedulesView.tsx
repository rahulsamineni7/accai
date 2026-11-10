import React, { useState } from 'react';
import { useDigits } from '../../context/DigitsContext';
import {
  Calendar,
  Layers,
  Sparkles,
  TrendingDown,
  Building2,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Plus,
  Play,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Cpu
} from 'lucide-react';

interface AssetSchedule {
  id: string;
  name: string;
  assetClass: 'Computer Servers & GPU' | 'Office Hardware & Laptops' | 'Plant & Machinery' | 'Furniture & Fixtures';
  acquisitionDate: string;
  originalCost: number;
  depMethod: 'WDV (Written Down Value)' | 'SLM (Straight Line Method)';
  itActRate: number; // e.g. 40%
  coActUsefulLifeYears: number; // e.g. 3 years
  daysPutToUse: number;
  halfRateApplicable: boolean; // <180 days
  accumulatedDepreciation: number;
  netBookValue: number;
  monthlyDepJournal: number;
  status: 'Active Amortization' | 'Fully Depreciated';
}

interface PrepaidSchedule {
  id: string;
  vendor: string;
  description: string;
  startDate: string;
  endDate: string;
  totalPrepayment: number;
  monthlyAmortization: number;
  recognizedToDate: number;
  unrecognizedBalance: number;
  targetExpenseGL: string;
  status: 'Active Amortization' | 'Matured';
}

export const SchedulesView: React.FC = () => {
  const { formatAmount, showNotification, addTransaction } = useDigits();
  const [tab, setTab] = useState<'fixed-assets' | 'prepaids'>('fixed-assets');

  const [assets, setAssets] = useState<AssetSchedule[]>([
    {
      id: 'ast-01',
      name: 'NVIDIA H100 8-GPU Pod Cluster (Node TX-2)',
      assetClass: 'Computer Servers & GPU',
      acquisitionDate: '2026-04-15',
      originalCost: 4850000,
      depMethod: 'WDV (Written Down Value)',
      itActRate: 40,
      coActUsefulLifeYears: 3,
      daysPutToUse: 200,
      halfRateApplicable: false,
      accumulatedDepreciation: 1131666,
      netBookValue: 3718334,
      monthlyDepJournal: 134722,
      status: 'Active Amortization'
    },
    {
      id: 'ast-02',
      name: 'MacBook Pro M3 Max Engineering Fleet (12 Units)',
      assetClass: 'Office Hardware & Laptops',
      acquisitionDate: '2026-06-01',
      originalCost: 2880000,
      depMethod: 'SLM (Straight Line Method)',
      itActRate: 40,
      coActUsefulLifeYears: 3,
      daysPutToUse: 152,
      halfRateApplicable: true,
      accumulatedDepreciation: 400000,
      netBookValue: 2480000,
      monthlyDepJournal: 80000,
      status: 'Active Amortization'
    },
    {
      id: 'ast-03',
      name: 'Dell PowerEdge R760 Rackmount Backup Node',
      assetClass: 'Computer Servers & GPU',
      acquisitionDate: '2026-05-10',
      originalCost: 920000,
      depMethod: 'WDV (Written Down Value)',
      itActRate: 40,
      coActUsefulLifeYears: 3,
      daysPutToUse: 174,
      halfRateApplicable: true,
      accumulatedDepreciation: 153333,
      netBookValue: 766667,
      monthlyDepJournal: 25555,
      status: 'Active Amortization'
    }
  ]);

  const [prepaids, setPrepaids] = useState<PrepaidSchedule[]>([
    {
      id: 'prep-01',
      vendor: 'Amazon Web Services (AWS)',
      description: 'Annual Reserved GPU Instances Tier 1 Commitment',
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      totalPrepayment: 1200000,
      monthlyAmortization: 100000,
      recognizedToDate: 900000,
      unrecognizedBalance: 300000,
      targetExpenseGL: '#5010 Direct Cloud Inference Compute',
      status: 'Active Amortization'
    },
    {
      id: 'prep-02',
      vendor: 'GitHub Enterprise + Copilot Business',
      description: 'Annual 50-Seat Developer License Bundle',
      startDate: '2026-04-01',
      endDate: '2027-03-31',
      totalPrepayment: 360000,
      monthlyAmortization: 30000,
      recognizedToDate: 180000,
      unrecognizedBalance: 180000,
      targetExpenseGL: '#6020 Software & SaaS Subscriptions',
      status: 'Active Amortization'
    },
    {
      id: 'prep-03',
      vendor: 'HDFC ERGO General Insurance',
      description: 'Corporate Directors & Officers (D&O) Liability Cover',
      startDate: '2026-07-01',
      endDate: '2027-06-30',
      totalPrepayment: 480000,
      monthlyAmortization: 40000,
      recognizedToDate: 120000,
      unrecognizedBalance: 360000,
      targetExpenseGL: '#6050 Legal & Corporate Governance',
      status: 'Active Amortization'
    }
  ]);

  const totalOriginalCost = assets.reduce((s, a) => s + a.originalCost, 0);
  const totalAccumulatedDep = assets.reduce((s, a) => s + a.accumulatedDepreciation, 0);
  const totalNetBookValue = assets.reduce((s, a) => s + a.netBookValue, 0);
  const totalMonthlyDep = assets.reduce((s, a) => s + a.monthlyDepJournal, 0);

  const totalPrepaidPool = prepaids.reduce((s, p) => s + p.totalPrepayment, 0);
  const totalUnrecognizedPrepaid = prepaids.reduce((s, p) => s + p.unrecognizedBalance, 0);
  const totalMonthlyAmort = prepaids.reduce((s, p) => s + p.monthlyAmortization, 0);

  const handlePostMonthlyDepreciation = () => {
    addTransaction({
      date: new Date().toISOString().substring(0, 10),
      merchant: 'Autonomous Depreciation Scheduler',
      description: `Schedule II / Section 32 Monthly Depreciation for ${assets.length} Fixed Assets`,
      amount: -totalMonthlyDep,
      category: 'Depreciation & Amortization',
      glAccountCode: '6080',
      account: 'Accumulated Depreciation (#1510)',
      status: 'Categorized',
      aiConfidence: 100
    });
    showNotification(`Generated monthly journal entry: Dr. Depreciation Expense A/c (₹${totalMonthlyDep.toLocaleString('en-IN')}) / Cr. Accumulated Dep A/c`);
  };

  const handlePostMonthlyAmortization = () => {
    addTransaction({
      date: new Date().toISOString().substring(0, 10),
      merchant: 'Autonomous Prepaid Amortizer',
      description: `Monthly Prepaid Expense Recognition for ${prepaids.length} contracts`,
      amount: -totalMonthlyAmort,
      category: 'Software, Tooling & SaaS Subscriptions',
      glAccountCode: '6020',
      account: 'Prepaid Expenses (#1300)',
      status: 'Categorized',
      aiConfidence: 100
    });
    showNotification(`Generated monthly journal entry: Dr. Operating Expenses (₹${totalMonthlyAmort.toLocaleString('en-IN')}) / Cr. Prepaid Expenses A/c`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#eaedff] pb-4">
        <div>
          <div className="text-xs font-semibold text-[#006948] mb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#006c49] shadow-[0_0_8px_#6cf8bb] animate-pulse" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider">
              AUTONOMOUS ACCRUALS & ASSET SCHEDULES
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#131b2e] tracking-tight">
            Depreciation & Prepaid Amortization Engine
          </h1>
          <div className="text-xs text-[#3d4a42] mt-0.5">
            Automatically detects &gt;₹25,000 capital assets and annual prepaid contracts. Computes Companies Act Schedule II &amp; Income-tax Act Section 32 WDV/SLM depreciation with half-rate rules.
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center space-x-2">
          <div className="p-1 rounded-full bg-[#f2f3ff] border border-[#eaedff] flex items-center space-x-1">
            <button
              onClick={() => setTab('fixed-assets')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                tab === 'fixed-assets'
                  ? 'bg-[#006948] text-white shadow-sm'
                  : 'text-[#3d4a42] hover:text-[#131b2e]'
              }`}
            >
              Fixed Assets (WDV/SLM) ({assets.length})
            </button>
            <button
              onClick={() => setTab('prepaids')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                tab === 'prepaids'
                  ? 'bg-[#006948] text-white shadow-sm'
                  : 'text-[#3d4a42] hover:text-[#131b2e]'
              }`}
            >
              Prepaid Amortization ({prepaids.length})
            </button>
          </div>
        </div>
      </div>

      {/* Bento Grid Metrics */}
      {tab === 'fixed-assets' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm">
            <span className="text-[11px] text-[#3d4a42] uppercase tracking-wider font-semibold block">Total Capitalized Cost</span>
            <div className="text-2xl font-bold font-mono text-[#131b2e] mt-1">{formatAmount(totalOriginalCost)}</div>
            <span className="text-[11px] text-[#006c49] font-medium mt-1 block">3 Active Capital Assets</span>
          </div>
          <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm">
            <span className="text-[11px] text-[#3d4a42] uppercase tracking-wider font-semibold block">Accumulated Depreciation</span>
            <div className="text-2xl font-bold font-mono text-[#ba1a1a] mt-1">-{formatAmount(totalAccumulatedDep)}</div>
            <span className="text-[11px] text-[#3d4a42] font-mono mt-1 block">Income-tax Block Rates</span>
          </div>
          <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm">
            <span className="text-[11px] text-[#3d4a42] uppercase tracking-wider font-semibold block">Net Book Value (NBV)</span>
            <div className="text-2xl font-bold font-mono text-[#006c49] mt-1">{formatAmount(totalNetBookValue)}</div>
            <span className="text-[11px] text-[#006c49] font-medium mt-1 block">Schedule III Balance Sheet Match</span>
          </div>
          <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[11px] text-[#3d4a42] uppercase tracking-wider font-semibold block">Monthly Depreciation Outflow</span>
              <div className="text-xl font-bold font-mono text-[#131b2e] mt-1">{formatAmount(totalMonthlyDep)}/mo</div>
            </div>
            <button
              onClick={handlePostMonthlyDepreciation}
              className="mt-2 w-full py-1.5 rounded-full bg-[#006948] hover:bg-[#00855d] text-white text-[11px] font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Post Oct Journal</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm">
            <span className="text-[11px] text-[#3d4a42] uppercase tracking-wider font-semibold block">Total Prepaid Pool</span>
            <div className="text-2xl font-bold font-mono text-[#131b2e] mt-1">{formatAmount(totalPrepaidPool)}</div>
            <span className="text-[11px] text-[#006c49] font-medium mt-1 block">SaaS, Cloud & Insurance</span>
          </div>
          <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm">
            <span className="text-[11px] text-[#3d4a42] uppercase tracking-wider font-semibold block">Unrecognized Prepaid Balance</span>
            <div className="text-2xl font-bold font-mono text-[#006948] mt-1">{formatAmount(totalUnrecognizedPrepaid)}</div>
            <span className="text-[11px] text-[#3d4a42] font-mono mt-1 block">Asset GL #1300</span>
          </div>
          <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm">
            <span className="text-[11px] text-[#3d4a42] uppercase tracking-wider font-semibold block">Recognized to Date (P&L)</span>
            <div className="text-2xl font-bold font-mono text-[#131b2e] mt-1">{formatAmount(totalPrepaidPool - totalUnrecognizedPrepaid)}</div>
            <span className="text-[11px] text-[#006c49] font-medium mt-1 block">Accrual Match</span>
          </div>
          <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[11px] text-[#3d4a42] uppercase tracking-wider font-semibold block">Monthly Amortization</span>
              <div className="text-xl font-bold font-mono text-[#131b2e] mt-1">{formatAmount(totalMonthlyAmort)}/mo</div>
            </div>
            <button
              onClick={handlePostMonthlyAmortization}
              className="mt-2 w-full py-1.5 rounded-full bg-[#006948] hover:bg-[#00855d] text-white text-[11px] font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Post Oct Amortization</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Table View */}
      {tab === 'fixed-assets' ? (
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden shadow-sm border border-[#eaedff]">
          <div className="p-5 border-b border-[#eaedff] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#006948]" />
              <div>
                <h3 className="text-sm font-bold text-[#131b2e]">Fixed Asset Register & Depreciation Schedule</h3>
                <p className="text-[11px] text-[#3d4a42]">Section 32 Income-tax Act WDV & Companies Act 2013 Useful Life</p>
              </div>
            </div>
            <button
              onClick={() => showNotification('Exported Fixed Asset Register (Schedule II Form 3CD) to Excel')}
              className="px-4 py-1.5 rounded-full bg-[#f2f3ff] hover:bg-[#eaedff] text-xs font-semibold text-[#131b2e] border border-[#eaedff] transition-all flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#006c49]" />
              <span>Export Form 3CD Schedule</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="bg-[#f2f3ff]/70 text-[#3d4a42] text-[10px] uppercase tracking-wider border-b border-[#eaedff]">
                  <th className="py-3 px-5 font-sans font-semibold">Asset Name & Classification</th>
                  <th className="py-3 px-3">Acquired</th>
                  <th className="py-3 px-3 text-right">Original Cost</th>
                  <th className="py-3 px-3 text-center">Tax Act Rate</th>
                  <th className="py-3 px-3 text-center">Days Put to Use</th>
                  <th className="py-3 px-3 text-right">Accumulated Dep</th>
                  <th className="py-3 px-3 text-right">Net Book Value</th>
                  <th className="py-3 px-5 text-right font-sans font-semibold">Monthly Journal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eaedff]">
                {assets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-[#f2f3ff]/40 transition-colors">
                    <td className="py-3.5 px-5 font-sans">
                      <div className="font-bold text-[#131b2e]">{asset.name}</div>
                      <div className="text-[10px] text-[#3d4a42]">{asset.assetClass} · {asset.depMethod}</div>
                    </td>
                    <td className="py-3.5 px-3 text-[#3d4a42]">{asset.acquisitionDate}</td>
                    <td className="py-3.5 px-3 text-right font-bold text-[#131b2e]">{formatAmount(asset.originalCost)}</td>
                    <td className="py-3.5 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-[#eaedff] text-[#006948] font-bold text-[10px]">
                        {asset.itActRate}%
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${asset.halfRateApplicable ? 'bg-[#fff0c2] text-[#8c6b00]' : 'bg-[#6cf8bb]/40 text-[#00714d]'}`}>
                        {asset.daysPutToUse}d {asset.halfRateApplicable ? '(Half-Rate)' : '(Full Year)'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right text-[#ba1a1a]">-{formatAmount(asset.accumulatedDepreciation)}</td>
                    <td className="py-3.5 px-3 text-right font-bold text-[#006c49]">{formatAmount(asset.netBookValue)}</td>
                    <td className="py-3.5 px-5 text-right font-bold text-[#131b2e] font-mono">
                      {formatAmount(asset.monthlyDepJournal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden shadow-sm border border-[#eaedff]">
          <div className="p-5 border-b border-[#eaedff] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#006948]" />
              <div>
                <h3 className="text-sm font-bold text-[#131b2e]">Prepaid Expense Amortization Schedule</h3>
                <p className="text-[11px] text-[#3d4a42]">Straight-line pro-rata monthly expensing into respective Operating P&L heads</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="bg-[#f2f3ff]/70 text-[#3d4a42] text-[10px] uppercase tracking-wider border-b border-[#eaedff]">
                  <th className="py-3 px-5 font-sans font-semibold">Vendor & Prepayment Purpose</th>
                  <th className="py-3 px-3">Period (Term)</th>
                  <th className="py-3 px-3 text-right">Total Prepaid</th>
                  <th className="py-3 px-3 text-right">Recognized to Date</th>
                  <th className="py-3 px-3 text-right">Unrecognized (Asset)</th>
                  <th className="py-3 px-4 font-sans font-semibold">Target Expense GL</th>
                  <th className="py-3 px-5 text-right font-sans font-semibold">Monthly Amortization</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eaedff]">
                {prepaids.map((prep) => (
                  <tr key={prep.id} className="hover:bg-[#f2f3ff]/40 transition-colors">
                    <td className="py-3.5 px-5 font-sans">
                      <div className="font-bold text-[#131b2e]">{prep.vendor}</div>
                      <div className="text-[10px] text-[#3d4a42]">{prep.description}</div>
                    </td>
                    <td className="py-3.5 px-3 text-[#3d4a42] text-[11px]">
                      {prep.startDate} → {prep.endDate}
                    </td>
                    <td className="py-3.5 px-3 text-right font-bold text-[#131b2e]">{formatAmount(prep.totalPrepayment)}</td>
                    <td className="py-3.5 px-3 text-right text-[#006c49] font-medium">{formatAmount(prep.recognizedToDate)}</td>
                    <td className="py-3.5 px-3 text-right font-bold text-[#006948]">{formatAmount(prep.unrecognizedBalance)}</td>
                    <td className="py-3.5 px-4 font-sans text-[11px] text-[#3d4a42]">{prep.targetExpenseGL}</td>
                    <td className="py-3.5 px-5 text-right font-bold text-[#131b2e] font-mono">
                      {formatAmount(prep.monthlyAmortization)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
