import React, { useState } from 'react';
import { useDigits } from '../../context/DigitsContext';
import {
  Plus,
  Search,
  Send
} from 'lucide-react';

export const InvoicingView: React.FC = () => {
  const { invoices, addInvoice, sendInvoice, markInvoicePaid } = useDigits();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [customer, setCustomer] = useState('');
  const [invNum, setInvNum] = useState(`INV-2026-00${invoices.length + 45}`);
  const [dueDate, setDueDate] = useState('2026-11-20');
  const [lineDesc, setLineDesc] = useState('');
  const [unitPrice, setUnitPrice] = useState('');

  const filtered = invoices.filter((inv) => {
    const matchSearch =
      inv.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'All' || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer || !unitPrice) return;
    const price = parseFloat(unitPrice) || 0;
    addInvoice({
      customer,
      invoiceNumber: invNum,
      issueDate: new Date().toISOString().substring(0, 10),
      dueDate,
      amount: price,
      status: 'Draft',
      items: [
        {
          description: lineDesc || 'SaaS Platform License & Inference API',
          quantity: 1,
          unitPrice: price,
          total: price
        }
      ]
    });
    setCustomer('');
    setLineDesc('');
    setUnitPrice('');
    setIsAddModalOpen(false);
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
              AUTONOMOUS INVOICING & COLLECT
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#131b2e] tracking-tight">
            Ledger Invoices & Accounts Receivable
          </h1>
          <div className="text-xs text-[#3d4a42] mt-0.5">
            Automated customer billing, payment tracking via Stripe & ACH, and automatic AGL reconciliation
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-2 rounded-full bg-[#006948] hover:bg-[#00855d] text-white font-bold text-xs active:scale-95 transition-all flex items-center space-x-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Create Invoice</span>
        </button>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm">
          <div className="text-xs text-[#3d4a42] font-semibold uppercase tracking-wider mb-1">
            Total A/R Outstanding
          </div>
          <div className="text-2xl font-bold font-mono text-[#006c49] tracking-tight">
            ${totalOutstanding.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-[#3d4a42] mt-1">Pending customer settlement</div>
        </div>

        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm">
          <div className="text-xs text-[#3d4a42] font-semibold uppercase tracking-wider mb-1">
            Total Collected (YTD)
          </div>
          <div className="text-2xl font-bold font-mono text-[#131b2e] tracking-tight">
            ${totalCollected.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-[#3d4a42] mt-1">Deposited into Chase Operating</div>
        </div>

        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm">
          <div className="text-xs text-[#3d4a42] font-semibold uppercase tracking-wider mb-1">
            Overdue Invoices
          </div>
          <div className="text-2xl font-bold font-mono text-[#ba1a1a] tracking-tight">
            {invoices.filter((i) => i.status === 'Overdue').length} Invoices
          </div>
          <div className="text-[11px] text-[#3d4a42] mt-1">Automated dunning reminders sent</div>
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
            placeholder="Search customer or invoice #..."
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
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Invoice #</th>
              <th className="py-3 px-4">Issue Date</th>
              <th className="py-3 px-4">Due Date</th>
              <th className="py-3 px-4 text-right font-mono">Amount</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eaedff] font-mono">
            {filtered.map((inv) => (
              <tr key={inv.id} className="hover:bg-[#f2f3ff]/40 transition-colors">
                <td className="py-3 px-4 font-sans font-semibold text-[#131b2e]">{inv.customer}</td>
                <td className="py-3 px-4 text-[#3d4a42] text-[11px]">{inv.invoiceNumber}</td>
                <td className="py-3 px-4 text-[#3d4a42] text-[11px]">{inv.issueDate}</td>
                <td className="py-3 px-4 text-[#131b2e] text-[11px]">{inv.dueDate}</td>
                <td className="py-3 px-4 text-right font-bold text-[#131b2e]">
                  ${inv.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
                <td className="py-3 px-4 text-right font-sans whitespace-nowrap">
                  {inv.status === 'Draft' && (
                    <button
                      onClick={() => sendInvoice(inv.id)}
                      className="px-3.5 py-1 rounded-full bg-[#f2f3ff] hover:bg-[#eaedff] text-[#006948] font-semibold text-xs transition-all flex items-center space-x-1 ml-auto border border-[#eaedff]"
                    >
                      <Send className="w-3 h-3" />
                      <span>Send Link</span>
                    </button>
                  )}
                  {inv.status === 'Sent' && (
                    <button
                      onClick={() => markInvoicePaid(inv.id)}
                      className="px-3.5 py-1 rounded-full bg-[#006948] hover:bg-[#00855d] text-white font-semibold text-xs transition-all shadow-xs"
                    >
                      Record Payment
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Invoice Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <form
            onSubmit={handleCreateInvoice}
            className="w-full max-w-md bg-white rounded-3xl p-6 space-y-4 border border-[#eaedff] shadow-2xl animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between border-b border-[#eaedff] pb-3">
              <h3 className="text-base font-bold text-[#131b2e]">Create Customer Invoice</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-7 h-7 rounded-full bg-[#f2f3ff] flex items-center justify-center text-[#3d4a42] hover:text-[#131b2e]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-semibold text-[#3d4a42] uppercase tracking-wider">
                  Customer / Enterprise Client
                </label>
                <input
                  type="text"
                  required
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  placeholder="e.g. OpenAI Corporate or Tesla AI"
                  className="w-full mt-1 bg-[#f2f3ff] border border-[#eaedff] rounded-2xl px-3.5 py-2 text-xs text-[#131b2e] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-semibold text-[#3d4a42] uppercase tracking-wider">
                    Invoice #
                  </label>
                  <input
                    type="text"
                    value={invNum}
                    onChange={(e) => setInvNum(e.target.value)}
                    className="w-full mt-1 bg-[#f2f3ff] border border-[#eaedff] rounded-2xl px-3.5 py-2 text-xs text-[#131b2e] font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-[#3d4a42] uppercase tracking-wider">
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full mt-1 bg-[#f2f3ff] border border-[#eaedff] rounded-2xl px-3.5 py-2 text-xs text-[#131b2e] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-[#3d4a42] uppercase tracking-wider">
                  Line Description
                </label>
                <input
                  type="text"
                  value={lineDesc}
                  onChange={(e) => setLineDesc(e.target.value)}
                  placeholder="e.g. Enterprise AI Platform Access - Q4"
                  className="w-full mt-1 bg-[#f2f3ff] border border-[#eaedff] rounded-2xl px-3.5 py-2 text-xs text-[#131b2e] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-[#3d4a42] uppercase tracking-wider">
                  Amount ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                  placeholder="24500.00"
                  className="w-full mt-1 bg-[#f2f3ff] border border-[#eaedff] rounded-2xl px-3.5 py-2 text-xs text-[#131b2e] font-mono font-bold focus:bg-white focus:outline-none"
                />
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
                Create & Record
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
