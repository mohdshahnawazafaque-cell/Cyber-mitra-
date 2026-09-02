const fs = require('fs');
let code = fs.readFileSync('src/components/tools/ToolsHub.tsx', 'utf8');

code = code.replace(/\{\s*id:\s*'gov_id'[\s\S]*?\},/g, '');
code = code.replace(/\{\s*id:\s*'resume'[\s\S]*?\},/g, '');

fs.writeFileSync('src/components/tools/ToolsHub.tsx', code);
