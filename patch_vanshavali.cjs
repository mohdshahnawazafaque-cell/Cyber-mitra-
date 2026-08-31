const fs = require('fs');
let code = fs.readFileSync('src/data/initialData.ts', 'utf8');

const targetObjStr = `    id: 'vanshavali-certificate-maker',
    titleHi: 'वंशावली प्रमाण-पत्र',
    titleEn: 'Family Tree / Vanshavali',
    descHi: 'परिवार के सदस्यों का वंशावली प्रमाण-पत्र पीडीएफ में तैयार करें और प्रिंट करें।',
    descEn: 'Generate and print Family Tree / Pedigree certificate in PDF.',
    category: 'certificates',
    stateCode: 'ALL',
    tags: ['vanshavali', 'family tree', 'वंशावली', 'प्रमाण-पत्र'],
    isPopular: true,
    active: true,
    presetSubject: 'vanshavali_certificate',
    icon: '📜'`;

const replacement = `    id: 'vanshavali-certificate-maker',
    titleHi: 'वंशावली प्रमाण-पत्र',
    titleEn: 'Family Tree / Vanshavali',
    descHi: 'परिवार के सदस्यों का वंशावली प्रमाण-पत्र पीडीएफ में तैयार करें और प्रिंट करें।',
    descEn: 'Generate and print Family Tree / Pedigree certificate in PDF.',
    category: 'certificates',
    stateCode: 'ALL',
    tags: ['vanshavali', 'family tree', 'वंशावली', 'प्रमाण-पत्र'],
    isPopular: true,
    active: true,
    isQuickAccess: true,
    order: 0,
    presetSubject: 'vanshavali_certificate',
    icon: '📜',
    officialLinks: {
      officialPortal: ''
    },
    requiredDocsHi: [],
    requiredDocsEn: []`;

code = code.replace(targetObjStr, replacement);
fs.writeFileSync('src/data/initialData.ts', code);
console.log("Patched vanshavali object in initialData.ts");
