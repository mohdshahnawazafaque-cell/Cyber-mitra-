const fs = require('fs');
let code = fs.readFileSync('src/data/initialTemplates.ts', 'utf8');

const regex = /defaultValue: '[^']*'/g;
code = code.replace(regex, "defaultValue: ''");

fs.writeFileSync('src/data/initialTemplates.ts', code);
console.log("Patched all defaults in initialTemplates.ts");
