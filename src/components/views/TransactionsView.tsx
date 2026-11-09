import React, { useState } from 'react';
import { useDigits } from '../../context/DigitsContext';
import { Transaction } from '../../types';
import {
  Search,
  Sparkles,
  Sliders,
  Trash2,
  GitFork,
  Link,
  Unlink,
  FileText,
  ChevronDown
} from 'lucide-react';

export const TransactionsView: React.FC = () => {
  const {
    transactions,
    chartOfAccounts,
    updateTransactionCategory,
    toggleTransactionMatch,
    deleteTransaction,
    splitTransaction,
    runRulesNow,
    autoCategorizeWithGemini
  } = useDigits();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [editingTxId, setEditingTxId] = useState<string | null>(null);
  const [isCategorizingAI, setIsCategorizingAI] = useState(false);

  const handleAICategorize = async () => {
    setIsCategorizingAI(true);
    try {
      await autoCategorizeWithGemini();
    } finally {
      setIsCategorizingAI(false);
    }
  };

  // Split transaction modal state
  const [splittingTx, setSplittingTx] = useState<Transaction | null>(null);
  const [splitLines, setSplitLines] = useState<
    { category: string; amount: number; notes: string }[]
  >([]);

  // Categories list for dropdown
  const categoryOptions = chartOfAccounts
    .filter((a) => a.category === 'Expense' || a.category === 'COGS' || a.category === 'Revenue')
    .map((a) => ({ name: a.name, code: a.code }));

  // Filtering
  const filtered = transactions.filter((t) => {
    const matchSearch =
      t.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchAccount =
      selectedAccount === 'All' || t.account.includes(selectedAccount);

    const matchStatus =
      selectedStatus === 'All' ||
      (selectedStatus === 'Needs Review' ? t.status === 'Needs Review' || t.glAccountCode === '9999' : t.status === selectedStatus);

    return matchSearch && matchAccount && matchStatus;
  });

  const handleOpenSplit = (tx: Transaction) => {
    setSplittingTx(tx);
    const half = Math.round((Math.abs(tx.amount) / 2) * 100) / 100;
    setSplitLines([
      { category: tx.category, amount: -half, notes: 'Portion 1' },
      { category: 'Software, Tooling & SaaS Subscriptions', amount: -(Math.abs(tx.amount) - half), notes: 'Portion 2' }
    ]);
  };

  const handleSaveSplit = () => {
    if (!splittingTx) return;
    splitTransaction(splittingTx.id, splitLines);
    setSplittingTx(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Controls & Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#eaedff] pb-4">
        <div>
          <div className="text-xs font-semibold text-[#006948] mb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#006c49] shadow-[0_0_8px_#6cf8bb] animate-pulse" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider">
              AUTONOMOUS GENERAL LEDGER
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#131b2e] tracking-tight">
            Transactions & Live Bookkeeping
          </h1>
          <div className="text-xs text-[#3d4a42] mt-0.5">
            Continuous bank feed classification powered by Google Gemini 2.5 Flash machine learning models
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleAICategorize}
            disabled={isCategorizingAI}
            className="px-4 py-2 bg-[#006948] hover:bg-[#00855d] text-white text-xs font-bold rounded-full transition-all flex items-center space-x-2 shadow-sm disabled:opacity-50 active:scale-95"
          >
            <Sparkles className={`w-3.5 h-3.5 text-[#6cf8bb] ${isCategorizingAI ? 'animate-spin' : ''}`} />
            <span>{isCategorizingAI ? 'Gemini 2.5 Flash Classifying...' : 'Auto-Categorize with Gemini AI'}</span>
          </button>

          <button
            onClick={() => runRulesNow()}
            className="px-4 py-2 bg-[#eaedff] hover:bg-[#dae2fd] text-[#131b2e] text-xs font-semibold rounded-full transition-all flex items-center space-x-1.5 border border-[#eaedff]"
          >
            <Sliders className="w-3.5 h-3.5 text-[#006948]" />
            <span>Run Rules</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white/90 backdrop-blur-xl p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-sm border border-[#eaedff]">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#3d4a42]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search merchant, description, category..."
            className="w-full bg-[#f2f3ff] rounded-full pl-10 pr-4 py-2 text-xs text-[#131b2e] placeholder-[#3d4a42]/70 focus:outline-none focus:bg-white border border-transparent focus:border-[#6cf8bb] transition-all"
          />
        </div>

        {/* Account Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-[11px] text-[#3d4a42] font-semibold uppercase tracking-wider">Account:</span>
          <select
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            className="px-3 py-1.5 rounded-full text-xs text-[#131b2e] bg-[#f2f3ff] border border-[#eaedff] focus:outline-none font-medium"
          >
            <option value="All">All Bank & Card Accounts</option>
            <option value="Chase">Chase Operating (#4819)</option>
            <option value="Mercury">Mercury Treasury (#9921)</option>
            <option value="Brex">Brex Corporate Card (#8842)</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-[11px] text-[#3d4a42] font-semibold uppercase tracking-wider">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-full text-xs text-[#131b2e] bg-[#f2f3ff] border border-[#eaedff] focus:outline-none font-medium"
          >
            <option value="All">All Statuses ({transactions.length})</option>
            <option value="Needs Review">Needs Review</option>
            <option value="Categorized">Auto-Categorized</option>
            <option value="Matched">Matched Feeds</option>
            <option value="Split">Split Transactions</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl overflow-hidden shadow-sm border border-[#eaedff]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#eaedff] bg-[#f2f3ff]/70 text-[#3d4a42] text-[10px] uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Merchant / Raw Description</th>
                <th className="py-3 px-3">Account</th>
                <th className="py-3 px-4">Chart of Accounts Category</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-3 text-center">AI Confidence</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eaedff] font-mono">
              {filtered.map((t) => (
                <tr
                  key={t.id}
                  className={`hover:bg-[#f2f3ff]/40 transition-colors ${
                    t.status === 'Needs Review' ? 'bg-[#ffdad6]/20' : ''
                  }`}
                >
                  {/* Date */}
                  <td className="py-3 px-4 text-[#3d4a42] text-[11px] whitespace-nowrap">
                    {t.date}
                  </td>

                  {/* Merchant & Raw Description */}
                  <td className="py-3 px-4 font-sans">
                    <div className="font-semibold text-[#131b2e]">{t.merchant}</div>
                    <div className="text-[11px] text-[#3d4a42] truncate max-w-xs font-mono">
                      {t.description}
                    </div>
                    {t.notes && (
                      <div className="text-[10px] text-[#006c49] mt-0.5 font-sans">
                        ℹ {t.notes}
                      </div>
                    )}
                    {t.receiptUrl && (
                      <div className="flex items-center space-x-1 text-[10px] text-[#006948] font-sans mt-0.5">
                        <FileText className="w-3 h-3" />
                        <span>Receipt attached</span>
                      </div>
                    )}
                  </td>

                  {/* Account */}
                  <td className="py-3 px-3 font-sans text-[#131b2e] whitespace-nowrap text-[11px]">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#eaedff] text-[#131b2e] text-[11px]">
                      {t.account}
                    </span>
                  </td>

                  {/* Category with Inline Switcher */}
                  <td className="py-3 px-4 font-sans">
                    {editingTxId === t.id ? (
                      <select
                        autoFocus
                        defaultValue={t.category}
                        onChange={(e) => {
                          const chosen = categoryOptions.find((c) => c.name === e.target.value);
                          if (chosen) {
                            updateTransactionCategory(t.id, chosen.name, chosen.code);
                          }
                          setEditingTxId(null);
                        }}
                        onBlur={() => setEditingTxId(null)}
                        className="px-2.5 py-1 text-xs text-[#131b2e] bg-[#f2f3ff] border border-[#eaedff] rounded-lg focus:outline-none"
                      >
                        {categoryOptions.map((c) => (
                          <option key={c.code} value={c.name}>
                            {c.code} - {c.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <button
                        onClick={() => setEditingTxId(t.id)}
                        className="group flex items-center space-x-1 text-left hover:text-[#006948] transition-colors"
                        title="Click to change category"
                      >
                        <span className="font-medium text-[#131b2e] group-hover:text-[#006948]">
                          {t.category}
                        </span>
                        <ChevronDown className="w-3 h-3 text-[#3d4a42] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    )}
                    <div className="text-[10px] text-[#3d4a42] font-mono">
                      GL Code: {t.glAccountCode}
                    </div>
                  </td>

                  {/* Amount */}
                  <td
                    className={`py-3 px-4 text-right font-bold whitespace-nowrap ${
                      t.amount >= 0 ? 'text-[#006c49]' : 'text-[#131b2e]'
                    }`}
                  >
                    {t.amount >= 0 ? '+' : '-'}$
                    {Math.abs(t.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>

                  {/* AI Confidence Pill */}
                  <td className="py-3 px-3 text-center font-sans">
                    <span
                      className={`inline-flex items-center text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
                        t.aiConfidence >= 95
                          ? 'bg-[#6cf8bb]/40 text-[#00714d] border-[#6cf8bb]/60'
                          : t.aiConfidence >= 80
                          ? 'bg-[#e2e7ff] text-[#131b2e] border-[#dae2fd]'
                          : 'bg-[#ffdad6]/60 text-[#ba1a1a] border-[#ffdad6] animate-pulse'
                      }`}
                    >
                      {t.aiConfidence}% {t.aiConfidence < 80 ? 'Review' : 'Match'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right font-sans whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-1.5">
                      <button
                        onClick={() => toggleTransactionMatch(t.id)}
                        className={`p-1.5 rounded-full hover:bg-[#eaedff] transition-colors ${
                          t.status === 'Matched' ? 'text-[#006c49]' : 'text-[#3d4a42] hover:text-[#131b2e]'
                        }`}
                        title={t.status === 'Matched' ? 'Unmatch' : 'Match to Transfer'}
                      >
                        {t.status === 'Matched' ? <Unlink className="w-3.5 h-3.5" /> : <Link className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => handleOpenSplit(t)}
                        className="p-1.5 rounded-full hover:bg-[#eaedff] text-[#3d4a42] hover:text-[#131b2e] transition-colors"
                        title="Split Transaction"
                      >
                        <GitFork className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => deleteTransaction(t.id)}
                        className="p-1.5 rounded-full hover:bg-[#ffdad6] text-[#3d4a42] hover:text-[#ba1a1a] transition-colors"
                        title="Delete Transaction"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Split Transaction Modal */}
      {splittingTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 space-y-4 border border-[#eaedff] shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#eaedff] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#131b2e]">Split Transaction</h3>
                <div className="text-xs text-[#3d4a42] font-mono">
                  {splittingTx.merchant} · ${Math.abs(splittingTx.amount).toLocaleString()}
                </div>
              </div>
              <button
                onClick={() => setSplittingTx(null)}
                className="w-7 h-7 rounded-full bg-[#f2f3ff] flex items-center justify-center text-[#3d4a42] hover:text-[#131b2e]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {splitLines.map((line, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-[#f2f3ff] space-y-2 border border-[#eaedff]">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#131b2e]">
                    <span>Split Line #{idx + 1}</span>
                    <input
                      type="number"
                      value={Math.abs(line.amount)}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        const copy = [...splitLines];
                        copy[idx].amount = -val;
                        setSplitLines(copy);
                      }}
                      className="w-24 bg-white border border-[#eaedff] rounded-xl px-2 py-0.5 text-right font-mono text-xs text-[#131b2e]"
                    />
                  </div>
                  <select
                    value={line.category}
                    onChange={(e) => {
                      const copy = [...splitLines];
                      copy[idx].category = e.target.value;
                      setSplitLines(copy);
                    }}
                    className="w-full bg-white border border-[#eaedff] rounded-xl px-3 py-1.5 text-xs text-[#131b2e]"
                  >
                    {categoryOptions.map((c) => (
                      <option key={c.code} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={line.notes}
                    onChange={(e) => {
                      const copy = [...splitLines];
                      copy[idx].notes = e.target.value;
                      setSplitLines(copy);
                    }}
                    placeholder="Notes for line item"
                    className="w-full bg-white border border-[#eaedff] rounded-xl px-3 py-1.5 text-xs text-[#131b2e]"
                  >
                  </input>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#eaedff]">
              <button
                onClick={() => setSplittingTx(null)}
                className="px-4 py-2 rounded-full text-xs font-medium text-[#3d4a42] hover:bg-[#f2f3ff]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSplit}
                className="px-5 py-2 rounded-full bg-[#006948] hover:bg-[#00855d] text-white font-bold text-xs shadow-sm"
              >
                Confirm Split
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
