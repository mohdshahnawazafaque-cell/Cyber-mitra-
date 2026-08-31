const fs = require('fs');
let code = fs.readFileSync('src/data/initialTemplates.ts', 'utf8');

// Find the index of the first valid template (e.g. tpl-income-cert)
const incomeIndex = code.indexOf("{    id: 'tpl-income-cert'");
if (incomeIndex === -1) {
  const backup = code.indexOf("// 1. Income");
  if (backup !== -1) {
    code = code.substring(backup);
  } else {
    console.error("Could not find start of normal templates");
    process.exit(1);
  }
} else {
  code = code.substring(incomeIndex);
}

// Prefix with Custom Template
const customTemplate = `import { ApplicationTemplate } from '../types';

export const INITIAL_APPLICATION_TEMPLATES: ApplicationTemplate[] = [
  {
    id: 'tpl-custom-general',
    titleHi: 'सामान्य प्रार्थना पत्र (Custom)',
    titleEn: 'General Custom Application',
    category: 'applications',
    descriptionHi: 'किसी भी अधिकारी या विभाग को अपनी मर्जी से प्रार्थना पत्र लिखें।',
    descriptionEn: 'Write a custom application to any officer or department.',
    recipientHi: \`सेवा में,
श्रीमान {{addressee}},
{{department}},
जनपद - {{district}} (उ०प्र०)\`,
    recipientEn: \`To,
The {{addressee}},
{{department}},
District - {{district}} (U.P.)\`,
    subjectHi: 'विषय: {{subject}}',
    subjectEn: 'Subject: {{subject}}',
    templateBodyHi: \`महोदय,

सविनय निवेदन है कि प्रार्थी {{name}}, पिता/पति श्री {{fatherMotherName}}, निवासी- {{address}}, ग्राम/मोहल्ला- {{villageTown}}, जनपद- {{district}} का स्थायी निवासी है।

{{body}}

अतः श्रीमान जी से करबद्ध प्रार्थना है कि उक्त विषय का संज्ञान लेते हुए आवश्यक/उचित कार्यवाही करने की कृपा करें।

धन्यवाद।\`,
    templateBodyEn: \`Respected Sir/Madam,

I, {{name}}, S/o / W/o Shri {{fatherMotherName}}, resident of {{address}}, Village/Town: {{villageTown}}, District: {{district}}, humbly state that:

{{body}}

Therefore, it is my humble request to kindly take cognizance of the matter and take necessary action.

Thanking You.\`,
    fields: [
      { id: 'addressee', labelHi: 'प्राप्तकर्ता का पद (जैसे- थाना प्रभारी / उपजिलाधिकारी)', labelEn: 'Addressee Designation', type: 'text', required: true, defaultValue: '' },
      { id: 'department', labelHi: 'विभाग / कार्यालय (जैसे- कोतवाली / तहसील)', labelEn: 'Department/Office', type: 'text', required: true, defaultValue: '' },
      { id: 'subject', labelHi: 'विषय (Subject)', labelEn: 'Subject', type: 'text', required: true, defaultValue: '' },
      { id: 'body', labelHi: 'प्रार्थना पत्र का मुख्य विवरण', labelEn: 'Application Details', type: 'textarea', required: true, defaultValue: '' },
    ],
    requiredDocumentsHi: ['आधार कार्ड', 'अन्य संबंधित साक्ष्य'],
    requiredDocumentsEn: ['Aadhaar Card', 'Other Related Evidence'],
  },
  `;

code = customTemplate + code;

// Now remove all existing 'defaultValue' to satisfy user
code = code.replace(/defaultValue:\s*'[^']*'/g, "defaultValue: ''");

fs.writeFileSync('src/data/initialTemplates.ts', code);
console.log("Fixed!");
