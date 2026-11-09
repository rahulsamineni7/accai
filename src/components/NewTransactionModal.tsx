import React, { useState } from 'react';
import { useDigits } from '../context/DigitsContext';
import { DollarSign, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const NewTransactionModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { addTransaction, chartOfAccounts } = useDigits();

  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [merchant, setMerchant] = useState('');
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [isExpense, setIsExpense] = useState(true);
  const [account, setAccount] = useState('Chase Operating (#4819)');
  const [categoryName, setCategoryName] = useState(
    chartOfAccounts.find((a) => a.category === 'Expense')?.name || ''
  );
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchant || !amount) return;

    const numericAmount = parseFloat(amount) || 0;
    const finalAmount = isExpense ? -Math.abs(numericAmount) : Math.abs(numericAmount);

    const chosenAccount = chartOfAccounts.find((a) => a.name === categoryName);

    addTransaction({
      date,
      merchant,
      description: desc || merchant,
      amount: finalAmount,
      account,
      category: categoryName,
      glAccountCode: chosenAccount ? chosenAccount.code : '6020',
      status: 'Categorized',
      aiConfidence: 100,
      aiModel: 'Manual Accountant Entry',
      notes
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-150">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md glass-panel rounded-3xl p-6 space-y-4 shadow-2xl border border-white/50"
      >
        <div className="flex items-center justify-between border-b border-white/20 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-white/25 border border-white/40 flex items-center justify-center text-digits-neonGreen shadow-glass-pill">
              <DollarSign className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">Post Ledger Transaction</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full glass-pill flex items-center justify-center text-white/80 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {/* Inflow vs Outflow toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-full glass-pill">
            <button
              type="button"
              onClick={() => setIsExpense(true)}
              className={`py-1.5 rounded-full text-xs font-semibold transition-all ${
                isExpense
                  ? 'bg-digits-orange/30 text-digits-orange border border-digits-orange/50 shadow-glass-pill'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Money Out (Expense)
            </button>
            <button
              type="button"
              onClick={() => setIsExpense(false)}
              className={`py-1.5 rounded-full text-xs font-semibold transition-all ${
                !isExpense
                  ? 'bg-digits-neonGreen/30 text-digits-neonGreen border border-digits-neonGreen/50 shadow-glass-pill'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Money In (Revenue)
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-semibold text-white/70 uppercase tracking-wider">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full mt-1 glass-input rounded-2xl px-3.5 py-2 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-white/70 uppercase tracking-wider">Amount ($)</label>
              <input
                type="number"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="4250.00"
                className="w-full mt-1 glass-input rounded-2xl px-3.5 py-2 text-xs text-white font-mono font-bold"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-white/70 uppercase tracking-wider">Merchant / Payee</label>
            <input
              type="text"
              required
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              placeholder="e.g. Snowflake Inc or Anthropic"
              className="w-full mt-1 glass-input rounded-2xl px-3.5 py-2 text-xs text-white"
            />
          </div>

          <div>
            <label className="text-[10px] font-semibold text-white/70 uppercase tracking-wider">Raw Bank Feed Text</label>
            <input
              type="text"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="SNOWFLAKE COMPUTING INC SAN MATEO CA"
              className="w-full mt-1 glass-input rounded-2xl px-3.5 py-2 text-xs text-white font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-semibold text-white/70 uppercase tracking-wider">Account</label>
              <select
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                className="w-full mt-1 glass-input rounded-2xl px-3.5 py-2 text-xs text-white bg-transparent"
              >
                <option value="Chase Operating (#4819)" className="bg-[#1b3b2b] text-white">Chase Operating (#4819)</option>
                <option value="Mercury Treasury (#9921)" className="bg-[#1b3b2b] text-white">Mercury Treasury (#9921)</option>
                <option value="Brex Corporate Card (#8842)" className="bg-[#1b3b2b] text-white">Brex Corporate Card (#8842)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-white/70 uppercase tracking-wider">Category</label>
              <select
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full mt-1 glass-input rounded-2xl px-3.5 py-2 text-xs text-white bg-transparent"
              >
                {chartOfAccounts
                  .filter((a) => (isExpense ? a.category === 'Expense' || a.category === 'COGS' : a.category === 'Revenue'))
                  .map((a) => (
                    <option key={a.id} value={a.name} className="bg-[#1b3b2b] text-white">
                      {a.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-white/70 uppercase tracking-wider">Notes & Purpose</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Audit explanation or project reference"
              className="w-full mt-1 glass-input rounded-2xl px-3.5 py-2 text-xs text-white"
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-white/20">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full glass-pill text-xs font-medium text-white/80 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-full bg-digits-neonGreen text-[#0a2e1d] font-bold text-xs hover:brightness-110 shadow-glass-pill"
          >
            Record Entry
          </button>
        </div>
      </form>
    </div>
  );
};
