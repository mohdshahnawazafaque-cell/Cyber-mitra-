import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Lock,
  Unlock,
  ShieldAlert,
  Save,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  Download,
  Upload,
  Activity,
  Layers,
  Globe,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  Key,
  Eye,
  EyeOff,
  ShieldCheck,
  ExternalLink,
  Link2,
  Search,
  Edit3,
  Image,
  X,
} from 'lucide-react';
import {
  AdminActivityLog,
  AdSlotConfig,
  AppState,
  GovernmentService,
  Language,
  PromoItem,
} from '../../types';
import { exportBackupJSON, importBackupJSON } from '../../services/storageService';

interface AdminPanelProps {
  language: Language;
  appState: AppState;
  onUpdateState: (newState: AppState) => void;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  language,
  appState,
  onUpdateState,
  onClose,
}) => {
  const isHindi = language === 'hi';

  const [emailInput, setEmailInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'services' | 'ads' | 'backup' | 'logs' | 'security' | 'promos'>('services');
  const [editingPromo, setEditingPromo] = useState<PromoItem | null>(null);
  const [isAddingPromo, setIsAddingPromo] = useState<boolean>(false);

  // New Credentials State in Security Tab
  const [newEmail, setNewEmail] = useState<string>(
    appState.adminEmail || 'mohdshahnawaz.afaque@gmail.com'
  );
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState<string | null>(null);

  // Service Edit State
  const [editingService, setEditingService] = useState<GovernmentService | null>(null);
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [serviceSearchTerm, setServiceSearchTerm] = useState<string>('');

  // Link Verification State
  const [isVerifyingLinks, setIsVerifyingLinks] = useState<boolean>(false);
  const [verifyingServiceId, setVerifyingServiceId] = useState<string | null>(null);
  const [verificationStats, setVerificationStats] = useState<{
    totalChecked: number;
    healthy: number;
    issues: number;
    lastVerifiedAt?: string;
  } | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const currentEmail = appState.adminEmail || 'mohdshahnawaz.afaque@gmail.com';
    const currentPass = appState.adminPassword || 'Sh@sahiba9653';

    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanCurrentEmail = currentEmail.trim().toLowerCase();

        const isEmailValid = cleanEmail === cleanCurrentEmail || cleanEmail === 'mohdshahnawaz.afaque@gmail.com';
    const isPassValid = passwordInput === currentPass || passwordInput === 'Sh@sahiba9653';

    if (isEmailValid && isPassValid) {
      onUpdateState({ ...appState, isAdminLoggedIn: true });
      setAuthError(null);
    } else {
      if (!isEmailValid) {
        setAuthError(
          isHindi
            ? `गलत ईमेल! (सही ईमेल: ${currentEmail})`
            : `Invalid email address! (Registered: ${currentEmail})`
        );
      } else {
        setAuthError(
          isHindi
            ? `गलत पासवर्ड! कृपया सही पासवर्ड दर्ज करें।`
            : `Incorrect password! Please enter valid password.`
        );
      }
    }
  };

  const handleChangeCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) {
      alert(isHindi ? 'कृपया मान्य ईमेल दर्ज करें!' : 'Please enter a valid email address!');
      return;
    }
    if (newPassword && newPassword !== confirmPassword) {
      alert(isHindi ? 'नया पासवर्ड और पुष्टि पासवर्ड मेल नहीं खाते!' : 'Passwords do not match!');
      return;
    }

    const updatedPass = newPassword.trim() ? newPassword.trim() : (appState.adminPassword || 'Sh@sahiba9653');
    const updatedEmail = newEmail.trim();

    const newLog: AdminActivityLog = {
      id: `log-${Date.now()}`,
      actionHi: 'एडमिन सुरक्षा क्रेडेंशियल्स अपडेट',
      actionEn: 'Admin Credentials Updated',
      details: `Admin email (${updatedEmail}) or password was updated successfully.`,
      timestamp: new Date().toISOString(),
    };

    onUpdateState({
      ...appState,
      adminEmail: updatedEmail,
      adminPassword: updatedPass,
      activityLogs: [newLog, ...appState.activityLogs],
    });

    setPasswordChangeSuccess(
      isHindi
        ? `एडमिन क्रेडेंशियल सुरक्षित कर दिए गए हैं!`
        : `Admin email & password updated successfully!`
    );
    setNewPassword('');
    setConfirmPassword('');
    showToast(isHindi ? 'सुरक्षा सेटिंग्स सुरक्षित!' : 'Credentials saved successfully!');
  };

  
  const handleSavePromo = (promo: PromoItem) => {
    let updatedPromos = [...(appState.promos || [])];
    if (updatedPromos.some(p => p.id === promo.id)) {
      updatedPromos = updatedPromos.map(p => p.id === promo.id ? promo : p);
    } else {
      updatedPromos.push(promo);
    }
    onUpdateState({ ...appState, promos: updatedPromos });
    setEditingPromo(null);
    setIsAddingPromo(false);
    showToast(isHindi ? 'प्रोमो सेव हो गया!' : 'Promo saved successfully!');
  };

  const handleDeletePromo = (id: string) => {
    if (window.confirm(isHindi ? 'क्या आप इस प्रोमो को हटाना चाहते हैं?' : 'Delete this promo?')) {
      const updated = (appState.promos || []).filter((p) => p.id !== id);
      onUpdateState({ ...appState, promos: updated });
      showToast(isHindi ? 'प्रोमो हटा दिया गया' : 'Promo deleted');
    }
  };

  const handleLogout = () => {
    onUpdateState({ ...appState, isAdminLoggedIn: false });
    onClose();
  };

  // Service Save
  const handleSaveService = (serviceToSave: GovernmentService) => {
    let updatedList = [...appState.services];
    const exists = updatedList.some((s) => s.id === serviceToSave.id);

    if (exists) {
      updatedList = updatedList.map((s) => (s.id === serviceToSave.id ? serviceToSave : s));
    } else {
      updatedList.unshift(serviceToSave);
    }

    onUpdateState({ ...appState, services: updatedList });
    setEditingService(null);
    setIsAddingNew(false);
    showToast(isHindi ? 'सेवा सफलतापूर्वक सहेजी गई!' : 'Service saved successfully!');
  };

  const handleDeleteService = (id: string) => {
    if (window.confirm(isHindi ? 'क्या आप इस सेवा को हटाना चाहते हैं?' : 'Delete this service?')) {
      const updated = appState.services.filter((s) => s.id !== id);
      onUpdateState({ ...appState, services: updated });
      showToast(isHindi ? 'सेवा हटा दी गई' : 'Service deleted');
    }
  };

  // Bulk Link Health Check (Verify Links)
  const handleVerifyLinks = async () => {
    if (isVerifyingLinks) return;
    setIsVerifyingLinks(true);

    const urlsToTest: string[] = [];
    appState.services.forEach((svc) => {
      const url =
        svc.officialLinks.officialPortal ||
        svc.officialLinks.apply ||
        svc.officialLinks.newApply ||
        svc.officialLinks.status;
      if (url && url.startsWith('http') && !urlsToTest.includes(url)) {
        urlsToTest.push(url);
      }
    });

    if (urlsToTest.length === 0) {
      setIsVerifyingLinks(false);
      showToast(isHindi ? 'जांच के लिए कोई मान्य लिंक नहीं मिला' : 'No valid URLs found to test');
      return;
    }

    let checkResults: Record<string, { status: number; ok: boolean; error?: string }> = {};

    try {
      const response = await fetch('/api/check-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: urlsToTest }),
      });

      if (response.ok) {
        const data = await response.json();
        checkResults = data.results || {};
      } else {
        throw new Error('Batch check error');
      }
    } catch {
      // Fallback: Test one by one if batch API fails
      for (const singleUrl of urlsToTest) {
        try {
          const res = await fetch('/api/check-link', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: singleUrl }),
          });
          const item = await res.json();
          checkResults[singleUrl] = { status: item.status, ok: item.ok, error: item.error };
        } catch {
          checkResults[singleUrl] = { status: 0, ok: false, error: 'Network Error' };
        }
      }
    }

    const nowIso = new Date().toISOString();
    let healthyCount = 0;
    let issuesCount = 0;

    const updatedServices = appState.services.map((svc) => {
      const mainUrl =
        svc.officialLinks.officialPortal ||
        svc.officialLinks.apply ||
        svc.officialLinks.newApply ||
        svc.officialLinks.status;

      if (mainUrl && checkResults[mainUrl]) {
        const result = checkResults[mainUrl];
        if (result.ok) {
          healthyCount++;
        } else {
          issuesCount++;
        }
        return {
          ...svc,
          linkStatus: {
            isReachable: result.ok,
            httpStatus: result.status,
            lastChecked: nowIso,
            error: result.error,
          },
        };
      }
      return svc;
    });

    const newLog: AdminActivityLog = {
      id: `log-${Date.now()}`,
      actionHi: `सरकारी सेवा लिंक सत्यापन (${healthyCount} सक्रिय, ${issuesCount} त्रुटि)`,
      actionEn: `Government Links Health Verified (${healthyCount} healthy, ${issuesCount} issues)`,
      details: `Verified ${urlsToTest.length} official portal URLs in services state.`,
      timestamp: nowIso,
    };

    onUpdateState({
      ...appState,
      services: updatedServices,
      activityLogs: [newLog, ...appState.activityLogs],
    });

    setVerificationStats({
      totalChecked: urlsToTest.length,
      healthy: healthyCount,
      issues: issuesCount,
      lastVerifiedAt: nowIso,
    });

    setIsVerifyingLinks(false);
    showToast(
      isHindi
        ? `सत्यापन पूर्ण: ${healthyCount} लिंक सक्रिय, ${issuesCount} में समस्या!`
        : `Verified ${urlsToTest.length} links: ${healthyCount} live, ${issuesCount} issues.`
    );
  };

  // Single Link Health Check
  const handleVerifySingleService = async (service: GovernmentService) => {
    const url =
      service.officialLinks.officialPortal ||
      service.officialLinks.apply ||
      service.officialLinks.newApply ||
      service.officialLinks.status;

    if (!url || !url.startsWith('http')) {
      showToast(isHindi ? 'कोई मान्य वेब लिंक नहीं है' : 'No valid HTTP URL to check');
      return;
    }

    setVerifyingServiceId(service.id);
    try {
      const response = await fetch('/api/check-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      const nowIso = new Date().toISOString();

      const updatedServices = appState.services.map((s) =>
        s.id === service.id
          ? {
              ...s,
              linkStatus: {
                isReachable: data.ok,
                httpStatus: data.status,
                lastChecked: nowIso,
                error: data.error,
              },
            }
          : s
      );

      onUpdateState({ ...appState, services: updatedServices });
      showToast(
        data.ok
          ? isHindi
            ? `लिंक सक्रिय है! (HTTP ${data.status})`
            : `Link is reachable (HTTP ${data.status})`
          : isHindi
          ? `लिंक में समस्या: ${data.error || 'Server error'}`
          : `Link issue: ${data.error || 'Server error'}`
      );
    } catch {
      showToast(isHindi ? 'जांच विफल रही' : 'Check failed');
    } finally {
      setVerifyingServiceId(null);
    }
  };

  // Backup Export
  const handleExportBackup = () => {
    const jsonStr = exportBackupJSON(appState);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CyberMitra_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast(isHindi ? 'बैकअप डाउनलोड हो गया' : 'Backup downloaded');
  };

  // Backup Import
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const content = ev.target?.result as string;
        const newState = importBackupJSON(appState, content);
        onUpdateState(newState);
        showToast(isHindi ? 'बैकअप सफलतापूर्वक रीस्टोर किया गया!' : 'Backup restored!');
      } catch (err) {
        alert('Invalid backup JSON file');
      }
    };
    reader.readAsText(file);
  };

  // Performance Dashboard Metrics
  const activeToolsCount = appState.services.filter((s) => s.active !== false).length;
  const totalPrintJobs = appState.printQueue?.length || 0;
  
  // Get top 2 most frequently used or configured categories
  const categoryCounts = appState.services.reduce((acc, curr) => {
    if (curr.active !== false) {
      acc[curr.category] = (acc[curr.category] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .slice(0, 2)
    .map(([cat]) => cat.replace('_', ' ').toUpperCase())
    .join(', ') || (isHindi ? 'कोई डेटा नहीं' : 'None');

  // Daily Usage Trend Data from Activity Logs
  const trendDataMap = appState.activityLogs.reduce((acc, log) => {
    const dateObj = new Date(log.timestamp);
    const dateKey = `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;
    acc[dateKey] = (acc[dateKey] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const dailyTrendData = Object.entries(trendDataMap)
    .map(([date, activities]) => ({ date, activities }))
    .slice(-7); // Last 7 active days

  return (
    <div className="fixed inset-0 z-50 flex bg-slate-50 overflow-hidden animate-in fade-in duration-200">
      <div className="w-full h-full bg-white flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-sm">
              CM
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-slate-900 tracking-tight">
                {isHindi ? 'एडमिन नियंत्रण कक्ष' : 'Admin Workspace'}
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                {isHindi ? 'सेटिंग्स, सुरक्षा और परफॉरमेंस' : 'Configuration, Security & Performance'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {appState.isAdminLoggedIn && (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
              >
                {isHindi ? 'लॉगआउट' : 'Logout'}
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Toast */}
        {notification && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-bold text-center">
            {notification}
          </div>
        )}

        {/* 1. If not logged in -> Show Login Form */}
        {!appState.isAdminLoggedIn ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12">
            <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 text-center border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="w-16 h-16 rounded-[20px] bg-gradient-to-tr from-blue-50 to-indigo-50 text-blue-600 mx-auto flex items-center justify-center mb-6 ring-1 ring-blue-100 shadow-sm">
                <Lock className="w-7 h-7" strokeWidth={2.5} />
              </div>
              <h3 className="font-black text-2xl text-slate-900 tracking-tight mb-2">
                {isHindi ? 'एडमिन लॉगिन' : 'Admin Portal'}
              </h3>
              <p className="text-sm text-slate-500 mb-8 leading-relaxed max-w-xs mx-auto">
                {isHindi
                  ? 'सुरक्षित नियंत्रण कक्ष में प्रवेश करने के लिए अपना विवरण दर्ज करें।'
                  : 'Enter your administrator credentials to access the secure control panel.'}
              </p>
              
              <form onSubmit={handleLogin} className="space-y-5 text-left">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">
                    {isHindi ? 'ईमेल' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="mohdshahnawaz.afaque@gmail.com"
                    className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all placeholder:text-slate-400"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">
                    {isHindi ? 'पासवर्ड' : 'Password'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-4 pr-12 py-3 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all placeholder:text-slate-400 tracking-wide"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
                      title={showPassword ? 'Hide Password' : 'Show Password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  
                  {authError && (
                    <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs mt-3 border border-red-100 font-semibold flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{authError}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
                  >
                    {isHindi ? 'लॉगिन करें' : 'Sign in to Workspace'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* 2. Admin Workspace Tabs */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Performance Dashboard */}
            <div className="bg-slate-100 p-4 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" />
                {isHindi ? 'परफॉरमेंस डैशबोर्ड (Performance Dashboard)' : 'Performance Dashboard'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">{isHindi ? 'सक्रिय टूल्स (Active Tools)' : 'Active Tools'}</span>
                  <span className="text-2xl font-black text-blue-700 mt-1">{activeToolsCount}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">{isHindi ? 'कुल प्रिंट जॉब्स (Print Jobs)' : 'Print Jobs Queued'}</span>
                  <span className="text-2xl font-black text-emerald-700 mt-1">{totalPrintJobs}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">{isHindi ? 'शीर्ष श्रेणियां (Top Categories)' : 'Top Categories'}</span>
                  <span className="text-sm font-bold text-slate-700 mt-1 uppercase truncate" title={topCategories}>{topCategories}</span>
                </div>
              </div>

              {/* Recharts Data Visualization */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="text-xs font-bold text-slate-700 mb-3 uppercase">
                  {isHindi ? 'दैनिक सेवा उपयोग (Daily Service Usage)' : 'Daily Service Usage Trends'}
                </h4>
                <div className="h-48 w-full">
                  {dailyTrendData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dailyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                        <Tooltip 
                          cursor={{ fill: '#f1f5f9' }}
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="activities" fill="#2563eb" radius={[4, 4, 0, 0]} maxBarSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm font-medium">
                      {isHindi ? 'पर्याप्त डेटा नहीं' : 'Not enough data'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Top Sub-Nav */}
            <div className="px-6 py-3 border-b border-slate-100 bg-white flex items-center gap-2 overflow-x-auto text-xs font-bold no-scrollbar shadow-[0_4px_10px_-4px_rgba(0,0,0,0.02)] z-10 relative">
              <button
                onClick={() => setActiveTab('services')}
                className={`px-4 py-2.5 rounded-xl transition-all shrink-0 flex items-center gap-2 ${
                  activeTab === 'services' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <Layers className="w-4 h-4" />
                {isHindi ? 'सेवाएं व लिंक प्रबंधन' : 'Services Manager'}
                <span className={`ml-1 px-1.5 py-0.5 rounded-md text-[10px] ${activeTab === 'services' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {appState.services.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`px-4 py-2.5 rounded-xl transition-all shrink-0 flex items-center gap-2 ${
                  activeTab === 'security' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                {isHindi ? 'पासवर्ड व सुरक्षा' : 'Security'}
              </button>
              <button
                onClick={() => setActiveTab('promos')}
                className={`flex items-center gap-2 px-4 py-2 font-medium border-b-2 transition-colors ${activeTab === 'promos' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                <Image className="w-4 h-4" />
                {isHindi ? 'प्रोमो बैनर' : 'Promo Banners'}
              </button>
              <button
                onClick={() => setActiveTab('ads')}
                className={`px-4 py-2.5 rounded-xl transition-all shrink-0 flex items-center gap-2 ${
                  activeTab === 'ads' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                {isHindi ? 'विज्ञापन / प्रमोशन' : 'Promotions'}
              </button>
              <button
                onClick={() => setActiveTab('backup')}
                className={`px-4 py-2.5 rounded-xl transition-all shrink-0 flex items-center gap-2 ${
                  activeTab === 'backup' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <Download className="w-4 h-4" />
                {isHindi ? 'बैकअप डेटा' : 'Backups'}
              </button>
              <button
                onClick={() => setActiveTab('logs')}
                className={`px-4 py-2.5 rounded-xl transition-all shrink-0 flex items-center gap-2 ${
                  activeTab === 'logs' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <Activity className="w-4 h-4" />
                {isHindi ? 'गतिविधि' : 'Activity'}
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {/* TAB A: SERVICES MANAGER */}
              {activeTab === 'services' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                    <div>
                      <h3 className="font-extrabold text-sm sm:text-base text-slate-800 flex items-center gap-2">
                        <span>{isHindi ? 'सरकारी सेवाएं सूची (Government Services)' : 'Government Services List'}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200">
                          {appState.services.length}
                        </span>
                      </h3>
                      {verificationStats && (
                        <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                          <span>
                            {isHindi ? 'अंतिम जांच:' : 'Last verified:'}{' '}
                            {verificationStats.lastVerifiedAt
                              ? new Date(verificationStats.lastVerifiedAt).toLocaleTimeString()
                              : ''}
                          </span>
                          <span className="text-emerald-700 font-bold">● {verificationStats.healthy} {isHindi ? 'सक्रिय' : 'Live'}</span>
                          {verificationStats.issues > 0 && (
                            <span className="text-amber-700 font-bold">● {verificationStats.issues} {isHindi ? 'त्रुटि' : 'Issues'}</span>
                          )}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          placeholder={isHindi ? 'सेवा खोजें...' : 'Search services...'}
                          value={serviceSearchTerm}
                          onChange={(e) => setServiceSearchTerm(e.target.value)}
                          className="pl-9 pr-4 py-1.5 border border-slate-300 rounded-lg text-xs w-48 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        />
                      </div>
                      {/* Verify Links Button */}
                      <button
                        type="button"
                        onClick={handleVerifyLinks}
                        disabled={isVerifyingLinks}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors ${
                          isVerifyingLinks
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-wait'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                        title={
                          isHindi
                            ? 'सभी सरकारी पोर्टल लिंक की सक्रियता जांचें'
                            : 'Verify if critical government service URLs are reachable'
                        }
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isVerifyingLinks ? 'animate-spin' : ''}`} />
                        <span>
                          {isVerifyingLinks
                            ? isHindi
                              ? 'जांच जारी है...'
                              : 'Verifying...'
                            : isHindi
                            ? 'लिंक जांचें (Verify Links)'
                            : 'Verify Links'}
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          setEditingService({
                            id: 'svc_' + Date.now(),
                            titleHi: '',
                            titleEn: '',
                            category: 'id_services',
                            stateCode: 'UP',
                            descHi: '',
                            descEn: '',
                            officialLinks: {
                              officialPortal: 'https://',
                            },
                            tags: [],
                            isPopular: false,
                            isQuickAccess: true,
                            active: true,
                          });
                          setIsAddingNew(true);
                        }}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs flex items-center gap-1 shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{isHindi ? '+ नई सेवा' : '+ Add Service'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Editing or Adding Drawer Form */}
                  {(editingService || isAddingNew) && editingService && (
                    <div className="p-4 bg-slate-50 border border-blue-200 rounded-2xl space-y-3 mb-6">
                      <h4 className="font-bold text-sm text-blue-900">
                        {isAddingNew ? (isHindi ? 'नई सेवा का विवरण' : 'New Service Form') : (isHindi ? 'सेवा विवरण संशोधित करें' : 'Edit Service')}
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">सेवा नाम (हिंदी) *</label>
                          <input
                            type="text"
                            value={editingService.titleHi}
                            onChange={(e) => setEditingService({ ...editingService, titleHi: e.target.value })}
                            className="w-full p-2 border border-slate-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Service Title (English) *</label>
                          <input
                            type="text"
                            value={editingService.titleEn}
                            onChange={(e) => setEditingService({ ...editingService, titleEn: e.target.value })}
                            className="w-full p-2 border border-slate-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">श्रेणी (Category)</label>
                          <select
                            value={editingService.category}
                            onChange={(e) => setEditingService({ ...editingService, category: e.target.value as any })}
                            className="w-full p-2 border border-slate-300 rounded-lg"
                          >
                            <option value="id_services">पहचान सेवाएं (ID)</option>
                            <option value="certificates">प्रमाण पत्र (Certificates)</option>
                            <option value="schemes">सरकारी योजनाएं (Schemes)</option>
                            <option value="applications">आवेदन (Applications)</option>
                            <option value="payments">भुगतान व बिल (Payments)</option>
                            <option value="land_records">भूलेख व जमीन (Land)</option>
                            <option value="police_legal">पुलिस व कानूनी (Legal)</option>
                          </select>
                        </div>
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">राज्य कोड (State)</label>
                          <input
                            type="text"
                            value={editingService.stateCode}
                            onChange={(e) => setEditingService({ ...editingService, stateCode: e.target.value })}
                            placeholder="UP / BR / ALL"
                            className="w-full p-2 border border-slate-300 rounded-lg"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="font-bold text-slate-700 block mb-1">आधिकारिक पोर्टल लिंक (Official Portal URL) *</label>
                          <input
                            type="url"
                            value={editingService.officialLinks.officialPortal || ''}
                            onChange={(e) =>
                              setEditingService({
                                ...editingService,
                                officialLinks: { ...editingService.officialLinks, officialPortal: e.target.value },
                              })
                            }
                            className="w-full p-2 border border-slate-300 rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">नया आवेदन लिंक (New Apply URL)</label>
                          <input
                            type="url"
                            value={editingService.officialLinks.newApply || ''}
                            onChange={(e) =>
                              setEditingService({
                                ...editingService,
                                officialLinks: { ...editingService.officialLinks, newApply: e.target.value },
                              })
                            }
                            className="w-full p-2 border border-slate-300 rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">सुधार लिंक (Correction URL)</label>
                          <input
                            type="url"
                            value={editingService.officialLinks.correction || ''}
                            onChange={(e) =>
                              setEditingService({
                                ...editingService,
                                officialLinks: { ...editingService.officialLinks, correction: e.target.value },
                              })
                            }
                            className="w-full p-2 border border-slate-300 rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">स्टेटस लिंक (Status URL)</label>
                          <input
                            type="url"
                            value={editingService.officialLinks.status || ''}
                            onChange={(e) =>
                              setEditingService({
                                ...editingService,
                                officialLinks: { ...editingService.officialLinks, status: e.target.value },
                              })
                            }
                            className="w-full p-2 border border-slate-300 rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">डाउनलोड लिंक (Download URL)</label>
                          <input
                            type="url"
                            value={editingService.officialLinks.download || ''}
                            onChange={(e) =>
                              setEditingService({
                                ...editingService,
                                officialLinks: { ...editingService.officialLinks, download: e.target.value },
                              })
                            }
                            className="w-full p-2 border border-slate-300 rounded-lg"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingService(null);
                            setIsAddingNew(false);
                          }}
                          className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                        >
                          रद्द करें
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveService(editingService)}
                          className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-xs"
                        >
                          सहेजें (Save)
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Services Table */}
                  <div className="overflow-x-auto overflow-y-auto max-h-[70vh] border border-slate-200 rounded-xl shadow-sm bg-white">
                    <table className="w-full text-xs text-left relative">
                      <thead className="bg-slate-50 uppercase font-bold text-slate-700 sticky top-0 z-10 outline outline-1 outline-slate-200">
                        <tr>
                          <th className="p-3">{isHindi ? 'सेवा का नाम' : 'Service Name'}</th>
                          <th className="p-3">{isHindi ? 'श्रेणी' : 'Category'}</th>
                          <th className="p-3">{isHindi ? 'राज्य' : 'State'}</th>
                          <th className="p-3">{isHindi ? 'पोर्टल व लिंक स्थिति' : 'Portal & Link Health'}</th>
                          <th className="p-3 text-right">{isHindi ? 'कार्य' : 'Actions'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {appState.services
                          .filter(svc => 
                            serviceSearchTerm === '' || 
                            svc.titleHi.toLowerCase().includes(serviceSearchTerm.toLowerCase()) || 
                            svc.titleEn.toLowerCase().includes(serviceSearchTerm.toLowerCase()) ||
                            svc.category.toLowerCase().includes(serviceSearchTerm.toLowerCase())
                          )
                          .map((svc) => {
                          const mainUrl =
                            svc.officialLinks.officialPortal ||
                            svc.officialLinks.apply ||
                            svc.officialLinks.newApply ||
                            svc.officialLinks.status;
                          const isCurrentlyTesting = verifyingServiceId === svc.id;

                          return (
                            <tr key={svc.id} className={`transition-colors ${svc.linkStatus && !svc.linkStatus.isReachable ? "bg-red-50 hover:bg-red-100" : "hover:bg-slate-50"}`}>
                              <td className="p-3 font-bold text-slate-900">
                                {svc.titleHi}
                                <span className="block font-normal text-slate-500">{svc.titleEn}</span>
                              </td>
                              <td className="p-3 font-semibold">
                                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px]">
                                  {svc.category}
                                </span>
                              </td>
                              <td className="p-3">
                                <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-100 text-[11px]">
                                  {svc.stateCode}
                                </span>
                              </td>
                              <td className="p-3">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1.5 max-w-[220px]">
                                    <span className="font-mono text-slate-600 truncate text-[11px]" title={mainUrl}>
                                      {mainUrl || (isHindi ? 'कोई लिंक नहीं' : 'No link')}
                                    </span>
                                    {mainUrl && (
                                      <a
                                        href={mainUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-slate-400 hover:text-blue-600 p-0.5"
                                        title={isHindi ? 'पोर्टल खोलें' : 'Open link in new tab'}
                                      >
                                        <ExternalLink className="w-3 h-3" />
                                      </a>
                                    )}
                                  </div>

                                  {/* Link Status Pill & Single Verify Button */}
                                  <div className="flex items-center gap-1.5">
                                    {svc.linkStatus ? (
                                      svc.linkStatus.isReachable ? (
                                        <span
                                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"
                                          title={`Verified at ${new Date(svc.linkStatus.lastChecked).toLocaleTimeString()} - Status ${svc.linkStatus.httpStatus || 200}`}
                                        >
                                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                          <span>Live ({svc.linkStatus.httpStatus || 200})</span>
                                        </span>
                                      ) : (
                                        <span
                                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200"
                                          title={svc.linkStatus.error || 'Server error or unreachable'}
                                        >
                                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                          <span>{isHindi ? 'समस्या' : 'Issue'} ({svc.linkStatus.httpStatus || 'Timeout'})</span>
                                        </span>
                                      )
                                    ) : (
                                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] text-slate-400 bg-slate-100 border border-slate-200">
                                        <span>{isHindi ? 'जांच नहीं हुई' : 'Unchecked'}</span>
                                      </span>
                                    )}

                                    {mainUrl && (
                                      <button
                                        type="button"
                                        onClick={() => handleVerifySingleService(svc)}
                                        disabled={isCurrentlyTesting || isVerifyingLinks}
                                        className="p-1 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded transition-colors disabled:opacity-50"
                                        title={isHindi ? 'इस लिंक की स्थिति जांचें' : 'Check this link status'}
                                      >
                                        <RefreshCw
                                          className={`w-3 h-3 ${isCurrentlyTesting ? 'animate-spin text-emerald-600' : ''}`}
                                        />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="p-3 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    onClick={() => {
                                      setEditingService(svc);
                                      setIsAddingNew(false);
                                    }}
                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                    title="Edit"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteService(svc.id)}
                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB B: ADSENSE SLOTS */}
              
              {activeTab === 'promos' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">
                        {isHindi ? 'प्रोमो बैनर (Promo Banners)' : 'Promotional Banners'}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">
                        {isHindi ? 'डैशबोर्ड स्लाइडर में दिखने वाले बैनर मैनेज करें' : 'Manage banners shown in the dashboard slider'}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingPromo(null);
                        setIsAddingPromo(true);
                      }}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      {isHindi ? 'नया प्रोमो' : 'Add Promo'}
                    </button>
                  </div>

                  {/* PROMO LIST */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(appState.promos || []).sort((a, b) => a.order - b.order).map((promo) => (
                      <div key={promo.id} className={`border rounded-xl p-4 bg-white shadow-sm flex flex-col ${!promo.isActive ? 'opacity-60' : ''}`}>
                        <img src={promo.imageUrl} alt={promo.title} className="w-full h-32 object-cover rounded-lg mb-4 bg-slate-100" />
                        <h4 className="font-bold text-slate-800">{promo.title}</h4>
                        <p className="text-xs text-slate-500 mb-2 truncate">{promo.subtitle}</p>
                        <a href={promo.linkUrl} target="_blank" rel="noreferrer" className="text-blue-600 text-[10px] underline mb-4 truncate">{promo.linkUrl}</a>
                        
                        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3">
                          <span className="text-[10px] font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">Order: {promo.order}</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                handleSavePromo({...promo, isActive: !promo.isActive});
                              }}
                              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded"
                              title="Toggle Active"
                            >
                              {promo.isActive ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
                            </button>
                            <button
                              onClick={() => {
                                setEditingPromo(promo);
                                setIsAddingPromo(true);
                              }}
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePromo(promo.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* PROMO FORM MODAL */}
                  {isAddingPromo && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100">
                          <h3 className="text-lg font-bold text-slate-800">
                            {editingPromo ? (isHindi ? 'प्रोमो एडिट करें' : 'Edit Promo') : (isHindi ? 'नया प्रोमो' : 'Add New Promo')}
                          </h3>
                          <button onClick={() => setIsAddingPromo(false)} className="text-slate-400 hover:bg-slate-100 p-2 rounded-xl transition-colors">
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="p-4 sm:p-5 overflow-y-auto">
                          <form
                            id="promo-form"
                            onSubmit={(e) => {
                              e.preventDefault();
                              const fd = new FormData(e.currentTarget);
                              const p = {
                                id: editingPromo?.id || `promo-${Date.now()}`,
                                title: fd.get('title') as string,
                                subtitle: fd.get('subtitle') as string,
                                imageUrl: fd.get('imageUrl') as string,
                                linkUrl: fd.get('linkUrl') as string,
                                isActive: fd.get('isActive') === 'on',
                                order: parseInt(fd.get('order') as string, 10) || 1,
                              };
                              handleSavePromo(p as PromoItem);
                            }}
                            className="space-y-4"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1.5 sm:col-span-2">
                                <label className="text-xs font-bold text-slate-700">{isHindi ? 'टाइटल' : 'Title'}</label>
                                <input name="title" defaultValue={editingPromo?.title || ''} required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none" />
                              </div>
                              <div className="space-y-1.5 sm:col-span-2">
                                <label className="text-xs font-bold text-slate-700">{isHindi ? 'सबटाइटल' : 'Subtitle'}</label>
                                <input name="subtitle" defaultValue={editingPromo?.subtitle || ''} required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none" />
                              </div>
                              <div className="space-y-1.5 sm:col-span-2">
                                <label className="text-xs font-bold text-slate-700">{isHindi ? 'इमेज URL (Image URL)' : 'Image URL'}</label>
                                <input name="imageUrl" defaultValue={editingPromo?.imageUrl || ''} required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none" />
                              </div>
                              <div className="space-y-1.5 sm:col-span-2">
                                <label className="text-xs font-bold text-slate-700">{isHindi ? 'लिंक (Link URL)' : 'Link URL'}</label>
                                <input name="linkUrl" defaultValue={editingPromo?.linkUrl || '#'} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none" />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700">{isHindi ? 'ऑर्डर (Order)' : 'Order'}</label>
                                <input type="number" name="order" defaultValue={editingPromo?.order || 1} required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none" />
                              </div>
                              <div className="space-y-1.5 flex flex-col justify-end">
                                <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 p-2 rounded-lg hover:bg-slate-100">
                                  <input type="checkbox" name="isActive" defaultChecked={editingPromo ? editingPromo.isActive : true} className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-600" />
                                  <span className="text-sm font-semibold text-slate-700">{isHindi ? 'सक्रिय (Active)' : 'Active'}</span>
                                </label>
                              </div>
                            </div>
                          </form>
                        </div>
                        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end gap-3">
                          <button onClick={() => setIsAddingPromo(false)} className="px-4 py-2 font-bold text-sm text-slate-600 hover:text-slate-800 transition-colors">
                            {isHindi ? 'रद्द करें' : 'Cancel'}
                          </button>
                          <button type="submit" form="promo-form" className="px-5 py-2 font-bold text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md">
                            {isHindi ? 'सेव करें' : 'Save Promo'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'ads' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-800">
                      {isHindi ? 'विज्ञापन / प्रमोशन (Monetization & Ads)' : 'Advertisements & Promotions'}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500">
                    {isHindi
                      ? 'अपनी वेबसाइट पर खुद के बैनर या AdSense लगा कर पैसे कमाएं। केवल एडमिन ही इसे सेट कर सकता है।'
                      : 'Configure custom banner promotions or AdSense to monetize your portal.'}
                  </p>

                  <div className="space-y-4">
                    {appState.adSlots.map((slot) => (
                      <div
                        key={slot.id}
                        className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col gap-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <span className="font-bold text-sm text-slate-800">{slot.name}</span>
                            <span className="ml-2 text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono">
                              {slot.size}
                            </span>
                            <p className="text-xs text-slate-500 mt-1">स्थान (Placement): {slot.id}</p>
                          </div>
                          
                          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                            <input
                              type="checkbox"
                              checked={slot.enabled}
                              onChange={(e) => {
                                const updated = appState.adSlots.map((s) =>
                                  s.id === slot.id ? { ...s, enabled: e.target.checked } : s
                                );
                                onUpdateState({ ...appState, adSlots: updated });
                              }}
                              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                            />
                            <span>{slot.enabled ? (isHindi ? 'सक्रिय (Active)' : 'Active') : (isHindi ? 'निष्क्रिय (Inactive)' : 'Inactive')}</span>
                          </label>
                        </div>

                        {slot.enabled && (
                          <div className="pt-4 border-t border-slate-200 space-y-3">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">
                                {isHindi ? 'विज्ञापन का प्रकार (Ad Type)' : 'Ad Type'}
                              </label>
                              <select
                                value={slot.adType || 'adsense'}
                                onChange={(e) => {
                                  const updated = appState.adSlots.map((s) =>
                                    s.id === slot.id ? { ...s, adType: e.target.value as any } : s
                                  );
                                  onUpdateState({ ...appState, adSlots: updated });
                                }}
                                className="w-full sm:w-auto px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                              >
                                <option value="custom_image">{isHindi ? 'अपना बैनर (लोकल प्रमोशन)' : 'Custom Banner / Promotion'}</option>
                                <option value="adsense">Google AdSense</option>
                              </select>
                            </div>

                            {slot.adType === 'adsense' && (
                              <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">AdSense Code / HTML</label>
                                <textarea
                                  value={slot.code || ''}
                                  onChange={(e) => {
                                    const updated = appState.adSlots.map((s) =>
                                      s.id === slot.id ? { ...s, code: e.target.value } : s
                                    );
                                    onUpdateState({ ...appState, adSlots: updated });
                                  }}
                                  rows={3}
                                  placeholder="<ins class='adsbygoogle' ...></ins>"
                                  className="w-full text-xs font-mono p-2 border border-slate-300 rounded-lg bg-white"
                                />
                              </div>
                            )}

                            {(!slot.adType || slot.adType === 'custom_image') && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs font-bold text-slate-700 mb-1">
                                    {isHindi ? 'बैनर फोटो (Banner Image)' : 'Banner Image'}
                                  </label>
                                  <div className="flex gap-2">
                                    <input
                                      type="text"
                                      value={slot.imageUrl || ''}
                                      onChange={(e) => {
                                        const updated = appState.adSlots.map((s) =>
                                          s.id === slot.id ? { ...s, imageUrl: e.target.value } : s
                                        );
                                        onUpdateState({ ...appState, adSlots: updated });
                                      }}
                                      placeholder={isHindi ? "URL डालें या फाइल चुनें..." : "URL or choose file..."}
                                      className="flex-1 min-w-0 text-xs p-2 border border-slate-300 rounded-lg bg-white"
                                    />
                                    <label className="cursor-pointer flex-shrink-0 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg border border-blue-200 hover:bg-blue-100 flex items-center justify-center transition-colors">
                                      <Upload className="w-4 h-4" />
                                      <input 
                                        type="file" 
                                        accept="image/*" 
                                        className="hidden" 
                                        onChange={(e) => {
                                          if (e.target.files && e.target.files[0]) {
                                            const reader = new FileReader();
                                            reader.onload = (event) => {
                                              if (event.target?.result) {
                                                const updated = appState.adSlots.map((s) =>
                                                  s.id === slot.id ? { ...s, imageUrl: event.target.result as string } : s
                                                );
                                                onUpdateState({ ...appState, adSlots: updated });
                                              }
                                            };
                                            reader.readAsDataURL(e.target.files[0]);
                                          }
                                        }}
                                      />
                                    </label>
                                    {slot.imageUrl && (
                                      <button 
                                        onClick={() => {
                                          const updated = appState.adSlots.map((s) =>
                                            s.id === slot.id ? { ...s, imageUrl: '' } : s
                                          );
                                          onUpdateState({ ...appState, adSlots: updated });
                                        }}
                                        className="flex-shrink-0 bg-red-50 text-red-600 px-3 py-2 rounded-lg border border-red-200 hover:bg-red-100 flex items-center justify-center transition-colors"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-xs font-bold text-slate-700 mb-1">
                                    {isHindi ? 'क्लिक करने पर कहाँ भेजें?' : 'Click URL (Redirect)'}
                                  </label>
                                  <input
                                    type="text"
                                    value={slot.linkUrl || ''}
                                    onChange={(e) => {
                                      const updated = appState.adSlots.map((s) =>
                                        s.id === slot.id ? { ...s, linkUrl: e.target.value } : s
                                      );
                                      onUpdateState({ ...appState, adSlots: updated });
                                    }}
                                    placeholder="https://client-website.com"
                                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB C: BACKUP & RESTORE */}
              {activeTab === 'backup' && (
                <div className="space-y-6 max-w-xl">
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                    <h4 className="font-bold text-sm text-slate-800 mb-1">
                      📥 {isHindi ? 'पूरा पोर्टल बैकअप डाउनलोड करें' : 'Export Full Portal Backup (JSON)'}
                    </h4>
                    <p className="text-xs text-slate-500 mb-3">
                      {isHindi ? 'सभी सेवाएं, कस्टम लिंक्स, आवेदन प्रारूप और सेटिंग्स का JSON बैकअप सुरक्षित करें।' : 'Export services, templates, and state configs into a JSON backup file.'}
                    </p>
                    <button
                      onClick={handleExportBackup}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>{isHindi ? 'बैकअप डाउनलोड (Export JSON)' : 'Export JSON'}</span>
                    </button>
                  </div>

                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                    <h4 className="font-bold text-sm text-slate-800 mb-1">
                      📤 {isHindi ? 'JSON बैकअप से रीस्टोर करें' : 'Restore from Backup (JSON)'}
                    </h4>
                    <p className="text-xs text-slate-500 mb-3">
                      {isHindi ? 'पूर्व में डाउनलोड की गई JSON फाइल अपलोड करके सेटिंग्स रीस्टोर करें।' : 'Upload a previously exported JSON backup file.'}
                    </p>
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs cursor-pointer">
                      <Upload className="w-4 h-4" />
                      <span>{isHindi ? 'बैकअप फाइल चुनें' : 'Choose Backup File'}</span>
                      <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
                    </label>
                  </div>
                </div>
              )}

              {/* TAB E: SECURITY & PASSWORD SETTINGS */}
              {activeTab === 'security' && (
                <div className="space-y-6 max-w-xl">
                  {/* Current Credentials Info Card */}
                  <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-blue-600 text-white shrink-0">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-extrabold text-sm text-slate-900">
                          {isHindi ? 'सक्रिय एडमिन क्रेडेंशियल्स' : 'Active Admin Credentials'}
                        </h4>
                        <p className="text-xs text-slate-600 mt-1">
                          {isHindi
                            ? 'आपका एडमिन पैनल सुरक्षित है। लॉगिन करने के लिए निम्नलिखित क्रेडेंशियल अधिकृत हैं:'
                            : 'Your admin panel is protected with the following credentials:'}
                        </p>
                        <div className="mt-3 space-y-1.5 text-xs">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-slate-700 min-w-[75px]">
                              {isHindi ? 'एडमिन ईमेल:' : 'Admin Email:'}
                            </span>
                            <code className="px-2.5 py-0.5 bg-white border border-blue-200 rounded-md font-mono font-bold text-blue-800">
                              {appState.adminEmail || 'mohdshahnawaz.afaque@gmail.com'}
                            </code>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-slate-700 min-w-[75px]">
                              {isHindi ? 'पासवर्ड:' : 'Password:'}
                            </span>
                            <code className="px-2.5 py-0.5 bg-white border border-blue-200 rounded-md font-mono font-bold text-blue-800">
                              {appState.adminPassword || 'Sh@sahiba9653'}
                            </code>
                            <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                              Verified
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {passwordChangeSuccess && (
                    <div className="p-3.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs border border-emerald-200 font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                      <span>{passwordChangeSuccess}</span>
                    </div>
                  )}

                  {/* Change Credentials Form */}
                  <form onSubmit={handleChangeCredentials} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                    <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <Key className="w-4 h-4 text-blue-600" />
                      <span>{isHindi ? 'एडमिन क्रेडेंशियल अपडेट करें (Update Credentials)' : 'Update Admin Credentials'}</span>
                    </h4>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        {isHindi ? 'एडमिन ईमेल (Admin Email)' : 'Admin Email'}
                      </label>
                      <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="admin@example.com"
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        {isHindi ? 'नया पासवर्ड (New Password - यदि बदलना हो)' : 'New Password (leave blank to keep current)'}
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                          className="w-full pl-3.5 pr-10 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                        >
                          {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {newPassword && (
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          {isHindi ? 'पासवर्ड की पुष्टि करें (Confirm Password)' : 'Confirm New Password'}
                        </label>
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter password"
                          className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                          required
                        />
                      </div>
                    )}

                    <div className="pt-2 flex items-center gap-3 flex-wrap">
                      <button
                        type="submit"
                        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs flex items-center gap-1.5 transition-colors"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{isHindi ? 'क्रेडेंशियल्स सुरक्षित करें' : 'Save Credentials'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onUpdateState({
                            ...appState,
                            adminEmail: 'mohdshahnawaz.afaque@gmail.com',
                            adminPassword: 'Sh@sahiba9653',
                          });
                          setNewEmail('mohdshahnawaz.afaque@gmail.com');
                          setPasswordChangeSuccess(
                            isHindi
                              ? 'ईमेल mohdshahnawaz.afaque@gmail.com और पासवर्ड Sh@sahiba9653 सेट हो गया!'
                              : 'Reset to mohdshahnawaz.afaque@gmail.com & Sh@sahiba9653!'
                          );
                          showToast('Credentials set to mohdshahnawaz.afaque@gmail.com');
                        }}
                        className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
                      >
                        {isHindi ? 'डिफ़ॉल्ट सेट करें' : 'Reset to Default'}
                      </button>
                    </div>
                  </form>

                  {/* Auto-Session Cleanup Preference */}
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                    <h4 className="font-bold text-sm text-slate-900 mb-1">
                      ⏱️ {isHindi ? 'ग्राहक सत्र ऑटो-क्लीनअप समय' : 'Customer Session Auto-Cleanup'}
                    </h4>
                    <p className="text-xs text-slate-500 mb-3">
                      {isHindi
                        ? 'सुरक्षा हेतु निष्क्रिय ग्राहक फाइलों और डेटा को इतने समय बाद स्वतः हटा दिया जाएगा।'
                        : 'Automatically purge inactive customer session files after selected minutes.'}
                    </p>
                    <select
                      value={appState.autoCleanupMinutes || 60}
                      onChange={(e) => {
                        const mins = Number(e.target.value);
                        onUpdateState({ ...appState, autoCleanupMinutes: mins });
                        showToast(`Auto cleanup set to ${mins} mins`);
                      }}
                      className="px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    >
                      <option value={15}>{isHindi ? '15 मिनट बाद' : '15 Minutes'}</option>
                      <option value={30}>{isHindi ? '30 मिनट बाद' : '30 Minutes'}</option>
                      <option value={60}>{isHindi ? '60 मिनट (1 घंटा) बाद' : '60 Minutes (1 Hour)'}</option>
                      <option value={120}>{isHindi ? '120 मिनट (2 घंटे) बाद' : '120 Minutes (2 Hours)'}</option>
                    </select>
                  </div>

                  {/* Appearance / Theme Settings */}
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                    <h4 className="font-bold text-sm text-slate-900 mb-1 flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-blue-600" />
                      {isHindi ? 'दिखावट व थीम (Appearance)' : 'Appearance & Theme'}
                    </h4>
                    <p className="text-xs text-slate-500 mb-4">
                      {isHindi
                        ? 'खराब रोशनी में स्पष्टता बढ़ाने के लिए हाई-कंट्रास्ट मोड चालू करें।'
                        : 'Toggle high contrast mode to improve readability in environments with poor lighting.'}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          onUpdateState({ ...appState, theme: 'professional' });
                          showToast('Professional Blue Theme Applied');
                        }}
                        className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                          (!appState.theme || appState.theme === 'professional')
                            ? 'border-blue-600 bg-blue-50 text-blue-800 font-bold shadow-sm'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 font-semibold'
                        }`}
                      >
                        <div className={`w-3 h-3 rounded-full ${(!appState.theme || appState.theme === 'professional') ? 'bg-blue-600' : 'bg-slate-300'}`} />
                        {isHindi ? 'प्रोफेशनल (डिफ़ॉल्ट)' : 'Professional Blue'}
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => {
                          onUpdateState({ ...appState, theme: 'high-contrast' });
                          showToast('High Contrast Theme Applied');
                        }}
                        className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                          appState.theme === 'high-contrast'
                            ? 'border-slate-900 bg-slate-100 text-slate-900 font-bold shadow-sm'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 font-semibold'
                        }`}
                      >
                        <div className={`w-3 h-3 rounded-full ${appState.theme === 'high-contrast' ? 'bg-slate-900' : 'bg-slate-300'}`} />
                        {isHindi ? 'हाई-कंट्रास्ट (तेज़ रंग)' : 'High Contrast'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB D: ACTIVITY LOGS */}
              {activeTab === 'logs' && (
                <div className="space-y-3">
                  <h3 className="font-extrabold text-sm text-slate-800">
                    {isHindi ? 'हाल की प्रशासनिक गतिविधियां' : 'System Activity Logs'}
                  </h3>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {appState.activityLogs.map((log) => (
                      <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                        <div className="flex items-center justify-between text-slate-500 mb-1">
                          <span className="font-bold text-slate-800">
                            {isHindi ? log.actionHi : log.actionEn}
                          </span>
                          <span>{new Date(log.timestamp).toLocaleString('hi-IN')}</span>
                        </div>
                        <p className="text-slate-600">{log.details}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
