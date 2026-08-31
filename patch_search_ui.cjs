const fs = require('fs');

// 1. Update SmartSearch.tsx
let smartSearch = fs.readFileSync('src/components/common/SmartSearch.tsx', 'utf8');

// Remove the fixed wrapper and its backdrop
const fixedWrapperRegex = /<div\s+className="fixed inset-0[^>]+>[\s\S]*?<div className="w-full max-w-3xl([^>]+)>/m;
smartSearch = smartSearch.replace(fixedWrapperRegex, `<div className="absolute top-full left-0 right-0 mt-2 z-50 w-full bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[70vh] animate-in fade-in slide-in-from-top-2 duration-200">`);

// Remove the closing div of the fixed wrapper
smartSearch = smartSearch.replace(/<\/div>\s*<\/div>\s*<\/div>\s*\);\s*};\s*$/m, `</div>\n    </div>\n  );\n};\n`);

// Write it back
fs.writeFileSync('src/components/common/SmartSearch.tsx', smartSearch);

// 2. Update Navbar.tsx
let navbar = fs.readFileSync('src/components/layout/Navbar.tsx', 'utf8');

// The relative container in Navbar
const relativeRegex = /<div className="relative">([\s\S]*?)<\/div>\s*<\/div>\s*\{\/\* Right: Utilities/m;

// Wait, I need to know exactly how it looks
