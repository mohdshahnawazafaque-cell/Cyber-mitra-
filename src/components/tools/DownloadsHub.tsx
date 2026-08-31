import React, { useState } from 'react';
import { Download, FileText, MonitorDown, FileIcon, ShieldCheck } from 'lucide-react';
import { Language } from '../../types';

interface DownloadsHubProps {
  language: Language;
}

export const DownloadsHub: React.FC<DownloadsHubProps> = ({ language }) => {
  const isHindi = language === 'hi';
  const [activeTab, setActiveTab] = useState<'forms' | 'drivers'>('forms');

  const forms = [
    { title: 'Aadhaar Update Form (Blank)', desc: 'Official UIDAI Aadhaar Enrolment/Update Form', size: '1.2 MB' },
    { title: 'PAN Card Form 93 (New 2026)', desc: 'New Application for Allotment of Permanent Account Number (Updated 2026)', size: '1.1 MB' },
    { title: 'Income Certificate Declaration', desc: 'Self Declaration for Income Certificate (UP)', size: '400 KB' },
    { title: 'SBI Account Opening Form', desc: 'State Bank of India Savings Account Form', size: '2.1 MB' },
    { title: 'RTGS / NEFT Slip (General)', desc: 'Standard slip for bank money transfer', size: '250 KB' }
  ];

  const drivers = [
    { title: 'Morpho RD Service Windows', desc: 'Morpho SCL RD Service & Driver (v2.0.1.60)', version: '2.0.1.60', type: 'Fingerprint' },
    { title: 'Mantra MFS100 RD Service', desc: 'Mantra RD Service and Driver for Windows', version: '1.0.8', type: 'Fingerprint' },
    { title: 'Startek FM220 RD Service', desc: 'Startek Biometric Device Drivers', version: '1.5.0', type: 'Fingerprint' },
    { title: 'AnyDesk Remote Support', desc: 'Remote desktop software for quick support', version: '8.0.0', type: 'Utility' },
    { title: 'WinRAR Archive Tool', desc: 'File compression utility', version: '6.23', type: 'Utility' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-5 border-b border-slate-100 pb-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {isHindi ? 'ऑफ़लाइन फॉर्म और RD सर्विस हब' : 'Offline Forms & RD Services Hub'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {isHindi ? 'ज़रूरी खाली फॉर्म और बायोमेट्रिक डिवाइस के सॉफ्टवेयर डाउनलोड करें।' : 'Download essential blank forms and biometric device drivers.'}
            </p>
          </div>
        </div>

        <div className="flex border-b border-slate-200 mb-6">
          <button
            onClick={() => setActiveTab('forms')}
            className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'forms' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" /> {isHindi ? 'महत्वपूर्ण फॉर्म्स (Forms)' : 'Important Forms'}
          </button>
          <button
            onClick={() => setActiveTab('drivers')}
            className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'drivers' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MonitorDown className="w-4 h-4" /> {isHindi ? 'बायोमेट्रिक RD सर्विस (Drivers)' : 'RD Services & Drivers'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeTab === 'forms' ? (
            forms.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-indigo-300 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center text-rose-500">
                    <FileIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{item.title}</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">{item.desc} • {item.size}</p>
                  </div>
                </div>
                <button className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-lg transition-colors" title="Download">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            drivers.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-indigo-300 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center text-blue-600">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{item.title}</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">{item.type} • v{item.version}</p>
                  </div>
                </div>
                <button className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-lg transition-colors" title="Download">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
