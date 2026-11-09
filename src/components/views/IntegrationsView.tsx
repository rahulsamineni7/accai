import React from 'react';
import { useDigits } from '../../context/DigitsContext';
import {
  Network,
  RefreshCw,
  Building2,
  Landmark,
  CreditCard,
  Users,
  Plus
} from 'lucide-react';

export const IntegrationsView: React.FC = () => {
  const { integrations, syncIntegration, showNotification } = useDigits();

  const getIcon = (name: string) => {
    switch (name) {
      case 'Building2':
        return Building2;
      case 'Landmark':
        return Landmark;
      case 'CreditCard':
        return CreditCard;
      case 'RefreshCw':
        return RefreshCw;
      case 'Users':
        return Users;
      default:
        return Network;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#eaedff] pb-4">
        <div>
          <div className="text-xs font-semibold text-[#006948] mb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#006c49] shadow-[0_0_8px_#6cf8bb] animate-pulse" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider">
              FINANCIAL DATA ECOSYSTEM
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#131b2e] tracking-tight">Connected Banking & Stack Feeds</h1>
          <div className="text-xs text-[#3d4a42] mt-0.5">
            Direct Plaid, Stripe Webhooks, Brex OAuth, and QuickBooks Online bidirectional General Ledger mirror
          </div>
        </div>

        <button
          onClick={() => showNotification('Plaid Link modal initialized for new bank institution')}
          className="px-5 py-2 rounded-full bg-[#006948] hover:bg-[#00855d] text-white font-bold text-xs active:scale-95 transition-all flex items-center space-x-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Connect New Bank</span>
        </button>
      </div>

      {/* Integration Feeds List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((int) => {
          const Icon = getIcon(int.iconName);

          return (
            <div
              key={int.id}
              className="p-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-[#eaedff] flex items-center justify-center text-[#006948]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#131b2e]">{int.name}</h3>
                    <div className="text-[11px] text-[#3d4a42] mt-0.5">{int.details}</div>
                  </div>
                </div>

                <span className="flex items-center space-x-1.5 text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#6cf8bb]/40 text-[#00714d] border border-[#6cf8bb]/50 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006c49]" />
                  <span>{int.status}</span>
                </span>
              </div>

              <div className="pt-3 border-t border-[#eaedff] flex items-center justify-between">
                <div className="text-[11px] text-[#3d4a42] font-mono">
                  Last synced: <span className="text-[#131b2e] font-semibold">{int.lastSynced}</span>
                </div>

                <button
                  onClick={() => syncIntegration(int.id)}
                  disabled={int.status === 'Syncing'}
                  className="px-3.5 py-1.5 rounded-full bg-[#f2f3ff] hover:bg-[#eaedff] border border-[#eaedff] text-xs font-semibold text-[#131b2e] transition-all flex items-center space-x-1.5 disabled:opacity-50"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 text-[#006948] ${
                      int.status === 'Syncing' ? 'animate-spin' : ''
                    }`}
                  />
                  <span>{int.status === 'Syncing' ? 'Syncing...' : 'Sync Now'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
