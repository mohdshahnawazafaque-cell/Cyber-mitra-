const fs = require('fs');
let code = fs.readFileSync('src/data/initialData.ts', 'utf8');

const awasBlock = `  {
    id: 'pm-awas-yojana',
    titleHi: 'पीएम आवास योजना (PMAY)',
    titleEn: 'PM Awas Yojana (PMAY)',
    descHi: 'प्रधानमंत्री आवास योजना के लिए ऑनलाइन आवेदन और सूची देखें (शहरी और ग्रामीण)।',
    descEn: 'Apply for PM Awas Yojana and check beneficiary list for rural/urban.',
    category: 'schemes',
    stateCode: 'ALL',
    tags: ['pmay', 'awas yojana', 'आवास योजना', 'पीएम आवास'],
    isPopular: true,
    active: true,
    link: 'https://pmaymis.gov.in/',
    icon: '🏠'
  }`;
  
const replacement = awasBlock + `,\n  {
    id: 'vanshavali-certificate-maker',
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
    icon: '📜'
  }`;

code = code.replace(awasBlock, replacement);
fs.writeFileSync('src/data/initialData.ts', code);
console.log("Patched initialData.ts");
