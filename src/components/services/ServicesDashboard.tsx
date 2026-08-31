import React, { useState, useEffect } from 'react';
import {
  Landmark,
  Star,
  Search,
  Filter,
  Sparkles,
  Zap,
  Sliders,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Building2,
  FileCheck,
  X,
  Layers,
  Camera,
  FileText,
  FileEdit,
  Bot,
  Printer,
  FolderSync,
  ArrowRight,
  Scissors,
  FileType,
  Bell,
  Receipt,
  BookOpen,
  HelpCircle,
  PhoneCall,
  Flame,
  CheckCircle2,
  BadgeAlert,
  Wallet,
  Clock,
  Download,
  Calendar,
  Activity,
  QrCode,
  FileSpreadsheet,
} from 'lucide-react';
import { GovernmentService, Language } from '../../types';
import { ServiceCard } from './ServiceCard';

interface ServicesDashboardProps {
  language: Language;
  services: GovernmentService[];
  favorites: string[];
  selectedState: string;
  onToggleFavorite: (id: string) => void;
  onOpenLink: (url: string, title: string, actionType: string) => void;
  initialCategory?: string;
  onApplyPreset?: (presetName: string) => void;
  onNavigate?: (view: string, subCategory?: string) => void;
  onOpenSearch?: () => void;
}

export const ServicesDashboard: React.FC<ServicesDashboardProps> = ({
  language,
  services,
  favorites,
  selectedState,
  onToggleFavorite,
  onOpenLink,
  initialCategory = 'all',
  onApplyPreset,
  onNavigate,
  onOpenSearch,
}) => {
  const isHindi = language === 'hi';
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showRateModal, setShowRateModal] = useState<boolean>(false);
  const [activeNoticeIndex, setActiveNoticeIndex] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  // Digital Clock Updater
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
      );
      setCurrentDate(
        now.toLocaleDateString('hi-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory]);

  // Live notices / Updates ticker
  const notices = [
    {
      id: 1,
      badgeHi: 'नया अपडेट',
      badgeEn: 'New Feature',
      textHi: '⚡ A4 पासपोर्ट फोटो मेकर: अब 1-क्लिक में 8, 16, 32 फोटो शीट सीधे प्रिंटर पर निकालें।',
      textEn: '⚡ A4 Photo Maker: Direct 1-Click print for 8, 16, 32 photo sheets on A4 paper.',
      actionView: 'photo_tools',
      subCategory: 'a4_photo',
    },
    {
      id: 2,
      badgeHi: 'सरकारी पोर्टल',
      badgeEn: 'Govt Server',
      textHi: '📢 ई-डिस्ट्रिक्ट (e-District): आय, जाति, निवास प्रमाण पत्र व खतौनी सर्वर 100% एक्टिव है।',
      textEn: '📢 e-District Portal: Income, Caste, Domicile certificate & Bhulekh servers fully online.',
      actionView: null,
      subCategory: undefined,
    },
    {
      id: 3,
      badgeHi: 'योजना अलर्ट',
      badgeEn: 'Scheme Alert',
      textHi: '🌾 PM किसान सम्मान निधि: आगामी किस्त के लिए बायोमेट्रिक / OTP e-KYC तुरंत पूरा करें।',
      textEn: '🌾 PM Kisan Samman Nidhi: Complete mandatory e-KYC for installment release.',
      actionView: null,
      subCategory: undefined,
    },
    {
      id: 4,
      badgeHi: 'दुकान टूल',
      badgeEn: 'Shop Tool',
      textHi: '🧾 इनवॉइस व रसीद जनरेटर: ग्राहकों के लिए दुकान के लोगो व UPI QR के साथ पक्की रसीद बनाएं।',
      textEn: '🧾 Instant Receipt Maker: Generate customized customer receipts with logo & QR code.',
      actionView: 'invoice_gen',
      subCategory: undefined,
    },
  ];

  // Auto rotate notices
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveNoticeIndex((prev) => (prev + 1) % notices.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [notices.length]);

  const categories = [
    { id: 'all', labelHi: 'सभी सेवाएं', labelEn: 'All Services', icon: '🏛️' },
    { id: 'id_services', labelHi: 'पहचान पत्र', labelEn: 'ID Services (UIDAI/PAN)', icon: '🪪' },
    { id: 'certificates', labelHi: 'प्रमाण पत्र', labelEn: 'Certificates (e-District)', icon: '📜' },
    { id: 'schemes', labelHi: 'सरकारी योजनाएं', labelEn: 'Govt Schemes', icon: '🌾' },
    { id: 'applications', labelHi: 'आवेदन पोर्टल', labelEn: 'Applications (DL/Passport)', icon: '📝' },
    { id: 'payments', labelHi: 'बिल व कर', labelEn: 'Bills & Payments (UPPCL)', icon: '⚡' },
    { id: 'land_records', labelHi: 'भूलेख व खतौनी', labelEn: 'Land Records (Bhulekh)', icon: '🗺️' },
    { id: 'police_legal', labelHi: 'पुलिस व कानूनी', labelEn: 'Police & Legal Verification', icon: '⚖️' },
    { id: 'finance', labelHi: 'बैंकिंग व फाइनेंस', labelEn: 'Banking & Finance', icon: '🏦' },
  ];

  // Quick Action Operator Tools Definition
  const quickActions = [
    {
      id: 'quick-action-a4-sheet',
      titleEn: 'A4 Passport Photo',
      titleHi: 'A4 पासपोर्ट फोटो मेकर',
      descEn: '8, 16, 32 photos on A4 sheet with 1-click print',
      descHi: '8, 16, 32 फोटो A4 शीट पर व 1-क्लिक डायरेक्ट प्रिंट',
      view: 'photo_tools',
      subCategory: 'a4_photo',
      icon: Camera,
      badge: isHindi ? '1-क्लिक प्रिंट' : '1-Click Print',
      color: 'from-blue-600 to-indigo-600',
      bgLight: 'bg-gradient-to-br from-blue-50 to-indigo-50/60 hover:from-blue-100 hover:to-indigo-100 border-blue-200/80',
      textColor: 'text-blue-700',
      iconBg: 'bg-blue-600 text-white',
    },
    {
      id: 'quick-action-resize-photo',
      titleEn: 'Photo & Sign Resizer',
      titleHi: 'फोटो व साइन रिसाइज़र',
      descEn: 'Resize to exact 10KB, 20KB, 50KB for Govt forms',
      descHi: 'सरकारी फॉर्म्स हेतु 10KB, 20KB, 50KB परफेक्ट साइज',
      view: 'photo_tools',
      subCategory: 'resizer',
      icon: Scissors,
      badge: isHindi ? 'भर्ती फॉर्म स्पेशल' : 'Govt Form Special',
      color: 'from-sky-600 to-blue-600',
      bgLight: 'bg-gradient-to-br from-sky-50 to-blue-50/60 hover:from-sky-100 hover:to-blue-100 border-sky-200/80',
      textColor: 'text-sky-700',
      iconBg: 'bg-sky-600 text-white',
    },
    {
      id: 'quick-action-convert-pdf',
      titleEn: 'Convert & Compress PDF',
      titleHi: 'पीडीएफ कनवर्ट व कंप्रेस',
      descEn: 'Merge, split, JPG to PDF & compress under 200KB',
      descHi: 'JPG से PDF, मर्ज व 100-200KB ऑटो कंप्रेसर',
      view: 'pdf_tools',
      icon: FileType,
      badge: isHindi ? 'दस्तावेज टूल' : 'Merge & Compress',
      color: 'from-rose-600 to-pink-600',
      bgLight: 'bg-gradient-to-br from-rose-50 to-pink-50/60 hover:from-rose-100 hover:to-pink-100 border-rose-200/80',
      textColor: 'text-rose-700',
      iconBg: 'bg-rose-600 text-white',
    },
    {
      id: 'quick-action-write-application',
      titleEn: 'Write Application',
      titleHi: 'प्रार्थना पत्र निर्माण (Hindi)',
      descEn: 'Draft official letters for SDM, Police, Bank & Bill',
      descHi: 'SDM, थाना, बिजली विभाग, बैंक हेतु तैयार प्रार्थना पत्र',
      view: 'application_builder',
      icon: FileEdit,
      badge: isHindi ? 'रेडीमेड ड्राफ्ट' : 'Ready Applications',
      color: 'from-emerald-600 to-teal-600',
      bgLight: 'bg-gradient-to-br from-emerald-50 to-teal-50/60 hover:from-emerald-100 hover:to-teal-100 border-emerald-200/80',
      textColor: 'text-emerald-700',
      iconBg: 'bg-emerald-600 text-white',
    },
    {
      id: 'quick-action-invoice',
      titleEn: 'Instant Bill / Receipt',
      titleHi: 'ग्राहक रसीद / इनवॉइस',
      descEn: 'Generate print-ready fee slips with shop logo & QR',
      descHi: 'दुकान लोगो व QR कोड सहित तत्काल पक्की रसीद बनाएं',
      view: 'invoice_gen',
      icon: Receipt,
      badge: isHindi ? 'दुकान रसीद' : 'Shop Bill',
      color: 'from-amber-600 to-orange-600',
      bgLight: 'bg-gradient-to-br from-amber-50 to-orange-50/60 hover:from-amber-100 hover:to-orange-100 border-amber-200/80',
      textColor: 'text-amber-700',
      iconBg: 'bg-amber-600 text-white',
    },
    {
      id: 'quick-action-khata',
      titleEn: 'Daily Cash Khata',
      titleHi: 'दैनिक खाता व हिसाब',
      descEn: 'Track daily earnings, expenses, online/cash collection',
      descHi: 'दैनिक आमदनी, खर्च व ऑनलाइन/कैश गल्ले का हिसाब',
      view: 'daily_khata',
      icon: Wallet,
      badge: isHindi ? 'गल्ला रजिस्टर' : 'Cash Book',
      color: 'from-purple-600 to-violet-600',
      bgLight: 'bg-gradient-to-br from-purple-50 to-violet-50/60 hover:from-purple-100 hover:to-violet-100 border-purple-200/80',
      textColor: 'text-purple-700',
      iconBg: 'bg-purple-600 text-white',
    },
  ];

  // Common Govt Application Formats for Direct Operator Download
  const commonForms = [
    {
      id: 'form-swprmadit',
      titleHi: 'स्वप्रमाणित घोषणा पत्र (e-District)',
      titleEn: 'Self Declaration Form (eDistrict)',
      descHi: 'आय, जाति, निवास आवेदन हेतु आवश्यक घोषणा पत्र',
      descEn: 'Mandatory declaration for Income/Caste/Domicile',
      category: 'certificates',
      type: 'PDF',
      size: '120 KB',
      directLink: 'https://edistrict.up.gov.in/edistrictup/Static_Pages/SelfDeclaration_Hindi.pdf',
    },
    {
      id: 'form-pan-49a',
      titleHi: 'पैन कार्ड फॉर्म 93 (नया 2026)',
      titleEn: 'PAN Card Form 93 (New 2026)',
      descHi: 'नया पैन कार्ड ऑफलाइन फॉर्म (2026 अपडेटेड)',
      descEn: 'Updated Physical Application Form 93 for 2026',
      category: 'id_services',
      type: 'PDF',
      size: '240 KB',
      directLink: 'https://incometaxindia.gov.in/forms/income-tax%20rules/103120000000007849.pdf',
    },
    {
      id: 'form-aadhaar-update',
      titleHi: 'आधार नामांकन / सुधार फॉर्म',
      titleEn: 'Aadhaar Enrolment / Update Form',
      descHi: 'आधार केंद्र हेतु आधिकारिक सुधार व नामांकन फॉर्म',
      descEn: 'Official UIDAI Resident Enrolment & Update Form',
      category: 'id_services',
      type: 'PDF',
      size: '480 KB',
      directLink: 'https://uidai.gov.in/images/aadhaar_enrolment_correction_form_version_2.1.pdf',
    },
    {
      id: 'form-ration-surrender',
      titleHi: 'राशन कार्ड नया / संशोधन फॉर्म',
      titleEn: 'Ration Card Application Form',
      descHi: 'NFSA परिवार नाम जोड़ना या नया राशन कार्ड आवेदन',
      descEn: 'NFSA Ration Card family member add or new apply form',
      category: 'schemes',
      type: 'PDF',
      size: '180 KB',
      directLink: 'https://fcs.up.gov.in/',
    },
  ];

  // Standard Cyber Cafe Rate List Data
  const rateListData = [
    { serviceHi: 'आधार कार्ड प्रिंट (PVC / लैमिनेशन)', serviceEn: 'Aadhaar PVC / Laminated Print', rate: '₹30 - ₹50', time: '2 मिनट' },
    { serviceHi: 'पासपोर्ट साइज फोटो (8 फोटो शीट)', serviceEn: 'Passport Size Photo (8 Photos)', rate: '₹30', time: '3 मिनट' },
    { serviceHi: 'पासपोर्ट साइज फोटो (16 फोटो शीट)', serviceEn: 'Passport Size Photo (16 Photos)', rate: '₹50', time: '4 मिनट' },
    { serviceHi: 'आय / जाति / निवास प्रमाण पत्र आवेदन', serviceEn: 'Income / Caste / Domicile Certificate', rate: '₹50 - ₹70', time: '10 मिनट' },
    { serviceHi: 'पैन कार्ड नया आवेदन / सुधार', serviceEn: 'PAN Card New / Correction', rate: '₹100 - ₹150', time: '15 मिनट' },
    { serviceHi: 'सरकारी नौकरी ऑनलाइन फॉर्म', serviceEn: 'Govt Job Online Application', rate: '₹50 - ₹100', time: '15 मिनट' },
    { serviceHi: 'ब्लैक & व्हाइट प्रिंट / फोटोकॉपी', serviceEn: 'B&W Print / Photocopy', rate: '₹3 - ₹5 / पेज', time: 'तुरंत' },
    { serviceHi: 'कलर प्रिंटआउट (Photo Paper)', serviceEn: 'Color Printout', rate: '₹10 - ₹20 / पेज', time: '1 मिनट' },
    { serviceHi: 'दस्तावेज लैमिनेशन (A4 Size)', serviceEn: 'Document Lamination (A4)', rate: '₹20 - ₹30', time: '2 मिनट' },
    { serviceHi: 'बिजली बिल भुगतान व रसीद', serviceEn: 'Electricity Bill Payment & Receipt', rate: '₹10 - ₹20', time: '2 मिनट' },
    { serviceHi: 'खतौनी / भूलेख नकल प्रिंट', serviceEn: 'Bhulekh / Khatauni Copy Print', rate: '₹20', time: '2 मिनट' },
    { serviceHi: 'हिंदी / अंग्रेजी प्रार्थना पत्र टाइपिंग', serviceEn: 'Application Typing & Print', rate: '₹40 - ₹60', time: '5 मिनट' },
  ];

  // Filter by state, category, search, or favorite view
  const filteredServices = services.filter((s) => {
    if (!s.active) return false;

    // Category filter: handle favorites or normal categories
    if (activeCategory === 'favorites') {
      if (!favorites.includes(s.id)) return false;
    } else if (activeCategory !== 'all' && s.category !== activeCategory) {
      return false;
    }

    // State filter: keep services matching selected state OR central/ALL
    if (selectedState !== 'ALL' && s.stateCode !== 'ALL' && s.stateCode !== selectedState) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = s.titleHi.toLowerCase().includes(q) || s.titleEn.toLowerCase().includes(q);
      const matchDesc = s.descHi.toLowerCase().includes(q) || s.descEn.toLowerCase().includes(q);
      const matchTags = s.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchTags) return false;
    }

    return true;
  });

  const popularServices = services.filter((s) => s.active && s.isPopular);
  const stateActivePortals = services.filter(
    (s) => s.active && (s.stateCode === selectedState || s.stateCode === 'ALL')
  ).length;

  return (
    <div className="space-y-6">
      {/* 1. TOP OPERATOR STATUS & LIVE DIGITAL CLOCK BAR */}
      <div className="bg-white rounded-3xl p-4 sm:px-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-[18px] bg-gradient-to-br from-indigo-50 to-blue-50 text-blue-600 flex items-center justify-center font-black shadow-sm ring-1 ring-blue-100/50 text-xl">
            🇮🇳
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">
                {isHindi ? 'नमस्ते संचालक जी!' : 'Welcome Operator!'}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {isHindi ? 'सर्वर ऑनलाइन' : 'System Online'}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">
              {isHindi
                ? 'आपका Cyber Mitra CSC वर्कस्टेशन तैयार है। सभी पोर्टल और टूल सक्रिय हैं।'
                : 'Your Cyber Mitra CSC workstation is ready. Portals and tools are active.'}
            </p>
          </div>
        </div>

        {/* Live Clock & Date */}
        <div className="flex items-center gap-2.5 ml-auto">
          <div className="flex items-center gap-2 px-4 py-2 rounded-[14px] bg-slate-50 text-slate-700 text-xs font-mono font-bold border border-slate-100/50">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>{currentTime || '02:30:00 PM'}</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs font-medium">
            <Calendar className="w-3.5 h-3.5 text-amber-600" />
            <span>{currentDate || '30 Aug 2026'}</span>
          </div>
          <button
            onClick={() => setShowRateModal(true)}
            className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-transform hover:scale-105"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{isHindi ? 'रेट चार्ट' : 'Rate Chart'}</span>
          </button>
        </div>
      </div>

      {/* 2. TOP LIVE NOTICE / TICKER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-3 sm:px-4 border border-indigo-900/60 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 overflow-hidden relative">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[11px] font-bold shrink-0">
            <Bell className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>{isHindi ? notices[activeNoticeIndex].badgeHi : notices[activeNoticeIndex].badgeEn}</span>
          </div>
          <p className="text-xs sm:text-sm font-medium text-slate-200 truncate">
            {isHindi ? notices[activeNoticeIndex].textHi : notices[activeNoticeIndex].textEn}
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          {notices[activeNoticeIndex].actionView && onNavigate && (
            <button
              onClick={() => onNavigate(notices[activeNoticeIndex].actionView!, notices[activeNoticeIndex].subCategory)}
              className="text-[11px] font-bold text-indigo-300 hover:text-white hover:underline flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg transition-colors"
            >
              <span>{isHindi ? 'टूल खोलें' : 'Open Tool'}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* 3. CSC / DIGITAL SEVA HERO BANNER */}
      <div className="bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#1e3a8a] text-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-800 relative overflow-hidden">
        {/* Background glow accents */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -top-10 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>{isHindi ? 'डिजिटल सेवा एवं सीएससी वर्कस्टेशन' : 'Digital Seva & CSC Workstation'}</span>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                {isHindi ? '100% सत्यापित सरकारी पोर्टल' : '100% Verified Official Portals'}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight">
              {isHindi ? 'नागरिक सेवा, फॉर्म टूल्स एवं सरकारी पोर्टल केंद्र' : 'Citizen Services, Form Tools & Govt Portal Hub'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
              {isHindi
                ? 'आधार, पैन, आय, जाति, निवास, राशन कार्ड, खतौनी, बिजली बिल एवं 1-क्लिक पासपोर्ट फोटो प्रिंटर - साइबर कैफे संचालकों के लिए पूर्ण समाधान।'
                : 'Direct access to official Central & State Govt citizen service portals, A4 Photo Maker, PDF Tools & Daily Cafe Registers.'}
            </p>

            {/* Quick Action Shortcuts inside Hero */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                onClick={() => onNavigate && onNavigate('photo_tools', 'a4_photo')}
                className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-sm transition-all hover:scale-105"
              >
                <Camera className="w-4 h-4 text-amber-300" />
                {isHindi ? 'A4 फोटो प्रिंटर (1-Click)' : 'A4 Photo Maker (1-Click)'}
              </button>
              <button
                onClick={() => onNavigate && onNavigate('photo_tools', 'resizer')}
                className="px-3 py-2 bg-slate-700/80 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-600 shadow-sm transition-all hover:scale-105"
              >
                <Scissors className="w-3.5 h-3.5 text-sky-400" />
                {isHindi ? '20-50KB फोटो रिसाइज' : '20-50KB Resizer'}
              </button>
              <button
                onClick={() => onNavigate && onNavigate('invoice_gen')}
                className="px-3 py-2 bg-slate-700/80 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-600 shadow-sm transition-all hover:scale-105"
              >
                <Receipt className="w-3.5 h-3.5 text-amber-400" />
                {isHindi ? 'ग्राहक बिल / रसीद' : 'Invoice Slip'}
              </button>
              <button
                onClick={() => onNavigate && onNavigate('application_builder')}
                className="px-3 py-2 bg-slate-700/80 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-600 shadow-sm transition-all hover:scale-105"
              >
                <FileEdit className="w-3.5 h-3.5 text-emerald-400" />
                {isHindi ? 'प्रार्थना पत्र लेखक' : 'Application Builder'}
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 self-start lg:self-center">
            <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 text-center min-w-[90px]">
              <div className="text-xl sm:text-2xl font-black text-blue-400 leading-none">
                {stateActivePortals}
              </div>
              <div className="text-[10px] text-slate-300 font-semibold uppercase tracking-wider mt-1.5">
                {isHindi ? 'सक्रिय पोर्टल' : 'Active Portals'}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 text-center min-w-[90px]">
              <div className="text-xl sm:text-2xl font-black text-emerald-400 leading-none">
                100%
              </div>
              <div className="text-[10px] text-slate-300 font-semibold uppercase tracking-wider mt-1.5">
                {isHindi ? 'सत्यापित लिंक' : 'Verified Links'}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 text-center min-w-[90px]">
              <div className="text-xl sm:text-2xl font-black text-amber-400 leading-none">
                15+
              </div>
              <div className="text-[10px] text-slate-300 font-semibold uppercase tracking-wider mt-1.5">
                {isHindi ? 'स्मार्ट टूल्स' : 'Smart Tools'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. QUICK ACTIONS SECTION - OPERATOR CORE TOOLS */}
      <div id="quick-actions-section" className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-sm sm:text-base text-slate-900 leading-tight">
                  {isHindi ? 'साइबर कैफे आवश्यक टूल्स (Core Daily Tools)' : 'Cyber Cafe Daily Core Tools — Quick Launch'}
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200 px-1.5 py-0.2 rounded-full hidden sm:inline">
                  1-Click Direct Access
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {isHindi
                  ? 'पासपोर्ट फोटो, 20-50KB रिसाइज, पीडीएफ कनवर्टर, प्रार्थना पत्र लेखक व दैनिक हिसाब'
                  : 'Passport photo sheet, 20-50KB resizer, PDF compressor, application drafts & cash book'}
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 hidden md:inline-block">
            {quickActions.length} {isHindi ? 'आवश्यक टूल्स' : 'Core Tools'}
          </span>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <button
                key={action.id}
                id={action.id}
                onClick={() => onNavigate && onNavigate(action.view, action.subCategory)}
                className={`p-4 rounded-3xl border border-white/60 transition-all text-left group flex flex-col justify-between hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 ${action.bgLight} ring-1 ring-slate-100`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform ${action.iconBg}`}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-blue-900 leading-tight">
                          {isHindi ? action.titleHi : action.titleEn}
                        </h3>
                        <div className="text-[10px] text-slate-500 font-semibold mt-0.5">
                          {isHindi ? action.titleEn : action.titleHi}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full border shrink-0 bg-white/80 ${action.textColor}`}
                    >
                      {action.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-normal leading-relaxed line-clamp-2">
                    {isHindi ? action.descHi : action.descEn}
                  </p>
                </div>
                <div
                  className={`mt-2.5 pt-2 border-t border-slate-200/50 flex items-center justify-between text-[11px] font-bold ${action.textColor}`}
                >
                  <span>{isHindi ? 'टूल शुरू करें' : 'Open Tool'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. QUICK ACCESS POPULAR SERVICES HUB */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-amber-100 flex items-center justify-center shadow-xs">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm sm:text-base text-slate-900 leading-tight">
                {isHindi ? 'सर्वाधिक लोकप्रिय सेवाएं (Trending Portals)' : 'Trending Government Portals'}
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                {isHindi ? 'दैनिक उपयोग की मुख्य सेवाएं (1-क्लिक एक्सेस)' : 'Most frequented citizen services for daily cafe operations'}
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
            {popularServices.length} {isHindi ? 'मुख्य पोर्टल' : 'Trending'}
          </span>
        </div>

        {/* Quick Access Horizontal Scroll / Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {popularServices.slice(0, 12).map((service) => (
            <button
              key={service.id}
              onClick={() =>
                onOpenLink(
                  service.officialLinks.officialPortal ||
                    service.officialLinks.apply ||
                    service.officialLinks.download ||
                    '#',
                  isHindi ? service.titleHi : service.titleEn,
                  'Quick Launch'
                )
              }
              className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-blue-50 hover:border-blue-300 transition-all text-left group flex flex-col justify-between hover:shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="text-base">{service.category === 'id_services' ? '🪪' : service.category === 'certificates' ? '📜' : service.category === 'schemes' ? '🌾' : '🏛️'}</span>
                  <span className="text-[9px] font-bold text-amber-600 bg-amber-100/80 px-1.5 py-0.2 rounded">
                    ★ Top
                  </span>
                </div>
                <div className="font-bold text-xs text-slate-800 group-hover:text-blue-700 line-clamp-2 leading-tight">
                  {isHindi ? service.titleHi : service.titleEn}
                </div>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 pt-1 border-t border-slate-200/60">
                <span className="font-bold text-blue-700 bg-blue-100/70 px-1.5 py-0.2 rounded text-[9px]">
                  {service.stateCode}
                </span>
                <div className="flex items-center gap-0.5 text-blue-600 font-semibold group-hover:translate-x-0.5 transition-transform">
                  <span>{isHindi ? 'खोलें' : 'Open'}</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 6. GOVT FORMS & DECLARATION DOWNLOAD CENTER */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm sm:text-base text-white leading-tight">
                {isHindi ? 'सरकारी फॉर्म्स व घोषणा पत्र डाउनलोड (Ready PDF Formats)' : 'Govt Form & Affidavit Download Hub'}
              </h2>
              <p className="text-[11px] text-slate-300 font-medium">
                {isHindi ? 'आय/जाति/निवास स्वप्रमाणित घोषणा पत्र, पैन 93, आधार सुधार फॉर्म' : 'Direct official blank forms for offline submission & print'}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('downloads')}
            className="text-xs font-bold text-amber-300 hover:text-white flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl transition-colors shrink-0 self-start sm:self-auto"
          >
            <span>{isHindi ? 'सभी फॉर्म्स देखें' : 'View All Forms'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {commonForms.map((f) => (
            <div
              key={f.id}
              className="bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl p-3 flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-red-500/30 text-red-300 border border-red-400/30 px-1.5 py-0.5 rounded">
                    {f.type} • {f.size}
                  </span>
                  <FileText className="w-4 h-4 text-slate-400" />
                </div>
                <h4 className="font-bold text-xs text-white line-clamp-1">
                  {isHindi ? f.titleHi : f.titleEn}
                </h4>
                <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                  {isHindi ? f.descHi : f.descEn}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between">
                <a
                  href={f.directLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'फॉर्म खोलें / डाउनलोड' : 'Download PDF'}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. CATEGORY FILTERS & LOCAL SEARCH */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3.5">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 no-scrollbar text-xs">
          {categories.map((cat) => {
            const count = services.filter((s) => {
              if (!s.active) return false;
              if (selectedState !== 'ALL' && s.stateCode !== 'ALL' && s.stateCode !== selectedState) {
                return false;
              }
              if (cat.id === 'all') return true;
              return s.category === cat.id;
            }).length;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap flex items-center gap-2 transition-all shrink-0 ${
                  activeCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-600/20'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{isHindi ? cat.labelHi : cat.labelEn}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    activeCategory === cat.id
                      ? 'bg-white/20 text-white font-black'
                      : 'bg-slate-200 text-slate-600 font-bold'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-3 border-t border-slate-100">
          <div className="relative flex-1 w-full sm:max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isHindi ? 'इस लिस्ट में खोजें...' : 'Filter list...'}
              className="w-full pl-9 pr-8 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none bg-slate-50"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 w-full justify-between sm:w-auto">
            <div className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200 whitespace-nowrap flex-1 text-center sm:flex-none">
              {filteredServices.length} {isHindi ? 'पोर्टल उपलब्ध' : 'Portals ready'}
            </div>
            {activeCategory !== 'all' && (
              <button
                onClick={() => setActiveCategory('all')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline px-3 py-2 bg-blue-50 rounded-xl"
              >
                {isHindi ? 'सभी देखें' : 'View All Category'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 8. SERVICES GRID */}
      {filteredServices.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
          <Landmark className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <h3 className="font-extrabold text-base text-slate-800">
            {isHindi ? 'कोई सेवा नहीं मिली' : 'No services found'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            {isHindi
              ? 'कृपया राज्य फ़िल्टर बदलें या खोज शब्द रीसेट करें।'
              : 'Try changing your search term or switching the state filter.'}
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-xs"
            >
              {isHindi ? 'फ़िल्टर रीसेट करें' : 'Reset Filters'}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              language={language}
              isFavorite={favorites.includes(service.id)}
              onToggleFavorite={onToggleFavorite}
              onOpenLink={onOpenLink}
              onApplyPreset={onApplyPreset}
            />
          ))}
        </div>
      )}

      {/* 9. QUICK HELPLINE & CYBER SAFETY FOOTER BAR */}
      <div className="bg-slate-100 rounded-2xl p-4 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2 font-bold text-slate-800">
          <PhoneCall className="w-4 h-4 text-blue-600" />
          <span>{isHindi ? 'महत्वपूर्ण सरकारी हेल्पलाइन:' : 'Key Govt Helplines:'}</span>
        </div>
        <div className="flex flex-wrap items-center gap-3 font-semibold text-[11px]">
          <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
            🛡️ {isHindi ? 'साइबर हेल्पलाइन:' : 'Cyber Helpline:'} <b className="text-rose-600 font-bold">1930</b>
          </span>
          <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
            🪪 {isHindi ? 'आधार हेल्पलाइन:' : 'UIDAI Helpline:'} <b className="text-blue-600 font-bold">1947</b>
          </span>
          <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
            ⚡ {isHindi ? 'विद्युत शिकायत:' : 'Electricity:'} <b className="text-amber-600 font-bold">1912</b>
          </span>
          <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
            🌾 {isHindi ? 'किसान कॉल सेंटर:' : 'Kisan Helpline:'} <b className="text-emerald-600 font-bold">1800-180-1551</b>
          </span>
        </div>
      </div>

      {/* 10. STANDARD RATE LIST MODAL */}
      {showRateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-scale-in">
            <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-black text-base sm:text-lg text-white">
                    {isHindi ? 'साइबर कैफे मानक दर सूची (Rate List)' : 'Cyber Cafe Standard Service Rates'}
                  </h3>
                  <p className="text-[11px] text-slate-300 font-medium">
                    {isHindi ? 'सामान्य नागरिक सेवाओं का अनुमोदित रेट चार्ट' : 'Standard recommended charges for common cafe services'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowRateModal(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-5 max-h-[65vh] overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                    <th className="pb-2.5">{isHindi ? 'सेवा का नाम' : 'Service Name'}</th>
                    <th className="pb-2.5 text-center">{isHindi ? 'अनुमानित समय' : 'Est. Time'}</th>
                    <th className="pb-2.5 text-right">{isHindi ? 'मानक शुल्क (Rate)' : 'Rate'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {rateListData.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 font-bold text-slate-900">
                        {isHindi ? item.serviceHi : item.serviceEn}
                        <div className="text-[10px] text-slate-500 font-normal">
                          {isHindi ? item.serviceEn : item.serviceHi}
                        </div>
                      </td>
                      <td className="py-2.5 text-center text-slate-500 text-[11px]">
                        <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {item.time}
                        </span>
                      </td>
                      <td className="py-2.5 text-right font-extrabold text-blue-700">
                        {item.rate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px]">
                💡 {isHindi ? 'आप इस रेट सूची को अपने अनुसार बदल सकते हैं।' : 'Rates may vary according to local market norms.'}
              </span>
              <button
                onClick={() => setShowRateModal(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs"
              >
                {isHindi ? 'बंद करें' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
