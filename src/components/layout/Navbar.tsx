import React from 'react';
import {
  ShieldCheck,
  Globe,
  Lock,
  Unlock,
  Trash2,
  UserCheck,
  Menu,
  X,
  Printer,
  Sparkles,
  Search,
  MapPin,
} from 'lucide-react';
import { Language, CustomerData, StateItem } from '../../types';

interface NavbarProps {
  language: Language;
  onLanguageToggle: () => void;
  states: StateItem[];
  selectedState: string;
  onStateChange: (code: string) => void;
  customer: CustomerData;
  activeFilesCount: number;
  printQueueCount: number;
  isAdminLoggedIn: boolean;
  onOpenAdminModal: () => void;
  onClearSession: () => void;
  onOpenCustomerModal: () => void;
  onNavigate: (view: string) => void;
  currentView: string;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageToggle,
  states,
  selectedState,
  onStateChange,
  customer,
  activeFilesCount,
  printQueueCount,
  isAdminLoggedIn,
  onOpenAdminModal,
  onClearSession,
  onOpenCustomerModal,
  onNavigate,
  currentView,
  onToggleSidebar,
  isSidebarOpen,
  onOpenSearch,
}) => {
  const isHindi = language === 'hi';
  const hasCustomer = !!customer.name.trim();

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-slate-200 text-slate-800 shadow-sm print:hidden transition-all">
      {/* Top subtle tricolor gradient line */}
      <div className="h-1 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808] opacity-90" />

      {/* Top Main Navbar */}
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          {/* Left: Mobile Toggle & Brand Indicator */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              id="btn-toggle-sidebar"
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 focus:outline-none transition-colors"
              title="Menu"
              aria-label="Toggle navigation"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <button
              id="btn-brand-home"
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white flex items-center justify-center font-black text-lg shadow-sm group-hover:scale-105 transition-transform border border-blue-600/30">
                CM
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 font-sans">
                    CYBER MITRA
                  </span>
                  <span className="hidden sm:inline-block px-1.5 py-0.2 text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded uppercase tracking-wider">
                    CSC / DIGITAL SEVA
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-semibold leading-none hidden sm:inline">
                  {isHindi ? 'साइबर कैफे एवं डिजिटल सेवा कार्य पोर्टल' : 'Cyber Cafe & Citizen Services Portal'}
                </span>
              </div>
            </button>
          </div>

          {/* Center: Universal Search Button */}
          <div className="flex-1 max-w-lg mx-2 lg:mx-6">
            <button
              id="btn-search-trigger"
              onClick={onOpenSearch}
              className="w-full flex items-center justify-between pl-3.5 pr-2.5 py-2 bg-slate-100/90 hover:bg-slate-200/90 text-slate-600 rounded-xl text-xs sm:text-sm border border-slate-200 hover:border-slate-300 transition-all shadow-2xs group"
            >
              <div className="flex items-center gap-2.5 text-slate-500 group-hover:text-slate-800 truncate">
                <Search className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="truncate">
                  {isHindi
                    ? 'खोजें: आधार, पैन, आय, निवास, फोटो रिसाइज, फॉर्म...'
                    : 'Search Aadhaar, PAN, Certificates, Photo tools...'}
                </span>
              </div>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono font-semibold bg-white text-slate-500 rounded-md border border-slate-200 shadow-2xs shrink-0 ml-2">
                Ctrl+K
              </kbd>
            </button>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* State Selection Dropdown */}
            <div className="relative hidden sm:flex items-center">
              <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
              <select
                id="select-state"
                value={selectedState}
                onChange={(e) => onStateChange(e.target.value)}
                className="bg-slate-100 hover:bg-slate-200/70 text-slate-700 text-xs font-semibold rounded-lg pl-7 pr-3 py-1.5 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all"
                title={isHindi ? 'राज्य चुनें' : 'Select State'}
              >
                {states
                  .filter((s) => s.active)
                  .map((s) => (
                    <option key={s.code} value={s.code} className="bg-white text-slate-800">
                      {isHindi ? s.nameHi : s.nameEn}
                    </option>
                  ))}
              </select>
            </div>

            {/* Segmented Pill Language Switcher */}
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
              <button
                id="btn-lang-en"
                onClick={() => language !== 'en' && onLanguageToggle()}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                  language === 'en'
                    ? 'bg-white shadow-xs text-blue-700 font-extrabold'
                    : 'text-slate-500 hover:text-blue-600'
                }`}
              >
                EN
              </button>
              <button
                id="btn-lang-hi"
                onClick={() => language !== 'hi' && onLanguageToggle()}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                  language === 'hi'
                    ? 'bg-white shadow-xs text-blue-700 font-extrabold'
                    : 'text-slate-500 hover:text-blue-600'
                }`}
              >
                हिंदी
              </button>
            </div>

            {/* Share Portal Button */}
            <button
              onClick={async () => {
                try {
                  if (navigator.share) {
                    await navigator.share({
                      title: 'Cyber Mitra - CSC & Digital Seva Portal',
                      text: isHindi 
                        ? 'सरकारी फॉर्म, फोटो रिसाइज, PDF टूल्स और AI चैट के लिए सबसे बेहतरीन वेबसाइट!' 
                        : 'Best All-in-One portal for Govt Forms, Photo Resize, PDF tools, and AI Chat!',
                      url: 'https://cebermitra.netlify.app/',
                    });
                  } else {
                    navigator.clipboard.writeText('https://cebermitra.netlify.app/');
                    alert(isHindi ? 'लिंक कॉपी हो गया! अब आप इसे Facebook/WhatsApp पर शेयर कर सकते हैं।' : 'Link copied to clipboard! You can share it on Facebook/WhatsApp.');
                  }
                } catch (err) {
                  console.error('Error sharing:', err);
                }
              }}
              className="px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 font-bold text-xs transition-all border bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200"
              title={isHindi ? 'पोर्टल शेयर करें' : 'Share Portal'}
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline font-extrabold">{isHindi ? 'शेयर करें' : 'Share'}</span>
            </button>

            {/* AI Chat Direct Action Button */}
            <button
              id="btn-ai-chat-nav"
              onClick={() => onNavigate('ai_chat')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold text-xs transition-all border shadow-2xs ${
                currentView === 'ai_chat'
                  ? 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white border-purple-800 ring-2 ring-purple-300'
                  : 'bg-purple-50 hover:bg-purple-100 text-purple-800 border-purple-200'
              }`}
              title={isHindi ? 'AI चैट सहायक खोलें' : 'Open AI Chat Assistant'}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0" />
              <span className="hidden sm:inline font-extrabold">{isHindi ? 'AI चैट' : 'AI Chat'}</span>
            </button>

            {/* Print Queue Quick Counter */}
            <button
              id="btn-print-queue-nav"
              onClick={() => onNavigate('print_center')}
              className={`relative p-2 rounded-lg transition-all ${
                currentView === 'print' || currentView === 'print_center'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              title={isHindi ? 'प्रिंट केंद्र' : 'Print Center'}
            >
              <Printer className="w-4 h-4" />
              {printQueueCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-white">
                  {printQueueCount}
                </span>
              )}
            </button>

            {/* Admin Avatar Circle */}
            <button
              id="btn-admin-modal-trigger"
              onClick={onOpenAdminModal}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 font-bold text-xs transition-all border ${
                isAdminLoggedIn
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-2 ring-emerald-100'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
              title={isAdminLoggedIn ? 'Admin Panel (Logged in)' : 'Admin Login'}
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{isAdminLoggedIn ? 'Admin Active' : 'Admin'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Customer Session Sub-Banner */}
      <div className="bg-[#f8fafc] border-t border-slate-200 px-3 sm:px-6 lg:px-8 py-1.5 text-xs text-slate-600">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Active Customer Info */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-slate-600 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>{isHindi ? 'ग्राहक सत्र (Session):' : 'Active Customer:'}</span>
            </span>
            {hasCustomer ? (
              <button
                id="btn-customer-details"
                onClick={onOpenCustomerModal}
                className="font-bold text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-0.5 rounded-md border border-blue-200 flex items-center gap-1.5 transition-colors"
              >
                <span>{customer.name}</span>
                {customer.mobile && <span className="text-blue-600 font-normal">({customer.mobile})</span>}
                <span className="text-[10px] text-blue-600 underline font-medium ml-0.5">
                  {isHindi ? 'बदलें' : 'Edit'}
                </span>
              </button>
            ) : (
              <button
                id="btn-add-customer"
                onClick={onOpenCustomerModal}
                className="text-slate-600 hover:text-blue-700 bg-white hover:bg-slate-50 px-2.5 py-0.5 rounded-md border border-dashed border-slate-300 flex items-center gap-1 transition-colors"
              >
                <span>+ {isHindi ? 'ग्राहक का नाम व मोबाइल जोड़ें' : 'Add Customer Details'}</span>
              </button>
            )}

            {/* Active files indicator */}
            {activeFilesCount > 0 && (
              <button
                onClick={() => onNavigate('workspace')}
                className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md text-[11px] font-semibold flex items-center gap-1 border border-indigo-200 hover:bg-indigo-100"
              >
                <span>📁 {activeFilesCount} {isHindi ? 'फाइलें संलग्न' : 'Files in Hub'}</span>
              </button>
            )}
          </div>

          {/* Quick Clear Session Button */}
          <div className="flex items-center gap-2">
            <button
              id="btn-clear-customer-session"
              onClick={onClearSession}
              className="flex items-center gap-1 px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-md text-[11px] border border-red-200 transition-colors"
              title={isHindi ? 'ग्राहक सत्र एवं फाइलें तुरंत साफ़ करें' : 'Clear Customer Session & Files'}
            >
              <Trash2 className="w-3 h-3" />
              <span>{isHindi ? 'सत्र साफ़ करें' : 'Clear'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
