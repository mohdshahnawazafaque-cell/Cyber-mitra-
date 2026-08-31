const fs = require('fs');

function patchFile(filepath) {
  if (!fs.existsSync(filepath)) return;
  let code = fs.readFileSync(filepath, 'utf8');
  code = code.replace(/<div className="grid grid-cols-1 lg:grid-cols-12 gap-6( |")/g, '<div className="w-full min-w-0 grid grid-cols-1 lg:grid-cols-12 gap-6$1');
  code = code.replace(/<div className="grid grid-cols-1 xl:grid-cols-12 gap-8( |")/g, '<div className="w-full min-w-0 grid grid-cols-1 xl:grid-cols-12 gap-8$1');
  
  // also add min-w-0 w-full to col-spans
  code = code.replace(/xl:col-span-4 /g, 'xl:col-span-4 min-w-0 w-full ');
  code = code.replace(/xl:col-span-8 /g, 'xl:col-span-8 min-w-0 w-full ');
  code = code.replace(/xl:col-span-5 /g, 'xl:col-span-5 min-w-0 w-full ');
  code = code.replace(/xl:col-span-7 /g, 'xl:col-span-7 min-w-0 w-full ');
  
  fs.writeFileSync(filepath, code);
}

patchFile('src/components/tools/PromoDesigner.tsx');
patchFile('src/components/tools/InvoiceGenerator.tsx');
patchFile('src/components/tools/BulkSmsTool.tsx');

console.log("Patched other grid wrappers");
