import React from 'react';
import { useDigits } from '../../context/DigitsContext';
import {
  Flame,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Sparkles,
  Layers,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

export const HomeDashboard: React.FC = () => {
  const { metrics, currentEntity, setActiveView, transactions, closeTasks, formatAmount, chartOfAccounts } = useDigits();

  // Trailed monthly revenue vs burn bar data
  const monthlyFlows = [
    { month: 'Jun 26', rev: 135000, exp: 172000, burn: -37000 },
    { month: 'Jul 26', rev: 148000, exp: 184000, burn: -36000 },
    { month: 'Aug 26', rev: 162000, exp: 198000, burn: -36000 },
    { month: 'Sep 26', rev: 171000, exp: 212000, burn: -41000 },
    { month: 'Oct 26', rev: 184200, exp: 227050, burn: -42850 }
  ];

  const maxVal = Math.max(...monthlyFlows.map((m) => Math.max(m.rev, m.exp)));
  const pendingCloseCount = closeTasks.filter((t) => !t.completed).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner: Entity Greeting & Autonomous Health */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#006948] mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#006c49] shadow-[0_0_8px_#6cf8bb] animate-pulse" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider">
              AUTONOMOUS GENERAL LEDGER
            </span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#6cf8bb]/40 text-[#00714d] font-bold border border-[#6cf8bb]/50">
              Active
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#131b2e] tracking-tight">
            {currentEntity.name} Living Financial Model
          </h1>
          <p className="text-xs text-[#3d4a42] mt-1 max-w-2xl leading-relaxed">
            Realtime continuous accounting powered by machine intelligence. Books are 98.4% auto-reconciled with continuous anomaly audits.
          </p>
        </div>

        <div className="relative z-10 flex items-center space-x-3 shrink-0">
          <button
            onClick={() => setActiveView('financials')}
            className="px-4 py-2 text-xs font-medium text-[#131b2e] bg-[#f2f3ff] hover:bg-[#eaedff] border border-[#eaedff] rounded-full transition-all flex items-center space-x-1.5 shadow-xs"
          >
            <span>View P&L Statements</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#3d4a42]" />
          </button>
          <button
            onClick={() => setActiveView('checklist')}
            className="px-4 py-2 text-xs font-bold text-white bg-[#006948] hover:bg-[#00855d] rounded-full transition-all flex items-center space-x-1.5 shadow-sm active:scale-95"
          >
            <span className="w-2 h-2 rounded-full bg-[#6cf8bb] animate-ping" />
            <span>Close Oct 2026 ({pendingCloseCount} tasks)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Cash */}
        <div className="p-5 rounded-3xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between text-[#3d4a42] mb-2.5">
            <span className="text-xs font-medium uppercase tracking-wider">Total Cash on Hand</span>
            <div className="w-8 h-8 rounded-full bg-[#6cf8bb]/40 text-[#006c49] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-[#131b2e] tracking-tight mb-1">
            {formatAmount(metrics.totalCash)}
          </div>
          <div className="flex items-center text-[11px] text-[#006c49] font-medium">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            <span>+{formatAmount(250000, { compact: true })} venture tranche in Nov</span>
          </div>
        </div>

        {/* Calculated Runway */}
        <div className="p-5 rounded-3xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between text-[#3d4a42] mb-2.5">
            <span className="text-xs font-medium uppercase tracking-wider">Runway Projection</span>
            <div className="w-8 h-8 rounded-full bg-[#eaedff] text-[#006948] flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-[#131b2e] tracking-tight mb-1">
            {metrics.runwayMonths} <span className="text-sm font-normal text-[#3d4a42]">Months</span>
          </div>
          <div className="flex items-center text-[11px] text-[#3d4a42] font-mono">
            <span>Zero Cash: </span>
            <span className="text-[#131b2e] ml-1 font-semibold">September 2029</span>
          </div>
        </div>

        {/* Net Monthly Burn */}
        <div className="p-5 rounded-3xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between text-[#3d4a42] mb-2.5">
            <span className="text-xs font-medium uppercase tracking-wider">Net Monthly Burn</span>
            <div className="w-8 h-8 rounded-full bg-[#ffdad6]/60 text-[#ba1a1a] flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-[#ba1a1a] tracking-tight mb-1">
            -{formatAmount(Math.abs(metrics.netBurn), { hideDecimals: true })}
          </div>
          <div className="flex items-center text-[11px] text-[#3d4a42]">
            <span>Gross Rev: </span>
            <span className="text-[#006c49] ml-1 font-mono font-medium">
              {formatAmount(metrics.monthlyRevenue, { compact: true })}/mo
            </span>
          </div>
        </div>

        {/* Gross Margin */}
        <div className="p-5 rounded-3xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between text-[#3d4a42] mb-2.5">
            <span className="text-xs font-medium uppercase tracking-wider">Gross Margin</span>
            <div className="w-8 h-8 rounded-full bg-[#85f8c4]/40 text-[#006948] flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-[#006c49] tracking-tight mb-1">
            {metrics.grossMarginPercent}%
          </div>
          <div className="flex items-center text-[11px] text-[#3d4a42] font-medium">
            <span>COGS: </span>
            <span className="text-[#131b2e] ml-1 font-mono">
              {formatAmount(metrics.monthlyCOGS, { compact: true })}/mo
            </span>
          </div>
        </div>
      </div>

      {/* Main Charts & Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cash Flow Trajectory Chart (2 Columns) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#eaedff] pb-3">
            <div>
              <h2 className="text-sm font-bold text-[#131b2e]">Monthly Revenue vs Operating Outflow</h2>
              <div className="text-[11px] text-[#3d4a42]">
                Trailed 5-month comparison (Accrual Basis)
              </div>
            </div>
            <div className="flex items-center space-x-3 text-xs">
              <div className="px-3 py-1 bg-[#f2f3ff] rounded-full border border-[#eaedff] flex items-center space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#006c49]" />
                <span className="text-[#3d4a42] text-[11px] font-semibold">Revenue</span>
              </div>
              <div className="px-3 py-1 bg-[#f2f3ff] rounded-full border border-[#eaedff] flex items-center space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#bccac0]" />
                <span className="text-[#3d4a42] text-[11px] font-semibold">Expenses</span>
              </div>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-56 flex items-end justify-between pt-6 px-4 gap-4">
            {monthlyFlows.map((item, idx) => {
              const revHeight = (item.rev / maxVal) * 100;
              const expHeight = (item.exp / maxVal) * 100;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <div className="w-full flex items-end justify-center space-x-2 h-44">
                    {/* Revenue Bar */}
                    <div
                      style={{ height: `${revHeight}%` }}
                      className="w-5 md:w-8 bg-gradient-to-t from-[#006948] to-[#6cf8bb] rounded-t-xl transition-all group-hover:brightness-110 relative shadow-sm"
                      title={`Revenue: ${formatAmount(item.rev)}`}
                    />
                    {/* Expense Bar */}
                    <div
                      style={{ height: `${expHeight}%` }}
                      className="w-5 md:w-8 bg-gradient-to-t from-[#bccac0] to-[#dae2fd] rounded-t-xl transition-all group-hover:brightness-110 relative shadow-sm"
                      title={`Expenses: ${formatAmount(item.exp)}`}
                    />
                  </div>
                  <div className="text-[11px] font-mono text-[#3d4a42] mt-2.5 group-hover:text-[#131b2e] font-semibold transition-colors">
                    {item.month}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="px-4 py-2.5 rounded-2xl bg-[#f2f3ff] border border-[#eaedff] flex items-center justify-between text-xs">
            <span className="text-[#3d4a42] font-medium">October Net Growth Trajectory:</span>
            <span className="font-mono text-[#006c49] font-bold">
              +14.2% MoM Revenue Acceleration
            </span>
          </div>
        </div>

        {/* Cash by Account & Autonomous Review Queue (1 Column) */}
        <div className="space-y-4">
          {/* Cash Account Distribution */}
          <div className="p-5 rounded-3xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-[#3d4a42] flex items-center justify-between">
              <span>Cash Breakdown</span>
              <span className="text-[10px] font-mono text-[#006c49] px-2 py-0.5 rounded-full bg-[#6cf8bb]/40 border border-[#6cf8bb]/50 font-bold">
                Realtime
              </span>
            </div>

            <div className="space-y-2">
              {chartOfAccounts
                .filter((a) => a.subcategory === 'Cash & Cash Equivalents' && a.balance > 0)
                .slice(0, 3)
                .map((acc) => {
                  const pct = ((acc.balance / metrics.totalCash) * 100).toFixed(1);
                  return (
                    <div
                      key={acc.id}
                      className="px-3.5 py-2.5 rounded-2xl bg-[#f2f3ff] border border-[#eaedff] flex items-center justify-between hover:bg-[#eaedff]/60 transition-colors"
                    >
                      <div>
                        <div className="text-xs font-semibold text-[#131b2e]">{acc.name}</div>
                        <div className="text-[10px] text-[#3d4a42]">GL #{acc.code}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-mono font-bold text-[#131b2e]">{formatAmount(acc.balance)}</div>
                        <div className="text-[10px] text-[#3d4a42] font-mono">{pct}%</div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Autonomous Ledger Review Alert */}
          <div className="p-5 rounded-3xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm space-y-2.5">
            <div className="flex items-center space-x-2 text-[#006948]">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Autonomous Ledger Attention</span>
            </div>
            <p className="text-xs text-[#3d4a42] leading-relaxed">
              {metrics.uncategorizedCount > 0
                ? `${metrics.uncategorizedCount} transactions require accountant review before month-end lock.`
                : 'All transactions currently categorized with high AI confidence!'}
            </p>
            {metrics.uncategorizedCount > 0 && (
              <button
                onClick={() => setActiveView('transactions')}
                className="w-full mt-1 py-2 rounded-full bg-[#f2f3ff] hover:bg-[#eaedff] border border-[#eaedff] text-[#006948] font-bold text-xs transition-all"
              >
                Review Ambiguous Items →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Recent Autonomous Transactions Preview */}
      <div className="p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#006948]" />
            <h2 className="text-sm font-bold text-[#131b2e]">Recent Autonomous Ledger Entries</h2>
          </div>
          <button
            onClick={() => setActiveView('transactions')}
            className="text-xs text-[#006948] hover:underline font-semibold"
          >
            View all {transactions.length} transactions →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#eaedff] text-[#3d4a42] text-[11px] uppercase tracking-wider">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Merchant / Payee</th>
                <th className="py-2.5 px-3">Account</th>
                <th className="py-2.5 px-3">Assigned Category</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
                <th className="py-2.5 px-3 text-center">AI Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eaedff] font-mono">
              {transactions.slice(0, 5).map((t) => (
                <tr key={t.id} className="hover:bg-[#f2f3ff]/40 transition-colors">
                  <td className="py-2.5 px-3 text-[#3d4a42] text-[11px]">{t.date}</td>
                  <td className="py-2.5 px-3 font-sans font-semibold text-[#131b2e]">{t.merchant}</td>
                  <td className="py-2.5 px-3 text-[#3d4a42] text-[11px]">{t.account}</td>
                  <td className="py-2.5 px-3 font-sans text-[#131b2e]">{t.category}</td>
                  <td
                    className={`py-2.5 px-3 text-right font-bold ${
                      t.amount >= 0 ? 'text-[#006c49]' : 'text-[#131b2e]'
                    }`}
                  >
                    {t.amount >= 0 ? '+' : ''}{formatAmount(t.amount)}
                  </td>
                  <td className="py-2.5 px-3 text-center font-sans">
                    <span
                      className={`inline-flex items-center text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
                        t.aiConfidence >= 95
                          ? 'bg-[#6cf8bb]/40 text-[#00714d] border-[#6cf8bb]/60'
                          : t.aiConfidence >= 80
                          ? 'bg-[#e2e7ff] text-[#131b2e] border-[#dae2fd]'
                          : 'bg-[#ffdad6]/60 text-[#ba1a1a] border-[#ffdad6]'
                      }`}
                    >
                      {t.aiConfidence}% match
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
