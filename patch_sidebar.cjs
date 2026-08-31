const fs = require('fs');
let code = fs.readFileSync('src/components/layout/Sidebar.tsx', 'utf8');

const awasBlock = `    {
      id: 'awas_certificate',
      icon: <Building2 className="w-5 h-5" />,
      titleHi: 'आवास प्रमाण-पत्र',
      titleEn: 'Awas Certificate',
      view: 'awas_certificate'
    }`;
    
const replacement = awasBlock + `,\n    {
      id: 'vanshavali_certificate',
      icon: <FileCheck className="w-5 h-5" />,
      titleHi: 'वंशावली प्रमाण-पत्र',
      titleEn: 'Vanshavali Certificate',
      view: 'vanshavali_certificate'
    }`;

code = code.replace(awasBlock, replacement);
fs.writeFileSync('src/components/layout/Sidebar.tsx', code);
console.log("Patched Sidebar.tsx");
