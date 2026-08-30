import fs from 'fs';

// 1. App.tsx
let appCode = fs.readFileSync('src/App.tsx', 'utf8');
const lazyImport = "const QuickLinksDashboard = lazy(() => import('./components/tools/QuickLinksDashboard').then(module => ({ default: module.QuickLinksDashboard })));";
appCode = appCode.replace("const BulkSmsTool = lazy(() => import('./components/tools/BulkSmsTool').then(module => ({ default: module.BulkSmsTool })));", lazyImport + "\nconst BulkSmsTool = lazy(() => import('./components/tools/BulkSmsTool').then(module => ({ default: module.BulkSmsTool })));");

const viewBlock = `
            {/* VIEW: QUICK LINKS */}
            {appState.activeView === 'quick_links' && (
              <QuickLinksDashboard language={language} />
            )}
`;
appCode = appCode.replace("{/* VIEW: DOWNLOADS HUB */}", viewBlock + "\n            {/* VIEW: DOWNLOADS HUB */}");
fs.writeFileSync('src/App.tsx', appCode);

// 2. Sidebar.tsx
let sidebarCode = fs.readFileSync('src/components/layout/Sidebar.tsx', 'utf8');
sidebarCode = sidebarCode.replace(
  "import { MessageSquareText } from 'lucide-react';",
  "import { MessageSquareText, Globe } from 'lucide-react';"
);

const sidebarItem = `
    {
      id: 'quick_links',
      view: 'quick_links',
      icon: Globe,
      titleHi: 'CSC लिंक्स (Quick Links)',
      titleEn: 'Quick Links',
      descHi: 'ज़रूरी वेबसाइट्स सेव करें',
      descEn: 'Save important websites',
      color: 'text-blue-500'
    },
`;
sidebarCode = sidebarCode.replace("{ id: 'downloads_hub',", sidebarItem + "\n    { id: 'downloads_hub',");
fs.writeFileSync('src/components/layout/Sidebar.tsx', sidebarCode);

// 3. ToolsHub.tsx
let toolsHubCode = fs.readFileSync('src/components/tools/ToolsHub.tsx', 'utf8');
const toolEntry = `    { id: 'quick-links', category: 'utility', nameHi: 'CSC शॉर्टकट लिंक्स', nameEn: 'Quick Links Dashboard', descHi: 'अपनी रोज़मर्रा की वेबसाइट्स सेव करें और एक क्लिक में खोलें।', descEn: 'Save and open daily websites in 1-click.', target: 'quick_links', subCategory: 'utility' },`;
toolsHubCode = toolsHubCode.replace("    { id: 'downloads-hub',", toolEntry + "\n    { id: 'downloads-hub',");
fs.writeFileSync('src/components/tools/ToolsHub.tsx', toolsHubCode);
