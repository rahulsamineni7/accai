import React, { useState } from 'react';
import { useDigits } from '../../context/DigitsContext';
import {
  Building,
  Sliders,
  Users,
  Save,
  Sparkles
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { currentEntity, showNotification, apiKey, setApiKey, aiStatus } = useDigits();
  const [basis, setBasis] = useState(currentEntity.accountingMethod);
  const [fiscalYearEnd, setFiscalYearEnd] = useState(currentEntity.fiscalYearEnd);
  const [confidenceThreshold, setConfidenceThreshold] = useState(90);
  const [tempKey, setTempKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);

  const teamMembers = [
    { name: 'Rahul A.', email: 'rahul@acme.ai', role: 'Lead Controller', status: 'Active' },
    { name: 'Sarah Chen', email: 'sarah@acme.ai', role: 'Head of Finance / CFO', status: 'Active' },
    { name: 'Michael Vance', email: 'vance@acme.ai', role: 'Staff Accountant', status: 'Active' },
    { name: 'External Auditor (KPMG)', email: 'audit-team@kpmg.com', role: 'Read-only Auditor', status: 'Active' }
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showNotification('Organization & General Ledger preferences saved');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl">
      {/* Top Banner */}
      <div className="border-b border-[#eaedff] pb-4">
        <div className="text-xs font-semibold text-[#006948] mb-1 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#006c49] shadow-[0_0_8px_#6cf8bb] animate-pulse" />
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider">
            CONFIGURATION & CONTROLS
          </span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-[#131b2e] tracking-tight">
          Entity & Ledger Settings
        </h1>
        <div className="text-xs text-[#3d4a42] mt-0.5">
          Corporate governance, accounting policies, and autonomous ledger sensitivity thresholds
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Legal Entity Card */}
        <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm space-y-4">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-[#eaedff]">
            <Building className="w-4 h-4 text-[#006948]" />
            <h2 className="text-sm font-bold text-[#131b2e]">Entity Profile</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-semibold text-[#3d4a42] uppercase tracking-wider">
                Legal Entity Name
              </label>
              <input
                type="text"
                defaultValue={currentEntity.name}
                className="w-full mt-1 bg-[#f2f3ff] border border-[#eaedff] rounded-2xl px-3.5 py-2 text-xs text-[#131b2e] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-semibold text-[#3d4a42] uppercase tracking-wider">
                Entity Type & Jurisdiction
              </label>
              <input
                type="text"
                defaultValue={currentEntity.type}
                className="w-full mt-1 bg-[#f2f3ff] border border-[#eaedff] rounded-2xl px-3.5 py-2 text-xs text-[#131b2e] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-semibold text-[#3d4a42] uppercase tracking-wider">
                Employer Identification Number (EIN)
              </label>
              <input
                type="text"
                defaultValue={currentEntity.ein}
                className="w-full mt-1 bg-[#f2f3ff] border border-[#eaedff] rounded-2xl px-3.5 py-2 text-xs text-[#131b2e] font-mono focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-semibold text-[#3d4a42] uppercase tracking-wider">
                Default Ledger Currency
              </label>
              <input
                type="text"
                disabled
                defaultValue={currentEntity.currency}
                className="w-full mt-1 bg-[#f2f3ff] border border-[#eaedff] rounded-2xl px-3.5 py-2 text-xs text-[#3d4a42] font-mono opacity-80"
              />
            </div>
          </div>
        </div>

        {/* Google Gemini AI Configuration Card */}
        <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#eaedff]">
            <div className="flex items-center space-x-2.5">
              <Sparkles className="w-4 h-4 text-[#006948]" />
              <div>
                <h2 className="text-sm font-bold text-[#131b2e] flex items-center gap-2">
                  <span>Google Gemini AI Engine</span>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#6cf8bb]/40 text-[#00714d] border border-[#6cf8bb]/50 font-bold">
                    gemini-2.5-flash
                  </span>
                </h2>
                <div className="text-[11px] text-[#3d4a42]">
                  Powers "Ask Digits" financial intelligence & autonomous transaction classification
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  aiStatus === 'connected'
                    ? 'bg-[#006c49] shadow-[0_0_8px_#6cf8bb] animate-pulse'
                    : aiStatus === 'checking'
                    ? 'bg-amber-400'
                    : 'bg-red-400'
                }`}
              />
              <span className="text-xs font-mono text-[#006c49] uppercase font-bold">
                {aiStatus === 'connected'
                  ? 'Active & Verified'
                  : aiStatus === 'checking'
                  ? 'Checking...'
                  : 'Key Invalid'}
              </span>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-[#3d4a42] uppercase tracking-wider">
              Gemini Authorization Key
            </label>
            <div className="flex items-center space-x-2 mt-1">
              <input
                type={showKey ? 'text' : 'password'}
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                className="flex-1 bg-[#f2f3ff] border border-[#eaedff] rounded-2xl px-3.5 py-2 text-xs text-[#131b2e] font-mono focus:bg-white focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="px-4 py-2 rounded-full bg-[#f2f3ff] hover:bg-[#eaedff] text-xs text-[#131b2e] border border-[#eaedff]"
              >
                {showKey ? 'Hide' : 'Show'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setApiKey(tempKey);
                  showNotification('Updated Gemini API Key and verified connection');
                }}
                className="px-4 py-2 rounded-full bg-[#006948] hover:bg-[#00855d] text-white font-bold text-xs shadow-sm transition-all"
              >
                Update Key
              </button>
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#3d4a42] mt-2">
              <span>Endpoint: <code className="text-[#131b2e] font-mono">generativelanguage.googleapis.com</code></span>
              <span>Provider: <strong className="text-[#006948]">Google AI Studio (Gemini 2.5 Flash)</strong></span>
            </div>
          </div>
        </div>

        {/* Accounting Policies */}
        <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm space-y-4">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-[#eaedff]">
            <Sliders className="w-4 h-4 text-[#006948]" />
            <h2 className="text-sm font-bold text-[#131b2e]">Accounting Method & Policies</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-semibold text-[#3d4a42] uppercase tracking-wider">
                Reporting Basis
              </label>
              <select
                value={basis}
                onChange={(e) => setBasis(e.target.value as any)}
                className="w-full mt-1 bg-[#f2f3ff] border border-[#eaedff] rounded-2xl px-3 py-2 text-xs text-[#131b2e] font-medium"
              >
                <option value="Accrual">Accrual Basis (GAAP Recommended)</option>
                <option value="Cash">Cash Basis</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-semibold text-[#3d4a42] uppercase tracking-wider">
                Fiscal Year End
              </label>
              <input
                type="text"
                value={fiscalYearEnd}
                onChange={(e) => setFiscalYearEnd(e.target.value)}
                className="w-full mt-1 bg-[#f2f3ff] border border-[#eaedff] rounded-2xl px-3.5 py-2 text-xs text-[#131b2e] font-mono"
              />
            </div>
          </div>

          {/* Autonomous AI Auto-approval Threshold Slider */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] font-semibold text-[#3d4a42] uppercase tracking-wider">
                Autonomous Auto-Categorization Confidence Threshold
              </label>
              <span className="text-xs font-mono font-bold text-[#006c49]">
                {confidenceThreshold}% match
              </span>
            </div>
            <input
              type="range"
              min="75"
              max="99"
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(parseInt(e.target.value))}
              className="w-full accent-[#006948]"
            />
            <div className="text-[10px] text-[#3d4a42] mt-1">
              Transactions classified with model confidence above {confidenceThreshold}% are auto-posted to the General Ledger. All entries below this threshold are placed in the Review queue.
            </div>
          </div>
        </div>

        {/* Team Members & Roles */}
        <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#eaedff]">
            <div className="flex items-center space-x-2.5">
              <Users className="w-4 h-4 text-[#006948]" />
              <h2 className="text-sm font-bold text-[#131b2e]">Team & Permissions</h2>
            </div>
            <button
              type="button"
              onClick={() => showNotification('Invite teammate modal triggered')}
              className="text-xs text-[#006948] hover:underline font-semibold"
            >
              + Invite Team Member
            </button>
          </div>

          <div className="divide-y divide-[#eaedff]">
            {teamMembers.map((m, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-[#131b2e]">{m.name}</div>
                  <div className="text-[11px] text-[#3d4a42] font-mono">{m.email}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-[#131b2e]">{m.role}</div>
                  <div className="text-[10px] text-[#006c49] font-mono font-bold">{m.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-full bg-[#006948] hover:bg-[#00855d] text-white font-bold text-xs active:scale-95 transition-all flex items-center space-x-2 shadow-sm"
          >
            <Save className="w-4 h-4 stroke-[2.5]" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
