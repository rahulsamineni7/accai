import React, { useState, useRef } from 'react';
import {
  Sparkles,
  ArrowRight,
  UploadCloud,
  FileText,
  CheckCircle2,
  Download,
  Building2,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  Receipt,
  FileCheck,
  Zap,
  Check,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  MessageCircle,
  Clock,
  ExternalLink,
  FileSpreadsheet
} from 'lucide-react';
import { useDigits } from '../context/DigitsContext';
import { parseExcelOrCsv } from '../utils/excelParser';

interface FinBooksLandingProps {
  onLaunchApp: () => void;
}

interface SampleDoc {
  id: string;
  name: string;
  type: string;
  vendor: string;
  gstin: string;
  taxable: number;
  tax: number;
  taxRate: string;
  total: number;
  category: string;
  glAccount: string;
  confidence: number;
  matchedBankLine: string;
}

const SAMPLE_DOCS: SampleDoc[] = [
  {
    id: 'sample-1',
    name: 'AWS_India_Oct2026.pdf',
    type: 'Vendor Bill',
    vendor: 'Amazon Web Services India Pvt Ltd',
    gstin: '29AABCA1234F1Z8',
    taxable: 42500,
    tax: 7650,
    taxRate: '18% IGST',
    total: 50150,
    category: 'Cloud Infrastructure & Hosting',
    glAccount: '5010 - Direct Infrastructure Cost',
    confidence: 99.4,
    matchedBankLine: 'HDFC BANK - NEFT / AWS CLOUD SERVICES / REF #9482710482'
  },
  {
    id: 'sample-2',
    name: 'HDFC_Statement_Oct2026.pdf',
    type: 'Bank Statement',
    vendor: 'HDFC Current Account (..4912)',
    gstin: '29AAACH2702H1ZQ',
    taxable: 185000,
    tax: 0,
    taxRate: 'N/A (Bank Feed)',
    total: 185000,
    category: 'Operating Cash & Inflow',
    glAccount: '1010 - Operating Bank Account',
    confidence: 99.8,
    matchedBankLine: 'NEFT CR - CLIENT RETAINER SAAS - TECH SOLUTIONS LLP'
  },
  {
    id: 'sample-3',
    name: 'Swiggy_Team_Dinner_Bill.png',
    type: 'Receipt',
    vendor: 'Bundl Technologies Pvt Ltd (Swiggy)',
    gstin: '29AAGCB3796D1Z4',
    taxable: 4200,
    tax: 210,
    taxRate: '5% CGST+SGST',
    total: 4410,
    category: 'Employee Welfare & Team Dining',
    glAccount: '6020 - Meals & Entertainment',
    confidence: 97.6,
    matchedBankLine: 'UPI / SWIGGY BANGALORE / UPI-REF-4928172948'
  },
  {
    id: 'sample-4',
    name: 'Razorpay_Settlement_1026.csv',
    type: 'Payment Gateway',
    vendor: 'Razorpay Software Private Limited',
    gstin: '29AADCR3847J1ZV',
    taxable: 12400,
    tax: 2232,
    taxRate: '18% IGST',
    total: 14632,
    category: 'Payment Processing Fees',
    glAccount: '6040 - Bank & Payment Gateway Fees',
    confidence: 98.9,
    matchedBankLine: 'RAZORPAY NODAL - DAILY SETTLEMENT NET TRANSFERS'
  }
];

export const FinBooksLanding: React.FC<FinBooksLandingProps> = ({ onLaunchApp }) => {
  const { downloadTallyXml, addTransaction, showNotification } = useDigits();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Interactive Live Document Sandbox State
  const [selectedDoc, setSelectedDoc] = useState<SampleDoc>(SAMPLE_DOCS[0]);
  const [processingStep, setProcessingStep] = useState<number>(4);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isPosted, setIsPosted] = useState<boolean>(false);

  // Pricing State
  const [pricingTarget, setPricingTarget] = useState<'business' | 'ca'>('business');
  const [isYearly, setIsYearly] = useState<boolean>(true);

  // FAQ State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSelectDoc = (doc: SampleDoc) => {
    setSelectedDoc(doc);
    setIsProcessing(true);
    setIsPosted(false);
    setProcessingStep(1);

    setTimeout(() => setProcessingStep(2), 500);
    setTimeout(() => setProcessingStep(3), 1000);
    setTimeout(() => {
      setProcessingStep(4);
      setIsProcessing(false);
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setProcessingStep(1);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const buffer = evt.target?.result as ArrayBuffer;
        const result = parseExcelOrCsv(buffer, file.name);

        if (result.transactions.length > 0) {
          const firstTx = result.transactions[0];
          const newDoc: SampleDoc = {
            id: `upload-${Date.now()}`,
            name: file.name,
            type: file.name.endsWith('.xlsx') || file.name.endsWith('.xls') ? 'Excel Workbook' : 'CSV Statement',
            vendor: firstTx.merchant,
            gstin: '29AAACH2702H1ZQ',
            taxable: Math.abs(firstTx.amount),
            tax: Math.round(Math.abs(firstTx.amount) * 0.18),
            taxRate: '18% GST',
            total: Math.abs(firstTx.amount),
            category: firstTx.category,
            glAccount: `${firstTx.glAccountCode} - ${firstTx.category}`,
            confidence: 99.4,
            matchedBankLine: firstTx.description
          };

          // Also inject all transactions into ledger
          result.transactions.forEach((tx) => addTransaction(tx));

          handleSelectDoc(newDoc);
          showNotification(`Successfully extracted ${result.transactions.length} rows from ${file.name}!`);
        } else {
          showNotification(`Parsed ${file.name}`);
        }
      } catch (err) {
        console.error('File parsing error:', err);
        showNotification('Failed to parse file. Please upload a valid .xlsx or .csv.');
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handlePostToBooks = () => {
    addTransaction({
      date: '2026-10-24',
      merchant: selectedDoc.vendor,
      description: `${selectedDoc.name} - Extracted via FinBooks OCR`,
      amount: -selectedDoc.total,
      category: selectedDoc.category,
      account: 'Operating Cash',
      status: 'Categorized',
      notes: 'FinBooks Vision OCR',
      glAccountCode: selectedDoc.glAccount.split(' - ')[0],
      aiConfidence: Math.round(selectedDoc.confidence)
    });
    setIsPosted(true);
  };

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION                                                           */}
      {/* ========================================================================= */}
      <section className="w-full pt-10 pb-16 px-4 sm:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        
        {/* Subtle pill tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill-green text-xs font-semibold tracking-wider uppercase mb-6 animate-in fade-in duration-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>BUILT FOR INDIAN BUSINESSES &amp; CA TEAMS</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6 max-w-4xl">
          Your AI-native <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0d9467] via-[#059669] to-[#047857]">
            Business Finance
          </span> <br className="hidden sm:inline" />
          Operating System
        </h1>

        {/* Hero Subtitle */}
        <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mb-8">
          Less time on paperwork. More clarity on your business.<br className="hidden sm:inline" />
          Upload your statements and invoices, FinBooks handles the categorizing, matching, and reconciliation.
        </p>

        {/* Hero CTA Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 mb-14">
          <button
            onClick={onLaunchApp}
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#0d9467] hover:bg-[#0b7a54] text-white font-semibold text-sm shadow-xl shadow-emerald-700/25 hover:shadow-2xl hover:shadow-emerald-700/35 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2.5"
          >
            <span>Start Free Trial</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <a
            href="#how-it-works"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full glass-surface text-slate-800 font-semibold text-sm hover:bg-white hover:text-emerald-700 transition-all flex items-center justify-center gap-2"
          >
            <span>See How it Works</span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </a>
        </div>

        {/* Live Counter Badges (Matching finbooks.ai real data) */}
        <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card rounded-2xl p-4 sm:p-5 flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-num">12.2k+</span>
            <span className="text-xs font-medium text-slate-500 mt-1">Documents processed</span>
          </div>

          <div className="glass-card rounded-2xl p-4 sm:p-5 flex flex-col items-center border-emerald-500/20 bg-emerald-50/40">
            <span className="text-2xl sm:text-3xl font-black text-[#0d9467] font-num">162+</span>
            <span className="text-xs font-medium text-slate-600 mt-1">Businesses &amp; CA firms</span>
          </div>

          <div className="glass-card rounded-2xl p-4 sm:p-5 flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-num">₹876.47cr+</span>
            <span className="text-xs font-medium text-slate-500 mt-1">Transaction value</span>
          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 2. THE "#how-it-works" INTERACTIVE PIPELINE                               */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="w-full py-20 px-4 sm:px-8 bg-gradient-to-b from-transparent via-emerald-50/30 to-transparent">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          
          {/* Section Header */}
          <div className="text-center mb-12">
            <span className="text-xs font-bold tracking-widest text-[#0d9467] uppercase mb-2 inline-block">
              FROM PAPERWORK TO PEACE OF MIND
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Upload documents. Get clean books.
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto">
              Less manual entry. FinBooks agents handle the finance workflow.
            </p>
          </div>

          {/* 4 Process Steps Ribbon */}
          <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
            {[
              { num: '1', title: 'Upload your documents', desc: 'Statements, invoices, receipts' },
              { num: '2', title: 'Let AI do the heavy lifting', desc: 'Categorize, extract GST and match' },
              { num: '3', title: 'Review with confidence', desc: 'Ledger & GST stay current' },
              { num: '4', title: 'Share. Export. Done.', desc: 'Tally exports & CA sharing' },
            ].map((step, idx) => (
              <div
                key={step.num}
                className={`glass-card rounded-2xl p-5 text-left relative transition-all ${
                  processingStep >= idx + 1 ? 'border-emerald-500/40 bg-white/90 shadow-md' : 'opacity-70'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`w-8 h-8 rounded-xl font-bold flex items-center justify-center text-sm font-num ${
                    processingStep >= idx + 1
                      ? 'bg-[#0d9467] text-white shadow-sm shadow-emerald-700/30'
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    {step.num}
                  </span>
                  {processingStep > idx + 1 && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                  {processingStep === idx + 1 && isProcessing && (
                    <RefreshCw className="w-4 h-4 text-emerald-600 animate-spin" />
                  )}
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">{step.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Interactive Document Processor Sandbox */}
          <div className="w-full max-w-5xl glass-surface rounded-3xl p-6 sm:p-8 border border-white/80 shadow-2xl relative overflow-hidden">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/60 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Interactive Ingestion Sandbox
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Select a preset document or upload your own Excel/CSV/PDF:
                </p>
              </div>

              {/* Sample Document Selectors & Upload */}
              <div className="flex flex-wrap items-center gap-2">
                {SAMPLE_DOCS.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => handleSelectDoc(doc)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      selectedDoc.id === doc.id
                        ? 'bg-[#0d9467] text-white shadow-sm'
                        : 'glass-pill text-slate-700 hover:bg-white'
                    }`}
                  >
                    {doc.name.replace('.pdf', '').replace('.png', '').replace('.csv', '')}
                  </button>
                ))}

                {/* Upload Test File Trigger */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".xlsx, .xls, .csv, .pdf"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-emerald-100/90 hover:bg-emerald-200 text-emerald-900 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm border border-emerald-300"
                >
                  <UploadCloud className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Upload Excel / File</span>
                </button>

                {/* Download Sample Excel Test File */}
                <a
                  href="/sample_bank_statement.xlsx"
                  download="FinBooks_Test_Data_HDFC_Bank_and_Bills.xlsx"
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
                  title="Download test Excel workbook with HDFC statement and GST bills"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Download Test Excel (.xlsx)</span>
                </a>
              </div>
            </div>

            {/* Live Visualizer Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Document Preview Left (Col 5) */}
              <div className="lg:col-span-5 glass-card-green rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-800/10 text-emerald-900 text-[11px] font-bold tracking-wide uppercase">
                      {selectedDoc.type}
                    </span>
                    <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Statutory Valid
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] text-emerald-800/70 font-semibold uppercase">Counterparty</span>
                      <h4 className="text-sm font-bold text-emerald-950 leading-snug">{selectedDoc.vendor}</h4>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-emerald-600/15">
                      <span className="text-emerald-800/80 font-medium">GSTIN</span>
                      <span className="font-num font-bold text-emerald-950 tracking-wider bg-white/70 px-2 py-0.5 rounded">
                        {selectedDoc.gstin}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-emerald-800/80 font-medium">Tax Slab</span>
                      <span className="font-semibold text-emerald-950">{selectedDoc.taxRate}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-emerald-800/80 font-medium">Taxable Base</span>
                      <span className="font-num font-semibold text-emerald-950">₹{selectedDoc.taxable.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-emerald-800/80 font-medium">GST Amount</span>
                      <span className="font-num font-semibold text-emerald-950">₹{selectedDoc.tax.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-emerald-600/20 flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-950">Total Invoice Amount</span>
                  <span className="text-lg font-black text-emerald-950 font-num">
                    ₹{selectedDoc.total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* AI Extraction & Posting Right (Col 7) */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                
                {/* AI Agents Processing Output */}
                <div className="glass-card rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                        <Zap className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">Autonomous General Ledger Mapping</span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full font-num">
                      {selectedDoc.confidence}% Match
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Target Ledger Code</span>
                      <span className="font-bold text-slate-800">{selectedDoc.glAccount}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Category</span>
                      <span className="font-bold text-slate-800">{selectedDoc.category}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                      <div className="text-[10px] text-slate-400 font-medium uppercase mb-0.5">Matched Bank Feed Narration</div>
                      <div className="font-mono text-[11px] text-slate-700 truncate">{selectedDoc.matchedBankLine}</div>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Controls */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    onClick={handlePostToBooks}
                    disabled={isPosted}
                    className={`flex-1 w-full py-3 px-5 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 ${
                      isPosted
                        ? 'bg-emerald-100 text-emerald-800 cursor-default'
                        : 'bg-[#0d9467] hover:bg-[#0b7a54] text-white shadow-md shadow-emerald-700/20'
                    }`}
                  >
                    {isPosted ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Posted to Double-Entry Ledger</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Approve &amp; Post to Books</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={downloadTallyXml}
                    title="Export all transactions as Tally Prime XML"
                    className="w-full sm:w-auto py-3 px-4 rounded-xl glass-card text-slate-700 hover:text-emerald-700 font-semibold text-xs border border-slate-200 hover:bg-white transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4 text-[#0d9467]" />
                    <span>Download Tally XML</span>
                  </button>

                  <button
                    onClick={onLaunchApp}
                    className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Open in App</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CORE FEATURES GRID                                                     */}
      {/* ========================================================================= */}
      <section id="features" className="w-full py-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs font-bold tracking-widest text-[#0d9467] uppercase mb-2 inline-block">
            SERVICES TO HELP YOUR BUSINESS GROW
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Accounting automation in action
          </h2>
          <p className="text-base text-slate-600 max-w-xl mx-auto">
            Everything an Indian business or CA firm needs to operate without paperwork friction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: TrendingUp,
              title: 'Financial Overview',
              desc: 'Real-time burn, runway, gross margin, and working capital waterfalls that drill down straight to the scanned vendor bill.'
            },
            {
              icon: RefreshCw,
              title: 'Bank Reconciliation',
              desc: 'Connect your Indian bank feeds (HDFC, ICICI, SBI, Razorpay). AI agents match statements to vouchers with 99%+ accuracy.'
            },
            {
              icon: ShieldCheck,
              title: 'GST-Ready Reports',
              desc: 'GSTR-1, GSTR-2B, and GSTR-3B summaries auto-prepared. Check Section 37(2)(g) MSME payment compliance and blocked ITC.'
            },
            {
              icon: Download,
              title: 'Tally Prime XML Export',
              desc: 'No duplicate data entry. Export complete double-entry voucher packs formatted for instant import into TallyPrime.'
            },
            {
              icon: Receipt,
              title: 'Invoicing & POS Billing',
              desc: 'Generate GST-compliant tax invoices with automatic E-Invoice QR/IRN codes, WhatsApp dispatch, and E-Way Bills.'
            },
            {
              icon: Building2,
              title: 'CA Practice Portal',
              desc: 'Multi-client workspace for Chartered Accountants. Automated ledger scrutiny, client health scores, and MCA audit trails.'
            }
          ].map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div key={i} className="glass-card rounded-2xl p-6 hover:shadow-lg transition-all border border-slate-200/60 group">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{feat.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. PRICING SECTION (Matching FinBooks.ai exact tiers)                    */}
      {/* ========================================================================= */}
      <section id="pricing" className="w-full py-20 px-4 sm:px-8 bg-gradient-to-b from-transparent via-emerald-50/40 to-transparent">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
          
          <span className="text-xs font-bold tracking-widest text-[#0d9467] uppercase mb-2 inline-block">
            PRICING
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Simple. Transparent. No surprises.
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto mb-8">
            No setup fees. Cancel anytime. Built in India, for India. Prices exclude 18% GST.
          </p>

          {/* Business vs CA Firm Switch */}
          <div className="glass-pill rounded-full p-1 flex items-center gap-1 mb-6 border border-slate-200">
            <button
              onClick={() => setPricingTarget('business')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                pricingTarget === 'business'
                  ? 'bg-[#0d9467] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              For Businesses
            </button>
            <button
              onClick={() => setPricingTarget('ca')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                pricingTarget === 'ca'
                  ? 'bg-[#0d9467] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              For CA Firms
            </button>
          </div>

          {/* Billing Cycle Switch */}
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-600 mb-12">
            <span className={!isYearly ? 'text-slate-900 font-bold' : ''}>Monthly</span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="w-12 h-6 rounded-full bg-[#0d9467] p-1 transition-all relative"
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-all ${
                  isYearly ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={isYearly ? 'text-slate-900 font-bold' : ''}>
              Yearly <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full ml-1">Pay for 10 mos, get 12</span>
            </span>
          </div>

          {/* Pricing Cards */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {pricingTarget === 'business' ? (
              <>
                {/* Starter */}
                <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-slate-200/80">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Starter</span>
                    <div className="mt-4 mb-2">
                      <span className="text-3xl font-extrabold text-slate-900 font-num">
                        {isYearly ? '₹4,990' : '₹499'}
                      </span>
                      <span className="text-xs text-slate-500">/{isYearly ? '12 months' : 'month'} + GST</span>
                    </div>
                    <p className="text-xs text-slate-500 mb-6">For freelancers and early-stage startups.</p>

                    <ul className="space-y-3 text-xs text-slate-700 mb-8">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>1 Business Entity</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>50 AI Uploads / month</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Bank statement reconciliation</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Tally Prime XML export</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={onLaunchApp}
                    className="w-full py-2.5 rounded-full glass-card hover:bg-white text-slate-800 font-semibold text-xs border border-slate-200 transition-all text-center"
                  >
                    Start Free Trial
                  </button>
                </div>

                {/* Growth (Featured) */}
                <div className="glass-card-green rounded-3xl p-6 sm:p-8 flex flex-col justify-between border-2 border-emerald-500 shadow-xl relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0d9467] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full">
                    Most Popular
                  </div>
                  <div>
                    <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">Growth</span>
                    <div className="mt-4 mb-2">
                      <span className="text-3xl font-extrabold text-emerald-950 font-num">
                        {isYearly ? '₹14,990' : '₹1,499'}
                      </span>
                      <span className="text-xs text-emerald-800">/{isYearly ? '12 months' : 'month'} + GST</span>
                    </div>
                    <p className="text-xs text-emerald-800/80 mb-6">For growing Indian SMEs &amp; private limiteds.</p>

                    <ul className="space-y-3 text-xs text-emerald-950 mb-8">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-700" />
                        <span className="font-semibold">3 Business Entities</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-700" />
                        <span>500 AI Uploads / month</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-700" />
                        <span>Automated GSTR-1 &amp; GSTR-2B matching</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-700" />
                        <span>MSME Section 37(2)(g) 45-day alerts</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-700" />
                        <span>Interactive AI CFO Assistant</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={onLaunchApp}
                    className="w-full py-2.5 rounded-full bg-[#0d9467] hover:bg-[#0b7a54] text-white font-semibold text-xs shadow-md shadow-emerald-700/25 transition-all text-center"
                  >
                    Start Free Trial
                  </button>
                </div>

                {/* Scale */}
                <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-slate-200/80">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Scale</span>
                    <div className="mt-4 mb-2">
                      <span className="text-3xl font-extrabold text-slate-900 font-num">
                        {isYearly ? '₹49,990' : '₹4,999'}
                      </span>
                      <span className="text-xs text-slate-500">/{isYearly ? '12 months' : 'month'} + GST</span>
                    </div>
                    <p className="text-xs text-slate-500 mb-6">For multi-branch &amp; high volume operations.</p>

                    <ul className="space-y-3 text-xs text-slate-700 mb-8">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Unlimited Business Entities</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Unlimited AI Uploads</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Dedicated Indian CA Support</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Custom ERP / Tally Integrations</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={onLaunchApp}
                    className="w-full py-2.5 rounded-full glass-card hover:bg-white text-slate-800 font-semibold text-xs border border-slate-200 transition-all text-center"
                  >
                    Contact Sales
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* CA Solo */}
                <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-slate-200/80">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">CA Solo</span>
                    <div className="mt-4 mb-2">
                      <span className="text-3xl font-extrabold text-slate-900 font-num">
                        {isYearly ? '₹14,990' : '₹1,499'}
                      </span>
                      <span className="text-xs text-slate-500">/{isYearly ? '12 months' : 'month'} + GST</span>
                    </div>
                    <p className="text-xs text-slate-500 mb-6">For independent practicing CAs.</p>
                    <ul className="space-y-3 text-xs text-slate-700 mb-8">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Up to 15 Client Entities</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Automated Ledger Scrutiny</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Batch Tally XML exports</span>
                      </li>
                    </ul>
                  </div>
                  <button onClick={onLaunchApp} className="w-full py-2.5 rounded-full glass-card text-xs font-semibold">
                    Start CA Trial
                  </button>
                </div>

                {/* CA Firm (Featured) */}
                <div className="glass-card-green rounded-3xl p-6 sm:p-8 flex flex-col justify-between border-2 border-emerald-500 shadow-xl relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0d9467] text-white text-[10px] font-bold uppercase px-3 py-0.5 rounded-full">
                    Recommended for Firms
                  </div>
                  <div>
                    <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">CA Firm</span>
                    <div className="mt-4 mb-2">
                      <span className="text-3xl font-extrabold text-emerald-950 font-num">
                        {isYearly ? '₹39,990' : '₹3,999'}
                      </span>
                      <span className="text-xs text-emerald-800">/{isYearly ? '12 months' : 'month'} + GST</span>
                    </div>
                    <p className="text-xs text-emerald-800/80 mb-6">For multi-partner chartered accountancy firms.</p>
                    <ul className="space-y-3 text-xs text-emerald-950 mb-8">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-700" />
                        <span className="font-semibold">Up to 60 Client Entities</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-700" />
                        <span>Article Assistant Review Inbox</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-700" />
                        <span>Automated GSTR-2B vs IMS Matcher</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-700" />
                        <span>MCA Rule 3(1) Audit Logs</span>
                      </li>
                    </ul>
                  </div>
                  <button onClick={onLaunchApp} className="w-full py-2.5 rounded-full bg-[#0d9467] text-white text-xs font-semibold">
                    Start Firm Trial
                  </button>
                </div>

                {/* CA Enterprise */}
                <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-slate-200/80">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">CA Enterprise</span>
                    <div className="mt-4 mb-2">
                      <span className="text-3xl font-extrabold text-slate-900 font-num">
                        {isYearly ? '₹69,990' : '₹6,999'}
                      </span>
                      <span className="text-xs text-slate-500">/{isYearly ? '12 months' : 'month'} + GST</span>
                    </div>
                    <p className="text-xs text-slate-500 mb-6">For large audit and tax advisory practices.</p>
                    <ul className="space-y-3 text-xs text-slate-700 mb-8">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Unlimited Client Companies</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>White-labeled Client Portal</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Custom API &amp; ERP Connectors</span>
                      </li>
                    </ul>
                  </div>
                  <button onClick={onLaunchApp} className="w-full py-2.5 rounded-full glass-card text-xs font-semibold">
                    Contact Practice Team
                  </button>
                </div>
              </>
            )}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. FAQ SECTION                                                            */}
      {/* ========================================================================= */}
      <section className="w-full py-16 px-4 sm:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs font-bold tracking-widest text-[#0d9467] uppercase mb-2 inline-block">
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Common questions about FinBooks
          </h2>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'How does FinBooks extract data from messy Indian bank statements and bills?',
              a: 'FinBooks uses specialized vision AI agents trained on Indian bank statement formats (HDFC, ICICI, SBI, Axis, Kotak) and GST invoice templates. It parses UPI strings, extracts vendor PAN/GSTIN, checks the Modulo-36 statutory checksum, and splits line items automatically.'
            },
            {
              q: 'Can I export transactions into TallyPrime without re-entering data?',
              a: 'Yes! FinBooks generates standard Tally XML voucher files. You can export receipts, payments, sales, and purchase entries in one click and import directly into TallyPrime with complete party and ledger master mapping.'
            },
            {
              q: 'Does FinBooks comply with Indian MCA audit trail rules?',
              a: 'Yes. FinBooks maintains an immutable, tamper-evident audit log with timestamps, user IDs, original values, and modified values for every journal entry, fully compliant with MCA Rule 3(1) and Section 128.'
            },
            {
              q: 'Can my Chartered Accountant access my books directly?',
              a: 'Absolutely. You can invite your CA with one click. They get dedicated CA scrutiny views, GSTR-2B vs IMS matching, MSME 45-day payment tracking, and bulk approval tools.'
            }
          ].map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="glass-card rounded-2xl p-5 border border-slate-200/60 transition-all">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left font-bold text-sm text-slate-900"
                >
                  <span>{item.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <p className="mt-3 text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. CLEAN FOOTER                                                           */}
      {/* ========================================================================= */}
      <footer className="w-full pt-16 pb-12 px-4 sm:px-8 border-t border-slate-200/70 bg-white/50 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-10">
          
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#0d9467] to-[#34d399] flex items-center justify-center text-white">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="text-base font-extrabold text-slate-900">
                Fin<span className="text-[#0d9467]">Books</span>.ai
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              AI-native accounting automation for Indian businesses and CA firms. Less paperwork, complete clarity.
            </p>
            <div className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp: +91 97041 07334</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs">
            <div>
              <h4 className="font-bold text-slate-900 mb-3">Product</h4>
              <ul className="space-y-2 text-slate-600">
                <li><a href="#how-it-works" className="hover:text-emerald-700">How it works</a></li>
                <li><a href="#features" className="hover:text-emerald-700">Features</a></li>
                <li><a href="#pricing" className="hover:text-emerald-700">Pricing</a></li>
                <li><button onClick={onLaunchApp} className="hover:text-emerald-700 text-left">Launch App</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-3">Compliance</h4>
              <ul className="space-y-2 text-slate-600">
                <li><span className="text-slate-500">GSTR-1 &amp; GSTR-2B</span></li>
                <li><span className="text-slate-500">TallyPrime XML Sync</span></li>
                <li><span className="text-slate-500">Section 37(2)(g) MSME</span></li>
                <li><span className="text-slate-500">MCA Rule 3(1) Trail</span></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-3">Company</h4>
              <ul className="space-y-2 text-slate-600">
                <li><span className="text-slate-500">About Klarfin</span></li>
                <li><span className="text-slate-500">Security &amp; InfoSec</span></li>
                <li><span className="text-slate-500">Privacy Policy</span></li>
                <li><span className="text-slate-500">Terms of Service</span></li>
              </ul>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-slate-200/50 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 Klarfin Technologies Private Limited. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Made with precision for India</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
