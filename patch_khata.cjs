const fs = require('fs');

let sidebarCode = fs.readFileSync('src/components/layout/Sidebar.tsx', 'utf8');
sidebarCode = sidebarCode.replace(/\{\s*id:\s*'daily_khata'[\s\S]*?\},/g, '');
fs.writeFileSync('src/components/layout/Sidebar.tsx', sidebarCode);

let servicesDashboard = fs.readFileSync('src/components/services/ServicesDashboard.tsx', 'utf8');
servicesDashboard = servicesDashboard.replace(/\{\s*id:\s*'quick-action-khata'[\s\S]*?\},/g, '');
fs.writeFileSync('src/components/services/ServicesDashboard.tsx', servicesDashboard);
