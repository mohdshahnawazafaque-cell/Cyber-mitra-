const fs = require('fs');

let code = fs.readFileSync('src/components/tools/ToolsHub.tsx', 'utf8');

const newItem = `{ id: 'awas-certificate', category: 'utility', nameHi: 'आवास प्रमाण-पत्र', nameEn: 'Awas Certificate Generator', descHi: 'प्रधानमंत्री आवास योजना-शहरी 2.0 का प्रमाण-पत्र बनाएं।', descEn: 'Generate PMAY-U 2.0 certificate.', target: 'awas_certificate', subCategory: 'utility' },
    { id: 'promo-designer',`;

if(!code.includes('awas-certificate')) {
  code = code.replace("{ id: 'promo-designer',", newItem);
  fs.writeFileSync('src/components/tools/ToolsHub.tsx', code);
}
