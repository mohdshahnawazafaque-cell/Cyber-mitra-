const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('VanshavaliCertificate')) {
  code = code.replace(
    "const AwasCertificate = lazy(() => import('./components/tools/AwasCertificate').then(module => ({ default: module.AwasCertificate })));",
    "const AwasCertificate = lazy(() => import('./components/tools/AwasCertificate').then(module => ({ default: module.AwasCertificate })));\nconst VanshavaliCertificate = lazy(() => import('./components/tools/VanshavaliCertificate').then(module => ({ default: module.VanshavaliCertificate })));"
  );

  code = code.replace(
    "            {appState.activeView === 'awas_certificate' && (\n              <AwasCertificate language={language} />\n            )}",
    "            {appState.activeView === 'awas_certificate' && (\n              <AwasCertificate language={language} />\n            )}\n\n            {appState.activeView === 'vanshavali_certificate' && (\n              <VanshavaliCertificate language={language} />\n            )}"
  );
  
  fs.writeFileSync('src/App.tsx', code);
  console.log("Patched App.tsx");
}
