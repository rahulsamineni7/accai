import React, { useState } from 'react';
import { useDigits } from '../../context/DigitsContext';
import { VaultDocument } from '../../types';
import {
  Upload,
  Search,
  FileText,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const VaultView: React.FC = () => {
  const { vaultDocuments, addVaultDocument, setActiveView } = useDigits();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [selectedDoc, setSelectedDoc] = useState<VaultDocument | null>(vaultDocuments[0] || null);
  const [isUploading, setIsUploading] = useState(false);

  const filtered = vaultDocuments.filter((d) => {
    const matchSearch =
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.vendor && d.vendor.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchType = typeFilter === 'All' || d.type === typeFilter;
    return matchSearch && matchType;
  });

  const handleSimulateUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      addVaultDocument({
        title: 'Anthropic Claude-3.5 Inference Receipts - Oct 2026',
        type: 'Receipt',
        uploadedAt: new Date().toISOString().substring(0, 10),
        fileSize: '1.2 MB',
        vendor: 'Anthropic PBC',
        amount: 4500.00,
        ocrExtracted: true,
        ocrText: 'RECEIPT: Anthropic, PBC. API Usage for Model Claude-3.5-Sonnet and Opus. Subtotal: $4,500.00. Payment method: Brex ending 8842. Status: Paid.'
      });
      setIsUploading(false);
    }, 800);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#eaedff] pb-4">
        <div>
          <div className="text-xs font-semibold text-[#006948] mb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#006c49] shadow-[0_0_8px_#6cf8bb] animate-pulse" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider">
              AUTONOMOUS DOCUMENT INTELLIGENCE
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#131b2e] tracking-tight">Documents & Receipts Vault</h1>
          <div className="text-xs text-[#3d4a42] mt-0.5">
            Central repository for source invoices, W-9s, contracts, and optical character recognition (OCR) audit records
          </div>
        </div>

        <button
          onClick={handleSimulateUpload}
          disabled={isUploading}
          className="px-5 py-2 rounded-full bg-[#006948] hover:bg-[#00855d] text-white font-bold text-xs active:scale-95 transition-all flex items-center space-x-1.5 shadow-sm disabled:opacity-50"
        >
          <Upload className="w-4 h-4 stroke-[2.5]" />
          <span>{isUploading ? 'Extracting OCR...' : 'Upload Document'}</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white/90 backdrop-blur-xl p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-sm border border-[#eaedff]">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#3d4a42]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search document title or vendor..."
            className="w-full bg-[#f2f3ff] rounded-full pl-10 pr-4 py-2 text-xs text-[#131b2e] placeholder-[#3d4a42]/70 focus:outline-none focus:bg-white border border-transparent focus:border-[#6cf8bb] transition-all"
          />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto">
          {['All', 'Invoice', 'Receipt', 'Bank Statement', 'Contract', 'Tax Document'].map((tp) => (
            <button
              key={tp}
              onClick={() => setTypeFilter(tp)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                typeFilter === tp
                  ? 'bg-[#006948] text-white shadow-sm'
                  : 'text-[#3d4a42] hover:bg-[#eaedff]'
              }`}
            >
              {tp}
            </button>
          ))}
        </div>
      </div>

      {/* Two Column Layout: List on left, OCR Inspector on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document Cards List */}
        <div className="lg:col-span-2 space-y-3">
          {filtered.map((doc) => (
            <div
              key={doc.id}
              onClick={() => setSelectedDoc(doc)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                selectedDoc?.id === doc.id
                  ? 'bg-white border-[#006948] ring-1 ring-[#006948] shadow-sm'
                  : 'bg-white/80 border-[#eaedff] hover:bg-white'
              }`}
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#eaedff] flex items-center justify-center text-[#006948]">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#131b2e]">{doc.title}</h3>
                  <div className="flex items-center space-x-2 text-[11px] text-[#3d4a42] mt-0.5">
                    <span>{doc.type}</span>
                    <span>•</span>
                    <span>{doc.fileSize}</span>
                    <span>•</span>
                    <span>Uploaded {doc.uploadedAt}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                {doc.amount && (
                  <div className="text-sm font-bold font-mono text-[#131b2e]">
                    ${doc.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                )}
                <div className="flex items-center justify-end space-x-1 text-[10px] text-[#006c49] mt-0.5 font-semibold">
                  <Sparkles className="w-3 h-3" />
                  <span>OCR Indexed</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Document OCR Detail Drawer */}
        <div className="bg-white/90 backdrop-blur-xl p-6 rounded-2xl space-y-4 shadow-sm border border-[#eaedff]">
          <div className="flex items-center justify-between border-b border-[#eaedff] pb-3">
            <h3 className="text-sm font-bold text-[#131b2e] flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#006948]" />
              <span>Autonomous OCR Inspector</span>
            </h3>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#6cf8bb]/40 text-[#00714d] border border-[#6cf8bb]/50 font-bold">
              AGL Verified
            </span>
          </div>

          {selectedDoc ? (
            <div className="space-y-4">
              <div>
                <div className="text-[10px] text-[#3d4a42] uppercase tracking-wider font-semibold">Document Name</div>
                <div className="text-sm font-semibold text-[#131b2e] mt-0.5">{selectedDoc.title}</div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#f2f3ff] border border-[#eaedff]">
                  <div className="text-[10px] text-[#3d4a42]">Type</div>
                  <div className="font-semibold text-[#131b2e] mt-0.5">{selectedDoc.type}</div>
                </div>
                <div className="p-3 rounded-xl bg-[#f2f3ff] border border-[#eaedff]">
                  <div className="text-[10px] text-[#3d4a42]">Parsed Total</div>
                  <div className="font-mono font-bold text-[#006c49] mt-0.5">
                    {selectedDoc.amount ? `$${selectedDoc.amount.toLocaleString()}` : 'N/A'}
                  </div>
                </div>
              </div>

              {/* OCR Text Box */}
              <div>
                <div className="text-[10px] font-semibold text-[#3d4a42] uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Extracted OCR Tokens</span>
                  <span className="text-[10px] font-mono text-[#006c49] font-semibold">100% confidence</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff] font-mono text-xs text-[#131b2e] leading-relaxed whitespace-pre-wrap">
                  {selectedDoc.ocrText || 'No optical text extracted for this record.'}
                </div>
              </div>

              {selectedDoc.linkedTransactionId && (
                <button
                  onClick={() => setActiveView('transactions')}
                  className="w-full py-2.5 rounded-full bg-[#eaedff] hover:bg-[#dae2fd] text-xs font-semibold text-[#131b2e] transition-all flex items-center justify-center space-x-1.5 border border-[#eaedff]"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#006948]" />
                  <span>View Linked Transaction ({selectedDoc.linkedTransactionId})</span>
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-[#3d4a42] text-xs">
              Select a document to inspect its OCR tokens
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
