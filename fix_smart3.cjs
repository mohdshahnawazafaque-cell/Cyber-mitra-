const fs = require('fs');
let code = fs.readFileSync('src/components/common/SmartSearch.tsx', 'utf8');

code = code.replace("</button>\n              )}", "</button>\n              );");
fs.writeFileSync('src/components/common/SmartSearch.tsx', code);
console.log("Fixed syntax");
