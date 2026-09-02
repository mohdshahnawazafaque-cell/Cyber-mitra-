import React, { useState, useRef, useEffect } from 'react';
import { FileText, Plus, Trash2, Printer, Download, Settings, RefreshCw, X, Receipt, ImagePlus, Upload, Share2 } from 'lucide-react';
import { Language } from '../../types';
import { compressToTargetKB } from '../../utils/imageUtils';

interface InvoiceGeneratorProps {
  language: Language;
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export const InvoiceGenerator: React.FC<InvoiceGeneratorProps> = ({ language }) => {
  const isHindi = language === 'hi';
  const printRef = useRef<HTMLDivElement>(null);

  const [businessInfo, setBusinessInfo] = useState(() => {
    const saved = localStorage.getItem('cyberMitra_businessInfo');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      name: '',
      address: '',
      phone: '',
      email: '',
      gstin: '',
      logo: ''
    };
  });

  useEffect(() => {
    localStorage.setItem('cyberMitra_businessInfo', JSON.stringify(businessInfo));
  }, [businessInfo]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64 = reader.result as string;
          // Compress logo to max 50KB to save local storage quota
          const compressed = await compressToTargetKB(base64, 50, 'image/jpeg');
          setBusinessInfo(prev => ({ ...prev, logo: compressed.dataUrl }));
        } catch (err) {
          console.error("Logo compression failed:", err);
          setBusinessInfo(prev => ({ ...prev, logo: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    invoiceNo: `INV-${Math.floor(Date.now() / 1000)}`,
    date: new Date().toISOString().split('T')[0]
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: isHindi ? 'ऑनलाइन फॉर्म शुल्क' : 'Online Form Fill', quantity: 1, rate: 50 }
  ]);

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), description: '', quantity: 1, rate: 0 }]);
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  };

  
  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;
    
    const previous = document.getElementById('temp-print-container');
    if (previous) previous.remove();
    const previousStyle = document.getElementById('temp-print-style');
    if (previousStyle) previousStyle.remove();

    const printContainer = document.createElement('div');
    printContainer.id = 'temp-print-container';
    printContainer.innerHTML = printContent.outerHTML;
    document.body.appendChild(printContainer);
    
    const style = document.createElement('style');
    style.id = 'temp-print-style';
    style.innerHTML = `
      @media print {
        body > *:not(#temp-print-container) { display: none !important; }
        #temp-print-container {
          display: block !important; position: absolute; left: 0; top: 0; width: 100%;
          background: white; margin: 0; padding: 0;
        }
        #temp-print-container > div {
          border: none !important; box-shadow: none !important; padding: 10mm !important;
          margin: 0 !important; width: 100% !important; max-width: none !important;
        }
        @page { margin: 5mm; }
      }
      @media screen { #temp-print-container { display: none !important; } }
    `;
    document.head.appendChild(style);
    
    window.print();
    
    setTimeout(() => {
      if (document.body.contains(printContainer)) document.body.removeChild(printContainer);
      if (document.head.contains(style)) document.head.removeChild(style);
    }, 1000);
  };

  const handleWhatsAppShare = () => {
    const text = `*INVOICE / BILL*%0A---------------------------%0ABill To: ${customerInfo.name || 'Customer'}%0ADate: ${new Date().toLocaleDateString()}%0ATotal Amount: Rs ${calculateSubtotal()}%0A---------------------------%0AThank you for your business!%0A- ${businessInfo.name || 'Cyber Cafe Mitra'}`;
    const url = `https://wa.me/${customerInfo.phone}?text=${text}`;
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


  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* LEFT: Controls (Hidden on Print) */}
      <div className="flex-1 space-y-6 print:hidden">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-5 border-b border-slate-100 pb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                {isHindi ? 'यूनिवर्सल इनवॉइस जनरेटर' : 'Universal Invoice Generator'}
              </h2>
              <p className="text-sm text-slate-500">
                {isHindi ? 'अपनी दुकान के नाम से ग्राहकों के लिए बिल बनाएं' : 'Create professional bills for your shop/cyber cafe'}
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Business Info Setup */}
            <div>
              <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                <Settings className="w-4 h-4 text-slate-400" />
                {isHindi ? 'आपकी दुकान का विवरण (Business Info)' : 'Your Business Details'}
              </h3>
              
              {/* Logo Upload */}
              <div className="mb-3">
                <label className="flex items-center justify-center w-full p-4 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors group relative overflow-hidden">
                  {businessInfo.logo ? (
                    <div className="relative w-full h-16 flex items-center justify-center">
                      <img src={businessInfo.logo} alt="Shop Logo" className="max-h-16 max-w-full object-contain" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                        <span className="text-white text-xs font-bold px-3 py-1 bg-black/50 rounded-full">Change Logo</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <ImagePlus className="w-6 h-6 mb-2 text-slate-400" />
                      <span className="text-xs font-bold uppercase">{isHindi ? 'लोगो अपलोड करें' : 'Upload Shop Logo'}</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                </label>
                {businessInfo.logo && (
                  <button onClick={() => setBusinessInfo({...businessInfo, logo: ''})} className="text-[10px] text-red-500 font-bold uppercase mt-1 hover:underline">
                    {isHindi ? 'लोगो हटाएं' : 'Remove Logo'}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder={isHindi ? 'दुकान का नाम दर्ज करें' : 'Enter Shop Name'}
                  value={businessInfo.name}
                  onChange={(e) => setBusinessInfo({...businessInfo, name: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none sm:col-span-2"
                />
                <input
                  type="text"
                  placeholder={isHindi ? 'मोबाइल नंबर' : 'Mobile Number'}
                  value={businessInfo.phone}
                  onChange={(e) => setBusinessInfo({...businessInfo, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
                <input
                  type="email"
                  placeholder={isHindi ? 'ईमेल (Email)' : 'Email Address'}
                  value={businessInfo.email}
                  onChange={(e) => setBusinessInfo({...businessInfo, email: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder={isHindi ? 'पता (Address)' : 'Address'}
                  value={businessInfo.address}
                  onChange={(e) => setBusinessInfo({...businessInfo, address: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder={isHindi ? 'GSTIN (Optional)' : 'GSTIN (Optional)'}
                  value={businessInfo.gstin}
                  onChange={(e) => setBusinessInfo({...businessInfo, gstin: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Customer Details */}
            <div>
              <h3 className="text-sm font-bold text-slate-800 mb-3 border-t border-slate-100 pt-5">
                {isHindi ? 'ग्राहक का विवरण (Customer Info)' : 'Customer Details'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder={isHindi ? 'ग्राहक का नाम दर्ज करें' : 'Enter Customer Name'}
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder={isHindi ? 'ग्राहक का मोबाइल' : 'Customer Mobile'}
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
                <input
                  type="date"
                  value={customerInfo.date}
                  onChange={(e) => setCustomerInfo({...customerInfo, date: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder={isHindi ? 'इनवॉइस नंबर' : 'Invoice Number'}
                  value={customerInfo.invoiceNo}
                  onChange={(e) => setCustomerInfo({...customerInfo, invoiceNo: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none bg-slate-50"
                />
              </div>
            </div>

            {/* Items */}
            <div>
              <div className="flex items-center justify-between mb-3 border-t border-slate-100 pt-5">
                <h3 className="text-sm font-bold text-slate-800">
                  {isHindi ? 'सेवाएं/सामान (Items)' : 'Services / Items'}
                </h3>
                <button
                  onClick={addItem}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg"
                >
                  <Plus className="w-3 h-3" />
                  {isHindi ? 'नया जोड़ें' : 'Add Item'}
                </button>
              </div>
              
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={item.id} className="flex gap-2 items-center bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <span className="text-xs font-bold text-slate-400 w-4 text-center">{index + 1}.</span>
                    <input
                      type="text"
                      placeholder={isHindi ? 'विवरण' : 'Description'}
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      className="flex-1 px-2 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-blue-600 focus:outline-none bg-white min-w-0"
                    />
                    <input
                      type="number"
                      placeholder="Qty"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                      className="w-16 px-2 py-1.5 border border-slate-300 rounded-lg text-sm text-center focus:ring-1 focus:ring-blue-600 focus:outline-none bg-white"
                    />
                    <input
                      type="number"
                      placeholder="Rate"
                      min="0"
                      value={item.rate}
                      onChange={(e) => updateItem(item.id, 'rate', Number(e.target.value))}
                      className="w-20 px-2 py-1.5 border border-slate-300 rounded-lg text-sm text-right focus:ring-1 focus:ring-blue-600 focus:outline-none bg-white"
                    />
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg shrink-0"
                      disabled={items.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-5 border-t border-slate-100">
              <button
                onClick={handlePrint}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-sm flex items-center justify-center gap-2 transition-colors"
              >
                <Printer className="w-4 h-4" />
                {isHindi ? 'इनवॉइस प्रिंट करें' : 'Print Invoice'}
              </button>
              <p className="text-center text-xs text-slate-500 mt-3">
                {isHindi ? 'प्रिंट विंडो में PDF के रूप में सेव भी कर सकते हैं।' : 'You can also Save as PDF in the print window.'}
              </p>
              <button
                onClick={handleWhatsAppShare}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-sm flex items-center justify-center gap-2 transition-colors mt-2"
              >
                <Share2 className="w-4 h-4" />
                {isHindi ? 'WhatsApp पर बिल भेजें' : 'Share Bill on WhatsApp'}
              </button>

            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Live Preview (Takes over on Print) */}
      <div className="flex-1 lg:w-[210mm] lg:flex-none">
        <div className="bg-slate-200 p-2 sm:p-4 rounded-2xl print:bg-white print:p-0">
          <div ref={printRef} className="bg-white mx-auto shadow-sm print:shadow-none min-h-[297mm] p-8 sm:p-12 relative text-slate-800">
            {/* Invoice Header */}
            <div className="flex justify-between items-start border-b-2 border-slate-800 pb-6 mb-6">
              <div className="flex gap-4 items-start">
                {businessInfo.logo && (
                  <img src={businessInfo.logo} alt="Logo" className="max-h-20 max-w-[120px] object-contain" />
                )}
                <div>
                  <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{businessInfo.name || 'YOUR SHOP NAME'}</h1>
                  <p className="text-sm text-slate-600 mt-1 max-w-xs">{businessInfo.address}</p>
                  <p className="text-sm text-slate-600 mt-1 flex items-center gap-2">
                    <span className="font-semibold">Phone:</span> {businessInfo.phone}
                  </p>
                  {businessInfo.email && (
                    <p className="text-sm text-slate-600">
                      <span className="font-semibold">Email:</span> {businessInfo.email}
                    </p>
                  )}
                  {businessInfo.gstin && (
                    <p className="text-sm text-slate-600">
                      <span className="font-semibold">GSTIN:</span> {businessInfo.gstin}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-4xl font-black text-slate-200 uppercase tracking-widest">INVOICE</h2>
                <div className="mt-4">
                  <p className="text-sm"><span className="font-bold text-slate-500">Invoice No:</span> <span className="font-bold">{customerInfo.invoiceNo}</span></p>
                  <p className="text-sm"><span className="font-bold text-slate-500">Date:</span> <span className="font-medium">{new Date(customerInfo.date).toLocaleDateString('en-IN')}</span></p>
                </div>
              </div>
            </div>

            {/* Bill To */}
            <div className="mb-8">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Billed To:</h3>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <p className="font-bold text-lg text-slate-800">{customerInfo.name || 'Customer Name'}</p>
                {customerInfo.phone && <p className="text-sm text-slate-600 mt-1">Mobile: {customerInfo.phone}</p>}
              </div>
            </div>

            {/* Items Table */}
            <table className="w-full text-left border-collapse mb-8">
              <thead>
                <tr className="border-b-2 border-slate-800 text-sm">
                  <th className="py-3 font-bold text-slate-800">Description</th>
                  <th className="py-3 font-bold text-slate-800 text-center w-24">Quantity</th>
                  <th className="py-3 font-bold text-slate-800 text-right w-32">Rate (₹)</th>
                  <th className="py-3 font-bold text-slate-800 text-right w-32">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={item.id} className="border-b border-slate-200 text-sm">
                    <td className="py-4 font-medium text-slate-700">{item.description || 'Item Description'}</td>
                    <td className="py-4 text-center text-slate-600">{item.quantity}</td>
                    <td className="py-4 text-right text-slate-600">{item.rate.toFixed(2)}</td>
                    <td className="py-4 text-right font-bold text-slate-800">{(item.quantity * item.rate).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-64 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-slate-500">Subtotal:</span>
                  <span className="font-bold text-slate-800">₹{calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl border-t-2 border-slate-800 pt-3">
                  <span className="font-black text-slate-900">Total:</span>
                  <span className="font-black text-blue-700">₹{calculateSubtotal().toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Footer / Thank You */}
            <div className="absolute bottom-12 left-12 right-12 text-center border-t border-slate-200 pt-6">
              <p className="font-bold text-slate-800 uppercase tracking-wide">Thank you for your business!</p>
              <p className="text-xs text-slate-500 mt-1">This is a computer-generated invoice.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
