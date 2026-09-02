const fs = require('fs');
let code = fs.readFileSync('src/data/initialData.ts', 'utf8');

code = code.replace(/\/\/ 1\. UIDAI Aadhaar[\s\S]*?\/\/ 3\. Voter ID \/ ECI NVSP/, '// 1. Voter ID / ECI NVSP');

fs.writeFileSync('src/data/initialData.ts', code);
