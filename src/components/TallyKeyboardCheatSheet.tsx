import React from 'react';
import { Keyboard, X, Sparkles } from 'lucide-react';

interface TallyKeyboardCheatSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TallyKeyboardCheatSheet: React.FC<TallyKeyboardCheatSheetProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Alt + A', action: 'Create New Journal / Ledger Entry' },
    { key: 'Alt + C', action: 'Quick Create Ledger Account / Item' },
    { key: 'F4', action: 'Contra Entry (Bank to Cash / Bank Transfer)' },
    { key: 'F5', action: 'Payment Voucher (Bill Pay AP)' },
    { key: 'F6', action: 'Receipt Voucher (Customer Collections)' },
    { key: 'F7', action: 'Journal Voucher (Adjustment / Accruals)' },
    { key: 'F8', action: 'Sales Tax Invoice (Invoicing AR)' },
    { key: 'F9', action: 'Purchase Bill Voucher (Vendor AP)' },
    { key: 'Ctrl + B', action: 'Toggle Sidebar Collapse (Full-Width Mode)' },
    { key: 'Cmd / Ctrl + K', action: 'Ask AccAI (Gemini 2.5 Flash CFO Assistant)' },
    { key: '?', action: 'Open This Tally Shortcut Cheat Sheet' },
    { key: 'Esc', action: 'Close Active Modal / Drawer' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in zoom-in-95 duration-150">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 space-y-4 border border-[#eaedff] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#eaedff] pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#006948]/10 text-[#006948]">
              <Keyboard className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-[#131b2e]">Tally Muscle-Memory Parity</h3>
              <p className="text-[11px] text-[#6d7a72]">Zero-mouse keyboard navigation for Indian accountants</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#f2f3ff] flex items-center justify-center text-[#3d4a42] hover:text-[#131b2e]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1">
          {shortcuts.map((s, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl bg-[#faf8ff] border border-[#eaedff] flex items-center justify-between"
            >
              <span className="text-xs text-[#131b2e] font-medium pr-2 truncate">
                {s.action}
              </span>
              <kbd className="px-2 py-0.5 rounded bg-white text-[10px] font-mono font-bold text-[#006948] border border-[#eaedff] shadow-2xs shrink-0">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="p-3 rounded-xl bg-[#006948]/5 border border-[#006948]/20 flex items-center justify-between text-xs text-[#006948]">
          <span className="flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tally Prime 4.0 / ERP 9 Keystroke Parity Active</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#006948] hover:bg-[#00855d] text-white font-bold text-[11px] shadow-sm transition-all"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

