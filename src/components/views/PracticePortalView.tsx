import React, { useState } from 'react';
import { useDigits } from '../../context/DigitsContext';
import {
  Building2,
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  FileCheck2,
  Database,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  Search,
  Lock,
  Layers,
  Sparkles,
  Server
} from 'lucide-react';

interface PortfolioClient {
  id: string;
  name: string;
  cin: string;
  gstin: string;
  entityType: string;
  currency: string;
  closeReadinessPct: number;
  unreconciledTxCount: number;
  imsActionPendingCount: number;
  msmeBreachRisk: 'Safe' | '1 At Risk (11d left)' | 'Breach Warning';
  scrutinyAlertsCount: number;
  auditTrailRule11g: boolean;
  secondRecordBackedUp: boolean;
}

export const PracticePortalView: React.FC = () => {
  const { currentEntity, switchEntity, setActiveView, showNotification, formatAmount } = useDigits();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'needs-attention' | 'ready-to-lock'>('all');

  const clients: PortfolioClient[] = [
    {
      id: 'le-in-1',
      name: 'Acme Technologies India Pvt. Ltd.',
      cin: 'U72900KA2023PTC174829',
      gstin: '29AABCA1234F1Z8',
      entityType: 'Private Limited (India)',
      currency: 'INR (₹)',
      closeReadinessPct: 94,
      unreconciledTxCount: 2,
      imsActionPendingCount: 1,
      msmeBreachRisk: '1 At Risk (11d left)',
      scrutinyAlertsCount: 0,
      auditTrailRule11g: true,
      secondRecordBackedUp: true
    },
    {
      id: 'le-in-2',
      name: 'Bharat Retail Enterprises LLP',
      cin: 'LLPIN-AAB-1924',
      gstin: '27AABCB9912D1Z0',
      entityType: 'LLP (India)',
      currency: 'INR (₹)',
      closeReadinessPct: 78,
      unreconciledTxCount: 14,
      imsActionPendingCount: 3,
      msmeBreachRisk: 'Breach Warning',
      scrutinyAlertsCount: 2,
      auditTrailRule11g: true,
      secondRecordBackedUp: true
    },
    {
      id: 'le-in-3',
      name: 'Bangalore DeepTech Labs Pvt. Ltd.',
      cin: 'U72200KA2022PTC159012',
      gstin: '29AAACD4412F1Z2',
      entityType: 'Private Limited (India)',
      currency: 'INR (₹)',
      closeReadinessPct: 98,
      unreconciledTxCount: 0,
      imsActionPendingCount: 0,
      msmeBreachRisk: 'Safe',
      scrutinyAlertsCount: 0,
      auditTrailRule11g: true,
      secondRecordBackedUp: true
    },
    {
      id: 'le-1',
      name: 'Acme Technologies Inc. (US Parent)',
      cin: 'EIN-12-3456789',
      gstin: 'US-DEL-90184',
      entityType: 'Delaware C-Corp',
      currency: 'USD ($)',
      closeReadinessPct: 100,
      unreconciledTxCount: 0,
      imsActionPendingCount: 0,
      msmeBreachRisk: 'Safe',
      scrutinyAlertsCount: 0,
      auditTrailRule11g: true,
      secondRecordBackedUp: true
    }
  ];

  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.cin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.gstin.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'needs-attention' && (c.closeReadinessPct < 90 || c.scrutinyAlertsCount > 0)) ||
      (filterType === 'ready-to-lock' && c.closeReadinessPct >= 95);

    return matchesSearch && matchesFilter;
  });

  const handleSwitchToClient = (client: PortfolioClient) => {
    if (client.id === currentEntity.id) {
      setActiveView('home');
    } else {
      switchEntity(client.id);
      setActiveView('home');
      showNotification(`Switched active CA practice context to ${client.name}`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#eaedff] pb-4">
        <div>
          <div className="text-xs font-semibold text-[#006948] mb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#006c49] shadow-[0_0_8px_#6cf8bb] animate-pulse" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider">
              CA PRACTICE MANAGEMENT & FIRM CLOSE
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#131b2e] tracking-tight">
            Chartered Accountant Multi-Client Workspace
          </h1>
          <div className="text-xs text-[#3d4a42] mt-0.5">
            Single-login portal across your firm's SME portfolio. 24/7 automated CA Ledger Scrutiny, GST IMS deemed-acceptance surveillance, and MCA Rule 3(1) Second Record certification.
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => showNotification('Running automated CA Ledger Scrutiny across all 4 portfolio entities...')}
            className="px-4 py-2 rounded-full bg-[#006948] hover:bg-[#00855d] text-white text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#6cf8bb]" />
            <span>Run Firm-Wide Scrutiny</span>
          </button>
        </div>
      </div>

      {/* MCA Rule 3(1) "Second Record" Statutory Compliance Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-white/95 to-[#eaedff]/70 backdrop-blur-xl border border-[#eaedff] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#6cf8bb]/40 text-[#006c49] flex items-center justify-center shrink-0">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#006948] uppercase tracking-wider font-mono">
                MCA Rule 3(1) Statutory Certificate
              </span>
              <span className="text-[9px] bg-[#6cf8bb] text-[#00714d] px-2 py-0.5 rounded-full font-mono font-bold">
                Daily Indian Cloud Mirror Active
              </span>
            </div>
            <p className="text-xs text-[#131b2e] font-semibold mt-0.5">
              Automated Indian Second Record Backup: Certified Compliant
            </p>
            <p className="text-[11px] text-[#3d4a42] mt-0.5">
              Primary: AWS ap-south-1 (Mumbai) • Second Record: CtrlS Tier-4 DC (Bengaluru, India). Non-disableable edit logs verified under MCA Rule 11(g).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => showNotification('Generated MCA Rule 3(1) & 11(g) Auditor Certification Report (Form ADT-1 Scrutiny)')}
            className="px-4 py-2 rounded-full bg-white hover:bg-[#f2f3ff] text-[#131b2e] text-xs font-semibold border border-[#eaedff] transition-all shadow-xs"
          >
            Download Rule 3(1) Audit Certificate
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white/90 backdrop-blur-xl p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-sm border border-[#eaedff]">
        <div className="flex-1 min-w-[280px] relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#3d4a42]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search company by name, CIN, or GSTIN..."
            className="w-full bg-[#f2f3ff] rounded-full pl-10 pr-4 py-2 text-xs text-[#131b2e] placeholder-[#3d4a42]/70 focus:outline-none focus:bg-white border border-transparent focus:border-[#6cf8bb] transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5">
          {(['all', 'needs-attention', 'ready-to-lock'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilterType(mode)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                filterType === mode
                  ? 'bg-[#006948] text-white shadow-sm'
                  : 'text-[#3d4a42] hover:bg-[#eaedff]'
              }`}
            >
              {mode === 'all'
                ? `All Clients (${clients.length})`
                : mode === 'needs-attention'
                ? 'Action Needed'
                : 'Ready to Lock (≥95%)'}
            </button>
          ))}
        </div>
      </div>

      {/* Client Companies Portfolio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredClients.map((client) => {
          const isCurrent = client.id === currentEntity.id;
          return (
            <div
              key={client.id}
              className={`p-6 rounded-3xl bg-white/90 backdrop-blur-xl border transition-all flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md ${
                isCurrent ? 'border-[#006948] ring-2 ring-[#6cf8bb]/30' : 'border-[#eaedff]'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#eaedff] text-[#006948] flex items-center justify-center font-bold text-sm">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-[#131b2e]">{client.name}</h3>
                        {isCurrent && (
                          <span className="text-[9px] bg-[#6cf8bb]/50 text-[#00714d] px-2 py-0.5 rounded-full font-bold">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#3d4a42] font-mono mt-0.5">{client.entityType} · {client.currency}</p>
                    </div>
                  </div>

                  {/* Readiness Circular/Pill Indicator */}
                  <div className="text-right">
                    <div className="text-2xl font-bold font-mono text-[#006948]">
                      {client.closeReadinessPct}%
                    </div>
                    <span className="text-[10px] text-[#3d4a42] font-semibold uppercase tracking-wider block">
                      Close Ready
                    </span>
                  </div>
                </div>

                {/* Statutory Identifier Strip */}
                <div className="mt-4 p-3 rounded-2xl bg-[#f2f3ff] border border-[#eaedff] grid grid-cols-2 gap-2 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-[#3d4a42] block">CIN / Corporate ID:</span>
                    <span className="font-bold text-[#131b2e] truncate block">{client.cin}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#3d4a42] block">GSTIN:</span>
                    <span className="font-bold text-[#131b2e] truncate block">{client.gstin}</span>
                  </div>
                </div>

                {/* Audit Health Indicators */}
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff]">
                    <span className="text-[10px] text-[#3d4a42] block">GST IMS Status</span>
                    <span className={`font-bold font-mono ${client.imsActionPendingCount > 0 ? 'text-[#ba1a1a]' : 'text-[#006c49]'}`}>
                      {client.imsActionPendingCount > 0 ? `${client.imsActionPendingCount} Action Pending` : 'Clean (Matched)'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff]">
                    <span className="text-[10px] text-[#3d4a42] block">MSME Sec 37(2)(g)</span>
                    <span className={`font-bold font-mono text-[11px] ${client.msmeBreachRisk === 'Safe' ? 'text-[#006c49]' : 'text-[#ba1a1a]'}`}>
                      {client.msmeBreachRisk}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff]">
                    <span className="text-[10px] text-[#3d4a42] block">CA Scrutiny Flags</span>
                    <span className={`font-bold font-mono ${client.scrutinyAlertsCount > 0 ? 'text-[#ba1a1a]' : 'text-[#006c49]'}`}>
                      {client.scrutinyAlertsCount > 0 ? `${client.scrutinyAlertsCount} Anomalies` : '0 Breaches'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#eaedff] flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-xs text-[#006c49] font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#006c49]" />
                  <span>Rule 11(g) + Rule 3(1) Certified</span>
                </div>

                <button
                  onClick={() => handleSwitchToClient(client)}
                  className={`px-5 py-2 rounded-full text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 ${
                    isCurrent
                      ? 'bg-[#006948] text-white hover:bg-[#00855d]'
                      : 'bg-[#eaedff] text-[#131b2e] hover:bg-[#dae2fd]'
                  }`}
                >
                  <span>{isCurrent ? 'Enter Dashboard' : 'Switch to Client'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

