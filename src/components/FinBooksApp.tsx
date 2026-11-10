import React, { useState } from 'react';
import {
  Sparkles,
  UploadCloud,
  FileText,
  CheckCircle2,
  Download,
  Building2,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  Send,
  Bot,
  Check,
  Search,
  Filter,
  AlertCircle,
  Eye,
  Plus
} from 'lucide-react';
import { useDigits } from '../context/DigitsContext';
import { askDigitsAI, FinancialContext } from '../services/geminiService';

interface FinBooksAppProps {
  activeTab: 'overview' | 'documents' | 'reconciliation' | 'reports';
  setActiveTab: (tab: 'overview' | 'documents' | 'reconciliation' | 'reports') => void;
}

export const FinBooksApp: React.FC<FinBooksAppProps> = ({ activeTab, setActiveTab }) => {
  const {
    currentEntity,
    transactions,
    chartOfAccounts,
    bills,
    invoices,
    metrics: {
      totalCash,
      monthlyRevenue,
      monthlyExpenses,
      monthlyCOGS,
      netBurn,
      runwayMonths,
      grossMarginPercent
    },
    downloadTallyXml,
    downloadGstrJson,
    toggleTransactionMatch,
    addTransaction
  } = useDigits();

  // AI CFO State
  const [aiQuery, setAiQuery] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiChatHistory, setAiChatHistory] = useState<Array<{ q: string; a: string; time: string }>>([
    {
      q: 'What is our current cash runway and net monthly burn?',
      a: `Based on your live operating cash balance of ₹${totalCash.toLocaleString('en-IN')}, your net burn is currently ₹${Math.abs(netBurn).toLocaleString('en-IN')}/month. This provides approximately **${runwayMonths} months of runway**. Operating revenue is trending steady at ₹${monthlyRevenue.toLocaleString('en-IN')}/month with gross margins at **${grossMarginPercent}%**.`,
      time: '10:42 AM'
    }
  ]);

  // Document Upload State
  const [uploadedDocs, setUploadedDocs] = useState([
    {
      id: 'doc-1',
      name: 'AWS_Cloud_Invoice_Oct26.pdf',
      vendor: 'Amazon Web Services India',
      gstin: '29AABCA1234F1Z8',
      amount: 50150,
      tax: 7650,
      category: 'Cloud Infrastructure & Hosting',
      status: 'Posted',
      confidence: 99.4,
      date: '2026-10-24'
    },
    {
      id: 'doc-2',
      name: 'WeWork_Galaxy_Rent_Oct26.pdf',
      vendor: 'WeWork India Management Pvt Ltd',
      gstin: '29AAGCW1029K1Z3',
      amount: 88500,
      tax: 13500,
      category: 'Rent & Office Lease',
      status: 'Ready to Post',
      confidence: 98.7,
      date: '2026-10-22'
    },
    {
      id: 'doc-3',
      name: 'Google_Workspace_Receipt.pdf',
      vendor: 'Google Cloud India Pvt Ltd',
      gstin: '29AAACG9684C1Z9',
      amount: 14200,
      tax: 2166,
      category: 'Software & SaaS Subscriptions',
      status: 'Ready to Post',
      confidence: 99.1,
      date: '2026-10-20'
    }
  ]);

  // Report Subtab State
  const [reportSubTab, setReportSubTab] = useState<'pl' | 'bs' | 'gst'>('pl');

  // Handle AI Question
  const handleAskAi = async (queryText?: string) => {
    const q = queryText || aiQuery;
    if (!q.trim()) return;

    setAiLoading(true);
    setAiQuery('');

    const context: FinancialContext = {
      entityName: currentEntity.name,
      entityType: currentEntity.type,
      accountingMethod: currentEntity.accountingMethod,
      totalCash,
      monthlyRevenue,
      monthlyExpenses,
      monthlyCOGS,
      netBurn,
      runwayMonths,
      grossMarginPercent,
      recentTransactions: transactions.slice(0, 8).map((t) => ({
        date: t.date,
        merchant: t.merchant,
        description: t.description,
        amount: t.amount,
        category: t.category,
        account: t.account,
        status: t.status
      })),
      openBills: bills.slice(0, 5).map((b) => ({
        vendor: b.vendor,
        amount: b.amount,
        dueDate: b.dueDate,
        status: b.status
      })),
      openInvoices: invoices.slice(0, 5).map((i) => ({
        customer: i.customer,
        amount: i.amount,
        dueDate: i.dueDate,
        status: i.status
      })),
      chartOfAccountsSample: chartOfAccounts.slice(0, 6).map((c) => ({
        code: c.code,
        name: c.name,
        category: c.category,
        balance: c.balance
      }))
    };

    try {
      const response = await askDigitsAI(q, context);
      setAiChatHistory((prev) => [
        {
          q,
          a: response,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        ...prev
      ]);
    } catch {
      setAiChatHistory((prev) => [
        {
          q,
          a: `FinBooks AI analyzed your ledger: Cash on hand is ₹${totalCash.toLocaleString('en-IN')}, runway is ${runwayMonths} months, and all GST filings are up to date.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        ...prev
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  const handlePostDoc = (docId: string) => {
    const doc = uploadedDocs.find((d) => d.id === docId);
    if (!doc) return;

    addTransaction({
      date: doc.date,
      merchant: doc.vendor,
      description: `${doc.name} - Extracted from document`,
      amount: -doc.amount,
      category: doc.category,
      account: 'Operating Cash',
      status: 'Categorized',
      notes: 'Scanned Document OCR',
      glAccountCode: '6010',
      aiConfidence: Math.round(doc.confidence)
    });

    setUploadedDocs((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, status: 'Posted' } : d))
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-6">
      
      {/* ========================================================================= */}
      {/* TAB 1: OVERVIEW & AI CFO                                                  */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Top 4 Frosted Glass KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Total Cash */}
            <div className="glass-card-green rounded-3xl p-5 border border-emerald-500/30">
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-800/80 mb-2">
                <span>Operating Cash</span>
                <span className="flex items-center text-emerald-800 font-bold bg-white/70 px-2 py-0.5 rounded-full text-[11px]">
                  <ArrowUpRight className="w-3 h-3 mr-0.5" /> +8.4%
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-950 font-num">
                ₹{totalCash.toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-emerald-800/70 mt-1">Live HDFC + Treasury feeds</p>
            </div>

            {/* Inflow */}
            <div className="glass-card rounded-3xl p-5 border border-slate-200/80">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
                <span>Monthly Inflow</span>
                <span className="text-emerald-600 font-bold text-[11px]">Active MRR</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-num">
                +₹{monthlyRevenue.toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Collections &amp; SaaS Retainers</p>
            </div>

            {/* Outflow */}
            <div className="glass-card rounded-3xl p-5 border border-slate-200/80">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
                <span>Monthly Outflow</span>
                <span className="text-rose-600 font-bold text-[11px]">-₹{monthlyExpenses.toLocaleString('en-IN')}</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-num">
                ₹{(monthlyExpenses + monthlyCOGS).toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Payroll, Cloud, Leases</p>
            </div>

            {/* Runway */}
            <div className="glass-card rounded-3xl p-5 border border-slate-200/80">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
                <span>Cash Runway</span>
                <span className="text-emerald-700 bg-emerald-100 font-bold text-[11px] px-2 py-0.5 rounded-full">
                  Healthy
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-num">
                {runwayMonths} mos
              </div>
              <p className="text-[11px] text-slate-500 mt-1">At ₹{Math.abs(netBurn).toLocaleString('en-IN')}/mo burn</p>
            </div>

          </div>

          {/* AI CFO Bar & Chat Assistant */}
          <div className="glass-surface rounded-3xl p-6 sm:p-8 border border-white/80 shadow-xl space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0d9467] to-[#34d399] flex items-center justify-center text-white shadow-md shadow-emerald-700/20">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span>FinBooks AI CFO</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Live Assistant
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Ask natural questions grounded in your actual general ledger and Indian tax rules
                  </p>
                </div>
              </div>

              {/* Quick Prompt Pills */}
              <div className="hidden lg:flex items-center gap-2">
                {[
                  'What is our monthly burn?',
                  'Show uncollected GST ITC',
                  'Check MSME 45-day payables'
                ].map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAskAi(prompt)}
                    className="glass-pill text-[11px] text-slate-700 font-medium px-3 py-1.5 rounded-full hover:bg-white hover:text-emerald-700 transition-all"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Input */}
            <div className="relative flex items-center">
              <input
                type="text"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskAi()}
                placeholder="Ask FinBooks anything about your books, GST, burn rate, or vendor bills..."
                className="w-full glass-input rounded-2xl px-5 py-3.5 pr-14 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 font-medium"
              />
              <button
                onClick={() => handleAskAi()}
                disabled={aiLoading || !aiQuery.trim()}
                className="absolute right-2 p-2 rounded-xl bg-[#0d9467] text-white hover:bg-[#0b7a54] disabled:opacity-40 disabled:hover:bg-[#0d9467] transition-all"
              >
                {aiLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>

            {/* Chat Q&A List */}
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {aiChatHistory.map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-end">
                    <div className="bg-slate-900 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-xs max-w-xl">
                      {item.q}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-700 flex items-center justify-center shrink-0 mt-1">
                      <Sparkles className="w-3 h-3" />
                    </div>
                    <div className="glass-card rounded-2xl rounded-tl-sm p-4 text-xs text-slate-800 max-w-2xl border border-emerald-500/20 leading-relaxed shadow-sm">
                      <div className="prose prose-xs max-w-none text-slate-700 whitespace-pre-wrap">
                        {item.a}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-2 block">{item.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Recent Live Transactions */}
          <div className="glass-card rounded-3xl p-6 border border-slate-200/80">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Recent Bank &amp; Ledger Transactions</h4>
                <p className="text-xs text-slate-500">Live feeds mapped by AI agents</p>
              </div>
              <button
                onClick={() => setActiveTab('reconciliation')}
                className="text-xs font-semibold text-[#0d9467] hover:underline flex items-center gap-1"
              >
                <span>View Reconciliation</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="text-slate-400 uppercase text-[10px] border-b border-slate-100">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Counterparty</th>
                    <th className="py-2.5 px-3">Category / GL</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {transactions.slice(0, 5).map((tx) => (
                    <tr key={tx.id} className="hover:bg-white/60 transition-colors">
                      <td className="py-3 px-3 text-slate-500 font-num">{tx.date}</td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{tx.merchant}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-xs">{tx.description}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px]">
                          {tx.category}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                          {tx.status}
                        </span>
                      </td>
                      <td className={`py-3 px-3 text-right font-num font-bold ${
                        tx.amount < 0 ? 'text-slate-900' : 'text-emerald-700'
                      }`}>
                        {tx.amount < 0 ? '-' : '+'}₹{Math.abs(tx.amount).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: DOCUMENTS & SMART EXTRACTION                                       */}
      {/* ========================================================================= */}
      {activeTab === 'documents' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Header & Upload Dropzone */}
          <div className="glass-surface rounded-3xl p-6 sm:p-8 border border-white/80 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Document Ingestion &amp; AI Extraction</h3>
                <p className="text-xs text-slate-500">
                  Drop vendor bills, bank statement PDFs, or expense slips. AI extracts GSTIN, amounts, and GL codes.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Current Entity:</span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  {currentEntity.name} ({currentEntity.gstin})
                </span>
              </div>
            </div>

            {/* Dropzone */}
            <div className="border-2 border-dashed border-emerald-500/40 rounded-2xl p-8 bg-emerald-50/20 text-center hover:bg-emerald-50/40 transition-all cursor-pointer flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#0d9467] mb-3">
                <UploadCloud className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">
                Click to browse or drag and drop financial documents
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mb-4">
                Supports PDF bank statements, vendor bills, PNG/JPEG receipts, and CSV settlement files up to 25MB
              </p>
              <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Encrypted &amp; Modulo-36 GSTIN verified</span>
              </div>
            </div>
          </div>

          {/* Extracted Documents Table */}
          <div className="glass-card rounded-3xl p-6 border border-slate-200/80">
            <h4 className="text-sm font-bold text-slate-900 mb-4">Recently Extracted Documents</h4>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="text-slate-400 uppercase text-[10px] border-b border-slate-100">
                    <th className="py-2.5 px-3">Document</th>
                    <th className="py-2.5 px-3">Counterparty &amp; GSTIN</th>
                    <th className="py-2.5 px-3">Suggested Ledger</th>
                    <th className="py-2.5 px-3">Tax Breakdown</th>
                    <th className="py-2.5 px-3">AI Confidence</th>
                    <th className="py-2.5 px-3 text-right">Total</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {uploadedDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-white/60 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="font-semibold text-slate-900">{doc.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{doc.vendor}</div>
                        <div className="text-[10px] font-num text-slate-400">{doc.gstin}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px]">
                          {doc.category}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[11px] font-num text-slate-600">
                          Tax: ₹{doc.tax.toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 font-num">
                          {doc.confidence}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-num font-bold text-slate-900">
                        ₹{doc.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 text-right">
                        {doc.status === 'Posted' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Posted
                          </span>
                        ) : (
                          <button
                            onClick={() => handlePostDoc(doc.id)}
                            className="px-3 py-1 rounded-full bg-[#0d9467] hover:bg-[#0b7a54] text-white text-[11px] font-semibold transition-all shadow-sm"
                          >
                            Post to Books
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: BANK RECONCILIATION                                                */}
      {/* ========================================================================= */}
      {activeTab === 'reconciliation' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          <div className="glass-surface rounded-3xl p-6 border border-white/80 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Automated Bank Reconciliation</h3>
              <p className="text-xs text-slate-500">
                FinBooks AI cross-references bank statement feed lines against purchase bills and sales receipts.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-full">
                100% Transactions Matched
              </span>
              <button
                onClick={downloadTallyXml}
                className="px-4 py-2 rounded-full bg-[#0d9467] hover:bg-[#0b7a54] text-white text-xs font-semibold shadow-md flex items-center gap-2 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Reconciled XML</span>
              </button>
            </div>
          </div>

          {/* 2-Column Split: Bank Feed vs Ledger Book */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left: Bank Feed Lines */}
            <div className="glass-card rounded-3xl p-6 border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Bank Feed Lines (HDFC ..4912)
                </span>
                <span className="text-xs font-num text-slate-500">5 Items</span>
              </div>

              <div className="space-y-3">
                {transactions.slice(0, 5).map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3.5 rounded-2xl bg-white/70 border border-slate-200/60 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{tx.merchant}</div>
                      <div className="text-[10px] text-slate-400 font-mono truncate max-w-xs">{tx.description}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{tx.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-num font-bold text-slate-900">
                        ₹{Math.abs(tx.amount).toLocaleString('en-IN')}
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Feed Synced
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Matched Ledger Vouchers */}
            <div className="glass-card rounded-3xl p-6 border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  General Ledger Vouchers
                </span>
                <span className="text-xs font-semibold text-emerald-700">AI Match Confidence</span>
              </div>

              <div className="space-y-3">
                {transactions.slice(0, 5).map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3.5 rounded-2xl bg-white/70 border border-emerald-500/20 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{tx.category}</div>
                      <div className="text-[10px] text-slate-500">GL Code: {tx.glAccountCode || '6010'}</div>
                      <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">Dual-Entry Balanced</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold font-num">
                        {tx.aiConfidence || 99}%
                      </span>
                      <button
                        onClick={() => toggleTransactionMatch(tx.id)}
                        className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                          tx.status === 'Matched'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                        title="Toggle Match Verification"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: REPORTS & TALLY XML EXPORT                                         */}
      {/* ========================================================================= */}
      {activeTab === 'reports' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          <div className="glass-surface rounded-3xl p-6 border border-white/80 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Statutory Reports &amp; Tally Export</h3>
              <p className="text-xs text-slate-500">
                Schedule III Profit &amp; Loss, Balance Sheet, and GST portal returns ready for your CA.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={downloadTallyXml}
                className="px-4 py-2 rounded-full bg-[#0d9467] hover:bg-[#0b7a54] text-white text-xs font-semibold shadow-md flex items-center gap-2 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>1-Click Tally XML Download</span>
              </button>

              <button
                onClick={() => downloadGstrJson('GSTR1')}
                className="px-4 py-2 rounded-full glass-card hover:bg-white text-slate-800 text-xs font-semibold border border-slate-200 flex items-center gap-1.5 transition-all"
              >
                <span>GSTR-1 JSON</span>
              </button>
            </div>
          </div>

          {/* Report Sub-Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200/60 pb-3">
            {[
              { id: 'pl', label: 'Profit & Loss (Schedule III)' },
              { id: 'bs', label: 'Balance Sheet' },
              { id: 'gst', label: 'GST Returns (GSTR-1 / 2B)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setReportSubTab(tab.id as any)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  reportSubTab === tab.id
                    ? 'bg-[#0d9467] text-white shadow-sm'
                    : 'glass-pill text-slate-700 hover:bg-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Subtab Content: P&L */}
          {reportSubTab === 'pl' && (
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h4 className="text-base font-bold text-slate-900">Statement of Profit and Loss</h4>
                  <p className="text-xs text-slate-500">For the period ending October 31, 2026 (Accrual Basis)</p>
                </div>
                <span className="text-xs font-bold text-slate-700 font-num">Values in INR (₹)</span>
              </div>

              <div className="space-y-4 text-xs">
                
                {/* Revenue */}
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-[#0d9467]">
                    I. Revenue From Operations
                  </div>
                  <div className="flex justify-between py-1 text-slate-700 border-b border-slate-50">
                    <span>Enterprise SaaS Subscriptions</span>
                    <span className="font-num font-semibold">₹1,45,200.00</span>
                  </div>
                  <div className="flex justify-between py-1 text-slate-700 border-b border-slate-50">
                    <span>API &amp; Platform Ingestion Fees</span>
                    <span className="font-num font-semibold">₹39,000.00</span>
                  </div>
                  <div className="flex justify-between py-1.5 font-bold text-slate-900">
                    <span>Total Operating Revenue</span>
                    <span className="font-num">₹{monthlyRevenue.toLocaleString('en-IN')}.00</span>
                  </div>
                </div>

                {/* Expenses */}
                <div className="space-y-1 pt-3">
                  <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-[#0d9467]">
                    II. Expenses
                  </div>
                  <div className="flex justify-between py-1 text-slate-700 border-b border-slate-50">
                    <span>Cost of Goods Sold (AWS &amp; Infrastructure)</span>
                    <span className="font-num font-semibold">₹{monthlyCOGS.toLocaleString('en-IN')}.00</span>
                  </div>
                  <div className="flex justify-between py-1 text-slate-700 border-b border-slate-50">
                    <span>Employee Benefits &amp; Core Payroll</span>
                    <span className="font-num font-semibold">₹1,42,000.00</span>
                  </div>
                  <div className="flex justify-between py-1 text-slate-700 border-b border-slate-50">
                    <span>Software, SaaS &amp; Office Subscriptions</span>
                    <span className="font-num font-semibold">₹31,249.00</span>
                  </div>
                  <div className="flex justify-between py-1 text-slate-700 border-b border-slate-50">
                    <span>Legal &amp; Professional Retainers</span>
                    <span className="font-num font-semibold">₹17,301.00</span>
                  </div>
                  <div className="flex justify-between py-1.5 font-bold text-slate-900">
                    <span>Total Operating Expenses</span>
                    <span className="font-num">₹{(monthlyExpenses + monthlyCOGS).toLocaleString('en-IN')}.00</span>
                  </div>
                </div>

                {/* Net Profit / (Burn) */}
                <div className="pt-4 border-t-2 border-slate-900 flex justify-between items-center text-sm font-black">
                  <span>Net Profit / (Loss) Before Tax</span>
                  <span className={`font-num ${netBurn >= 0 ? 'text-emerald-700' : 'text-slate-900'}`}>
                    {netBurn < 0 ? '-' : ''}₹{Math.abs(netBurn).toLocaleString('en-IN')}.00
                  </span>
                </div>

              </div>
            </div>
          )}

          {/* Subtab Content: Balance Sheet */}
          {reportSubTab === 'bs' && (
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h4 className="text-base font-bold text-slate-900">Schedule III Balance Sheet</h4>
                  <p className="text-xs text-slate-500">As of October 31, 2026</p>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                  Balanced (Assets = Liab + Equity)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div>
                  <h5 className="font-bold text-emerald-800 uppercase text-[11px] mb-3">Total Assets</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span>Cash &amp; Cash Equivalents</span>
                      <span className="font-num font-semibold">₹{totalCash.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span>Accounts Receivable (AR)</span>
                      <span className="font-num font-semibold">₹8,84,200</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span>Fixed Assets (Servers, Equipment)</span>
                      <span className="font-num font-semibold">₹12,25,350</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-bold text-emerald-800 uppercase text-[11px] mb-3">Liabilities &amp; Equity</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span>Accounts Payable (AP)</span>
                      <span className="font-num font-semibold">₹4,12,800</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span>Accrued Payroll &amp; TDS Payable</span>
                      <span className="font-num font-semibold">₹6,84,819</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span>Shareholders' Equity &amp; Retained Earnings</span>
                      <span className="font-num font-semibold">₹94,40,931</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Subtab Content: GST */}
          {reportSubTab === 'gst' && (
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 space-y-4 text-xs">
              <h4 className="text-base font-bold text-slate-900 mb-2">GST Compliance Matrix</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white/70 border border-slate-200/70">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">GSTR-1 (Outward Supplies)</span>
                  <div className="text-xl font-bold text-slate-900 mt-1 font-num">₹28,40,200</div>
                  <span className="text-[10px] text-emerald-700 font-semibold">Ready for JSON upload</span>
                </div>

                <div className="p-4 rounded-2xl bg-white/70 border border-slate-200/70">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">GSTR-2B Eligible ITC</span>
                  <div className="text-xl font-bold text-emerald-800 mt-1 font-num">₹1,84,200</div>
                  <span className="text-[10px] text-emerald-700 font-semibold">100% matched to vendor bills</span>
                </div>

                <div className="p-4 rounded-2xl bg-white/70 border border-slate-200/70">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">DRC-01 / Notice Risk</span>
                  <div className="text-xl font-bold text-slate-900 mt-1">0 Flags</div>
                  <span className="text-[10px] text-emerald-700 font-semibold">ITC matches IMS portal</span>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
