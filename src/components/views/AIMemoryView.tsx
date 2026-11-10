import React, { useState } from 'react';
import { useDigits } from '../../context/DigitsContext';
import {
  Brain,
  Layers,
  Sparkles,
  Database,
  Search,
  CheckCircle2,
  ShieldCheck,
  Cpu,
  ArrowRight,
  GitBranch,
  Building2,
  Scale,
  Globe
} from 'lucide-react';

interface MemoryVector {
  id: string;
  tier: 1 | 2 | 3 | 4;
  tierName: string;
  source: string;
  queryPattern: string;
  learnedResolution: string;
  glCode: string;
  confidence: string;
  scope: string;
  lastUpdated: string;
}

export const AIMemoryView: React.FC = () => {
  const { currentEntity, showNotification } = useDigits();
  const [selectedTier, setSelectedTier] = useState<number>(0); // 0 = all
  const [simQuery, setSimQuery] = useState('BlueDart express courier bill');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simResolution, setSimResolution] = useState<{
    resolvedTier: string;
    targetGL: string;
    statutoryRef: string;
    confidence: string;
    reasoning: string;
  } | null>({
    resolvedTier: 'Tier 1: Client Episodic Memory',
    targetGL: '#6020 Software & Shipping Logistics',
    statutoryRef: 'CGST Section 9(3) RCM + Sec 194C TDS',
    confidence: '99.4%',
    reasoning: 'Matched client episodic pattern: Courier invoice automatically split into 95% freight expense + 5% RCM GST liability.'
  });

  const sampleVectors: MemoryVector[] = [
    {
      id: 'vec-01',
      tier: 1,
      tierName: 'Client Episodic Memory',
      source: 'User Feedback (HITL Edit)',
      queryPattern: 'Swiggy Instamart / Zepto quick-commerce receipts',
      learnedResolution: 'Map to #6040 Office Pantry & Snacks (Not General Expense)',
      glCode: '6040',
      confidence: '99.8%',
      scope: currentEntity.name,
      lastUpdated: 'Today'
    },
    {
      id: 'vec-02',
      tier: 1,
      tierName: 'Client Episodic Memory',
      source: 'Diff-Capture Listener',
      queryPattern: 'CoreWeave / RunPod GPU Reserved Instances',
      learnedResolution: 'Map to #5010 Direct Cloud Inference Compute (COGS)',
      glCode: '5010',
      confidence: '99.9%',
      scope: currentEntity.name,
      lastUpdated: 'Yesterday'
    },
    {
      id: 'vec-03',
      tier: 2,
      tierName: 'CA Firm Institutional Memory',
      source: 'Senior Partner Audit Policy',
      queryPattern: 'Road transport & GTA courier bills exceeding ₹5,000',
      learnedResolution: 'Auto-split into GTA Freight + 5% RCM GST under Section 9(3)',
      glCode: '6020',
      confidence: '99.2%',
      scope: 'Firm-wide (All SME Clients)',
      lastUpdated: '2 days ago'
    },
    {
      id: 'vec-04',
      tier: 2,
      tierName: 'CA Firm Institutional Memory',
      source: 'Article Assistant Correction',
      queryPattern: 'Legal retainers & trademark docketing fees',
      learnedResolution: 'Enforce Section 194J (10% TDS) deduction ceiling',
      glCode: '6050',
      confidence: '99.5%',
      scope: 'Firm-wide (All SME Clients)',
      lastUpdated: 'Oct 28'
    },
    {
      id: 'vec-05',
      tier: 3,
      tierName: 'Global Statutory Baseline',
      source: 'GSTN & Income Tax Act 2025 Directory',
      queryPattern: 'SAC 998314 (IT Design & Software Development)',
      learnedResolution: '18% GST Rate (Intra: 9% CGST + 9% SGST; Inter: 18% IGST)',
      glCode: '4010',
      confidence: '100.0%',
      scope: 'Statutory Baseline (India)',
      lastUpdated: 'Statutory Lock'
    },
    {
      id: 'vec-06',
      tier: 3,
      tierName: 'Global Statutory Baseline',
      source: 'Section 17(5) CGST Act',
      queryPattern: 'Corporate employee restaurant dining & personal food expenses',
      learnedResolution: 'Statutory Blocked Input Tax Credit (ITC disallowed)',
      glCode: '6040',
      confidence: '100.0%',
      scope: 'Statutory Baseline (India)',
      lastUpdated: 'Statutory Lock'
    },
    {
      id: 'vec-07',
      tier: 4,
      tierName: 'Autonomous Fallback Research Agent',
      source: 'GSTN Algorithmic Checksum & PAN Decoder',
      queryPattern: 'Unknown vendor GSTIN 29AABCA1234F1Z8',
      learnedResolution: 'Derived state: 29-Karnataka; PAN: AABCA1234F (Company). Verified via Modulo-36.',
      glCode: '9999',
      confidence: '96.5%',
      scope: 'Public Directory Fallback',
      lastUpdated: 'Realtime'
    }
  ];

  const handleSimulateResolution = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      const q = simQuery.toLowerCase();
      if (q.includes('swiggy') || q.includes('pantry') || q.includes('food')) {
        setSimResolution({
          resolvedTier: 'Tier 1: Client Episodic Memory',
          targetGL: '#6040 Office Pantry & Snacks',
          statutoryRef: 'Section 17(5) Blocked ITC Guard applied',
          confidence: '99.8%',
          reasoning: 'Matched client episodic pattern: Quick commerce deliveries are auto-assigned to Office Pantry with ITC blocked u/s 17(5).'
        });
      } else if (q.includes('legal') || q.includes('lawyer') || q.includes('azb')) {
        setSimResolution({
          resolvedTier: 'Tier 2: CA Firm Institutional Memory',
          targetGL: '#6050 Legal & Corporate Governance',
          statutoryRef: 'Section 194J (10% TDS Withholding)',
          confidence: '99.5%',
          reasoning: 'Resolved via firm-wide CA policy: Professional legal fees require mandatory 10% TDS deduction and Form 26Q logging.'
        });
      } else if (q.includes('hsn') || q.includes('sac') || q.includes('software')) {
        setSimResolution({
          resolvedTier: 'Tier 3: Global Indian Statutory Baseline',
          targetGL: '#4010 Enterprise SaaS Revenue',
          statutoryRef: 'SAC 998314 / 18% GST Rate Matrix',
          confidence: '100.0%',
          reasoning: 'Grounded in statutory baseline: Software services attract 18% GST with place-of-supply rule enforcement.'
        });
      } else {
        setSimResolution({
          resolvedTier: 'Tier 4: Autonomous Fallback Research Agent',
          targetGL: '#6020 Software & Shipping Logistics',
          statutoryRef: 'Derived from GSTIN prefix & OCR line items',
          confidence: '97.2%',
          reasoning: 'Fallback agent extracted counterparty state code and mapped HSN via statutory semantic vector lookup.'
        });
      }
      showNotification('Resolved through 4-Tier Model Layer Cake!');
    }, 450);
  };

  const filteredVectors = sampleVectors.filter((v) => {
    return selectedTier === 0 || v.tier === selectedTier;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#eaedff] pb-4">
        <div>
          <div className="text-xs font-semibold text-[#006948] mb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#006c49] shadow-[0_0_8px_#6cf8bb] animate-pulse" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider">
              AI MEMORY ARCHITECTURE: 4-TIER MODEL LAYER CAKE
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#131b2e] tracking-tight">
            Self-Learning General Ledger Memory
          </h1>
          <div className="text-xs text-[#3d4a42] mt-0.5">
            Four distinct vector & graph memory layers: Client Episodic, CA Firm Institutional, Global Indian Statutory Baseline, and Autonomous Fallback Research.
          </div>
        </div>
      </div>

      {/* 4-Tier Architecture Overview Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tier 1 */}
        <div
          onClick={() => setSelectedTier(1)}
          className={`p-5 rounded-3xl bg-white/90 backdrop-blur-xl border transition-all cursor-pointer shadow-sm hover:shadow-md ${
            selectedTier === 1 ? 'border-[#006948] ring-2 ring-[#6cf8bb]/40' : 'border-[#eaedff]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#6cf8bb]/40 text-[#00714d] font-bold">
              Tier 1
            </span>
            <Brain className="w-4 h-4 text-[#006948]" />
          </div>
          <h3 className="text-sm font-bold text-[#131b2e] mt-3">Client Episodic Memory</h3>
          <p className="text-[11px] text-[#3d4a42] mt-1 leading-relaxed">
            Learns company-specific vendor mappings, recurring multi-line splits, and narration shorthands.
          </p>
          <div className="mt-4 pt-3 border-t border-[#eaedff] flex items-center justify-between text-[11px] font-mono text-[#006c49] font-semibold">
            <span>Partitioned: company_id</span>
            <span>142 Vectors</span>
          </div>
        </div>

        {/* Tier 2 */}
        <div
          onClick={() => setSelectedTier(2)}
          className={`p-5 rounded-3xl bg-white/90 backdrop-blur-xl border transition-all cursor-pointer shadow-sm hover:shadow-md ${
            selectedTier === 2 ? 'border-[#006948] ring-2 ring-[#6cf8bb]/40' : 'border-[#eaedff]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#eaedff] text-[#006948] font-bold">
              Tier 2
            </span>
            <Building2 className="w-4 h-4 text-[#006948]" />
          </div>
          <h3 className="text-sm font-bold text-[#131b2e] mt-3">CA Firm Institutional</h3>
          <p className="text-[11px] text-[#3d4a42] mt-1 leading-relaxed">
            Shared across all SME clients under the CA practice. Edits made for one client propagate firm-wide.
          </p>
          <div className="mt-4 pt-3 border-t border-[#eaedff] flex items-center justify-between text-[11px] font-mono text-[#006948] font-semibold">
            <span>Partitioned: firm_id</span>
            <span>890 Vectors</span>
          </div>
        </div>

        {/* Tier 3 */}
        <div
          onClick={() => setSelectedTier(3)}
          className={`p-5 rounded-3xl bg-white/90 backdrop-blur-xl border transition-all cursor-pointer shadow-sm hover:shadow-md ${
            selectedTier === 3 ? 'border-[#006948] ring-2 ring-[#6cf8bb]/40' : 'border-[#eaedff]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#f2f3ff] text-[#131b2e] font-bold border border-[#eaedff]">
              Tier 3
            </span>
            <Scale className="w-4 h-4 text-[#006948]" />
          </div>
          <h3 className="text-sm font-bold text-[#131b2e] mt-3">Global Statutory Baseline</h3>
          <p className="text-[11px] text-[#3d4a42] mt-1 leading-relaxed">
            HSN/SAC directory, Income-tax Act 2025 TDS matrix, Section 17(5) blocked ITC, and Schedule III.
          </p>
          <div className="mt-4 pt-3 border-t border-[#eaedff] flex items-center justify-between text-[11px] font-mono text-[#3d4a42]">
            <span>18,000+ Codes</span>
            <span className="font-bold text-[#006c49]">Statutory Lock</span>
          </div>
        </div>

        {/* Tier 4 */}
        <div
          onClick={() => setSelectedTier(4)}
          className={`p-5 rounded-3xl bg-white/90 backdrop-blur-xl border transition-all cursor-pointer shadow-sm hover:shadow-md ${
            selectedTier === 4 ? 'border-[#006948] ring-2 ring-[#6cf8bb]/40' : 'border-[#eaedff]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#6cf8bb]/40 text-[#00714d] font-bold">
              Tier 4
            </span>
            <Globe className="w-4 h-4 text-[#006948]" />
          </div>
          <h3 className="text-sm font-bold text-[#131b2e] mt-3">Autonomous Fallback Agent</h3>
          <p className="text-[11px] text-[#3d4a42] mt-1 leading-relaxed">
            Extracts PAN from GSTIN chars 3–12, derives state from 1–2, and parses OCR for Udyam numbers.
          </p>
          <div className="mt-4 pt-3 border-t border-[#eaedff] flex items-center justify-between text-[11px] font-mono text-[#006c49] font-semibold">
            <span>Zero-Shot Heuristic</span>
            <span>Realtime</span>
          </div>
        </div>
      </div>

      {/* Memory Resolution Simulator Lab */}
      <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-xl border border-[#eaedff] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-[#006948] uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#006c49]" />
            <span>4-Tier Memory Query Simulator</span>
          </div>
          <span className="text-[11px] font-mono text-[#3d4a42]">pgvector + Semantic Knowledge Graph</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#3d4a42]" />
            <input
              type="text"
              value={simQuery}
              onChange={(e) => setSimQuery(e.target.value)}
              placeholder="Test query: e.g. BlueDart courier bill, Swiggy Instamart, or AZB legal fee..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-[#f2f3ff] text-xs font-mono text-[#131b2e] focus:bg-white focus:outline-none focus:border-[#6cf8bb] border border-transparent transition-all"
            />
          </div>
          <button
            onClick={handleSimulateResolution}
            disabled={isSimulating}
            className="w-full sm:w-auto px-6 py-2 rounded-full bg-[#006948] hover:bg-[#00855d] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50"
          >
            <Cpu className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Traversing Model Cake...' : 'Resolve Query'}</span>
          </button>
        </div>

        {/* Resolution Trace Card */}
        {simResolution && (
          <div className="p-4 rounded-2xl bg-[#eaedff]/60 border border-[#eaedff] space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-[#eaedff] pb-2">
              <span className="text-xs font-bold text-[#006948] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#006c49]" />
                {simResolution.resolvedTier}
              </span>
              <span className="text-[10px] font-mono bg-[#6cf8bb] text-[#00714d] px-2 py-0.5 rounded-full font-bold">
                {simResolution.confidence} Match
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              <div>
                <span className="text-[10px] text-[#3d4a42] block">Target GL Classification:</span>
                <span className="font-bold text-[#131b2e]">{simResolution.targetGL}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#3d4a42] block">Statutory Ref & Guard:</span>
                <span className="font-bold text-[#006948]">{simResolution.statutoryRef}</span>
              </div>
            </div>
            <p className="text-[11px] text-[#3d4a42] leading-relaxed pt-1 border-t border-[#eaedff]/80">
              {simResolution.reasoning}
            </p>
          </div>
        )}
      </div>

      {/* Vectors Table */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden shadow-sm border border-[#eaedff]">
        <div className="p-5 border-b border-[#eaedff] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-[#006948]" />
            <div>
              <h3 className="text-sm font-bold text-[#131b2e]">Active Vector Embeddings & Learned Patterns</h3>
              <p className="text-[11px] text-[#3d4a42]">
                {selectedTier === 0 ? 'Showing all 4 memory tiers' : `Filtered by Tier ${selectedTier}`}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1 text-xs">
            <button
              onClick={() => setSelectedTier(0)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                selectedTier === 0 ? 'bg-[#006948] text-white' : 'text-[#3d4a42] hover:bg-[#eaedff]'
              }`}
            >
              All Tiers
            </button>
            {[1, 2, 3, 4].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTier(t)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                  selectedTier === t ? 'bg-[#006948] text-white' : 'text-[#3d4a42] hover:bg-[#eaedff]'
                }`}
              >
                Tier {t}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f2f3ff]/70 text-[#3d4a42] text-[10px] uppercase tracking-wider border-b border-[#eaedff]">
                <th className="py-3 px-5 font-semibold">Query Pattern / Entity String</th>
                <th className="py-3 px-3 font-semibold">Tier & Source</th>
                <th className="py-3 px-4 font-semibold">Learned General Ledger Resolution</th>
                <th className="py-3 px-3 font-semibold">Target GL</th>
                <th className="py-3 px-3 font-semibold text-center">Confidence</th>
                <th className="py-3 px-5 font-semibold text-right">Scope</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eaedff] font-mono">
              {filteredVectors.map((v) => (
                <tr key={v.id} className="hover:bg-[#f2f3ff]/40 transition-colors">
                  <td className="py-3.5 px-5 font-sans">
                    <span className="font-bold text-[#131b2e] block">{v.queryPattern}</span>
                  </td>
                  <td className="py-3.5 px-3 font-sans">
                    <span className="px-2 py-0.5 rounded-full bg-[#eaedff] text-[#006948] font-bold text-[10px] inline-block mb-0.5">
                      {v.tierName}
                    </span>
                    <span className="text-[10px] text-[#3d4a42] block font-mono">{v.source}</span>
                  </td>
                  <td className="py-3.5 px-4 font-sans text-xs text-[#3d4a42]">
                    {v.learnedResolution}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="font-bold text-[#131b2e]">#{v.glCode}</span>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span className="text-[10px] bg-[#6cf8bb]/40 text-[#00714d] px-2 py-0.5 rounded-full font-bold">
                      {v.confidence}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right font-sans text-[11px] text-[#3d4a42]">
                    {v.scope}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
