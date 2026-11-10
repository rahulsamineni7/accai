import React, { useState } from 'react';
import { useDigits } from '../../context/DigitsContext';
import {
  Clock,
  ShieldCheck,
  AlertTriangle,
  Download,
  Building2,
  CheckCircle2,
  Calendar,
  Zap,
  ExternalLink,
  ChevronRight,
  TrendingDown,
  Info
} from 'lucide-react';

interface MSMEVendorBill {
  id: string;
  vendor: string;
  udyamNumber: string;
  enterpriseTier: 'Micro' | 'Small' | 'Medium';
  invoiceNumber: string;
  goodsAcceptanceDate: string; // Anchor date
  dueDate: string;
  amount: number;
  hasWrittenAgreement: boolean;
  maxStatutoryDays: 15 | 45;
  daysElapsed: number;
  status: 'Safe' | 'Day 10 Alert' | 'Critical Due' | 'Paid';
}

export const MSMEGuardView: React.FC = () => {
  const { currentEntity, formatAmount, showNotification } = useDigits();

  const [filterTier, setFilterTier] = useState<'ALL' | 'Micro' | 'Small'>('ALL');
  const [msmeBills, setMsmeBills] = useState<MSMEVendorBill[]>([
    {
      id: 'msme-1',
      vendor: 'Bangalore Precision Tooling Works',
      udyamNumber: 'UDYAM-KR-03-0014891',
      enterpriseTier: 'Micro',
      invoiceNumber: 'BPT-2024-881',
      goodsAcceptanceDate: '2026-10-28',
      dueDate: '2026-11-12',
      amount: 118000,
      hasWrittenAgreement: false,
      maxStatutoryDays: 15,
      daysElapsed: 13,
      status: 'Day 10 Alert'
    },
    {
      id: 'msme-2',
      vendor: 'Ananya Software Solutions LLP',
      udyamNumber: 'UDYAM-KR-03-0082194',
      enterpriseTier: 'Small',
      invoiceNumber: 'AN-DEV-4412',
      goodsAcceptanceDate: '2026-10-10',
      dueDate: '2026-11-24',
      amount: 236000,
      hasWrittenAgreement: true,
      maxStatutoryDays: 45,
      daysElapsed: 31,
      status: 'Safe'
    },
    {
      id: 'msme-3',
      vendor: 'Deccan Logistics & Warehousing',
      udyamNumber: 'UDYAM-TS-01-0021490',
      enterpriseTier: 'Micro',
      invoiceNumber: 'DEC-LOG-119',
      goodsAcceptanceDate: '2026-10-26',
      dueDate: '2026-11-10',
      amount: 64500,
      hasWrittenAgreement: false,
      maxStatutoryDays: 15,
      daysElapsed: 15,
      status: 'Critical Due'
    },
    {
      id: 'msme-4',
      vendor: 'Indus Paper Packaging Hub',
      udyamNumber: 'UDYAM-MH-12-0044129',
      enterpriseTier: 'Small',
      invoiceNumber: 'INDUS-PKG-904',
      goodsAcceptanceDate: '2026-10-20',
      dueDate: '2026-12-04',
      amount: 88500,
      hasWrittenAgreement: true,
      maxStatutoryDays: 45,
      daysElapsed: 21,
      status: 'Safe'
    }
  ]);

  const totalMsmeExposure = msmeBills.reduce((sum, b) => sum + (b.status !== 'Paid' ? b.amount : 0), 0);
  const criticalBills = msmeBills.filter((b) => b.status === 'Day 10 Alert' || b.status === 'Critical Due');
  const criticalAmount = criticalBills.reduce((sum, b) => sum + b.amount, 0);

  const handlePayImmediately = (id: string) => {
    setMsmeBills((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'Paid' as const } : b))
    );
    showNotification('Disbursement approved via RTGS. MSME 15-day clock neutralized before penalty.');
  };

  const handleExportSchedule = () => {
    const textData = `FORM 26 / SCHEDULE III MSME DISCLOSURE - SECTION 37(2)(g)
Entity: ${currentEntity.name}
GSTIN: ${currentEntity.gstin || '29AABCA1234F1Z8'}
Principal Amount Remaining Unpaid: INR ${totalMsmeExposure}
Total Delayed MSME Payments: 0 (All cleared within 15/45-day statutory window)
Interest Paid under Section 16 of MSMED Act: Nil
Audit Status: Clean Certificate under Section 44AB Tax Audit`;

    const blob = new Blob([textData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MSME_Schedule_Section37_2_g_${currentEntity.slug || 'accai'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Downloaded MSME Form 1 & Tax Audit Form 26 Schedule for Auditor sign-off.');
  };

  const filtered = filterTier === 'ALL'
    ? msmeBills
    : msmeBills.filter((b) => b.enterpriseTier === filterTier);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-[#006948]/10 text-[#006948]">
              <Clock className="w-5 h-5 stroke-[2.2]" />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-[#131b2e]">
              Section 37(2)(g) MSME 15/45-Day Payment Guard
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#006948]/10 text-[#006948] text-[11px] font-semibold tracking-wide">
              Formerly Sec 43B(h)
            </span>
          </div>
          <p className="text-xs text-[#6d7a72] pl-10">
            Guarantees statutory protection against Income Tax expense disallowances and 3x RBI bank-rate interest penalties for Micro & Small vendor bills.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportSchedule}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/90 hover:bg-[#eaedff] text-[#131b2e] text-xs font-semibold border border-[#eaedff] shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5 text-[#006948]" />
            <span>Form 26 Tax Audit Schedule</span>
          </button>
        </div>
      </div>

      {/* 4 MSME KPI Bento Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total MSME Payables */}
        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#6d7a72] uppercase tracking-wider">
              Total MSME Payables
            </span>
            <span className="p-1.5 rounded-lg bg-[#006948]/10 text-[#006948]">
              <Building2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-[#131b2e]">
              {formatAmount(totalMsmeExposure)}
            </div>
            <div className="text-[11px] text-[#6d7a72] mt-1 font-medium">
              4 Active Micro/Small Vendors
            </div>
          </div>
        </div>

        {/* At-Risk MSME Exposure (Day 10/40) */}
        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#6d7a72] uppercase tracking-wider">
              At-Risk (Day 10/40 Alert)
            </span>
            <span className="p-1.5 rounded-lg bg-[#fba772]/20 text-[#ea580c]">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-[#ea580c]">
              {formatAmount(criticalAmount)}
            </div>
            <div className="text-[11px] text-[#ba1a1a] mt-1 font-medium flex items-center gap-1">
              <span>Must settle within 48 hours</span>
            </div>
          </div>
        </div>

        {/* Tax Disallowance Exposure */}
        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#6d7a72] uppercase tracking-wider">
              Sec 37(2)(g) Disallowance
            </span>
            <span className="p-1.5 rounded-lg bg-[#006948]/10 text-[#006948]">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-[#006948]">
              ₹0.00
            </div>
            <div className="text-[11px] text-[#006948] mt-1 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100% Books Safe & Compliant</span>
            </div>
          </div>
        </div>

        {/* 3x RBI Interest Penalty Avoided */}
        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#6d7a72] uppercase tracking-wider">
              3x RBI Interest Avoided
            </span>
            <span className="p-1.5 rounded-lg bg-[#3b82f6]/10 text-[#3b82f6]">
              <Zap className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-[#131b2e]">
              {formatAmount(36400)}
            </div>
            <div className="text-[11px] text-[#6d7a72] mt-1 font-medium">
              Saved @ 20.25% p.a. compound
            </div>
          </div>
        </div>
      </div>

      {/* Info Notice Box */}
      <div className="p-4 rounded-2xl bg-[#006948]/5 border border-[#006948]/20 flex items-start gap-3">
        <Info className="w-4 h-4 text-[#006948] shrink-0 mt-0.5" />
        <div className="text-xs text-[#3d4a42] leading-relaxed">
          <strong className="text-[#131b2e]">Statutory Rule:</strong> Section 37(2)(g) (formerly 43B(h)) of the Income-tax Act, 2025 mandates payment to Micro & Small enterprises within <strong>15 days</strong> (no written agreement) or <strong>45 days</strong> (written contract) anchored to the goods acceptance date. Payments delayed past March 31 cannot be claimed as tax deductions in the current year.
        </div>
      </div>

      {/* MSME Vendor Bills Table with Live Countdown Clocks */}
      <div className="overflow-x-auto rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#eaedff] bg-[#f8f9ff]/70 text-[10px] font-mono text-[#6d7a72] uppercase tracking-wider">
              <th className="py-3 px-4">Vendor & Udyam #</th>
              <th className="py-3 px-4">Tier & Agreement</th>
              <th className="py-3 px-4">Invoice # & Date</th>
              <th className="py-3 px-4">Days Elapsed</th>
              <th className="py-3 px-4">Statutory Clock Progress</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eaedff] font-medium">
            {filtered.map((item) => {
              const remainingDays = item.maxStatutoryDays - item.daysElapsed;
              const percentElapsed = Math.min(100, Math.round((item.daysElapsed / item.maxStatutoryDays) * 100));

              return (
                <tr key={item.id} className="hover:bg-[#f2f3ff]/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-[#131b2e]">{item.vendor}</div>
                    <div className="font-mono text-[10px] text-[#006948] font-bold">
                      {item.udyamNumber}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.enterpriseTier === 'Micro'
                        ? 'bg-[#ba1a1a]/10 text-[#ba1a1a]'
                        : 'bg-[#006948]/10 text-[#006948]'
                    }`}>
                      {item.enterpriseTier} Enterprise
                    </span>
                    <div className="text-[10px] text-[#6d7a72] mt-0.5">
                      {item.hasWrittenAgreement ? '45-Day Written Contract' : '15-Day Statutory Default'}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#3d4a42]">
                    <div>{item.invoiceNumber}</div>
                    <div className="text-[10px] text-[#6d7a72]">Accepted: {item.goodsAcceptanceDate}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    <div className={`font-bold ${remainingDays <= 2 ? 'text-[#ba1a1a]' : remainingDays <= 5 ? 'text-[#ea580c]' : 'text-[#131b2e]'}`}>
                      Day {item.daysElapsed} of {item.maxStatutoryDays}
                    </div>
                    <div className="text-[10px] text-[#6d7a72]">
                      {remainingDays > 0 ? `${remainingDays} days left` : 'Due Today'}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 w-44">
                    <div className="w-full bg-[#eaedff] h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          percentElapsed >= 90
                            ? 'bg-[#ba1a1a]'
                            : percentElapsed >= 70
                            ? 'bg-[#ea580c]'
                            : 'bg-[#006948]'
                        }`}
                        style={{ width: `${percentElapsed}%` }}
                      />
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[#131b2e]">
                    {formatAmount(item.amount)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {item.status === 'Paid' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#006948] bg-[#006948]/10 px-2.5 py-1 rounded-lg">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Neutralized</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handlePayImmediately(item.id)}
                        className="px-3 py-1.5 rounded-lg bg-[#006948] hover:bg-[#00855d] text-white font-semibold text-[11px] shadow-sm transition-all active:scale-95"
                      >
                        Priority Disburse
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

