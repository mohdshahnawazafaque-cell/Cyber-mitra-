const fs = require('fs');
let code = fs.readFileSync('src/components/common/SmartSearch.tsx', 'utf8');

const divRegex = /<div className="fixed top-\[60px\] left-1\/2 -translate-x-1\/2 w-\[90%\] max-w-xl z-50 bg-white rounded-xl shadow-\[0_10px_40px_-10px_rgba\(0,0,0,0\.2\)\] border border-slate-200 overflow-hidden flex flex-col max-h-\[70vh\] animate-in fade-in slide-in-from-top-2 duration-200">/;

code = code.replace(
  divRegex,
  `<div className="fixed inset-0 z-40" onClick={onClose} />\n    <div className="fixed top-[60px] left-1/2 -translate-x-1/2 w-[90%] max-w-xl z-50 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-slate-200 overflow-hidden flex flex-col max-h-[70vh] animate-in fade-in slide-in-from-top-2 duration-200">`
);

// We also need to add fragments since we're returning two adjacent elements.
code = code.replace(
  /return \(\s*<div className="fixed inset-0 z-40"/,
  `return (\n    <>\n    <div className="fixed inset-0 z-40"`
);

// Add the closing fragment at the end
code = code.replace(/<\/div>\s*$/, `</div>\n    </>\n`);

fs.writeFileSync('src/components/common/SmartSearch.tsx', code);
console.log("Patched backdrop");
