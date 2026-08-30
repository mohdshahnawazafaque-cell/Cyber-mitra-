import React, { useState } from 'react';
import { Calculator, Calendar, Percent, IndianRupee } from 'lucide-react';
import { Language } from '../../types';

interface CalculatorHubProps {
  language: Language;
}

export const CalculatorHub: React.FC<CalculatorHubProps> = ({ language }) => {
  const isHindi = language === 'hi';
  const [activeTab, setActiveTab] = useState<'age' | 'emi' | 'gst' | 'land'>('age');

  // Age Calculator State
  const [dob, setDob] = useState<string>('');
  const [ageResult, setAgeResult] = useState<{ years: number; months: number; days: number } | null>(null);

  // EMI Calculator State
  const [loanAmount, setLoanAmount] = useState<string>('100000');
  const [interestRate, setInterestRate] = useState<string>('8.5');
  const [loanTenure, setLoanTenure] = useState<string>('5');
  const [emiResult, setEmiResult] = useState<{ emi: number; totalInterest: number; totalPayment: number } | null>(null);

  // GST Calculator State
  const [baseAmount, setBaseAmount] = useState<string>('1000');
  const [gstRate, setGstRate] = useState<string>('18');
  const [gstResult, setGstResult] = useState<{ gstAmount: number; totalAmount: number } | null>(null);

  // Land Calculator State
  const [landArea, setLandArea] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<string>('acre');
  const [toUnit, setToUnit] = useState<string>('bigha_up');
  const [landResult, setLandResult] = useState<{ value: number; unitStr: string } | null>(null);

  const calculateAge = () => {
    if (!dob) return;
    const birthDate = new Date(dob);
    const today = new Date();
    
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (months < 0 || (months === 0 && days < 0)) {
      years--;
      months += 12;
    }
    if (days < 0) {
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
      months--;
    }
    setAgeResult({ years, months, days });
  };

  const calculateEmi = () => {
    const p = parseFloat(loanAmount);
    const r = parseFloat(interestRate) / 12 / 100;
    const n = parseFloat(loanTenure) * 12;

    if (!p || !r || !n) return;

    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - p;

    setEmiResult({ emi, totalInterest, totalPayment });
  };

  const calculateGst = () => {
    const amt = parseFloat(baseAmount);
    const rate = parseFloat(gstRate);
    if (!amt || !rate) return;

    const gstAmount = (amt * rate) / 100;
    const totalAmount = amt + gstAmount;

    setGstResult({ gstAmount, totalAmount });
  };

  const calculateLand = () => {
    const val = parseFloat(landArea);
    if (!val) return;

    // Convert everything to square feet first as a base unit
    // Note: Bigha size varies widely by region. These are approximate for some regions in India (like UP).
    const conversionToSqFt: Record<string, number> = {
      sqft: 1,
      sqmeter: 10.7639,
      acre: 43560,
      hectare: 107639,
      bigha_up: 27000, // Common in UP (approx 2508 sq m)
      bigha_mp: 12000,
      biswa_up: 1350, // 1/20th of UP Bigha
      gaj: 9, // 1 Gaj (Square Yard) = 9 sq ft
    };

    const baseInSqFt = val * (conversionToSqFt[fromUnit] || 1);
    const finalVal = baseInSqFt / (conversionToSqFt[toUnit] || 1);

    const unitLabels: Record<string, string> = {
      sqft: isHindi ? 'वर्ग फुट' : 'Sq Ft',
      sqmeter: isHindi ? 'वर्ग मीटर' : 'Sq Meter',
      acre: isHindi ? 'एकड़' : 'Acre',
      hectare: isHindi ? 'हेक्टेयर' : 'Hectare',
      bigha_up: isHindi ? 'बीघा (UP)' : 'Bigha (UP)',
      bigha_mp: isHindi ? 'बीघा (MP/Other)' : 'Bigha (MP)',
      biswa_up: isHindi ? 'बिस्वा (UP)' : 'Biswa (UP)',
      gaj: isHindi ? 'गज (Sq Yard)' : 'Gaj (Sq Yard)',
    };

    setLandResult({ value: finalVal, unitStr: unitLabels[toUnit] || toUnit });
  };

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shadow-sm">
          <Calculator className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-800">
            {isHindi ? 'स्मार्ट कैलकुलेटर हब' : 'Smart Calculator Hub'}
          </h2>
          <p className="text-sm text-slate-500">
            {isHindi ? 'सभी वित्तीय और सामान्य कैलकुलेटर' : 'All financial and general calculators'}
          </p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('age')}
          className={`px-4 py-2 font-bold text-sm rounded-t-lg border-b-2 transition-all ${
            activeTab === 'age' ? 'border-blue-600 text-blue-700 bg-blue-50' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          {isHindi ? 'आयु (Age)' : 'Age Calculator'}
        </button>
        <button
          onClick={() => setActiveTab('emi')}
          className={`px-4 py-2 font-bold text-sm rounded-t-lg border-b-2 transition-all ${
            activeTab === 'emi' ? 'border-blue-600 text-blue-700 bg-blue-50' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          {isHindi ? 'लोन EMI' : 'Loan EMI'}
        </button>
        <button
          onClick={() => setActiveTab('gst')}
          className={`px-4 py-2 font-bold text-sm rounded-t-lg border-b-2 transition-all ${
            activeTab === 'gst' ? 'border-blue-600 text-blue-700 bg-blue-50' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          {isHindi ? 'GST टैक्स' : 'GST Tax'}
        </button>
        <button
          onClick={() => setActiveTab('land')}
          className={`px-4 py-2 font-bold text-sm rounded-t-lg border-b-2 transition-all ${
            activeTab === 'land' ? 'border-blue-600 text-blue-700 bg-blue-50' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          {isHindi ? 'भूमि (Land)' : 'Land'}
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        {activeTab === 'age' && (
          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">{isHindi ? 'जन्म तिथि (DOB)' : 'Date of Birth'}</label>
              <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg" />
            </div>
            <button onClick={calculateAge} className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors">
              {isHindi ? 'गणना करें (Calculate)' : 'Calculate'}
            </button>
            {ageResult && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mt-4 text-center">
                <p className="text-2xl font-black text-blue-800">
                  {ageResult.years} <span className="text-sm font-semibold">{isHindi ? 'वर्ष' : 'Years'}</span>, {ageResult.months} <span className="text-sm font-semibold">{isHindi ? 'माह' : 'Months'}</span>, {ageResult.days} <span className="text-sm font-semibold">{isHindi ? 'दिन' : 'Days'}</span>
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'emi' && (
          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">{isHindi ? 'लोन की राशि (₹)' : 'Loan Amount (₹)'}</label>
              <input type="number" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">{isHindi ? 'ब्याज दर (% प्रति वर्ष)' : 'Interest Rate (% p.a.)'}</label>
              <input type="number" step="0.1" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">{isHindi ? 'अवधि (वर्ष)' : 'Tenure (Years)'}</label>
              <input type="number" value={loanTenure} onChange={(e) => setLoanTenure(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg" />
            </div>
            <button onClick={calculateEmi} className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors">
              {isHindi ? 'EMI निकालें' : 'Calculate EMI'}
            </button>
            {emiResult && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mt-4 space-y-2">
                <div className="flex justify-between border-b border-blue-200 pb-2">
                  <span className="font-semibold text-slate-600">{isHindi ? 'मासिक किश्त (Monthly EMI)' : 'Monthly EMI'}</span>
                  <span className="font-black text-blue-800 text-lg">₹{Math.round(emiResult.emi).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">{isHindi ? 'कुल ब्याज' : 'Total Interest'}</span>
                  <span className="font-bold text-slate-800">₹{Math.round(emiResult.totalInterest).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">{isHindi ? 'कुल भुगतान' : 'Total Payment'}</span>
                  <span className="font-bold text-slate-800">₹{Math.round(emiResult.totalPayment).toLocaleString('en-IN')}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'gst' && (
          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">{isHindi ? 'मूल राशि (Base Amount)' : 'Base Amount'}</label>
              <input type="number" value={baseAmount} onChange={(e) => setBaseAmount(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">{isHindi ? 'GST दर (%)' : 'GST Rate (%)'}</label>
              <select value={gstRate} onChange={(e) => setGstRate(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg">
                <option value="5">5%</option>
                <option value="12">12%</option>
                <option value="18">18%</option>
                <option value="28">28%</option>
              </select>
            </div>
            <button onClick={calculateGst} className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors">
              {isHindi ? 'GST निकालें' : 'Calculate GST'}
            </button>
            {gstResult && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">{isHindi ? 'GST राशि' : 'GST Amount'}</span>
                  <span className="font-bold text-emerald-800">₹{gstResult.gstAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-emerald-200 pt-2">
                  <span className="font-semibold text-slate-800">{isHindi ? 'कुल राशि (Total)' : 'Total Amount'}</span>
                  <span className="font-black text-emerald-800 text-lg">₹{gstResult.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'land' && (
          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">{isHindi ? 'भूमि का क्षेत्रफल (Area)' : 'Land Area'}</label>
              <input type="number" value={landArea} onChange={(e) => setLandArea(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">{isHindi ? 'इसमें से (From Unit)' : 'From Unit'}</label>
                <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg text-sm">
                  <option value="sqft">वर्ग फुट (Sq ft)</option>
                  <option value="sqmeter">वर्ग मीटर (Sq m)</option>
                  <option value="acre">एकड़ (Acre)</option>
                  <option value="hectare">हेक्टेयर (Hectare)</option>
                  <option value="bigha_up">बीघा - यूपी (Bigha UP)</option>
                  <option value="bigha_mp">बीघा - एमपी (Bigha MP)</option>
                  <option value="biswa_up">बिस्वा - यूपी (Biswa UP)</option>
                  <option value="gaj">गज (Sq Yard)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">{isHindi ? 'इसमें बदलें (To Unit)' : 'To Unit'}</label>
                <select value={toUnit} onChange={(e) => setToUnit(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg text-sm">
                  <option value="sqft">वर्ग फुट (Sq ft)</option>
                  <option value="sqmeter">वर्ग मीटर (Sq m)</option>
                  <option value="acre">एकड़ (Acre)</option>
                  <option value="hectare">हेक्टेयर (Hectare)</option>
                  <option value="bigha_up">बीघा - यूपी (Bigha UP)</option>
                  <option value="bigha_mp">बीघा - एमपी (Bigha MP)</option>
                  <option value="biswa_up">बिस्वा - यूपी (Biswa UP)</option>
                  <option value="gaj">गज (Sq Yard)</option>
                </select>
              </div>
            </div>
            <button onClick={calculateLand} className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors">
              {isHindi ? 'बदलें (Convert)' : 'Convert'}
            </button>
            {landResult && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mt-4 text-center">
                <p className="text-sm text-slate-600 font-semibold mb-1">{isHindi ? 'परिणाम' : 'Result'}</p>
                <p className="text-2xl font-black text-amber-800">
                  {landResult.value.toLocaleString(undefined, { maximumFractionDigits: 4 })} <span className="text-sm">{landResult.unitStr}</span>
                </p>
                <p className="text-xs text-amber-700/70 mt-2">
                  * Note: Local units (Bigha, Biswa) vary by state/region. Results are estimates based on standard UP metrics.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};