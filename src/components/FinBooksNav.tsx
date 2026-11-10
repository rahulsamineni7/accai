import React from 'react';
import { Sparkles, MessageCircle, ArrowRight, LayoutDashboard, Globe, CheckCircle2 } from 'lucide-react';
import { useDigits } from '../context/DigitsContext';

interface FinBooksNavProps {
  currentMode: 'landing' | 'app';
  setCurrentMode: (mode: 'landing' | 'app') => void;
  activeAppTab: 'overview' | 'documents' | 'reconciliation' | 'reports';
  setActiveAppTab: (tab: 'overview' | 'documents' | 'reconciliation' | 'reports') => void;
}

export const FinBooksNav: React.FC<FinBooksNavProps> = ({
  currentMode,
  setCurrentMode,
  activeAppTab,
  setActiveAppTab,
}) => {
  const { currentEntity, switchEntity, entities } = useDigits();

  const handleNavClick = (sectionId: string) => {
    if (currentMode !== 'landing') {
      setCurrentMode('landing');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto rounded-full glass-surface px-5 py-2.5 flex items-center justify-between border border-white/80 shadow-[0_8px_30px_rgba(13,148,103,0.06)]">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentMode('landing')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#0d9467] to-[#34d399] flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4.5 h-4.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold tracking-tight text-slate-900 leading-none">
              Fin<span className="text-[#0d9467]">Books</span><span className="text-xs text-slate-400 font-medium">.ai</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wide">AI Finance OS</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/60 p-1 rounded-full border border-slate-200/50 backdrop-blur-md">
          {currentMode === 'landing' ? (
            <>
              <button
                onClick={() => handleNavClick('how-it-works')}
                className="px-4 py-1.5 text-xs font-semibold rounded-full text-slate-700 hover:text-emerald-700 hover:bg-white/80 transition-all"
              >
                How it works
              </button>
              <button
                onClick={() => handleNavClick('features')}
                className="px-4 py-1.5 text-xs font-semibold rounded-full text-slate-700 hover:text-emerald-700 hover:bg-white/80 transition-all"
              >
                Features
              </button>
              <button
                onClick={() => handleNavClick('pricing')}
                className="px-4 py-1.5 text-xs font-semibold rounded-full text-slate-700 hover:text-emerald-700 hover:bg-white/80 transition-all"
              >
                Pricing
              </button>
              <button
                onClick={() => setCurrentMode('app')}
                className="px-4 py-1.5 text-xs font-semibold rounded-full text-emerald-800 bg-white shadow-sm flex items-center gap-1.5 transition-all"
              >
                <LayoutDashboard className="w-3 h-3 text-[#0d9467]" />
                Live App Demo
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveAppTab('overview')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${
                  activeAppTab === 'overview'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Overview &amp; CFO
              </button>
              <button
                onClick={() => setActiveAppTab('documents')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${
                  activeAppTab === 'documents'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Documents &amp; OCR
              </button>
              <button
                onClick={() => setActiveAppTab('reconciliation')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${
                  activeAppTab === 'reconciliation'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Reconciliation
              </button>
              <button
                onClick={() => setActiveAppTab('reports')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${
                  activeAppTab === 'reports'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Reports &amp; Tally XML
              </button>
            </>
          )}
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3">
          {/* WhatsApp Pill */}
          <a
            href="https://wa.me/919704107334?text=Hi%20FinBooks%2C%20I%27d%20like%20to%20book%20a%20demo."
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-emerald-800 bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/20 transition-all"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp Us</span>
          </a>

          {/* Mode Switcher Button */}
          {currentMode === 'landing' ? (
            <button
              onClick={() => setCurrentMode('app')}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-[#0d9467] to-[#0b7a54] text-white text-xs font-semibold shadow-md shadow-emerald-700/20 hover:shadow-lg hover:shadow-emerald-700/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <span>Launch App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <select
                value={currentEntity.id}
                onChange={(e) => switchEntity(e.target.value)}
                className="hidden sm:block text-xs font-medium bg-white/80 border border-slate-200 rounded-full px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {entities.map((ent) => (
                  <option key={ent.id} value={ent.id}>
                    {ent.name}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setCurrentMode('landing')}
                className="px-3.5 py-1.5 rounded-full bg-white text-slate-700 border border-slate-200/80 text-xs font-semibold hover:bg-slate-50 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Landing Page</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
