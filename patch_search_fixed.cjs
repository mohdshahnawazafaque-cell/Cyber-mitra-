const fs = require('fs');
let code = fs.readFileSync('src/components/common/SmartSearch.tsx', 'utf8');

code = code.replace(
  '<div className="absolute top-full left-0 right-0 mt-2 z-50 w-full bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[70vh] animate-in fade-in slide-in-from-top-2 duration-200">',
  '<div className="fixed top-[60px] left-1/2 -translate-x-1/2 w-[90%] max-w-xl z-50 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-slate-200 overflow-hidden flex flex-col max-h-[70vh] animate-in fade-in slide-in-from-top-2 duration-200">'
);

fs.writeFileSync('src/components/common/SmartSearch.tsx', code);
console.log("Patched to fixed centered dropdown");
