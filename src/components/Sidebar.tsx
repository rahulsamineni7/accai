import React, { useState } from 'react';
import { useDigits, ViewType } from '../context/DigitsContext';
import {
  LayoutDashboard,
  FileSpreadsheet,
  Receipt,
  Scale,
  Sparkles,
  Sliders,
  DollarSign,
  FileCheck2,
  FolderArchive,
  Users2,
  Network,
  Settings,
  ArrowUpRight,
  ChevronDown,
  PanelLeftClose,
  ShieldCheck,
  Binary,
  Percent,
  Clock,
  ShieldAlert,
  FileSearch,
  History,
  Boxes
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    currentEntity,
    entities,
    switchEntity,
    setIsAskDigitsOpen,
    isSidebarOpen,
    toggleSidebar
  } = useDigits();
  const [isEntityOpen, setIsEntityOpen] = useState(false);

  const navItems: {
    section: string;
    items: {
      id: ViewType | 'ask-digits';
      label: string;
      icon: React.ComponentType<{ className?: string }>;
      badge?: string | number;
      badgeColor?: string;
    }[];
  }[] = [
    {
      section: 'OVERVIEW',
      items: [
        { id: 'home', label: 'Home Dashboard', icon: LayoutDashboard },
        { id: 'financials', label: 'Financial Statements', icon: FileSpreadsheet }
      ]
    },
    {
      section: 'CORE LEDGER',
      items: [
        { id: 'chart-of-accounts', label: 'Chart of Accounts', icon: FileCheck2 },
        { id: 'transactions', label: 'Transactions', icon: DollarSign },
        { id: 'rules', label: 'Rules Engine', icon: Sliders },
        { id: 'reconciliations', label: 'Reconciliations', icon: Scale }
      ]
    },
    {
      section: 'OPERATIONS',
      items: [
        { id: 'bills', label: 'Bill Pay (AP)', icon: Receipt },
        { id: 'invoices', label: 'Invoicing (AR)', icon: ArrowUpRight },
        { id: 'inventory-pos', label: 'Inventory (3-UOM) & POS', icon: Boxes, badge: 'POS', badgeColor: 'bg-[#006948]/15 text-[#006948]' },
        { id: 'integrations', label: 'Feeds & Stack', icon: Network }
      ]
    },
    {
      section: 'INDIAN COMPLIANCE (HISABKITAB)',
      items: [
        { id: 'gst', label: 'GST & Tax Suite', icon: ShieldCheck, badge: 'GSTR-2B', badgeColor: 'bg-[#006948]/15 text-[#006948]' },
        { id: 'gst-ims', label: 'GSTN IMS & Notice Shield', icon: ShieldAlert, badge: 'DRC-01C', badgeColor: 'bg-[#ba1a1a]/15 text-[#ba1a1a]' },
        { id: 'msme-guard', label: 'MSME 15/45d Guard', icon: Clock, badge: 'Sec 37', badgeColor: 'bg-[#ea580c]/15 text-[#ea580c]' },
        { id: 'tds', label: 'TDS & Form 26Q', icon: Percent, badge: '194J', badgeColor: 'bg-[#3b82f6]/15 text-[#3b82f6]' },
        { id: 'ledger-scrutiny', label: 'CA Ledger Scrutiny', icon: FileSearch, badge: '24/7 AI', badgeColor: 'bg-[#006948]/15 text-[#006948]' },
        { id: 'audit-trail', label: 'Rule 11(g) Audit Trail', icon: History, badge: 'MCA', badgeColor: 'bg-[#131b2e]/10 text-[#131b2e]' },
        { id: 'tally-bridge', label: 'Tally & CA Bridge', icon: Binary, badge: 'XML', badgeColor: 'bg-[#ea580c]/15 text-[#ea580c]' }
      ]
    },
    {
      section: 'INTELLIGENCE & AUDIT',
      items: [
        { id: 'checklist', label: 'Month-End Close', icon: FileCheck2 },
        { id: 'vault', label: 'Documents & OCR', icon: FolderArchive },
        { id: 'directory', label: 'Directory', icon: Users2 },
        { id: 'settings', label: 'Ledger Settings', icon: Settings }
      ]
    }
  ];

  return (
    <aside
      className={`relative shrink-0 h-full bg-white/95 backdrop-blur-2xl z-30 flex flex-col justify-between border-r border-[#eaedff] shadow-[0_1px_8px_rgba(0,0,0,0.04)] select-none transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'w-72 opacity-100' : 'w-0 opacity-0 -translate-x-full overflow-hidden border-r-0 pointer-events-none'
      }`}
    >
      <div className="flex flex-col h-full w-72 min-w-[18rem]">
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-[#eaedff]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#006948] flex items-center justify-center text-white font-bold text-sm shadow-[0_2px_8px_rgba(0,105,72,0.3)]">
              D
            </div>
            <div className="flex flex-col">
              <span className="text-base text-[#131b2e] font-bold tracking-tight">Digits AI</span>
              <span className="text-[10px] text-[#006948] font-semibold tracking-wider uppercase">Autonomous GL</span>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleSidebar}
            title="Collapse sidebar (Ctrl+B)"
            className="p-1.5 rounded-lg text-[#6d7a72] hover:text-[#131b2e] hover:bg-[#eaedff] active:scale-95 transition-all flex items-center justify-center"
            aria-label="Collapse sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* Legal Entity Switcher inside Sidebar */}
        <div className="px-4 py-2 relative">
          <button
            onClick={() => setIsEntityOpen(!isEntityOpen)}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] transition-colors text-left"
            type="button"
          >
            <div className="flex flex-col truncate pr-2">
              <span className="text-xs font-semibold text-[#131b2e] truncate">{currentEntity.name}</span>
              <span className="text-[10px] text-[#3d4a42] truncate">{currentEntity.type}</span>
            </div>
            <ChevronDown className="w-4 h-4 text-[#6d7a72]" />
          </button>

          {isEntityOpen && (
            <div className="absolute left-4 right-4 mt-1 bg-white rounded-xl shadow-xl border border-[#eaedff] p-1.5 z-50 animate-in fade-in duration-100">
              {entities.map((e) => (
                <button
                  key={e.id}
                  onClick={() => {
                    switchEntity(e.id);
                    setIsEntityOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    e.id === currentEntity.id
                      ? 'bg-[#006948] text-white font-semibold'
                      : 'text-[#131b2e] hover:bg-[#f2f3ff]'
                  }`}
                >
                  <div>{e.name}</div>
                  <div className={`text-[10px] ${e.id === currentEntity.id ? 'text-white/80' : 'text-[#6d7a72]'}`}>
                    {e.type}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 px-4 py-2 overflow-y-auto space-y-4">
          {navItems.map((sec) => (
            <div key={sec.section} className="space-y-1">
              <span className="px-3 text-[10px] font-semibold text-[#6d7a72] uppercase tracking-wider block mb-1">
                {sec.section}
              </span>
              <div className="space-y-0.5">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (item.id === 'ask-digits') {
                          setIsAskDigitsOpen(true);
                        } else {
                          setActiveView(item.id as ViewType);
                        }
                      }}
                      className={`w-full group flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                        isActive
                          ? 'bg-[#006948] text-white font-semibold shadow-[0_4px_14px_0_rgba(16,185,129,0.35)]'
                          : 'text-[#3d4a42] hover:bg-[#e2e7ff] hover:text-[#131b2e]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-white' : 'text-[#6d7a72] group-hover:text-[#131b2e]'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : item.badgeColor || 'bg-[#eaedff] text-[#3d4a42]'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom Gemini Active Widget matching Stitch */}
        <div className="p-4 bg-[#f2f3ff]/60 border-t border-[#eaedff]">
          <div className="p-3 rounded-2xl bg-white/90 backdrop-blur-md border border-[#eaedff] shadow-sm flex items-center gap-3">
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#006c49] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#006c49]"></span>
            </div>
            <div className="flex flex-col truncate">
              <span className="text-xs font-semibold text-[#131b2e] truncate">Gemini 2.5 Active</span>
              <span className="font-mono text-[11px] text-[#006c49] font-medium truncate">Sync verified • 99.4%</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
