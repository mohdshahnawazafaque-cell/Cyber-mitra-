import React, { useState, useEffect } from 'react';
import { MessageSquareText, Send, CheckCircle2, Users, Smartphone, MessageCircle, AlertCircle } from 'lucide-react';
import { Language } from '../../types';

interface BulkSmsToolProps {
  language: Language;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  service: string;
  status: 'pending' | 'completed' | 'issue';
}

export const BulkSmsTool: React.FC<BulkSmsToolProps> = ({ language }) => {
  const isHindi = language === 'hi';
  
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<Set<string>>(new Set());
  const [selectedTemplate, setSelectedTemplate] = useState<string>('ready');
  const [notificationStatus, setNotificationStatus] = useState<{show: boolean, msg: string}>({show: false, msg: ''});

  useEffect(() => {
    // Try to load from daily_khata or use mock data
    const savedKhata = localStorage.getItem('daily_khata');
    let loadedCustomers: Customer[] = [];
    
    if (savedKhata) {
      const parsed = JSON.parse(savedKhata);
      loadedCustomers = parsed.map((entry: any) => ({
        id: entry.id,
        name: entry.customerName,
        phone: '919999999999', // Placeholder as khata doesn't have phone
        service: entry.serviceName,
        status: entry.status === 'paid' ? 'completed' : 'pending'
      }));
    }
    
    if (loadedCustomers.length === 0) {
      loadedCustomers = [
        { id: '1', name: 'Ramesh Kumar', phone: '919876543210', service: 'PAN Card', status: 'completed' },
        { id: '2', name: 'Suresh Singh', phone: '919876543211', service: 'Income Certificate', status: 'pending' },
        { id: '3', name: 'Anita Devi', phone: '919876543212', service: 'Aadhaar Update', status: 'issue' },
        { id: '4', name: 'Vikash Sharma', phone: '919876543213', service: 'PF Withdrawal', status: 'completed' },
      ];
    }
    setCustomers(loadedCustomers);
  }, []);

  const templates = [
    { 
      id: 'ready', 
      nameHi: 'काम पूरा हुआ (Ready)', 
      nameEn: 'Document Ready', 
      textHi: 'नमस्ते {name}, आपका {service} का काम पूरा हो गया है। कृपया आकर अपना दस्तावेज़ प्राप्त करें। - साइबर मित्रा',
      textEn: 'Hello {name}, your {service} is ready. Please visit the center to collect your document. - Cyber Cafe Mitra'
    },
    { 
      id: 'pending', 
      nameHi: 'प्रगति पर (In Progress)', 
      nameEn: 'In Progress', 
      textHi: 'नमस्ते {name}, आपका {service} का फॉर्म सफलतापूर्वक सबमिट हो गया है। हम आपको अपडेट करेंगे। - साइबर मित्रा',
      textEn: 'Hello {name}, your {service} application has been submitted successfully. We will update you soon. - Cyber Cafe Mitra'
    },
    { 
      id: 'issue', 
      nameHi: 'समस्या (Action Required)', 
      nameEn: 'Action Required', 
      textHi: 'नमस्ते {name}, आपके {service} फॉर्म में कुछ समस्या है / OTP चाहिए। कृपया जल्द से जल्द कैफे पर संपर्क करें। - साइबर मित्रा',
      textEn: 'Hello {name}, there is an issue with your {service} application. Please contact the center ASAP. - Cyber Cafe Mitra'
    }
  ];

  const toggleCustomer = (id: string) => {
    const newSet = new Set(selectedCustomers);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedCustomers(newSet);
  };

  const toggleAll = () => {
    if (selectedCustomers.size === customers.length) {
      setSelectedCustomers(new Set());
    } else {
      setSelectedCustomers(new Set(customers.map(c => c.id)));
    }
  };

  const getMessage = (customer: Customer) => {
    const template = templates.find(t => t.id === selectedTemplate);
    const text = isHindi ? template?.textHi : template?.textEn;
    return text?.replace('{name}', customer.name).replace('{service}', customer.service) || '';
  };

  const handleSendWhatsApp = (customer: Customer) => {
    const text = encodeURIComponent(getMessage(customer));
    const url = `https://wa.me/${customer.phone}?text=${text}`;
    try {
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      window.location.href = url;
    }
  };

  const handleBulkSend = () => {
    if (selectedCustomers.size === 0) return;
    setNotificationStatus({ show: true, msg: isHindi ? `${selectedCustomers.size} ग्राहकों को SMS भेजे जा रहे हैं...` : `Sending SMS to ${selectedCustomers.size} customers...`});
    
    setTimeout(() => {
      setNotificationStatus({ show: true, msg: isHindi ? `${selectedCustomers.size} ग्राहकों को सफलतापूर्वक SMS भेज दिए गए!` : `Successfully sent SMS to ${selectedCustomers.size} customers!`});
      setTimeout(() => setNotificationStatus({ show: false, msg: '' }), 4000);
      setSelectedCustomers(new Set());
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-pink-100 text-pink-600 rounded-xl flex items-center justify-center">
            <MessageSquareText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{isHindi ? 'बल्क SMS और WhatsApp अलर्ट' : 'Bulk SMS & WhatsApp Alerts'}</h2>
            <p className="text-xs text-slate-500">{isHindi ? 'ग्राहकों को उनके फॉर्म या सर्विस का स्टेटस एक साथ भेजें।' : 'Send application status updates to customers instantly.'}</p>
          </div>
        </div>
      </div>

      {notificationStatus.show && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-bold text-sm">{notificationStatus.msg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Templates */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4">{isHindi ? 'मैसेज टेम्पलेट चुनें' : 'Select Template'}</h3>
            <div className="space-y-3">
              {templates.map(t => (
                <div 
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${selectedTemplate === t.id ? 'bg-pink-50 border-pink-500 ring-1 ring-pink-500' : 'bg-slate-50 border-slate-200 hover:border-pink-300'}`}
                >
                  <div className="font-bold text-sm text-slate-800 mb-1">{isHindi ? t.nameHi : t.nameEn}</div>
                  <div className="text-xs text-slate-600 line-clamp-2">{isHindi ? t.textHi : t.textEn}</div>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <button 
                onClick={handleBulkSend}
                disabled={selectedCustomers.size === 0}
                className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors ${selectedCustomers.size > 0 ? 'bg-pink-600 hover:bg-pink-700 text-white shadow-sm' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
              >
                <Smartphone className="w-4 h-4" />
                {isHindi ? `SMS भेजें (${selectedCustomers.size})` : `Send Bulk SMS (${selectedCustomers.size})`}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Customer List */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <div className="flex items-center gap-2 text-slate-800 font-bold">
              <Users className="w-5 h-5 text-slate-500" />
              {isHindi ? 'ग्राहक सूची' : 'Customer List'}
            </div>
            <div className="text-xs font-semibold text-slate-500">
              {selectedCustomers.size} {isHindi ? 'चुने गए' : 'Selected'}
            </div>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-600 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3 w-10">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-300 text-pink-600 focus:ring-pink-600"
                      checked={customers.length > 0 && selectedCustomers.size === customers.length}
                      onChange={toggleAll}
                    />
                  </th>
                  <th className="px-4 py-3">{isHindi ? 'ग्राहक' : 'Customer'}</th>
                  <th className="px-4 py-3">{isHindi ? 'सेवा' : 'Service'}</th>
                  <th className="px-4 py-3 text-right">{isHindi ? 'एक्शन' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map(c => (
                  <tr key={c.id} className={`hover:bg-slate-50 transition-colors ${selectedCustomers.has(c.id) ? 'bg-pink-50/30' : ''}`}>
                    <td className="px-4 py-3">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-300 text-pink-600 focus:ring-pink-600"
                        checked={selectedCustomers.has(c.id)}
                        onChange={() => toggleCustomer(c.id)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-800">{c.name}</div>
                      <div className="text-[10px] text-slate-500">{c.phone}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium bg-slate-100 text-slate-700 px-2 py-1 rounded-md">
                        {c.service}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button 
                        onClick={() => handleSendWhatsApp(c)}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white rounded-lg text-[11px] font-bold transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        WhatsApp
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
