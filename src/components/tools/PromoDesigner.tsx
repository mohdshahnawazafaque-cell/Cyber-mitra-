import React, { useState, useRef } from 'react';
import { printElement } from '../../utils/printUtils';
import { Download, Printer, Share2, ImagePlus, LayoutTemplate, Phone, MessageCircle, Globe, RefreshCw } from 'lucide-react';
import { Language } from '../../types';
import html2canvas from 'html2canvas';

interface PromoDesignerProps {
  language: Language;
}

export const PromoDesigner: React.FC<PromoDesignerProps> = ({ language }) => {
  const isHindi = language === 'hi';
  const previewRef = useRef<HTMLDivElement>(null);

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [whatsappLink, setWhatsappLink] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [description, setDescription] = useState('');
  
  const [layoutSize, setLayoutSize] = useState<'Portrait' | 'Square'>('Portrait');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handlePrint = () => {
    if (previewRef.current) {
      printElement(previewRef.current, '@page { margin: 10mm; }');
    } else {
      window.print();
    }
  };

  const generateDataUrl = async () => {
    if (!previewRef.current) return null;
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      return canvas.toDataURL('image/jpeg', 0.9);
    } catch (e) {
      console.error('Error generating canvas:', e);
      return null;
    }
  };

  const handleDownload = async () => {
    const dataUrl = await generateDataUrl();
    if (dataUrl) {
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `Parcha_${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleWhatsAppShare = async () => {
    const dataUrl = await generateDataUrl();
    if (!dataUrl) return;
    try {
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], `Parcha_${Date.now()}.jpg`, { type: 'image/jpeg' });
      
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Parcha / Poster',
        });
      } else {
        alert(isHindi ? 'आपका ब्राउज़र सीधे फाइल शेयरिंग सपोर्ट नहीं करता (कृपया पहले डाउनलोड करें)।' : 'Browser does not support direct file share (please download first).');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const resetForm = () => {
    setImageUrl(null);
    setPhoneNumber('');
    setWhatsappLink('');
    setWebsiteUrl('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <LayoutTemplate className="w-6 h-6 text-blue-600" />
            {isHindi ? 'पर्चा (पोस्टर) मेकर' : 'Parcha (Poster) Maker'}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {isHindi ? 'सिर्फ फोटो, नंबर, व्हाट्सएप लिंक, या URL डालें (सब कुछ वैकल्पिक है)।' : 'Upload photo, add number, WhatsApp link, URL, description (all optional).'}
          </p>
        </div>
        <div className="flex items-center gap-2 print:hidden">
          <button
            onClick={resetForm}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-sm flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">{isHindi ? 'रीसेट' : 'Reset'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor Settings */}
        <div className="lg:col-span-4 space-y-6 print:hidden">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-5">
            <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2">{isHindi ? 'पर्चा सेटिंग्स' : 'Parcha Settings'}</h3>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Layout Size */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                {isHindi ? 'पोस्टर का आकार' : 'Poster Size'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setLayoutSize('Portrait')}
                  className={`py-2 rounded-lg text-sm font-semibold border transition-colors ${layoutSize === 'Portrait' ? 'bg-blue-50 border-blue-600 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  {isHindi ? 'पोर्ट्रेट (लंबा)' : 'Portrait'}
                </button>
                <button
                  onClick={() => setLayoutSize('Square')}
                  className={`py-2 rounded-lg text-sm font-semibold border transition-colors ${layoutSize === 'Square' ? 'bg-blue-50 border-blue-600 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  {isHindi ? 'चौकोर (Square)' : 'Square (1:1)'}
                </button>
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                {isHindi ? 'फोटो अपलोड (वैकल्पिक)' : 'Upload Photo (Optional)'}
              </label>
              <label className="flex items-center justify-center w-full h-20 border-2 border-dashed border-slate-300 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                <div className="flex items-center gap-2 text-slate-500">
                  <ImagePlus className="w-5 h-5" />
                  <span className="text-sm font-medium">{imageUrl ? (isHindi ? 'फोटो बदलें' : 'Change Photo') : (isHindi ? 'फोटो चुनें' : 'Select Photo')}</span>
                </div>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
              {imageUrl && (
                <button onClick={() => setImageUrl(null)} className="text-xs text-red-500 font-medium mt-2 hover:underline">
                  {isHindi ? 'फोटो हटाएँ' : 'Remove Photo'}
                </button>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                {isHindi ? 'मोबाइल नंबर (वैकल्पिक)' : 'Phone Number (Optional)'}
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="9876543210"
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* WhatsApp Link */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                {isHindi ? 'व्हाट्सएप लिंक या नंबर (वैकल्पिक)' : 'WhatsApp Link/No (Optional)'}
              </label>
              <div className="relative">
                <MessageCircle className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={whatsappLink}
                  onChange={(e) => setWhatsappLink(e.target.value)}
                  placeholder="wa.me/919876543210"
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* URL */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                {isHindi ? 'वेबसाइट / URL (वैकल्पिक)' : 'Website / URL (Optional)'}
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="www.example.com"
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            </div>
{/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                {isHindi ? 'विवरण (वैकल्पिक)' : 'Description (Optional)'}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={isHindi ? "पर्चे के बारे में कुछ लिखें..." : "Write something..."}
                rows={4}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Live Preview Area */}
        <div className="lg:col-span-8">
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-4 print:hidden">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                {isHindi ? 'लाइव प्रीव्यू' : 'Live Preview'}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={handleDownload}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-black text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">JPG</span>
                </button>
                <button
                  onClick={handleWhatsAppShare}
                  className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Share</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Print</span>
                </button>
              </div>
            </div>

            {/* Canvas Container */}
            <div className="bg-slate-100 p-4 sm:p-8 rounded-xl border border-slate-200 block overflow-x-auto text-center min-h-[500px]">
              <div 
                ref={previewRef}
                className={`bg-white shadow-xl relative mx-auto flex flex-col ${layoutSize === 'Portrait' ? 'w-[400px] min-h-[565px] sm:w-[500px] sm:min-h-[707px]' : 'w-[400px] h-[400px] sm:w-[500px] sm:h-[500px]'} print-exact overflow-hidden`}
                style={{
                  transform: 'scale(0.85)',
                  transformOrigin: 'top center',
                  marginBottom: '-50px' 
                }}
              >
                {/* Photo Header */}
                {imageUrl ? (
                  <div className="w-full flex-shrink-0 flex items-center justify-center p-6 bg-slate-50 border-b border-slate-100">
                    <img src={imageUrl} alt="Parcha Photo" className="max-w-full max-h-[300px] object-contain rounded-xl shadow-sm" />
                  </div>
                ) : (
                  <div className="w-full h-8 bg-blue-600"></div> /* Placeholder colored strip if no image */
                )}

                {/* Description Body */}
                <div className="flex-1 flex flex-col p-8 items-center justify-center text-center">
                  {description ? (
                    <div className="whitespace-pre-wrap text-xl font-medium text-slate-800 leading-relaxed">
                      {description}
                    </div>
                  ) : (
                    !imageUrl && !phoneNumber && !whatsappLink && !websiteUrl && (
                      <div className="text-slate-300 flex flex-col items-center gap-2">
                        <ImagePlus className="w-16 h-16 opacity-50" />
                        <p>{isHindi ? 'यहाँ आपका पर्चा (डिजाइन) दिखाई देगा' : 'Your design will appear here'}</p>
                      </div>
                    )
                  )}
                </div>

                {/* Footer with Contacts */}
                {(phoneNumber || whatsappLink || websiteUrl) && (
                  <div className="mt-auto bg-slate-50 border-t-[6px] border-blue-600 p-6 flex flex-col items-center gap-3">
                    {phoneNumber && (
                      <div className="flex items-center gap-2 text-slate-800 font-bold text-lg">
                        <div className="bg-blue-100 p-1.5 rounded-full"><Phone className="w-5 h-5 text-blue-700" /></div>
                        {phoneNumber}
                      </div>
                    )}
                    {whatsappLink && (
                      <div className="flex items-center gap-2 text-slate-800 font-bold text-lg">
                        <div className="bg-green-100 p-1.5 rounded-full"><MessageCircle className="w-5 h-5 text-green-700" /></div>
                        {whatsappLink}
                      </div>
                    )}
                    {websiteUrl && (
                      <div className="flex items-center gap-2 text-slate-800 font-bold text-lg">
                        <div className="bg-purple-100 p-1.5 rounded-full"><Globe className="w-5 h-5 text-purple-700" /></div>
                        {websiteUrl}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
      
      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            size: auto;
            margin: 0;
          }
          body * {
            visibility: hidden;
          }
          .print-exact, .print-exact * {
            visibility: visible;
          }
          .print-exact {
            position: absolute;
            left: 50%;
            top: 0;
            transform: translateX(-50%) !important;
            box-shadow: none !important;
            border: none !important;
          }
          .print\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
