const fs = require('fs');
let code = fs.readFileSync('src/data/initialData.ts', 'utf8');

const targetStr = "id: 'pm-awas-yojana',";
const replacement = "id: 'vanshavali-certificate-maker',\n    titleHi: 'वंशावली प्रमाण-पत्र',\n    titleEn: 'Family Tree / Vanshavali',\n    descHi: 'परिवार के सदस्यों का वंशावली प्रमाण-पत्र पीडीएफ में तैयार करें और प्रिंट करें।',\n    descEn: 'Generate and print Family Tree / Pedigree certificate in PDF.',\n    category: 'certificates',\n    stateCode: 'ALL',\n    tags: ['vanshavali', 'family tree', 'वंशावली', 'प्रमाण-पत्र'],\n    isPopular: true,\n    active: true,\n    presetSubject: 'vanshavali_certificate',\n    icon: '📜'\n  },\n  {\n    " + targetStr;

code = code.replace(targetStr, replacement);
fs.writeFileSync('src/data/initialData.ts', code);
console.log("Patched initialData.ts");
