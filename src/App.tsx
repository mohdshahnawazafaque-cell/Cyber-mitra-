import React, { useState, useEffect, Suspense, lazy } from 'react';
import {
  AppState,
  CustomerData,
  GovernmentService,
  Language,
  PrintJob,
  SessionFile,
} from './types';
import {
  loadAppState,
  saveAppState,
  recordActivityLog,
  clearCustomerSession,
} from './services/storageService';
import { Loader2 } from 'lucide-react';

// Layout & Common Components
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { SmartSearch } from './components/common/SmartSearch';
import { CustomerModal } from './components/customer/CustomerModal';
import { AdminPanel } from './components/admin/AdminPanel';
import { AdSlot } from './components/ads/AdSlot';
import { FloatingAiChatWidget } from './components/chat/FloatingAiChatWidget';

// View Components (Lazy Loaded for Speed)
const ServicesDashboard = lazy(() => import('./components/services/ServicesDashboard').then(module => ({ default: module.ServicesDashboard })));
const PhotoTools = lazy(() => import('./components/tools/PhotoTools').then(module => ({ default: module.PhotoTools })));
const PdfTools = lazy(() => import('./components/tools/PdfTools').then(module => ({ default: module.PdfTools })));
const ApplicationBuilder = lazy(() => import('./components/apps/ApplicationBuilder').then(module => ({ default: module.ApplicationBuilder })));
const AiStudioTools = lazy(() => import('./components/tools/AiStudioTools').then(module => ({ default: module.AiStudioTools })));
const AiChat = lazy(() => import('./components/tools/AiChat').then(module => ({ default: module.AiChat })));
const PrintCenter = lazy(() => import('./components/print/PrintCenter').then(module => ({ default: module.PrintCenter })));
const FileWorkspace = lazy(() => import('./components/files/FileWorkspace').then(module => ({ default: module.FileWorkspace })));
const OfficeTools = lazy(() => import('./components/tools/OfficeTools').then(module => ({ default: module.OfficeTools })));
const ToolsHub = lazy(() => import('./components/tools/ToolsHub').then(module => ({ default: module.ToolsHub })));
const CalculatorHub = lazy(() => import('./components/tools/CalculatorHub').then(module => ({ default: module.CalculatorHub })));
const InvoiceGenerator = lazy(() => import('./components/tools/InvoiceGenerator').then(module => ({ default: module.InvoiceGenerator })));
const PromoDesigner = lazy(() => import('./components/tools/PromoDesigner').then(module => ({ default: module.PromoDesigner })));
const AwasCertificate = lazy(() => import('./components/tools/AwasCertificate').then(module => ({ default: module.AwasCertificate })));
// .then(module => ({ default: module.PromoDesigner })));
const QuickLinksDashboard = lazy(() => import('./components/tools/QuickLinksDashboard').then(module => ({ default: module.QuickLinksDashboard })));
const BulkSmsTool = lazy(() => import('./components/tools/BulkSmsTool').then(module => ({ default: module.BulkSmsTool })));
const DailyKhata = lazy(() => import('./components/tools/DailyKhata').then(module => ({ default: module.DailyKhata })));
const DownloadsHub = lazy(() => import('./components/tools/DownloadsHub').then(module => ({ default: module.DownloadsHub })));
const QRBarcodeTools = lazy(() => import('./components/tools/QRBarcodeTools').then(module => ({ default: module.QRBarcodeTools })));
const SupportPages = lazy(() => import('./components/pages/SupportPages').then(module => ({ default: module.SupportPages })));

// Loading Component
const ViewLoader = ({ isHindi }: { isHindi: boolean }) => (
  <div className="flex flex-col items-center justify-center py-20">
    <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
    <h3 className="text-lg font-bold text-slate-700">
      {isHindi ? 'लोड हो रहा है...' : 'Loading...'}
    </h3>
    <p className="text-sm text-slate-500">
      {isHindi ? 'कृपया प्रतीक्षा करें' : 'Please wait'}
    </p>
  </div>
);

export default function App() {
  const [appState, setAppState] = useState<AppState>(() => loadAppState());
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);

  // Cross-component transition state
  const [targetFileForPhotoTool, setTargetFileForPhotoTool] = useState<SessionFile | null>(null);
  const [targetSubjectForAiWriter, setTargetSubjectForAiWriter] = useState<string>('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  // Auto-save state to localStorage whenever modified
  useEffect(() => {
    saveAppState(appState);
  }, [appState]);

  // Global Keyboard Shortcuts (Ctrl+K for search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const language = appState.language;
  const isHindi = language === 'hi';

  // Language switch
  const handleToggleLanguage = () => {
    const nextLang: Language = appState.language === 'hi' ? 'en' : 'hi';
    setAppState((prev) => ({ ...prev, language: nextLang }));
  };

  // State selection
  const handleStateChange = (stateCode: string) => {
    setAppState((prev) => ({ ...prev, selectedState: stateCode }));
  };

  // View navigation with alias resolution
  const handleNavigate = (view: string, subCategory?: string) => {
    let resolvedView = view;
    if (view === 'print' || view === 'print-center') resolvedView = 'print_center';
    if (view === 'application-builder' || view === 'letters') resolvedView = 'application_builder';
    if (view === 'invoice' || view === 'invoice_gen' || view === 'receipt') resolvedView = 'invoice_generator';
    if (view === 'downloads' || view === 'forms') resolvedView = 'downloads_hub';
    if (view === 'calculator' || view === 'calculators') resolvedView = 'calculator_hub';
    if (view === 'tools') resolvedView = 'tools_hub';
    if (view === 'khata' || view === 'cash_book') resolvedView = 'daily_khata';
    if (view === 'sms' || view === 'whatsapp') resolvedView = 'bulk_sms';
    if (view === 'photo' || view === 'photos') resolvedView = 'photo_tools';
    if (view === 'pdf') resolvedView = 'pdf_tools';
    if (view === 'qr' || view === 'barcode') resolvedView = 'qr_tools';
    if (view.startsWith('services-')) {
      resolvedView = 'services';
    }
    if (view === 'quick-access' || view === 'quick_access') {
      resolvedView = 'services';
      setActiveCategoryFilter('all');
    }

    setAppState((prev) => ({ ...prev, activeView: resolvedView }));
    if (subCategory) {
      setActiveCategoryFilter(subCategory);
    }
    setIsSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Customer session save
  const handleSaveCustomer = (updatedCustomer: CustomerData) => {
    setAppState((prev) => ({ ...prev, customer: updatedCustomer }));
  };

  // Customer session clear
  const handleClearSession = () => {
    const cleared = clearCustomerSession(appState);
    setAppState(cleared);
  };

  // Favorites toggle
  const handleToggleFavorite = (serviceId: string) => {
    setAppState((prev) => {
      const exists = prev.favorites.includes(serviceId);
      const newFavs = exists
        ? prev.favorites.filter((id) => id !== serviceId)
        : [...prev.favorites, serviceId];
      return { ...prev, favorites: newFavs };
    });
  };

  // Add files to universal workspace
  const handleAddFilesToWorkspace = (newFiles: SessionFile[]) => {
    setAppState((prev) => ({
      ...prev,
      activeFiles: [...newFiles, ...prev.activeFiles],
    }));
  };

  // Remove single file
  const handleRemoveFile = (fileId: string) => {
    setAppState((prev) => ({
      ...prev,
      activeFiles: prev.activeFiles.filter((f) => f.id !== fileId),
    }));
  };

  // Clear workspace files
  const handleClearWorkspaceFiles = () => {
    setAppState((prev) => ({ ...prev, activeFiles: [] }));
  };

  // Send to Print Queue
  const handleSendToPrintQueue = (title: string, dataUrl: string, paperSize: string) => {
    const newJob: PrintJob = {
      id: 'print_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      title,
      dataUrl,
      paperSize: paperSize as any,
      copies: 1,
      timestamp: new Date().toISOString(),
      status: 'queued',
    };

    setAppState((prev) => ({
      ...prev,
      printQueue: [newJob, ...prev.printQueue],
    }));
  };

  // Open external official links safely
  const handleOpenLink = (url: string, title: string, actionType: string) => {
    if (!url || url === '#') {
      alert(isHindi ? 'यह लिंक जल्द ही सक्रिय होगा' : 'Link will be available soon');
      return;
    }
    // Record audit log
    recordActivityLog(appState, `Open Portal: ${title}`, `Clicked ${actionType} -> ${url}`);
    
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

  // Quick preset bridge
  const handleApplyPresetFromService = (presetName: string) => {
    handleNavigate('photo_tools');
  };

  // Navigate to photo tool with file
  const handleNavigateToPhotoToolWithFile = (file: SessionFile) => {
    setTargetFileForPhotoTool(file);
    handleNavigate('photo_tools');
  };

  // Navigate to AI writer with preset subject
  const handleNavigateToAiWriter = (presetSubject: string) => {
    setTargetSubjectForAiWriter(presetSubject);
    handleNavigate('ai_studio');
  };

  // Ad Slot finders
  const headerAdSlot = appState.adSlots.find((s) => s.id === 'ad-header' || s.id === 'header-banner');
  const footerAdSlot = appState.adSlots.find((s) => s.id === 'ad-footer' || s.id === 'footer-banner');

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] text-slate-800 antialiased font-sans ${appState.theme === 'high-contrast' ? 'theme-high-contrast' : ''}`}>
      {/* 1. TOP HEADER NAVBAR */}
      <Navbar
        language={language}
        onLanguageToggle={handleToggleLanguage}
        states={appState.states}
        selectedState={appState.selectedState}
        onStateChange={handleStateChange}
        customer={appState.customer}
        activeFilesCount={appState.activeFiles.length}
        printQueueCount={appState.printQueue.length}
        isAdminLoggedIn={appState.isAdminLoggedIn}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        onClearSession={handleClearSession}
        onOpenCustomerModal={() => setIsCustomerModalOpen(true)}
        onNavigate={handleNavigate}
        currentView={appState.activeView}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* 2. MAIN CONTAINER WITH SIDEBAR */}
      <div className="flex-1 flex w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-5 gap-6">
        {/* Left Sidebar */}
        <Sidebar
          language={language}
          activeView={appState.activeView}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onNavigate={handleNavigate}
          onOpenCustomerModal={() => setIsCustomerModalOpen(true)}
          customer={appState.customer}
          activeFilesCount={appState.activeFiles.length}
          printQueueCount={appState.printQueue.length}
          onClearSession={handleClearSession}
        />

        {/* Center Main Work Area */}
        <main className="flex-1 min-w-0 space-y-5">
          {/* Header Ad Slot (Compliant Google AdSense Placement) */}
          {headerAdSlot && <AdSlot slot={headerAdSlot} />}

          <Suspense fallback={<ViewLoader isHindi={isHindi} />}>
            {/* VIEW: HOME / SERVICES DASHBOARD */}
            {(!appState.activeView || appState.activeView === 'home' || appState.activeView === 'services') && (
              <ServicesDashboard
                language={language}
                services={appState.services}
                favorites={appState.favorites}
                selectedState={appState.selectedState}
                onToggleFavorite={handleToggleFavorite}
                onOpenLink={handleOpenLink}
                initialCategory={activeCategoryFilter}
                onApplyPreset={handleApplyPresetFromService}
                onNavigate={handleNavigate}
                onOpenSearch={() => setIsSearchOpen(true)}
              />
            )}

            {/* VIEW: TOOLS HUB */}
            {appState.activeView === 'tools_hub' && (
              <ToolsHub
                language={language}
                onNavigate={handleNavigate}
              />
            )}

            
            
            {/* VIEW: BULK SMS */}
            {appState.activeView === 'bulk_sms' && (
              <BulkSmsTool language={language} />
            )}

            {/* VIEW: DAILY KHATA */}
            {appState.activeView === 'daily_khata' && (
              <DailyKhata language={language} />
            )}
            
            
            {/* VIEW: QUICK LINKS */}
            {appState.activeView === 'quick_links' && (
              <QuickLinksDashboard language={language} />
            )}

            {/* VIEW: DOWNLOADS HUB */}
            {appState.activeView === 'downloads_hub' && (
              <DownloadsHub language={language} />
            )}

            {/* VIEW: CALCULATOR HUB */}
            {appState.activeView === 'calculator_hub' && (
              <CalculatorHub language={language} />
            )}

            {/* VIEW: INVOICE GENERATOR */}
            {appState.activeView === 'invoice_generator' && (
              <InvoiceGenerator language={language} />
            )}

                        {appState.activeView === 'awas_certificate' && (
              <AwasCertificate language={language} />
            )}

            {/* VIEW: PROMO DESIGNER */}
            {appState.activeView === 'promo_designer' && (
              <PromoDesigner language={language} />
            )}

            {/* VIEW: QR TOOLS */}
            {appState.activeView === 'qr_tools' && (
              <QRBarcodeTools language={language} />
            )}

            {/* VIEW: PHOTO TOOLS */}
            {appState.activeView === 'photo_tools' && (
              <PhotoTools
                language={language}
                initialTab={(activeCategoryFilter === 'a4_grid' || activeCategoryFilter === 'a4_photo') ? 'a4_grid' : 'basic'}
                initialFile={targetFileForPhotoTool}
                onAddToWorkspace={handleAddFilesToWorkspace}
                onSendToPrintQueue={handleSendToPrintQueue}
                onNavigate={handleNavigate}
              />
            )}

            {/* VIEW: PDF TOOLS */}
            {appState.activeView === 'pdf_tools' && (
              <PdfTools
                language={language}
                customer={appState.customer}
                onAddToWorkspace={handleAddFilesToWorkspace}
                onSendToPrintQueue={handleSendToPrintQueue}
              />
            )}

            {/* VIEW: APPLICATION Application Builder */}
            {appState.activeView === 'application_builder' && (
              <ApplicationBuilder
                language={language}
                templates={appState.applicationTemplates}
                customer={appState.customer}
                onAddToWorkspace={(file) => handleAddFilesToWorkspace([file])}
                onSendToPrintQueue={handleSendToPrintQueue}
                onOpenCustomerModal={() => setIsCustomerModalOpen(true)}
                onNavigateToAiWriter={handleNavigateToAiWriter}
              />
            )}

            {/* VIEW: AI CHAT ASSISTANT (DEDICATED HUB) */}
            {appState.activeView === 'ai_chat' && (
              <AiChat
                language={language}
                customer={appState.customer}
                onNavigateToBuilder={(subject) => {
                  setTargetSubjectForAiWriter(subject);
                  handleNavigate('application_builder');
                }}
                onSendToPrintQueue={handleSendToPrintQueue}
                onAddToWorkspace={(file) => handleAddFilesToWorkspace([file])}
              />
            )}

            {/* VIEW: AI STUDIO TOOLS */}
            {appState.activeView === 'ai_studio' && (
              <AiStudioTools
                language={language}
                customer={appState.customer}
                initialSubject={targetSubjectForAiWriter}
                onAddToWorkspace={(file) => handleAddFilesToWorkspace([file])}
                onSendToPrintQueue={handleSendToPrintQueue}
              />
            )}

            {/* VIEW: PRINT CENTER */}
            {appState.activeView === 'print_center' && (
              <PrintCenter
                language={language}
                customer={appState.customer}
                printQueue={appState.printQueue}
                onUpdatePrintQueue={(newQueue) => setAppState((prev) => ({ ...prev, printQueue: newQueue }))}
                onAddToWorkspace={(file) => handleAddFilesToWorkspace([file])}
              />
            )}

            {/* VIEW: UNIVERSAL FILE WORKSPACE */}
            {appState.activeView === 'workspace' && (
              <FileWorkspace
                language={language}
                activeFiles={appState.activeFiles}
                onAddFiles={handleAddFilesToWorkspace}
                onRemoveFile={handleRemoveFile}
                onClearFiles={handleClearWorkspaceFiles}
                onNavigateToPhotoTool={handleNavigateToPhotoToolWithFile}
                onSendToPrintQueue={handleSendToPrintQueue}
              />
            )}

            {/* VIEW: OFFICE REFERENCE TOOLS */}
            {appState.activeView === 'office_tools' && (
              <OfficeTools language={language} initialTab={(activeCategoryFilter === 'utility' || activeCategoryFilter === 'typing') ? activeCategoryFilter as 'utility' | 'typing' : 'typing'} />
            )}

            {/* VIEW: ADSENSE & LEGAL SUPPORT PAGES */}
            {['about', 'contact', 'privacy', 'terms', 'disclaimer'].includes(appState.activeView) && (
              <SupportPages
                view={appState.activeView as any}
                language={language}
                onNavigateHome={() => handleNavigate('home')}
              />
            )}
          </Suspense>

          {/* Footer Ad Slot */}
          {footerAdSlot && <AdSlot slot={footerAdSlot} />}
        </main>
      </div>

      {/* 3. FOOTER */}
      <footer className="mt-auto border-t border-slate-200 bg-white">
        <div className="h-0.5 w-full flex">
          <div className="flex-1 bg-amber-500/80" />
          <div className="flex-1 bg-slate-200" />
          <div className="flex-1 bg-emerald-600/80" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-blue-700 text-white flex items-center justify-center font-black text-xs">
              CM
            </div>
            <span className="font-extrabold text-slate-800 tracking-tight">CYBER MITRA</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600 font-medium">
              {isHindi ? 'डिजिटल सेवा एवं साइबर कैफे संचालक सहायक' : 'Digital Seva & Cyber Cafe Facilitator'}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3.5 text-slate-600 font-semibold">
            <button onClick={() => handleNavigate('about')} className="hover:text-blue-700 transition-colors">
              {isHindi ? 'परिचय' : 'About Us'}
            </button>
            <span className="text-slate-300">•</span>
            <button onClick={() => handleNavigate('contact')} className="hover:text-blue-700 transition-colors">
              {isHindi ? 'संपर्क' : 'Contact Us'}
            </button>
            <span className="text-slate-300">•</span>
            <button onClick={() => handleNavigate('privacy')} className="hover:text-blue-700 transition-colors">
              {isHindi ? 'गोपनीयता नीति' : 'Privacy Policy'}
            </button>
            <span className="text-slate-300">•</span>
            <button onClick={() => handleNavigate('terms')} className="hover:text-blue-700 transition-colors">
              {isHindi ? 'नियम व शर्तें' : 'Terms of Use'}
            </button>
            <span className="text-slate-300">•</span>
            <button onClick={() => handleNavigate('disclaimer')} className="hover:text-blue-700 transition-colors">
              {isHindi ? 'अस्वीकरण' : 'Disclaimer'}
            </button>
          </div>

          <p className="text-[11px] text-slate-400 font-medium">
            © {new Date().getFullYear()} CYBER MITRA • CSC & Digital Seva Utility
          </p>
        </div>
      </footer>

      {/* 4. MODALS & DRAWERS */}
      {/* Smart Universal Search Modal */}
      <SmartSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        language={language}
        services={appState.services}
        templates={appState.applicationTemplates}
        onNavigate={handleNavigate}
        onOpenServiceLink={(url, title) => handleOpenLink(url, title, 'Universal Search')}
      />

      {/* Customer Session Modal */}
      <CustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        language={language}
        customer={appState.customer}
        onSaveCustomer={handleSaveCustomer}
        onClearSession={handleClearSession}
      />

      {/* Admin Panel Modal */}
      {isAdminModalOpen && (
        <AdminPanel
          language={language}
          appState={appState}
          onUpdateState={setAppState}
          onClose={() => setIsAdminModalOpen(false)}
        />
      )}

      {/* Floating AI Chat Assistant Widget (Available Across All Screens) */}
      <FloatingAiChatWidget
        language={language}
        customer={appState.customer}
        onOpenFullChat={() => handleNavigate('ai_chat')}
      />
    </div>
  );
}
