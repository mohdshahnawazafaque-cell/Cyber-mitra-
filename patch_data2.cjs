const fs = require('fs');
let code = fs.readFileSync('src/data/initialData.ts', 'utf8');

const additionalServices = `
  // 5.93 PM Awas Yojana (PMAY)
  {
    id: 'pm-awas-yojana',
    titleHi: 'प्रधानमंत्री आवास योजना (PMAY)',
    titleEn: 'PM Awas Yojana (PMAY)',
    category: 'schemes',
    stateCode: 'ALL',
    descHi: 'पीएम आवास योजना (शहरी/ग्रामीण) में आवेदन और लाभार्थी सूची (List) चेक करें।',
    descEn: 'Apply for PM Awas Yojana and check beneficiary list for rural/urban.',
    isPopular: true,
    isQuickAccess: false,
    isFavorite: false,
    order: 5.93,
    active: true,
    tags: ['pmay', 'awas yojana', 'आवास योजना', 'पीएम आवास'],
    requiredDocsHi: ['आधार कार्ड', 'आय प्रमाण पत्र', 'बैंक खाता', 'फोटो'],
    requiredDocsEn: ['Aadhaar Card', 'Income Certificate', 'Bank Account', 'Photo'],
    officialLinks: {
      officialPortal: 'https://pmaymis.gov.in/',
      status: 'https://rhreporting.nic.in/netiay/SocialAuditReport/BeneficiaryDetailForSocialAuditReport.aspx',
    },
  },

  // 5.94 UP Kanya Sumangala Yojana
  {
    id: 'up-kanya-sumangala',
    titleHi: 'कन्या सुमंगला योजना (UP MKSY)',
    titleEn: 'Kanya Sumangala Yojana (MKSY)',
    category: 'schemes',
    stateCode: 'UP',
    descHi: 'उत्तर प्रदेश मुख्यमंत्री कन्या सुमंगला योजना के तहत बालिकाओं के लिए अनुदान आवेदन।',
    descEn: 'Apply for UP CM Kanya Sumangala Yojana financial assistance for girl child.',
    isPopular: true,
    isQuickAccess: false,
    isFavorite: false,
    order: 5.94,
    active: true,
    tags: ['kanya sumangala', 'mksy', 'girl child scheme', 'कन्या सुमंगला'],
    requiredDocsHi: ['बालिका का जन्म प्रमाण पत्र', 'माता-पिता का आधार', 'बैंक पासबुक'],
    requiredDocsEn: ['Birth Certificate', 'Parents Aadhaar', 'Bank Passbook'],
    officialLinks: {
      officialPortal: 'https://mksy.up.gov.in/women_welfare/index.php',
      newApply: 'https://mksy.up.gov.in/women_welfare/citizen/guest_login.php',
    },
  },

  // 5.95 Vivah Anudan (Shadi Anudan)
  {
    id: 'up-vivah-anudan',
    titleHi: 'विवाह अनुदान योजना (Shadi Anudan)',
    titleEn: 'Marriage Grant Scheme (Vivah Anudan)',
    category: 'schemes',
    stateCode: 'UP',
    descHi: 'उत्तर प्रदेश विवाह हेतु अनुदान (शादी अनुदान) योजना के लिए ऑनलाइन फॉर्म भरें।',
    descEn: 'Apply for Marriage Grant Scheme (Shadi Anudan) in Uttar Pradesh.',
    isPopular: false,
    isQuickAccess: false,
    isFavorite: false,
    order: 5.95,
    active: true,
    tags: ['vivah anudan', 'shadi anudan', 'marriage grant', 'विवाह अनुदान', 'शादी अनुदान'],
    requiredDocsHi: ['आधार कार्ड', 'आय/जाति प्रमाण पत्र', 'विवाह कार्ड/प्रमाण पत्र', 'बैंक खाता'],
    requiredDocsEn: ['Aadhaar', 'Income/Caste Cert', 'Marriage Card', 'Bank Account'],
    officialLinks: {
      officialPortal: 'http://shadianudan.upsdc.gov.in/',
    },
  },
  
  // 5.96 Rojgar Sangam (Sewayojan)
  {
    id: 'rojgar-sangam-up',
    titleHi: 'रोजगार संगम / सेवायोजन (UP Sewayojan)',
    titleEn: 'Rojgar Sangam (UP Employment)',
    category: 'applications',
    stateCode: 'UP',
    descHi: 'बेरोजगारी भत्ता व रोजगार (Job) मेले के लिए सेवायोजन पोर्टल पर पंजीकरण।',
    descEn: 'Register on Sewayojan portal for employment fairs and unemployment allowance.',
    isPopular: true,
    isQuickAccess: true,
    isFavorite: false,
    order: 5.96,
    active: true,
    tags: ['rojgar', 'sewayojan', 'employment', 'रोजगार', 'सेवायोजन'],
    requiredDocsHi: ['आधार कार्ड', 'शैक्षिक योग्यता प्रमाण पत्र', 'फोटो', 'हस्ताक्षर'],
    requiredDocsEn: ['Aadhaar', 'Education Certificates', 'Photo', 'Signature'],
    officialLinks: {
      officialPortal: 'https://sewayojan.up.nic.in/',
      newApply: 'https://rojgarsangam.up.gov.in/',
    },
  },
`;

code = code.replace('// 6. Ayushman Bharat PMJAY', additionalServices + '\n  // 6. Ayushman Bharat PMJAY');
fs.writeFileSync('src/data/initialData.ts', code);
