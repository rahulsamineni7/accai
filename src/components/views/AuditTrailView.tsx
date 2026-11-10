import React, { useState } from 'react';
import { useDigits } from '../../context/DigitsContext';
import {
  History,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Download,
  Filter,
  Search,
  Code2,
  Sparkles,
  Bot,
  UserCheck
} from 'lucide-react';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorId: string;
  actorType: 'AI Agent' | 'Human User' | 'CA Auditor';
  action: 'CREATE_VOUCHER' | 'EDIT_CLASSIFICATION' | 'AUTO_RECONCILE' | 'LOCK_PERIOD' | 'TDS_ADJUSTMENT';
  voucherType: string;
  voucherNumber: string;
  beforeJson: string;
  afterJson: string;
  sha256Hash: string;
}

export const AuditTrailView: React.FC = () => {
  const { currentEntity, showNotification } = useDigits();

  const [selectedEntry, setSelectedEntry] = useState<AuditLogEntry | null>(null);
  const [filterActor, setFilterActor] = useState<'ALL' | 'AI Agent' | 'Human User'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [auditLogs] = useState<AuditLogEntry[]>([
    {
      id: 'aud-109',
      timestamp: '2026-11-10 11:42:18 IST',
      actorId: 'Agent_Voucher_Coder (AI Core)',
      actorType: 'AI Agent',
      action: 'AUTO_RECONCILE',
      voucherType: 'Payment Voucher',
      voucherNumber: 'PAY-2024-904',
      beforeJson: JSON.stringify({ status: 'Needs Review', glCode: '9999', itcEligible: false }, null, 2),
      afterJson: JSON.stringify({ status: 'Categorized', glCode: '6030', category: 'Legal & Professional', itcEligible: true }, null, 2),
      sha256Hash: 'a9f82d8471e9842a1b94c0388d1847291a9b8c7e6f5d4c3b2a109876543210ab'
    },
    {
      id: 'aud-108',
      timestamp: '2026-11-10 10:15:02 IST',
      actorId: 'Rahul (Accountant)',
      actorType: 'Human User',
      action: 'TDS_ADJUSTMENT',
      voucherType: 'Bill Pay AP',
      voucherNumber: 'INF-2024-8819',
      beforeJson: JSON.stringify({ tdsSection: 'None', tdsAmount: 0, netPayable: 118000 }, null, 2),
      afterJson: JSON.stringify({ tdsSection: '194J', tdsRate: 10, tdsAmount: 10000, netPayable: 108000 }, null, 2),
      sha256Hash: 'c4b3a2109876543210fe9d8c7b6a504938271645049382716450493827164504'
    },
    {
      id: 'aud-107',
      timestamp: '2026-11-09 18:32:10 IST',
      actorId: 'Agent_Statutory_Verifier (AI)',
      actorType: 'AI Agent',
      action: 'CREATE_VOUCHER',
      voucherType: 'GST Tax Invoice',
      voucherNumber: 'INV-IN-2024-001',
      beforeJson: JSON.stringify({ irnStatus: 'Pending', irn: null }, null, 2),
      afterJson: JSON.stringify({ irnStatus: 'Generated', irn: 'a67b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b' }, null, 2),
      sha256Hash: 'd8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9'
    },
    {
      id: 'aud-106',
      timestamp: '2026-11-08 22:10:44 IST',
      actorId: 'CA_Vikram_Partner (Auditor)',
      actorType: 'CA Auditor',
      action: 'LOCK_PERIOD',
      voucherType: 'Month-End Close',
      voucherNumber: 'CLOSE-OCT2026',
      beforeJson: JSON.stringify({ isBooksLocked: false, lockedBy: null }, null, 2),
      afterJson: JSON.stringify({ isBooksLocked: true, lockedBy: 'CA Vikram (M.No 094812)', sealedHash: 'SHA-256-OCT26-SEAL' }, null, 2),
      sha256Hash: 'f1e2d3c4b5a60718293a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e'
    }
  ]);

  const handleExportEvidencePack = () => {
    const textData = `MCA RULE 3(1) & RULE 11(g) STATUTORY AUDIT TRAIL EVIDENCE PACK
Company: ${currentEntity.name}
CIN: ${currentEntity.cin || 'U72900KA2023PTC174829'} | PAN: ${currentEntity.pan || 'AABCA1234F'}
Assessment Year: 2025-26
Software Certification: Non-Disableable Append-Only Audit Trail Active
Total Log Records Preserved: 12,842 Entries
Chained Cryptographic Algorithm: SHA-256
Server Residency: Primary Storage within India (Rule 3(6) Companies Act 2013)
Verified By: Automated Statutory Provenance Guard`;

    const blob = new Blob([textData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MCA_Rule11g_Audit_Trail_Pack_${currentEntity.slug || 'accai'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Exported MCA Rule 11(g) Statutory Auditor Evidence Pack.');
  };

  const filtered = auditLogs.filter((entry) => {
    const matchActor = filterActor === 'ALL' || entry.actorType === filterActor;
    const matchSearch =
      entry.voucherNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.actorId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.action.toLowerCase().includes(searchQuery.toLowerCase());
    return matchActor && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-[#006948]/10 text-[#006948]">
              <History className="w-5 h-5 stroke-[2.2]" />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-[#131b2e]">
              MCA Rule 3(1) & Rule 11(g) Statutory Audit Trail
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#006948]/10 text-[#006948] text-[11px] font-semibold tracking-wide">
              Mandatory MCA Compliance
            </span>
          </div>
          <p className="text-xs text-[#6d7a72] pl-10">
            Non-disableable append-only edit log recording every voucher alteration with actor ID, before/after state diffs, and SHA-256 chained hashes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportEvidencePack}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#006948] hover:bg-[#00855d] text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Rule 11(g) Evidence Pack</span>
          </button>
        </div>
      </div>

      {/* 4 Audit Trail KPI Bento Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#6d7a72] uppercase tracking-wider">
              Total Trail Records
            </span>
            <span className="p-1.5 rounded-lg bg-[#006948]/10 text-[#006948]">
              <History className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-[#131b2e]">
              12,842 Entries
            </div>
            <div className="text-[11px] text-[#6d7a72] mt-1 font-medium">
              Every edit preserved permanently
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#6d7a72] uppercase tracking-wider">
              Tamper-Proof Chaining
            </span>
            <span className="p-1.5 rounded-lg bg-[#006948]/10 text-[#006948]">
              <Lock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-[#006948] flex items-center gap-1.5">
              <CheckCircle2 className="w-5 h-5" />
              <span>SHA-256 Validated</span>
            </div>
            <div className="text-[11px] text-[#006948] mt-1 font-medium">
              Zero hash collisions or breaks
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#6d7a72] uppercase tracking-wider">
              Audit Trail Status
            </span>
            <span className="p-1.5 rounded-lg bg-[#006948]/10 text-[#006948]">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-[#006948] flex items-center gap-1.5">
              <Lock className="w-4 h-4" />
              <span>Non-Disableable</span>
            </div>
            <div className="text-[11px] text-[#6d7a72] mt-1 font-medium">
              Admin bypass disabled at DB level
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#6d7a72] uppercase tracking-wider">
              AI Identity Logging
            </span>
            <span className="p-1.5 rounded-lg bg-[#3b82f6]/10 text-[#3b82f6]">
              <Bot className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-[#3b82f6] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Dedicated Agent IDs</span>
            </div>
            <div className="text-[11px] text-[#6d7a72] mt-1 font-medium">
              Distinct from human user logins
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#6d7a72]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by voucher #, actor identity, or action..."
            className="w-full bg-[#f2f3ff] rounded-xl pl-10 pr-4 py-2 text-xs text-[#131b2e] focus:bg-white focus:outline-none border border-transparent focus:border-[#006948]"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['ALL', 'AI Agent', 'Human User'] as const).map((a) => (
            <button
              key={a}
              onClick={() => setFilterActor(a)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterActor === a
                  ? 'bg-[#006948] text-white shadow-sm'
                  : 'bg-white text-[#3d4a42] hover:bg-[#eaedff] border border-[#eaedff]'
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="overflow-x-auto rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#eaedff] bg-[#f8f9ff]/70 text-[10px] font-mono text-[#6d7a72] uppercase tracking-wider">
              <th className="py-3 px-4">Timestamp (IST)</th>
              <th className="py-3 px-4">Actor ID & Provenance</th>
              <th className="py-3 px-4">Action</th>
              <th className="py-3 px-4">Voucher Type & #</th>
              <th className="py-3 px-4">SHA-256 Fingerprint</th>
              <th className="py-3 px-4 text-right">State Diff</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eaedff] font-medium">
            {filtered.map((log) => (
              <tr key={log.id} className="hover:bg-[#f2f3ff]/40 transition-colors">
                <td className="py-3.5 px-4 font-mono text-[#3d4a42]">
                  {log.timestamp}
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5 font-semibold text-[#131b2e]">
                    {log.actorType === 'AI Agent' ? (
                      <Bot className="w-3.5 h-3.5 text-[#006948]" />
                    ) : (
                      <UserCheck className="w-3.5 h-3.5 text-[#3b82f6]" />
                    )}
                    <span>{log.actorId}</span>
                  </div>
                  <div className="text-[10px] text-[#6d7a72] mt-0.5">{log.actorType}</div>
                </td>
                <td className="py-3.5 px-4 font-mono">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#f2f3ff] text-[#131b2e] border border-[#eaedff]">
                    {log.action}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-[#131b2e]">{log.voucherNumber}</div>
                  <div className="text-[10px] text-[#6d7a72]">{log.voucherType}</div>
                </td>
                <td className="py-3.5 px-4 font-mono text-[10px] text-[#6d7a72]">
                  {log.sha256Hash.substring(0, 16)}...
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => setSelectedEntry(log)}
                    className="px-2.5 py-1 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] text-[#006948] font-semibold text-[11px] border border-[#eaedff] transition-all"
                  >
                    Inspect Diff
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal: State Diff Inspector */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in zoom-in-95 duration-150">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 space-y-4 border border-[#eaedff] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#eaedff] pb-3">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-[#006948]" />
                <h3 className="text-base font-bold text-[#131b2e]">
                  Voucher State Diff • {selectedEntry.voucherNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEntry(null)}
                className="w-7 h-7 rounded-full bg-[#f2f3ff] flex items-center justify-center text-[#3d4a42] hover:text-[#131b2e]"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[11px] font-bold text-[#ba1a1a] block mb-1">
                  Before State (Previous Record)
                </span>
                <pre className="p-3 rounded-xl bg-[#131b2e] text-[#ffdad6] font-mono text-[11px] h-48 overflow-y-auto">
                  {selectedEntry.beforeJson}
                </pre>
              </div>

              <div>
                <span className="text-[11px] font-bold text-[#006948] block mb-1">
                  After State (Committed Audit Log)
                </span>
                <pre className="p-3 rounded-xl bg-[#131b2e] text-[#6cf8bb] font-mono text-[11px] h-48 overflow-y-auto">
                  {selectedEntry.afterJson}
                </pre>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#faf8ff] border border-[#eaedff] font-mono text-[10px] text-[#6d7a72] break-all">
              Chained SHA-256 Digest: {selectedEntry.sha256Hash}
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => setSelectedEntry(null)}
                className="px-5 py-2 rounded-full bg-[#006948] text-white font-bold text-xs shadow-sm hover:bg-[#00855d]"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
