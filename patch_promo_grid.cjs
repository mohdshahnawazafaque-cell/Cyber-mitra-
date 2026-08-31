const fs = require('fs');
let code = fs.readFileSync('src/components/tools/PromoDesigner.tsx', 'utf8');

code = code.replace(
  '<div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-5">',
  '<div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-5">'
);

code = code.replace(
  '<h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2">{isHindi ? \'पर्चा सेटिंग्स\' : \'Parcha Settings\'}</h3>',
  '<h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2">{isHindi ? \'पर्चा सेटिंग्स\' : \'Parcha Settings\'}</h3>\n<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">'
);

code = code.replace(
  '{/* Description */}',
  '</div>\n{/* Description */}'
);

fs.writeFileSync('src/components/tools/PromoDesigner.tsx', code);
console.log("Patched PromoDesigner.tsx grid fields");
