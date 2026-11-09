import React, { useState } from 'react';
import { useDigits } from '../../context/DigitsContext';

export const RulesEngineView: React.FC = () => {
  const { rules, addRule, toggleRuleActive, runRulesNow, chartOfAccounts } = useDigits();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'auto' | 'review'>('all');
  const [threshold, setThreshold] = useState(90);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executeSuccess, setExecuteSuccess] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Heuristic Simulator State
  const [simText, setSimText] = useState('DEBIT 10/24 OPENAI *CHATGPT SUBSCRIPTION HTTPSOPENAI.C CA $20.00');
  const [simAmount, setSimAmount] = useState('20.00');
  const [simAccount, setSimAccount] = useState('Brex Operating (..8821)');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simResult, setSimResult] = useState<{
    matchedRule: string;
    targetGL: string;
    confidence: string;
    decision: string;
    latency: string;
    trace: string;
  }>({
    matchedRule: '#01 OpenAI & Claude LLM Inference',
    targetGL: '#6020 Software & SaaS',
    confidence: '99.4%',
    decision: 'Instant Auto-Approval Allowed',
    latency: '18ms',
    trace: 'Token string "OPENAI" extracted with zero regex divergence. Confidence threshold exceeds 90.0% constraint. Zero controller intervention required.'
  });

  // New Rule Form
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleCondition, setNewRuleCondition] = useState('');
  const [newRuleAmountMax, setNewRuleAmountMax] = useState('25000');
  const [newRuleTargetGL, setNewRuleTargetGL] = useState('6020 Software & SaaS');
  const [newRuleTag, setNewRuleTag] = useState('AI Infra');

  const samplePayloads = [
    { text: "CHECKCARD 1024 ANTHROPIC CLAUDE API INVOICE 99401 SAN FRANCISCO CA", amount: "1,240.50", rule: "#01 OpenAI & Claude LLM Inference", gl: "#6020 Software & SaaS", conf: "99.8%", trace: "Pattern `ANTHROPIC CLAUDE` matched deterministic heuristic with 99.8% precision." },
    { text: "AMAZON WEB SERVICES AWS.AMAZON.CO WA US REF: 90214812", amount: "8,419.12", rule: "#02 AWS GPU Cloud Compute", gl: "#5010 Direct Cloud Inference Compute", conf: "99.8%", trace: "Vendor entity matched Amazon Web Services. Bound to COGS Cloud Compute." },
    { text: "GUSTO PAYROLL PE9910-184 ACME CORP WAGE DISBURSEMENT", amount: "64,210.00", rule: "#03 Gusto Monthly Payroll Sync", gl: "#6010 Payroll (85%) + #2100 Taxes (15%)", conf: "100.0%", trace: "Gusto webhook payload decoded. Split journal automatically constructed." },
    { text: "WIRE OUT: LATHAM & WATKINS LLP RETAINER INV #881902", amount: "15,000.00", rule: "#05 Legal Retainer Review Flag", gl: "#6050 Legal Retainer", conf: "Requires Review", trace: "Amount > $10,000 constraint triggered. Flagged for Controller Sarah Jenkins sign-off." }
  ];

  const handleSampleClick = () => {
    const random = samplePayloads[Math.floor(Math.random() * samplePayloads.length)];
    setSimText(random.text);
    setSimAmount(random.amount);
    setSimResult({
      matchedRule: random.rule,
      targetGL: random.gl,
      confidence: random.conf,
      decision: random.conf === 'Requires Review' ? 'Hold for Controller Review' : 'Instant Auto-Approval Allowed',
      latency: `${Math.floor(Math.random() * 15 + 12)}ms`,
      trace: random.trace
    });
  };

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      const textLower = simText.toLowerCase();
      let matched = samplePayloads[0];
      if (textLower.includes('aws') || textLower.includes('amazon')) matched = samplePayloads[1];
      else if (textLower.includes('gusto') || textLower.includes('payroll')) matched = samplePayloads[2];
      else if (textLower.includes('legal') || textLower.includes('latham')) matched = samplePayloads[3];

      setSimResult({
        matchedRule: matched.rule,
        targetGL: matched.gl,
        confidence: matched.conf,
        decision: matched.conf === 'Requires Review' ? 'Hold for Controller Review' : 'Instant Auto-Approval Allowed',
        latency: `${Math.floor(Math.random() * 15 + 10)}ms`,
        trace: matched.trace
      });
    }, 400);
  };

  const handleExecuteAll = () => {
    setIsExecuting(true);
    setTimeout(() => {
      runRulesNow();
      setIsExecuting(false);
      setExecuteSuccess(true);
      setTimeout(() => setExecuteSuccess(false), 3000);
    }, 900);
  };

  const handleCreateRuleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName || !newRuleCondition) return;
    addRule({
      name: newRuleName,
      conditionField: 'description',
      conditionValue: newRuleCondition,
      targetCategory: newRuleTargetGL,
      targetGLCode: newRuleTargetGL.split(' ')[0].replace('#', ''),
      autoApprove: true,
      isActive: true
    });
    setNewRuleName('');
    setNewRuleCondition('');
    setIsCreateModalOpen(false);
  };

  const defaultHeuristicRules = [
    {
      id: '01',
      title: 'OpenAI & Claude LLM Inference',
      desc: 'Categorizes generative tokens, subscriptions & direct frontier lab inference usage',
      verified: true,
      tag: 'AI Infra',
      matchesMTD: 24,
      autoApprove: true,
      condition: 'Description matches regex',
      conditionVal: '/(openai|anthropic|chatgpt)/i',
      andCondition: 'Amount < $25,000.00',
      targetGL: '#6020 Software & SaaS',
      statusText: '100% confidence threshold • 0 false overrides'
    },
    {
      id: '02',
      title: 'AWS GPU Cloud Compute',
      desc: 'Allocates monthly cloud infrastructure directly to Cost of Goods Sold (COGS)',
      directVendor: true,
      matchesMTD: 14,
      autoApprove: true,
      condition: 'Vendor entity equals',
      conditionVal: "'Amazon Web Services'",
      targetGL: '#5010 Direct Cloud Inference Compute',
      statusText: 'EIN tax identifier matched on feed • 99.8% precision'
    },
    {
      id: '03',
      title: 'Gusto Monthly Payroll Sync',
      desc: 'Executes dual-entry bifurcation for gross wages vs employment taxes withholding',
      isSplit: true,
      matchesMTD: 2,
      autoApprove: true,
      condition: 'Description contains string',
      conditionVal: '`Gusto Payroll`',
      targetGL: '#6010 Payroll • 85%',
      splitTargetGL: '#2100 Accrued Taxes • 15%',
      statusText: 'Automated payload parsing via Gusto Partner API Webhook'
    },
    {
      id: '04',
      title: 'Brex Card Auto-Clearance',
      desc: 'Matches monthly card clearing balances & isolated payment gateway surcharge fees',
      liabilityOffset: true,
      matchesMTD: 312,
      autoApprove: true,
      condition: 'Account is',
      conditionVal: "'Brex Operating'",
      andCondition: 'Memo contains `Stripe Fee`',
      targetGL: '#6040 Payment Processing Fees',
      statusText: 'High-frequency clearing ledger • zero hold time'
    },
    {
      id: '05',
      title: 'Legal Retainer Review Flag',
      desc: 'Flags high-value counsel fees over $10,000 for formal retainer draw schedule verification',
      isFlagged: true,
      matchesMTD: 3,
      autoApprove: false,
      condition: 'Vendor entity equals',
      conditionVal: "'Latham & Watkins LLP'",
      andCondition: 'Amount > $10,000.00',
      targetGL: '#6050 Legal Retainer',
      routeText: 'Route to Sarah Jenkins (Controller Queue)',
      statusText: 'Governance Rule: Executive approval required prior to ledger reconciliation'
    }
  ];

  return (
    <div className="w-full relative">
      {/* Ambient Emerald Light Refraction Radiance */}
      <div className="pointer-events-none absolute -top-40 right-20 w-[600px] h-[600px] bg-[#4edea3]/20 rounded-full blur-[140px] mix-blend-multiply -z-10" />
      <div className="pointer-events-none absolute top-96 -left-32 w-[500px] h-[500px] bg-[#85f8c4]/25 rounded-full blur-[160px] mix-blend-multiply -z-10" />

      <div className="w-full max-w-[1440px] mx-auto px-6 py-8 space-y-8">
        {/* Editorial Page Title & Engine Sub-system Meta */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-[#6cf8bb]/40 text-[#00714d] text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-sm backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-[#006c49] animate-pulse" />
                Deterministic Heuristic v3.2
              </span>
              <span className="text-xs text-[#3d4a42] font-mono flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-[#006c49]">memory</span>
                Gemini 2.5 Flash In-Memory Graph
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl text-[#131b2e] tracking-tight font-bold">
              Autonomous Transaction Categorization Engine
            </h1>
            <p className="text-sm text-[#3d4a42] max-w-2xl">
              Powered by Gemini 2.5 Flash pattern recognition & heuristic execution. High-throughput ledger arbitration targeting automated reconciliation without human oversight.
            </p>
          </div>

          {/* Quick Operational Trigger */}
          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-xl p-1.5 rounded-full shadow-sm border border-[#eaedff]">
            <div className="px-4 py-1 text-right">
              <p className="text-[10px] text-[#3d4a42] uppercase tracking-wider font-semibold">Engine State</p>
              <p className="text-xs text-[#006c49] font-mono font-semibold">Active • Sync 12m ago</p>
            </div>
            <button
              onClick={handleExecuteAll}
              disabled={isExecuting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#006948] hover:bg-[#00855d] text-white text-xs font-semibold shadow-[0_4px_14px_0_rgba(16,185,129,0.35)] active:scale-95 transition-all disabled:opacity-50"
            >
              <span className={`material-symbols-outlined text-base ${isExecuting ? 'animate-spin' : ''}`}>
                {isExecuting ? 'sync' : executeSuccess ? 'check_circle' : 'bolt'}
              </span>
              <span>
                {isExecuting
                  ? 'Processing 1,842 Items...'
                  : executeSuccess
                  ? 'Completed (0 Discrepancies)'
                  : 'Execute Rules on All Transactions'}
              </span>
            </button>
          </div>
        </div>

        {/* Summary Metrics Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="relative overflow-hidden p-6 rounded-2xl bg-white/70 backdrop-blur-2xl shadow-sm border border-[#eaedff] group hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#3d4a42] uppercase tracking-wider font-semibold">Active Heuristics</span>
              <div className="p-2 rounded-full bg-[#6cf8bb]/40 text-[#006c49]">
                <span className="material-symbols-outlined text-lg">schema</span>
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl text-[#131b2e] font-mono font-bold">{48 + rules.length - 4}</span>
              <span className="text-xs text-[#006c49] font-semibold">Active</span>
            </div>
            <p className="mt-1 text-xs text-[#3d4a42]">Running continuously in real-time webhook pipeline</p>
            <div className="mt-4 w-full bg-[#eaedff] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#006948] h-full rounded-full" style={{ width: '100%' }} />
            </div>
          </div>

          {/* Card 2 */}
          <div className="relative overflow-hidden p-6 rounded-2xl bg-white/70 backdrop-blur-2xl shadow-sm border border-[#eaedff] group hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#3d4a42] uppercase tracking-wider font-semibold">Autonomous Rate</span>
              <div className="p-2 rounded-full bg-[#85f8c4]/40 text-[#006948]">
                <span className="material-symbols-outlined text-lg">auto_awesome</span>
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl text-[#131b2e] font-mono font-bold">94.6%</span>
              <span className="text-xs text-[#006c49] font-mono font-semibold flex items-center">
                <span className="material-symbols-outlined text-sm">trending_up</span>+3.2%
              </span>
            </div>
            <p className="mt-1 text-xs text-[#3d4a42]">Bypassing manual controller/accountant reviews</p>
            <div className="mt-4 w-full bg-[#eaedff] h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-[#006c49] to-[#68dba9] h-full rounded-full" style={{ width: '94.6%' }} />
            </div>
          </div>

          {/* Card 3 */}
          <div className="relative overflow-hidden p-6 rounded-2xl bg-white/70 backdrop-blur-2xl shadow-sm border border-[#eaedff] group hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#3d4a42] uppercase tracking-wider font-semibold">MTD Categorized</span>
              <div className="p-2 rounded-full bg-[#e2e7ff] text-[#131b2e]">
                <span className="material-symbols-outlined text-lg">data_object</span>
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl text-[#131b2e] font-mono font-bold">1,842</span>
              <span className="text-xs text-[#3d4a42] font-mono">items</span>
            </div>
            <p className="mt-1 text-xs text-[#3d4a42]">Ledger journal entries drafted & signed off</p>
            <div className="mt-4 flex items-center justify-between text-xs text-[#3d4a42] font-mono">
              <span>Target 2k</span>
              <span className="text-[#006c49] font-semibold">92% of target</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="relative overflow-hidden p-6 rounded-2xl bg-white/70 backdrop-blur-2xl shadow-sm border border-[#eaedff] group hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#3d4a42] uppercase tracking-wider font-semibold">Bookkeeping Hours Saved</span>
              <div className="p-2 rounded-full bg-[#6ffbbe]/40 text-[#005236]">
                <span className="material-symbols-outlined text-lg">schedule</span>
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl text-[#006c49] font-mono font-bold">18.4</span>
              <span className="text-xs text-[#3d4a42] font-mono">Hours saved</span>
            </div>
            <p className="mt-1 text-xs text-[#3d4a42]">Equivalent to ~$3,680 billable accountant capacity</p>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-[#006c49] font-mono">
              <span className="material-symbols-outlined text-xs">verified</span>
              <span>Zero reconciliation discrepancies</span>
            </div>
          </div>
        </div>

        {/* Global Controls Bar */}
        <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-xl shadow-sm border border-[#eaedff] flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[280px]">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3d4a42] text-lg">search</span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#f2f3ff] text-[#131b2e] placeholder:text-[#3d4a42]/70 text-xs focus:outline-none focus:bg-white border border-transparent focus:border-[#6cf8bb] transition-all"
              placeholder="Filter by target GL, regex string, vendor, or account..."
              type="text"
            />
          </div>

          {/* Interactive Controls Group */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Confidence Threshold Slider */}
            <div className="flex items-center gap-3 bg-[#f2f3ff] px-4 py-2 rounded-full border border-[#eaedff]">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#006c49] text-base">tune</span>
                <label className="text-xs text-[#131b2e] uppercase tracking-wider font-semibold whitespace-nowrap">
                  Auto-Approve Threshold
                </label>
              </div>
              <input
                className="w-28 accent-[#006948] cursor-pointer"
                max="99"
                min="70"
                type="range"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
              />
              <span className="text-xs font-mono font-bold text-[#006c49] bg-white px-2 py-0.5 rounded-full shadow-xs border border-[#eaedff]">
                {threshold}%
              </span>
            </div>

            {/* Filter Tags */}
            <div className="hidden sm:flex items-center gap-1 bg-[#f2f3ff] p-1 rounded-full text-[#3d4a42] border border-[#eaedff]">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  filterType === 'all' ? 'bg-white text-[#131b2e] shadow-xs' : 'hover:text-[#131b2e]'
                }`}
              >
                All (48)
              </button>
              <button
                onClick={() => setFilterType('auto')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  filterType === 'auto' ? 'bg-white text-[#131b2e] shadow-xs' : 'hover:text-[#131b2e]'
                }`}
              >
                Auto-Approve (42)
              </button>
              <button
                onClick={() => setFilterType('review')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  filterType === 'review' ? 'bg-white text-[#131b2e] shadow-xs' : 'hover:text-[#131b2e]'
                }`}
              >
                Requires Review (6)
              </button>
            </div>

            {/* Create Rule CTA */}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#eaedff] hover:bg-[#dae2fd] text-[#131b2e] text-xs font-semibold transition-all"
            >
              <span className="material-symbols-outlined text-lg">add_circle</span>
              <span>Create New Rule</span>
            </button>
          </div>
        </div>

        {/* Main Workspace Layout: Rule Cards + Live Simulator Panel */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Rules Engine Management Stack (8 cols) */}
          <div className="xl:col-span-8 space-y-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2 text-xs text-[#3d4a42] uppercase tracking-wider">
                <span>Execution Priority Stack</span>
                <span>•</span>
                <span className="text-[#006c49] font-semibold">Deterministic FIFO Pipeline</span>
              </div>
              <span className="text-xs font-mono text-[#3d4a42]">5 of 48 Showing</span>
            </div>

            {defaultHeuristicRules.map((rule) => (
              <div
                key={rule.id}
                className={`group p-6 rounded-2xl bg-white/80 backdrop-blur-xl shadow-sm hover:shadow-md transition-all space-y-4 border ${
                  rule.isFlagged ? 'border-l-4 border-l-[#ba1a1a] border-[#eaedff]' : 'border-[#eaedff]'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-4">
                    <span className="font-mono text-xs text-[#3d4a42] bg-[#f2f3ff] w-7 h-7 rounded-full flex items-center justify-center font-bold">
                      {rule.id}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base text-[#131b2e] font-semibold">{rule.title}</h3>
                        {rule.verified && (
                          <span className="material-symbols-outlined text-[#006c49] text-sm" title="Gemini Vector Matched">
                            verified
                          </span>
                        )}
                        {rule.directVendor && (
                          <span className="px-2 py-0.5 rounded-full bg-[#f2f3ff] text-[#3d4a42] text-[10px] uppercase font-semibold">
                            Direct Vendor
                          </span>
                        )}
                        {rule.isSplit && (
                          <span className="px-2 py-0.5 rounded-full bg-[#85f8c4] text-[#005137] text-[10px] uppercase font-bold">
                            Split Journal
                          </span>
                        )}
                        {rule.liabilityOffset && (
                          <span className="px-2 py-0.5 rounded-full bg-[#f2f3ff] text-[#3d4a42] text-[10px] uppercase font-semibold">
                            Liability Offset
                          </span>
                        )}
                        {rule.isFlagged && (
                          <span className="px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] text-[10px] uppercase font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a]" />
                            Requires Controller Approval
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#3d4a42] mt-0.5">{rule.desc}</p>
                    </div>
                  </div>

                  {/* Auto-Approve Toggle & Matches */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="font-mono text-xs font-bold text-[#131b2e]">{rule.matchesMTD}</span>
                      <span className="text-[10px] text-[#3d4a42] uppercase block">
                        {rule.isFlagged ? 'Requires Review' : 'Matches MTD'}
                      </span>
                    </div>
                    <div className={`flex items-center gap-2 bg-[#f2f3ff] px-3 py-1.5 rounded-full border border-[#eaedff] ${rule.isFlagged ? 'opacity-70' : ''}`}>
                      <span className="text-xs font-semibold text-[#006c49]">Auto-Approve</span>
                      <button
                        type="button"
                        aria-label="Toggle auto-approve"
                        className={`w-10 h-5 rounded-full relative p-0.5 transition-colors focus:outline-none ${
                          rule.autoApprove ? 'bg-[#006948]' : 'bg-[#bccac0]'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full shadow-sm transition-transform ${
                            rule.autoApprove ? 'bg-white ml-auto' : 'bg-white'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Heuristic Condition Matrix */}
                <div className="p-4 rounded-xl bg-[#f2f3ff]/70 space-y-2 text-xs border border-[#eaedff]/60">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#e2e7ff] text-[#3d4a42] font-mono text-[11px] font-bold uppercase tracking-wider">
                      IF
                    </span>
                    <span className="text-[#131b2e] font-medium">{rule.condition}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-white text-[#006c49] font-mono text-xs font-semibold shadow-xs border border-[#eaedff]">
                      {rule.conditionVal}
                    </span>
                    {rule.andCondition && (
                      <>
                        <span className="px-2 py-0.5 rounded bg-[#e2e7ff] text-[#3d4a42] font-mono text-[11px] font-bold uppercase tracking-wider">
                          AND
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-white text-[#131b2e] font-mono text-xs font-semibold shadow-xs border border-[#eaedff]">
                          {rule.andCondition}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span
                      className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold uppercase tracking-wider ${
                        rule.isFlagged
                          ? 'bg-[#ffdad6] text-[#93000a]'
                          : rule.isSplit
                          ? 'bg-[#006948] text-white'
                          : 'bg-[#006948] text-white'
                      }`}
                    >
                      {rule.isFlagged ? 'THEN HOLD' : rule.isSplit ? 'THEN SPLIT' : 'THEN'}
                    </span>
                    <span className="text-[#131b2e] font-medium">
                      {rule.isFlagged ? 'Categorize provisionally to:' : rule.isSplit ? 'Debit' : 'Book to GL:'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#dae2fd] text-[#131b2e] font-mono text-xs font-bold shadow-xs">
                      {rule.targetGL}
                    </span>
                    {rule.splitTargetGL && (
                      <>
                        <span className="text-[#131b2e] font-medium">AND Debit</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#dae2fd] text-[#131b2e] font-mono text-xs font-bold shadow-xs">
                          {rule.splitTargetGL}
                        </span>
                      </>
                    )}
                    {rule.tag && (
                      <>
                        <span className="text-[#3d4a42]">•</span>
                        <span className="text-[#131b2e] font-medium">Attach Tag:</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#6cf8bb]/50 text-[#00714d] text-xs font-semibold">
                          {rule.tag}
                        </span>
                      </>
                    )}
                    {rule.routeText && (
                      <>
                        <span className="text-[#3d4a42]">•</span>
                        <span className="font-semibold text-[#ba1a1a] text-xs">{rule.routeText}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-[#3d4a42] pt-1">
                  <span className={`flex items-center gap-1 font-mono text-[11px] ${rule.isFlagged ? 'text-[#ba1a1a]' : ''}`}>
                    <span className={`material-symbols-outlined text-xs ${rule.isFlagged ? 'text-[#ba1a1a]' : 'text-[#006c49]'}`}>
                      {rule.isFlagged ? 'flag' : 'check_circle'}
                    </span>
                    {rule.statusText}
                  </span>
                  <div className="flex items-center gap-3">
                    <button className="hover:text-[#006948] font-semibold transition-colors">Audit Run History</button>
                    <button className="hover:text-[#006948] font-semibold transition-colors">Edit Heuristic</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Live Feed Test Simulator & Execution Radar (4 cols) */}
          <div className="xl:col-span-4 space-y-4 sticky top-20">
            {/* Live Heuristic Simulator Card */}
            <div className="p-6 rounded-2xl bg-white/90 backdrop-blur-2xl shadow-md border border-[#eaedff] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#006c49] animate-ping" />
                  <h2 className="text-base text-[#131b2e] font-bold">Rule Test Simulator</h2>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#e2e7ff] text-[#3d4a42] uppercase tracking-wider font-semibold">
                  Interactive Sandbox
                </span>
              </div>
              <p className="text-xs text-[#3d4a42]">
                Paste an unformatted raw bank transaction or wire line item to simulate rule tree resolution and Gemini 2.5 confidence scoring.
              </p>

              {/* Input Sandbox Form */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#3d4a42] mb-1 font-semibold">
                    Raw Transaction Payload
                  </label>
                  <textarea
                    value={simText}
                    onChange={(e) => setSimText(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#f2f3ff] text-[#131b2e] font-mono text-xs focus:outline-none focus:bg-white border border-transparent focus:border-[#6cf8bb] transition-all"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#3d4a42] mb-1 font-semibold">
                      Amount ($ USD)
                    </label>
                    <input
                      value={simAmount}
                      onChange={(e) => setSimAmount(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-[#f2f3ff] font-mono text-xs text-[#131b2e] focus:outline-none border border-transparent focus:border-[#6cf8bb]"
                      type="text"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#3d4a42] mb-1 font-semibold">
                      Source Account
                    </label>
                    <select
                      value={simAccount}
                      onChange={(e) => setSimAccount(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-[#f2f3ff] font-mono text-xs text-[#131b2e] focus:outline-none border border-transparent focus:border-[#6cf8bb]"
                    >
                      <option>Brex Operating (..8821)</option>
                      <option>SVB Checking (..4011)</option>
                      <option>Mercury Treasury (..0933)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-1 flex gap-2">
                  <button
                    onClick={handleSimulate}
                    disabled={isSimulating}
                    className="flex-1 py-2 rounded-full bg-[#006948] hover:bg-[#00855d] text-white text-xs font-semibold shadow-[0_4px_14px_0_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <span className={`material-symbols-outlined text-base ${isSimulating ? 'animate-spin' : ''}`}>
                      {isSimulating ? 'sync' : 'play_arrow'}
                    </span>
                    <span>{isSimulating ? 'Evaluating...' : 'Evaluate Heuristic'}</span>
                  </button>
                  <button
                    onClick={handleSampleClick}
                    className="px-4 py-2 rounded-full bg-[#eaedff] hover:bg-[#dae2fd] text-[#131b2e] text-xs font-semibold transition-colors"
                  >
                    Sample
                  </button>
                </div>
              </div>

              {/* Evaluation Result Card */}
              <div className="p-4 rounded-xl bg-[#f2f3ff]/90 space-y-3 border border-[#eaedff]">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-[#006c49] font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">verified_user</span>
                    Match Identified
                  </span>
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-[#6cf8bb]/60 text-[#00714d] font-bold">
                    {simResult.confidence} Match
                  </span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#3d4a42] font-medium">Triggered Rule:</span>
                    <span className="font-semibold text-[#131b2e]">{simResult.matchedRule}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#3d4a42] font-medium">Target GL Category:</span>
                    <span className="font-mono text-[#131b2e] font-bold">{simResult.targetGL}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#3d4a42] font-medium">Decision:</span>
                    <span className="font-semibold text-[#006c49] flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">check</span>
                      {simResult.decision}
                    </span>
                  </div>
                </div>

                {/* Gemini Vector Heuristic Insight */}
                <div className="p-2.5 rounded-lg bg-white/80 border border-[#eaedff] text-[11px] text-[#3d4a42] space-y-1">
                  <div className="flex items-center justify-between font-semibold text-[#131b2e]">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs text-[#006948]">psychology</span>
                      Gemini Heuristic Trace
                    </span>
                    <span className="font-mono text-[10px]">Latency: {simResult.latency}</span>
                  </div>
                  <p className="leading-relaxed">{simResult.trace}</p>
                </div>
              </div>
            </div>

            {/* Heuristic Pipeline Health & Stats Widget */}
            <div className="p-6 rounded-2xl bg-white/70 backdrop-blur-xl shadow-sm border border-[#eaedff] space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-base text-[#131b2e] font-semibold">Engine Precision</h4>
                <span className="font-mono text-xs text-[#006c49] font-semibold">99.98% True Positives</span>
              </div>

              {/* Inline Distribution Visualizer */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-[#3d4a42]">
                  <span>Categorization Pipeline Split</span>
                  <span className="font-mono">MTD 1,842 Trans</span>
                </div>
                <div className="h-3 w-full bg-[#eaedff] rounded-full overflow-hidden flex gap-0.5">
                  <div className="bg-[#006948] h-full" style={{ width: '82%' }} title="Auto-Approved (82%)" />
                  <div className="bg-[#4edea3] h-full" style={{ width: '12%' }} title="Rule Fallback (12%)" />
                  <div className="bg-[#d2d9f4] h-full" style={{ width: '6%' }} title="Manual Review (6%)" />
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-[#3d4a42]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#006948]" />
                    <span>Direct Rule (82%)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#4edea3]" />
                    <span>LLM Heuristic (12%)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#d2d9f4]" />
                    <span>Flagged (6%)</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#f2f3ff] flex items-center gap-3 border border-[#eaedff]">
                <span className="material-symbols-outlined text-[#006c49] text-xl">security_update_good</span>
                <div className="text-xs">
                  <p className="font-semibold text-[#131b2e]">Audit Trail Sealed</p>
                  <p className="text-[#3d4a42]">All 1,842 matches write cryptographic SHA-256 logs for SOC2 compliance.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Create New Rule */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-[#eaedff] space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#eaedff] pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006948]">smart_toy</span>
                <h3 className="text-base font-bold text-[#131b2e]">Create Heuristic Categorization Rule</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-full hover:bg-[#f2f3ff] text-[#3d4a42]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateRuleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#131b2e] mb-1">Rule Name</label>
                <input
                  required
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                  placeholder="e.g. GitHub Enterprise Seat Licensing"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#f2f3ff] border border-[#eaedff] text-[#131b2e] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#131b2e] mb-1">Condition Regex / String</label>
                <input
                  required
                  value={newRuleCondition}
                  onChange={(e) => setNewRuleCondition(e.target.value)}
                  placeholder="e.g. /(github|copilot)/i"
                  className="w-full px-3 py-2 font-mono text-xs rounded-xl bg-[#f2f3ff] border border-[#eaedff] text-[#131b2e] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#131b2e] mb-1">Target GL Category</label>
                  <select
                    value={newRuleTargetGL}
                    onChange={(e) => setNewRuleTargetGL(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#f2f3ff] border border-[#eaedff] text-[#131b2e] focus:bg-white focus:outline-none"
                  >
                    <option>#6020 Software & SaaS</option>
                    <option>#5010 Cloud Inference Compute</option>
                    <option>#6010 Payroll & Benefits</option>
                    <option>#6050 Legal & Corporate Governance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#131b2e] mb-1">Tag</label>
                  <input
                    value={newRuleTag}
                    onChange={(e) => setNewRuleTag(e.target.value)}
                    placeholder="e.g. AI Infra"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#f2f3ff] border border-[#eaedff] text-[#131b2e] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#6cf8bb]/20 border border-[#6cf8bb]/40 text-xs text-[#005137] flex items-start gap-2">
                <span className="material-symbols-outlined text-sm mt-0.5">verified</span>
                <span>
                  Rules created here will be checked first before Gemini 2.5 Flash semantic classification kicks in.
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-[#3d4a42] hover:bg-[#f2f3ff]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#006948] hover:bg-[#00855d] text-white text-xs font-semibold shadow-sm"
                >
                  Save & Activate Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
