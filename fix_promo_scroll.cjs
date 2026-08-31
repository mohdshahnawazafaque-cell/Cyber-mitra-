const fs = require('fs');
let code = fs.readFileSync('src/components/tools/PromoDesigner.tsx', 'utf8');

code = code.replace(/flex justify-center overflow-x-auto/g, 'block overflow-x-auto text-center'); 
code = code.replace(/flex justify-center /g, '');

fs.writeFileSync('src/components/tools/PromoDesigner.tsx', code);
console.log("Fixed promo flex clipping");
