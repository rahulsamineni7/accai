import React from 'react';
import { useDigits } from '../../context/DigitsContext';
import {
  CheckCircle2,
  Circle,
  Lock,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const ChecklistView: React.FC = () => {
  const { closeTasks, toggleCloseTask, isBooksLocked, lockBooks, setActiveView, metrics } = useDigits();

  const completedCount = closeTasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedCount / closeTasks.length) * 100);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#eaedff] pb-4">
        <div>
          <div className="text-xs font-semibold text-[#006948] mb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#006c49] shadow-[0_0_8px_#6cf8bb] animate-pulse" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider">
              AUTONOMOUS MONTH-END CLOSE
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#131b2e] tracking-tight">
            October 2026 Close Checklist
          </h1>
          <div className="text-xs text-[#3d4a42] mt-0.5">
            Automated verification tasks to audit, balance, and seal books for financial reporting
          </div>
        </div>

        <button
          onClick={lockBooks}
          disabled={isBooksLocked}
          className="px-5 py-2 rounded-full bg-[#006948] hover:bg-[#00855d] text-white font-bold text-xs active:scale-95 transition-all flex items-center space-x-2 disabled:opacity-40 shadow-sm"
        >
          <Lock className="w-4 h-4 stroke-[2.5]" />
          <span>{isBooksLocked ? 'October 2026 Locked' : 'Seal & Lock Books'}</span>
        </button>
      </div>

      {/* Progress Card */}
      <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-[#131b2e]">Period Close Progress</div>
            <div className="text-xs text-[#3d4a42]">
              {completedCount} of {closeTasks.length} verification steps completed
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-[#006c49]">
            {progressPercent}%
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 rounded-full bg-[#eaedff] overflow-hidden p-0.5 border border-[#eaedff]">
          <div
            style={{ width: `${progressPercent}%` }}
            className="h-full rounded-full bg-gradient-to-r from-[#006c49] to-[#6cf8bb] transition-all duration-500 shadow-sm"
          />
        </div>

        {isBooksLocked && (
          <div className="p-3.5 rounded-xl bg-[#6cf8bb]/30 border border-[#006c49]/30 flex items-center space-x-2 text-xs text-[#005137] font-semibold">
            <ShieldCheck className="w-4 h-4 text-[#006c49]" />
            <span>Books for October 2026 are officially locked. All transactions are immutable.</span>
          </div>
        )}
      </div>

      {/* Checklist Items */}
      <div className="space-y-3">
        {closeTasks.map((t) => (
          <div
            key={t.id}
            onClick={() => toggleCloseTask(t.id)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
              t.completed
                ? 'bg-white/80 border-[#eaedff] hover:bg-white shadow-sm'
                : 'bg-white/70 border-[#bccac0] hover:border-[#006948]'
            }`}
          >
            <div className="flex items-start space-x-3.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCloseTask(t.id);
                }}
                className="mt-0.5"
              >
                {t.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-[#006c49]" />
                ) : (
                  <Circle className="w-5 h-5 text-[#3d4a42] hover:text-[#006948] transition-colors" />
                )}
              </button>

              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-semibold text-[#131b2e]">
                    {t.title}
                  </h3>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#f2f3ff] border border-[#eaedff] text-[#3d4a42]">
                    {t.category}
                  </span>
                </div>
                <p className="text-xs text-[#3d4a42] mt-1 leading-relaxed">{t.description}</p>

                {t.completed && t.completedBy && (
                  <div className="text-[11px] text-[#006c49] font-mono mt-1.5 flex items-center gap-1 font-semibold">
                    <Sparkles className="w-3 h-3" />
                    <span>
                      Completed by {t.completedBy} {t.completedAt ? `· ${t.completedAt}` : ''}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick action button for task 2 */}
            {!t.completed && t.id === 'ct-2' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveView('transactions');
                }}
                className="shrink-0 px-3.5 py-1.5 rounded-full bg-[#f2f3ff] hover:bg-[#eaedff] border border-[#eaedff] text-[#006948] font-bold text-xs transition-all flex items-center space-x-1"
              >
                <span>Review {metrics.uncategorizedCount} items</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {!t.completed && t.id === 'ct-6' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  lockBooks();
                }}
                className="shrink-0 px-3.5 py-1.5 rounded-full bg-[#006948] hover:bg-[#00855d] text-white font-bold text-xs transition-all flex items-center space-x-1 shadow-sm"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Lock Now</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
