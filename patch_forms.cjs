const fs = require('fs');

let code = fs.readFileSync('src/components/services/ServicesDashboard.tsx', 'utf8');

// Remove PAN form
code = code.replace(/\{\s*id:\s*'form-pan-49a'[\s\S]*?\},/g, '');
// Remove Aadhaar form
code = code.replace(/\{\s*id:\s*'form-aadhaar-update'[\s\S]*?\},/g, '');

fs.writeFileSync('src/components/services/ServicesDashboard.tsx', code);
