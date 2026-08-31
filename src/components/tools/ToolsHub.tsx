import React, { useState } from 'react';
import { 
  Search, Image, FileText, File as FileIcon, Landmark, UserCheck, Briefcase, 
  Keyboard, Calculator, Map, QrCode, Sliders, Printer, Wrench
} from 'lucide-react';
import { Language } from '../../types';

interface ToolsHubProps {
  language: Language;
  onNavigate: (view: string, subCategory?: string) => void;
}

const CATEGORIES = [
  { id: 'photo', icon: Image, labelEn: 'Photo Studio', labelHi: 'फोटो स्टूडियो' },
  { id: 'a4_photo', icon: FileIcon, labelEn: 'A4 Photo Sheet', labelHi: 'A4 फोटो शीट' },
  { id: 'pdf', icon: FileText, labelEn: 'PDF Tools', labelHi: 'पीडीएफ टूल्स' },
  { id: 'document', icon: FileIcon, labelEn: 'Document Tools', labelHi: 'डॉक्यूमेंट टूल्स' },
  { id: 'gov_id', icon: Landmark, labelEn: 'Government/ID', labelHi: 'सरकारी / आईडी' },
  { id: 'forms', icon: UserCheck, labelEn: 'Forms & Applications', labelHi: 'आवेदन फॉर्म' },
  { id: 'resume', icon: Briefcase, labelEn: 'Resume & Documents', labelHi: 'रिज्यूमे व डॉक्यूमेंट' },
  { id: 'typing', icon: Keyboard, labelEn: 'Typing', labelHi: 'टाइपिंग' },
  { id: 'calculator', icon: Calculator, labelEn: 'Calculators', labelHi: 'कैलकुलेटर' },
  { id: 'land', icon: Map, labelEn: 'Land Tools', labelHi: 'जमीन टूल्स' },
  { id: 'qr', icon: QrCode, labelEn: 'QR & Barcode', labelHi: 'QR व बारकोड' },
  { id: 'image', icon: Sliders, labelEn: 'Image Tools', labelHi: 'इमेज टूल्स' },
  { id: 'printing', icon: Printer, labelEn: 'Printing', labelHi: 'प्रिंटिंग' },
  { id: 'utility', icon: Wrench, labelEn: 'Utilities', labelHi: 'उपयोगी टूल्स' },
];

export const ToolsHub: React.FC<ToolsHubProps> = ({ language, onNavigate }) => {
  const isHindi = language === 'hi';
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const tools = [
    // Photo Studio
    { id: 'smart-photo-resizer', category: 'photo', nameHi: 'स्मार्ट फोटो रिसाइज़र (Smart Photo Resizer)', nameEn: 'Smart Photo Resizer', descHi: '10KB, 20KB, 50KB, Pixel, Passport Size - सब कुछ एक टूल में।', descEn: 'Resize to KB, Pixels, Dimensions automatically', target: 'photo_tools', subCategory: 'basic' },
    { id: 'photo-bg-remove', category: 'photo', nameHi: 'फोटो बैकग्राउंड हटाएं', nameEn: 'Remove Background', descHi: 'एक क्लिक में फोटो का बैकग्राउंड साफ़ करें।', descEn: 'Remove photo background in one click.', target: 'photo_tools', subCategory: 'basic' },
    { id: 'photo-sig-merge', category: 'photo', nameHi: 'फोटो + हस्ताक्षर जोड़ें', nameEn: 'Photo + Signature Merger', descHi: 'सरकारी फॉर्म के लिए फोटो और हस्ताक्षर एक साथ जोड़ें।', descEn: 'Merge photo and signature vertically for online forms.', target: 'photo_tools', subCategory: 'basic' },
    { id: 'self-attest-maker', category: 'photo', nameHi: 'सेल्फ अटेस्ट (Self Attested) मेकर', nameEn: 'Self Attested Photo Maker', descHi: 'फोटो के ऊपर स्वतः नाम और तारीख लिखें।', descEn: 'Automatically write name and date on photos.', target: 'photo_tools', subCategory: 'basic' },
    
    // A4 Photo Sheet
    { id: 'a4-photo-maker', category: 'a4_photo', nameHi: 'A4 फोटो शीट मेकर (A4 Photo Maker)', nameEn: 'A4 Photo Sheet Maker', descHi: 'A4 शीट पर ऑटोमेटिक 6 फोटो/लाइन सेट करें और प्रिंट निकालें।', descEn: 'Auto-grid A4 photo print layout.', target: 'photo_tools', subCategory: 'a4_grid' },
    
    // PDF Tools
    { id: 'img-to-pdf', category: 'pdf', nameHi: 'इमेज से PDF (Image to PDF)', nameEn: 'Image to PDF', descHi: 'JPG, PNG इमेज को PDF में बदलें।', descEn: 'Convert JPG/PNG to PDF.', target: 'pdf_tools' },
    { id: 'pdf-merge', category: 'pdf', nameHi: 'PDF मर्ज (PDF Merge)', nameEn: 'PDF Merge', descHi: 'कई PDF फाइलों को एक में मिलाएं।', descEn: 'Combine multiple PDFs into one.', target: 'pdf_tools' },
    { id: 'pdf-compress', category: 'pdf', nameHi: 'PDF कंप्रेस (PDF Compress)', nameEn: 'PDF Compress', descHi: 'PDF का साइज (MB/KB) कम करें।', descEn: 'Reduce PDF file size.', target: 'pdf_tools' },

    // Forms & Applications
    { id: 'application-builder', category: 'forms', nameHi: 'प्रार्थना पत्र जनरेटर (Application Maker)', nameEn: 'Letter / Application Generator', descHi: 'SDM, तहसीलदार, बैंक आदि के लिए एप्लीकेशन लिखें।', descEn: 'Generate official applications instantly.', target: 'application_builder' },
    
    // Calculators
    { id: 'calc-hub', category: 'calculator', nameHi: 'स्मार्ट कैलकुलेटर हब (Smart Calculators)', nameEn: 'Smart Calculator Hub', descHi: 'Age, EMI, GST, Interest, Income Tax आदि कैलकुलेटर।', descEn: 'Age, EMI, GST, SIP, and Tax Calculators.', target: 'calculator_hub' },
    
    // Land
    { id: 'land-calc', category: 'land', nameHi: 'भूमि मापन व कनवर्टर (Land Calculator)', nameEn: 'Land Unit Converter', descHi: 'बीघा, एकड़, हेक्टेयर, बिस्वा आदि का कन्वर्ज़न।', descEn: 'Bigha, Acre, Hectare, Square Feet conversions.', target: 'calculator_hub' },
    
    // QR
    { id: 'qr-maker', category: 'qr', nameHi: 'QR कोड जनरेटर (QR Generator)', nameEn: 'QR Code Generator', descHi: 'URL, Text, WhatsApp के लिए QR बनाएं।', descEn: 'Generate QR codes for URLs, text, Wi-Fi.', target: 'qr_tools' },

    // Office / Typing
    { id: 'typing-tools', category: 'typing', nameHi: 'हिंदी / इंग्लिश टाइपिंग टूल्स', nameEn: 'Typing Tools', descHi: 'टाइपिंग स्पीड टेस्ट और सर्टिफिकेट।', descEn: 'Typing tests and code conversions.', target: 'office_tools', subCategory: 'typing' },

    // Utilities
    { id: 'bulk-sms', category: 'utility', nameHi: 'SMS / WhatsApp अलर्ट', nameEn: 'Bulk SMS Alerts', descHi: 'ग्राहकों को एक साथ मैसेज भेजें।', descEn: 'Send bulk status updates to customers.', target: 'bulk_sms', subCategory: 'utility' },
    { id: 'cibil-checker', category: 'utility', nameHi: 'फ्री सिबिल स्कोर चेक', nameEn: 'Free CIBIL Score Check', descHi: 'लोन या क्रेडिट कार्ड के लिए फ्री में CIBIL व Experian स्कोर चेक करें।', descEn: 'Check free CIBIL & Experian score for loan & credit card.', target: 'services', subCategory: 'finance' },
    { id: 'invoice-generator', category: 'utility', nameHi: 'बिल / इनवॉइस जनरेटर', nameEn: 'Universal Invoice Generator', descHi: 'अपनी दुकान या कंपनी के नाम से स्मार्ट बिल बनाएं और प्रिंट करें।', descEn: 'Create and print smart invoices/bills for your shop or company.', target: 'invoice_generator', subCategory: 'utility' },
    { id: 'vanshavali-certificate', category: 'utility', nameHi: 'वंशावली प्रमाण-पत्र', nameEn: 'Vanshavali Certificate', descHi: 'परिवार के सदस्यों का वंशावली विवरण बनाएं और प्रिंट करें।', descEn: 'Generate Family Tree Certificate.', target: 'vanshavali_certificate', subCategory: 'utility' },
    { id: 'awas-certificate', category: 'utility', nameHi: 'आवास प्रमाण-पत्र', nameEn: 'Awas Certificate Generator', descHi: 'प्रधानमंत्री आवास योजना-शहरी 2.0 का प्रमाण-पत्र बनाएं।', descEn: 'Generate PMAY-U 2.0 certificate.', target: 'awas_certificate', subCategory: 'utility' },
    { id: 'promo-designer', category: 'utility', nameHi: 'प्रमोशन / पोस्टर मेकर', nameEn: 'Promo / Poster Maker', descHi: 'स्कूल, इवेंट या विज्ञापन के लिए पोस्टर/बैनर डिज़ाइन करें।', descEn: 'Design promo banners/posters for schools, events, or ads.', target: 'promo_designer', subCategory: 'utility' },
    { id: 'word-counter', category: 'utility', nameHi: 'वर्ड / कैरेक्टर काउंटर', nameEn: 'Word Counter', descHi: 'टेक्स्ट में शब्दों और अक्षरों की गिनती करें।', descEn: 'Count words and characters in text.', target: 'office_tools', subCategory: 'utility' },
    { id: 'case-converter', category: 'utility', nameHi: 'अपरकेस / लोअरकेस कनवर्टर', nameEn: 'Text Case Converter', descHi: 'टेक्स्ट को CAPITAL या small letters में बदलें।', descEn: 'Convert text case formats.', target: 'office_tools', subCategory: 'utility' },

    // Image
    { id: 'img-resize', category: 'image', nameHi: 'इमेज रिसाइज़र व कंप्रेसर', nameEn: 'Image Resizer', descHi: 'किसी भी इमेज की साइज और क्वालिटी कम करें।', descEn: 'Reduce image size and adjust quality.', target: 'photo_tools', subCategory: 'basic' },
    { id: 'img-convert', category: 'image', nameHi: 'इमेज फॉर्मेट कनवर्टर', nameEn: 'Image Format Converter', descHi: 'JPG से PNG, WEBP आदि में बदलें।', descEn: 'Convert JPG to PNG, WEBP, etc.', target: 'photo_tools', subCategory: 'basic' },

    // Printing
    { id: 'smart-print', category: 'printing', nameHi: 'स्मार्ट प्रिंट लेआउट (Smart Print)', nameEn: 'Smart Print Layout', descHi: 'मल्टीपल इमेजेज और डाक्यूमेंट्स को एक साथ प्रिंट करें।', descEn: 'Print multiple documents and images.', target: 'print_center' },
    { id: 'id-print', category: 'printing', nameHi: 'ID कार्ड प्रिंट लेआउट', nameEn: 'ID Card Print Layout', descHi: 'आधार, पैन, वोटर आईडी का परफेक्ट प्रिंट साइज सेट करें।', descEn: 'Perfect size print for Aadhar, PAN, Voter ID.', target: 'photo_tools', subCategory: 'a4_grid' },
  ];

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.nameHi.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.descHi.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.descEn.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header & Search */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
              <Wrench className="w-7 h-7 text-blue-600" />
              {isHindi ? 'साइबर मित्रा - टूल्स हब (Tools Hub)' : 'Cyber Mitra - Tools Hub'}
            </h1>
            <p className="text-slate-500 mt-1">
              {isHindi ? 'सभी साइबर कैफे और जन सेवा केंद्र के काम एक ही जगह पर।' : 'All Cyber Cafe and Jan Seva Kendra utilities in one place.'}
            </p>
          </div>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder={isHindi ? "कोई भी Tool खोजें... (जैसे: passport, pdf, calculator)" : "Search any tool..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setActiveCategory('all')}
          className={`shrink-0 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
            activeCategory === 'all' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          {isHindi ? 'सभी टूल्स' : 'All Tools'}
        </button>
        {CATEGORIES.map(cat => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`shrink-0 px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                isActive ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {isHindi ? cat.labelHi : cat.labelEn}
            </button>
          )
        })}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTools.length > 0 ? (
          filteredTools.map(tool => (
            <div 
              key={tool.id}
              onClick={() => onNavigate(tool.target, tool.subCategory)}
              className="group bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-400 transition-all cursor-pointer flex flex-col"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                   <Wrench className="w-5 h-5" />
                </div>
              </div>
              <h3 className="font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">
                {isHindi ? tool.nameHi : tool.nameEn}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2">
                {isHindi ? tool.descHi : tool.descEn}
              </p>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="font-bold text-lg">{isHindi ? 'कोई टूल नहीं मिला' : 'No tools found'}</p>
            <p className="text-sm mt-1">{isHindi ? 'कृपया दूसरे कीवर्ड से खोजें।' : 'Try searching with a different keyword.'}</p>
          </div>
        )}
      </div>
    </div>
  );
};
