export type LegalEntity = {
  id: string;
  name: string;
  slug: string;
  type: string; // e.g. "Delaware C-Corp"
  ein: string;
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
};

export type Invoice = {
  id: string;
  customer: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue';
  items: { description: string; quantity: number; unitPrice: number; total: number }[];
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

