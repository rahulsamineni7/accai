import React, { useState } from 'react';
import { useDigits } from '../context/DigitsContext';
import {
  Search,
  Plus,
  Bell,
  CheckCircle2,
  DollarSign,
  Receipt,
  FileText,
  Sliders,
  ChevronDown,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';

interface HeaderProps {
  onOpenNewTxModal: () => void;
  onOpenNewBillModal: () => void;
  onOpenNewInvoiceModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNewTxModal,
  onOpenNewBillModal,
  onOpenNewInvoiceModal
}) => {
  const {
    setIsAskDigitsOpen,
    setActiveView,
    metrics,
    isSidebarOpen,
    toggleSidebar
  } = useDigits();

  const [isNewMenuOpen, setIsNewMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 h-16 bg-white/80 backdrop-blur-xl border-b border-[#eaedff] px-6 lg:px-8 flex items-center justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] select-none">
      {/* Sidebar Toggle + Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          type="button"
          onClick={toggleSidebar}
          title={isSidebarOpen ? "Collapse sidebar (Ctrl+B)" : "Expand sidebar (Ctrl+B)"}
          className="p-2 rounded-xl text-[#3d4a42] hover:bg-[#eaedff] hover:text-[#131b2e] active:scale-95 transition-all flex items-center justify-center shrink-0 border border-transparent hover:border-[#eaedff]"
          aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="w-5 h-5 text-[#6d7a72]" />
          ) : (
            <PanelLeft className="w-5 h-5 text-[#006948]" />
          )}
        </button>

        {!isSidebarOpen && (
          <div className="flex items-center gap-2 pr-2 border-r border-[#eaedff] shrink-0 animate-in fade-in duration-200">
            <div className="w-7 h-7 rounded-lg bg-[#006948] flex items-center justify-center text-white font-bold text-xs shadow-sm">
              D
            </div>
            <span className="text-xs font-bold text-[#131b2e] hidden sm:inline tracking-tight">Digits AI</span>
          </div>
        )}

        <div className="relative w-full">
          <button
            type="button"
            onClick={() => setIsAskDigitsOpen(true)}
            className="w-full pl-10 pr-12 py-2 rounded-full bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] placeholder:text-[#6d7a72] text-xs font-medium text-left flex items-center justify-between transition-all focus:outline-none"
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="w-4 h-4 text-[#6d7a72] shrink-0" />
              <span className="text-[#3d4a42] truncate">Ask Digits AI (⌘K) — Grounded in Gemini 2.5 Flash</span>
            </div>
            <span className="text-[10px] font-mono text-[#3d4a42] bg-[#eaedff] px-2 py-0.5 rounded-full font-semibold shrink-0">
              ⌘K
            </span>
          </button>
        </div>
      </div>

      {/* Right Controls matching Stitch */}
      <div className="flex items-center gap-4">
        {/* Gemini Active Pill */}
        <div className="hidden xl:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f2f3ff] border border-[#eaedff]">
          <CheckCircle2 className="w-4 h-4 text-[#006c49]" />
          <span className="text-xs font-mono text-[#131b2e] font-medium">Gemini 2.5 Flash</span>
          <span className="text-[#6d7a72] text-xs">•</span>
          <span className="text-xs font-mono text-[#006c49] font-bold">99.4% Confidence</span>
        </div>

        {/* "+ New Journal Entry" Action Button */}
        <div className="relative">
          <button
            onClick={() => setIsNewMenuOpen(!isNewMenuOpen)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#006948] hover:bg-[#00855d] text-white text-xs font-semibold shadow-[0_4px_14px_0_rgba(16,185,129,0.35)] active:scale-95 transition-all"
            type="button"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ New Journal Entry</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {isNewMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#eaedff] p-2 z-50 animate-in fade-in duration-100">
              <button
                onClick={() => {
                  setIsNewMenuOpen(false);
                  onOpenNewTxModal();
                }}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#f2f3ff] flex items-center space-x-2.5 text-xs font-medium text-[#131b2e] transition-colors"
              >
                <DollarSign className="w-4 h-4 text-[#006948]" />
                <span>Ledger Transaction</span>
              </button>
              <button
                onClick={() => {
                  setIsNewMenuOpen(false);
                  onOpenNewBillModal();
                }}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#f2f3ff] flex items-center space-x-2.5 text-xs font-medium text-[#131b2e] transition-colors"
              >
                <Receipt className="w-4 h-4 text-[#fba772]" />
                <span>Bill to Pay</span>
              </button>
              <button
                onClick={() => {
                  setIsNewMenuOpen(false);
                  onOpenNewInvoiceModal();
                }}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#f2f3ff] flex items-center space-x-2.5 text-xs font-medium text-[#131b2e] transition-colors"
              >
                <FileText className="w-4 h-4 text-[#0284c7]" />
                <span>Customer Invoice</span>
              </button>
              <div className="border-t border-[#eaedff] my-1" />
              <button
                onClick={() => {
                  setIsNewMenuOpen(false);
                  setActiveView('rules');
                }}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#f2f3ff] flex items-center space-x-2.5 text-xs font-medium text-[#131b2e] transition-colors"
              >
                <Sliders className="w-4 h-4 text-[#9333ea]" />
                <span>Categorization Rule</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications */}
        <button
          onClick={() => setActiveView('transactions')}
          className="p-2 rounded-full text-[#6d7a72] hover:bg-[#e2e7ff] hover:text-[#131b2e] transition-colors relative"
          type="button"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          {metrics.uncategorizedCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#006948]" />
          )}
        </button>

        {/* Profile Avatar matching Stitch */}
        <div className="flex items-center gap-2 pl-2">
          <div className="w-8 h-8 rounded-full bg-[#006948] text-white font-bold text-xs flex items-center justify-center shadow-sm">
            SJ
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-semibold text-[#131b2e] leading-tight">Sarah Jenkins</span>
            <span className="text-[10px] text-[#6d7a72] leading-tight">VP Controller</span>
          </div>
        </div>
      </div>
    </header>
  );
};
