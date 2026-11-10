# AccAI — Autonomous Accounting & General Ledger Platform
### *The Hybrid of Digits AI & HisabKitab for Indian Companies*

> An AI-native autonomous general ledger, tax compliance, and financial intelligence platform designed to capture the best of **Silicon Valley's autonomous GL intelligence (Digits AI)** and **India's statutory tax & business compliance ecosystem (HisabKitab)**. Styled with high-precision frosted glass aesthetics, emerald botanical gradients, real-time dual-entry accounting mechanics, and complete Indian GST/TDS/Tally compliance.

---

## 🇮🇳 Indian Compliance & HisabKitab Hybrid Features

### 1. 🛡️ Comprehensive GST & Tax Compliance Suite
- **GSTR-2B AI Input Tax Credit (ITC) Matcher**: Automates the matching of purchase bills against GSTN 2B portal data to eliminate ITC leakage and verify supplier filings.
- **GSTR-1 Outward Supplies Engine**: Table 4A (B2B Taxable), Table 6A (Zero-rated export), Table 12 (HSN Summary). Direct **1-Click Official JSON download** for `gst.gov.in` portal upload.
- **GSTR-3B Auto-Computation Return**: Table 3.1 outward liabilities, Table 4 eligible ITC, Table 6 payment of tax with electronic cash/credit ledger offsets.
- **NIC E-Invoicing (IRN) & Signed QR Codes**: Generates 64-character SHA-256 IRN hashes and official high-density signed QR codes for B2B invoices.
- **E-Way Bill Generation**: Part A & Part B vehicle number linkage (`KA-01-AB-1234`) for high-value logistics consignments.

### 2. 📑 TDS & Form 26Q Compliance Hub
- **Statutory Section Tracking**: Section 194J (10%/2% Tech & Professional), Section 194C (1%/2% Contractors), Section 194I (10%/2% Rent), Section 194Q.
- **Challan ITNS 281 Payment Generator**: Monthly BSR code tracking and tax payment slips.
- **Form 26Q Quarterly Return Export**: TRACES / NSDL RPU-compatible data export with 100% vendor PAN validation.
- **Vendor Form 16A Certificates**: Instant generation of quarterly TDS deduction certificates for vendors.

### 3. 🔄 Tally Prime & Indian CA Export Bridge
- **1-Click Tally XML Voucher Serialization**: Exports Payment, Receipt, Sales, and Purchase vouchers with exact TDL XML `<ENVELOPE>` tags. Chartered Accountants can import directly into Tally Prime 4.0/3.0 in seconds!
- **Schedule III Division II Balance Sheet**: Indian Companies Act 2013 compliant grouping for private limited companies and statutory audits.
- **Trial Balance CA Audit Pack**: Pre-formatted CSV/Excel audit pack ready for statutory auditors.

### 4. ⚡ Indian Invoicing, UPI & WhatsApp Rails
- **Dynamic UPI QR Codes**: Invoices feature instant scan-to-pay QR codes compatible with PhonePe, Google Pay, Paytm, and CRED.
- **1-Click WhatsApp Invoice Sharing**: Dispatches tax invoices directly via WhatsApp (`wa.me`) with pre-filled payment links and GST summaries.
- **HSN & SAC Code Catalog**: Built-in support for service accounting codes (e.g. `SAC 998314` for Cloud/AI, `SAC 998313` for Software Dev).
- **Dual Currency Switcher**: Instant global toggle between **INR (₹)** with Indian numbering (Lakhs & Crores) and **USD ($)**.

---

## ⚡ Core Autonomous Ledger Features (Digits AI Intelligence)

### 1. 📊 Interactive Chart of Accounts
- **6 GAAP Hierarchy Groups**: 1000 Assets, 2000 Liabilities, 3000 Equity, 4000 Revenue, 5000 COGS, 6000 Operating Expenses.
- **Top Financial Bento Strip**: Live total assets ($14.8M), liabilities ($1.2M), equity ($13.6M), revenue ($4.89M), and OPEX ($2.14M).
- **Drill-down Balance Tracking**: Real-time normal balance debits/credits indicators, sync status badges, and transaction logs.
- **Audit Bento Cards**: R&D tax credit opportunity radar, dual-entry equation verification, and rules engine routing metrics.

### 2. ⚡ Deterministic Heuristic Rules Engine v3.2
- **Rule Categorization Pipeline**: Priority ordering, active toggles, match counters, and condition badges (IF / AND / THEN).
- **Interactive Sandbox Simulator**: Live transaction evaluation simulator with instant match resolution, confidence percentage, and latency timing.

### 3. ⚖️ Real-Time Dual-Ledger Reconciliations
- **Proof-Balance Verification Strip**: Statement Balance minus Cleared Transactions equals live net variance ($0.00).
- **Cryptographic Seal & Lock**: SHA-256 hash sealing of cleared periods with instant lock status.
- **Dual-Ledger Inflow/Outflow Grids**: Matched vs unreconciled transaction view with inline match toggles.
- **Gemini Discrepancy Radar**: Automated detection of timing variances, unposted wires, and merchant discrepancies.

### 4. 🧾 Autonomous Bill Pay (AP)
- **Controller Spotlight Cards**: High-exposure vendor tracking (e.g. CoreWeave GPU clusters, Latham & Watkins).
- **Multi-vendor Disbursements Table**: Due dates, OCR sync statuses, dual-entry credit/debit posting, and one-click approvals.
- **Interactive Slide-Over Drawer**: Visual invoice inspection with Gemini 2.5 Flash OCR grounding, confidence scores, and line-item bounding boxes.

### 5. 🤖 Ask Digits AI (Gemini 2.5 Flash Integration)
- **Global `Cmd + K` / `Ctrl + K` Modal**: Conversational CFO assistant grounded in live financial state.
- **Real-Time Context**: Ingests cash balances, monthly burn rate, runway, unpaid bills, and recent transactions to answer complex financial queries.
- **Suggested Quick Actions**: One-click prompts for tax credits, runway forecasts, expense categorization, and reconciliation audits.

### 6. 📂 Financial Statements & Operations
- **Income Statement & Balance Sheet**: Dynamic aggregation with period-over-period variance metrics.
- **Accounts Receivable / Invoicing**: Invoice statuses, aging buckets, and quick payment reminders.
- **Month-End Close Checklist**: Audit trails, journal locking, and close milestone tracking.
- **Collapsible Workspace Sidebar**: Full-width table inspection mode with header toggle, floating reopen pill, and `Ctrl + B` shortcut.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Frosted Glassmorphism, Material Symbols, Lucide React
- **AI / LLM**: Google Gemini 2.5 Flash (Interactions & Grounded Financial Insights)
- **State Management**: React Context with LocalStorage persistence

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/rahulsamineni7/accai.git
cd accai
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Gemini API Key (Optional)
Create a `.env` file in the root directory:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```
*(The application includes a built-in fallback key so it works out of the box).*

### 4. Run local development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for production
```bash
npm run build
```

---

## 🌐 One-Click Deploy

### Deploy on Vercel
1. Import the repository `rahulsamineni7/accai` on [Vercel](https://vercel.com/new).
2. Framework preset: **Vite**.
3. (Optional) Add `VITE_GEMINI_API_KEY` under Environment Variables.
4. Click **Deploy**!

### Deploy on Netlify
1. Import repository on [Netlify](https://app.netlify.com/start).
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Click **Deploy**!

---

## 📄 License
MIT License. Built for demo and educational purposes.

