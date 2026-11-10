// Indian Bank Statement & UPI Narration Normalizer
// Strips raw transaction dumps across HDFC, ICICI, SBI, Axis, Kotak into clean counterparties & UTRs

export interface NormalizedBankTransaction {
  rawNarration: string;
  cleanCounterparty: string;
  channel: 'UPI' | 'NEFT' | 'IMPS' | 'RTGS' | 'POS Card' | 'Direct Debit' | 'Cheque' | 'ATM/Cash';
  referenceId: string;
  merchantCategoryHint: string;
  suggestedGLCode: string;
  suggestedCategory: string;
  suggestedHsnSac: string;
  isProbableVendor: boolean;
}

export function normalizeIndianBankNarration(narration: string): NormalizedBankTransaction {
  const raw = (narration || '').trim();

  // Pattern 1: UPI Strings
  // e.g. UPI/43128912/Paytm/Swiggy/HDFC000123/Order9912 or UPI-SWIGGY-swiggy@hdfcbank-43128912
  const upiMatch = raw.match(/UPI(?:\/|-)([A-Z0-9]+)?(?:\/|-)?([^/]+)?(?:\/|-)?([^/]+)?/i);
  if (/^UPI/i.test(raw) || raw.includes('/UPI/')) {
    const parts = raw.split(/[/\\-]/).filter((p) => p && !/^(UPI|P2A|P2P)$/i.test(p));
    const ref = parts.find((p) => /^\d{8,16}$/.test(p)) || 'UPI-REF';
    let party = parts.find((p) => !/^\d+$/.test(p) && !/^(HDFC|ICIC|SBIN|UTIB|YESB|PAYTM|OKAXIS)/i.test(p) && p.length > 2) || 'UPI Merchant';

    // Clean common prefixes/suffixes
    party = party.replace(/@\w+/g, '').replace(/_+/g, ' ').trim();

    return {
      rawNarration: raw,
      cleanCounterparty: formatPartyName(party),
      channel: 'UPI',
      referenceId: ref,
      merchantCategoryHint: 'Online Vendor / Disbursal',
      suggestedGLCode: '6020',
      suggestedCategory: 'Software, Tooling & SaaS Subscriptions',
      suggestedHsnSac: 'SAC 998314',
      isProbableVendor: true
    };
  }

  // Pattern 2: NEFT Strings
  // e.g. NEFT-YESB000112-INFOSYS TECHNOLOGIES-N112024881
  if (/NEFT/i.test(raw)) {
    const parts = raw.split(/[-/]/);
    const ifsc = parts.find((p) => /^[A-Z]{4}0[A-Z0-9]{6}$/i.test(p)) || '';
    const utr = parts.find((p) => /^N\d{8,16}$/i.test(p) || /^\d{10,16}$/.test(p)) || 'NEFT-UTR';
    const party = parts.find((p) => p !== 'NEFT' && p !== ifsc && p !== utr && p.length > 2) || 'NEFT Beneficiary';

    return {
      rawNarration: raw,
      cleanCounterparty: formatPartyName(party),
      channel: 'NEFT',
      referenceId: utr,
      merchantCategoryHint: 'Vendor Invoice Settlement',
      suggestedGLCode: '2000',
      suggestedCategory: 'Accounts Payable (A/P)',
      suggestedHsnSac: 'SAC 998313',
      isProbableVendor: true
    };
  }

  // Pattern 3: RTGS Strings
  if (/RTGS/i.test(raw)) {
    const parts = raw.split(/[-/]/);
    const utr = parts.find((p) => /^R\d{8,16}$/i.test(p) || /^\d{12,18}$/.test(p)) || 'RTGS-UTR';
    const party = parts.find((p) => !/RTGS/i.test(p) && p !== utr && p.length > 2) || 'Corporate Wire Beneficiary';

    return {
      rawNarration: raw,
      cleanCounterparty: formatPartyName(party),
      channel: 'RTGS',
      referenceId: utr,
      merchantCategoryHint: 'High-Value Vendor / Treasury',
      suggestedGLCode: '5010',
      suggestedCategory: 'AWS Cloud Infrastructure & Compute',
      suggestedHsnSac: 'SAC 998314',
      isProbableVendor: true
    };
  }

  // Pattern 4: IMPS Strings
  // e.g. IMPS-P2A-431092-RAZORPAY SOFTWARE-HDFC
  if (/IMPS/i.test(raw)) {
    const parts = raw.split(/[-/]/);
    const rrn = parts.find((p) => /^\d{10,14}$/.test(p)) || 'IMPS-RRN';
    const party = parts.find((p) => !/^(IMPS|P2A|P2P)$/i.test(p) && p !== rrn && p.length > 2) || 'IMPS Transfer';

    return {
      rawNarration: raw,
      cleanCounterparty: formatPartyName(party),
      channel: 'IMPS',
      referenceId: rrn,
      merchantCategoryHint: 'Instant Vendor Payment',
      suggestedGLCode: '6020',
      suggestedCategory: 'Software, Tooling & SaaS Subscriptions',
      suggestedHsnSac: 'SAC 998314',
      isProbableVendor: true
    };
  }

  // Pattern 5: POS Card swipes / Online Gateway
  if (/POS|ECOM|DEBIT CARD|CARD/i.test(raw)) {
    const clean = raw.replace(/POS|ECOM|DEBIT CARD|CARD\s*\d{4}/gi, '').trim();
    return {
      rawNarration: raw,
      cleanCounterparty: formatPartyName(clean || 'Card Merchant'),
      channel: 'POS Card',
      referenceId: 'CARD-TXN',
      merchantCategoryHint: 'Card Purchase',
      suggestedGLCode: '6060',
      suggestedCategory: 'Travel, Meals & Team Offsites',
      suggestedHsnSac: 'SAC 996331',
      isProbableVendor: false
    };
  }

  // Fallback
  return {
    rawNarration: raw,
    cleanCounterparty: formatPartyName(raw.substring(0, 30)),
    channel: 'Direct Debit',
    referenceId: 'REF-' + Date.now().toString().substring(7),
    merchantCategoryHint: 'General Ledger Transaction',
    suggestedGLCode: '9999',
    suggestedCategory: 'Uncategorized Expense',
    suggestedHsnSac: 'SAC 998314',
    isProbableVendor: false
  };
}

function formatPartyName(name: string): string {
  if (!name) return 'Unknown Party';
  return name
    .toLowerCase()
    .replace(/\b(pvt|ltd|corp|inc|llp|services|technologies)\b/gi, (m) => m.toUpperCase())
    .replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())
    .trim();
}

