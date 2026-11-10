// Indian and Global Currency & Number Formatters for AccAI

export type CurrencyCode = 'INR' | 'USD';

/**
 * Format currency with proper Indian (Lakhs/Crores) or US (Thousands/Millions) grouping.
 */
export function formatCurrency(
  amount: number,
  currency: CurrencyCode = 'INR',
  options?: { hideDecimals?: boolean; compact?: boolean }
): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  if (options?.compact) {
    if (currency === 'INR') {
      if (absAmount >= 10000000) {
        // Crores
        return `${isNegative ? '-' : ''}₹${(absAmount / 10000000).toFixed(2)} Cr`;
      } else if (absAmount >= 100000) {
        // Lakhs
        return `${isNegative ? '-' : ''}₹${(absAmount / 100000).toFixed(2)} L`;
      } else if (absAmount >= 1000) {
        // Thousands
        return `${isNegative ? '-' : ''}₹${(absAmount / 1000).toFixed(1)} K`;
      }
      return `${isNegative ? '-' : ''}₹${absAmount.toFixed(0)}`;
    } else {
      // USD compact
      if (absAmount >= 1000000000) {
        return `${isNegative ? '-' : ''}$${(absAmount / 1000000000).toFixed(2)}B`;
      } else if (absAmount >= 1000000) {
        return `${isNegative ? '-' : ''}$${(absAmount / 1000000).toFixed(2)}M`;
      } else if (absAmount >= 1000) {
        return `${isNegative ? '-' : ''}$${(absAmount / 1000).toFixed(1)}K`;
      }
      return `${isNegative ? '-' : ''}$${absAmount.toFixed(0)}`;
    }
  }

  // Full Number Formatting
  const decimals = options?.hideDecimals ? 0 : 2;

  if (currency === 'INR') {
    // Format using Indian locale (en-IN)
    const formatted = absAmount.toLocaleString('en-IN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
    return `${isNegative ? '-' : ''}₹${formatted}`;
  } else {
    // US Format (en-US)
    const formatted = absAmount.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
    return `${isNegative ? '-' : ''}$${formatted}`;
  }
}

/**
 * Format Indian GSTIN number with state name
 */
export function getIndianStateFromGSTIN(gstin: string): string {
  const stateCode = gstin.substring(0, 2);
  const stateMap: Record<string, string> = {
    '01': 'Jammu & Kashmir',
    '02': 'Himachal Pradesh',
    '03': 'Punjab',
    '04': 'Chandigarh',
    '06': 'Haryana',
    '07': 'Delhi',
    '08': 'Rajasthan',
    '09': 'Uttar Pradesh',
    '19': 'West Bengal',
    '23': 'Madhya Pradesh',
    '24': 'Gujarat',
    '27': 'Maharashtra',
    '29': 'Karnataka',
    '32': 'Kerala',
    '33': 'Tamil Nadu',
    '36': 'Telangana',
    '37': 'Andhra Pradesh'
  };
  return stateMap[stateCode] || 'Other State';
}

