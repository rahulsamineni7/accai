export type LegalEntity = {
  id: string;
  name: string;
  slug: string;
  type: string; // e.g. "Private Limited (India)" or "Delaware C-Corp"
  ein: string;
  cin?: string; // Corporate Identification Number (India)
  pan?: string; // Permanent Account Number (India)
  gstin?: string; // Goods and Services Tax Identification Number (India)
  state?: string; // e.g. "29-Karnataka"
  currency: string;
  fiscalYearEnd: string;
  accountingMethod: 'Accrual' | 'Cash';
  isCurrent?: boolean;
};

export type AccountCategory = 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'COGS' | 'Expense';

export type ChartAccount = {
  id: string;
  code: string;
  name: string;
  category: AccountCategory;
  subcategory: string;
  balance: number;
  description?: string;
  isSystem?: boolean;
};

export type TransactionStatus = 'Categorized' | 'Needs Review' | 'Matched' | 'Split';

export type Transaction = {
  id: string;
  date: string;
  description: string;
  merchant: string;
  amount: number; // positive = inflow/revenue, negative = outflow/expense
  account: string; // bank account e.g. "Chase Operating #4819"
  category: string;
  glAccountCode: string;
  status: TransactionStatus;
  aiConfidence: number; // 0 to 100
  aiModel?: string; // e.g. "AGL-Autonomous v4"
  ruleMatched?: string;
  receiptUrl?: string;
  notes?: string;
  splits?: { category: string; amount: number; notes?: string }[];
};

export type CategorizationRule = {
  id: string;
  name: string;
  conditionField: 'description' | 'merchant' | 'amount_gt' | 'amount_lt';
  conditionValue: string;
  targetCategory: string;
  targetGLCode: string;
  autoApprove: boolean;
  isActive: boolean;
  matchCount: number;
};

export type Bill = {
  id: string;
  vendor: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  category: string;
  status: 'Draft' | 'Awaiting Approval' | 'Scheduled' | 'Paid';
  paymentAccount?: string;
  attachmentName?: string;
  // Indian Compliance & GST
  gstin?: string;
  hsnSac?: string;
  taxableAmount?: number;
  cgst?: number;
  sgst?: number;
  igst?: number;
  tdsSection?: '194J' | '194C' | '194I' | '194Q' | 'None';
  tdsRate?: number;
  tdsAmount?: number;
  netPayable?: number;
  gstr2bMatchStatus?: 'Matched' | 'Pending In Portal' | 'Mismatch' | 'Not Uploaded';
  itcEligible?: boolean;
};

export type Invoice = {
  id: string;
  customer: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue';
  items: { description: string; quantity: number; unitPrice: number; total: number; hsnSac?: string; gstRate?: number }[];
  // Indian GST & E-Invoicing
  gstin?: string;
  placeOfSupply?: string;
  taxableAmount?: number;
  cgst?: number;
  sgst?: number;
  igst?: number;
  irn?: string; // E-Invoice 64-char Invoice Reference Number
  irnStatus?: 'Generated' | 'Pending' | 'Exempt';
  ewayBillNumber?: string;
  upiId?: string; // e.g. "acmetech@hdfcbank"
  upiQrString?: string;
};

export type GSTFilingPeriod = {
  month: string; // e.g. "October 2024"
  gstr1Status: 'Filed' | 'Ready to File' | 'Draft';
  gstr3bStatus: 'Filed' | 'Ready to File' | 'Draft';
  gstr2bItcTotal: number;
  gstr2bMatchedPercent: number;
  totalOutwardTax: number;
  netTaxPayable: number;
};

export type CloseTask = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  category: string;
  completedBy?: string;
  completedAt?: string;
};

export type VaultDocument = {
  id: string;
  title: string;
  type: 'Receipt' | 'Invoice' | 'Tax Document' | 'Bank Statement' | 'Contract';
  uploadedAt: string;
  fileSize: string;
  vendor?: string;
  amount?: number;
  ocrExtracted: boolean;
  ocrText?: string;
  linkedTransactionId?: string;
};

export type Integration = {
  id: string;
  name: string;
  type: 'bank' | 'payment' | 'accounting' | 'payroll';
  status: 'Connected' | 'Syncing' | 'Disconnected' | 'Error';
  lastSynced: string;
  details: string;
  iconName: string;
};

