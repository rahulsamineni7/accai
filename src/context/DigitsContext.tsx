import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  LegalEntity,
  ChartAccount,
  Transaction,
  CategorizationRule,
  Bill,
  Invoice,
  CloseTask,
  VaultDocument,
  Integration
} from '../types';
import {
  initialLegalEntities,
  initialChartOfAccounts,
  initialTransactions,
  initialRules,
  initialBills,
  initialInvoices,
  initialCloseTasks,
  initialVaultDocuments,
  initialIntegrations
} from '../data/mockData';

export type ViewType =
  | 'home'
  | 'financials'
  | 'transactions'
  | 'chart-of-accounts'
  | 'rules'
  | 'reconciliations'
  | 'bills'
  | 'invoices'
  | 'checklist'
  | 'vault'
  | 'directory'
  | 'integrations'
  | 'settings';

interface DigitsContextType {
  // Navigation
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  isAskDigitsOpen: boolean;
  setIsAskDigitsOpen: (open: boolean) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  // Legal Entities
  entities: LegalEntity[];
  currentEntity: LegalEntity;
  switchEntity: (id: string) => void;

  // Chart of Accounts
  chartOfAccounts: ChartAccount[];
  addChartAccount: (acc: Omit<ChartAccount, 'id'>) => void;

  // Transactions
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  updateTransactionCategory: (id: string, category: string, glCode: string) => void;
  toggleTransactionMatch: (id: string) => void;
  deleteTransaction: (id: string) => void;
  splitTransaction: (id: string, splits: { category: string; amount: number; notes?: string }[]) => void;

  // Rules
  rules: CategorizationRule[];
  addRule: (rule: Omit<CategorizationRule, 'id' | 'matchCount'>) => void;
  toggleRuleActive: (id: string) => void;
  runRulesNow: () => { matchedCount: number; updatedTxIds: string[] };

  // Bills & Invoices
  bills: Bill[];
  addBill: (bill: Omit<Bill, 'id'>) => void;
  approveBill: (id: string) => void;
  payBill: (id: string) => void;

  invoices: Invoice[];
  addInvoice: (inv: Omit<Invoice, 'id'>) => void;
  sendInvoice: (id: string) => void;
  markInvoicePaid: (id: string) => void;

  // Month End Close
  closeTasks: CloseTask[];
  toggleCloseTask: (id: string) => void;
  isBooksLocked: boolean;
  lockBooks: () => void;

  // Vault Documents
  vaultDocuments: VaultDocument[];
  addVaultDocument: (doc: Omit<VaultDocument, 'id'>) => void;

  // Integrations
  integrations: Integration[];
  syncIntegration: (id: string) => void;

  // Key Financial Calculations
  metrics: {
    totalCash: number;
    monthlyRevenue: number;
    monthlyExpenses: number;
    monthlyCOGS: number;
    netBurn: number;
    runwayMonths: number;
    grossMarginPercent: number;
    openInvoicesTotal: number;
    unpaidBillsTotal: number;
    uncategorizedCount: number;
  };

  // Toast Notifications
  notification: string | null;
  showNotification: (msg: string) => void;

  // Gemini AI Engine
  apiKey: string;
  setApiKey: (key: string) => void;
  aiStatus: 'connected' | 'checking' | 'error';
  autoCategorizeWithGemini: () => Promise<number>;
}

const DigitsContext = createContext<DigitsContextType | undefined>(undefined);

export const DigitsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<ViewType>('home');
  const [isAskDigitsOpen, setIsAskDigitsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    const saved = localStorage.getItem('digits_sidebar_open');
    return saved !== null ? saved === 'true' : true;
  });

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => {
      const next = !prev;
      localStorage.setItem('digits_sidebar_open', String(next));
      return next;
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const [entities, setEntities] = useState<LegalEntity[]>(initialLegalEntities);
  const [currentEntity, setCurrentEntity] = useState<LegalEntity>(initialLegalEntities[0]);
  const [chartOfAccounts, setChartOfAccounts] = useState<ChartAccount[]>(initialChartOfAccounts);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [rules, setRules] = useState<CategorizationRule[]>(initialRules);
  const [bills, setBills] = useState<Bill[]>(initialBills);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [closeTasks, setCloseTasks] = useState<CloseTask[]>(initialCloseTasks);
  const [vaultDocuments, setVaultDocuments] = useState<VaultDocument[]>(initialVaultDocuments);
  const [integrations, setIntegrations] = useState<Integration[]>(initialIntegrations);
  const [isBooksLocked, setIsBooksLocked] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Gemini AI state
  const [apiKey, setApiKeyState] = useState<string>(
    () => localStorage.getItem('digits_gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || ''
  );
  const [aiStatus, setAiStatus] = useState<'connected' | 'checking' | 'error'>('checking');

  const setApiKey = (newKey: string) => {
    setApiKeyState(newKey);
    localStorage.setItem('digits_gemini_api_key', newKey);
    checkAiKey(newKey);
  };

  const checkAiKey = async (keyToTest: string) => {
    setAiStatus('checking');
    try {
      const { testGeminiConnection } = await import('../services/geminiService');
      const valid = await testGeminiConnection(keyToTest);
      setAiStatus(valid ? 'connected' : 'error');
    } catch {
      setAiStatus('error');
    }
  };

  useEffect(() => {
    checkAiKey(apiKey);
  }, []);

  const autoCategorizeWithGemini = async (): Promise<number> => {
    showNotification('Connecting to Gemini 2.5 Flash Autonomous Ledger classifier...');
    const { categorizeTransactionWithAI } = await import('../services/geminiService');

    const availableCategories = chartOfAccounts
      .filter((a) => a.category === 'Expense' || a.category === 'COGS' || a.category === 'Revenue')
      .map((a) => ({ name: a.name, code: a.code, category: a.category }));

    const unreviewed = transactions.filter((t) => t.status === 'Needs Review' || t.glAccountCode === '9999');
    if (unreviewed.length === 0) {
      showNotification('All transactions are already verified and categorized!');
      return 0;
    }

    let updatedCount = 0;
    const updatedMap = new Map<string, { category: string; glCode: string; confidence: number; reasoning: string }>();

    for (const tx of unreviewed) {
      const res = await categorizeTransactionWithAI(
        { description: tx.description, merchant: tx.merchant, amount: tx.amount, account: tx.account },
        availableCategories,
        apiKey
      );
      updatedMap.set(tx.id, res);
      updatedCount++;
    }

    setTransactions((prev) =>
      prev.map((t) => {
        const update = updatedMap.get(t.id);
        if (update) {
          return {
            ...t,
            category: update.category,
            glAccountCode: update.glCode,
            status: 'Categorized',
            aiConfidence: update.confidence,
            aiModel: 'Gemini 2.5 Flash',
            notes: update.reasoning
          };
        }
        return t;
      })
    );

    showNotification(`Gemini 2.5 Flash successfully classified ${updatedCount} transactions!`);
    return updatedCount;
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 4000);
  };

  const switchEntity = (id: string) => {
    const found = entities.find((e) => e.id === id);
    if (found) {
      setCurrentEntity(found);
      setEntities(entities.map((e) => ({ ...e, isCurrent: e.id === id })));
      showNotification(`Switched entity to: ${found.name}`);
    }
  };

  // Quick keyboard shortcut: Cmd+K / Ctrl+K opens "Ask Digits"
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsAskDigitsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const addChartAccount = (acc: Omit<ChartAccount, 'id'>) => {
    const newAcc: ChartAccount = {
      ...acc,
      id: `coa-${Date.now()}`
    };
    setChartOfAccounts((prev) => [...prev, newAcc]);
    showNotification(`Account ${newAcc.code} - ${newAcc.name} added to General Ledger`);
  };

  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...tx,
      id: `tx-${Date.now()}`
    };
    setTransactions((prev) => [newTx, ...prev]);
    showNotification(`Transaction created: ${newTx.merchant} ($${Math.abs(newTx.amount).toLocaleString()})`);
  };

  const updateTransactionCategory = (id: string, category: string, glCode: string) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              category,
              glAccountCode: glCode,
              status: 'Categorized',
              aiConfidence: 100,
              aiModel: 'Manual Accountant Edit'
            }
          : t
      )
    );
    showNotification(`Categorized transaction to ${category}`);
  };

  const toggleTransactionMatch = (id: string) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: t.status === 'Matched' ? 'Categorized' : 'Matched'
            }
          : t
      )
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    showNotification('Transaction removed from Autonomous Ledger');
  };

  const splitTransaction = (id: string, splits: { category: string; amount: number; notes?: string }[]) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: 'Split',
              splits
            }
          : t
      )
    );
    showNotification('Transaction successfully split into itemized lines');
  };

  const addRule = (rule: Omit<CategorizationRule, 'id' | 'matchCount'>) => {
    const newRule: CategorizationRule = {
      ...rule,
      id: `rule-${Date.now()}`,
      matchCount: 0
    };
    setRules((prev) => [...prev, newRule]);
    showNotification(`Created Autonomous Rule: "${newRule.name}"`);
  };

  const toggleRuleActive = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r))
    );
  };

  const runRulesNow = () => {
    let matchCount = 0;
    const updatedIds: string[] = [];
    const activeRules = rules.filter((r) => r.isActive);

    setTransactions((prev) =>
      prev.map((tx) => {
        if (tx.status === 'Needs Review' || tx.glAccountCode === '9999') {
          for (const rule of activeRules) {
            let matched = false;
            if (rule.conditionField === 'description') {
              const regex = new RegExp(rule.conditionValue, 'i');
              matched = regex.test(tx.description);
            } else if (rule.conditionField === 'merchant') {
              const regex = new RegExp(rule.conditionValue, 'i');
              matched = regex.test(tx.merchant);
            } else if (rule.conditionField === 'amount_gt') {
              matched = Math.abs(tx.amount) > parseFloat(rule.conditionValue);
            } else if (rule.conditionField === 'amount_lt') {
              matched = Math.abs(tx.amount) < parseFloat(rule.conditionValue);
            }

            if (matched) {
              matchCount++;
              updatedIds.push(tx.id);
              return {
                ...tx,
                category: rule.targetCategory,
                glAccountCode: rule.targetGLCode,
                status: rule.autoApprove ? 'Categorized' : 'Needs Review',
                aiConfidence: 99,
                ruleMatched: rule.name
              };
            }
          }
        }
        return tx;
      })
    );

    showNotification(`Rules engine executed: ${matchCount} unreviewed transaction(s) auto-mapped!`);
    return { matchedCount: matchCount, updatedTxIds: updatedIds };
  };

  const addBill = (bill: Omit<Bill, 'id'>) => {
    const newBill: Bill = {
      ...bill,
      id: `bill-${Date.now()}`
    };
    setBills((prev) => [newBill, ...prev]);
    showNotification(`Bill created for ${newBill.vendor} ($${newBill.amount.toLocaleString()})`);
  };

  const approveBill = (id: string) => {
    setBills((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'Scheduled' } : b))
    );
    showNotification('Bill approved and scheduled for automated payment');
  };

  const payBill = (id: string) => {
    setBills((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'Paid' } : b))
    );
    showNotification('Bill marked as paid');
  };

  const addInvoice = (inv: Omit<Invoice, 'id'>) => {
    const newInv: Invoice = {
      ...inv,
      id: `inv-${Date.now()}`
    };
    setInvoices((prev) => [newInv, ...prev]);
    showNotification(`Invoice ${newInv.invoiceNumber} created for ${newInv.customer}`);
  };

  const sendInvoice = (id: string) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: 'Sent' } : inv))
    );
    showNotification('Payment link & invoice PDF dispatched to customer');
  };

  const markInvoicePaid = (id: string) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: 'Paid' } : inv))
    );
    showNotification('Invoice payment received and reconciled');
  };

  const toggleCloseTask = (id: string) => {
    setCloseTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: !t.completed,
              completedBy: !t.completed ? 'Rahul (Accountant)' : undefined,
              completedAt: !t.completed ? new Date().toISOString().substring(0, 16).replace('T', ' ') : undefined
            }
          : t
      )
    );
  };

  const lockBooks = () => {
    setIsBooksLocked(true);
    showNotification('October 2026 Books are now officially locked. Retroactive edits sealed.');
  };

  const addVaultDocument = (doc: Omit<VaultDocument, 'id'>) => {
    const newDoc: VaultDocument = {
      ...doc,
      id: `doc-${Date.now()}`
    };
    setVaultDocuments((prev) => [newDoc, ...prev]);
    showNotification(`Document "${newDoc.title}" stored and OCR indexed in Vault`);
  };

  const syncIntegration = (id: string) => {
    setIntegrations((prev) =>
      prev.map((int) => (int.id === id ? { ...int, status: 'Syncing' } : int))
    );
    setTimeout(() => {
      setIntegrations((prev) =>
        prev.map((int) =>
          int.id === id
            ? { ...int, status: 'Connected', lastSynced: 'Just now' }
            : int
        )
      );
      showNotification('Integration sync completed with 0 errors');
    }, 1500);
  };

  // Metrics computation
  const cashAccounts = chartOfAccounts.filter((a) => a.category === 'Asset' && a.subcategory === 'Cash & Cash Equivalents');
  const totalCash = cashAccounts.reduce((sum, a) => sum + a.balance, 0);

  // Monthly revenue & expense estimates based on live COA
  const monthlyRevenue = 184200.00;
  const monthlyCOGS = 36500.00;
  const monthlyExpenses = 190550.00; // Total operating expenses
  const netBurn = monthlyRevenue - (monthlyExpenses + monthlyCOGS); // negative burn
  const runwayMonths = Math.abs(netBurn) > 0 ? Number((totalCash / Math.abs(netBurn)).toFixed(1)) : 999;
  const grossMarginPercent = Math.round(((monthlyRevenue - monthlyCOGS) / monthlyRevenue) * 100);

  const openInvoicesTotal = invoices
    .filter((i) => i.status === 'Sent' || i.status === 'Overdue')
    .reduce((sum, i) => sum + i.amount, 0);

  const unpaidBillsTotal = bills
    .filter((b) => b.status === 'Awaiting Approval' || b.status === 'Scheduled')
    .reduce((sum, b) => sum + b.amount, 0);

  const uncategorizedCount = transactions.filter((t) => t.status === 'Needs Review' || t.glAccountCode === '9999').length;

  return (
    <DigitsContext.Provider
      value={{
        activeView,
        setActiveView,
        isAskDigitsOpen,
        setIsAskDigitsOpen,
        isSidebarOpen,
        setIsSidebarOpen,
        toggleSidebar,
        entities,
        currentEntity,
        switchEntity,
        chartOfAccounts,
        addChartAccount,
        transactions,
        addTransaction,
        updateTransactionCategory,
        toggleTransactionMatch,
        deleteTransaction,
        splitTransaction,
        rules,
        addRule,
        toggleRuleActive,
        runRulesNow,
        bills,
        addBill,
        approveBill,
        payBill,
        invoices,
        addInvoice,
        sendInvoice,
        markInvoicePaid,
        closeTasks,
        toggleCloseTask,
        isBooksLocked,
        lockBooks,
        vaultDocuments,
        addVaultDocument,
        integrations,
        syncIntegration,
        metrics: {
          totalCash,
          monthlyRevenue,
          monthlyExpenses,
          monthlyCOGS,
          netBurn,
          runwayMonths,
          grossMarginPercent,
          openInvoicesTotal,
          unpaidBillsTotal,
          uncategorizedCount
        },
        notification,
        showNotification,
        apiKey,
        setApiKey,
        aiStatus,
        autoCategorizeWithGemini
      }}
    >
      {children}
    </DigitsContext.Provider>
  );
};

export const useDigits = () => {
  const context = useContext(DigitsContext);
  if (!context) {
    throw new Error('useDigits must be used within a DigitsProvider');
  }
  return context;
};

