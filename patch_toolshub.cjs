const fs = require('fs');
let code = fs.readFileSync('src/components/tools/ToolsHub.tsx', 'utf8');

const targetStr = "{ id: 'awas-certificate', category: 'utility'";
const replacement = "{ id: 'vanshavali-certificate', category: 'utility', nameHi: 'वंशावली प्रमाण-पत्र', nameEn: 'Vanshavali Certificate', descHi: 'परिवार के सदस्यों का वंशावली विवरण बनाएं और प्रिंट करें।', descEn: 'Generate Family Tree Certificate.', target: 'vanshavali_certificate', subCategory: 'utility' },\n    " + targetStr;

code = code.replace(targetStr, replacement);
fs.writeFileSync('src/components/tools/ToolsHub.tsx', code);
console.log("Patched ToolsHub.tsx");
