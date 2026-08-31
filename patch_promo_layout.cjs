const fs = require('fs');
let code = fs.readFileSync('src/components/tools/PromoDesigner.tsx', 'utf8');

code = code.replace(/<div className="w-full min-w-0 grid grid-cols-1 lg:grid-cols-12 gap-6">/g, '<div className="w-full min-w-0 flex flex-col gap-8">');
code = code.replace(/<div className="lg:col-span-4 min-w-0 w-full space-y-6 print:hidden">/g, '<div className="w-full space-y-6 print:hidden">');
code = code.replace(/<div className="lg:col-span-8 min-w-0 w-full">/g, '<div className="w-full">');

// I also need to make sure the form inside is wider, currently they might be in a vertical column
// "grid grid-cols-1 sm:grid-cols-2 gap-4" can be added to the input groups if they aren't already.

fs.writeFileSync('src/components/tools/PromoDesigner.tsx', code);
console.log("Patched PromoDesigner.tsx");
