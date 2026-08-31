const fs = require('fs');
let code = fs.readFileSync('src/components/tools/AwasCertificate.tsx', 'utf8');

// Fix 1: Add min-w-0 to the grid
code = code.replace('<div className="grid grid-cols-1 xl:grid-cols-12 gap-8">', '<div className="w-full min-w-0 grid grid-cols-1 xl:grid-cols-12 gap-8">');

// Fix 2: Add min-w-0 to the columns
code = code.replace('<div className="xl:col-span-5 flex flex-col gap-6">', '<div className="xl:col-span-5 flex flex-col gap-6 min-w-0 w-full">');
code = code.replace('<div className="xl:col-span-7 bg-slate-100 p-4 sm:p-8 rounded-xl border border-slate-200 flex justify-center overflow-x-auto min-h-[600px]">', '<div className="xl:col-span-7 bg-slate-100 p-2 sm:p-8 rounded-xl border border-slate-200 flex justify-start sm:justify-center overflow-x-auto min-h-[600px] w-full">');

fs.writeFileSync('src/components/tools/AwasCertificate.tsx', code);
console.log("Patched AwasCertificate grid wrappers");
