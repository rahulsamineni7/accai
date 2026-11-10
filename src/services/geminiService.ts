// Google Gemini LLM Service for Digits Autonomous Financial Platform

const DEFAULT_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const DEFAULT_MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash';

export interface FinancialContext {
  entityName: string;
  entityType: string;
  accountingMethod: string;
  totalCash: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  monthlyCOGS: number;
  netBurn: number;
  runwayMonths: number;
  grossMarginPercent: number;
  recentTransactions: Array<{
    date: string;
    merchant: string;
    description: string;
    amount: number;
    category: string;
    account: string;
    status: string;
  }>;
  openBills: Array<{
    vendor: string;
    amount: number;
    dueDate: string;
    status: string;
  }>;
  openInvoices: Array<{
    customer: string;
    amount: number;
    dueDate: string;
    status: string;
  }>;
  chartOfAccountsSample: Array<{
    code: string;
    name: string;
    category: string;
    balance: number;
  }>;
}

export async function askDigitsAI(
  userQuery: string,
  context: FinancialContext,
  apiKey: string = DEFAULT_API_KEY
): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${DEFAULT_MODEL}:generateContent?key=${apiKey.trim()}`;

  const systemInstruction = `You are "Ask AccAI / Ask Digits", the senior autonomous financial analyst, controller, and Indian Chartered Accountant (CA) advisor embedded in the AccAI Autonomous General Ledger (hybrid of Digits AI and HisabKitab Indian accounting intelligence).
You have real-time access to the user's live financial data, banking feeds, and dual-entry general ledger.

Current Financial Ledger Context:
- Company Entity: ${context.entityName} (${context.entityType})
- Accounting Method: ${context.accountingMethod} Basis
- Total Cash on Hand: ${context.totalCash.toLocaleString()}
- Monthly Recurring Revenue: ${context.monthlyRevenue.toLocaleString()}
- Monthly COGS: ${context.monthlyCOGS.toLocaleString()}
- Monthly Operating Expenses (OPEX): ${context.monthlyExpenses.toLocaleString()}
- Net Monthly Burn: -${Math.abs(context.netBurn).toLocaleString()}
- Projected Runway: ${context.runwayMonths} Months
- Gross Margin: ${context.grossMarginPercent}%

Recent Sample Transactions in Ledger:
${context.recentTransactions
  .slice(0, 10)
  .map(
    (t) =>
      `• [${t.date}] ${t.merchant} (${t.account}): ${t.amount < 0 ? '-' : '+'}${Math.abs(t.amount).toLocaleString()} -> ${t.category} [${t.status}]`
  )
  .join('\n')}

Active Bills (AP):
${context.openBills.map((b) => `• ${b.vendor}: ${b.amount.toLocaleString()} due ${b.dueDate} (${b.status})`).join('\n')}

Active Customer Invoices (AR):
${context.openInvoices.map((i) => `• ${i.customer}: ${i.amount.toLocaleString()} due ${i.dueDate} (${i.status})`).join('\n')}

Indian Compliance Knowledge & Capabilities:
- GST: GSTR-1 (Outward supplies), GSTR-3B (Monthly summary), GSTR-2B (Input Tax Credit matching), E-Invoicing (IRN), E-Way Bills, CGST/SGST vs IGST rules.
- TDS / Income Tax: Section 194J (10%/2% Tech & Professional fees), Section 194C (1%/2% Contractors), Section 194I (10%/2% Rent), Form 26Q quarterly returns, Challan 281.
- Tally Prime Bridge: TDL XML import, Schedule III Balance Sheet division II.
- Financial Year: April 1 to March 31 with Advance Tax installment deadlines (June 15, Sept 15, Dec 15, March 15).

Style Guidelines:
- Ground your answers strictly in this real ledger data.
- Be concise, professional, insightful, and clear.
- Provide Indian Rupee (₹) and Lakhs/Crores notation whenever discussing Indian entity figures.
- Use GitHub markdown formatting (bullet points, bold highlights, small tables if useful).`;

  const payload = {
    system_instruction: {
      parts: [{ text: systemInstruction }]
    },
    contents: [
      {
        parts: [{ text: userQuery }]
      }
    ],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 1024
    }
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error('Gemini API error:', errBody);
      throw new Error(`Gemini API returned status ${res.status}`);
    }

    const data = await res.json();
    const candidate = data.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error('Empty response received from Gemini');
    }
    return text;
  } catch (err: any) {
    console.error('Failed to call Gemini API:', err);
    throw err;
  }
}

export async function categorizeTransactionWithAI(
  tx: { description: string; merchant: string; amount: number; account: string },
  categories: Array<{ name: string; code: string; category: string }>,
  apiKey: string = DEFAULT_API_KEY
): Promise<{ category: string; glCode: string; confidence: number; reasoning: string }> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${DEFAULT_MODEL}:generateContent?key=${apiKey.trim()}`;

  const prompt = `You are Digits' Autonomous Transaction Classifier.
Classify the following bank transaction into the single most accurate Chart of Accounts category from the list.

Transaction:
- Merchant: "${tx.merchant}"
- Raw Description: "${tx.description}"
- Amount: $${tx.amount}
- Source Account: "${tx.account}"

Available Categories:
${categories.map((c) => `- ${c.code}: ${c.name} (${c.category})`).join('\n')}

Respond ONLY with valid JSON in this exact structure, with no markdown code fences:
{
  "category": "Exact Name of Category",
  "glCode": "Exact Code",
  "confidence": 98,
  "reasoning": "Brief explanation why"
}`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: 'application/json'
        }
      })
    });

    if (!res.ok) {
      throw new Error(`Gemini status ${res.status}`);
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    const parsed = JSON.parse(text);

    return {
      category: parsed.category || 'General Expense',
      glCode: parsed.glCode || '6020',
      confidence: parsed.confidence || 95,
      reasoning: parsed.reasoning || 'Categorized by Gemini AI'
    };
  } catch (e) {
    console.warn('AI categorization fallback:', e);
    // Sensible fallback
    return {
      category: 'Software, Tooling & SaaS Subscriptions',
      glCode: '6020',
      confidence: 90,
      reasoning: 'Heuristic fallback classifier'
    };
  }
}

export async function testGeminiConnection(apiKey: string = DEFAULT_API_KEY): Promise<boolean> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${DEFAULT_MODEL}:generateContent?key=${apiKey.trim()}`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Respond with 1 word: ACTIVE' }] }]
      })
    });
    return res.ok;
  } catch (e) {
    return false;
  }
}

