const fs = require('fs');
let code = fs.readFileSync('src/components/layout/Sidebar.tsx', 'utf8');
code = code.replace(/\{\s*id:\s*'downloads_hub'[\s\S]*?\},/g, '');
fs.writeFileSync('src/components/layout/Sidebar.tsx', code);
