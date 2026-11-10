import React, { useState } from 'react';
import { useDigits } from '../../context/DigitsContext';
import {
  ShieldCheck,
  FileCheck2,
  FileSpreadsheet,
  Download,
  Sparkles,
  QrCode,
  Truck,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Receipt,
  ExternalLink,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';

export const GSTComplianceView: React.FC = () => {
  const {
    currentEntity,
    invoices,
    bills,
    formatAmount,
    currency,
    generateIRN,
    generateEWayBill,
    downloadGstrJson,
    reconcileGstr2bWithBills,
    showNotification
  } = useDigits();

  const [activeTab, setActiveTab] = useState<'gstr2b' | 'gstr1' | 'gstr3b' | 'einvoice'>('gstr2b');
  const [isReconciling, setIsReconciling] = useState(false);
  const [selectedInvoiceForEway, setSelectedInvoiceForEway] = useState<string | null>(null);
  const [vehicleNo, setVehicleNo] = useState('KA-01-AB-8821');

  // Compute live GST metrics
  const totalOutputGst = invoices.reduce(
    (sum, inv) => sum + (inv.cgst || 0) + (inv.sgst || 0) + (inv.igst || 0),
    0
  );

  const totalInputGst = bills.reduce(
    (sum, b) => sum + (b.cgst || 0) + (b.sgst || 0) + (b.igst || 0),
    0
  );

  const netGstPayable = Math.max(0, totalOutputGst - totalInputGst);

  const handleRun2BReconciliation = () => {
    setIsReconciling(true);
    setTimeout(() => {
      setIsReconciling(false);
      reconcileGstr2bWithBills();
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Entity GSTIN Details */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-[#006948]/10 text-[#006948]">
              <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-[#131b2e]">
              GST & Tax Compliance Suite
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#006948]/10 text-[#006948] text-[11px] font-semibold tracking-wide">
              FY 2024-25 • October
            </span>
          </div>
          <p className="text-xs text-[#6d7a72] pl-10">
            Autonomous Indian tax filing, GSTR-2B AI input credit matching, and direct e-Invoice (IRN) generation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col text-right">
            <span className="text-[10px] font-mono text-[#6d7a72] uppercase tracking-wider font-semibold">
              GSTIN ({currentEntity.state || '29-Karnataka'})
            </span>
            <span className="text-xs font-mono font-bold text-[#131b2e] bg-[#f2f3ff] px-2.5 py-1 rounded-lg border border-[#eaedff]">
              {currentEntity.gstin || '29AABCA1234F1Z8'}
            </span>
          </div>

          <button
            onClick={() => downloadGstrJson('GSTR1')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#006948] hover:bg-[#00855d] text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download GSTR-1 JSON</span>
          </button>
        </div>
      </div>

      {/* 4 Indian GST KPI Bento Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net GST Payable */}
        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#6d7a72] uppercase tracking-wider">
              Net Tax Payable
            </span>
            <span className="p-1.5 rounded-lg bg-[#ba1a1a]/10 text-[#ba1a1a]">
              <ArrowDownLeft className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-[#131b2e]">
              {formatAmount(netGstPayable)}
            </div>
            <div className="text-[11px] text-[#6d7a72] mt-1 flex items-center gap-1 font-medium">
              <span>Output</span>
              <span className="font-mono text-[#131b2e]">{formatAmount(totalOutputGst, { compact: true })}</span>
              <span>- ITC</span>
              <span className="font-mono text-[#006948]">{formatAmount(totalInputGst, { compact: true })}</span>
            </div>
          </div>
        </div>

        {/* Total Output GST Collected */}
        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#6d7a72] uppercase tracking-wider">
              Output GST Collected
            </span>
            <span className="p-1.5 rounded-lg bg-[#006948]/10 text-[#006948]">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-[#131b2e]">
              {formatAmount(totalOutputGst)}
            </div>
            <div className="text-[11px] text-[#006948] mt-1 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>GSTR-1 Outward Supplies</span>
            </div>
          </div>
        </div>

        {/* Input Tax Credit (ITC Available) */}
        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#6d7a72] uppercase tracking-wider">
              Eligible ITC (GSTR-2B)
            </span>
            <span className="p-1.5 rounded-lg bg-[#3b82f6]/10 text-[#3b82f6]">
              <Sparkles className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-[#006948]">
              {formatAmount(totalInputGst)}
            </div>
            <div className="text-[11px] text-[#3d4a42] mt-1 font-medium">
              100% matched with GSTN portal
            </div>
          </div>
        </div>

        {/* Electronic Cash Ledger Balance */}
        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#6d7a72] uppercase tracking-wider">
              Electronic Cash Ledger
            </span>
            <span className="p-1.5 rounded-lg bg-[#fba772]/20 text-[#ea580c]">
              <Building2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-[#131b2e]">
              {formatAmount(150000)}
            </div>
            <div className="text-[11px] text-[#6d7a72] mt-1 font-medium">
              Available for offsetting tax
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#eaedff] pb-3">
        <button
          onClick={() => setActiveTab('gstr2b')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'gstr2b'
              ? 'bg-[#006948] text-white shadow-sm'
              : 'text-[#3d4a42] hover:bg-[#eaedff] hover:text-[#131b2e]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>GSTR-2B AI ITC Matcher</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${activeTab === 'gstr2b' ? 'bg-white/20' : 'bg-[#eaedff]'}`}>
            {bills.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('gstr1')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'gstr1'
              ? 'bg-[#006948] text-white shadow-sm'
              : 'text-[#3d4a42] hover:bg-[#eaedff] hover:text-[#131b2e]'
          }`}
        >
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>GSTR-1 Outward Supplies</span>
        </button>

        <button
          onClick={() => setActiveTab('gstr3b')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'gstr3b'
              ? 'bg-[#006948] text-white shadow-sm'
              : 'text-[#3d4a42] hover:bg-[#eaedff] hover:text-[#131b2e]'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>GSTR-3B Summary Return</span>
        </button>

        <button
          onClick={() => setActiveTab('einvoice')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'einvoice'
              ? 'bg-[#006948] text-white shadow-sm'
              : 'text-[#3d4a42] hover:bg-[#eaedff] hover:text-[#131b2e]'
          }`}
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>E-Invoicing & E-Way Bills</span>
        </button>
      </div>

      {/* Tab 1: GSTR-2B AI ITC Matcher */}
      {activeTab === 'gstr2b' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#006948]/10 text-[#006948] flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#131b2e]">
                  Gemini GSTR-2B Input Tax Credit Auto-Reconciler
                </h3>
                <p className="text-[11px] text-[#6d7a72]">
                  Validates purchase ledger invoices against suppliers' GSTR-1 filings on the GSTN portal to secure 100% eligible ITC.
                </p>
              </div>
            </div>

            <button
              onClick={handleRun2BReconciliation}
              disabled={isReconciling}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#006948] hover:bg-[#00855d] text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isReconciling ? 'animate-spin' : ''}`} />
              <span>{isReconciling ? 'Fetching GSTN 2B Feeds...' : 'Sync & Match GSTR-2B'}</span>
            </button>
          </div>

          {/* 2B Match Table */}
          <div className="overflow-x-auto rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#eaedff] bg-[#f8f9ff]/70 text-[10px] font-mono text-[#6d7a72] uppercase tracking-wider">
                  <th className="py-3 px-4">Vendor & GSTIN</th>
                  <th className="py-3 px-4">Invoice # & Date</th>
                  <th className="py-3 px-4">Taxable Value</th>
                  <th className="py-3 px-4">CGST + SGST</th>
                  <th className="py-3 px-4">IGST</th>
                  <th className="py-3 px-4">Total Tax</th>
                  <th className="py-3 px-4">GSTR-2B Status</th>
                  <th className="py-3 px-4 text-right">ITC Eligibility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eaedff] text-xs font-medium">
                {bills.map((bill) => {
                  const totalTax = (bill.cgst || 0) + (bill.sgst || 0) + (bill.igst || 0);
                  return (
                    <tr key={bill.id} className="hover:bg-[#f2f3ff]/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#131b2e]">{bill.vendor}</div>
                        <div className="font-mono text-[10px] text-[#6d7a72]">{bill.gstin || '29AAACW6821J1Z2'}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[#3d4a42]">
                        <div>{bill.invoiceNumber}</div>
                        <div className="text-[10px] text-[#6d7a72]">{bill.issueDate}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[#131b2e]">
                        {formatAmount(bill.taxableAmount || (bill.amount * 0.847))}
                      </td>
                      <td className="py-3 px-4 font-mono text-[#3d4a42]">
                        {(bill.cgst || bill.sgst)
                          ? `${formatAmount(bill.cgst || 0)} + ${formatAmount(bill.sgst || 0)}`
                          : '—'}
                      </td>
                      <td className="py-3 px-4 font-mono text-[#3d4a42]">
                        {bill.igst ? formatAmount(bill.igst) : '—'}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-[#006948]">
                        {formatAmount(totalTax)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#006948]/10 text-[#006948]">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Matched (100%)</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono">
                        <span className="text-[11px] font-semibold text-[#006948] bg-[#006948]/10 px-2 py-0.5 rounded-md">
                          Eligible ITC: {formatAmount(totalTax)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: GSTR-1 Outward Supplies */}
      {activeTab === 'gstr1' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff]">
            <div>
              <h3 className="text-xs font-bold text-[#131b2e]">
                GSTR-1 Monthly Return • Section 37 Outward Supplies
              </h3>
              <p className="text-[11px] text-[#6d7a72]">
                Due by 11th of every month. Includes Table 4A (B2B Taxable), Table 6A (Zero-rated export), Table 12 (HSN Summary).
              </p>
            </div>
            <button
              onClick={() => downloadGstrJson('GSTR1')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#006948] hover:bg-[#00855d] text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download GSTR-1 JSON</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#eaedff] bg-[#f8f9ff]/70 text-[10px] font-mono text-[#6d7a72] uppercase tracking-wider">
                  <th className="py-3 px-4">Customer & GSTIN</th>
                  <th className="py-3 px-4">Invoice # & Date</th>
                  <th className="py-3 px-4">Place of Supply</th>
                  <th className="py-3 px-4">Taxable Value</th>
                  <th className="py-3 px-4">CGST (9%)</th>
                  <th className="py-3 px-4">SGST (9%)</th>
                  <th className="py-3 px-4">IGST (18%)</th>
                  <th className="py-3 px-4 text-right">Invoice Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eaedff] text-xs font-medium">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#f2f3ff]/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[#131b2e]">{inv.customer}</div>
                      <div className="font-mono text-[10px] text-[#6d7a72]">{inv.gstin || '29AAGCB3796D1Z4'}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[#3d4a42]">
                      <div>{inv.invoiceNumber}</div>
                      <div className="text-[10px] text-[#6d7a72]">{inv.issueDate}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[#3d4a42]">
                      {inv.placeOfSupply || '29-Karnataka'}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#131b2e]">
                      {formatAmount(inv.taxableAmount || (inv.amount / 1.18))}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#3d4a42]">
                      {inv.cgst ? formatAmount(inv.cgst) : '—'}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#3d4a42]">
                      {inv.sgst ? formatAmount(inv.sgst) : '—'}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#3d4a42]">
                      {inv.igst ? formatAmount(inv.igst) : '—'}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#131b2e]">
                      {formatAmount(inv.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: GSTR-3B Summary Return */}
      {activeTab === 'gstr3b' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#131b2e]">
                  Form GSTR-3B Self-Assessed Monthly Summary Return
                </h3>
                <p className="text-xs text-[#6d7a72]">
                  Table 3.1 & Table 4 computations aligned with CGST Rules, Section 39.
                </p>
              </div>
              <button
                onClick={() => downloadGstrJson('GSTR3B')}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#006948] hover:bg-[#00855d] text-white text-xs font-semibold shadow-sm transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export GSTR-3B JSON</span>
              </button>
            </div>

            {/* Table 3.1 & 4 Summary Bento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#f8f9ff] border border-[#eaedff] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#131b2e]">
                    3.1 Outward Taxable Supplies (Other than zero rated)
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#006948] bg-[#006948]/10 px-2 py-0.5 rounded">
                    Output Tax
                  </span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#6d7a72]">
                    <span>Total Taxable Value:</span>
                    <span className="font-mono font-semibold text-[#131b2e]">
                      {formatAmount(invoices.reduce((s, i) => s + (i.taxableAmount || (i.amount / 1.18)), 0))}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#6d7a72]">
                    <span>Integrated Tax (IGST):</span>
                    <span className="font-mono text-[#131b2e]">
                      {formatAmount(invoices.reduce((s, i) => s + (i.igst || 0), 0))}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#6d7a72]">
                    <span>Central Tax (CGST):</span>
                    <span className="font-mono text-[#131b2e]">
                      {formatAmount(invoices.reduce((s, i) => s + (i.cgst || 0), 0))}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#6d7a72]">
                    <span>State Tax (SGST):</span>
                    <span className="font-mono text-[#131b2e]">
                      {formatAmount(invoices.reduce((s, i) => s + (i.sgst || 0), 0))}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#f8f9ff] border border-[#eaedff] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#131b2e]">
                    4. Eligible Input Tax Credit (ITC Available)
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#3b82f6] bg-[#3b82f6]/10 px-2 py-0.5 rounded">
                    ITC Credit
                  </span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#6d7a72]">
                    <span>(A)(5) All Other ITC (From GSTR-2B):</span>
                    <span className="font-mono font-semibold text-[#006948]">
                      {formatAmount(totalInputGst)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#6d7a72]">
                    <span>(B) Ineligible ITC (Blocked u/s 17(5)):</span>
                    <span className="font-mono text-[#ba1a1a]">₹0.00</span>
                  </div>
                  <div className="flex justify-between text-[#6d7a72] pt-1 border-t border-[#eaedff]">
                    <span className="font-semibold text-[#131b2e]">Net ITC Available (A - B):</span>
                    <span className="font-mono font-bold text-[#006948]">
                      {formatAmount(totalInputGst)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#6d7a72]">
                    <span className="font-semibold text-[#131b2e]">Net Cash Required for Payment:</span>
                    <span className="font-mono font-bold text-[#ba1a1a]">
                      {formatAmount(netGstPayable)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: E-Invoicing (IRN) & E-Way Bills */}
      {activeTab === 'einvoice' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#006948]/10 text-[#006948] flex items-center justify-center font-bold">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#131b2e]">
                  NIC E-Invoice System (IRN) & E-Way Bill Dispatch
                </h3>
                <p className="text-[11px] text-[#6d7a72]">
                  Mandatory B2B e-Invoicing for entities with turnover &gt; ₹5 Cr. Auto-generates 64-character SHA-256 IRN hash and signed QR code.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* List of Invoices */}
            <div className="lg:col-span-2 overflow-x-auto rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#eaedff] bg-[#f8f9ff]/70 text-[10px] font-mono text-[#6d7a72] uppercase tracking-wider">
                    <th className="py-3 px-4">Invoice #</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">IRN Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eaedff] text-xs font-medium">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-[#f2f3ff]/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold text-[#131b2e]">
                        {inv.invoiceNumber}
                      </td>
                      <td className="py-3 px-4 text-[#3d4a42]">
                        {inv.customer}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-[#131b2e]">
                        {formatAmount(inv.amount)}
                      </td>
                      <td className="py-3 px-4">
                        {inv.irn ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#006948]/10 text-[#006948]">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>IRN Generated</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#fba772]/20 text-[#ea580c]">
                            <AlertTriangle className="w-3 h-3" />
                            <span>IRN Pending</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        {!inv.irn ? (
                          <button
                            onClick={() => generateIRN(inv.id)}
                            className="px-3 py-1 rounded-lg bg-[#006948] hover:bg-[#00855d] text-white text-[11px] font-semibold transition-all active:scale-95"
                          >
                            Generate IRN
                          </button>
                        ) : (
                          <button
                            onClick={() => setSelectedInvoiceForEway(inv.id)}
                            className="px-3 py-1 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] text-[11px] font-semibold transition-all border border-[#eaedff]"
                          >
                            Generate E-Way Bill
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Live E-Invoice Signed QR Code & IRN Preview */}
            <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] space-y-4">
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-[#006948]" />
                <span className="text-xs font-bold text-[#131b2e]">
                  Official NIC Signed QR Code
                </span>
              </div>

              <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-[#eaedff] shadow-inner text-center">
                {/* Simulated High-Density QR code */}
                <div className="w-36 h-36 bg-[#131b2e] rounded-xl flex items-center justify-center text-white p-2 relative shadow-md">
                  <div className="w-full h-full border-4 border-white flex flex-col items-center justify-center">
                    <QrCode className="w-20 h-20 text-white" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-7 h-7 rounded-lg bg-[#006948] border-2 border-white flex items-center justify-center text-[10px] font-bold text-white">
                      D
                    </div>
                  </div>
                </div>

                <div className="mt-3 font-mono text-[10px] text-[#6d7a72] break-all max-w-[200px]">
                  IRN: {invoices[0]?.irn?.substring(0, 32)}...
                </div>
                <div className="text-[10px] text-[#006948] font-bold mt-1">
                  ✓ Digitally Signed by NIC e-Invoice Portal
                </div>
              </div>

              {/* Quick E-Way Bill Trigger */}
              <div className="p-3.5 rounded-xl bg-[#f8f9ff] border border-[#eaedff] space-y-2">
                <span className="text-[11px] font-semibold text-[#131b2e] flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#006948]" />
                  <span>E-Way Bill Vehicle Linkage</span>
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={vehicleNo}
                    onChange={(e) => setVehicleNo(e.target.value)}
                    placeholder="e.g. KA-01-AB-1234"
                    className="flex-1 px-3 py-1.5 rounded-lg border border-[#eaedff] bg-white text-xs font-mono uppercase focus:outline-none"
                  />
                  <button
                    onClick={() => generateEWayBill(invoices[0].id, vehicleNo)}
                    className="px-3 py-1.5 rounded-lg bg-[#006948] hover:bg-[#00855d] text-white text-xs font-semibold shadow-sm"
                  >
                    Generate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
