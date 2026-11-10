import React, { useState } from 'react';
import { DigitsProvider, useDigits } from './context/DigitsContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { AskDigitsModal } from './components/AskDigitsModal';
import { NewTransactionModal } from './components/NewTransactionModal';
import { HomeDashboard } from './components/views/HomeDashboard';
import { StatementsView } from './components/views/StatementsView';
import { TransactionsView } from './components/views/TransactionsView';
import { ChartOfAccountsView } from './components/views/ChartOfAccountsView';
import { RulesEngineView } from './components/views/RulesEngineView';
import { ReconciliationsView } from './components/views/ReconciliationsView';
import { BillPayView } from './components/views/BillPayView';
import { InvoicingView } from './components/views/InvoicingView';
import { ChecklistView } from './components/views/ChecklistView';
import { VaultView } from './components/views/VaultView';
import { DirectoryView } from './components/views/DirectoryView';
import { IntegrationsView } from './components/views/IntegrationsView';
import { SettingsView } from './components/views/SettingsView';
import { GSTComplianceView } from './components/views/GSTComplianceView';
import { GSTIMSView } from './components/views/GSTIMSView';
import { MSMEGuardView } from './components/views/MSMEGuardView';
import { TDSComplianceView } from './components/views/TDSComplianceView';
import { LedgerScrutinyView } from './components/views/LedgerScrutinyView';
import { AuditTrailView } from './components/views/AuditTrailView';
import { TallyBridgeView } from './components/views/TallyBridgeView';
import { InventoryPOSView } from './components/views/InventoryPOSView';
import { SchedulesView } from './components/views/SchedulesView';
import { PracticePortalView } from './components/views/PracticePortalView';
import { AIMemoryView } from './components/views/AIMemoryView';
import { TallyKeyboardCheatSheet } from './components/TallyKeyboardCheatSheet';
import { CheckCircle2, Sparkles, PanelLeft, Keyboard } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeView, setActiveView, notification, isSidebarOpen, toggleSidebar } = useDigits();

  const [isNewTxOpen, setIsNewTxOpen] = useState(false);
  const [isCheatSheetOpen, setIsCheatSheetOpen] = useState(false);

  // Global Tally Muscle-Memory Keyboard Listener
  React.useEffect(() => {
    const handleTallyKeys = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setIsCheatSheetOpen((prev) => !prev);
      } else if (e.key === 'F4') {
        e.preventDefault();
        setActiveView('reconciliations');
      } else if (e.key === 'F5') {
        e.preventDefault();
        setActiveView('bills');
      } else if (e.key === 'F6') {
        e.preventDefault();
        setActiveView('transactions');
      } else if (e.key === 'F7') {
        e.preventDefault();
        setActiveView('rules');
      } else if (e.key === 'F8') {
        e.preventDefault();
        setActiveView('invoices');
      } else if (e.key === 'F9') {
        e.preventDefault();
        setActiveView('bills');
      } else if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setIsNewTxOpen(true);
      }
    };

    window.addEventListener('keydown', handleTallyKeys);
    return () => window.removeEventListener('keydown', handleTallyKeys);
  }, [setActiveView]);

  const renderActiveView = () => {
    switch (activeView) {
      case 'home':
        return <HomeDashboard />;
      case 'financials':
        return <StatementsView />;
      case 'reconciliations':
        return <ReconciliationsView />;
      case 'transactions':
        return <TransactionsView />;
      case 'chart-of-accounts':
        return <ChartOfAccountsView />;
      case 'rules':
        return <RulesEngineView />;
      case 'schedules':
        return <SchedulesView />;
      case 'bills':
        return <BillPayView />;
      case 'invoices':
        return <InvoicingView />;
      case 'inventory-pos':
        return <InventoryPOSView />;
      case 'gst':
        return <GSTComplianceView />;
      case 'gst-ims':
        return <GSTIMSView />;
      case 'msme-guard':
        return <MSMEGuardView />;
      case 'tds':
        return <TDSComplianceView />;
      case 'ledger-scrutiny':
        return <LedgerScrutinyView />;
      case 'audit-trail':
        return <AuditTrailView />;
      case 'practice-portal':
        return <PracticePortalView />;
      case 'ai-memory':
        return <AIMemoryView />;
      case 'tally-bridge':
        return <TallyBridgeView />;
      case 'checklist':
        return <ChecklistView />;
      case 'vault':
        return <VaultView />;
      case 'directory':
        return <DirectoryView />;
      case 'integrations':
        return <IntegrationsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <HomeDashboard />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-transparent text-digits-cloudWhite relative select-none">
      {/* Radiant Botanical Halo Background */}
      <div className="digits-halo pointer-events-none" />

      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        <Header
          onOpenNewTxModal={() => setIsNewTxOpen(true)}
          onOpenNewBillModal={() => {}}
          onOpenNewInvoiceModal={() => {}}
        />

        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {renderActiveView()}
        </main>
      </div>

      {/* Modals */}
      <AskDigitsModal />
      <NewTransactionModal isOpen={isNewTxOpen} onClose={() => setIsNewTxOpen(false)} />
      <TallyKeyboardCheatSheet isOpen={isCheatSheetOpen} onClose={() => setIsCheatSheetOpen(false)} />

      {/* Tally Keyboard Shortcut Trigger Pill on Bottom */}
      <button
        onClick={() => setIsCheatSheetOpen(true)}
        title="Tally Prime Keyboard Shortcuts (?)"
        className="fixed bottom-6 right-20 z-40 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-xl border border-[#eaedff] shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:bg-[#f2f3ff] text-[#131b2e] flex items-center gap-1.5 text-xs font-semibold transition-all active:scale-95"
      >
        <Keyboard className="w-3.5 h-3.5 text-[#006948]" />
        <span>Tally Keys</span>
        <span className="text-[10px] font-mono text-[#6d7a72] bg-[#eaedff] px-1 rounded">?</span>
      </button>

      {/* Floating Re-open Sidebar Pill when collapsed */}
      {!isSidebarOpen && (
        <button
          onClick={toggleSidebar}
          title="Expand sidebar (Ctrl+B)"
          className="fixed bottom-6 left-6 z-40 px-3.5 py-2 rounded-full bg-white/95 backdrop-blur-xl border border-[#eaedff] shadow-[0_4px_20px_rgba(0,0,0,0.12)] hover:bg-[#f2f3ff] text-[#131b2e] flex items-center gap-2 text-xs font-semibold group transition-all active:scale-95 animate-in fade-in slide-in-from-left-4 duration-200"
        >
          <PanelLeft className="w-4 h-4 text-[#006948] group-hover:scale-110 transition-transform" />
          <span>Open Sidebar</span>
          <span className="text-[10px] font-mono text-[#6d7a72] bg-[#eaedff] px-1.5 py-0.5 rounded font-medium">⌘B</span>
        </button>
      )}

      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl glass-panel border border-white/50 text-white shadow-2xl flex items-center space-x-3 animate-in slide-in-from-bottom-4 duration-200">
          <div className="w-7 h-7 rounded-full bg-digits-neonGreen/25 text-digits-neonGreen border border-digits-neonGreen/40 flex items-center justify-center shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold tracking-wide">{notification}</span>
        </div>
      )}
    </div>
  );
};

export function App() {
  return (
    <DigitsProvider>
      <MainLayout />
    </DigitsProvider>
  );
}

export default App;

