const fs = require('fs');
let code = fs.readFileSync('src/components/services/ServicesDashboard.tsx', 'utf8');

code = code.replace(/\{\s*id:\s*'id_services'[\s\S]*?\},/g, '');

fs.writeFileSync('src/components/services/ServicesDashboard.tsx', code);
