import fs from 'fs';

const khataCode = `import React, { useState, useEffect } from 'react';
import { IndianRupee, Plus, Trash2, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { Language } from '../../types';

interface DailyKhataProps {
  language: Language;
}

interface KhataEntry {
  id: string;
  date: string;
  type: 'income' | 'expense';
  customerName: string; // for expense, this could be "Vendor" or "Category"
  phone?: string;
  serviceName: string; // for expense, this is "Description"
  amount: number;
  status: 'paid' | 'pending';
}

export const DailyKhata: React.FC<DailyKhataProps> = ({ language }) => {
  const isHindi = language === 'hi';
  const [entries, setEntries] = useState<KhataEntry[]>(() => {
    const saved = localStorage.getItem('daily_khata');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migrate old entries
      return parsed.map((e: any) => ({
        ...e,
        type: e.type || 'income'
      }));
    }
    return [];
  });
  
  const [newEntry, setNewEntry] = useState<Partial<KhataEntry>>({ type: 'income', status: 'paid' });

  useEffect(() => {
    localStorage.setItem('daily_khata', JSON.stringify(entries));
  }, [entries]);

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.customerName || !newEntry.serviceName || !newEntry.amount) return;
    
    const entry: KhataEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      type: newEntry.type as 'income' | 'expense',
      customerName: newEntry.customerName,
      phone: newEntry.phone || '',
      serviceName: newEntry.serviceName,
      amount: Number(newEntry.amount),
      status: newEntry.status as 'paid' | 'pending'
    };
    
    setEntries([entry, ...entries]);
    setNewEntry({ type: 'income', status: 'paid', customerName: '', phone: '', serviceName: '', amount: '' as any });
  };

  const toggleStatus = (id: string) => {
    setEntries(entries.map(e => e.id === id ? { ...e, status: e.status === 'paid' ? 'pending' : 'paid' } : e));
  };
  
  const deleteEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  // Only calculate for Income
  const totalEarnings = entries.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0);
  const totalReceived = entries.filter(e => e.type === 'income' && e.status === 'paid').reduce((sum, e) => sum + e.amount, 0);
  const totalPending = entries.filter(e => e.type === 'income' && e.status === 'pending').reduce((sum, e) => sum + e.amount, 0);

  // Calculate for Expense
  const totalExpense = entries.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);
  
  // Net Profit (Total Received - Total Expense)
  const netProfit = totalReceived - totalExpense;

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{isHindi ? 'डेली खाता और मुनाफ़ा ट्रैकर' : 'Daily Khata & Profit Tracker'}</h2>
            <p className="text-xs text-slate-500">{isHindi ? 'अपनी रोज़ाना की कमाई, खर्चे और असली मुनाफ़ा ट्रैक करें।' : 'Track daily earnings, expenses, and net profit.'}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl shadow-sm">
          <div className="text-slate-500 text-xs font-bold uppercase mb-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> {isHindi ? 'कुल कमाई' : 'Total Earnings'}
          </div>
          <div className="text-2xl font-black text-slate-800 flex items-center">₹ {totalEarnings}</div>
          <div className="text-[10px] font-semibold text-rose-500 mt-1">₹ {totalPending} {isHindi ? 'उधार' : 'Pending'}</div>
        </div>
        
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl shadow-sm">
          <div className="text-emerald-700 text-xs font-bold uppercase mb-1">{isHindi ? 'प्राप्त हुआ' : 'Cash Received'}</div>
          <div className="text-2xl font-black text-emerald-700 flex items-center">₹ {totalReceived}</div>
        </div>

        <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl shadow-sm">
          <div className="text-rose-700 text-xs font-bold uppercase mb-1 flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5" /> {isHindi ? 'कुल खर्च' : 'Total Expense'}
          </div>
          <div className="text-2xl font-black text-rose-700 flex items-center">₹ {totalExpense}</div>
        </div>

        <div className={\`p-4 rounded-2xl shadow-sm border \${netProfit >= 0 ? 'bg-gradient-to-br from-blue-500 to-blue-600 border-blue-600 text-white' : 'bg-gradient-to-br from-red-500 to-red-600 border-red-600 text-white'}\`}>
          <div className="text-white/80 text-xs font-bold uppercase mb-1">{isHindi ? 'असली मुनाफ़ा' : 'Net Profit'}</div>
          <div className="text-2xl font-black flex items-center">₹ {netProfit}</div>
          <div className="text-[10px] font-medium text-white/80 mt-1">{isHindi ? '(प्राप्त - खर्च)' : '(Received - Expense)'}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-4">{isHindi ? 'नया एंट्री जोड़ें' : 'Add New Entry'}</h3>
          
          <div className="flex bg-slate-100 rounded-lg p-1 mb-4">
            <button 
              onClick={() => setNewEntry({...newEntry, type: 'income'})}
              className={\`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors \${newEntry.type === 'income' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500'}\`}
            >
              {isHindi ? 'कमाई (Income)' : 'Income'}
            </button>
            <button 
              onClick={() => setNewEntry({...newEntry, type: 'expense'})}
              className={\`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors \${newEntry.type === 'expense' ? 'bg-white shadow-sm text-rose-600' : 'text-slate-500'}\`}
            >
              {isHindi ? 'खर्चा (Expense)' : 'Expense'}
            </button>
          </div>

          <form onSubmit={handleAddEntry} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">{newEntry.type === 'income' ? (isHindi ? 'ग्राहक का नाम' : 'Customer Name') : (isHindi ? 'खर्च की श्रेणी' : 'Expense Type')}</label>
                <input type="text" value={newEntry.customerName || ''} onChange={e => setNewEntry({...newEntry, customerName: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" placeholder={newEntry.type === 'expense' ? (isHindi ? 'जैसे- चाय, पेपर' : 'e.g. Tea, Paper') : ''} required />
              </div>
              {newEntry.type === 'income' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">{isHindi ? 'मोबाइल (WhatsApp)' : 'Mobile'}</label>
                  <input type="tel" value={newEntry.phone || ''} onChange={e => setNewEntry({...newEntry, phone: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" placeholder="10 digits" />
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">{newEntry.type === 'income' ? (isHindi ? 'सेवा का नाम' : 'Service Name') : (isHindi ? 'खर्च का विवरण' : 'Expense Details')}</label>
              <input type="text" value={newEntry.serviceName || ''} onChange={e => setNewEntry({...newEntry, serviceName: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" placeholder={isHindi ? (newEntry.type === 'income' ? 'जैसे- पैन कार्ड, प्रिंटिंग' : 'जैसे- इंक रीफिल') : (newEntry.type === 'income' ? 'e.g., PAN Card, Print' : 'e.g., Ink Refill')} required />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">{isHindi ? 'रकम (Amount)' : 'Amount (₹)'}</label>
                <input type="number" value={newEntry.amount || ''} onChange={e => setNewEntry({...newEntry, amount: Number(e.target.value)})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">{isHindi ? 'स्टेटस' : 'Status'}</label>
                <select value={newEntry.status} onChange={e => setNewEntry({...newEntry, status: e.target.value as any})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold">
                  <option value="paid">{newEntry.type === 'income' ? (isHindi ? 'प्राप्त (Paid)' : 'Received') : (isHindi ? 'चुकाया (Paid)' : 'Paid')}</option>
                  <option value="pending">{isHindi ? 'उधार (Pending)' : 'Pending'}</option>
                </select>
              </div>
            </div>

            <button type="submit" className={\`w-full py-2.5 font-bold rounded-lg text-sm transition-colors flex items-center justify-center gap-2 text-white \${newEntry.type === 'income' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'}\`}>
              <Plus className="w-4 h-4" /> {isHindi ? 'जोड़ें (Add)' : 'Add Entry'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">{isHindi ? 'हाल ही के लेनदेन (Recent Transactions)' : 'Recent Transactions'}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-600 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3">{isHindi ? 'प्रकार' : 'Type'}</th>
                  <th className="px-4 py-3">{isHindi ? 'विवरण' : 'Details'}</th>
                  <th className="px-4 py-3">{isHindi ? 'रकम' : 'Amount'}</th>
                  <th className="px-4 py-3">{isHindi ? 'स्टेटस' : 'Status'}</th>
                  <th className="px-4 py-3 text-right">{isHindi ? 'एक्शन' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {entries.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                      {isHindi ? 'अभी तक कोई खाता नहीं जुड़ा है।' : 'No entries added yet.'}
                    </td>
                  </tr>
                ) : entries.map(entry => (
                  <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      {entry.type === 'income' ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded w-fit">
                          <TrendingUp className="w-3 h-3" /> IN
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded w-fit">
                          <TrendingDown className="w-3 h-3" /> OUT
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-800">{entry.customerName}</div>
                      <div className="text-[10px] text-slate-500">{entry.serviceName} {entry.phone && \`• \${entry.phone}\`}</div>
                    </td>
                    <td className={\`px-4 py-3 font-bold \${entry.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}\`}>
                      {entry.type === 'income' ? '+' : '-'}₹{entry.amount}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleStatus(entry.id)} className={\`px-2 py-1 text-[10px] font-bold rounded-full uppercase tracking-wide border \${entry.status === 'paid' ? (entry.type === 'income' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-700 border-slate-300') : 'bg-rose-50 text-rose-700 border-rose-200'}\`}>
                        {entry.status === 'paid' ? (isHindi ? 'चुकाया' : 'Paid') : (isHindi ? 'उधार' : 'Pending')}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => deleteEntry(entry.id)} className="text-slate-400 hover:text-rose-500 transition-colors p-1" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
`
fs.writeFileSync('src/components/tools/DailyKhata.tsx', khataCode);
