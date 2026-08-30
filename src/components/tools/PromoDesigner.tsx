import React, { useState, useRef } from 'react';
import { Download, Printer, Share2, ImagePlus, LayoutTemplate, Palette, Type, RefreshCw, Layers } from 'lucide-react';
import { Language } from '../../types';

interface PromoDesignerProps {
  language: Language;
}

export const PromoDesigner: React.FC<PromoDesignerProps> = ({ language }) => {
  const isHindi = language === 'hi';
  const previewRef = useRef<HTMLDivElement>(null);

  const [title, setTitle] = useState(isHindi ? 'महा धमाका ऑफर' : 'Grand Opening');
  const [subtitle, setSubtitle] = useState(isHindi ? 'आपके शहर में पहली बार' : 'For the first time in your city');
  const [description, setDescription] = useState(isHindi ? 'यहाँ सभी प्रकार के ऑनलाइन फॉर्म, फोटोकॉपी और प्रिंटिंग का काम तसल्लीबख्श किया जाता है।\n\n- आधार कार्ड प्रिंट\n- पैन कार्ड\n- पासपोर्ट साइज फोटो\n- रिजल्ट और एडमिट कार्ड' : 'All types of online forms, printing, and photocopy services available.\n\n- Aadhaar Print\n- PAN Card\n- Passport Photo\n- Result & Admit Card');
  const [contactInfo, setContactInfo] = useState(isHindi ? 'पता: मेन मार्केट, आपके शहर का नाम\nमोबाइल: +91-9876543210' : 'Address: Main Market, City Name\nMob: +91-9876543210');
  
  const [themeColor, setThemeColor] = useState('blue');
  const [layoutSize, setLayoutSize] = useState<'A4' | 'Square'>('A4');
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const themeOptions = [
    { id: 'blue', name: 'Blue', color: 'bg-blue-600', text: 'text-blue-600', border: 'border-blue-600' },
    { id: 'red', name: 'Red', color: 'bg-red-600', text: 'text-red-600', border: 'border-red-600' },
    { id: 'green', name: 'Green', color: 'bg-emerald-600', text: 'text-emerald-600', border: 'border-emerald-600' },
    { id: 'purple', name: 'Purple', color: 'bg-purple-600', text: 'text-purple-600', border: 'border-purple-600' },
    { id: 'orange', name: 'Orange', color: 'bg-orange-500', text: 'text-orange-500', border: 'border-orange-500' },
    { id: 'dark', name: 'Dark', color: 'bg-slate-800', text: 'text-slate-800', border: 'border-slate-800' },
  ];

  const currentTheme = themeOptions.find(t => t.id === themeColor) || themeOptions[0];

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
    window.print();
  };

  const generateDataUrl = async () => {
    if (!previewRef.current) return null;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      return canvas.toDataURL('image/jpeg', 0.9);
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const handleDownload = async () => {
    const dataUrl = await generateDataUrl();
    if (dataUrl) {
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `Promo_${Date.now()}.jpg`;
      a.click();
    }
  };

  const handleWhatsAppShare = async () => {
    const dataUrl = await generateDataUrl();
    if (!dataUrl) return;

    try {
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], `Promo_${Date.now()}.jpg`, { type: 'image/jpeg' });
      
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Promotion`,
        });
      } else {
        alert(isHindi ? 'आपका ब्राउज़र सीधे फाइल शेयरिंग सपोर्ट नहीं करता (कृपया पहले डाउनलोड करें)।' : 'Browser does not support direct file share (please download first).');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <LayoutTemplate className="w-6 h-6 text-blue-600" />
            {isHindi ? 'प्रमोशन / पोस्टर मेकर' : 'Promo / Poster Maker'}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {isHindi ? 'स्कूल, इवेंट, दुकान या किसी भी प्रचार के लिए आसानी से पोस्टर बनाएँ।' : 'Easily create posters for schools, events, shops, or any promotion.'}
          </p>
        </div>
        <div className="flex items-center gap-2 print:hidden">
          <button
            onClick={() => {
              setTitle('');
              setSubtitle('');
              setDescription('');
              setContactInfo('');
              setImageUrl(null);
            }}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-sm flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">{isHindi ? 'रीसेट' : 'Reset'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 print:hidden">
        
        {/* Editor Controls */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
              <Type className="w-5 h-5 text-slate-500" />
              <h3 className="font-bold text-slate-700">{isHindi ? 'पोस्टर की जानकारी' : 'Poster Details'}</h3>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isHindi ? 'मुख्य हेडिंग (Main Title)' : 'Main Title'}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={isHindi ? 'उदा: Admission Open 2026' : 'e.g., Admission Open 2026'}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isHindi ? 'सब-हेडिंग (संस्था/स्कूल का नाम)' : 'Subtitle / Organization'}
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder={isHindi ? 'उदा: दिल्ली पब्लिक स्कूल' : 'e.g., Delhi Public School'}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isHindi ? 'मुख्य विवरण (सुविधाएँ / डिटेल्स)' : 'Description / Features'}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  placeholder={isHindi ? 'अपने इवेंट या स्कूल की विशेषताएँ लिखें...' : 'Write features of your event/school...'}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isHindi ? 'संपर्क जानकारी (Contact Info)' : 'Contact Info'}
                </label>
                <textarea
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  rows={2}
                  placeholder={isHindi ? 'पता और फोन नंबर...' : 'Address and Phone Number...'}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
              <Palette className="w-5 h-5 text-slate-500" />
              <h3 className="font-bold text-slate-700">{isHindi ? 'डिज़ाइन और लेआउट' : 'Design & Layout'}</h3>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  {isHindi ? 'कलर थीम चुनें' : 'Select Color Theme'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {themeOptions.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setThemeColor(theme.id)}
                      className={`w-8 h-8 rounded-full ${theme.color} border-2 focus:outline-none transition-all ${
                        themeColor === theme.id ? 'border-slate-800 ring-2 ring-offset-1 ring-slate-300 scale-110' : 'border-transparent hover:scale-105'
                      }`}
                      title={theme.name}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  {isHindi ? 'पोस्टर का साइज़' : 'Poster Size'}
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setLayoutSize('A4')}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold border ${
                      layoutSize === 'A4' ? 'bg-blue-50 border-blue-600 text-blue-700' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    A4 (Print)
                  </button>
                  <button
                    onClick={() => setLayoutSize('Square')}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold border ${
                      layoutSize === 'Square' ? 'bg-blue-50 border-blue-600 text-blue-700' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Square (WhatsApp)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  {isHindi ? 'फोटो या लोगो लगाएँ' : 'Add Photo or Logo'}
                </label>
                <label className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 hover:border-blue-400 transition-colors">
                  <ImagePlus className="w-5 h-5 text-slate-400" />
                  <span className="text-sm font-semibold text-slate-600">
                    {imageUrl ? (isHindi ? 'फोटो बदलें' : 'Change Photo') : (isHindi ? 'गैलरी से चुनें' : 'Choose from Gallery')}
                  </span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
                {imageUrl && (
                  <button
                    onClick={() => setImageUrl(null)}
                    className="mt-2 text-xs text-red-500 font-semibold hover:underline"
                  >
                    {isHindi ? 'फोटो हटाएँ' : 'Remove Photo'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview Area */}
        <div className="lg:col-span-7">
          <div className="sticky top-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-600" />
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
            <div className="bg-slate-100 p-4 sm:p-8 rounded-xl border border-slate-200 flex justify-center overflow-x-auto min-h-[500px]">
              <div 
                ref={previewRef}
                className={`bg-white shadow-xl relative flex flex-col ${layoutSize === 'A4' ? 'w-[210mm] min-h-[297mm]' : 'w-[400px] h-[400px] sm:w-[500px] sm:h-[500px]'} print-exact`}
                style={{
                  transform: layoutSize === 'A4' ? 'scale(0.65)' : 'scale(0.85)',
                  transformOrigin: 'top center',
                  marginBottom: layoutSize === 'A4' ? '-100px' : '-50px' // Adjust for scale
                }}
              >
                {/* Header Strip */}
                <div className={`${currentTheme.color} text-white py-6 px-8 text-center`}>
                  <h1 className="text-4xl font-extrabold tracking-tight" style={{ whiteSpace: 'pre-wrap' }}>{title || ' '}</h1>
                  {subtitle && <p className="text-xl font-medium mt-2 opacity-90">{subtitle}</p>}
                </div>

                {/* Body Content */}
                <div className="flex-1 flex flex-col p-8">
                  {imageUrl && (
                    <div className="mb-6 flex justify-center">
                      <img src={imageUrl} alt="Promo" className="max-h-[250px] object-contain rounded-xl shadow-sm border border-slate-100" />
                    </div>
                  )}

                  <div className="flex-1">
                    {description && (
                      <div className={`whitespace-pre-wrap text-lg text-slate-700 leading-relaxed ${!imageUrl ? 'text-center' : ''}`}>
                        {description}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Strip */}
                <div className={`mt-auto border-t-[8px] ${currentTheme.border} bg-slate-50 p-6 px-8`}>
                  <div className="whitespace-pre-wrap text-center font-bold text-slate-800 text-lg leading-snug">
                    {contactInfo || ' '}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            size: ${layoutSize === 'A4' ? 'A4 portrait' : 'auto'};
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
            left: 0;
            top: 0;
            width: 100% !important;
            height: 100% !important;
            transform: none !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
};
