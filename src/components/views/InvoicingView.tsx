import React, { useState } from 'react';
import { useDigits } from '../../context/DigitsContext';
import {
  Plus,
  Search,
  Send,
  QrCode,
  Share2,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  ExternalLink,
  MessageCircle,
  ShieldCheck,
  Building2,
  X
} from 'lucide-react';
import { Invoice } from '../../types';

export const InvoicingView: React.FC = () => {
  const {
    currentEntity,
    invoices,
    addInvoice,
    sendInvoice,
    markInvoicePaid,
    generateIRN,
    formatAmount,
    currency,
    showNotification
  } = useDigits();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUpiInvoice, setSelectedUpiInvoice] = useState<Invoice | null>(null);

  // Form state
  const [customer, setCustomer] = useState('');
  const [customerGstin, setCustomerGstin] = useState('');
  const [invNum, setInvNum] = useState(`INV-IN-2024-00${invoices.length + 10}`);
  const [dueDate, setDueDate] = useState('2026-11-20');
  const [lineDesc, setLineDesc] = useState('');
  const [hsnSac, setHsnSac] = useState('SAC 998314');
  const [unitPrice, setUnitPrice] = useState('');
  const [gstRate, setGstRate] = useState<number>(18);
  const [supplyType, setSupplyType] = useState<'intra' | 'inter'>('intra');

  const filtered = invoices.filter((inv) => {
    const matchSearch =
      inv.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.gstin && inv.gstin.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchStatus = statusFilter === 'All' || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer || !unitPrice) return;
    const taxable = parseFloat(unitPrice) || 0;
    const taxTotal = (taxable * gstRate) / 100;
    const isInter = supplyType === 'inter';

    const cgst = isInter ? 0 : taxTotal / 2;
    const sgst = isInter ? 0 : taxTotal / 2;
    const igst = isInter ? taxTotal : 0;
    const totalAmount = taxable + taxTotal;

    addInvoice({
      customer,
      invoiceNumber: invNum,
      issueDate: new Date().toISOString().substring(0, 10),
      dueDate,
      amount: totalAmount,
      status: 'Sent',
      gstin: customerGstin || '29AAGCB3796D1Z4',
      placeOfSupply: isInter ? '06-Haryana (Inter-State IGST)' : '29-Karnataka (Intra-State)',
      taxableAmount: taxable,
      cgst,
      sgst,
      igst,
      irnStatus: 'Pending',
      upiId: 'acmetech@hdfcbank',
      upiQrString: `upi://pay?pa=acmetech@hdfcbank&pn=Acme+Technologies&am=${totalAmount}&cu=INR&tn=${invNum}`,
      items: [
        {
          description: lineDesc || 'Autonomous GL & Cloud Intelligence API',
          quantity: 1,
          unitPrice: taxable,
          total: taxable,
          hsnSac,
          gstRate
        }
      ]
    });

    setCustomer('');
    setCustomerGstin('');
    setLineDesc('');
    setUnitPrice('');
    setIsAddModalOpen(false);
  };

  const handleShareWhatsApp = (inv: Invoice) => {
    const text = `Namaste! Here is your Tax Invoice ${inv.invoiceNumber} for ${formatAmount(inv.amount)} from ${currentEntity.name}.\n\nGSTIN: ${currentEntity.gstin || '29AABCA1234F1Z8'}\nTaxable: ${formatAmount(inv.taxableAmount || (inv.amount / 1.18))}\nGST: ${formatAmount(inv.amount - (inv.taxableAmount || (inv.amount / 1.18)))}\n\nPay instantly via UPI: ${inv.upiId || 'acmetech@hdfcbank'}\nThank you for your business!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const totalCollected = invoices
    .filter((i) => i.status === 'Paid')
    .reduce((sum, i) => sum + i.amount, 0);

  const totalOutstanding = invoices
    .filter((i) => i.status === 'Sent' || i.status === 'Overdue')
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#eaedff] pb-4">
        <div>
          <div className="text-xs font-semibold text-[#006948] mb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#006c49] shadow-[0_0_8px_#6cf8bb] animate-pulse" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider">
              AUTONOMOUS INVOICING & GST RECOVERY
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#131b2e] tracking-tight">
            Tax Invoices & Accounts Receivable
          </h1>
          <div className="text-xs text-[#3d4a42] mt-0.5">
            Automated Indian GST tax billing, instant UPI QR collections, WhatsApp reminders, and NIC e-Invoicing (IRN)
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-2 rounded-full bg-[#006948] hover:bg-[#00855d] text-white font-bold text-xs active:scale-95 transition-all flex items-center space-x-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ Create GST Invoice</span>
        </button>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm">
          <div className="text-xs text-[#3d4a42] font-semibold uppercase tracking-wider mb-1">
            Total A/R Outstanding
          </div>
          <div className="text-2xl font-bold font-mono text-[#006c49] tracking-tight">
            {formatAmount(totalOutstanding)}
          </div>
          <div className="text-[11px] text-[#3d4a42] mt-1">Pending customer settlement</div>
        </div>

        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm">
          <div className="text-xs text-[#3d4a42] font-semibold uppercase tracking-wider mb-1">
            Total Collected (YTD)
          </div>
          <div className="text-2xl font-bold font-mono text-[#131b2e] tracking-tight">
            {formatAmount(totalCollected)}
          </div>
          <div className="text-[11px] text-[#3d4a42] mt-1">Deposited into Bank Current Account</div>
        </div>

        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm">
          <div className="text-xs text-[#3d4a42] font-semibold uppercase tracking-wider mb-1">
            Overdue Invoices
          </div>
          <div className="text-2xl font-bold font-mono text-[#ba1a1a] tracking-tight">
            {invoices.filter((i) => i.status === 'Overdue').length} Invoices
          </div>
          <div className="text-[11px] text-[#3d4a42] mt-1">Automated WhatsApp & Email dunning active</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white/90 backdrop-blur-xl p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-sm border border-[#eaedff]">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#3d4a42]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search customer, GSTIN or invoice #..."
            className="w-full bg-[#f2f3ff] rounded-full pl-10 pr-4 py-2 text-xs text-[#131b2e] placeholder-[#3d4a42]/70 focus:outline-none focus:bg-white border border-transparent focus:border-[#6cf8bb] transition-all"
          />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto">
          {['All', 'Sent', 'Paid', 'Overdue', 'Draft'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                statusFilter === st
                  ? 'bg-[#006948] text-white shadow-sm'
                  : 'text-[#3d4a42] hover:bg-[#eaedff]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl overflow-hidden shadow-sm border border-[#eaedff]">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#eaedff] bg-[#f2f3ff]/70 text-[#3d4a42] text-[10px] uppercase tracking-wider font-semibold">
              <th className="py-3 px-4">Customer & GSTIN</th>
              <th className="py-3 px-4">Invoice # & SAC</th>
              <th className="py-3 px-4">Taxable Value</th>
              <th className="py-3 px-4">GST (CGST+SGST / IGST)</th>
              <th className="py-3 px-4 text-right font-mono">Total Value</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-center">E-Invoice (IRN)</th>
              <th className="py-3 px-4 text-right">Instant Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eaedff] font-mono">
            {filtered.map((inv) => {
              const taxable = inv.taxableAmount || (inv.amount / 1.18);
              const gstTotal = inv.amount - taxable;

              return (
                <tr key={inv.id} className="hover:bg-[#f2f3ff]/40 transition-colors">
                  <td className="py-3 px-4 font-sans">
                    <div className="font-semibold text-[#131b2e]">{inv.customer}</div>
                    <div className="font-mono text-[10px] text-[#6d7a72]">{inv.gstin || '29AAGCB3796D1Z4'}</div>
                  </td>
                  <td className="py-3 px-4 text-[11px]">
                    <div className="font-semibold text-[#131b2e]">{inv.invoiceNumber}</div>
                    <div className="text-[10px] text-[#006948] font-bold">
                      {inv.items[0]?.hsnSac || 'SAC 998314'}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-[#3d4a42]">
                    {formatAmount(taxable)}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-[#3d4a42]">
                    {inv.igst ? (
                      <span className="text-[#ea580c]">IGST {formatAmount(inv.igst)}</span>
                    ) : (
                      <span>CGST+SGST {formatAmount(gstTotal)}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-[#131b2e]">
                    {formatAmount(inv.amount)}
                  </td>
                  <td className="py-3 px-4 text-center font-sans">
                    <span
                      className={`inline-flex items-center text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
                        inv.status === 'Paid'
                          ? 'bg-[#85f8c4]/40 text-[#005137] border-[#85f8c4]/60'
                          : inv.status === 'Sent'
                          ? 'bg-[#eaedff] text-[#131b2e] border-[#dae2fd]'
                          : inv.status === 'Overdue'
                          ? 'bg-[#ffdad6]/60 text-[#ba1a1a] border-[#ffdad6]'
                          : 'bg-[#f2f3ff] text-[#3d4a42] border-[#eaedff]'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-sans">
                    {inv.irn ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#006948] bg-[#006948]/10 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>IRN Active</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => generateIRN(inv.id)}
                        className="text-[10px] font-semibold text-[#ea580c] bg-[#fba772]/20 hover:bg-[#fba772]/30 px-2 py-0.5 rounded-full transition-all"
                      >
                        + Generate IRN
                      </button>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right font-sans whitespace-nowrap space-x-1.5">
                    {/* Instant UPI QR Code Button */}
                    <button
                      onClick={() => setSelectedUpiInvoice(inv)}
                      title="Scan UPI QR to Pay"
                      className="p-1.5 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] text-[#006948] border border-[#eaedff] transition-all inline-flex items-center justify-center"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                    </button>

                    {/* WhatsApp 1-Click Share */}
                    <button
                      onClick={() => handleShareWhatsApp(inv)}
                      title="Share Tax Invoice on WhatsApp"
                      className="p-1.5 rounded-lg bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] border border-[#25D366]/30 transition-all inline-flex items-center justify-center"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </button>

                    {inv.status === 'Sent' && (
                      <button
                        onClick={() => markInvoicePaid(inv.id)}
                        className="px-2.5 py-1 rounded-lg bg-[#006948] hover:bg-[#00855d] text-white font-semibold text-[11px] transition-all shadow-xs"
                      >
                        Record Paid
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal: Instant UPI QR Code Payment */}
      {selectedUpiInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 space-y-4 border border-[#eaedff] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#eaedff] pb-3">
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-[#006948]" />
                <h3 className="text-sm font-bold text-[#131b2e]">Scan & Pay via UPI</h3>
              </div>
              <button
                onClick={() => setSelectedUpiInvoice(null)}
                className="p-1 rounded-full text-[#6d7a72] hover:bg-[#f2f3ff]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col items-center justify-center p-5 bg-[#faf8ff] rounded-2xl border border-[#eaedff] text-center space-y-3">
              {/* Simulated QR Box */}
              <div className="w-44 h-44 bg-white p-3 rounded-2xl border-2 border-[#eaedff] shadow-sm flex items-center justify-center relative">
                <QrCode className="w-36 h-36 text-[#131b2e]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-lg bg-[#006948] border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-md">
                    UPI
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-[#131b2e]">{selectedUpiInvoice.customer}</div>
                <div className="font-mono text-xl font-bold text-[#006948] mt-0.5">
                  {formatAmount(selectedUpiInvoice.amount)}
                </div>
                <div className="font-mono text-[11px] text-[#6d7a72] mt-1">
                  VPA: <span className="text-[#131b2e] font-semibold">{selectedUpiInvoice.upiId || 'acmetech@hdfcbank'}</span>
                </div>
              </div>

              {/* Supported UPI Apps Pills */}
              <div className="flex items-center justify-center gap-1.5 pt-1 text-[10px] font-semibold text-[#6d7a72]">
                <span className="px-2 py-0.5 rounded bg-white border border-[#eaedff]">PhonePe</span>
                <span className="px-2 py-0.5 rounded bg-white border border-[#eaedff]">GPay</span>
                <span className="px-2 py-0.5 rounded bg-white border border-[#eaedff]">Paytm</span>
                <span className="px-2 py-0.5 rounded bg-white border border-[#eaedff]">CRED</span>
              </div>
            </div>

            <button
              onClick={() => {
                markInvoicePaid(selectedUpiInvoice.id);
                setSelectedUpiInvoice(null);
              }}
              className="w-full py-2.5 rounded-xl bg-[#006948] hover:bg-[#00855d] text-white text-xs font-bold shadow-sm transition-all"
            >
              Simulate Instant Settlement (Auto-Reconcile)
            </button>
          </div>
        </div>
      )}

      {/* New GST Invoice Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in zoom-in-95 duration-150">
          <form
            onSubmit={handleCreateInvoice}
            className="w-full max-w-lg bg-white rounded-3xl p-6 space-y-4 border border-[#eaedff] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#eaedff] pb-3">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-[#006948]" />
                <h3 className="text-base font-bold text-[#131b2e]">Create Indian GST Tax Invoice</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-7 h-7 rounded-full bg-[#f2f3ff] flex items-center justify-center text-[#3d4a42] hover:text-[#131b2e]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-semibold text-[#3d4a42] uppercase tracking-wider">
                    Customer / Business Name
                  </label>
                  <input
                    type="text"
                    required
                    value={customer}
                    onChange={(e) => setCustomer(e.target.value)}
                    placeholder="e.g. Swiggy or Zomato"
                    className="w-full mt-1 bg-[#f2f3ff] border border-[#eaedff] rounded-xl px-3.5 py-2 text-xs text-[#131b2e] focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-[#3d4a42] uppercase tracking-wider">
                    Customer GSTIN
                  </label>
                  <input
                    type="text"
                    value={customerGstin}
                    onChange={(e) => setCustomerGstin(e.target.value)}
                    placeholder="29AAGCB3796D1Z4"
                    className="w-full mt-1 bg-[#f2f3ff] border border-[#eaedff] rounded-xl px-3.5 py-2 text-xs text-[#131b2e] font-mono focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-semibold text-[#3d4a42] uppercase tracking-wider">
                    Invoice #
                  </label>
                  <input
                    type="text"
                    value={invNum}
                    onChange={(e) => setInvNum(e.target.value)}
                    className="w-full mt-1 bg-[#f2f3ff] border border-[#eaedff] rounded-xl px-3.5 py-2 text-xs text-[#131b2e] font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-[#3d4a42] uppercase tracking-wider">
                    Supply Type
                  </label>
                  <select
                    value={supplyType}
                    onChange={(e) => setSupplyType(e.target.value as 'intra' | 'inter')}
                    className="w-full mt-1 bg-[#f2f3ff] border border-[#eaedff] rounded-xl px-3 py-2 text-xs text-[#131b2e]"
                  >
                    <option value="intra">Intra-State (CGST + SGST)</option>
                    <option value="inter">Inter-State (IGST)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-[#3d4a42] uppercase tracking-wider">
                    GST Rate
                  </label>
                  <select
                    value={gstRate}
                    onChange={(e) => setGstRate(Number(e.target.value))}
                    className="w-full mt-1 bg-[#f2f3ff] border border-[#eaedff] rounded-xl px-3 py-2 text-xs text-[#131b2e]"
                  >
                    <option value={18}>18% (Standard SaaS/Services)</option>
                    <option value={12}>12% (IT Hardware)</option>
                    <option value={5}>5% (Transport/Essential)</option>
                    <option value={28}>28% (Luxury)</option>
                    <option value={0}>0% (Export SEZ)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-semibold text-[#3d4a42] uppercase tracking-wider">
                    HSN / SAC Code
                  </label>
                  <select
                    value={hsnSac}
                    onChange={(e) => setHsnSac(e.target.value)}
                    className="w-full mt-1 bg-[#f2f3ff] border border-[#eaedff] rounded-xl px-3 py-2 text-xs text-[#131b2e]"
                  >
                    <option value="SAC 998314">SAC 998314 - Cloud Computing & AI</option>
                    <option value="SAC 998313">SAC 998313 - Software Development</option>
                    <option value="SAC 998311">SAC 998311 - Management Consulting</option>
                    <option value="HSN 8471">HSN 8471 - Computer Systems / GPU</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-[#3d4a42] uppercase tracking-wider">
                    Taxable Amount ({currency === 'INR' ? '₹' : '$'})
                  </label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                    placeholder="100000"
                    className="w-full mt-1 bg-[#f2f3ff] border border-[#eaedff] rounded-xl px-3.5 py-2 text-xs text-[#131b2e] font-mono font-bold focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#eaedff]">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-full text-xs font-medium text-[#3d4a42] hover:bg-[#f2f3ff]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-[#006948] hover:bg-[#00855d] text-white font-bold text-xs shadow-sm"
              >
                Generate Tax Invoice
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
