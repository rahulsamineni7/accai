import React, { useState } from 'react';
import { useDigits } from '../../context/DigitsContext';
import {
  TrendingUp,
  CreditCard,
  PieChart,
  DollarSign,
  Activity,
  Search,
  Download,
  Plus,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  Bot,
  Sliders,
  ExternalLink,
  MoreVertical,
  X,
  FileSpreadsheet
} from 'lucide-react';

interface GLRow {
  code: string;
  name: string;
  badge?: string;
  origin: string;
  gaapClass: string;
  balance: number;
  balanceSubtitle?: string;
  statusBadge: string;
  statusIcon?: string;
}

interface GLGroup {
  id: string;
  range: string;
  title: string;
  normalBalance: 'Debit Normal Balance' | 'Credit Normal Balance';
  total: number;
  accounts: GLRow[];
}

export const ChartOfAccountsView: React.FC = () => {
  const { showNotification, setActiveView, formatAmount, currency } = useDigits();

  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Accordion open/close state
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    '1000': true,
    '2000': true,
    '3000': true,
    '4000': true,
    '5000': true,
    '6000': true
  });

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  // Add Account form state
  const [modalCode, setModalCode] = useState('');
  const [modalCat, setModalCat] = useState('1000');
  const [modalTitle, setModalTitle] = useState('');
  const [modalDesc, setModalDesc] = useState('');

  // The 16 GAAP Chart of Accounts from the Stitch Screen
  const [groups, setGroups] = useState<GLGroup[]>([
    {
      id: '1000',
      range: '1000–1999',
      title: 'Assets',
      normalBalance: 'Debit Normal Balance',
      total: 14820450.00,
      accounts: [
        {
          code: '1010',
          name: 'Operating Cash',
          badge: 'Live Feed',
          origin: 'Mercury Bank • Checking (•• 4912)',
          gaapClass: 'Current Asset (Cash & Equiv)',
          balance: 4210900.00,
          balanceSubtitle: 'Reconciled today',
          statusBadge: '100% Synced'
        },
        {
          code: '1020',
          name: 'Treasury Yield Fund',
          badge: '4.85% APY',
          origin: 'BlackRock MMF Institutional (•• 8011)',
          gaapClass: 'Short-Term Liquidity',
          balance: 8500000.00,
          balanceSubtitle: '+$34,354 interest YTD',
          statusBadge: 'Daily Nav Hook'
        },
        {
          code: '1100',
          name: 'Accounts Receivable',
          origin: 'Stripe Billing + Direct Wire Receivables',
          gaapClass: 'Current Receivables',
          balance: 884200.00,
          balanceSubtitle: '98.2% current (<30d)',
          statusBadge: 'AI Dunning Active'
        },
        {
          code: '1500',
          name: 'GPU Hardware & Servers',
          origin: 'H100 8-way Clusters (Colocation TX-2)',
          gaapClass: 'Fixed Asset (CapEx)',
          balance: 1225350.00,
          balanceSubtitle: 'Depreciated 36mo SL',
          statusBadge: 'Gemini Tagged'
        }
      ]
    },
    {
      id: '2000',
      range: '2000–2999',
      title: 'Liabilities',
      normalBalance: 'Credit Normal Balance',
      total: 1240110.00,
      accounts: [
        {
          code: '2010',
          name: 'Corporate Credit Card',
          badge: 'Auto-Pay Active',
          origin: 'Brex Multi-Currency Master Account',
          gaapClass: 'Revolving Liability',
          balance: 142500.00,
          balanceSubtitle: 'Due Oct 31 • In Limit',
          statusBadge: 'Receipts Matched'
        },
        {
          code: '2020',
          name: 'Accounts Payable',
          origin: 'Vendor Invoices & Hardware Commitments',
          gaapClass: 'Current AP (Trade)',
          balance: 412800.00,
          balanceSubtitle: '14 Approved bills',
          statusBadge: 'Bill Pay Linked'
        },
        {
          code: '2100',
          name: 'Accrued Engineering Payroll',
          origin: 'Gusto Automated Compensation Integration',
          gaapClass: 'Accrued Liabilities',
          balance: 684810.00,
          balanceSubtitle: 'Next run: Oct 31',
          statusBadge: 'Gusto Synced'
        }
      ]
    },
    {
      id: '3000',
      range: '3000–3999',
      title: "Stockholders' Equity",
      normalBalance: 'Credit Normal Balance',
      total: 13580340.00,
      accounts: [
        {
          code: '3010',
          name: 'Common Stock',
          origin: 'Par Value $0.0001 (10,000,000 Authorized Shares)',
          gaapClass: 'Legal Capital',
          balance: 100000.00,
          balanceSubtitle: 'Carta cap table sync',
          statusBadge: 'Audited'
        },
        {
          code: '3020',
          name: 'Additional Paid-In Capital',
          badge: 'Series A',
          origin: 'Series A SAFE & Seed Preferred Conversions',
          gaapClass: 'Contributed Capital',
          balance: 12500000.00,
          balanceSubtitle: 'Post-Money Ledger',
          statusBadge: 'Legal Stamped'
        },
        {
          code: '3050',
          name: 'Retained Earnings',
          origin: 'Cumulative Prior Years Retained Profit',
          gaapClass: 'Accumulated Earnings',
          balance: 980340.00,
          balanceSubtitle: 'Closed FY2024',
          statusBadge: 'Closed Prior Period'
        }
      ]
    },
    {
      id: '4000',
      range: '4000–4999',
      title: 'Revenue (Top Line)',
      normalBalance: 'Credit Normal Balance',
      total: 4890200.00,
      accounts: [
        {
          code: '4010',
          name: 'Enterprise AI Subscriptions',
          badge: 'ARR',
          origin: 'Annual Enterprise Licenses & SLA Tiers',
          gaapClass: 'Operating Revenue (Recurring)',
          balance: 3420000.00,
          balanceSubtitle: 'ASC 606 Compliant',
          statusBadge: 'Amortized Daily'
        },
        {
          code: '4020',
          name: 'API Usage & Token Fees',
          origin: 'Metered Ingestion, Embeddings & Fine-tuning',
          gaapClass: 'Usage-Based Revenue',
          balance: 1470200.00,
          balanceSubtitle: 'Real-time webhook sync',
          statusBadge: 'Direct Webhook'
        }
      ]
    },
    {
      id: '5000',
      range: '5000–5999',
      title: 'Cost of Goods Sold (COGS)',
      normalBalance: 'Debit Normal Balance',
      total: 940500.00,
      accounts: [
        {
          code: '5010',
          name: 'Cloud Inference Compute',
          origin: 'AWS Bedrock & CoreWeave Multi-Region H100s',
          gaapClass: 'Direct Infrastructure Cost',
          balance: 940500.00,
          balanceSubtitle: '19.2% of Gross Rev',
          statusBadge: 'Unit Margin: 80.8%'
        }
      ]
    },
    {
      id: '6000',
      range: '6000–6999',
      title: 'Operating Expenses (OPEX)',
      normalBalance: 'Debit Normal Balance',
      total: 2140800.00,
      accounts: [
        {
          code: '6010',
          name: 'Engineering & Core Payroll',
          origin: '18 Full-Time Employees + Benefits & Health',
          gaapClass: 'R&D Personnel',
          balance: 1420000.00,
          balanceSubtitle: 'Gusto Live Feed',
          statusBadge: 'R&D Tax Credit Tagged'
        },
        {
          code: '6020',
          name: 'Software & SaaS Subscriptions',
          origin: 'OpenAI API, GitHub Enterprise, Datadog, Slack',
          gaapClass: 'General Software OPEX',
          balance: 312400.00,
          balanceSubtitle: '24 vendors active',
          statusBadge: '99.8% Auto-Categorized'
        },
        {
          code: '6050',
          name: 'Legal & Corporate Governance',
          origin: 'Gunderson Dettmer Retainer & IP Patent Filings',
          gaapClass: 'Professional Services',
          balance: 115000.00,
          balanceSubtitle: 'Retainer locked',
          statusBadge: 'W-9 On File'
        }
      ]
    }
  ]);

  const handleAddAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalCode || !modalTitle) return;

    const targetGroup = groups.find((g) => g.id === modalCat);
    if (targetGroup) {
      const newAcc: GLRow = {
        code: modalCode,
        name: modalTitle,
        origin: modalDesc || 'Manual General Ledger Entry',
        gaapClass: `${targetGroup.title} Sub-ledger`,
        balance: 0,
        balanceSubtitle: 'Newly minted',
        statusBadge: 'Gemini Verified'
      };

      setGroups((prev) =>
        prev.map((g) => (g.id === modalCat ? { ...g, accounts: [...g.accounts, newAcc] } : g))
      );
    }

    showNotification(`GL Account #${modalCode} successfully minted to General Ledger`);
    setModalCode('');
    setModalTitle('');
    setModalDesc('');
    setIsAddModalOpen(false);
  };

  // Filter groups and accounts
  const displayedGroups = groups
    .filter((g) => (activeFilter === 'all' ? true : g.id === activeFilter))
    .map((g) => {
      const filteredAccounts = g.accounts.filter(
        (a) =>
          a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.code.includes(searchTerm) ||
          a.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.gaapClass.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return {
        ...g,
        accounts: filteredAccounts
      };
    })
    .filter((g) => g.accounts.length > 0 || !searchTerm);

  const totalAccountsCount = groups.reduce((acc, g) => acc + g.accounts.length, 0);

  return (
    <div className="flex flex-col w-full relative pb-12 animate-in fade-in duration-200">
      {/* Dynamic Ambient Glowing Light Nodes from Stitch Screen */}
      <div className="absolute -top-40 -right-24 w-96 h-96 rounded-full bg-[#6ffbbe] opacity-20 blur-[130px] pointer-events-none" />
      <div className="absolute top-96 -left-32 w-[30rem] h-[30rem] rounded-full bg-[#85f8c4] opacity-15 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 rounded-full bg-[#dae2fd] opacity-40 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[1440px] mx-auto space-y-6 relative z-10">
        {/* Screen Title & Top Meta Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-[#6d7a72] text-[11px] tracking-wider uppercase mb-1 font-semibold">
              <span>General Ledger Engine</span>
              <span>/</span>
              <span className="text-[#006948] font-bold">GAAP Dual-Entry Matrix</span>
            </div>
            <div className="flex items-baseline gap-3 flex-wrap">
              <h1 className="text-3xl font-bold text-[#131b2e] tracking-tight">Chart of Accounts</h1>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eaedff] text-[#006c49] text-xs font-semibold">
                <span className="inline-block w-2 h-2 rounded-full bg-[#006c49] animate-pulse" />
                US GAAP • Accrual Basis
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-[#eaedff]">
              <ShieldCheck className="w-4 h-4 text-[#006c49]" />
              <span className="text-xs font-mono text-[#131b2e]">
                Auto-Balanced: <strong className="text-[#006c49] font-bold">Δ $0.00</strong>
              </span>
            </div>

            <button
              onClick={() => showNotification('Audit Log: zero variances detected across all 6 ledgers')}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white hover:bg-[#f2f3ff] text-[#131b2e] text-xs font-medium shadow-sm border border-[#eaedff] transition-all active:scale-95"
              type="button"
            >
              <Activity className="w-4 h-4 text-[#6d7a72]" />
              <span>Audit Log</span>
            </button>
          </div>
        </div>

        {/* Top 5 Key Financial Metrics / Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Total Assets */}
          <div className="flex flex-col justify-between p-4 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[#6d7a72]">1000 Total Assets</span>
              <DollarSign className="w-4 h-4 text-[#006c49] group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold font-mono text-[#131b2e] tracking-tight">{formatAmount(14820450)}</div>
              <div className="flex items-center gap-1 mt-1 text-xs">
                <TrendingUp className="w-3.5 h-3.5 text-[#006c49]" />
                <span className="font-mono text-[#006c49] font-semibold">+8.4% MoM</span>
                <span className="text-[11px] text-[#6d7a72] ml-1">Mercury + MMF</span>
              </div>
            </div>
          </div>

          {/* Total Liabilities */}
          <div className="flex flex-col justify-between p-4 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[#6d7a72]">2000 Liabilities</span>
              <CreditCard className="w-4 h-4 text-[#6d7a72] group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold font-mono text-[#131b2e] tracking-tight">{formatAmount(1240110)}</div>
              <div className="flex items-center gap-1 mt-1 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#006c49]" />
                <span className="font-mono text-[#006c49] font-semibold">30d DPO Healthy</span>
                <span className="text-[11px] text-[#6d7a72] ml-1">AP + Brex</span>
              </div>
            </div>
          </div>

          {/* Total Equity */}
          <div className="flex flex-col justify-between p-4 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[#6d7a72]">3000 Equity</span>
              <PieChart className="w-4 h-4 text-[#006948] group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold font-mono text-[#006948] tracking-tight">{formatAmount(13580340)}</div>
              <div className="flex items-center gap-1 mt-1 text-xs">
                <span className="font-mono text-[#6d7a72]">A = L + E</span>
                <span className="font-mono text-[#006c49] font-bold ml-1">Strict Match</span>
              </div>
            </div>
          </div>

          {/* YTD Revenue */}
          <div className="flex flex-col justify-between p-4 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[#6d7a72]">4000 YTD Revenue</span>
              <TrendingUp className="w-4 h-4 text-[#006c49] group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold font-mono text-[#131b2e] tracking-tight">{formatAmount(4890200)}</div>
              <div className="flex items-center gap-1 mt-1 text-xs">
                <TrendingUp className="w-3.5 h-3.5 text-[#006c49]" />
                <span className="font-mono text-[#006c49] font-semibold">+19.2% YoY</span>
                <span className="text-[11px] text-[#6d7a72] ml-1">SaaS + Token</span>
              </div>
            </div>
          </div>

          {/* OPEX */}
          <div className="col-span-2 lg:col-span-1 flex flex-col justify-between p-4 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[#6d7a72]">6000 OPEX (YTD)</span>
              <Activity className="w-4 h-4 text-[#6d7a72] group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold font-mono text-[#131b2e] tracking-tight">{formatAmount(2140800)}</div>
              <div className="flex items-center gap-1 mt-1 text-xs">
                <span className="font-mono text-[#6d7a72]">Burn: {formatAmount(178000, { compact: true })}/mo</span>
                <span className="font-mono text-[#006c49] font-bold ml-1">28 mo Run</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Control Toolbar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white/90 backdrop-blur-xl p-3 rounded-2xl border border-[#eaedff] shadow-sm">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeFilter === 'all'
                  ? 'bg-[#006948] text-white shadow-[0_2px_8px_rgba(0,105,72,0.25)]'
                  : 'text-[#6d7a72] hover:text-[#131b2e] hover:bg-[#f2f3ff]'
              }`}
            >
              All Accounts <span className="ml-1 opacity-80 text-[10px] font-mono">{totalAccountsCount}</span>
            </button>
            {groups.map((g) => (
              <button
                key={g.id}
                onClick={() => setActiveFilter(g.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                  activeFilter === g.id
                    ? 'bg-[#006948] text-white shadow-[0_2px_8px_rgba(0,105,72,0.25)]'
                    : 'text-[#6d7a72] hover:text-[#131b2e] hover:bg-[#f2f3ff]'
                }`}
              >
                {g.id} {g.title} <span className="ml-1 opacity-70 text-[10px] font-mono">{g.accounts.length}</span>
              </button>
            ))}
          </div>

          {/* Search, Export & New Account CTA */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6d7a72]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search code, title, feed..."
                className="w-full pl-9 pr-3 py-1.5 rounded-full bg-[#f2f3ff] text-[#131b2e] placeholder:text-[#6d7a72] text-xs focus:outline-none focus:ring-2 focus:ring-[#006948]/30 transition-all"
              />
            </div>

            {/* Export Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] text-xs font-semibold transition-all"
                type="button"
              >
                <Download className="w-3.5 h-3.5 text-[#6d7a72]" />
                <span>Export</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {isExportMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-[#eaedff] p-1.5 z-30 flex flex-col gap-0.5 animate-in fade-in duration-100">
                  <button
                    onClick={() => {
                      setIsExportMenuOpen(false);
                      showNotification('Exported Chart_of_Accounts_GAAP.csv');
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-[#f2f3ff] text-xs font-medium text-[#131b2e] flex items-center justify-between"
                  >
                    <span>CSV (Flat File)</span>
                    <span className="text-[#6d7a72] text-[10px] font-mono">.csv</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsExportMenuOpen(false);
                      showNotification('Exported Chart_of_Accounts_GAAP.xlsx');
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-[#f2f3ff] text-xs font-medium text-[#131b2e] flex items-center justify-between"
                  >
                    <span>Excel Spreadsheet</span>
                    <span className="text-[#6d7a72] text-[10px] font-mono">.xlsx</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsExportMenuOpen(false);
                      showNotification('Exported GAAP_Balance_Sheet_Map.json');
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-[#f2f3ff] text-xs font-medium text-[#131b2e] flex items-center justify-between"
                  >
                    <span>GAAP Balance Sheet Map</span>
                    <span className="text-[#6d7a72] text-[10px] font-mono">.json</span>
                  </button>
                </div>
              )}
            </div>

            {/* Add New GL Account Button */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#006948] hover:bg-[#00855d] text-white text-xs font-semibold shadow-[0_4px_14px_0_rgba(16,185,129,0.35)] active:scale-95 transition-all whitespace-nowrap"
              type="button"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>+ Add New GL Account</span>
            </button>
          </div>
        </div>

        {/* GAAP Double-Entry Architectural Hierarchy Table Container */}
        <div className="bg-white/90 backdrop-blur-2xl rounded-2xl shadow-sm border border-[#eaedff] overflow-hidden flex flex-col">
          {/* Table Master Head */}
          <div className="grid grid-cols-12 gap-2 px-6 py-3 bg-[#f2f3ff] text-[#6d7a72] text-[11px] font-bold uppercase tracking-wider items-center select-none border-b border-[#eaedff]">
            <div className="col-span-2 sm:col-span-1">Code</div>
            <div className="col-span-5 sm:col-span-4">Account Title & Feed Origin</div>
            <div className="hidden sm:block sm:col-span-2">GAAP Classification</div>
            <div className="col-span-3 sm:col-span-2 text-right">Balance (USD)</div>
            <div className="hidden md:block md:col-span-2 text-center">Sync / AI Status</div>
            <div className="col-span-2 sm:col-span-1 text-right pr-2">Actions</div>
          </div>

          {/* Account Groups List */}
          <div className="flex flex-col divide-y divide-[#eaedff]">
            {displayedGroups.map((group) => {
              const isOpen = expandedGroups[group.id] !== false;

              return (
                <div key={group.id} className="flex flex-col">
                  {/* Category Header Accordion Row */}
                  <div
                    onClick={() => toggleGroup(group.id)}
                    className="flex items-center justify-between px-6 py-3.5 bg-[#eaedff]/40 hover:bg-[#eaedff]/70 cursor-pointer transition-colors group select-none"
                  >
                    <div className="flex items-center gap-3">
                      {isOpen ? (
                        <ChevronDown className="w-4 h-4 text-[#006948] group-hover:scale-110 transition-transform" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-[#6d7a72] group-hover:scale-110 transition-transform" />
                      )}
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-sm font-bold text-[#131b2e]">{group.range}</span>
                        <span className="text-sm font-bold text-[#131b2e]">{group.title}</span>
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold ${
                          group.normalBalance.includes('Debit')
                            ? 'bg-[#6cf8bb]/40 text-[#00714d]'
                            : 'bg-[#eaedff] text-[#3d4a42]'
                        }`}>
                          {group.normalBalance}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-xs text-[#6d7a72] hidden sm:inline font-medium">
                        {group.accounts.length} Active Accounts
                      </span>
                      <span className="font-mono text-sm font-bold text-[#131b2e]">
                        {formatAmount(group.total)}
                      </span>
                    </div>
                  </div>

                  {/* Section Account Rows */}
                  {isOpen && (
                    <div className="flex flex-col divide-y divide-[#f2f3ff]">
                      {group.accounts.map((acc) => (
                        <div
                          key={acc.code}
                          className="grid grid-cols-12 gap-2 px-6 py-3 hover:bg-[#f2f3ff]/70 items-center transition-colors text-xs"
                        >
                          {/* Code */}
                          <div className="col-span-2 sm:col-span-1 font-mono font-bold text-[#006948]">
                            {acc.code}
                          </div>

                          {/* Account Title & Feed Origin */}
                          <div className="col-span-5 sm:col-span-4 flex flex-col pr-2">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-[#131b2e]">{acc.name}</span>
                              {acc.badge && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-[#6cf8bb]/40 text-[#00714d] font-semibold font-mono">
                                  {acc.badge === 'Live Feed' && <span className="w-1.5 h-1.5 rounded-full bg-[#006c49]" />}
                                  {acc.badge}
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-[#6d7a72] truncate mt-0.5">{acc.origin}</span>
                          </div>

                          {/* GAAP Classification */}
                          <div className="hidden sm:block sm:col-span-2 text-[#3d4a42]">
                            {acc.gaapClass}
                          </div>

                          {/* Balance */}
                          <div className="col-span-3 sm:col-span-2 text-right">
                            <div className="font-mono font-bold text-[#131b2e]">
                              {formatAmount(acc.balance)}
                            </div>
                            {acc.balanceSubtitle && (
                              <span className="text-[10px] text-[#006c49] font-medium font-mono">
                                {acc.balanceSubtitle}
                              </span>
                            )}
                          </div>

                          {/* Sync / AI Status */}
                          <div className="hidden md:flex md:col-span-2 justify-center">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f2f3ff] text-[#006c49] text-[11px] font-mono font-medium border border-[#eaedff]">
                              <span>{acc.statusBadge}</span>
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="col-span-2 sm:col-span-1 flex items-center justify-end gap-1">
                            <button
                              onClick={() => {
                                setActiveView('transactions');
                                showNotification(`Filtered ledger entries for GL #${acc.code}`);
                              }}
                              className="p-1.5 rounded-full hover:bg-[#eaedff] text-[#6d7a72] hover:text-[#131b2e] transition-colors"
                              title="View Ledger Transactions"
                              type="button"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => showNotification(`Quick options for account #${acc.code}: ${acc.name}`)}
                              className="p-1.5 rounded-full hover:bg-[#eaedff] text-[#6d7a72] hover:text-[#131b2e] transition-colors"
                              title="More Options"
                              type="button"
                            >
                              <MoreVertical className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Table Footer with Summary Status matching Stitch */}
          <div className="px-6 py-3.5 bg-[#f2f3ff] border-t border-[#eaedff] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#6d7a72]">
            <div className="flex items-center gap-3">
              <span>Showing 16 GAAP GL Accounts across 6 ledgers</span>
              <span className="hidden md:inline">•</span>
              <span className="hidden md:inline text-[#006c49] font-semibold">No suspended journals detected</span>
            </div>
            <div className="flex items-center gap-2 font-mono">
              <span>
                Total Balance Precision: <strong className="text-[#131b2e]">$0.00 Variance</strong>
              </span>
              <Lock className="w-3.5 h-3.5 text-[#006c49]" />
            </div>
          </div>
        </div>

        {/* Architectural Insights & AI Suggestions Bento Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* AI Ledger Synthesis Card */}
          <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#006c49] mb-2">
                <Bot className="w-4 h-4" />
                <span className="text-[11px] uppercase tracking-wider font-bold">Gemini 2.5 GL Audit</span>
              </div>
              <h2 className="text-base font-bold text-[#131b2e] mb-1">R&D Tax Credit Opportunity</h2>
              <p className="text-xs text-[#6d7a72] leading-relaxed">
                Digits AI flagged <strong className="text-[#131b2e] font-semibold">$380,400.00</strong> of Cloud Inference (Acct 5010) as eligible for the Federal Section 41 R&D tax credit.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#eaedff] flex items-center justify-between">
              <button
                onClick={() => showNotification('Generating Form 6765 Dossier with Gemini 2.5 Flash...')}
                className="text-[#006948] hover:text-[#00855d] text-xs font-semibold flex items-center gap-1 transition-colors"
                type="button"
              >
                <span>Generate IRS Form 6765 Dossier</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono text-[#006c49] bg-[#6cf8bb]/40 px-2.5 py-0.5 rounded-full font-semibold">
                99.4% Match
              </span>
            </div>
          </div>

          {/* Quick Ledger Health Breakdown Card */}
          <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#006948] mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[11px] uppercase tracking-wider font-bold">Accounting Integrity</span>
              </div>
              <h2 className="text-base font-bold text-[#131b2e] mb-1">Dual-Entry Verification</h2>
              <div className="space-y-2 mt-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[#6d7a72]">Debits Total</span>
                  <span className="font-mono font-bold text-[#131b2e]">$17,901,750.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#6d7a72]">Credits Total</span>
                  <span className="font-mono font-bold text-[#131b2e]">$17,901,750.00</span>
                </div>
                <div className="w-full bg-[#eaedff] rounded-full h-1.5 overflow-hidden">
                  <div className="bg-[#006c49] h-full rounded-full w-full" />
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#eaedff] flex items-center justify-between text-xs text-[#6d7a72]">
              <span>Formula: Assets + OPEX + COGS = Liab + Eq + Rev</span>
              <span className="text-[#006c49] font-bold">100% Balanced</span>
            </div>
          </div>

          {/* Fast Ledger Settings & Rules Shortcut Card */}
          <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#6d7a72] mb-2">
                <Sliders className="w-4 h-4" />
                <span className="text-[11px] uppercase tracking-wider font-bold">Automated Routing</span>
              </div>
              <h2 className="text-base font-bold text-[#131b2e] mb-1">Rules Engine Status</h2>
              <p className="text-xs text-[#6d7a72] leading-relaxed">
                42 active algorithmic rules auto-categorize bank transactions directly into these GL codes with zero manual intervention.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#eaedff] flex items-center justify-between">
              <button
                onClick={() => setActiveView('rules')}
                className="px-3.5 py-1.5 rounded-full bg-[#eaedff] hover:bg-[#e2e7ff] text-[#131b2e] text-xs font-semibold transition-all inline-flex items-center gap-1.5"
                type="button"
              >
                <Sliders className="w-3.5 h-3.5 text-[#006948]" />
                <span>Manage Rules (42)</span>
              </button>
              <span className="font-mono text-xs text-[#006c49] font-semibold">99.1% Auto-match</span>
            </div>
          </div>
        </div>

        {/* Modal: + Add New GL Account matching Stitch */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 bg-[#131b2e]/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl p-6 flex flex-col gap-4 border border-[#eaedff] animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-[#eaedff]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-[#006948]/10 flex items-center justify-center text-[#006948]">
                    <Plus className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#131b2e]">Add GL Account</h3>
                    <p className="text-xs text-[#6d7a72]">Architectural Chart of Accounts Expansion</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-[#f2f3ff] flex items-center justify-center text-[#6d7a72] hover:text-[#131b2e]"
                  type="button"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddAccountSubmit} className="flex flex-col gap-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#6d7a72]">
                      Account Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={modalCode}
                      onChange={(e) => setModalCode(e.target.value)}
                      placeholder="e.g. 1030 or 6030"
                      className="px-3.5 py-2 rounded-xl bg-[#f2f3ff] text-[#131b2e] font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#006948]"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#6d7a72]">
                      Category Tier *
                    </label>
                    <select
                      value={modalCat}
                      onChange={(e) => setModalCat(e.target.value)}
                      className="px-3.5 py-2 rounded-xl bg-[#f2f3ff] text-[#131b2e] text-xs focus:outline-none focus:ring-2 focus:ring-[#006948]"
                    >
                      <option value="1000">1000 - Assets</option>
                      <option value="2000">2000 - Liabilities</option>
                      <option value="3000">3000 - Equity</option>
                      <option value="4000">4000 - Revenue</option>
                      <option value="5000">5000 - COGS</option>
                      <option value="6000">6000 - Operating Expenses</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#6d7a72]">
                    Account Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={modalTitle}
                    onChange={(e) => setModalTitle(e.target.value)}
                    placeholder="e.g. Marketing & Performance Ads"
                    className="px-3.5 py-2 rounded-xl bg-[#f2f3ff] text-[#131b2e] text-xs focus:outline-none focus:ring-2 focus:ring-[#006948]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#6d7a72]">
                    Description / Bank Mapping
                  </label>
                  <textarea
                    rows={2}
                    value={modalDesc}
                    onChange={(e) => setModalDesc(e.target.value)}
                    placeholder="Describe normal transactions or bank feeds mapped here..."
                    className="px-3.5 py-2 rounded-xl bg-[#f2f3ff] text-[#131b2e] text-xs focus:outline-none focus:ring-2 focus:ring-[#006948]"
                  />
                </div>

                <div className="p-3 rounded-2xl bg-[#f2f3ff] border border-[#eaedff] flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#006c49] shrink-0 mt-0.5" />
                  <div className="text-[11px] text-[#3d4a42] leading-relaxed">
                    <strong className="text-[#131b2e] font-semibold">Gemini 2.5 Validation:</strong> The rules engine will automatically inspect existing historical journal entries to map transactions matching this newly minted GL account.
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#eaedff]">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-full text-xs text-[#3d4a42] hover:bg-[#f2f3ff] font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-[#006948] hover:bg-[#00855d] text-white text-xs font-semibold shadow-[0_4px_14px_0_rgba(16,185,129,0.35)]"
                  >
                    Mint GL Account
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
