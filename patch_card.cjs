const fs = require('fs');
let code = fs.readFileSync('src/components/services/ServiceCard.tsx', 'utf8');

// Modernize the card design
code = code.replace(
  'className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all flex flex-col justify-between overflow-hidden group hover:border-slate-200"',
  'className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:border-blue-300 relative"'
);

// Add a colored top accent line
code = code.replace(
  '<div className="p-4 sm:p-5">',
  '<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>\n      <div className="p-4 sm:p-5 pt-5">'
);

// Better primary button
code = code.replace(
  'bg-blue-600 hover:bg-blue-700 text-white',
  'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border border-blue-700/50'
);

// Better button layout - flex-wrap to grid or flex
code = code.replace(
  '<div className="p-3 bg-slate-50/90 border-t border-slate-200/80 flex flex-wrap items-center gap-1.5">',
  '<div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center gap-2">'
);

fs.writeFileSync('src/components/services/ServiceCard.tsx', code);
