import { LegalEntity, ChartAccount, Transaction, CategorizationRule, Bill, Invoice, CloseTask, VaultDocument, Integration } from '../types';

export const initialLegalEntities: LegalEntity[] = [
  {
    id: 'le-1',
    name: 'Acme Technologies Inc.',
    slug: 'acme-tech',
    type: 'Delaware C-Corp',
    ein: '12-3456789',
    currency: 'USD ($)',
    fiscalYearEnd: 'December 31',
    accountingMethod: 'Accrual',
    isCurrent: true,
  },
  {
    id: 'le-2',
    name: 'Starlight Autonomous AI LLC',
    slug: 'starlight-ai',
    type: 'California LLC',
    ein: '98-7654321',
    currency: 'USD ($)',
    fiscalYearEnd: 'December 31',
    accountingMethod: 'Accrual',
    isCurrent: false,
  },
  {
    id: 'le-3',
    name: 'Vanguard Ventures Capital Ltd.',
    slug: 'vanguard-cap',
    type: 'Cayman Ltd',
    ein: '45-9871234',
    currency: 'USD ($)',
    fiscalYearEnd: 'December 31',
    accountingMethod: 'Cash',
    isCurrent: false,
  },
];

export const initialChartOfAccounts: ChartAccount[] = [
  // Assets (1000-1999)
  { id: 'coa-1010', code: '1010', name: 'Chase Operating Checking (#4819)', category: 'Asset', subcategory: 'Cash & Cash Equivalents', balance: 1142390.12, isSystem: true },
  { id: 'coa-1020', code: '1020', name: 'Mercury Treasury Yield Account (#9921)', category: 'Asset', subcategory: 'Cash & Cash Equivalents', balance: 340530.33, isSystem: true },
  { id: 'coa-1030', code: '1030', name: 'Stripe Clearing Account', category: 'Asset', subcategory: 'Cash & Cash Equivalents', balance: 24890.50, isSystem: true },
  { id: 'coa-1200', code: '1200', name: 'Accounts Receivable (A/R)', category: 'Asset', subcategory: 'Current Assets', balance: 84600.00 },
  { id: 'coa-1300', code: '1300', name: 'Prepaid Expenses & Software', category: 'Asset', subcategory: 'Current Assets', balance: 42100.00 },
  { id: 'coa-1500', code: '1500', name: 'Computer Equipment & Hardware', category: 'Asset', subcategory: 'Fixed Assets', balance: 78500.00 },
  { id: 'coa-1590', code: '1590', name: 'Accumulated Depreciation', category: 'Asset', subcategory: 'Fixed Assets', balance: -26400.00 },

  // Liabilities (2000-2999)
  { id: 'coa-2000', code: '2000', name: 'Accounts Payable (A/P)', category: 'Liability', subcategory: 'Current Liabilities', balance: 52400.00 },
  { id: 'coa-2100', code: '2100', name: 'Brex Corporate Card (#8842)', category: 'Liability', subcategory: 'Credit Cards', balance: 18950.40 },
  { id: 'coa-2200', code: '2200', name: 'Accrued Payroll & Benefits', category: 'Liability', subcategory: 'Current Liabilities', balance: 38200.00 },
  { id: 'coa-2400', code: '2400', name: 'Deferred Revenue (Annual Subscriptions)', category: 'Liability', subcategory: 'Current Liabilities', balance: 125000.00 },

  // Equity (3000-3999)
  { id: 'coa-3010', code: '3010', name: 'Common Stock ($0.0001 par value)', category: 'Equity', subcategory: 'Equity', balance: 1000.00, isSystem: true },
  { id: 'coa-3020', code: '3020', name: 'Additional Paid-in Capital (SAFEs / Series A)', category: 'Equity', subcategory: 'Equity', balance: 2500000.00, isSystem: true },
  { id: 'coa-3900', code: '3900', name: 'Retained Earnings', category: 'Equity', subcategory: 'Equity', balance: -1050539.45, isSystem: true },

  // Revenue (4000-4999)
  { id: 'coa-4010', code: '4010', name: 'SaaS Platform Subscription Revenue', category: 'Revenue', subcategory: 'Operating Revenue', balance: 1542000.00 },
  { id: 'coa-4020', code: '4020', name: 'Enterprise Custom Deployments', category: 'Revenue', subcategory: 'Operating Revenue', balance: 240000.00 },
  { id: 'coa-4030', code: '4030', name: 'API Usage & Token Overage Fees', category: 'Revenue', subcategory: 'Operating Revenue', balance: 68400.00 },

  // Cost of Goods Sold (5000-5999)
  { id: 'coa-5010', code: '5010', name: 'AWS Cloud Infrastructure & Compute', category: 'COGS', subcategory: 'Hosting & Infrastructure', balance: 218400.00 },
  { id: 'coa-5020', code: '5020', name: 'OpenAI API Token Costs', category: 'COGS', subcategory: 'AI & Inference Costs', balance: 94500.00 },
  { id: 'coa-5030', code: '5030', name: 'Payment Processing Fees (Stripe)', category: 'COGS', subcategory: 'Direct Costs', balance: 52100.00 },

  // Operating Expenses (6000-6999)
  { id: 'coa-6010', code: '6010', name: 'Salaries, Wages & Payroll Taxes', category: 'Expense', subcategory: 'Personnel', balance: 980000.00 },
  { id: 'coa-6020', code: '6020', name: 'Software, Tooling & SaaS Subscriptions', category: 'Expense', subcategory: 'Technology', balance: 142300.00 },
  { id: 'coa-6030', code: '6030', name: 'Legal, Accounting & Professional Fees', category: 'Expense', subcategory: 'General & Administrative', balance: 64200.00 },
  { id: 'coa-6040', code: '6040', name: 'Marketing, Growth & Paid Acquisition', category: 'Expense', subcategory: 'Sales & Marketing', balance: 88400.00 },
  { id: 'coa-6050', code: '6050', name: 'Office Rent & WeWork Facilities', category: 'Expense', subcategory: 'Facilities', balance: 58000.00 },
  { id: 'coa-6060', code: '6060', name: 'Travel, Meals & Team Offsites', category: 'Expense', subcategory: 'General & Administrative', balance: 31200.00 }
];

export const initialTransactions: Transaction[] = [
  {
    id: 'tx-101',
    date: '2026-11-08',
    description: 'Amazon Web Services AWS.amazon.com WA',
    merchant: 'Amazon Web Services',
    amount: -18420.50,
    account: 'Chase Operating (#4819)',
    category: 'AWS Cloud Infrastructure & Compute',
    glAccountCode: '5010',
    status: 'Categorized',
    aiConfidence: 99,
    aiModel: 'AGL-Autonomous v4',
    ruleMatched: 'Rule #1: AWS Hosting Pattern',
    receiptUrl: 'aws-invoice-oct2026.pdf',
    notes: 'US-East cluster GPU compute + S3 buckets'
  },
  {
    id: 'tx-102',
    date: '2026-11-07',
    description: 'STRIPE PAYOUT TRANSFER STRIPE.COM CA',
    merchant: 'Stripe Inc.',
    amount: 42180.00,
    account: 'Chase Operating (#4819)',
    category: 'SaaS Platform Subscription Revenue',
    glAccountCode: '4010',
    status: 'Matched',
    aiConfidence: 98,
    aiModel: 'AGL-Autonomous v4',
    notes: 'Weekly customer subscription batch payout'
  },
  {
    id: 'tx-103',
    date: '2026-11-06',
    description: 'GUSTO PAYROLL RECURRING GUSTO.COM SF',
    merchant: 'Gusto Payroll',
    amount: -48290.15,
    account: 'Chase Operating (#4819)',
    category: 'Salaries, Wages & Payroll Taxes',
    glAccountCode: '6010',
    status: 'Categorized',
    aiConfidence: 99,
    aiModel: 'AGL-Autonomous v4',
    notes: 'Semi-monthly engineering & product team payroll'
  },
  {
    id: 'tx-104',
    date: '2026-11-05',
    description: 'OPENAI API USAGE SAN FRANCISCO CA',
    merchant: 'OpenAI LLC',
    amount: -8940.20,
    account: 'Brex Corporate Card (#8842)',
    category: 'OpenAI API Token Costs',
    glAccountCode: '5020',
    status: 'Categorized',
    aiConfidence: 97,
    aiModel: 'AGL-Autonomous v4',
    receiptUrl: 'openai-inv-nov2026.pdf'
  },
  {
    id: 'tx-105',
    date: '2026-11-04',
    description: 'DATADOG MONITORING NYC NY',
    merchant: 'Datadog Inc',
    amount: -2450.00,
    account: 'Brex Corporate Card (#8842)',
    category: 'Software, Tooling & SaaS Subscriptions',
    glAccountCode: '6020',
    status: 'Categorized',
    aiConfidence: 95,
    aiModel: 'AGL-Autonomous v4'
  },
  {
    id: 'tx-106',
    date: '2026-11-04',
    description: 'GOOGLE WORKSPACE MT VIEW CA',
    merchant: 'Google Cloud / Workspace',
    amount: -1120.00,
    account: 'Brex Corporate Card (#8842)',
    category: 'Software, Tooling & SaaS Subscriptions',
    glAccountCode: '6020',
    status: 'Categorized',
    aiConfidence: 99,
    ruleMatched: 'Rule #3: Google Workspace'
  },
  {
    id: 'tx-107',
    date: '2026-11-03',
    description: 'APOLLO.IO SAN FRANCISCO CA',
    merchant: 'Apollo.io Sales Tech',
    amount: -1800.00,
    account: 'Brex Corporate Card (#8842)',
    category: 'Marketing, Growth & Paid Acquisition',
    glAccountCode: '6040',
    status: 'Categorized',
    aiConfidence: 92
  },
  {
    id: 'tx-108',
    date: '2026-11-03',
    description: 'WIRE IN - HORIZON VENTURES SERIES EXT',
    merchant: 'Horizon Ventures',
    amount: 250000.00,
    account: 'Mercury Treasury Yield (#9921)',
    category: 'Additional Paid-in Capital (SAFEs / Series A)',
    glAccountCode: '3020',
    status: 'Categorized',
    aiConfidence: 96,
    notes: 'Tranche 2 investment wire receipt'
  },
  {
    id: 'tx-109',
    date: '2026-11-02',
    description: 'WEWORK MEMBERSHIP OCT-NOV',
    merchant: 'WeWork Companies',
    amount: -4800.00,
    account: 'Chase Operating (#4819)',
    category: 'Office Rent & WeWork Facilities',
    glAccountCode: '6050',
    status: 'Categorized',
    aiConfidence: 95
  },
  {
    id: 'tx-110',
    date: '2026-11-02',
    description: 'UNKNOWN VENDOR PAYMENT CHARGE 49102',
    merchant: 'Apex Global Consulting',
    amount: -3500.00,
    account: 'Chase Operating (#4819)',
    category: 'Uncategorized Expense',
    glAccountCode: '9999',
    status: 'Needs Review',
    aiConfidence: 48,
    notes: 'Autonomous Ledger flagged: Low confidence merchant classification. Review recommended.'
  },
  {
    id: 'tx-111',
    date: '2026-11-01',
    description: 'DELTA AIR LINES ATLANTA GA',
    merchant: 'Delta Air Lines',
    amount: -840.50,
    account: 'Brex Corporate Card (#8842)',
    category: 'Travel, Meals & Team Offsites',
    glAccountCode: '6060',
    status: 'Categorized',
    aiConfidence: 94
  },
  {
    id: 'tx-112',
    date: '2026-11-01',
    description: 'GITHUB ENTERPRISE SEATTLE WA',
    merchant: 'GitHub Inc',
    amount: -980.00,
    account: 'Brex Corporate Card (#8842)',
    category: 'Software, Tooling & SaaS Subscriptions',
    glAccountCode: '6020',
    status: 'Categorized',
    aiConfidence: 98
  },
  {
    id: 'tx-113',
    date: '2026-10-31',
    description: 'VERITAS LEGAL GROUP LLP WIRE',
    merchant: 'Veritas Legal Group',
    amount: -12500.00,
    account: 'Chase Operating (#4819)',
    category: 'Legal, Accounting & Professional Fees',
    glAccountCode: '6030',
    status: 'Categorized',
    aiConfidence: 96,
    receiptUrl: 'veritas-retainer-oct2026.pdf',
    notes: 'IP trademark filing + venture counsel'
  },
  {
    id: 'tx-114',
    date: '2026-10-30',
    description: 'APPLE STORE RETAIL PALO ALTO CA',
    merchant: 'Apple Inc',
    amount: -4299.00,
    account: 'Brex Corporate Card (#8842)',
    category: 'Computer Equipment & Hardware',
    glAccountCode: '1500',
    status: 'Split',
    aiConfidence: 91,
    splits: [
      { category: 'Computer Equipment & Hardware', amount: -3899.00, notes: 'M4 Max MacBook Pro for new Staff Engineer' },
      { category: 'Software, Tooling & SaaS Subscriptions', amount: -400.00, notes: 'AppleCare+ 3yr plan' }
    ]
  },
  {
    id: 'tx-115',
    date: '2026-10-29',
    description: 'MERCURY TREASURY MONTHLY YIELD INTEREST',
    merchant: 'Mercury Treasury',
    amount: 1420.30,
    account: 'Mercury Treasury Yield (#9921)',
    category: 'Other Interest Income',
    glAccountCode: '4900',
    status: 'Categorized',
    aiConfidence: 99
  },
  {
    id: 'tx-116',
    date: '2026-10-28',
    description: 'FEE STRIPE CHARGEBACK DISPUTE',
    merchant: 'Stripe Inc.',
    amount: -15.00,
    account: 'Chase Operating (#4819)',
    category: 'Payment Processing Fees (Stripe)',
    glAccountCode: '5030',
    status: 'Categorized',
    aiConfidence: 97
  },
  {
    id: 'tx-117',
    date: '2026-10-27',
    description: 'CLOUD HARDWARE SUPPLIES LLC',
    merchant: 'Cloud Hardware Supplies',
    amount: -1240.00,
    account: 'Chase Operating (#4819)',
    category: 'Uncategorized Expense',
    glAccountCode: '9999',
    status: 'Needs Review',
    aiConfidence: 52,
    notes: 'AI Flag: Suspicious or ambiguous vendor name. Needs accountant confirmation.'
  }
];

export const initialRules: CategorizationRule[] = [
  {
    id: 'rule-1',
    name: 'AWS Infrastructure Classifier',
    conditionField: 'description',
    conditionValue: 'Amazon Web Services|AWS',
    targetCategory: 'AWS Cloud Infrastructure & Compute',
    targetGLCode: '5010',
    autoApprove: true,
    isActive: true,
    matchCount: 14,
  },
  {
    id: 'rule-2',
    name: 'Stripe Revenue Payout Match',
    conditionField: 'merchant',
    conditionValue: 'Stripe',
    targetCategory: 'SaaS Platform Subscription Revenue',
    targetGLCode: '4010',
    autoApprove: true,
    isActive: true,
    matchCount: 28,
  },
  {
    id: 'rule-3',
    name: 'Google Workspace Classifier',
    conditionField: 'description',
    conditionValue: 'GOOGLE WORKSPACE|GSUITE',
    targetCategory: 'Software, Tooling & SaaS Subscriptions',
    targetGLCode: '6020',
    autoApprove: true,
    isActive: true,
    matchCount: 8,
  },
  {
    id: 'rule-4',
    name: 'Gusto Payroll Auto-Routing',
    conditionField: 'merchant',
    conditionValue: 'Gusto',
    targetCategory: 'Salaries, Wages & Payroll Taxes',
    targetGLCode: '6010',
    autoApprove: true,
    isActive: true,
    matchCount: 22,
  },
  {
    id: 'rule-5',
    name: 'OpenAI Token Inferences',
    conditionField: 'merchant',
    conditionValue: 'OpenAI',
    targetCategory: 'OpenAI API Token Costs',
    targetGLCode: '5020',
    autoApprove: true,
    isActive: true,
    matchCount: 11,
  },
];

export const initialBills: Bill[] = [
  {
    id: 'bill-201',
    vendor: 'Veritas Legal Group LLP',
    invoiceNumber: 'INV-2026-9912',
    issueDate: '2026-11-01',
    dueDate: '2026-11-20',
    amount: 14500.00,
    category: 'Legal, Accounting & Professional Fees',
    status: 'Awaiting Approval',
    attachmentName: 'veritas-legal-statement.pdf'
  },
  {
    id: 'bill-202',
    vendor: 'Datadog Inc',
    invoiceNumber: 'DD-881920',
    issueDate: '2026-11-03',
    dueDate: '2026-11-18',
    amount: 2450.00,
    category: 'Software, Tooling & SaaS Subscriptions',
    status: 'Scheduled',
    paymentAccount: 'Chase Operating (#4819)'
  },
  {
    id: 'bill-203',
    vendor: 'WeWork Companies',
    invoiceNumber: 'WW-HQ-104',
    issueDate: '2026-10-25',
    dueDate: '2026-11-05',
    amount: 4800.00,
    category: 'Office Rent & WeWork Facilities',
    status: 'Paid',
    paymentAccount: 'Chase Operating (#4819)'
  },
  {
    id: 'bill-204',
    vendor: 'KPMG Audit Advisory',
    invoiceNumber: 'KPMG-7741',
    issueDate: '2026-11-05',
    dueDate: '2026-11-30',
    amount: 22000.00,
    category: 'Legal, Accounting & Professional Fees',
    status: 'Draft'
  }
];

export const initialInvoices: Invoice[] = [
  {
    id: 'inv-301',
    customer: 'Cognitive Dynamics Corp',
    invoiceNumber: 'INV-2026-0045',
    issueDate: '2026-11-01',
    dueDate: '2026-11-15',
    amount: 45000.00,
    status: 'Sent',
    items: [
      { description: 'Autonomous Enterprise AI Platform (Quarterly)', quantity: 1, unitPrice: 35000.00, total: 35000.00 },
      { description: 'Dedicated SLA & Inference Compute', quantity: 1, unitPrice: 10000.00, total: 10000.00 }
    ]
  },
  {
    id: 'inv-302',
    customer: 'Nexus Fintech Partners',
    invoiceNumber: 'INV-2026-0044',
    issueDate: '2026-10-15',
    dueDate: '2026-10-31',
    amount: 28500.00,
    status: 'Paid',
    items: [
      { description: 'API Production Tier (Monthly)', quantity: 1, unitPrice: 28500.00, total: 28500.00 }
    ]
  },
  {
    id: 'inv-303',
    customer: 'Hyperion BioLabs',
    invoiceNumber: 'INV-2026-0046',
    issueDate: '2026-11-04',
    dueDate: '2026-11-18',
    amount: 18200.00,
    status: 'Draft',
    items: [
      { description: 'Private Cloud Deployment Pilot', quantity: 1, unitPrice: 18200.00, total: 18200.00 }
    ]
  },
  {
    id: 'inv-304',
    customer: 'Aura Logistics AI',
    invoiceNumber: 'INV-2026-0039',
    issueDate: '2026-09-20',
    dueDate: '2026-10-10',
    amount: 12400.00,
    status: 'Overdue',
    items: [
      { description: 'Integration Connector API', quantity: 1, unitPrice: 12400.00, total: 12400.00 }
    ]
  }
];

export const initialCloseTasks: CloseTask[] = [
  {
    id: 'ct-1',
    title: 'Sync All Bank & Card Feeds',
    description: 'Verify all Plaid, Chase, Brex and Stripe feeds are 100% updated with no connection errors.',
    completed: true,
    category: 'Bank Feeds',
    completedBy: 'Autonomous AI Ledger',
    completedAt: '2026-11-09 09:12'
  },
  {
    id: 'ct-2',
    title: 'Resolve Uncategorized Transactions',
    description: 'Review and assign Chart of Accounts categories to flagged ambiguous items.',
    completed: false,
    category: 'Categorization'
  },
  {
    id: 'ct-3',
    title: 'Reconcile Chase Operating Checking (#4819)',
    description: 'Match statement ending balance ($1,142,390.12) with book balance.',
    completed: true,
    category: 'Reconciliation',
    completedBy: 'Rahul (Accountant)',
    completedAt: '2026-11-08 17:40'
  },
  {
    id: 'ct-4',
    title: 'Reconcile Brex Corporate Card (#8842)',
    description: 'Match monthly statement balance with card liability ledger.',
    completed: true,
    category: 'Reconciliation',
    completedBy: 'Rahul (Accountant)',
    completedAt: '2026-11-08 18:05'
  },
  {
    id: 'ct-5',
    title: 'Accrual & Prepaid Amortization Check',
    description: 'Amortize annual insurance, prepaid AWS credits, and software commitments.',
    completed: true,
    category: 'Adjustments',
    completedBy: 'Autonomous AI Ledger',
    completedAt: '2026-11-09 02:00'
  },
  {
    id: 'ct-6',
    title: 'Lock Books for October 2026',
    description: 'Prevent retro-active edits to transactions prior to November 1, 2026.',
    completed: false,
    category: 'Final Close'
  }
];

export const initialVaultDocuments: VaultDocument[] = [
  {
    id: 'doc-1',
    title: 'AWS October 2026 Invoice & Usage Breakdown',
    type: 'Invoice',
    uploadedAt: '2026-11-08',
    fileSize: '1.4 MB',
    vendor: 'Amazon Web Services',
    amount: 18420.50,
    ocrExtracted: true,
    ocrText: 'INVOICE SUMMARY: AWS Cloud Hosting services. Account 4910-2918. Period: Oct 1 - Oct 31, 2026. Subtotal: $18,420.50. Tax: $0.00. Total Due: $18,420.50.',
    linkedTransactionId: 'tx-101'
  },
  {
    id: 'doc-2',
    title: 'OpenAI Enterprise Token Usage Monthly Statement',
    type: 'Invoice',
    uploadedAt: '2026-11-05',
    fileSize: '840 KB',
    vendor: 'OpenAI LLC',
    amount: 8940.20,
    ocrExtracted: true,
    ocrText: 'OpenAI, LLC - 3180 18th St, San Francisco. Invoice: GPT-4o and o3 model inference token clusters. Amount: $8,940.20. Paid via Credit Card ending 8842.',
    linkedTransactionId: 'tx-104'
  },
  {
    id: 'doc-3',
    title: 'Veritas Legal Services Retainer Agreement',
    type: 'Contract',
    uploadedAt: '2026-10-31',
    fileSize: '3.2 MB',
    vendor: 'Veritas Legal Group',
    amount: 12500.00,
    ocrExtracted: true,
    ocrText: 'Engagement Agreement between Acme Technologies Inc and Veritas Legal Group LLP. Legal counsel and intellectual property representation.',
    linkedTransactionId: 'tx-113'
  },
  {
    id: 'doc-4',
    title: 'Chase Operating Account Monthly Statement (Oct 2026)',
    type: 'Bank Statement',
    uploadedAt: '2026-11-02',
    fileSize: '2.1 MB',
    ocrExtracted: true,
    ocrText: 'JPMorgan Chase Bank, N.A. Statement Period: Oct 1, 2026 to Oct 31, 2026. Account: 4819. Ending Balance: $1,142,390.12.'
  },
  {
    id: 'doc-5',
    title: 'IRS Form W-9 - Acme Technologies Inc (Signed 2026)',
    type: 'Tax Document',
    uploadedAt: '2026-01-15',
    fileSize: '450 KB',
    ocrExtracted: true,
    ocrText: 'Department of the Treasury Internal Revenue Service Form W-9. Name: Acme Technologies Inc. Delaware C-Corporation. EIN: 12-3456789.'
  }
];

export const initialIntegrations: Integration[] = [
  {
    id: 'int-1',
    name: 'Chase Commercial Banking',
    type: 'bank',
    status: 'Connected',
    lastSynced: '2 minutes ago',
    details: 'Plaid Direct Core API · Account #4819 synced realtime',
    iconName: 'Building2'
  },
  {
    id: 'int-2',
    name: 'Mercury Treasury & Checking',
    type: 'bank',
    status: 'Connected',
    lastSynced: '14 minutes ago',
    details: 'Direct API · Account #9921 synced realtime',
    iconName: 'Landmark'
  },
  {
    id: 'int-3',
    name: 'Stripe Payments',
    type: 'payment',
    status: 'Connected',
    lastSynced: '1 minute ago',
    details: 'Webhook streaming · Auto-reconciles fees and gross charges',
    iconName: 'CreditCard'
  },
  {
    id: 'int-4',
    name: 'QuickBooks Online (QBO)',
    type: 'accounting',
    status: 'Connected',
    lastSynced: '5 minutes ago',
    details: 'Bidirectional sync · General Ledger mirror active',
    iconName: 'RefreshCw'
  },
  {
    id: 'int-5',
    name: 'Brex Corporate Cards',
    type: 'payment',
    status: 'Connected',
    lastSynced: '10 minutes ago',
    details: 'Direct OAuth · Auto-fetches receipts and itemized lines',
    iconName: 'CreditCard'
  },
  {
    id: 'int-6',
    name: 'Gusto Payroll',
    type: 'payroll',
    status: 'Connected',
    lastSynced: '3 hours ago',
    details: 'Auto-maps employee wages, taxes, and benefits to COA',
    iconName: 'Users'
  }
];

