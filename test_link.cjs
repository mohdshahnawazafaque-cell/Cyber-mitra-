const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(/const a = document\.createElement\('a'\);[\s\S]*?document\.body\.removeChild\(a\);/, "window.open(url, '_blank');");
fs.writeFileSync('src/App.tsx', code);
