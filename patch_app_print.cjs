const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/<div className="flex-1 flex w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-5 gap-6">/, 
'<div className="flex-1 flex print:block w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-5 gap-6 print:px-0 print:py-0 print:m-0 print:max-w-none">');

code = code.replace(/<main className="flex-1 min-w-0 space-y-5">/, 
'<main className="flex-1 min-w-0 space-y-5 print:space-y-0 print:block">');

fs.writeFileSync('src/App.tsx', code);
