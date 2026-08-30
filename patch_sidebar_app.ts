import fs from 'fs';

// --- 1. Patch App.tsx ---
let appCode = fs.readFileSync('src/App.tsx', 'utf8');

// Add Lazy imports
const lazyImports = `
const InvoiceGenerator = lazy(() => import('./components/tools/InvoiceGenerator').then(module => ({ default: module.InvoiceGenerator })));
const DailyKhata = lazy(() => import('./components/tools/DailyKhata').then(module => ({ default: module.DailyKhata })));
const DownloadsHub = lazy(() => import('./components/tools/DownloadsHub').then(module => ({ default: module.DownloadsHub })));
`;
appCode = appCode.replace("const InvoiceGenerator = lazy(() => import('./components/tools/InvoiceGenerator').then(module => ({ default: module.InvoiceGenerator })));", lazyImports.trim());

// Add Views
const newViews = `
            {/* VIEW: DAILY KHATA */}
            {appState.activeView === 'daily_khata' && (
              <DailyKhata language={language} />
            )}
            
            {/* VIEW: DOWNLOADS HUB */}
            {appState.activeView === 'downloads_hub' && (
              <DownloadsHub language={language} />
            )}
`;
appCode = appCode.replace("{/* VIEW: CALCULATOR HUB */}", newViews + "\n            {/* VIEW: CALCULATOR HUB */}");
fs.writeFileSync('src/App.tsx', appCode);


// --- 2. Patch Sidebar.tsx ---
let sidebarCode = fs.readFileSync('src/components/layout/Sidebar.tsx', 'utf8');
sidebarCode = sidebarCode.replace(
  "import { CustomerData, Language } from '../../types';",
  "import { CustomerData, Language } from '../../types';\nimport { IndianRupee, Download as DownloadIcon } from 'lucide-react';"
);

const newSidebarItems = `
    {
      id: 'daily_khata',
      view: 'daily_khata',
      icon: IndianRupee,
      titleHi: 'डेली खाता बुक',
      titleEn: 'Daily Khata Book',
      descHi: 'कमाई व उधार का हिसाब',
      descEn: 'Earnings & Pending Dues',
      color: 'text-emerald-500'
    },
    {
      id: 'downloads_hub',
      view: 'downloads_hub',
      icon: DownloadIcon,
      titleHi: 'ऑफलाइन फॉर्म व RD',
      titleEn: 'Forms & Drivers',
      descHi: 'खाली फॉर्म व बायोमेट्रिक सॉफ्टवेयर',
      descEn: 'Blank forms & Biometric drivers',
      color: 'text-indigo-400'
    },
`;

sidebarCode = sidebarCode.replace(
  "      id: 'ai_chat',",
  newSidebarItems + "    {\n      id: 'ai_chat',"
);
fs.writeFileSync('src/components/layout/Sidebar.tsx', sidebarCode);

// --- 3. Patch InvoiceGenerator.tsx for WhatsApp feature ---
let invoiceCode = fs.readFileSync('src/components/tools/InvoiceGenerator.tsx', 'utf8');
const whatsappImport = "import { FileText, Plus, Trash2, Printer, Download, Settings, RefreshCw, X, Receipt, ImagePlus, Upload, Share2 } from 'lucide-react';";
invoiceCode = invoiceCode.replace(/import { FileText, Plus, Trash2, Printer, Download, Settings, RefreshCw, X, Receipt, ImagePlus, Upload } from 'lucide-react';/, whatsappImport);

const whatsappMethod = `
  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const text = \`*INVOICE / BILL*%0A---------------------------%0ABill To: \${customerInfo.name || 'Customer'}%0ADate: \${new Date().toLocaleDateString()}%0ATotal Amount: Rs \${calculateSubtotal()}%0A---------------------------%0AThank you for your business!%0A- \${businessInfo.name || 'CYBER MITRA'}\`;
    const url = \`https://wa.me/\${customerInfo.phone}?text=\${text}\`;
    window.open(url, '_blank');
  };
`;
invoiceCode = invoiceCode.replace(
  /const handlePrint = \(\) => {\s*window\.print\(\);\s*};/,
  whatsappMethod
);

const whatsappButton = `
              <button
                onClick={handleWhatsAppShare}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-sm flex items-center justify-center gap-2 transition-colors mt-2"
              >
                <Share2 className="w-4 h-4" />
                {isHindi ? 'WhatsApp पर बिल भेजें' : 'Share Bill on WhatsApp'}
              </button>
`;
invoiceCode = invoiceCode.replace(
  "{isHindi ? 'प्रिंट विंडो में PDF के रूप में सेव भी कर सकते हैं।' : 'You can also Save as PDF in the print window.'}\n              </p>",
  "{isHindi ? 'प्रिंट विंडो में PDF के रूप में सेव भी कर सकते हैं।' : 'You can also Save as PDF in the print window.'}\n              </p>" + whatsappButton
);

fs.writeFileSync('src/components/tools/InvoiceGenerator.tsx', invoiceCode);
