const fs = require('fs');
let code = fs.readFileSync('src/components/apps/ApplicationBuilder.tsx', 'utf8');

// Replace handlePrint with simple window.print()
code = code.replace(/const handlePrint = \(\) => \{[\s\S]*?setTimeout\(\(\) => \{[\s\S]*?\}, 1000\);\n  \};/, 
`const handlePrint = () => {
    window.print();
  };`);
  
// Add print:hidden to the header actions
code = code.replace(/<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">/, 
  '<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 print:hidden">');

// Add print:hidden to left column
code = code.replace(/<div className="lg:col-span-5 space-y-4">/, 
  '<div className="lg:col-span-5 space-y-4 print:hidden">');

// Add print:hidden to the buttons toolbar above the sheet
code = code.replace(/<div className="bg-white rounded-2xl border border-slate-200 p-3 flex flex-wrap items-center justify-between gap-2 shadow-xs">/, 
  '<div className="bg-white rounded-2xl border border-slate-200 p-3 flex flex-wrap items-center justify-between gap-2 shadow-xs print:hidden">');

// We need to ensure the right column takes full width in print mode.
code = code.replace(/<div className="lg:col-span-7">/, 
  '<div className="lg:col-span-7 print:col-span-12 print:w-full">');

// Also remove border and shadow from the print area in print mode
code = code.replace(/className="bg-white rounded-2xl border border-slate-300 shadow-md p-6 sm:p-10 font-sans text-slate-900 leading-relaxed text-sm min-h-\[580px\]"/, 
  'className="bg-white rounded-2xl border border-slate-300 shadow-md p-6 sm:p-10 font-sans text-slate-900 leading-relaxed text-sm min-h-[580px] print:border-none print:shadow-none print:p-0"');

fs.writeFileSync('src/components/apps/ApplicationBuilder.tsx', code);
