import React, { useState } from 'react';
import { useDigits } from '../../context/DigitsContext';
import {
  TrendingDown,
  TrendingUp
} from 'lucide-react';

export const DirectoryView: React.FC = () => {
  const { transactions } = useDigits();
  const [tab, setTab] = useState<'vendors' | 'customers'>('vendors');

  // Extract unique vendors and calculate total spend
  const vendorSpendMap = transactions
    .filter((t) => t.amount < 0)
    .reduce((acc, t) => {
      const v = t.merchant;
      acc[v] = (acc[v] || 0) + Math.abs(t.amount);
      return acc;
    }, {} as Record<string, number>);

  const vendors = Object.entries(vendorSpendMap)
    .map(([name, spend]) => ({
      name,
      spend,
      type: 'Vendor',
      recurring: spend > 2000,
      category: transactions.find((t) => t.merchant === name)?.category || 'General'
    }))
    .sort((a, b) => b.spend - a.spend);

  const customers = [
    { name: 'Cognitive Dynamics Corp', totalRevenue: 135000, status: 'Active SLA', plan: 'Enterprise Private Cloud' },
    { name: 'Nexus Fintech Partners', totalRevenue: 85500, status: 'Active SLA', plan: 'API Usage Tier' },
    { name: 'Hyperion BioLabs', totalRevenue: 54600, status: 'Active SLA', plan: 'Research Enterprise' },
    { name: 'Aura Logistics AI', totalRevenue: 37200, status: 'Payment Overdue', plan: 'Custom Integration' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#eaedff] pb-4">
        <div>
          <div className="text-xs font-semibold text-[#006948] mb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#006c49] shadow-[0_0_8px_#6cf8bb] animate-pulse" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider">
              RELATIONSHIP DIRECTORY
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#131b2e] tracking-tight">Vendors & Customers</h1>
          <div className="text-xs text-[#3d4a42] mt-0.5">
            Historical transaction ledger tracking, recurring software commitments, and enterprise client relationships
          </div>
        </div>

        <div className="p-1 rounded-full bg-[#f2f3ff] border border-[#eaedff] flex items-center space-x-1">
          <button
            onClick={() => setTab('vendors')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              tab === 'vendors'
                ? 'bg-[#006948] text-white shadow-sm'
                : 'text-[#3d4a42] hover:text-[#131b2e]'
            }`}
          >
            Vendors ({vendors.length})
          </button>
          <button
            onClick={() => setTab('customers')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              tab === 'customers'
                ? 'bg-[#006948] text-white shadow-sm'
                : 'text-[#3d4a42] hover:text-[#131b2e]'
            }`}
          >
            Customers ({customers.length})
          </button>
        </div>
      </div>

      {/* Vendors View */}
      {tab === 'vendors' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {vendors.map((v, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-2xl bg-[#eaedff] flex items-center justify-center text-[#131b2e] font-bold text-xs">
                  {v.name.slice(0, 2).toUpperCase()}
                </div>
                {v.recurring && (
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#6cf8bb]/40 text-[#00714d] border border-[#6cf8bb]/50 font-bold">
                    Recurring Subscription
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#131b2e]">{v.name}</h3>
                <div className="text-xs text-[#3d4a42] mt-0.5">{v.category}</div>
              </div>

              <div className="pt-3 border-t border-[#eaedff] flex items-center justify-between text-xs">
                <span className="text-[#3d4a42] flex items-center">
                  <TrendingDown className="w-3.5 h-3.5 text-[#3d4a42] mr-1" />
                  YTD Spend:
                </span>
                <span className="font-mono font-bold text-[#131b2e]">
                  ${v.spend.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Customers View */}
      {tab === 'customers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {customers.map((c, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-2xl bg-[#6cf8bb]/40 flex items-center justify-center text-[#006c49] font-bold text-xs">
                  {c.name.slice(0, 2).toUpperCase()}
                </div>
                <span
                  className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${
                    c.status === 'Active SLA'
                      ? 'bg-[#85f8c4]/40 text-[#005137] border-[#85f8c4]/60 font-semibold'
                      : 'bg-[#ffdad6]/60 text-[#ba1a1a] border-[#ffdad6] font-semibold'
                  }`}
                >
                  {c.status}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#131b2e]">{c.name}</h3>
                <div className="text-xs text-[#3d4a42] mt-0.5">{c.plan}</div>
              </div>

              <div className="pt-3 border-t border-[#eaedff] flex items-center justify-between text-xs">
                <span className="text-[#3d4a42] flex items-center">
                  <TrendingUp className="w-3.5 h-3.5 text-[#006c49] mr-1" />
                  Total Contract Rev:
                </span>
                <span className="font-mono font-bold text-[#006c49]">
                  ${c.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
