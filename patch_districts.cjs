const fs = require('fs');

const upDistricts = [
  "अंबेडकर नगर", "अमेठी", "अमरोहा", "अयोध्या", "अलीगढ़", "आगरा", "आजमगढ़", "इटावा", "प्रयागराज", "उन्नाव", "एटा", "औरैया",
  "कन्नौज", "कानपुर देहात", "कानपुर नगर", "कासगंज", "कुशीनगर", "कौशांबी", "गाजियाबाद", "गाजीपुर", "गोरखपुर", "गोंडा", "गौतम बुद्ध नगर",
  "चंदौली", "चित्रकूट", "जालौन", "जौनपुर", "झांसी", "देवरिया", "पीलीभीत", "प्रतापगढ़", "फतेहपुर", "फर्रुखाबाद", "फिरोजाबाद",
  "बदायूं", "बरेली", "बलरामपुर", "बलिया", "बस्ती", "बहराइच", "बांदा", "बागपत", "बाराबंकी", "बिजनौर", "बुलंदशहर", "भदोही",
  "मथुरा", "मऊ", "महराजगंज", "महोबा", "मिर्जापुर", "मुजफ्फरनगर", "मुरादाबाद", "मेरठ", "मैनपुरी", "रामपुर", "रायबरेली",
  "लखनऊ", "लखीमपुर खीरी", "ललितपुर", "वाराणसी", "शामली", "शाहजहांपुर", "श्रावस्ती", "संत कबीर नगर", "संभल", "सहारनपुर",
  "सिद्धार्थनगर", "सीतापुर", "सुल्तानपुर", "सोनभद्र", "हमीरपुर", "हरदोई", "हाथरस", "हापुड़"
].sort((a, b) => a.localeCompare(b, 'hi'));

let code = fs.readFileSync('src/components/tools/AwasCertificate.tsx', 'utf8');

// Insert array at top of file, after imports
if(!code.includes('const upDistricts =')) {
  code = code.replace(
    "export const AwasCertificate: React.FC<AwasCertificateProps> = ({ language }) => {",
    `const upDistricts = ${JSON.stringify(upDistricts)};\n\nexport const AwasCertificate: React.FC<AwasCertificateProps> = ({ language }) => {`
  );
}

// Replace input with select
const oldBlock = `<input
                  type="text"
                  value={district}
                  onChange={(e) => { setDistrict(e.target.value); if(errors.district) setErrors({...errors, district: ''}); }}
                  placeholder="जनपद का नाम दर्ज करें"
                  className={\`w-full px-4 py-2 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:ring-2 outline-none transition-all \${errors.district ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-blue-500 focus:border-blue-600'}\`}
                />`;

const newBlock = `<select
                  value={district}
                  onChange={(e) => { setDistrict(e.target.value); if(errors.district) setErrors({...errors, district: ''}); }}
                  className={\`w-full px-4 py-2 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:ring-2 outline-none transition-all \${errors.district ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-blue-500 focus:border-blue-600'}\`}
                >
                  <option value="">जनपद चुनें</option>
                  {upDistricts.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>`;

if(code.includes('placeholder="जनपद का नाम दर्ज करें"')) {
  code = code.replace(oldBlock, newBlock);
  fs.writeFileSync('src/components/tools/AwasCertificate.tsx', code);
  console.log("Patched successfully");
} else {
  console.log("Could not find block to patch");
}
