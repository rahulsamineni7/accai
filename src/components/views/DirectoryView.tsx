import React, { useState } from 'react';
import { useDigits } from '../../context/DigitsContext';
import { validateGSTIN } from '../../utils/indianTaxValidation';
import {
  TrendingDown,
  TrendingUp,
  Building2,
  ShieldCheck,
  AlertTriangle,
  Clock,
  FileText,
  Search,
  CheckCircle2,
  ChevronRight,
  X,
  CreditCard,
  Hash,
  Sparkles,
  Layers,
  Scale
} from 'lucide-react';

interface SemanticParty {
  id: string;
  name: string;
  type: 'Vendor' | 'Customer';
  category: string;
  spendOrRev: number;
  gstin: string;
  pan: string;
  tan?: string;
  udyamTier: 'Micro' | 'Small' | 'Medium' | 'Non-MSME' | 'Exempt';
  udyamNumber?: string;
  writtenAgreement: boolean;
  creditDays: number;
  historicalTds: string[];
  primaryHsnSac: string;
  placeOfSupply: string;
  recurring: boolean;
  openVouchersCount: number;
  reconciliationStatus: '100% Synced' | 'IMS Action Needed' | 'Verification Pending';
}

export const DirectoryView: React.FC = () => {
  const { currentEntity, formatAmount, currency, showNotification } = useDigits();
  const [tab, setTab] = useState<'vendors' | 'customers'>('vendors');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState<string>('all');
  const [selectedParty, setSelectedParty] = useState<SemanticParty | null>(null);

  const initialParties: SemanticParty[] = [
    {
      id: 'pty-v1',
      name: 'CtrlS Datacenters Ltd',
      type: 'Vendor',
      category: 'Cloud Infrastructure & Colocation',
      spendOrRev: 2840000,
      gstin: '29AABCC7712E1ZQ',
      pan: 'AABCC7712E',
      tan: 'BLRC99201A',
      udyamTier: 'Micro',
      udyamNumber: 'UDYAM-KR-03-0019482',
      writtenAgreement: false,
      creditDays: 15,
      historicalTds: ['Section 194C (2% Contractor)'],
      primaryHsnSac: 'SAC 998315 (Hosting & Colocation)',
      placeOfSupply: '29-Karnataka (Intra-State)',
      recurring: true,
      openVouchersCount: 3,
      reconciliationStatus: '100% Synced'
    },
    {
      id: 'pty-v2',
      name: 'AZB & Partners Legal Advisors',
      type: 'Vendor',
      category: 'Corporate Legal & Governance',
      spendOrRev: 1420000,
      gstin: '07AAACA1991F1ZY',
      pan: 'AAACA1991F',
      udyamTier: 'Small',
      udyamNumber: 'UDYAM-DL-01-0082914',
      writtenAgreement: true,
      creditDays: 45,
      historicalTds: ['Section 194J (10% Professional Fees)'],
      primaryHsnSac: 'SAC 998211 (Legal Consulting)',
      placeOfSupply: '07-Delhi (Inter-State IGST)',
      recurring: true,
      openVouchersCount: 2,
      reconciliationStatus: '100% Synced'
    },
    {
      id: 'pty-v3',
      name: 'Tata Communications Ltd',
      type: 'Vendor',
      category: 'InfiniBand & High-Speed Network',
      spendOrRev: 890000,
      gstin: '27AAACT2727Q1ZT',
      pan: 'AAACT2727Q',
      udyamTier: 'Non-MSME',
      writtenAgreement: true,
      creditDays: 30,
      historicalTds: ['Section 194C (2%)'],
      primaryHsnSac: 'SAC 998412 (Telecommunication Leased Lines)',
      placeOfSupply: '27-Maharashtra (Inter-State IGST)',
      recurring: true,
      openVouchersCount: 1,
      reconciliationStatus: '100% Synced'
    },
    {
      id: 'pty-v4',
      name: 'BlueDart Express Ltd',
      type: 'Vendor',
      category: 'GTA Logistics & Express Courier',
      spendOrRev: 345000,
      gstin: '29AAACB1445G1ZP',
      pan: 'AAACB1445G',
      udyamTier: 'Small',
      udyamNumber: 'UDYAM-KR-03-0099241',
      writtenAgreement: false,
      creditDays: 15,
      historicalTds: ['Section 194C (1%)', 'GST RCM Section 9(3)'],
      primaryHsnSac: 'SAC 996511 (Goods Transport Agency)',
      placeOfSupply: '29-Karnataka (Intra-State RCM)',
      recurring: true,
      openVouchersCount: 4,
      reconciliationStatus: 'IMS Action Needed'
    },
    {
      id: 'pty-c1',
      name: 'Cognitive Dynamics Corp',
      type: 'Customer',
      category: 'Enterprise AI Licensing',
      spendOrRev: 13500000,
      gstin: '29AAGCB3796D1Z4',
      pan: 'AAGCB3796D',
      udyamTier: 'Medium',
      udyamNumber: 'UDYAM-KR-03-0028491',
      writtenAgreement: true,
      creditDays: 30,
      historicalTds: ['Section 194J (2% Royalty on Software)'],
      primaryHsnSac: 'SAC 998314 (IT Software & AI Models)',
      placeOfSupply: '29-Karnataka (Intra-State)',
      recurring: true,
      openVouchersCount: 1,
      reconciliationStatus: '100% Synced'
    },
    {
      id: 'pty-c2',
      name: 'Nexus Fintech Partners',
      type: 'Customer',
      category: 'API Usage & Token Stream',
      spendOrRev: 8550000,
      gstin: '36AAACN9921B1Z3',
      pan: 'AAACN9921B',
      udyamTier: 'Small',
      udyamNumber: 'UDYAM-TS-02-0044129',
      writtenAgreement: true,
      creditDays: 30,
      historicalTds: ['Section 194J (2%)'],
      primaryHsnSac: 'SAC 998313 (IT Infrastructure APIs)',
      placeOfSupply: '36-Telangana (Inter-State IGST)',
      recurring: true,
      openVouchersCount: 2,
      reconciliationStatus: '100% Synced'
    },
    {
      id: 'pty-c3',
      name: 'Hyperion BioLabs Ltd',
      type: 'Customer',
      category: 'Research Enterprise Contract',
      spendOrRev: 5460000,
      gstin: '06AAACH2841C1Z8',
      pan: 'AAACH2841C',
      udyamTier: 'Non-MSME',
      writtenAgreement: true,
      creditDays: 45,
      historicalTds: ['Section 194J (10%)'],
      primaryHsnSac: 'SAC 998314 (IT Software)',
      placeOfSupply: '06-Haryana (Inter-State IGST)',
      recurring: true,
      openVouchersCount: 1,
      reconciliationStatus: '100% Synced'
    }
  ];

  const filtered = initialParties.filter((p) => {
    const isTab = (tab === 'vendors' && p.type === 'Vendor') || (tab === 'customers' && p.type === 'Customer');
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.gstin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.pan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier =
      filterTier === 'all' ||
      (filterTier === 'msme' && (p.udyamTier === 'Micro' || p.udyamTier === 'Small')) ||
      (filterTier === 'micro' && p.udyamTier === 'Micro') ||
      (filterTier === 'small' && p.udyamTier === 'Small');

    return isTab && matchesSearch && matchesTier;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#eaedff] pb-4">
        <div>
          <div className="text-xs font-semibold text-[#006948] mb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#006c49] shadow-[0_0_8px_#6cf8bb] animate-pulse" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider">
              CORE LEDGER: SEMANTIC OBJECT GRAPH
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#131b2e] tracking-tight">
            Parties & Relationship Graph Master
          </h1>
          <div className="text-xs text-[#3d4a42] mt-0.5">
            Binds counterparties to 15-digit Modulo-36 GSTINs, PAN entity types, Udyam tiers, Section 37(2)(g) credit agreements, and HSN/SAC mappings.
          </div>
        </div>

        {/* Tabs & Controls */}
        <div className="flex items-center space-x-2">
          <div className="p-1 rounded-full bg-[#f2f3ff] border border-[#eaedff] flex items-center space-x-1">
            <button
              onClick={() => setTab('vendors')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                tab === 'vendors'
                  ? 'bg-[#006948] text-white shadow-sm'
                  : 'text-[#3d4a42] hover:text-[#131b2e]'
              }`}
            >
              Suppliers / Vendors ({initialParties.filter((p) => p.type === 'Vendor').length})
            </button>
            <button
              onClick={() => setTab('customers')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                tab === 'customers'
                  ? 'bg-[#006948] text-white shadow-sm'
                  : 'text-[#3d4a42] hover:text-[#131b2e]'
              }`}
            >
              Customers / Debtors ({initialParties.filter((p) => p.type === 'Customer').length})
            </button>
          </div>
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
            placeholder="Search party by name, GSTIN, PAN, or HSN/SAC..."
            className="w-full bg-[#f2f3ff] rounded-full pl-10 pr-4 py-2 text-xs text-[#131b2e] placeholder-[#3d4a42]/70 focus:outline-none focus:bg-white border border-transparent focus:border-[#6cf8bb] transition-all"
          />
        </div>

        {/* MSME Tier Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-[11px] text-[#3d4a42] font-semibold uppercase tracking-wider">MSME Scope:</span>
          <select
            value={filterTier}
            onChange={(e) => setFilterTier(e.target.value)}
            className="px-3 py-1.5 rounded-full text-xs text-[#131b2e] bg-[#f2f3ff] border border-[#eaedff] focus:outline-none font-medium"
          >
            <option value="all">All Enterprise Tiers</option>
            <option value="msme">Micro & Small (Sec 37(2)(g) Guard)</option>
            <option value="micro">Micro Tier Only (15 Days)</option>
            <option value="small">Small Tier Only (45 Days Agreement)</option>
          </select>
        </div>
      </div>

      {/* Semantic Party Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((party) => {
          const gstValidation = validateGSTIN(party.gstin);
          return (
            <div
              key={party.id}
              onClick={() => setSelectedParty(party)}
              className="p-5 rounded-3xl bg-white/90 backdrop-blur-xl border border-[#eaedff] shadow-sm hover:shadow-md hover:border-[#6cf8bb] transition-all flex flex-col justify-between space-y-4 cursor-pointer group"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#eaedff] text-[#006948] flex items-center justify-center font-bold text-sm shadow-xs group-hover:bg-[#006948] group-hover:text-white transition-colors">
                    {party.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#131b2e] group-hover:text-[#006948] transition-colors">
                      {party.name}
                    </h3>
                    <div className="text-[11px] text-[#3d4a42] font-mono">{party.category}</div>
                  </div>
                </div>

                {/* MSME Tier Badge */}
                <span
                  className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold border ${
                    party.udyamTier === 'Micro'
                      ? 'bg-[#ffdad6]/60 text-[#ba1a1a] border-[#ffdad6]'
                      : party.udyamTier === 'Small'
                      ? 'bg-[#fff0c2] text-[#8c6b00] border-[#ffe28a]'
                      : 'bg-[#eaedff] text-[#131b2e] border-[#eaedff]'
                  }`}
                >
                  {party.udyamTier} Tier
                </span>
              </div>

              {/* Statutory Binds: GSTIN & PAN */}
              <div className="space-y-2 bg-[#f2f3ff]/60 p-3 rounded-2xl border border-[#eaedff]">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#3d4a42] font-mono text-[11px] flex items-center gap-1">
                    <Hash className="w-3 h-3 text-[#006948]" />
                    GSTIN:
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-[#131b2e]">{party.gstin}</span>
                    {gstValidation.isValid ? (
                      <span className="text-[9px] bg-[#6cf8bb]/40 text-[#00714d] px-1.5 py-0.2 rounded font-mono font-bold">
                        Mod-36 OK
                      </span>
                    ) : (
                      <span className="text-[9px] bg-[#ffdad6] text-[#ba1a1a] px-1.5 py-0.2 rounded font-mono font-bold">
                        Checksum Err
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#3d4a42] font-mono text-[11px]">PAN ({gstValidation.entityCategory}):</span>
                  <span className="font-mono font-bold text-[#131b2e]">{party.pan}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#3d4a42] font-mono text-[11px]">Credit Agreement:</span>
                  <span className={`font-mono text-[11px] font-semibold ${party.writtenAgreement ? 'text-[#006c49]' : 'text-[#ba1a1a]'}`}>
                    {party.writtenAgreement ? `45 Days (Written Contract)` : `15 Days (Statutory Default)`}
                  </span>
                </div>
              </div>

              {/* Statutory TDS & HSN Tags */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {party.historicalTds.map((t, idx) => (
                  <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#eaedff] text-[#006948] font-medium">
                    {t}
                  </span>
                ))}
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#f2f3ff] text-[#3d4a42]">
                  {party.primaryHsnSac}
                </span>
              </div>

              {/* Bottom Volume & Drill-Down Pill */}
              <div className="pt-3 border-t border-[#eaedff] flex items-center justify-between text-xs">
                <span className="text-[#3d4a42] flex items-center">
                  {party.type === 'Vendor' ? (
                    <TrendingDown className="w-3.5 h-3.5 text-[#3d4a42] mr-1" />
                  ) : (
                    <TrendingUp className="w-3.5 h-3.5 text-[#006c49] mr-1" />
                  )}
                  {party.type === 'Vendor' ? 'YTD Booked Bills:' : 'YTD Contract Revenue:'}
                </span>
                <div className="flex items-center gap-1">
                  <span className="font-mono font-bold text-[#131b2e]">
                    {formatAmount(party.spendOrRev)}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#3d4a42] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Semantic Graph Drill-Down Drawer */}
      {selectedParty && (
        <div className="fixed inset-0 bg-[#131b2e]/40 backdrop-blur-sm z-50 flex justify-end animate-in fade-in">
          <div className="w-full max-w-xl bg-white shadow-2xl p-6 overflow-y-auto space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-[#eaedff] pb-4">
                <div>
                  <div className="text-xs font-semibold text-[#006948] uppercase font-mono tracking-wider">
                    SEMANTIC PARTY OBJECT
                  </div>
                  <h2 className="text-xl font-bold text-[#131b2e]">{selectedParty.name}</h2>
                </div>
                <button
                  onClick={() => setSelectedParty(null)}
                  className="p-2 rounded-full hover:bg-[#f2f3ff] text-[#3d4a42] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modulo-36 Verified Statutory Card */}
              <div className="p-4 rounded-2xl bg-[#eaedff]/60 border border-[#eaedff] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#006948] uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#006c49]" />
                    GSTN & MCA Verification Matrix
                  </span>
                  <span className="text-[10px] font-mono bg-[#6cf8bb] text-[#00714d] px-2 py-0.5 rounded-full font-bold">
                    Modulo-36 Valid
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <span className="text-[#3d4a42] text-[10px] block">GSTIN:</span>
                    <span className="font-bold text-[#131b2e]">{selectedParty.gstin}</span>
                  </div>
                  <div>
                    <span className="text-[#3d4a42] text-[10px] block">Place of Supply:</span>
                    <span className="font-bold text-[#131b2e]">{selectedParty.placeOfSupply}</span>
                  </div>
                  <div>
                    <span className="text-[#3d4a42] text-[10px] block">PAN Entity Type:</span>
                    <span className="font-bold text-[#131b2e]">{selectedParty.pan} (Company)</span>
                  </div>
                  <div>
                    <span className="text-[#3d4a42] text-[10px] block">Udyam Registration:</span>
                    <span className="font-bold text-[#131b2e]">{selectedParty.udyamNumber || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Section 37(2)(g) MSME Status */}
              <div className="p-4 rounded-2xl bg-white border border-[#eaedff] space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#131b2e] flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#ba1a1a]" />
                    Section 37(2)(g) (Formerly 43B(h)) MSME Terms
                  </span>
                  <span className="text-xs font-bold text-[#006948]">
                    {selectedParty.creditDays} Days Allowed
                  </span>
                </div>
                <p className="text-xs text-[#3d4a42] leading-relaxed">
                  {selectedParty.writtenAgreement
                    ? 'A written buyer-seller supply contract is registered on file. The extended 45-day statutory payment ceiling applies before tax disallowance.'
                    : 'No written agreement uploaded. Strict 15-day statutory payment rule from date of delivery challan / acceptance is enforced.'}
                </p>
              </div>

              {/* Connected Semantic Vouchers Graph */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#131b2e] flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-[#006948]" />
                    Interconnected Semantic Graph Vouchers
                  </span>
                  <span className="text-[11px] font-mono text-[#006948] font-bold">
                    {selectedParty.openVouchersCount} Active Rows
                  </span>
                </div>
                <div className="space-y-2 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#131b2e] block">Voucher #VCH-2026-901</span>
                      <span className="text-[10px] text-[#3d4a42]">{selectedParty.primaryHsnSac}</span>
                    </div>
                    <span className="font-bold text-[#006c49]">{formatAmount(selectedParty.spendOrRev * 0.4)}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#131b2e] block">Voucher #VCH-2026-902</span>
                      <span className="text-[10px] text-[#3d4a42]">{selectedParty.historicalTds[0]}</span>
                    </div>
                    <span className="font-bold text-[#006c49]">{formatAmount(selectedParty.spendOrRev * 0.6)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-[#eaedff] flex items-center justify-between">
              <button
                onClick={() => showNotification(`Exported CA Ledger Statement for ${selectedParty.name}`)}
                className="px-4 py-2 rounded-full bg-[#f2f3ff] hover:bg-[#eaedff] text-xs font-semibold text-[#131b2e] transition-all"
              >
                Export Party Ledger (XML/PDF)
              </button>
              <button
                onClick={() => {
                  showNotification(`Synced ${selectedParty.name} semantic object with Tally Prime & GSTN Portal`);
                  setSelectedParty(null);
                }}
                className="px-5 py-2 rounded-full bg-[#006948] hover:bg-[#00855d] text-white text-xs font-bold transition-all shadow-sm"
              >
                Sync with Tally Prime
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
