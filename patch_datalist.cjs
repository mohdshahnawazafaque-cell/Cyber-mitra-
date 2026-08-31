const fs = require('fs');

let code = fs.readFileSync('src/components/tools/AwasCertificate.tsx', 'utf8');

// Insert upGeoData just below upDistricts
const geoDataCode = `

const upGeoData: Record<string, Record<string, string[]>> = {
  "सीतापुर": {
    "नगर पंचायत तम्बौर": ["सिर्स टोला", "अहमदाबाद", "नई बस्ती", "पुरानी बाजार", "चमन गंज", "मुहल्ला शेखान"],
    "नगर पालिका परिषद सीतापुर": ["आर्यनगर", "शास्त्री नगर", "नेहरू नगर", "सिविल लाइंस", "तरीनपुर", "लोहामंडी", "आलमनगर"],
    "नगर पालिका परिषद महमूदाबाद": ["नई बाजार", "पुरानी बाजार", "सैयदबाड़ा"],
    "नगर पालिका परिषद लहरपुर": ["जोशियाना", "मंसूर नगर", "काजियना", "नई बस्ती"],
    "नगर पालिका परिषद बिसवां": ["शेख सराय", "पटवा गली", "चमन गंज"],
    "नगर पालिका परिषद खैराबाद": ["मखदूमपुर", "मियां सराय", "बाजार"],
    "नगर पंचायत सिधौली": ["गांधी नगर", "पटेल नगर", "शास्त्री नगर"]
  },
  "लखनऊ": {
    "नगर निगम लखनऊ": ["गोमती नगर", "हजरतगंज", "अलीगंज", "इंदिरा नगर", "आलमबाग", "आशियाना", "चौक", "अमीनाबाद", "राजाजीपुरम"],
    "नगर पंचायत मलिहाबाद": ["मिर्जा गंज", "जोशी टोला", "चौधराना", "नई बस्ती"],
    "नगर पंचायत काकोरी": ["सैयदबाड़ा", "नई बस्ती", "चौक"],
    "नगर पंचायत गोसाईंगंज": ["पुरानी बाजार", "नई बस्ती"]
  },
  "कानपुर नगर": {
    "नगर निगम कानपुर": ["कल्याणपुर", "काकादेव", "किदवई नगर", "गोविंद नगर", "स्वरूप नगर", "चकेरी", "बर्रा", "पनकी"],
    "नगर पालिका परिषद बिल्हौर": ["उत्तरी", "दक्षिणी", "पूर्वी", "पश्चिमी"],
    "नगर पालिका परिषद घाटमपुर": ["पुरानी बाजार", "नई बस्ती"]
  },
  "गोरखपुर": {
    "नगर निगम गोरखपुर": ["गोरखनाथ", "राप्ती नगर", "शाहपुर", "रुस्तमपुर", "तारामंडल", "सूर्य विहार"],
    "नगर पंचायत सहजनवा": ["नई बस्ती", "पुरानी बाजार"],
    "नगर पंचायत पीपीगंज": ["वार्ड 1", "वार्ड 2", "वार्ड 3"]
  },
  "वाराणसी": {
    "नगर निगम वाराणसी": ["लंका", "भेलूपुर", "सिगरा", "महमूरगंज", "सारनाथ", "कैंट", "दशाश्वमेध", "गोदौलिया"],
    "नगर पंचायत गंगापुर": ["वार्ड 1", "वार्ड 2"]
  },
  "प्रयागराज": {
    "नगर निगम प्रयागराज": ["सिविल लाइंस", "कटरा", "अल्लापुर", "झूंसी", "फाफामऊ", "मुट्ठीगंज", "कीडगंज"],
    "नगर पंचायत फूलपुर": ["वार्ड 1", "वार्ड 2"]
  },
  "आगरा": {
    "नगर निगम आगरा": ["ताजगंज", "सिकंदरा", "शाहगंज", "कमला नगर", "दयालबाग", "सदर बाजार"]
  },
  "मेरठ": {
    "नगर निगम मेरठ": ["पल्लवपुरम", "शास्त्री नगर", "जागृति विहार", "कंकरखेड़ा", "लालकुर्ती"]
  },
  "गाजियाबाद": {
    "नगर निगम गाजियाबाद": ["इंदिरापुरम", "वैशाली", "वसुंधरा", "कवि नगर", "राजनगर", "विजयनगर"]
  },
  "बरेली": {
    "नगर निगम बरेली": ["सिविल लाइंस", "राजेंद्र नगर", "प्रेम नगर", "सुभाष नगर", "मॉडल टाउन"]
  }
  // User can still type manually for anything not listed here
};
`;

if (!code.includes('upGeoData: Record<string, Record<string, string[]>>')) {
  code = code.replace(
    /const upDistricts = \[[\s\S]*?\]\.sort\(\(a, b\) => a\.localeCompare\(b, 'hi'\)\);/,
    match => match + geoDataCode
  );
}

// Replace Mohalla block
const oldMohallaBlock = `<input
                  type="text"
                  value={mohalla}
                  onChange={(e) => { setMohalla(e.target.value); if(errors.mohalla) setErrors({...errors, mohalla: ''}); }}
                  placeholder="मोहल्ला या ग्राम दर्ज करें"
                  className={\`w-full px-4 py-2 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:ring-2 outline-none transition-all \${errors.mohalla ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-blue-500 focus:border-blue-600'}\`}
                />`;

const newMohallaBlock = `<input
                  type="text"
                  list="mohalla-list"
                  value={mohalla}
                  onChange={(e) => { setMohalla(e.target.value); if(errors.mohalla) setErrors({...errors, mohalla: ''}); }}
                  placeholder="मोहल्ला/ग्राम चुनें या टाइप करें"
                  className={\`w-full px-4 py-2 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:ring-2 outline-none transition-all \${errors.mohalla ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-blue-500 focus:border-blue-600'}\`}
                />
                <datalist id="mohalla-list">
                  {district && upGeoData[district as string] && nagarNikay && upGeoData[district as string][nagarNikay as string] && 
                    upGeoData[district as string][nagarNikay as string].map(m => (
                      <option key={m} value={m} />
                  ))}
                </datalist>`;
                
code = code.replace(oldMohallaBlock, newMohallaBlock);


// Replace Nagar Nikay block
const oldNagarNikayBlock = `<input
                  type="text"
                  value={nagarNikay}
                  onChange={(e) => { setNagarNikay(e.target.value); if(errors.nagarNikay) setErrors({...errors, nagarNikay: ''}); }}
                  placeholder="नगर निकाय का नाम दर्ज करें"
                  className={\`w-full px-4 py-2 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:ring-2 outline-none transition-all \${errors.nagarNikay ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-blue-500 focus:border-blue-600'}\`}
                />`;

const newNagarNikayBlock = `<input
                  type="text"
                  list="nikay-list"
                  value={nagarNikay}
                  onChange={(e) => { setNagarNikay(e.target.value); if(errors.nagarNikay) setErrors({...errors, nagarNikay: ''}); }}
                  placeholder="निकाय चुनें या टाइप करें"
                  className={\`w-full px-4 py-2 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:ring-2 outline-none transition-all \${errors.nagarNikay ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-blue-500 focus:border-blue-600'}\`}
                />
                <datalist id="nikay-list">
                  {district && upGeoData[district as string] && Object.keys(upGeoData[district as string]).map(nikay => (
                    <option key={nikay} value={nikay} />
                  ))}
                </datalist>`;
                
code = code.replace(oldNagarNikayBlock, newNagarNikayBlock);

fs.writeFileSync('src/components/tools/AwasCertificate.tsx', code);
console.log("Patched successfully");
