import React from 'react';
import {
  Home,
  Landmark,
  Wrench,
  Sparkles,
  FileCode,
  Printer,
  FolderSync,
  HelpCircle,
  UserCheck,
  Calculator,
  Camera,
  FileText
} from 'lucide-react';
import { CustomerData, Language } from '../../types';
import { MessageSquareText, Globe, ChevronLeft } from 'lucide-react';
import { IndianRupee, Download as DownloadIcon } from 'lucide-react';

interface SidebarProps {
  language: Language;
  activeView?: string;
  currentView?: string;
  onNavigate: (view: string, subCategory?: string) => void;
  isOpen: boolean;
  onClose: () => void;
  favoritesCount?: number;
  recentCount?: number;
  printQueueCount?: number;
  activeFilesCount?: number;
  customer?: CustomerData;
  onOpenCustomerModal?: () => void;
  onClearSession?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  language,
  activeView,
  currentView,
  onNavigate,
  isOpen,
  onClose,
  printQueueCount = 0,
  activeFilesCount = 0,
  customer,
  onOpenCustomerModal,
  onClearSession,
}) => {
  const isHindi = language === 'hi';
  const effectiveView = activeView || currentView || 'home';

  const handleNavClick = (view: string, subCategory?: string) => {
    onNavigate(view, subCategory);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const menuItems = [
    {
      id: 'home',
      view: 'home',
      icon: Home,
      titleHi: 'मुख्य डैशबोर्ड',
      titleEn: 'Dashboard',
      descHi: 'सभी पोर्टल और खोज',
      descEn: 'All Portals & Search',
      color: 'text-blue-400'
    },
    {
      id: 'services',
      view: 'services',
      icon: Landmark,
      titleHi: 'सभी सरकारी पोर्टल',
      titleEn: 'Govt. Portals',
      descHi: 'Aadhaar, PAN, खतौनी',
      descEn: 'Aadhaar, PAN, Bhulekh',
      color: 'text-emerald-400'
    },
    {
      id: 'tools_hub',
      view: 'tools_hub',
      icon: Wrench,
      titleHi: 'ऑफ़लाइन कैफ़े टूल्स',
      titleEn: 'Offline Cafe Tools',
      descHi: 'फोटो, PDF, टाइपिंग, बिल',
      descEn: 'Photo, PDF, Invoice',
      color: 'text-amber-400'
    },
    {
      id: 'calculator_hub',
      view: 'calculator_hub',
      icon: Calculator,
      titleHi: 'कैलकुलेटर हब',
      titleEn: 'Calculator Hub',
      descHi: 'Age, EMI, GST, Land',
      descEn: 'Age, EMI, GST, Land',
      color: 'text-rose-400'
    },

    
    {
      id: 'vanshavali_certificate',
      view: 'vanshavali_certificate',
      icon: FileText,
      titleHi: 'वंशावली प्रमाण-पत्र',
      titleEn: 'Vanshavali Certificate',
      descHi: 'परिवार का विवरण',
      descEn: 'Family Details',
      color: 'text-indigo-500'
    },
    {
      id: 'awas_certificate',
      view: 'awas_certificate',
      icon: FileText,
      titleHi: 'आवास प्रमाण-पत्र',
      titleEn: 'Awas Certificate',
      descHi: 'PMAY-U 2.0 जनरेटर',
      descEn: 'PMAY-U 2.0 Generator',
      color: 'text-purple-500'
    },
    
    {
      id: 'ai_chat',
      view: 'ai_chat',
      icon: Sparkles,
      titleHi: 'AI चैट सहायक',
      titleEn: 'AI Chat Assistant',
      descHi: 'Gemini AI नियम व सुझाव',
      descEn: 'Gemini AI Rules Q&A',
      color: 'text-purple-400'
    },
    {
      id: 'application_builder',
      view: 'application_builder',
      icon: FileCode,
      titleHi: 'प्रार्थना पत्र निर्माता',
      titleEn: 'Application Builder',
      descHi: 'SDM, बैंक एप्लीकेशन',
      descEn: 'Automated Applications',
      color: 'text-teal-400'
    },
    {
      id: 'workspace',
      view: 'workspace',
      icon: FolderSync,
      titleHi: 'फाइल वर्कस्पेस',
      titleEn: 'File Workspace',
      descHi: 'कस्टमर की फाइल्स',
      descEn: 'Customer Session Files',
      color: 'text-indigo-400',
      badge: activeFilesCount
    },
    {
      id: 'print_center',
      view: 'print_center',
      icon: Printer,
      titleHi: 'स्मार्ट प्रिंट सेंटर',
      titleEn: 'Smart Print Center',
      descHi: 'A4 प्रिंट, ID कार्ड लेआउट',
      descEn: 'A4 Print Layout',
      color: 'text-sky-400',
      badge: printQueueCount
    }
  ];

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 z-30 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-64 sm:w-68 bg-white border-r border-slate-200 flex flex-col shrink-0 transition-transform duration-200 ease-in-out print:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:hidden'
        } shadow-[4px_0_24px_rgba(0,0,0,0.02)] lg:shadow-none`}
      >
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[10px] flex items-center justify-center font-bold text-lg text-white shadow-sm shrink-0">
              C
            </div>
            <div className="flex flex-col">
              <span className="text-[17px] font-extrabold tracking-tight text-slate-900 leading-tight">CYBER CAFE MITRA</span>
              <p className="text-[9.5px] text-slate-500 uppercase tracking-[0.2em] font-bold">
                {isHindi ? 'साइबर कैफे पोर्टल' : 'Professional Portal'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-50 text-slate-400 hover:text-slate-900 transition-colors border border-slate-200"
            title={language === 'hi' ? 'नेविगेशन बंद करें' : 'Close Navigation'}
          >
            <ChevronLeft className="w-4 h-4 hidden lg:block" />
            <span className="lg:hidden text-lg leading-none">✕</span>
          </button>
        </div>

        {customer && customer.name.trim() && (
          <div className="mx-3 my-3 p-3 bg-blue-50/50 border border-blue-100/50 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 ring-1 ring-white">
                <UserCheck className="w-3.5 h-3.5" />
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-blue-900 truncate">{customer.name}</p>
                {customer.mobile && <p className="text-[10px] text-blue-600 font-medium">{customer.mobile}</p>}
              </div>
            </div>
            {onOpenCustomerModal && (
              <button
                onClick={onOpenCustomerModal}
                className="text-[10px] font-bold text-blue-600 hover:text-blue-800 bg-white px-2 py-1 rounded-md shadow-sm border border-blue-100"
              >
                {isHindi ? 'संशोधन' : 'Edit'}
              </button>
            )}
          </div>
        )}

        <nav className="flex-1 overflow-y-auto p-3 space-y-1 text-sm font-medium select-none no-scrollbar">
          <div className="text-[10px] font-bold text-slate-400 uppercase px-3 pb-2 pt-2 tracking-wider">
            {isHindi ? 'मुख्य मेनू (Main Menu)' : 'Main Navigation'}
          </div>
          {menuItems.map((item) => {
            const isActive = effectiveView === item.view || (effectiveView.startsWith('services') && item.view === 'services' && effectiveView !== 'services');
            const Icon = item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.view, item.view === 'services' ? 'all' : undefined)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-left group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`${isActive ? 'text-white' : item.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="leading-tight">
                    <div className={`font-bold text-[13px] ${isActive ? 'text-white' : 'text-slate-700 group-hover:text-slate-900'}`}>
                      {isHindi ? item.titleHi : item.titleEn}
                    </div>
                    <div className={`text-[10px] font-medium mt-0.5 ${isActive ? 'text-blue-200' : 'text-slate-500'}`}>
                      {isHindi ? item.descHi : item.descEn}
                    </div>
                  </div>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shadow-xs ${
                    isActive ? 'bg-white text-blue-700' : 'bg-white border border-slate-200 text-slate-600'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-3">
          <button
            onClick={() => handleNavClick('about')}
            className="w-full flex items-center gap-2 text-slate-500 hover:text-slate-900 text-[11px] uppercase tracking-wider font-bold transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            {isHindi ? 'सहायता व जानकारी' : 'Help & Information'}
          </button>
          
          <button
            onClick={() => {
              if (window.confirm(isHindi ? 'क्या आप नया कस्टमर सेशन शुरू करना चाहते हैं? सारा डेटा क्लियर हो जाएगा।' : 'Start a new session? All unsaved data will be cleared.')) {
                 onClearSession && onClearSession();
              }
            }}
            className="w-full py-2 bg-red-50 hover:bg-red-100 border border-red-100 text-red-600 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            {isHindi ? 'नया सेशन शुरू करें (Clear)' : 'New Customer Session'}
          </button>
        </div>
      </aside>
    </>
  );
};
