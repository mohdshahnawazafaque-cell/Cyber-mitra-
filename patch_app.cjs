const fs = require('fs');

// Patch App.tsx
let appCode = fs.readFileSync('src/App.tsx', 'utf8');

// Add Lazy import for AwasCertificate
if (!appCode.includes('AwasCertificate')) {
  appCode = appCode.replace(
    "const PromoDesigner = lazy(() => import('./components/tools/PromoDesigner')",
    "const PromoDesigner = lazy(() => import('./components/tools/PromoDesigner').then(module => ({ default: module.PromoDesigner })));\nconst AwasCertificate = lazy(() => import('./components/tools/AwasCertificate').then(module => ({ default: module.AwasCertificate })));\n// "
  );
}

// Add view case
const awasCase = `            {appState.activeView === 'awas_certificate' && (
              <AwasCertificate language={language} />
            )}

            {/* VIEW: PROMO DESIGNER */}`;

appCode = appCode.replace("{/* VIEW: PROMO DESIGNER */}", awasCase);

fs.writeFileSync('src/App.tsx', appCode);

// Patch Sidebar.tsx
let sidebarCode = fs.readFileSync('src/components/layout/Sidebar.tsx', 'utf8');

if (!sidebarCode.includes("awas_certificate")) {
  // we will add it after daily khata
  const sidebarReplace = `{
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
      id: 'awas_certificate',
      view: 'awas_certificate',
      icon: FileText,
      titleHi: 'आवास प्रमाण-पत्र',
      titleEn: 'Awas Certificate',
      descHi: 'PMAY-U 2.0 जनरेटर',
      descEn: 'PMAY-U 2.0 Generator',
      color: 'text-purple-500'
    },`;
    
  sidebarCode = sidebarCode.replace(`{
      id: 'daily_khata',
      view: 'daily_khata',
      icon: IndianRupee,
      titleHi: 'डेली खाता बुक',
      titleEn: 'Daily Khata Book',
      descHi: 'कमाई व उधार का हिसाब',
      descEn: 'Earnings & Pending Dues',
      color: 'text-emerald-500'
    },`, sidebarReplace);

  fs.writeFileSync('src/components/layout/Sidebar.tsx', sidebarCode);
}

