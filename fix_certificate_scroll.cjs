const fs = require('fs');
let code = fs.readFileSync('src/components/tools/AwasCertificate.tsx', 'utf8');

code = code.replace(/flex justify-start sm:justify-center /g, '');
code = code.replace(/flex justify-center /g, ''); // if any remains

fs.writeFileSync('src/components/tools/AwasCertificate.tsx', code);
console.log("Fixed AwasCertificate centering bug");
