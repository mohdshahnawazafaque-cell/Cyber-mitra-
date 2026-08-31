const fs = require('fs');
let code = fs.readFileSync('src/components/layout/Sidebar.tsx', 'utf8');

const targetStr = "id: 'awas_certificate',";
const replacement = "id: 'vanshavali_certificate',\n      view: 'vanshavali_certificate',\n      icon: FileText,\n      titleHi: 'वंशावली प्रमाण-पत्र',\n      titleEn: 'Family Tree',\n      descHi: 'परिवार का विवरण',\n      descEn: 'Family Details',\n      color: 'text-indigo-500'\n    },\n    {\n      " + targetStr;

code = code.replace(targetStr, replacement);
fs.writeFileSync('src/components/layout/Sidebar.tsx', code);
console.log("Patched Sidebar.tsx");
