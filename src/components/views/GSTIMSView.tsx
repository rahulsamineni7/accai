import React, { useState } from 'react';
import { useDigits } from '../../context/DigitsContext';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  MessageCircle,
  FileText,
  AlertTriangle,
  Download,
  RefreshCw,
  Info,
  ArrowRight
} from 'lucide-react';

interface IMSInvoice {
  id: string;
  supplierName: string;
  supplierGstin: string;
  invoiceNumber: string;
  invoiceDate: string;
  taxableValue: number;
  igst: number;
  cgst: number;
  sgst: number;
  totalTax: number;
  imsStatus: 'Accepted' | 'Pending' | 'Rejected' | 'Action Required';
  internalBookStatus: 'Matched in Purchase Book' | 'Missing in Purchase Book' | 'Rate Mismatch';
  gstr1FilingDate: string;
}

export const GSTIMSView: React.FC = () => {
  const { currentEntity, formatAmount, showNotification } = useDigits();

  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedNoticeModal, setSelectedNoticeModal] = useState<'DRC01B' | 'DRC01C' | null>(null);

  const [imsInvoices, setImsInvoices] = useState<IMSInvoice[]>([
    {
      id: 'ims-1',
      supplierName: 'Infosys Cloud & Tech Services Ltd',
      supplierGstin: '29AAACI1954G1ZY',
      invoiceNumber: 'INF-2024-8819',
      invoiceDate: '2026-11-01',
      taxableValue: 100000,
      igst: 0,
      cgst: 9000,
      sgst: 9000,
      totalTax: 18000,
      imsStatus: 'Accepted',
      internalBookStatus: 'Matched in Purchase Book',
      gstr1FilingDate: '08 Nov 2026'
    },
    {
      id: 'ims-2',
      supplierName: 'WeWork India Management Pvt Ltd',
      supplierGstin: '29AAACW6821J1Z2',
      invoiceNumber: 'WW-BLR-0042',
      invoiceDate: '2026-10-28',
      taxableValue: 200000,
      igst: 0,
      cgst: 18000,
      sgst: 18000,
      totalTax: 36000,
      imsStatus: 'Accepted',
      internalBookStatus: 'Matched in Purchase Book',
      gstr1FilingDate: '09 Nov 2026'
    },
    {
      id: 'ims-3',
      supplierName: 'Shardul Amarchand Mangaldas Legal',
      supplierGstin: '07AAAFS4418P1Z6',
      invoiceNumber: 'SAM-DEL-9081',
      invoiceDate: '2026-11-03',
      taxableValue: 300000,
      igst: 54000,
      cgst: 0,
      sgst: 0,
      totalTax: 54000,
      imsStatus: 'Action Required',
      internalBookStatus: 'Matched in Purchase Book',
      gstr1FilingDate: '10 Nov 2026'
    },
    {
      id: 'ims-4',
      supplierName: 'Apex Hardware & Servers Delhi',
      supplierGstin: '07AAAPX9912K1Z4',
      invoiceNumber: 'APX-HW-7741',
      invoiceDate: '2026-11-04',
      taxableValue: 85000,
      igst: 15300,
      cgst: 0,
      sgst: 0,
      totalTax: 15300,
      imsStatus: 'Pending',
      internalBookStatus: 'Missing in Purchase Book',
      gstr1FilingDate: '10 Nov 2026'
    }
  ]);

  const handleAction = (id: string, action: IMSInvoice['imsStatus']) => {
    setImsInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, imsStatus: action } : inv))
    );
    showNotification(`IMS Status updated to "${action}". Stored in GSTN pre-filing register.`);
  };

  const handleWhatsAppVendor = (inv: IMSInvoice) => {
    const text = `Dear ${inv.supplierName}, this is regarding invoice ${inv.invoiceNumber} for ${formatAmount(inv.taxableValue + inv.totalTax)}. Our GSTN Invoice Management System (IMS) reconciliation shows a discrepancy. Please verify and amend in your GSTR-1. Regards, ${currentEntity.name}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleSyncIMS = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      showNotification('Successfully synced latest GSTN Invoice Management System (IMS) feed.');
    }, 1200);
  };

  const acceptedCount = imsInvoices.filter((i) => i.imsStatus === 'Accepted').length;
  const pendingCount = imsInvoices.filter((i) => i.imsStatus === 'Action Required' || i.imsStatus === 'Pending').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-[#006948]/10 text-[#006948]">
              <ShieldAlert className="w-5 h-5 stroke-[2.2]" />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-[#131b2e]">
              GST Invoice Management System (IMS) & Notice Shield
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#006948]/10 text-[#006948] text-[11px] font-semibold tracking-wide">
              Mandatory GSTN Portal Rule
            </span>
          </div>
          <p className="text-xs text-[#6d7a72] pl-10">
            Take action on supplier invoices before the 14th of the month to prevent deemed acceptance and block DRC-01B / DRC-01C notices.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedNoticeModal('DRC01C')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/90 hover:bg-[#eaedff] text-[#131b2e] text-xs font-semibold border border-[#eaedff] shadow-sm transition-all"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#006948]" />
            <span>DRC-01C Rule 88D Defense</span>
          </button>

          <button
            onClick={handleSyncIMS}
            disabled={isSyncing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#006948] hover:bg-[#00855d] text-white text-xs font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing IMS...' : 'Sync GSTN IMS'}</span>
          </button>
        </div>
      </div>

      {/* 4 IMS KPI Bento Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#6d7a72] uppercase tracking-wider">
              Total Inward Invoices
            </span>
            <span className="p-1.5 rounded-lg bg-[#006948]/10 text-[#006948]">
              <FileText className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-[#131b2e]">
              {imsInvoices.length} Invoices
            </div>
            <div className="text-[11px] text-[#6d7a72] mt-1 font-medium">
              Reported by suppliers on GSTN
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#6d7a72] uppercase tracking-wider">
              Accepted for GSTR-2B
            </span>
            <span className="p-1.5 rounded-lg bg-[#006948]/10 text-[#006948]">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-[#006948]">
              {acceptedCount} Invoices
            </div>
            <div className="text-[11px] text-[#006948] mt-1 font-medium">
              ITC approved & locked
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#6d7a72] uppercase tracking-wider">
              Action Required / Pending
            </span>
            <span className="p-1.5 rounded-lg bg-[#fba772]/20 text-[#ea580c]">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-[#ea580c]">
              {pendingCount} Invoices
            </div>
            <div className="text-[11px] text-[#ba1a1a] mt-1 font-medium">
              Must act before 14th 11:59 PM
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#6d7a72] uppercase tracking-wider">
              DRC-01B / C Notice Risk
            </span>
            <span className="p-1.5 rounded-lg bg-[#006948]/10 text-[#006948]">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-[#006948] flex items-center gap-1.5">
              <CheckCircle2 className="w-5 h-5" />
              <span>Zero Risk</span>
            </div>
            <div className="text-[11px] text-[#6d7a72] mt-1 font-medium">
              Output & ITC variances within ₹0
            </div>
          </div>
        </div>
      </div>

      {/* Info Warning Bar */}
      <div className="p-4 rounded-2xl bg-[#ea580c]/5 border border-[#ea580c]/20 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-[#ea580c] shrink-0 mt-0.5" />
        <div className="text-xs text-[#3d4a42] leading-relaxed">
          <strong className="text-[#131b2e]">Deemed Acceptance Notice:</strong> Under GSTN IMS rules, any supplier invoice left without explicit action by 11:59 PM on the <strong>14th of the month</strong> is automatically deemed accepted into your GSTR-2B. If an incorrect bill is accepted, you risk paying tax on unauthorized supplies!
        </div>
      </div>

      {/* IMS Reconciliation Table */}
      <div className="overflow-x-auto rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#eaedff] bg-[#f8f9ff]/70 text-[10px] font-mono text-[#6d7a72] uppercase tracking-wider">
              <th className="py-3 px-4">Supplier & GSTIN</th>
              <th className="py-3 px-4">Invoice # & Date</th>
              <th className="py-3 px-4">Taxable Value</th>
              <th className="py-3 px-4">Total Tax (ITC)</th>
              <th className="py-3 px-4">Internal Book Match</th>
              <th className="py-3 px-4">IMS Action Status</th>
              <th className="py-3 px-4 text-right">Statutory Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eaedff] font-medium">
            {imsInvoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-[#f2f3ff]/40 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-[#131b2e]">{inv.supplierName}</div>
                  <div className="font-mono text-[10px] text-[#6d7a72]">{inv.supplierGstin}</div>
                </td>
                <td className="py-3.5 px-4 font-mono text-[#3d4a42]">
                  <div>{inv.invoiceNumber}</div>
                  <div className="text-[10px] text-[#6d7a72]">{inv.invoiceDate} (Filed: {inv.gstr1FilingDate})</div>
                </td>
                <td className="py-3.5 px-4 font-mono text-[#131b2e]">
                  {formatAmount(inv.taxableValue)}
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-[#006948]">
                  {formatAmount(inv.totalTax)}
                </td>
                <td className="py-3.5 px-4">
                  <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    inv.internalBookStatus.includes('Matched')
                      ? 'bg-[#006948]/10 text-[#006948]'
                      : 'bg-[#ba1a1a]/10 text-[#ba1a1a]'
                  }`}>
                    {inv.internalBookStatus.includes('Matched') ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                    <span>{inv.internalBookStatus}</span>
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    inv.imsStatus === 'Accepted'
                      ? 'bg-[#006948]/10 text-[#006948]'
                      : inv.imsStatus === 'Rejected'
                      ? 'bg-[#ba1a1a]/10 text-[#ba1a1a]'
                      : 'bg-[#ea580c]/10 text-[#ea580c]'
                  }`}>
                    {inv.imsStatus}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                  {inv.imsStatus !== 'Accepted' && (
                    <button
                      onClick={() => handleAction(inv.id, 'Accepted')}
                      className="px-2.5 py-1 rounded-lg bg-[#006948] hover:bg-[#00855d] text-white font-semibold text-[11px] transition-all"
                    >
                      Accept
                    </button>
                  )}
                  {inv.imsStatus !== 'Pending' && (
                    <button
                      onClick={() => handleAction(inv.id, 'Pending')}
                      className="px-2.5 py-1 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] text-[#3d4a42] font-semibold text-[11px] border border-[#eaedff] transition-all"
                    >
                      Hold Transit
                    </button>
                  )}
                  {inv.imsStatus !== 'Rejected' && (
                    <button
                      onClick={() => handleAction(inv.id, 'Rejected')}
                      className="px-2.5 py-1 rounded-lg bg-[#ba1a1a]/10 hover:bg-[#ba1a1a]/20 text-[#ba1a1a] font-semibold text-[11px] transition-all"
                    >
                      Reject
                    </button>
                  )}
                  <button
                    onClick={() => handleWhatsAppVendor(inv)}
                    title="WhatsApp Supplier for Rectification"
                    className="p-1 rounded-lg bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] border border-[#25D366]/30 inline-flex items-center justify-center transition-all align-middle"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal: DRC-01C Rule 88D Defense Draft */}
      {selectedNoticeModal === 'DRC01C' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in zoom-in-95 duration-150">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 space-y-4 border border-[#eaedff] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#eaedff] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#006948]" />
                <h3 className="text-base font-bold text-[#131b2e]">
                  DRC-01C Pre-Filing ITC Verification Defense
                </h3>
              </div>
              <button
                onClick={() => setSelectedNoticeModal(null)}
                className="w-7 h-7 rounded-full bg-[#f2f3ff] flex items-center justify-center text-[#3d4a42] hover:text-[#131b2e]"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#faf8ff] border border-[#eaedff] space-y-3 text-xs leading-relaxed text-[#3d4a42]">
              <div className="font-bold text-[#131b2e]">Rule 88D Statutory Audit Analysis:</div>
              <div>• ITC Claimed in GSTR-3B: <strong className="font-mono text-[#006948]">₹1,52,200.00</strong></div>
              <div>• ITC Auto-populated in GSTR-2B: <strong className="font-mono text-[#006948]">₹1,52,200.00</strong></div>
              <div>• Net Excess Claim / Variance: <strong className="font-mono text-[#006948]">₹0.00 (0.00%)</strong></div>
              <div className="pt-2 border-t border-[#eaedff] text-[11px] text-[#006948] font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>No automated DRC-01C notice can be issued by the GSTN portal algorithm.</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedNoticeModal(null)}
                className="px-5 py-2 rounded-full bg-[#006948] text-white font-bold text-xs shadow-sm hover:bg-[#00855d]"
              >
                Close Defense Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

