const fs = require('fs');
let code = fs.readFileSync('src/components/layout/Sidebar.tsx', 'utf8');

// Modernize sidebar
code = code.replace(
  'className={`fixed lg:static inset-y-0 left-0 z-50 w-[280px] bg-slate-900 text-white flex flex-col',
  'className={`fixed lg:static inset-y-0 left-0 z-50 w-[280px] bg-slate-900 bg-[url("https://www.transparenttextures.com/patterns/cubes.png")] text-white flex flex-col'
);

code = code.replace(
  'className="flex items-center gap-3 w-full"',
  'className="flex items-center gap-3 w-full bg-slate-800/50 p-2 rounded-xl border border-slate-700/50"'
);

fs.writeFileSync('src/components/layout/Sidebar.tsx', code);
