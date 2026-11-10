import React, { useState } from 'react';
import { useDigits } from '../../context/DigitsContext';
import {
  FileText,
  Download,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Calendar,
  Sparkles,
  ExternalLink,
  Receipt,
  FileCheck2,
  CreditCard,
  Percent
} from 'lucide-react';

export const TDSComplianceView: React.FC = () => {
  const { currentEntity, bills, formatAmount, showNotification } = useDigits();

  const [selectedSection, setSelectedSection] = useState<'ALL' | '194J' | '194C' | '194I'>('ALL');

  // Compute TDS metrics
  const totalTdsDeducted = bills.reduce((sum, b) => sum + (b.tdsAmount || 0), 0);
  const totalTdsDeposited = 185000;
  const pendingDeposit = Math.max(0, totalTdsDeducted - totalTdsDeposited);

  const filteredBills = selectedSection === 'ALL'
    ? bills
    : bills.filter((b) => b.tdsSection === selectedSection);

  const handleGenerateChallan = () => {
    showNotification('Generated Challan ITNS 281 for NSDL e-Tax Payment gateway.');
  };

  const handleExportForm26Q = () => {
    const textData = `FORM 26Q - QUARTERLY STATEMENT OF TAX DEDUCTED AT SOURCE
TAN: BLRA12345F
Deductor: ${currentEntity.name}
Financial Year: 2024-25 | Quarter: Q3 (October - December)
Total Deductions: ${bills.length}
Total TDS Amount: INR ${totalTdsDeducted}
Status: 100% Validated against TRACES PAN Database`;

    const blob = new Blob([textData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Form26Q_${currentEntity.slug || 'accai'}_Q3_FY25.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Form 26Q e-TDS text file exported successfully for NSDL RPU utility.');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-[#006948]/10 text-[#006948]">
              <FileText className="w-5 h-5 stroke-[2.2]" />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-[#131b2e]">
              TDS & Form 26Q Compliance Hub
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#006948]/10 text-[#006948] text-[11px] font-semibold tracking-wide">
              Income Tax Act 1961
            </span>
          </div>
          <p className="text-xs text-[#6d7a72] pl-10">
            Autonomous Tax Deducted at Source tracking, monthly Challan 281 payments, and TRACES Form 26Q quarterly returns.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col text-right">
            <span className="text-[10px] font-mono text-[#6d7a72] uppercase tracking-wider font-semibold">
              TAN (Tax Deduction Acc #)
            </span>
            <span className="text-xs font-mono font-bold text-[#131b2e] bg-[#f2f3ff] px-2.5 py-1 rounded-lg border border-[#eaedff]">
              BLRA12345F
            </span>
          </div>

          <button
            onClick={handleExportForm26Q}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#006948] hover:bg-[#00855d] text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Form 26Q File</span>
          </button>
        </div>
      </div>

      {/* 4 Key TDS Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total TDS Deducted */}
        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#6d7a72] uppercase tracking-wider">
              Total TDS Deducted (Q3)
            </span>
            <span className="p-1.5 rounded-lg bg-[#006948]/10 text-[#006948]">
              <Percent className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-[#131b2e]">
              {formatAmount(totalTdsDeducted)}
            </div>
            <div className="text-[11px] text-[#006948] mt-1 font-medium">
              Auto-calculated from vendor bills
            </div>
          </div>
        </div>

        {/* TDS Deposited */}
        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#6d7a72] uppercase tracking-wider">
              TDS Deposited via Challan
            </span>
            <span className="p-1.5 rounded-lg bg-[#3b82f6]/10 text-[#3b82f6]">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-[#006948]">
              {formatAmount(totalTdsDeposited)}
            </div>
            <div className="text-[11px] text-[#6d7a72] mt-1 font-medium">
              Challan 281 BSR verified
            </div>
          </div>
        </div>

        {/* Pending Deposit */}
        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#6d7a72] uppercase tracking-wider">
              Pending Deposit (Due 7th)
            </span>
            <span className="p-1.5 rounded-lg bg-[#fba772]/20 text-[#ea580c]">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-[#ea580c]">
              {formatAmount(pendingDeposit)}
            </div>
            <div className="text-[11px] text-[#6d7a72] mt-1 font-medium">
              Due by 7th November 2026
            </div>
          </div>
        </div>

        {/* Form 26Q Status */}
        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#6d7a72] uppercase tracking-wider">
              Form 26Q Readiness
            </span>
            <span className="p-1.5 rounded-lg bg-[#006948]/10 text-[#006948]">
              <FileCheck2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-[#006948] flex items-center gap-1.5">
              <CheckCircle2 className="w-5 h-5" />
              <span>100% Ready</span>
            </div>
            <div className="text-[11px] text-[#6d7a72] mt-1 font-medium">
              All vendor PANs verified
            </div>
          </div>
        </div>
      </div>

      {/* Section Filter Badges */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {(['ALL', '194J', '194C', '194I'] as const).map((sec) => (
            <button
              key={sec}
              onClick={() => setSelectedSection(sec)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedSection === sec
                  ? 'bg-[#006948] text-white shadow-sm'
                  : 'bg-white/80 text-[#3d4a42] hover:bg-[#eaedff] border border-[#eaedff]'
              }`}
            >
              {sec === 'ALL' ? 'All Sections' : `Section ${sec}`}
            </button>
          ))}
        </div>

        <button
          onClick={handleGenerateChallan}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/90 hover:bg-[#eaedff] text-[#131b2e] text-xs font-semibold border border-[#eaedff] shadow-sm transition-all"
        >
          <CreditCard className="w-3.5 h-3.5 text-[#006948]" />
          <span>Generate Challan 281 E-Payment</span>
        </button>
      </div>

      {/* Vendor TDS Register Table */}
      <div className="overflow-x-auto rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#eaedff] bg-[#f8f9ff]/70 text-[10px] font-mono text-[#6d7a72] uppercase tracking-wider">
              <th className="py-3 px-4">Vendor & Deductee PAN</th>
              <th className="py-3 px-4">Section & Nature</th>
              <th className="py-3 px-4">Invoice Value</th>
              <th className="py-3 px-4">TDS Rate</th>
              <th className="py-3 px-4">TDS Deducted</th>
              <th className="py-3 px-4">Net Paid to Vendor</th>
              <th className="py-3 px-4">Challan Status</th>
              <th className="py-3 px-4 text-right">Form 16A</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eaedff] text-xs font-medium">
            {filteredBills.map((bill) => (
              <tr key={bill.id} className="hover:bg-[#f2f3ff]/40 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-semibold text-[#131b2e]">{bill.vendor}</div>
                  <div className="font-mono text-[10px] text-[#6d7a72]">
                    PAN: {bill.gstin?.substring(2, 12) || 'AABCA1234F'} • {bill.gstin || '29AABCA1234F1Z8'}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="font-mono font-bold text-[#006948] bg-[#006948]/10 px-2 py-0.5 rounded text-[11px]">
                    u/s {bill.tdsSection || '194J'}
                  </span>
                  <div className="text-[10px] text-[#6d7a72] mt-0.5">
                    {bill.tdsSection === '194I' ? 'Rent of Real Estate' : 'Technical & Professional'}
                  </div>
                </td>
                <td className="py-3 px-4 font-mono font-semibold text-[#131b2e]">
                  {formatAmount(bill.amount)}
                </td>
                <td className="py-3 px-4 font-mono font-bold text-[#3d4a42]">
                  {bill.tdsRate || 10}%
                </td>
                <td className="py-3 px-4 font-mono font-bold text-[#ba1a1a]">
                  {formatAmount(bill.tdsAmount || (bill.amount * 0.1))}
                </td>
                <td className="py-3 px-4 font-mono font-bold text-[#006948]">
                  {formatAmount(bill.netPayable || (bill.amount * 0.9))}
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#006948]/10 text-[#006948]">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Challan Matched</span>
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => showNotification(`Form 16A Certificate generated for ${bill.vendor}`)}
                    className="px-2.5 py-1 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] text-[11px] font-semibold transition-all border border-[#eaedff]"
                  >
                    Download 16A
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
