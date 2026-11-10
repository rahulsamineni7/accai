import React, { useState } from 'react';
import { DigitsProvider, useDigits } from './context/DigitsContext';
import { FinBooksNav } from './components/FinBooksNav';
import { FinBooksLanding } from './components/FinBooksLanding';
import { FinBooksApp } from './components/FinBooksApp';
import { Sparkles } from 'lucide-react';

const FinBooksShell: React.FC = () => {
  const { notification } = useDigits();
  const [currentMode, setCurrentMode] = useState<'landing' | 'app'>('landing');
  const [activeAppTab, setActiveAppTab] = useState<'overview' | 'documents' | 'reconciliation' | 'reports'>('overview');

  return (
    <div className="min-h-screen w-full flex flex-col relative select-none">
      
      {/* Top Glassmorphic Navigation Bar */}
      <FinBooksNav
        currentMode={currentMode}
        setCurrentMode={setCurrentMode}
        activeAppTab={activeAppTab}
        setActiveAppTab={setActiveAppTab}
      />

      {/* Main Viewport */}
      <main className="flex-1 w-full flex flex-col">
        {currentMode === 'landing' ? (
          <FinBooksLanding onLaunchApp={() => setCurrentMode('app')} />
        ) : (
          <FinBooksApp activeTab={activeAppTab} setActiveTab={setActiveAppTab} />
        )}
      </main>

      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl glass-surface border border-emerald-500/30 text-slate-900 shadow-2xl flex items-center space-x-3 animate-in slide-in-from-bottom-4 duration-200">
          <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-800 flex items-center justify-center shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <span className="text-xs font-semibold tracking-wide text-slate-800">{notification}</span>
        </div>
      )}

    </div>
  );
};

export function App() {
  return (
    <DigitsProvider>
      <FinBooksShell />
    </DigitsProvider>
  );
}

export default App;
