const fs = require('fs');
let code = fs.readFileSync('src/data/initialData.ts', 'utf8');

// I will just add the missing ones before Ayushman Bharat
const newServices = `
  // 5.6 UP Kisan Registration (Kisan Registry / Agristack)
  {
    id: 'kisan-registry-agristack',
    titleHi: 'किसान रजिस्ट्री (Kisan Registry / Agristack)',
    titleEn: 'Kisan Registry (Agristack Farmer ID)',
    category: 'schemes',
    stateCode: 'UP',
    descHi: 'कृषि विभाग की नई किसान रजिस्ट्री, किसान आईडी (Farmer ID) बनाएं।',
    descEn: 'New farmer registry portal (Agristack) for generating Farmer ID.',
    isPopular: true,
    isQuickAccess: true,
    isFavorite: false,
    order: 5.6,
    active: true,
    tags: ['kisan registry', 'agristack', 'farmer id', 'किसान रजिस्ट्री', 'पंजीकरण'],
    requiredDocsHi: ['आधार कार्ड', 'खतौनी की नकल', 'आधार लिंक मोबाइल नंबर'],
    requiredDocsEn: ['Aadhaar Card', 'Khatauni', 'Aadhaar linked Mobile'],
    officialLinks: {
      officialPortal: 'https://upagriculture.com/',
      newApply: 'https://agristack.gov.in/',
    },
  },

  // 5.7 UP Pension Scheme (SSPY)
  {
    id: 'sspy-up-pension',
    titleHi: 'पेंशन योजना (SSPY - वृद्धा, विधवा, दिव्यांग)',
    titleEn: 'UP Pension Scheme (SSPY)',
    category: 'schemes',
    stateCode: 'UP',
    descHi: 'वृद्धावस्था (Old Age), निराश्रित महिला (Widow) और दिव्यांग (Handicap) पेंशन आवेदन व स्टेटस।',
    descEn: 'Apply for Old Age, Widow, and Handicap pension. Check application status and list.',
    isPopular: true,
    isQuickAccess: true,
    isFavorite: false,
    order: 5.7,
    active: true,
    tags: ['pension', 'sspy', 'vridha', 'widow', 'handicap', 'पेंशन', 'वृद्धावस्था', 'दिव्यांग'],
    requiredDocsHi: ['आधार कार्ड', 'बैंक पासबुक', 'आय प्रमाण पत्र', 'पासपोर्ट फोटो'],
    requiredDocsEn: ['Aadhaar Card', 'Bank Passbook', 'Income Certificate', 'Passport Photo'],
    officialLinks: {
      officialPortal: 'https://sspy-up.gov.in/',
      status: 'https://sspy-up.gov.in/HindiPages/index_h.aspx',
    },
  },

  // 5.8 UP BOCW Labor Card (Shramik)
  {
    id: 'up-bocw-labor-card',
    titleHi: 'श्रमिक कार्ड (UP BOCW / Labour Card)',
    titleEn: 'Labour Card (UP BOCW)',
    category: 'certificates',
    stateCode: 'UP',
    descHi: 'मजदूर/श्रमिक कार्ड के लिए नया आवेदन, नवीनीकरण (Renewal) और योजना का लाभ।',
    descEn: 'Apply for new labour card, renewal, and scheme benefits under UP BOCW.',
    isPopular: true,
    isQuickAccess: false,
    isFavorite: false,
    order: 5.8,
    active: true,
    tags: ['labour card', 'bocw', 'shramik', 'श्रमिक कार्ड', 'मजदूर'],
    requiredDocsHi: ['आधार कार्ड', 'बैंक पासबुक', 'नियोजक प्रमाण पत्र', 'फोटो'],
    requiredDocsEn: ['Aadhaar Card', 'Bank Passbook', 'Employer Certificate', 'Photo'],
    officialLinks: {
      officialPortal: 'https://upbocw.in/',
      newApply: 'https://upbocw.in/index.aspx',
      renewal: 'https://upbocw.in/Renewal/Renewal_Index.aspx',
    },
  },

  // 5.9 NSP National Scholarship
  {
    id: 'nsp-national-scholarship',
    titleHi: 'राष्ट्रीय छात्रवृत्ति पोर्टल (NSP)',
    titleEn: 'National Scholarship Portal (NSP)',
    category: 'applications',
    stateCode: 'ALL',
    descHi: 'अल्पसंख्यक, प्री/पोस्ट मैट्रिक व मेरिट छात्रवृत्ति हेतु ऑनलाइन आवेदन।',
    descEn: 'Apply for pre-matric, post-matric, and merit-cum-means scholarships.',
    isPopular: false,
    isQuickAccess: false,
    isFavorite: false,
    order: 5.9,
    active: true,
    tags: ['scholarship', 'nsp', 'छात्रवृत्ति', 'स्कॉलरशिप'],
    requiredDocsHi: ['आधार कार्ड', 'मार्कशीट', 'आय व जाति प्रमाण', 'बैंक पासबुक'],
    requiredDocsEn: ['Aadhaar Card', 'Marksheets', 'Income/Caste Certificate', 'Bank Passbook'],
    officialLinks: {
      officialPortal: 'https://scholarships.gov.in/',
    },
  },
  
  // 5.91 NREGA Job Card
  {
    id: 'nrega-job-card',
    titleHi: 'नरेगा जॉब कार्ड (MGNREGA)',
    titleEn: 'NREGA Job Card',
    category: 'certificates',
    stateCode: 'ALL',
    descHi: 'मनरेगा जॉब कार्ड लिस्ट देखें, मस्टर रोल चेक करें और शिकायत दर्ज करें।',
    descEn: 'Check NREGA job card list, muster rolls, and payment details.',
    isPopular: false,
    isQuickAccess: false,
    isFavorite: false,
    order: 5.91,
    active: true,
    tags: ['nrega', 'job card', 'mgnrega', 'मनरेगा', 'जॉब कार्ड'],
    requiredDocsHi: ['ग्राम पंचायत का नाम'],
    requiredDocsEn: ['Gram Panchayat Name'],
    officialLinks: {
      officialPortal: 'https://nrega.nic.in/',
    },
  },

  // 5.92 SBM - Swachh Bharat Mission (Toilet)
  {
    id: 'sbm-sauchalay',
    titleHi: 'शौचालय ऑनलाइन फॉर्म (SBM Phase-II)',
    titleEn: 'Toilet Online Form (SBM Phase-II)',
    category: 'schemes',
    stateCode: 'ALL',
    descHi: 'स्वच्छ भारत मिशन के तहत व्यक्तिगत शौचालय (IHHL) के लिए 12000/- अनुदान हेतु आवेदन।',
    descEn: 'Apply for Individual Household Latrine (IHHL) under SBM for Rs 12000 grant.',
    isPopular: true,
    isQuickAccess: false,
    isFavorite: false,
    order: 5.92,
    active: true,
    tags: ['sbm', 'sauchalay', 'toilet form', 'शौचालय', 'स्वच्छ भारत'],
    requiredDocsHi: ['आधार कार्ड', 'बैंक पासबुक', 'पासपोर्ट फोटो'],
    requiredDocsEn: ['Aadhaar Card', 'Bank Passbook', 'Passport Photo'],
    officialLinks: {
      officialPortal: 'https://sbm.gov.in/sbmphase2/extchoice.aspx',
      apply: 'https://sbm.gov.in/sbmphase2/extchoice.aspx',
    },
  },
`;

code = code.replace('// 6. Ayushman Bharat PMJAY', newServices + '\n  // 6. Ayushman Bharat PMJAY');
fs.writeFileSync('src/data/initialData.ts', code);
