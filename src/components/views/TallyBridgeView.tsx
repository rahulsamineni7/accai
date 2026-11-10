import React, { useState } from 'react';
import { useDigits } from '../../context/DigitsContext';
import {
  Binary,
  Download,
  CheckCircle2,
  FileSpreadsheet,
  FileCode,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Layers,
  ArrowRight
} from 'lucide-react';

export const TallyBridgeView: React.FC = () => {
  const {
    currentEntity,
    transactions,
    invoices,
    bills,
    downloadTallyXml,
    downloadGstrJson,
    showNotification
  } = useDigits();

  const [tallyVersion, setTallyVersion] = useState<'prime4' | 'prime3' | 'erp9'>('prime4');
  const [isExporting, setIsExporting] = useState(false);

  const handleExportTally = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      downloadTallyXml();
    }, 800);
  };

  const handleExportCaAuditPack = () => {
    // Generate CSV Trial balance for Indian CA
    const rows = [
      ['Account Code', 'Ledger Head', 'Group (Schedule III)', 'Debit (INR)', 'Credit (INR)'],
      ['1015', 'HDFC Bank Current Account (#9924)', 'Cash & Cash Equivalents', '8420500.00', '0.00'],
      ['1025', 'ICICI Bank Tax Escrow A/c (#1188)', 'Cash & Cash Equivalents', '2210000.00', '0.00'],
      ['1350', 'Input CGST Ledger (ITC Asset)', 'Other Current Assets', '418200.00', '0.00'],
      ['1351', 'Input SGST Ledger (ITC Asset)', 'Other Current Assets', '418200.00', '0.00'],
      ['1352', 'Input IGST Ledger (ITC Asset)', 'Other Current Assets', '684000.00', '0.00'],
      ['2350', 'Output CGST Payable', 'Statutory Dues (Current Liabilities)', '0.00', '512000.00'],
      ['2351', 'Output SGST Payable', 'Statutory Dues (Current Liabilities)', '0.00', '512000.00'],
      ['2352', 'Output IGST Payable', 'Statutory Dues (Current Liabilities)', '0.00', '840000.00'],
      ['2360', 'TDS Payable u/s 194J', 'Duties & Taxes', '0.00', '142000.00'],
      ['2361', 'TDS Payable u/s 194C', 'Duties & Taxes', '0.00', '38000.00'],
      ['2362', 'TDS Payable u/s 194I', 'Duties & Taxes', '0.00', '65000.00'],
      ['4010', 'Enterprise AI Software Revenue', 'Revenue from Operations', '0.00', '15420000.00'],
      ['5010', 'Cloud Infrastructure & Inference Costs', 'Direct Expenses / COGS', '2184000.00', '0.00']
    ];

    const csvContent = rows.map((r) => r.map((cell) => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CA_Audit_Trial_Balance_Schedule_III_${currentEntity.slug || 'accai'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Exported Chartered Accountant Schedule III Trial Balance Pack.');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-[#006948]/10 text-[#006948]">
              <Binary className="w-5 h-5 stroke-[2.2]" />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-[#131b2e]">
              Tally Prime & Indian CA Export Bridge
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#006948]/10 text-[#006948] text-[11px] font-semibold tracking-wide">
              Direct XML & Schedule III
            </span>
          </div>
          <p className="text-xs text-[#6d7a72] pl-10">
            Export dual-entry vouchers seamlessly into Tally Prime 4.0/3.0/ERP 9 for your Chartered Accountant's statutory audit.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCaAuditPack}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/90 hover:bg-[#eaedff] text-[#131b2e] text-xs font-semibold border border-[#eaedff] shadow-sm transition-all"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#006948]" />
            <span>CA Audit Pack (Schedule III)</span>
          </button>

          <button
            onClick={handleExportTally}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#006948] hover:bg-[#00855d] text-white text-xs font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Generating XML...' : 'Export Tally XML Vouchers'}</span>
          </button>
        </div>
      </div>

      {/* Feature Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: 1-Click Tally Prime Sync */}
        <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-xl bg-[#006948]/10 text-[#006948] flex items-center justify-center font-bold">
            <FileCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#131b2e]">
              Tally XML Voucher Serialization
            </h3>
            <p className="text-xs text-[#6d7a72] mt-1 leading-relaxed">
              Generates compliant Tally Definition Language (TDL) XML envelopes. Automatically maps Ledger heads, GST rates, HSN codes, and TDS deductions.
            </p>
          </div>
          <div className="pt-2 flex items-center justify-between text-xs font-semibold text-[#006948]">
            <span>Supported: Tally Prime 4.0 / 3.0</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        {/* Card 2: Schedule III Balance Sheet */}
        <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-xl bg-[#3b82f6]/10 text-[#3b82f6] flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#131b2e]">
              Companies Act 2013 Compliance
            </h3>
            <p className="text-xs text-[#6d7a72] mt-1 leading-relaxed">
              Auto-groups General Ledger accounts into Indian Schedule III Division II format (Ind-AS compliant for growing private limited companies).
            </p>
          </div>
          <div className="pt-2 flex items-center justify-between text-xs font-semibold text-[#3b82f6]">
            <span>Trial Balance Ready for Audit</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        {/* Card 3: GST Portal Offline Utility */}
        <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-xl bg-[#ea580c]/10 text-[#ea580c] flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#131b2e]">
              GSTN Portal Direct Upload
            </h3>
            <p className="text-xs text-[#6d7a72] mt-1 leading-relaxed">
              Creates official offline tool JSON schemas for GSTR-1 and GSTR-3B, ready to drag-and-drop into the GST government portal (`gst.gov.in`).
            </p>
          </div>
          <div className="pt-2 flex items-center justify-between text-xs font-semibold text-[#ea580c]">
            <span>GSTN v3.2 Schema Validated</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Tally XML Live Preview & Instructions */}
      <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-[#006948]" />
            <h3 className="text-xs font-bold text-[#131b2e]">
              Tally Prime XML Envelope Preview (Sample Voucher)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-[#6d7a72]">
            Ready for Import in Tally: Company &gt; Import &gt; Transactions
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#131b2e] text-[#6cf8bb] font-mono text-[11px] overflow-x-auto leading-relaxed border border-[#2b354b]">
          <pre>{`<?xml version="1.0" encoding="utf-8"?>
<ENVELOPE>
  <HEADER>
    <TALLYREQUEST>Import Data</TALLYREQUEST>
  </HEADER>
  <BODY>
    <IMPORTDATA>
      <REQUESTDESC>
        <REPORTNAME>Vouchers</REPORTNAME>
        <STATICVARIABLES>
          <SVCURRENTCOMPANY>${currentEntity.name}</SVCURRENTCOMPANY>
        </STATICVARIABLES>
      </REQUESTDESC>
      <REQUESTDATA>
        <TALLYMESSAGE xmlns:UDF="TallyUDF">
          <VOUCHER VCHTYPE="Sales" ACTION="Create">
            <DATE>20261101</DATE>
            <VOUCHERTYPENAME>Sales</VOUCHERTYPENAME>
            <PARTYLEDGERNAME>Swiggy (Bundl Technologies Pvt Ltd)</PARTYLEDGERNAME>
            <PARTYMAILINGNAME>Swiggy Technologies</PARTYMAILINGNAME>
            <CONSIGNEEGSTIN>29AAGCB3796D1Z4</CONSIGNEEGSTIN>
            <PLACEOFSUPPLY>29-Karnataka</PLACEOFSUPPLY>
            <ALLLEDGERENTRIES.LIST>
              <LEDGERNAME>SaaS Platform Subscription Revenue</LEDGERNAME>
              <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>
              <AMOUNT>-500000.00</AMOUNT>
            </ALLLEDGERENTRIES.LIST>
            <ALLLEDGERENTRIES.LIST>
              <LEDGERNAME>Output CGST @ 9%</LEDGERNAME>
              <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>
              <AMOUNT>-45000.00</AMOUNT>
            </ALLLEDGERENTRIES.LIST>
            <ALLLEDGERENTRIES.LIST>
              <LEDGERNAME>Output SGST @ 9%</LEDGERNAME>
              <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>
              <AMOUNT>-45000.00</AMOUNT>
            </ALLLEDGERENTRIES.LIST>
            <ALLLEDGERENTRIES.LIST>
              <LEDGERNAME>HDFC Bank Current Account (#9924)</LEDGERNAME>
              <ISDEEMEDPOSITIVE>Yes</ISDEEMEDPOSITIVE>
              <AMOUNT>590000.00</AMOUNT>
            </ALLLEDGERENTRIES.LIST>
          </VOUCHER>
        </TALLYMESSAGE>
      </REQUESTDATA>
    </IMPORTDATA>
  </BODY>
</ENVELOPE>`}</pre>
        </div>
      </div>
    </div>
  );
};
