const fs = require('fs');

let code = fs.readFileSync('src/components/tools/DownloadsHub.tsx', 'utf8');

code = code.replace(/\{\s*title:\s*'Aadhaar Update Form[\s\S]*?\},/g, '');
code = code.replace(/\{\s*title:\s*'PAN Card Form[\s\S]*?\},/g, '');

fs.writeFileSync('src/components/tools/DownloadsHub.tsx', code);
