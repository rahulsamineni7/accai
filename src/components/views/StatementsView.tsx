import React, { useState } from 'react';
import { useDigits } from '../../context/DigitsContext';
import {
  Download,
  ChevronDown,
  ChevronRight,
  Percent,
  CheckCircle2
} from 'lucide-react';

export const StatementsView: React.FC = () => {
  const { chartOfAccounts, currentEntity, showNotification, formatAmount } = useDigits();
  const [statementType, setStatementType] = useState<'pnl' | 'balance' | 'cashflow'>('pnl');
  const [showPercentages, setShowPercentages] = useState(false);
  const [basis, setBasis] = useState<'Accrual' | 'Cash'>('Accrual');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    Revenue: true,
    COGS: true,
    Expense: true,
    Asset: true,
    Liability: true,
    Equity: true
  });

  const toggleExpand = (cat: string) => {
    setExpandedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  // Group accounts by category and subcategory
  const revenueAccounts = chartOfAccounts.filter((a) => a.category === 'Revenue');
  const cogsAccounts = chartOfAccounts.filter((a) => a.category === 'COGS');
  const expenseAccounts = chartOfAccounts.filter((a) => a.category === 'Expense');

  const assetAccounts = chartOfAccounts.filter((a) => a.category === 'Asset');
  const liabilityAccounts = chartOfAccounts.filter((a) => a.category === 'Liability');
  const equityAccounts = chartOfAccounts.filter((a) => a.category === 'Equity');

  // P&L totals
  const totalRevenue = revenueAccounts.reduce((sum, a) => sum + a.balance, 0);
  const totalCOGS = cogsAccounts.reduce((sum, a) => sum + a.balance, 0);
  const grossProfit = totalRevenue - totalCOGS;
  const totalExpenses = expenseAccounts.reduce((sum, a) => sum + a.balance, 0);
  const netIncome = grossProfit - totalExpenses;

  // Balance sheet totals
  const totalAssets = assetAccounts.reduce((sum, a) => sum + a.balance, 0);
  const totalLiabilities = liabilityAccounts.reduce((sum, a) => sum + a.balance, 0);
  const totalEquity = equityAccounts.reduce((sum, a) => sum + a.balance, 0) + netIncome;

  // Months mock distribution percentages (Jun - Oct)
  const monthWeights = [0.16, 0.18, 0.20, 0.22, 0.24];
  const months = ['Jun 2026', 'Jul 2026', 'Aug 2026', 'Sep 2026', 'Oct 2026'];

  const handleExportCSV = () => {
    const title = statementType === 'pnl' ? 'Profit_and_Loss' : statementType === 'balance' ? 'Balance_Sheet' : 'Cash_Flow';
    showNotification(`Exported ${title}_${currentEntity.slug}_2026.csv`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#eaedff] pb-4">
        <div>
          <div className="text-xs font-semibold text-[#006948] mb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#006c49] shadow-[0_0_8px_#6cf8bb] animate-pulse" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider">
              LIVING FINANCIAL REPORTING
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#131b2e] tracking-tight">
            {statementType === 'pnl'
              ? 'Profit & Loss Statement (P&L)'
              : statementType === 'balance'
              ? 'Balance Sheet'
              : 'Statement of Cash Flows'}
          </h1>
          <div className="text-xs text-[#3d4a42] mt-0.5">
            {currentEntity.name} · Year-to-Date through October 31, 2026 · {basis} Basis
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Statement Switcher Tabs */}
          <div className="p-1 rounded-full bg-[#f2f3ff] border border-[#eaedff] flex items-center space-x-1">
            <button
              onClick={() => setStatementType('pnl')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                statementType === 'pnl'
                  ? 'bg-[#006948] text-white shadow-sm'
                  : 'text-[#3d4a42] hover:text-[#131b2e]'
              }`}
            >
              Profit & Loss
            </button>
            <button
              onClick={() => setStatementType('balance')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                statementType === 'balance'
                  ? 'bg-[#006948] text-white shadow-sm'
                  : 'text-[#3d4a42] hover:text-[#131b2e]'
              }`}
            >
              Balance Sheet
            </button>
            <button
              onClick={() => setStatementType('cashflow')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                statementType === 'cashflow'
                  ? 'bg-[#006948] text-white shadow-sm'
                  : 'text-[#3d4a42] hover:text-[#131b2e]'
              }`}
            >
              Cash Flow
            </button>
          </div>

          {/* Basis Toggle */}
          <button
            onClick={() => setBasis(basis === 'Accrual' ? 'Cash' : 'Accrual')}
            className="px-3.5 py-1.5 rounded-full bg-[#f2f3ff] hover:bg-[#eaedff] border border-[#eaedff] text-xs font-mono text-[#131b2e] font-semibold transition-all"
          >
            {basis}
          </button>

          {/* % of Revenue Toggle */}
          <button
            onClick={() => setShowPercentages(!showPercentages)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center space-x-1.5 border border-[#eaedff] ${
              showPercentages
                ? 'bg-[#6cf8bb]/40 text-[#00714d] border-[#6cf8bb]/60'
                : 'bg-[#f2f3ff] text-[#3d4a42] hover:bg-[#eaedff]'
            }`}
          >
            <Percent className="w-3.5 h-3.5" />
            <span>% View</span>
          </button>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="px-4 py-1.5 rounded-full bg-[#006948] hover:bg-[#00855d] text-xs font-semibold text-white transition-all flex items-center space-x-1.5 shadow-sm active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Main Statement Table */}
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl overflow-hidden shadow-sm border border-[#eaedff]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#eaedff] bg-[#f2f3ff]/70 text-[#3d4a42] text-[10px] uppercase tracking-wider font-semibold">
                <th className="py-3 px-4 w-72">Account Category & Line Item</th>
                {months.map((m) => (
                  <th key={m} className="py-3 px-3 text-right font-mono">
                    {m}
                  </th>
                ))}
                <th className="py-3 px-4 text-right font-mono text-[#006948] font-bold">
                  YTD Total
                </th>
                {showPercentages && (
                  <th className="py-3 px-3 text-right font-mono text-[#006c49]">
                    % of Rev
                  </th>
                )}
              </tr>
            </thead>

            {/* STATEMENT: PROFIT & LOSS */}
            {statementType === 'pnl' && (
              <tbody className="divide-y divide-[#eaedff] font-mono">
                {/* 1. REVENUE */}
                <tr
                  onClick={() => toggleExpand('Revenue')}
                  className="bg-[#f2f3ff]/60 hover:bg-[#eaedff] cursor-pointer font-bold text-[#131b2e] transition-colors"
                >
                  <td className="py-2.5 px-4 font-sans flex items-center space-x-2">
                    {expandedCategories.Revenue ? <ChevronDown className="w-4 h-4 text-[#006948]" /> : <ChevronRight className="w-4 h-4 text-[#3d4a42]" />}
                    <span>1. OPERATING REVENUE</span>
                  </td>
                  {monthWeights.map((w, idx) => (
                    <td key={idx} className="py-2.5 px-3 text-right text-[#131b2e]">
                      {formatAmount(totalRevenue * w, { hideDecimals: true })}
                    </td>
                  ))}
                  <td className="py-2.5 px-4 text-right text-[#006c49] font-bold">
                    {formatAmount(totalRevenue)}
                  </td>
                  {showPercentages && <td className="py-2.5 px-3 text-right text-[#3d4a42]">100.0%</td>}
                </tr>
                {expandedCategories.Revenue &&
                  revenueAccounts.map((acc) => (
                    <tr key={acc.id} className="hover:bg-[#f2f3ff]/40 transition-colors">
                      <td className="py-2 px-8 font-sans text-[#131b2e] flex items-center justify-between">
                        <span>{acc.name}</span>
                        <span className="text-[10px] text-[#3d4a42] font-mono">{acc.code}</span>
                      </td>
                      {monthWeights.map((w, idx) => (
                        <td key={idx} className="py-2 px-3 text-right text-[#3d4a42]">
                          {formatAmount(acc.balance * w, { hideDecimals: true })}
                        </td>
                      ))}
                      <td className="py-2 px-4 text-right text-[#131b2e] font-medium">
                        {formatAmount(acc.balance)}
                      </td>
                      {showPercentages && (
                        <td className="py-2 px-3 text-right text-[#3d4a42] text-[11px]">
                          {((acc.balance / totalRevenue) * 100).toFixed(1)}%
                        </td>
                      )}
                    </tr>
                  ))}

                {/* 2. COGS */}
                <tr
                  onClick={() => toggleExpand('COGS')}
                  className="bg-[#f2f3ff]/60 hover:bg-[#eaedff] cursor-pointer font-bold text-[#131b2e] transition-colors"
                >
                  <td className="py-2.5 px-4 font-sans flex items-center space-x-2">
                    {expandedCategories.COGS ? <ChevronDown className="w-4 h-4 text-[#006948]" /> : <ChevronRight className="w-4 h-4 text-[#3d4a42]" />}
                    <span>2. COST OF GOODS SOLD (COGS)</span>
                  </td>
                  {monthWeights.map((w, idx) => (
                    <td key={idx} className="py-2.5 px-3 text-right text-[#131b2e]">
                      {formatAmount(totalCOGS * w, { hideDecimals: true })}
                    </td>
                  ))}
                  <td className="py-2.5 px-4 text-right text-[#131b2e] font-bold">
                    {formatAmount(totalCOGS)}
                  </td>
                  {showPercentages && (
                    <td className="py-2.5 px-3 text-right text-[#3d4a42]">
                      {((totalCOGS / totalRevenue) * 100).toFixed(1)}%
                    </td>
                  )}
                </tr>
                {expandedCategories.COGS &&
                  cogsAccounts.map((acc) => (
                    <tr key={acc.id} className="hover:bg-[#f2f3ff]/40 transition-colors">
                      <td className="py-2 px-8 font-sans text-[#131b2e] flex items-center justify-between">
                        <span>{acc.name}</span>
                        <span className="text-[10px] text-[#3d4a42] font-mono">{acc.code}</span>
                      </td>
                      {monthWeights.map((w, idx) => (
                        <td key={idx} className="py-2 px-3 text-right text-[#3d4a42]">
                          {formatAmount(acc.balance * w, { hideDecimals: true })}
                        </td>
                      ))}
                      <td className="py-2 px-4 text-right text-[#131b2e] font-medium">
                        {formatAmount(acc.balance)}
                      </td>
                      {showPercentages && (
                        <td className="py-2 px-3 text-right text-[#3d4a42] text-[11px]">
                          {((acc.balance / totalRevenue) * 100).toFixed(1)}%
                        </td>
                      )}
                    </tr>
                  ))}

                {/* GROSS PROFIT ROW */}
                <tr className="bg-[#f2f3ff] font-bold border-y-2 border-[#eaedff] text-[#131b2e]">
                  <td className="py-3 px-4 font-sans text-[#006c49]">GROSS PROFIT</td>
                  {monthWeights.map((w, idx) => (
                    <td key={idx} className="py-3 px-3 text-right text-[#006c49]">
                      {formatAmount(grossProfit * w, { hideDecimals: true })}
                    </td>
                  ))}
                  <td className="py-3 px-4 text-right text-[#006c49] font-bold">
                    {formatAmount(grossProfit)}
                  </td>
                  {showPercentages && (
                    <td className="py-3 px-3 text-right text-[#006c49]">
                      {((grossProfit / totalRevenue) * 100).toFixed(1)}%
                    </td>
                  )}
                </tr>

                {/* 3. OPERATING EXPENSES */}
                <tr
                  onClick={() => toggleExpand('Expense')}
                  className="bg-[#f2f3ff]/60 hover:bg-[#eaedff] cursor-pointer font-bold text-[#131b2e] transition-colors"
                >
                  <td className="py-2.5 px-4 font-sans flex items-center space-x-2">
                    {expandedCategories.Expense ? <ChevronDown className="w-4 h-4 text-[#006948]" /> : <ChevronRight className="w-4 h-4 text-[#3d4a42]" />}
                    <span>3. OPERATING EXPENSES (OPEX)</span>
                  </td>
                  {monthWeights.map((w, idx) => (
                    <td key={idx} className="py-2.5 px-3 text-right text-[#131b2e]">
                      {formatAmount(totalExpenses * w, { hideDecimals: true })}
                    </td>
                  ))}
                  <td className="py-2.5 px-4 text-right text-[#ba1a1a] font-bold">
                    {formatAmount(totalExpenses)}
                  </td>
                  {showPercentages && (
                    <td className="py-2.5 px-3 text-right text-[#3d4a42]">
                      {((totalExpenses / totalRevenue) * 100).toFixed(1)}%
                    </td>
                  )}
                </tr>
                {expandedCategories.Expense &&
                  expenseAccounts.map((acc) => (
                    <tr key={acc.id} className="hover:bg-[#f2f3ff]/40 transition-colors">
                      <td className="py-2 px-8 font-sans text-[#131b2e] flex items-center justify-between">
                        <span>{acc.name}</span>
                        <span className="text-[10px] text-[#3d4a42] font-mono">{acc.code}</span>
                      </td>
                      {monthWeights.map((w, idx) => (
                        <td key={idx} className="py-2 px-3 text-right text-[#3d4a42]">
                          {formatAmount(acc.balance * w, { hideDecimals: true })}
                        </td>
                      ))}
                      <td className="py-2 px-4 text-right text-[#131b2e] font-medium">
                        {formatAmount(acc.balance)}
                      </td>
                      {showPercentages && (
                        <td className="py-2 px-3 text-right text-[#3d4a42] text-[11px]">
                          {((acc.balance / totalRevenue) * 100).toFixed(1)}%
                        </td>
                      )}
                    </tr>
                  ))}

                {/* NET INCOME ROW */}
                <tr className="bg-[#f2f3ff] font-bold border-t-2 border-[#eaedff] text-[#131b2e]">
                  <td className="py-3.5 px-4 font-sans text-sm">
                    NET INCOME (LOSS)
                  </td>
                  {monthWeights.map((w, idx) => {
                    const monthNet = netIncome * w;
                    return (
                      <td
                        key={idx}
                        className={`py-3.5 px-3 text-right font-bold ${
                          monthNet >= 0 ? 'text-[#006c49]' : 'text-[#ba1a1a]'
                        }`}
                      >
                        {formatAmount(monthNet, { hideDecimals: true })}
                      </td>
                    );
                  })}
                  <td
                    className={`py-3.5 px-4 text-right font-bold text-sm ${
                      netIncome >= 0 ? 'text-[#006c49]' : 'text-[#ba1a1a]'
                    }`}
                  >
                    {formatAmount(netIncome)}
                  </td>
                  {showPercentages && (
                    <td
                      className={`py-3.5 px-3 text-right ${
                        netIncome >= 0 ? 'text-[#006c49]' : 'text-[#ba1a1a]'
                      }`}
                    >
                      {((netIncome / totalRevenue) * 100).toFixed(1)}%
                    </td>
                  )}
                </tr>
              </tbody>
            )}

            {/* STATEMENT: BALANCE SHEET */}
            {statementType === 'balance' && (
              <tbody className="divide-y divide-[#eaedff] font-mono">
                {/* ASSETS */}
                <tr className="bg-[#f2f3ff] font-bold text-[#131b2e]">
                  <td className="py-3 px-4 font-sans" colSpan={7}>
                    ASSETS
                  </td>
                </tr>
                {assetAccounts.map((acc) => (
                  <tr key={acc.id} className="hover:bg-[#f2f3ff]/40 transition-colors">
                    <td className="py-2 px-8 font-sans text-[#131b2e] flex items-center justify-between">
                      <span>{acc.name}</span>
                      <span className="text-[10px] text-[#3d4a42] font-mono">{acc.code}</span>
                    </td>
                    <td colSpan={5} className="py-2 px-3 text-right text-[#3d4a42] text-[11px]">
                      {acc.subcategory}
                    </td>
                    <td className="py-2 px-4 text-right text-[#131b2e] font-bold">
                      {formatAmount(acc.balance)}
                    </td>
                  </tr>
                ))}
                <tr className="bg-[#f2f3ff] font-bold text-[#006c49]">
                  <td className="py-2.5 px-4 font-sans">TOTAL ASSETS</td>
                  <td colSpan={5}></td>
                  <td className="py-2.5 px-4 text-right">
                    {formatAmount(totalAssets)}
                  </td>
                </tr>

                {/* LIABILITIES */}
                <tr className="bg-[#f2f3ff] font-bold text-[#131b2e] pt-4">
                  <td className="py-3 px-4 font-sans" colSpan={7}>
                    LIABILITIES
                  </td>
                </tr>
                {liabilityAccounts.map((acc) => (
                  <tr key={acc.id} className="hover:bg-[#f2f3ff]/40 transition-colors">
                    <td className="py-2 px-8 font-sans text-[#131b2e] flex items-center justify-between">
                      <span>{acc.name}</span>
                      <span className="text-[10px] text-[#3d4a42] font-mono">{acc.code}</span>
                    </td>
                    <td colSpan={5} className="py-2 px-3 text-right text-[#3d4a42] text-[11px]">
                      {acc.subcategory}
                    </td>
                    <td className="py-2 px-4 text-right text-[#131b2e] font-bold">
                      {formatAmount(acc.balance)}
                    </td>
                  </tr>
                ))}
                <tr className="bg-[#f2f3ff] font-bold text-[#131b2e]">
                  <td className="py-2.5 px-4 font-sans">TOTAL LIABILITIES</td>
                  <td colSpan={5}></td>
                  <td className="py-2.5 px-4 text-right">
                    {formatAmount(totalLiabilities)}
                  </td>
                </tr>

                {/* EQUITY */}
                <tr className="bg-[#f2f3ff] font-bold text-[#131b2e] pt-4">
                  <td className="py-3 px-4 font-sans" colSpan={7}>
                    STOCKHOLDERS' EQUITY
                  </td>
                </tr>
                {equityAccounts.map((acc) => (
                  <tr key={acc.id} className="hover:bg-[#f2f3ff]/40 transition-colors">
                    <td className="py-2 px-8 font-sans text-[#131b2e] flex items-center justify-between">
                      <span>{acc.name}</span>
                      <span className="text-[10px] text-[#3d4a42] font-mono">{acc.code}</span>
                    </td>
                    <td colSpan={5} className="py-2 px-3 text-right text-[#3d4a42] text-[11px]">
                      {acc.subcategory}
                    </td>
                    <td className="py-2 px-4 text-right text-[#131b2e] font-bold">
                      {formatAmount(acc.balance)}
                    </td>
                  </tr>
                ))}
                <tr className="hover:bg-[#f2f3ff]/40 transition-colors">
                  <td className="py-2 px-8 font-sans text-[#131b2e]">
                    Net Income (Loss) for the Year
                  </td>
                  <td colSpan={5} className="py-2 px-3 text-right text-[#3d4a42] text-[11px]">
                    Current Year Retained Earnings
                  </td>
                  <td className={`py-2 px-4 text-right font-bold ${netIncome >= 0 ? 'text-[#006c49]' : 'text-[#ba1a1a]'}`}>
                    {formatAmount(netIncome)}
                  </td>
                </tr>
                <tr className="bg-[#f2f3ff] font-bold text-[#131b2e]">
                  <td className="py-2.5 px-4 font-sans">TOTAL EQUITY</td>
                  <td colSpan={5}></td>
                  <td className="py-2.5 px-4 text-right">
                    {formatAmount(totalEquity)}
                  </td>
                </tr>

                {/* TOTAL LIABILITIES & EQUITY PROOF */}
                <tr className="bg-[#f2f3ff] font-bold border-t-2 border-[#eaedff] text-[#131b2e]">
                  <td className="py-3.5 px-4 font-sans text-sm text-[#006c49] flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#006c49]" />
                    <span>TOTAL LIABILITIES & EQUITY (BALANCED)</span>
                  </td>
                  <td colSpan={5}></td>
                  <td className="py-3.5 px-4 text-right text-[#006c49] font-bold text-sm">
                    {formatAmount(totalLiabilities + totalEquity)}
                  </td>
                </tr>
              </tbody>
            )}

            {/* STATEMENT: CASH FLOW */}
            {statementType === 'cashflow' && (
              <tbody className="divide-y divide-[#eaedff] font-mono">
                <tr className="bg-[#f2f3ff] font-bold text-[#131b2e]">
                  <td className="py-3 px-4 font-sans" colSpan={7}>
                    1. CASH FLOW FROM OPERATING ACTIVITIES
                  </td>
                </tr>
                <tr className="hover:bg-[#f2f3ff]/40">
                  <td className="py-2 px-8 font-sans text-[#131b2e]">Net Operating Income</td>
                  <td colSpan={5}></td>
                  <td className="py-2 px-4 text-right text-[#ba1a1a] font-medium">
                    {formatAmount(netIncome)}
                  </td>
                </tr>
                <tr className="hover:bg-[#f2f3ff]/40">
                  <td className="py-2 px-8 font-sans text-[#131b2e]">Add Back: Non-Cash Depreciation</td>
                  <td colSpan={5}></td>
                  <td className="py-2 px-4 text-right text-[#006c49] font-medium">+{formatAmount(26400)}</td>
                </tr>
                <tr className="hover:bg-[#f2f3ff]/40">
                  <td className="py-2 px-8 font-sans text-[#131b2e]">Change in Accounts Receivable</td>
                  <td colSpan={5}></td>
                  <td className="py-2 px-4 text-right text-[#ba1a1a] font-medium">-{formatAmount(14200)}</td>
                </tr>
                <tr className="bg-[#f2f3ff] font-bold text-[#131b2e]">
                  <td className="py-2.5 px-4 font-sans">Net Cash from Operating Activities</td>
                  <td colSpan={5}></td>
                  <td className="py-2.5 px-4 text-right text-[#ba1a1a]">
                    {formatAmount(netIncome + 26400 - 14200)}
                  </td>
                </tr>

                <tr className="bg-[#f2f3ff] font-bold text-[#131b2e] pt-4">
                  <td className="py-3 px-4 font-sans" colSpan={7}>
                    2. CASH FLOW FROM FINANCING ACTIVITIES
                  </td>
                </tr>
                <tr className="hover:bg-[#f2f3ff]/40">
                  <td className="py-2 px-8 font-sans text-[#131b2e]">Proceeds from SAFE / Venture Tranche</td>
                  <td colSpan={5}></td>
                  <td className="py-2 px-4 text-right text-[#006c49] font-medium">+{formatAmount(250000)}</td>
                </tr>
                <tr className="bg-[#f2f3ff] font-bold text-[#131b2e]">
                  <td className="py-2.5 px-4 font-sans">Net Cash from Financing Activities</td>
                  <td colSpan={5}></td>
                  <td className="py-2.5 px-4 text-right text-[#006c49]">+{formatAmount(250000)}</td>
                </tr>

                <tr className="bg-[#f2f3ff] font-bold border-t-2 border-[#eaedff] text-[#131b2e]">
                  <td className="py-3.5 px-4 font-sans text-sm text-[#006c49]">
                    ENDING CASH & CASH EQUIVALENTS
                  </td>
                  <td colSpan={5}></td>
                  <td className="py-3.5 px-4 text-right text-[#006c49] font-bold text-sm">
                    {formatAmount(1142390.12 + 340530.33 + 24890.50)}
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};
