# AccAI — Autonomous Accounting & General Ledger Platform

> An AI-native autonomous general ledger and financial intelligence platform inspired by Digits AI and modern cloud accounting infrastructure. Styled with high-precision frosted glass aesthetics, emerald botanical gradients, and real-time dual-entry accounting mechanics.

---

## ⚡ Live Features

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
