import React, { useState } from 'react';

interface BillItem {
  id: string;
  vendor: string;
  logoLetters: string;
  desc: string;
  invoiceRef: string;
  dateIssued: string;
  dateDue: string;
  glCode: string;
  amount: number;
  status: 'Scheduled ACH' | 'Awaiting Approval' | 'Paid' | 'Processing';
  ocrConfidence: string;
  ein: string;
  disbursementRoute: string;
  netTerms: string;
  lineItems: { label: string; amount: string }[];
}

export const BillPayView: React.FC = () => {
  const [filter, setFilter] = useState<'All' | 'Awaiting Approval' | 'Scheduled' | 'Paid' | 'Overdue'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<BillItem | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [bills, setBills] = useState<BillItem[]>([
    {
      id: 'b1',
      vendor: 'CoreWeave Cloud',
      logoLetters: 'CW',
      desc: 'AI Inference • 64x H100 Cluster Reserved Instances (March)',
      invoiceRef: 'CW-89240-X',
      dateIssued: 'Oct 10, 2024',
      dateDue: 'Due in 3 days',
      glCode: '#5020 • Cloud Compute',
      amount: 84500,
      status: 'Awaiting Approval',
      ocrConfidence: '99.8%',
      ein: 'XX-XXX8921',
      disbursementRoute: 'ACH •••• 9012 (JPMorgan Chase)',
      netTerms: 'Net 15',
      lineItems: [
        { label: 'HGX H100 8-GPU Pods (720 hrs @ $2.20/hr/GPU)', amount: '$50,688.00' },
        { label: 'InfiniBand NDR 400Gbps Dedicated Fabric Tier', amount: '$18,400.00' },
        { label: 'NVMe Lustre Shared Scratch Cluster (200TB)', amount: '$15,412.00' }
      ]
    },
    {
      id: 'b2',
      vendor: 'Latham & Watkins LLP',
      logoLetters: 'LW',
      desc: 'Series B Financing Restructuring & IP Transfer Filings',
      invoiceRef: 'LW-440219',
      dateIssued: 'Oct 08, 2024',
      dateDue: 'Due in 5 days',
      glCode: '#6050 • Legal & Professional',
      amount: 32000,
      status: 'Awaiting Approval',
      ocrConfidence: '99.5%',
      ein: 'XX-XXX4419',
      disbursementRoute: 'Fedwire •••• 8812 (Silicon Valley Bank)',
      netTerms: 'Net 30',
      lineItems: [
        { label: 'Series B Primary Restructuring Documents', amount: '$22,000.00' },
        { label: 'USPTO Global Patent Docketing Review', amount: '$10,000.00' }
      ]
    },
    {
      id: 'b3',
      vendor: 'Datadog, Inc.',
      logoLetters: 'DD',
      desc: 'APM & Infrastructure Observability',
      invoiceRef: '#DD-2024-9982',
      dateIssued: 'Oct 12, 2024',
      dateDue: 'Due Oct 27 (11d)',
      glCode: '#5040 • SaaS Monitoring',
      amount: 8400,
      status: 'Scheduled ACH',
      ocrConfidence: '99.9%',
      ein: 'XX-XXX1944',
      disbursementRoute: 'ACH •••• 9012 (JPMorgan Chase)',
      netTerms: 'Net 15',
      lineItems: [
        { label: 'Datadog Pro APM Host Ingestion (40 Hosts)', amount: '$6,200.00' },
        { label: 'Log Management Indexed Retention (15-Day Tier)', amount: '$2,200.00' }
      ]
    },
    {
      id: 'b4',
      vendor: 'OpenAI Platform',
      logoLetters: 'OA',
      desc: 'API Inference Token Consumptions',
      invoiceRef: '#OAI-90812',
      dateIssued: 'Oct 14, 2024',
      dateDue: 'Due in 2 days',
      glCode: '#5015 • LLM API Tokens',
      amount: 22450,
      status: 'Awaiting Approval',
      ocrConfidence: '99.7%',
      ein: 'XX-XXX9010',
      disbursementRoute: 'Corporate Card Auto-Pay (Brex ..8821)',
      netTerms: 'Due on Receipt',
      lineItems: [
        { label: 'GPT-4o Production Inference API Tokens', amount: '$18,950.00' },
        { label: 'Embedding & Real-Time Voice Model Call Allocation', amount: '$3,500.00' }
      ]
    },
    {
      id: 'b5',
      vendor: 'Google Cloud Platform',
      logoLetters: 'GC',
      desc: 'Kubernetes Engine & BigQuery Warehousing',
      invoiceRef: '#GCP-INV-4410',
      dateIssued: 'Oct 01, 2024',
      dateDue: 'Paid Oct 05',
      glCode: '#5010 • Hosting & Cloud',
      amount: 14200,
      status: 'Paid',
      ocrConfidence: '100%',
      ein: 'XX-XXX7721',
      disbursementRoute: 'ACH Direct Debit (Mercury ..4821)',
      netTerms: 'Net 30',
      lineItems: [
        { label: 'Google Kubernetes Engine Enterprise (us-central1)', amount: '$9,800.00' },
        { label: 'BigQuery Slot Reservations & Storage Egress', amount: '$4,400.00' }
      ]
    },
    {
      id: 'b6',
      vendor: 'Figma, Inc.',
      logoLetters: 'FG',
      desc: 'Enterprise Design Organization Seats (16 Users)',
      invoiceRef: '#FIG-9821',
      dateIssued: 'Oct 10, 2024',
      dateDue: 'Due Oct 25 (9d)',
      glCode: '#5045 • Design Software',
      amount: 1200,
      status: 'Scheduled ACH',
      ocrConfidence: '99.9%',
      ein: 'XX-XXX3829',
      disbursementRoute: 'ACH •••• 9012 (JPMorgan Chase)',
      netTerms: 'Net 15',
      lineItems: [
        { label: 'Figma Enterprise Annual Seats (16 Users)', amount: '$1,200.00' }
      ]
    },
    {
      id: 'b7',
      vendor: 'Deel Inc. (Global Payroll)',
      logoLetters: 'DL',
      desc: 'Contractors & EOR Worldwide Payouts',
      invoiceRef: '#DEEL-US-49102',
      dateIssued: 'Oct 15, 2024',
      dateDue: 'Auto-executes today',
      glCode: '#6010 • Contractor Payroll',
      amount: 45000,
      status: 'Processing',
      ocrConfidence: '99.9%',
      ein: 'XX-XXX2188',
      disbursementRoute: 'Auto-Sweep Multi-Currency Wire (Mercury)',
      netTerms: 'Immediate Sweep',
      lineItems: [
        { label: 'Contractor Disbursements — APAC & EMEA Engineering', amount: '$42,500.00' },
        { label: 'Deel Platform EOR Administration Retainer', amount: '$2,500.00' }
      ]
    }
  ]);

  const openInspectionDrawer = (item: BillItem) => {
    setSelectedBill(item);
    setDrawerOpen(true);
  };

  const closeInspectionDrawer = () => {
    setDrawerOpen(false);
  };

  const handleApproveBill = (billId: string) => {
    setBills((prev) =>
      prev.map((b) => (b.id === billId ? { ...b, status: 'Scheduled ACH' } : b))
    );
    setActionNotice(`Approved disbursement for ${bills.find((b) => b.id === billId)?.vendor}. ACH scheduled.`);
    setTimeout(() => setActionNotice(null), 3000);
    if (selectedBill?.id === billId) {
      setDrawerOpen(false);
    }
  };

  const filteredBills = bills.filter((b) => {
    if (filter === 'Awaiting Approval' && b.status !== 'Awaiting Approval') return false;
    if (filter === 'Scheduled' && b.status !== 'Scheduled ACH') return false;
    if (filter === 'Paid' && b.status !== 'Paid') return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        b.vendor.toLowerCase().includes(q) ||
        b.invoiceRef.toLowerCase().includes(q) ||
        b.glCode.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="w-full relative">
      {/* Ambient Luminous Mesh Nodes */}
      <div className="absolute top-0 right-1/4 w-[540px] h-[540px] rounded-full bg-[#6ffbbe]/20 blur-[130px] pointer-events-none -z-10" />
      <div className="absolute top-96 left-10 w-[420px] h-[420px] rounded-full bg-[#85f8c4]/25 blur-[120px] pointer-events-none -z-10" />

      {/* Main Content Wrap with fluid margins */}
      <div className="p-6 lg:p-8 max-w-[1440px] mx-auto w-full space-y-8">
        {/* Top Bar: Contextual Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-widest text-[#006948] font-bold">
                Autonomous Disbursements
              </span>
              <span className="w-1 h-1 rounded-full bg-[#bccac0]" />
              <span className="font-mono text-xs text-[#3d4a42]">ACH • Fedwire • RTP Sync</span>
            </div>
            <h1 className="text-3xl lg:text-4xl text-[#131b2e] tracking-tight font-bold">
              Bill Pay (Accounts Payable)
            </h1>
            <p className="text-sm text-[#3d4a42] max-w-2xl">
              Automated multi-entity invoice ingestion, OCR parsing via Gemini 2.5, and dual-custody approval workflows for corporate disbursements.
            </p>
          </div>

          {/* Quick Action Controls */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => openInspectionDrawer(bills[0])}
              className="group flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/90 backdrop-blur-xl text-[#131b2e] hover:bg-[#eaedff] transition-all shadow-sm border border-[#eaedff]"
              type="button"
            >
              <span className="material-symbols-outlined text-[#006948] text-lg group-hover:rotate-12 transition-transform">
                document_scanner
              </span>
              <span className="text-xs font-semibold">Upload Invoice PDF</span>
              <span className="text-[10px] bg-[#6cf8bb]/60 text-[#00714d] px-2 py-0.5 rounded-full font-bold">
                OCR Auto
              </span>
            </button>
            <button
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#006948] hover:bg-[#00855d] text-white text-xs font-semibold shadow-[0_4px_14px_0_rgba(16,185,129,0.35)] active:scale-95 transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-lg">add_circle</span>
              <span>Create New Bill</span>
            </button>
          </div>
        </div>

        {/* Action Notice Toast */}
        {actionNotice && (
          <div className="p-3 bg-[#6cf8bb]/30 border border-[#006c49]/30 rounded-2xl flex items-center gap-2 text-xs text-[#005137] font-semibold animate-in fade-in">
            <span className="material-symbols-outlined text-sm">verified</span>
            <span>{actionNotice}</span>
          </div>
        )}

        {/* Quick Stats Bento Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Card 1: Awaiting Approval */}
          <div className="relative overflow-hidden p-6 rounded-2xl bg-white/80 backdrop-blur-xl shadow-[0_10px_30px_-5px_rgba(15,23,42,0.04)] border border-[#eaedff]">
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs uppercase tracking-wider text-[#3d4a42] font-semibold">Awaiting Approval</span>
              <span className="material-symbols-outlined text-[#006c49] text-xl">pending_actions</span>
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="font-mono text-3xl text-[#131b2e] font-bold">$148,250.00</span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="inline-flex items-center gap-1 font-mono text-xs text-[#006c49] bg-[#6cf8bb]/30 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#006c49]" />
                4 Invoices Pending
              </span>
              <span className="text-xs text-[#3d4a42]">2 high priority</span>
            </div>
          </div>

          {/* Card 2: Scheduled Outflows */}
          <div className="relative overflow-hidden p-6 rounded-2xl bg-white/80 backdrop-blur-xl shadow-[0_10px_30px_-5px_rgba(15,23,42,0.04)] border border-[#eaedff]">
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs uppercase tracking-wider text-[#3d4a42] font-semibold">Scheduled Outflows</span>
              <span className="material-symbols-outlined text-[#006948] text-xl">schedule_send</span>
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="font-mono text-3xl text-[#131b2e] font-bold">$264,550.00</span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-[#3d4a42]">Due this week (5 batches)</span>
              <span className="font-mono text-xs text-[#006948] font-semibold">ACH Direct</span>
            </div>
          </div>

          {/* Card 3: Paid This Month */}
          <div className="relative overflow-hidden p-6 rounded-2xl bg-white/80 backdrop-blur-xl shadow-[0_10px_30px_-5px_rgba(15,23,42,0.04)] border border-[#eaedff]">
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs uppercase tracking-wider text-[#3d4a42] font-semibold">Disbursed (MTD)</span>
              <span className="material-symbols-outlined text-[#006c49] text-xl">verified</span>
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="font-mono text-3xl text-[#131b2e] font-bold">$890,200.00</span>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="font-mono text-xs text-[#006c49] bg-[#6cf8bb]/40 px-2 py-0.5 rounded-full font-semibold">
                ↑ +14.2%
              </span>
              <span className="text-xs text-[#3d4a42]">vs. previous month</span>
            </div>
          </div>

          {/* Card 4: Avg Approval Time */}
          <div className="relative overflow-hidden p-6 rounded-2xl bg-white/80 backdrop-blur-xl shadow-[0_10px_30px_-5px_rgba(15,23,42,0.04)] border border-[#eaedff]">
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs uppercase tracking-wider text-[#3d4a42] font-semibold">Mean Approval Velocity</span>
              <span className="material-symbols-outlined text-[#006948] text-xl">bolt</span>
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="font-mono text-3xl text-[#131b2e] font-bold">1.4</span>
              <span className="text-sm text-[#3d4a42]">Hours</span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="font-mono text-xs text-[#006c49]">92% Autonomous</span>
              <span className="text-xs text-[#3d4a42]">Gemini Flash SLA</span>
            </div>
          </div>
        </div>

        {/* Spotlight Section: High-Value Pending Controller Approvals */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-[#006c49] animate-pulse" />
              <h2 className="text-base text-[#131b2e] font-semibold tracking-tight">
                Controller Spotlight: High-Exposure Approvals
              </h2>
            </div>
            <span className="text-xs text-[#3d4a42]">Threshold &gt; $25,000.00 (Dual Signature Required)</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Spotlight Card 1: CoreWeave */}
            <div className="relative p-6 rounded-2xl bg-white/90 backdrop-blur-2xl shadow-[0_10px_30px_-5px_rgba(15,23,42,0.05)] border border-[#eaedff] hover:shadow-md transition-all flex flex-col justify-between overflow-hidden">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#eaedff] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[#006948] text-2xl">memory</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base text-[#131b2e] font-bold">CoreWeave Cloud</h3>
                      <span className="text-xs text-[#006c49] bg-[#6cf8bb]/40 px-2 py-0.5 rounded-full font-semibold">
                        Tier-1 Critical
                      </span>
                    </div>
                    <p className="text-xs text-[#3d4a42] mt-0.5">
                      AI Inference • 64x H100 Cluster Reserved Instances (March)
                    </p>
                    <div className="mt-2 flex items-center gap-3 font-mono text-xs text-[#3d4a42]">
                      <span>Inv #CW-89240-X</span>
                      <span>•</span>
                      <span className="text-[#ba1a1a] font-medium">Due in 3 days</span>
                      <span>•</span>
                      <span>GL #5020 (Cloud Compute)</span>
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mono text-2xl text-[#131b2e] font-bold block">$84,500.00</span>
                  <span className="text-xs text-[#006c49] font-medium">Auto-matched with AWS/GCP PoC</span>
                </div>
              </div>

              {/* Bottom Row: Inline PDF preview pill & Actions */}
              <div className="mt-6 pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#f2f3ff]/50 -mx-6 -mb-6 p-4 px-6 border-t border-[#eaedff]">
                <button
                  onClick={() => openInspectionDrawer(bills[0])}
                  className="flex items-center gap-1.5 text-[#006948] hover:text-[#00855d] text-xs font-semibold transition-colors"
                  type="button"
                >
                  <span className="material-symbols-outlined text-base">picture_as_pdf</span>
                  <span>Inspect Gemini OCR Trace (99.8%)</span>
                  <span className="material-symbols-outlined text-base">chevron_right</span>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    className="px-4 py-1.5 rounded-full text-[#3d4a42] hover:bg-[#eaedff] text-xs font-medium transition-colors"
                    type="button"
                  >
                    Hold
                  </button>
                  <button
                    onClick={() => handleApproveBill('b1')}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#006948] hover:bg-[#00855d] text-white text-xs font-semibold shadow-sm transition-all"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-base">task_alt</span>
                    <span>1-Click Approve ACH</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Spotlight Card 2: Latham & Watkins LLP */}
            <div className="relative p-6 rounded-2xl bg-white/90 backdrop-blur-2xl shadow-[0_10px_30px_-5px_rgba(15,23,42,0.05)] border border-[#eaedff] hover:shadow-md transition-all flex flex-col justify-between overflow-hidden">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#eaedff] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[#3d4a42] text-2xl">gavel</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base text-[#131b2e] font-bold">Latham & Watkins LLP</h3>
                      <span className="text-xs text-[#3d4a42] bg-[#eaedff] px-2 py-0.5 rounded-full font-medium">
                        Corporate Legal
                      </span>
                    </div>
                    <p className="text-xs text-[#3d4a42] mt-0.5">
                      Series B Financing Restructuring & IP Transfer Filings
                    </p>
                    <div className="mt-2 flex items-center gap-3 font-mono text-xs text-[#3d4a42]">
                      <span>Inv #LW-440219</span>
                      <span>•</span>
                      <span>Due in 5 days</span>
                      <span>•</span>
                      <span>GL #6050 (Legal & Professional)</span>
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mono text-2xl text-[#131b2e] font-bold block">$32,000.00</span>
                  <span className="text-xs text-[#3d4a42]">Pre-authorized via SOW</span>
                </div>
              </div>

              {/* Bottom Row */}
              <div className="mt-6 pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#f2f3ff]/50 -mx-6 -mb-6 p-4 px-6 border-t border-[#eaedff]">
                <button
                  onClick={() => openInspectionDrawer(bills[1])}
                  className="flex items-center gap-1.5 text-[#006948] hover:text-[#00855d] text-xs font-semibold transition-colors"
                  type="button"
                >
                  <span className="material-symbols-outlined text-base">picture_as_pdf</span>
                  <span>Inspect Retainer SOW Breakdown</span>
                  <span className="material-symbols-outlined text-base">chevron_right</span>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    className="px-4 py-1.5 rounded-full text-[#3d4a42] hover:bg-[#eaedff] text-xs font-medium transition-colors"
                    type="button"
                  >
                    Question
                  </button>
                  <button
                    onClick={() => handleApproveBill('b2')}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#006948] hover:bg-[#00855d] text-white text-xs font-semibold shadow-sm transition-all"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-base">event_available</span>
                    <span>Approve & Schedule</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Outbound Bills Table & Filter Suite */}
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-2xl bg-white/80 backdrop-blur-xl shadow-sm border border-[#eaedff]">
            {/* Left: Search & Status Pills */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 flex-1">
              <div className="relative min-w-[260px] max-w-sm">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#3d4a42] text-lg">
                  search
                </span>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-full bg-[#f2f3ff] text-[#131b2e] placeholder:text-[#3d4a42]/70 text-xs focus:outline-none focus:bg-white border border-transparent focus:border-[#6cf8bb] transition-all"
                  placeholder="Filter vendor, invoice #, GL code..."
                  type="text"
                />
              </div>

              {/* Status Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {(['All', 'Awaiting Approval', 'Scheduled', 'Paid', 'Overdue'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      filter === tab
                        ? 'bg-[#006948] text-white shadow-sm'
                        : 'text-[#3d4a42] hover:bg-[#eaedff]'
                    }`}
                    type="button"
                  >
                    {tab === 'All' ? 'All Bills (42)' : tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Table Utilities */}
            <div className="flex items-center gap-2 self-end lg:self-auto">
              <button
                className="p-2 rounded-full text-[#3d4a42] hover:bg-[#eaedff] hover:text-[#131b2e] transition-colors"
                title="Export Ledger CSV"
                type="button"
              >
                <span className="material-symbols-outlined text-lg">download</span>
              </button>
              <button
                className="p-2 rounded-full text-[#3d4a42] hover:bg-[#eaedff] hover:text-[#131b2e] transition-colors"
                title="Table Display Density"
                type="button"
              >
                <span className="material-symbols-outlined text-lg">view_column</span>
              </button>
              <div className="w-px h-5 bg-[#eaedff] mx-1" />
              <span className="font-mono text-xs text-[#3d4a42]">
                Showing {filteredBills.length} of {bills.length}
              </span>
            </div>
          </div>

          {/* High-Trust Data Table */}
          <div className="rounded-2xl bg-white/90 backdrop-blur-2xl shadow-[0_10px_30px_-5px_rgba(15,23,42,0.04)] border border-[#eaedff] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#f2f3ff]/70 border-b border-[#eaedff]">
                    <th className="py-3 px-5 text-[10px] uppercase tracking-wider text-[#3d4a42]">Vendor & Description</th>
                    <th className="py-3 px-3 text-[10px] uppercase tracking-wider text-[#3d4a42]">Invoice Ref</th>
                    <th className="py-3 px-3 text-[10px] uppercase tracking-wider text-[#3d4a42]">Dates (Issued / Due)</th>
                    <th className="py-3 px-3 text-[10px] uppercase tracking-wider text-[#3d4a42]">GL Account</th>
                    <th className="py-3 px-3 text-[10px] uppercase tracking-wider text-[#3d4a42] text-right">Amount</th>
                    <th className="py-3 px-3 text-[10px] uppercase tracking-wider text-[#3d4a42] text-center">Status</th>
                    <th className="py-3 px-3 text-[10px] uppercase tracking-wider text-[#3d4a42] text-center">Document</th>
                    <th className="py-3 px-5 text-[10px] uppercase tracking-wider text-[#3d4a42] text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eaedff]">
                  {filteredBills.map((item) => (
                    <tr key={item.id} className="hover:bg-[#f2f3ff]/40 transition-colors">
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#eaedff] flex items-center justify-center font-mono font-bold text-[#131b2e]">
                            {item.logoLetters}
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-[#131b2e] block">{item.vendor}</span>
                            <span className="text-[11px] text-[#3d4a42]">{item.desc}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono text-xs text-[#131b2e]">{item.invoiceRef}</td>
                      <td className="py-3 px-3">
                        <div className="font-mono text-xs text-[#131b2e]">{item.dateIssued}</div>
                        <div className={`font-mono text-[11px] ${item.dateDue.includes('Due in') ? 'text-[#ba1a1a] font-medium' : 'text-[#3d4a42]'}`}>
                          {item.dateDue}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-[#eaedff] text-[#3d4a42] font-mono text-[11px]">
                          {item.glCode}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-xs text-[#131b2e] font-semibold">
                        ${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] px-2.5 py-0.5 rounded-full font-semibold ${
                            item.status === 'Paid'
                              ? 'bg-[#85f8c4]/40 text-[#005137]'
                              : item.status === 'Scheduled ACH'
                              ? 'bg-[#6cf8bb]/40 text-[#00714d]'
                              : item.status === 'Processing'
                              ? 'bg-[#eaedff] text-[#131b2e]'
                              : 'bg-[#ffdad6]/60 text-[#ba1a1a]'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[12px]">
                            {item.status === 'Paid'
                              ? 'check'
                              : item.status === 'Scheduled ACH'
                              ? 'schedule'
                              : item.status === 'Processing'
                              ? 'sync'
                              : 'pending'}
                          </span>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => openInspectionDrawer(item)}
                          className="p-1.5 rounded-lg hover:bg-[#eaedff] text-[#3d4a42] hover:text-[#006948] transition-colors inline-flex items-center justify-center"
                          type="button"
                          title="Inspect OCR Doc"
                        >
                          <span className="material-symbols-outlined text-lg">attachment</span>
                        </button>
                      </td>
                      <td className="py-3 px-5 text-right">
                        {item.status === 'Awaiting Approval' ? (
                          <button
                            onClick={() => handleApproveBill(item.id)}
                            className="px-3 py-1 rounded-full bg-[#006948] hover:bg-[#00855d] text-white text-xs font-semibold transition-all shadow-xs"
                            type="button"
                          >
                            Approve
                          </button>
                        ) : (
                          <button
                            className="p-1 rounded-full text-[#3d4a42] hover:bg-[#eaedff] transition-colors"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-lg">more_vert</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Pagination Footer */}
            <div className="p-4 px-5 bg-[#f2f3ff]/50 border-t border-[#eaedff] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#3d4a42]">
              <span>Page 1 of 6 • Showing 7 priority vendors</span>
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1 rounded-full bg-[#eaedff] text-[#3d4a42] opacity-50 cursor-not-allowed"
                  type="button"
                >
                  Previous
                </button>
                <button
                  className="px-3 py-1 rounded-full bg-white text-[#131b2e] font-semibold shadow-xs hover:bg-[#eaedff] transition-colors border border-[#eaedff]"
                  type="button"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Side Slide-Over Drawer / Inspection Widget (OCR Verification Grounding) */}
      {drawerOpen && selectedBill && (
        <div className="fixed inset-0 bg-[#283044]/30 backdrop-blur-sm z-50 transition-opacity duration-300 flex justify-end">
          <div className="w-full max-w-2xl bg-white shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-5 bg-[#f2f3ff]/80 border-b border-[#eaedff] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#6cf8bb]/50 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#006c49] text-xl">verified</span>
                </div>
                <div>
                  <h3 className="text-base text-[#131b2e] font-bold">{selectedBill.vendor}</h3>
                  <span className="font-mono text-xs text-[#006c49] font-medium">
                    Gemini 2.5 Flash OCR Grounding: {selectedBill.ocrConfidence} Match
                  </span>
                </div>
              </div>
              <button
                onClick={closeInspectionDrawer}
                className="p-2 rounded-full text-[#3d4a42] hover:bg-[#eaedff] transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Drawer Content: Side-by-Side Verification */}
            <div className="p-6 flex-1 overflow-y-auto space-y-6">
              {/* Live Audit Banner */}
              <div className="p-4 rounded-xl bg-[#eaedff] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#006948] text-xl">fact_check</span>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[#131b2e]">Dual-Custody Ledger Check</span>
                    <span className="text-[11px] text-[#3d4a42]">Validated against SVB Main Operating Account</span>
                  </div>
                </div>
                <span className="font-mono text-xs text-[#006c49] bg-[#6cf8bb] px-2.5 py-0.5 rounded-full font-bold">
                  Zero Discrepancy
                </span>
              </div>

              {/* Extracted Structured Metadata */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff]">
                  <span className="text-[10px] uppercase text-[#3d4a42] font-semibold block">Vendor EIN</span>
                  <span className="font-mono text-sm font-bold text-[#131b2e]">{selectedBill.ein}</span>
                  <span className="text-[10px] text-[#006c49] block mt-0.5 font-medium">W-9 On File (Valid)</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff]">
                  <span className="text-[10px] uppercase text-[#3d4a42] font-semibold block">Disbursement Route</span>
                  <span className="font-mono text-xs font-bold text-[#131b2e] truncate block">
                    {selectedBill.disbursementRoute}
                  </span>
                  <span className="text-[10px] text-[#3d4a42] block mt-0.5">Automated wire verification</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff]">
                  <span className="text-[10px] uppercase text-[#3d4a42] font-semibold block">Invoice Number</span>
                  <span className="font-mono text-sm font-bold text-[#131b2e]">{selectedBill.invoiceRef}</span>
                  <span className="text-[10px] text-[#3d4a42] block mt-0.5">Issued {selectedBill.dateIssued}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff]">
                  <span className="text-[10px] uppercase text-[#3d4a42] font-semibold block">Net Terms</span>
                  <span className="font-mono text-sm font-bold text-[#131b2e]">{selectedBill.netTerms}</span>
                  <span className="text-[10px] text-[#ba1a1a] block mt-0.5 font-medium">{selectedBill.dateDue}</span>
                </div>
              </div>

              {/* Line Item Breakdown Parsed by Vision Model */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase text-[#3d4a42] tracking-wider font-semibold">
                    Gemini Extracted Compute Line Items
                  </span>
                  <span className="font-mono text-xs text-[#006c49] font-semibold">
                    {selectedBill.lineItems.length} items verified
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-[#f2f3ff] space-y-2 border border-[#eaedff]">
                  {selectedBill.lineItems.map((li, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="text-[#131b2e] font-medium">{li.label}</span>
                      <span className="font-mono text-xs text-[#131b2e] font-semibold">{li.amount}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-[#eaedff] flex items-center justify-between font-bold">
                    <span className="text-[#131b2e]">Total Parsed Amount</span>
                    <span className="font-mono text-xl text-[#006948]">
                      ${selectedBill.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Embedded Document Visualizer Sandbox */}
              <div className="space-y-2">
                <span className="text-xs uppercase text-[#3d4a42] tracking-wider font-semibold">
                  Attached PDF Specimen (Interactive Scrim)
                </span>
                <div className="relative h-56 rounded-2xl bg-[#eaedff] overflow-hidden flex flex-col items-center justify-center p-4 group">
                  <div className="w-full h-full rounded-xl bg-white shadow-inner p-4 flex flex-col justify-between opacity-85 group-hover:opacity-100 transition-opacity">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1.5">
                        <div className="w-24 h-3 bg-[#3d4a42]/30 rounded" />
                        <div className="w-16 h-2 bg-[#3d4a42]/20 rounded" />
                      </div>
                      <div className="w-20 h-4 bg-[#006948]/20 rounded" />
                    </div>
                    <div className="space-y-2">
                      <div className="w-full h-1.5 bg-[#3d4a42]/10 rounded" />
                      <div className="w-full h-1.5 bg-[#3d4a42]/10 rounded" />
                      <div className="w-3/4 h-1.5 bg-[#3d4a42]/10 rounded" />
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="w-12 h-6 bg-[#6cf8bb]/40 rounded" />
                      <div className="w-28 h-4 bg-[#006948]/30 rounded" />
                    </div>
                  </div>
                  {/* Bounding Box Annotation Overlay */}
                  <div className="absolute inset-0 bg-[#006948]/5 pointer-events-none flex items-center justify-center">
                    <span className="font-mono text-xs text-[#006948] bg-white/90 px-3 py-1 rounded-full shadow-sm border border-[#6cf8bb]/60">
                      OCR Bounding Box: 100% Geometry Fit
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-5 bg-[#f2f3ff]/90 border-t border-[#eaedff] flex items-center justify-end gap-3">
              <button
                onClick={closeInspectionDrawer}
                className="px-4 py-2.5 rounded-full text-[#3d4a42] hover:bg-[#eaedff] text-xs font-semibold transition-colors"
                type="button"
              >
                Dismiss Preview
              </button>
              <button
                onClick={() => handleApproveBill(selectedBill.id)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#006948] hover:bg-[#00855d] text-white text-xs font-semibold shadow-[0_4px_14px_0_rgba(16,185,129,0.35)] active:scale-95 transition-all"
                type="button"
              >
                <span className="material-symbols-outlined text-lg">check_circle</span>
                <span>Execute Instant Wire/ACH</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
