import { ApplicationTemplate } from '../types';

export const INITIAL_APPLICATION_TEMPLATES: ApplicationTemplate[] = [
  {
    id: 'tpl-custom-general',
    titleHi: 'सामान्य प्रार्थना पत्र (Custom)',
    titleEn: 'General Custom Application',
    category: 'applications',
    descriptionHi: 'किसी भी अधिकारी या विभाग को अपनी मर्जी से प्रार्थना पत्र लिखें।',
    descriptionEn: 'Write a custom application to any officer or department.',
    recipientHi: `सेवा में,
श्रीमान {{addressee}},
{{department}},
जनपद - {{district}} (उ०प्र०)`,
    recipientEn: `To,
The {{addressee}},
{{department}},
District - {{district}} (U.P.)`,
    subjectHi: 'विषय: {{subject}}',
    subjectEn: 'Subject: {{subject}}',
    templateBodyHi: `महोदय,

सविनय निवेदन है कि प्रार्थी {{name}}, पिता/पति श्री {{fatherMotherName}}, निवासी- {{address}}, ग्राम/मोहल्ला- {{villageTown}}, जनपद- {{district}} का स्थायी निवासी है।

{{body}}

अतः श्रीमान जी से करबद्ध प्रार्थना है कि उक्त विषय का संज्ञान लेते हुए आवश्यक/उचित कार्यवाही करने की कृपा करें।

धन्यवाद।`,
    templateBodyEn: `Respected Sir/Madam,

I, {{name}}, S/o / W/o Shri {{fatherMotherName}}, resident of {{address}}, Village/Town: {{villageTown}}, District: {{district}}, humbly state that:

{{body}}

Therefore, it is my humble request to kindly take cognizance of the matter and take necessary action.

Thanking You.`,
    fields: [
      { id: 'addressee', labelHi: 'प्राप्तकर्ता का पद (जैसे- थाना प्रभारी / उपजिलाधिकारी)', labelEn: 'Addressee Designation', type: 'text', required: true, defaultValue: '' },
      { id: 'department', labelHi: 'विभाग / कार्यालय (जैसे- कोतवाली / तहसील)', labelEn: 'Department/Office', type: 'text', required: true, defaultValue: '' },
      { id: 'subject', labelHi: 'विषय (Subject)', labelEn: 'Subject', type: 'text', required: true, defaultValue: '' },
      { id: 'body', labelHi: 'प्रार्थना पत्र का मुख्य विवरण', labelEn: 'Application Details', type: 'textarea', required: true, defaultValue: '' },
    ],
    requiredDocumentsHi: ['आधार कार्ड', 'अन्य संबंधित साक्ष्य'],
    requiredDocumentsEn: ['Aadhaar Card', 'Other Related Evidence'],
  },
  // 1. Income Certificate Request
  {
    id: 'tpl-income-cert',
    titleHi: 'आय प्रमाण पत्र हेतु प्रार्थना पत्र',
    titleEn: 'Application for Income Certificate (Tehsildar)',
    category: 'certificates',
    descriptionHi: 'तहसीलदार / उपजिलाधिकारी को आय प्रमाण पत्र जारी करने हेतु औपचारिक प्रार्थना पत्र।',
    descriptionEn: 'Formal application to Tehsildar / SDM for issuance of Income Certificate.',
    recipientHi: 'सेवा में,\nश्रीमान तहसीलदार महोदय,\nतहसील - {{tehsil}}, जनपद - {{district}} (उ०प्र०)',
    recipientEn: 'To,\nThe Tehsildar,\nTehsil - {{tehsil}}, District - {{district}} (U.P.)',
    subjectHi: 'विषय: आय प्रमाण पत्र निर्गत करने के सम्बन्ध में।',
    subjectEn: 'Subject: Regarding issuance of Annual Family Income Certificate.',
    templateBodyHi: `महोदय,
सविनय निवेदन है कि प्रार्थी {{name}}, पिता/पति श्री {{fatherMotherName}}, निवासी- {{address}}, ग्राम/मोहल्ला- {{villageTown}}, तहसील- {{tehsil}}, जनपद- {{district}} का मूल निवासी है।

प्रार्थी के परिवार की समस्त स्रोतों (कृषि/मजदूरी/निजी कार्य) से कुल वार्षिक आय लगभग ₹ {{annualIncome}}/- ({{annualIncomeWords}} रुपये) मात्र है। प्रार्थी को {{purpose}} हेतु आय प्रमाण पत्र की नितांत आवश्यकता है।

अतः श्रीमान जी से सादर प्रार्थना है कि प्रार्थी के पक्ष में विधिवत जांच कराकर आय प्रमाण पत्र जारी करने की कृपा करें। इसके लिए प्रार्थी सदैव आपका आभारी रहेगा।

संलग्नक:
1. स्वप्रमाणित घोषणा पत्र
2. आधार कार्ड की छायाप्रति
3. राशन कार्ड / बिजली बिल की छायाप्रति`,
    templateBodyEn: `Respected Sir,
I, the applicant {{name}}, S/o / W/o Shri {{fatherMotherName}}, resident of {{address}}, Village/Town: {{villageTown}}, Tehsil: {{tehsil}}, District: {{district}}, hereby submit that:

The total annual income of my family from all sources is approximately Rs. {{annualIncome}}/- ({{annualIncomeWords}} only). I require this Income Certificate for the purpose of {{purpose}}.

Therefore, it is kindly requested to verify the particulars and issue the Income Certificate in my favor.

Enclosures:
1. Self Declaration Affidavit
2. Copy of Aadhaar Card
3. Copy of Ration Card / Electricity Bill`,
    fields: [
      { id: 'tehsil', labelHi: 'तहसील का नाम', labelEn: 'Tehsil Name', type: 'text', required: true, defaultValue: '', placeholderHi: 'जैसे: सदर / नवाबगंज' },
      { id: 'annualIncome', labelHi: 'कुल वार्षिक आय (रुपये में)', labelEn: 'Annual Income (in Rs.)', type: 'number', required: true, defaultValue: '', placeholderHi: 'जैसे: 48000' },
      { id: 'annualIncomeWords', labelHi: 'वार्षिक आय (शब्दों में)', labelEn: 'Annual Income (in Words)', type: 'text', required: true, defaultValue: '', placeholderHi: 'जैसे: अड़तालीस हजार' },
      { id: 'purpose', labelHi: 'प्रमाण पत्र की आवश्यकता (उद्देश्य)', labelEn: 'Purpose for Certificate', type: 'text', required: true, defaultValue: '', placeholderHi: 'जैसे: छात्रवृत्ति हेतु / राशन कार्ड हेतु' },
    ],
    requiredDocumentsHi: ['आधार कार्ड छायाप्रति', 'स्वप्रमाणित घोषणा पत्र', 'राशन कार्ड या सभासद/प्रधान प्रमाण पत्र'],
    requiredDocumentsEn: ['Aadhaar Card Copy', 'Self Declaration Form', 'Ration Card / Local Recommendation'],
  },

  // 2. Caste Certificate Request
  {
    id: 'tpl-caste-cert',
    titleHi: 'जाति प्रमाण पत्र हेतु प्रार्थना पत्र',
    titleEn: 'Application for Caste Certificate',
    category: 'certificates',
    descriptionHi: 'तहसीलदार महोदय को अन्य पिछड़ा वर्ग (OBC) / SC / ST जाति प्रमाण पत्र जारी करने हेतु।',
    descriptionEn: 'Application to Tehsildar for issuance of Caste Certificate (OBC/SC/ST).',
    recipientHi: 'सेवा में,\nश्रीमान तहसीलदार महोदय,\nतहसील - {{tehsil}}, जनपद - {{district}} (उ०प्र०)',
    recipientEn: 'To,\nThe Tehsildar,\nTehsil - {{tehsil}}, District - {{district}} (U.P.)',
    subjectHi: 'विषय: जाति प्रमाण पत्र ({{casteSubCategory}}) निर्गत करने के सम्बन्ध में।',
    subjectEn: 'Subject: Regarding issuance of Caste Certificate ({{casteSubCategory}}).',
    templateBodyHi: `महोदय,
सविनय निवेदन है कि प्रार्थी {{name}}, पिता श्री {{fatherMotherName}}, निवासी- {{address}}, ग्राम/कस्बा- {{villageTown}}, जनपद- {{district}} का स्थायी निवासी है।

प्रार्थी जाति से '{{casteName}}' (उपजाति- {{subCaste}}) के अंतर्गत आता है जो कि शासन द्वारा {{casteSubCategory}} वर्ग में अधिसूचित है। प्रार्थी को {{purpose}} हेतु जाति प्रमाण पत्र की आवश्यकता है।

अतः श्रीमान जी से विनम्र निवेदन है कि राजस्व निरीक्षक/लेखपाल से जांच आख्या प्राप्त कर प्रार्थी का जाति प्रमाण पत्र निर्गत करने की कृपा करें।

संलग्नक:
1. आधार कार्ड की छायाप्रति
2. परिवार रजिस्टर नकल / खतौनी / पुरानी जाति प्रमाण पत्र की प्रति
3. स्वप्रमाणित घोषणा पत्र`,
    templateBodyEn: `Respected Sir,
I, {{name}}, S/o Shri {{fatherMotherName}}, resident of {{address}}, Village/Town: {{villageTown}}, District: {{district}}, state that I belong to '{{casteName}}' caste (Sub-caste: {{subCaste}}) which is notified under {{casteSubCategory}} category.

I require the Caste Certificate for {{purpose}}.

Kindly verify and grant the certificate.

Enclosures:
1. Copy of Aadhaar Card
2. Family Register Extract / Land Record
3. Self Declaration Form`,
    fields: [
      { id: 'tehsil', labelHi: 'तहसील', labelEn: 'Tehsil', type: 'text', required: true, defaultValue: '' },
      { id: 'casteSubCategory', labelHi: 'आरक्षण श्रेणी', labelEn: 'Category', type: 'select', options: ['अन्य पिछड़ा वर्ग (OBC)', 'अनुसूचित जाति (SC)', 'अनुसूचित जनजाति (ST)', 'आर्थिक रूप से कमजोर वर्ग (EWS)'], required: true, defaultValue: '' },
      { id: 'casteName', labelHi: 'जाति का नाम', labelEn: 'Caste Name', type: 'text', required: true, defaultValue: '', placeholderHi: 'जैसे: मौर्य / यादव / चौरसिया / कुर्मी' },
      { id: 'subCaste', labelHi: 'उपजाति', labelEn: 'Sub Caste', type: 'text', required: false, defaultValue: '', placeholderHi: 'यदि कोई हो' },
      { id: 'purpose', labelHi: 'आवश्यकता का कारण', labelEn: 'Purpose', type: 'text', required: true, defaultValue: '' },
    ],
    requiredDocumentsHi: ['आधार कार्ड', 'परिवार रजिस्टर नकल / पुरानी जाति प्रमाण प्रति', 'स्वप्रमाणित शपथ पत्र'],
    requiredDocumentsEn: ['Aadhaar Card', 'Family Register Extract', 'Self Declaration'],
  },

  // 3. Domicile / Residence Certificate
  {
    id: 'tpl-domicile-cert',
    titleHi: 'निवास प्रमाण पत्र हेतु प्रार्थना पत्र',
    titleEn: 'Application for Domicile / Residence Certificate',
    category: 'certificates',
    descriptionHi: 'उत्तर प्रदेश में मूल निवास / सामान्य निवास प्रमाण पत्र प्राप्त करने हेतु आवेदन।',
    descriptionEn: 'Application for issuance of Domicile / Permanent Residence Certificate.',
    recipientHi: 'सेवा में,\nश्रीमान उपजिलाधिकारी / तहसीलदार महोदय,\nतहसील - {{tehsil}}, जनपद - {{district}}',
    recipientEn: 'To,\nThe Sub-Divisional Magistrate / Tehsildar,\nTehsil - {{tehsil}}, District - {{district}}',
    subjectHi: 'विषय: निवास प्रमाण पत्र (Domicile Certificate) जारी कराने हेतु।',
    subjectEn: 'Subject: Regarding issuance of Permanent Domicile Certificate.',
    templateBodyHi: `महोदय,
सविनय निवेदन है कि प्रार्थी {{name}}, पिता/पति श्री {{fatherMotherName}}, मूल निवासी- {{address}}, ग्राम/वार्ड- {{villageTown}}, जनपद- {{district}} का जन्म से / पिछले {{yearsLiving}} वर्षों से स्थायी निवासी है।

प्रार्थी का पूरा परिवार यहीं निवास करता है एवं मतदाता सूची व राशन कार्ड में नाम दर्ज है। प्रार्थी को {{purpose}} हेतु निवास प्रमाण पत्र की आवश्यकता है।

अतः श्रीमान जी से प्रार्थना है कि प्रार्थी का निवास प्रमाण पत्र निर्गत करने का कष्ट करें।

संलग्नक:
1. आधार कार्ड एवं वोटर कार्ड की प्रति
2. बिजली बिल / निवास का साक्ष्य
3. शैक्षिक प्रमाण पत्र (निवास पुष्टि हेतु)`,
    templateBodyEn: `Respected Sir,
I, {{name}}, S/o / W/o Shri {{fatherMotherName}}, resident of {{address}}, Village/Ward: {{villageTown}}, District: {{district}}, have been residing here permanently since birth / for the last {{yearsLiving}} years.

I need this Domicile Certificate for {{purpose}}.

Kindly issue the Certificate.

Enclosures:
1. Aadhaar Card and Voter Card copies
2. Electricity Bill / Address Proof
3. School / Educational Records`,
    fields: [
      { id: 'tehsil', labelHi: 'तहसील', labelEn: 'Tehsil', type: 'text', required: true, defaultValue: '' },
      { id: 'yearsLiving', labelHi: 'निवास की अवधि (वर्षों में)', labelEn: 'Years of Residence', type: 'text', required: true, defaultValue: '', placeholderHi: 'जैसे: जन्म से या 15 वर्ष' },
      { id: 'purpose', labelHi: 'प्रमाण पत्र का उपयोग', labelEn: 'Purpose', type: 'text', required: true, defaultValue: '' },
    ],
    requiredDocumentsHi: ['आधार कार्ड', 'बिजली बिल / मकान कर रसीद', 'स्वप्रमाणित घोषणा'],
    requiredDocumentsEn: ['Aadhaar Card', 'Electricity Bill / House Tax Receipt', 'Self Declaration'],
  },

  // 4. Ration Card Member Addition
  {
    id: 'tpl-ration-card-add',
    titleHi: 'राशन कार्ड में नया नाम जोड़ने हेतु प्रार्थना पत्र',
    titleEn: 'Application for Adding Member in Ration Card',
    category: 'schemes',
    descriptionHi: 'खाद्य एवं रसद आपूर्ति अधिकारी को परिवार के नए सदस्य का नाम राशन कार्ड में जोड़ने हेतु।',
    descriptionEn: 'Application to Food & Supply Inspector to add new member / newborn in Ration Card.',
    recipientHi: 'सेवा में,\nश्रीमान पूर्ति निरीक्षक (Supply Inspector) महोदय,\nखाद्य एवं रसद विभाग, विकास खंड/तहसील- {{tehsil}}, जनपद- {{district}}',
    recipientEn: 'To,\nThe Supply Inspector,\nFood & Civil Supplies Department, Tehsil: {{tehsil}}, District: {{district}}',
    subjectHi: 'विषय: राशन कार्ड संख्या {{rationCardNumber}} में नए सदस्य का नाम जोड़ने हेतु।',
    subjectEn: 'Subject: Regarding addition of new family member in Ration Card No. {{rationCardNumber}}.',
    templateBodyHi: `महोदय,
सविनय निवेदन है कि प्रार्थी {{name}}, पिता/पति श्री {{fatherMotherName}}, निवासी- {{address}}, ग्राम/कस्बा- {{villageTown}}, जनपद- {{district}} का पात्र गृहस्थी/अंत्योदय राशन कार्ड धारक है, जिसका राशन कार्ड नंबर {{rationCardNumber}} है।

प्रार्थी के परिवार में निम्न नए सदस्य (नवविवाहिता/नवजात शिशु) का नाम पूर्व में दर्ज नहीं हो सका था:
- नए सदस्य का नाम: {{newMemberName}}
- संबंध (मुख्या से): {{relationWithHead}}
- जन्म तिथि / आयु: {{newMemberDob}}
- आधार कार्ड नंबर: {{newMemberAadhaar}}

अतः श्रीमान जी से विनम्र निवेदन है कि उपरोक्तानुसार नए सदस्य का नाम प्रार्थी के राशन कार्ड में सम्मिलित करने की कृपा करें।

संलग्नक:
1. मूल राशन कार्ड की छायाप्रति
2. नए सदस्य के आधार कार्ड / जन्म प्रमाण पत्र की छायाप्रति
3. शादी का प्रमाण पत्र / विदाई प्रमाण पत्र (यदि लागू हो)`,
    templateBodyEn: `Respected Sir,
I, {{name}}, S/o / W/o Shri {{fatherMotherName}}, resident of {{address}}, {{villageTown}}, {{district}}, hold Ration Card No. {{rationCardNumber}}.

Kindly add the following new family member in my existing Ration Card:
- Member Name: {{newMemberName}}
- Relation with Head: {{relationWithHead}}
- Date of Birth / Age: {{newMemberDob}}
- Aadhaar Card No: {{newMemberAadhaar}}

Enclosures:
1. Copy of Ration Card
2. Aadhaar / Birth Certificate of new member`,
    fields: [
      { id: 'tehsil', labelHi: 'तहसील / ब्लॉक', labelEn: 'Tehsil / Block', type: 'text', required: true, defaultValue: '' },
      { id: 'rationCardNumber', labelHi: 'मौजूदा राशन कार्ड नंबर', labelEn: 'Ration Card Number', type: 'text', required: true, defaultValue: '', placeholderHi: '12 अंकों का राशन कार्ड नंबर' },
      { id: 'newMemberName', labelHi: 'नए सदस्य का नाम', labelEn: 'New Member Name', type: 'text', required: true, defaultValue: '', placeholderHi: 'नए सदस्य का पूरा नाम' },
      { id: 'relationWithHead', labelHi: 'मुखिया से संबंध', labelEn: 'Relation with Head', type: 'text', required: true, defaultValue: '', placeholderHi: 'जैसे: पत्नी / पुत्र / पुत्री' },
      { id: 'newMemberDob', labelHi: 'जन्म तिथि / आयु', labelEn: 'DOB / Age', type: 'text', required: true, defaultValue: '', placeholderHi: 'DD/MM/YYYY' },
      { id: 'newMemberAadhaar', labelHi: 'नए सदस्य का आधार नंबर', labelEn: 'New Member Aadhaar', type: 'text', required: true, defaultValue: '', placeholderHi: '12 अंकों का आधार नंबर' },
    ],
    requiredDocumentsHi: ['राशन कार्ड कॉपी', 'नए सदस्य का आधार कार्ड / जन्म प्रमाण पत्र'],
    requiredDocumentsEn: ['Ration Card Copy', 'Aadhaar / Birth Certificate of member'],
  },

  // 5. Electricity Meter / Connection Request
  {
    id: 'tpl-electricity-service',
    titleHi: 'विद्युत मीटर सुधार / नया कनेक्शन प्रार्थना पत्र',
    titleEn: 'Application for Electricity Meter Repair / Transfer',
    category: 'payments',
    descriptionHi: 'अधिशासी अभियंता / उपखंड अधिकारी (विद्युत) को खराब मीटर बदलने अथवा बिल सुधार हेतु।',
    descriptionEn: 'Application to Executive Engineer / SDO Electricity for meter repair or bill correction.',
    recipientHi: 'सेवा में,\nश्रीमान अधिशासी अभियंता / उपखंड अधिकारी (विद्युत),\nविद्युत वितरण खंड- {{substationName}}, जनपद- {{district}}',
    recipientEn: 'To,\nThe Executive Engineer / Sub-Divisional Officer (Electricity),\nElectricity Distribution Division: {{substationName}}, District: {{district}}',
    subjectHi: 'विषय: विद्युत संयोजन संख्या {{consumerId}} के {{complaintType}} के सम्बन्ध में।',
    subjectEn: 'Subject: Regarding {{complaintType}} for Consumer Account No. {{consumerId}}.',
    templateBodyHi: `महोदय,
सविनय निवेदन है कि प्रार्थी {{name}}, पिता श्री {{fatherMotherName}}, निवासी- {{address}}, {{villageTown}}, जनपद- {{district}} का विद्युत उपभोक्ता है, जिसकी उपभोक्ता संख्या (Account ID) {{consumerId}} है।

प्रार्थी के परिसर पर स्थापित विद्युत संयोजन में निम्न समस्या उत्पन्न हो गई है:
"{{complaintDetails}}"

प्रार्थी द्वारा पूर्ववर्ती समस्त विद्युत देयों का भुगतान नियमित रूप से किया जा चुका है।

अतः श्रीमान जी से सादर अनुरोध है कि संबंधित लाइनमैन/मीटर रीडर को निर्देशित कर उक्त समस्या का त्वरित निराकरण कराने की कृपा करें।

संलग्नक:
1. अंतिम भुगतान किए गए बिल की रसीद
2. आधार कार्ड की छायाप्रति
3. मीटर की वर्तमान रीडिंग का फोटो (यदि लागू हो)`,
    templateBodyEn: `Respected Sir,
I, {{name}}, consumer of Electricity Account No. {{consumerId}}, resident of {{address}}, {{villageTown}}, {{district}}, bring to your kind notice the following issue:
"{{complaintDetails}}"

All prior bills have been paid up to date. Kindly depute a technician to resolve this issue at the earliest.

Enclosures:
1. Copy of latest paid electricity bill
2. Copy of Aadhaar Card`,
    fields: [
      { id: 'substationName', labelHi: 'विद्युत उपकेंद्र / डिवीजन', labelEn: 'Substation / Division', type: 'text', required: true, defaultValue: '' },
      { id: 'consumerId', labelHi: 'उपभोक्ता खाता संख्या (Account ID)', labelEn: 'Consumer Account ID', type: 'text', required: true, defaultValue: '', placeholderHi: '10 अंकों का UPPCL अकाउंट नंबर' },
      { id: 'complaintType', labelHi: 'समस्या का प्रकार', labelEn: 'Complaint Type', type: 'select', options: ['खराब/जले मीटर को बदलने', 'अत्यधिक गलत बिल संशोधन', 'नाम परिवर्तन / संयोजन ट्रांसफर', 'नया विद्युत मीटर अधिष्ठापन'], required: true, defaultValue: '' },
      { id: 'complaintDetails', labelHi: 'समस्या का संक्षिप्त विवरण', labelEn: 'Complaint Details', type: 'textarea', required: true, defaultValue: '' },
    ],
    requiredDocumentsHi: ['नवीनतम भुगतान रसीद', 'आधार कार्ड', 'मीटर फोटो'],
    requiredDocumentsEn: ['Latest Paid Bill Receipt', 'Aadhaar Card', 'Meter Photo'],
  },

  // 6. Bank Account Branch Transfer / KYC Update
  {
    id: 'tpl-bank-service',
    titleHi: 'बैंक शाखा स्थानांतरण / KYC अद्यतन प्रार्थना पत्र',
    titleEn: 'Application for Bank Account Branch Transfer / KYC',
    category: 'applications',
    descriptionHi: 'शाखा प्रबंधक महोदय को खाता अन्य शाखा में ट्रांसफर अथवा KYC अपडेट करने हेतु आवेदन।',
    descriptionEn: 'Application to Bank Branch Manager for Account Transfer / KYC Updation.',
    recipientHi: 'सेवा में,\nश्रीमान शाखा प्रबंधक महोदय,\n{{bankName}}, शाखा- {{branchName}}, जनपद- {{district}}',
    recipientEn: 'To,\nThe Branch Manager,\n{{bankName}}, Branch: {{branchName}}, District: {{district}}',
    subjectHi: 'विषय: खाता संख्या {{accountNumber}} के {{requestType}} के सम्बन्ध में।',
    subjectEn: 'Subject: Regarding {{requestType}} for Savings Account No. {{accountNumber}}.',
    templateBodyHi: `महोदय,
सविनय निवेदन है कि प्रार्थी {{name}}, पिता श्री {{fatherMotherName}}, निवासी- {{address}}, {{villageTown}}, जनपद- {{district}} का आपकी शाखा में एक बचत खाता संख्या {{accountNumber}} संचालित है।

{{requestDescription}}

प्रार्थी अपने नए पते व पहचान के समस्त वैध दस्तावेज (आधार कार्ड व पैन कार्ड) इस आवेदन पत्र के साथ संलग्न कर रहा है।

अतः श्रीमान जी से विनम्र निवेदन है कि प्रार्थी के उक्त खाते में आवश्यक कार्यवाही त्वरित रूप से करने की कृपा करें।

संलग्नक:
1. आधार कार्ड एवं पैन कार्ड की स्वप्रमाणित प्रति
2. बैंक पासबुक के प्रथम पृष्ठ की छायाप्रति
3. दो पासपोर्ट साइज नवीनतम फोटोग्राफ`,
    templateBodyEn: `Respected Sir,
I, {{name}}, S/o Shri {{fatherMotherName}}, hold Savings Bank Account No. {{accountNumber}} in your branch.

{{requestDescription}}

I am enclosing my valid KYC documents (Aadhaar & PAN Card). Kindly process my request.

Enclosures:
1. Self-attested copies of Aadhaar and PAN Card
2. Copy of Bank Passbook
3. Two recent passport photographs`,
    fields: [
      { id: 'bankName', labelHi: 'बैंक का नाम', labelEn: 'Bank Name', type: 'text', required: true, defaultValue: '', placeholderHi: 'जैसे: SBI / PNB / BOB' },
      { id: 'branchName', labelHi: 'वर्तमान शाखा का नाम', labelEn: 'Current Branch Name', type: 'text', required: true, defaultValue: '' },
      { id: 'accountNumber', labelHi: 'बैंक खाता संख्या', labelEn: 'Account Number', type: 'text', required: true, defaultValue: '', placeholderHi: 'खाता संख्या दर्ज करें' },
      { id: 'requestType', labelHi: 'आवेदन का उद्देश्य', labelEn: 'Request Type', type: 'select', options: ['शाखा स्थानांतरण (Branch Transfer)', 'केवाईसी / मोबाइल नंबर अपडेट', 'खाता पुनः सक्रिय (Reactivation)', 'एटीएम कार्ड जारी कराने'], required: true, defaultValue: '' },
      { id: 'requestDescription', labelHi: 'विस्तृत विवरण', labelEn: 'Detailed Description', type: 'textarea', required: true, defaultValue: '' },
    ],
    requiredDocumentsHi: ['आधार कार्ड प्रति', 'पैन कार्ड प्रति', 'बैंक पासबुक प्रति', '2 फोटो'],
    requiredDocumentsEn: ['Aadhaar Copy', 'PAN Card Copy', 'Passbook Copy', '2 Photos'],
  },

  // 7. Police Character Certificate Recommendation
  {
    id: 'tpl-police-char-cert',
    titleHi: 'चरित्र प्रमाण पत्र हेतु सभासद / प्रधान प्रमाण पत्र',
    titleEn: 'Character & Residence Certificate by Ward Member / Pradhan',
    category: 'police_legal',
    descriptionHi: 'ग्राम प्रधान / सभासद द्वारा नागरिक के अच्छे चरित्र एवं स्थायी निवास का संस्तुति पत्र।',
    descriptionEn: 'Recommendation Letter of Good Moral Character by Gram Pradhan / Ward Councilor.',
    recipientHi: 'कार्यालय ग्राम प्रधान / नगर पंचायत वार्ड पार्षद\nग्राम पंचायत / वार्ड: {{villageTown}}, विकास खंड: {{tehsil}}, जनपद: {{district}}',
    recipientEn: 'Office of Gram Pradhan / Ward Councilor\nGram Panchayat / Ward: {{villageTown}}, Tehsil: {{tehsil}}, District: {{district}}',
    subjectHi: 'प्रमाणित किया जाता है (चरित्र एवं निवास प्रमाण पत्र)',
    subjectEn: 'TO WHOMSOEVER IT MAY CONCERN (Character & Domicile Certificate)',
    templateBodyHi: `प्रमाणित किया जाता है कि श्री/सुश्री {{name}}, आत्मज/आत्मजा श्री {{fatherMotherName}}, निवासी- {{address}}, ग्राम/मोहल्ला- {{villageTown}}, पोस्ट- {{villageTown}}, जनपद- {{district}} (उ०प्र०) के स्थायी निवासी हैं।

मैं इन्हें व्यक्तिगत रूप से पिछले {{knownYears}} वर्षों से भली-भांति जानता एवं पहचानता हूँ। ये हमारे क्षेत्र के प्रतिष्ठित एवं संभ्रांत नागरिक हैं।

मेरी जानकारी में इनका नैतिक आचरण एवं चरित्र उत्तम है तथा इनके विरुद्ध किसी भी प्रकार की असामाजिक या आपराधिक गतिविधि का कोई मामला नहीं है।

यह प्रमाण पत्र इनके द्वारा {{purpose}} हेतु मांगे जाने पर ससम्मान जारी किया जा रहा है। मैं इनके उज्ज्वल भविष्य की कामना करता हूँ।`,
    templateBodyEn: `This is to certify that Shri/Ms. {{name}}, S/o / D/o Shri {{fatherMotherName}}, resident of {{address}}, Village/Ward: {{villageTown}}, District: {{district}}, is a permanent and bona-fide resident of our locality.

I have known them personally for the past {{knownYears}} years. To the best of my knowledge and belief, they bear a good moral character and have no adverse antecedents.

This certificate is issued upon request for the purpose of {{purpose}}.`,
    fields: [
      { id: 'tehsil', labelHi: 'ब्लॉक / तहसील', labelEn: 'Block / Tehsil', type: 'text', required: true, defaultValue: '' },
      { id: 'knownYears', labelHi: 'परिचय की अवधि (वर्षों में)', labelEn: 'Years Known', type: 'text', required: true, defaultValue: '', placeholderHi: 'जैसे: 5 / 10 / जन्म से' },
      { id: 'purpose', labelHi: 'प्रमाण पत्र का उपयोग', labelEn: 'Purpose', type: 'text', required: true, defaultValue: '' },
    ],
    requiredDocumentsHi: ['आधार कार्ड', '2 पासपोर्ट फोटो'],
    requiredDocumentsEn: ['Aadhaar Card', '2 Passport Photos'],
  },

  // 8. Application to SDM (Sub-Divisional Magistrate)
  {
    id: 'tpl-sdm-general',
    titleHi: 'उपजिलाधिकारी (SDM) महोदय को प्रार्थना पत्र',
    titleEn: 'Application to SDM (Sub-Divisional Magistrate)',
    category: 'applications',
    descriptionHi: 'जमीन विवाद, पैमाइश, अवैध कब्जा, या शांति भंग की आशंका के संबंध में SDM को शिकायत/प्रार्थना पत्र।',
    descriptionEn: 'Complaint/Request letter to SDM regarding land dispute, measurement, or illegal possession.',
    recipientHi: 'सेवा में,\nश्रीमान उपजिलाधिकारी (SDM) महोदय,\nतहसील - {{tehsil}}, जनपद - {{district}} (उ०प्र०)',
    recipientEn: 'To,\nThe Sub-Divisional Magistrate (SDM),\nTehsil - {{tehsil}}, District - {{district}} (U.P.)',
    subjectHi: 'विषय: {{subjectMatters}} के सम्बन्ध में उचित कार्यवाही हेतु।',
    subjectEn: 'Subject: Regarding {{subjectMatters}} and request for appropriate action.',
    templateBodyHi: `महोदय,
सविनय निवेदन है कि प्रार्थी {{name}}, पिता/पति श्री {{fatherMotherName}}, निवासी- {{address}}, ग्राम/मोहल्ला- {{villageTown}}, तहसील- {{tehsil}}, जनपद- {{district}} का मूल निवासी है।

प्रार्थी के साथ निम्न समस्या उत्पन्न हो गई है:
"{{complaintDetails}}"

प्रार्थी ने इससे पूर्व भी संबंधित अधिकारियों (थाना / लेखपाल) को अवगत कराया था परंतु अभी तक कोई उचित कार्यवाही नहीं हुई है। जिस कारण प्रार्थी को काफी मानसिक व आर्थिक परेशानी का सामना करना पड़ रहा है।

अतः श्रीमान जी से विनम्र निवेदन है कि मामले की गंभीरता को देखते हुए संबंधित राजस्व कर्मी / थानाध्यक्ष को निर्देशित कर त्वरित एवं उचित कार्यवाही कराने की कृपा करें।

संलग्नक:
1. आधार कार्ड की छायाप्रति
2. प्रार्थना पत्र से सम्बंधित दस्तावेज (खतौनी / फोटो / रसीद)`,
    templateBodyEn: `Respected Sir,
I, {{name}}, S/o / W/o Shri {{fatherMotherName}}, resident of {{address}}, {{villageTown}}, Tehsil: {{tehsil}}, District: {{district}}, bring to your kind notice that:

"{{complaintDetails}}"

I have previously informed the concerned lower authorities but no action has been taken yet, causing me significant distress.

Therefore, I kindly request you to look into this matter urgently and direct the concerned officials to take immediate and appropriate action.

Enclosures:
1. Copy of Aadhaar Card
2. Related documents (Land records/Photos/Receipts)`,
    fields: [
      { id: 'tehsil', labelHi: 'तहसील का नाम', labelEn: 'Tehsil Name', type: 'text', required: true, defaultValue: '' },
      { id: 'subjectMatters', labelHi: 'विषय / मुख्य बिंदु', labelEn: 'Subject Matter', type: 'text', required: true, defaultValue: '', placeholderHi: 'जैसे: भूमि विवाद / पैमाइश / रास्ता विवाद' },
      { id: 'complaintDetails', labelHi: 'शिकायत का पूरा विवरण', labelEn: 'Complaint Details', type: 'textarea', required: true, defaultValue: '' },
    ],
    requiredDocumentsHi: ['आधार कार्ड', 'संबंधित साक्ष्य (खतौनी / फोटो)'],
    requiredDocumentsEn: ['Aadhaar Card', 'Relevant Evidence (Land records / Photos)'],
  },

  // 9. Application to DM (District Magistrate)
  {
    id: 'tpl-dm-general',
    titleHi: 'जिलाधिकारी (DM) महोदय को प्रार्थना / शिकायत पत्र',
    titleEn: 'Application / Complaint to DM (District Magistrate)',
    category: 'applications',
    descriptionHi: 'जिले के किसी भी विभाग में भ्रष्टाचार, जनसमस्या, पुलिस कार्यवाही न होने, या अन्य गंभीर मामलों के लिए पत्र।',
    descriptionEn: 'Complaint to District Magistrate regarding severe public grievances, police inaction, or corruption.',
    recipientHi: 'सेवा में,\nश्रीमान जिलाधिकारी (DM) महोदय,\nजनपद - {{district}} (उ०प्र०)',
    recipientEn: 'To,\nThe District Magistrate (DM),\nDistrict - {{district}} (U.P.)',
    subjectHi: 'विषय: {{subjectMatters}} के सम्बन्ध में निष्पक्ष जांच एवं कार्यवाही हेतु।',
    subjectEn: 'Subject: Request for fair investigation and action regarding {{subjectMatters}}.',
    templateBodyHi: `महोदय,
सविनय निवेदन है कि प्रार्थी {{name}}, पिता/पति श्री {{fatherMotherName}}, निवासी- {{address}}, ग्राम/मोहल्ला- {{villageTown}}, तहसील- {{tehsil}}, जनपद- {{district}} का स्थायी निवासी है।

महोदय, प्रार्थी अत्यंत दुःख एवं परेशानी के साथ आपको अवगत कराना चाहता है कि:
"{{complaintDetails}}"

इस सम्बन्ध में प्रार्थी द्वारा निचले स्तर के सम्बंधित अधिकारियों को भी लिखित रूप में शिकायत दी जा चुकी है, परंतु समस्या का कोई समाधान नहीं हुआ है और प्रार्थी दर-दर भटकने को मजबूर है।

अतः श्रीमान जी से करबद्ध प्रार्थना है कि जनहित एवं न्यायहित में मामले का संज्ञान लेते हुए, किसी सक्षम अधिकारी से निष्पक्ष जांच कराकर प्रार्थी को न्याय दिलाने की कृपा करें। इसके लिए प्रार्थी सदैव आपका आभारी रहेगा।

संलग्नक:
1. आधार कार्ड की छायाप्रति
2. पूर्व में दी गई शिकायतों की पावती / रसीद
3. सम्बंधित साक्ष्य एवं दस्तावेज`,
    templateBodyEn: `Respected Sir,
I, {{name}}, S/o / W/o Shri {{fatherMotherName}}, resident of {{address}}, {{villageTown}}, Tehsil: {{tehsil}}, District: {{district}}, humbly state that:

"{{complaintDetails}}"

I have already complained to the lower concerned authorities regarding this issue, but no solution has been provided so far.

Therefore, it is my humble request to kindly take cognizance of the matter, conduct a fair inquiry through a competent officer, and provide justice to the applicant. I shall be highly obliged.

Enclosures:
1. Copy of Aadhaar Card
2. Receipts of previous complaints
3. Relevant evidence and documents`,
    fields: [
      { id: 'tehsil', labelHi: 'तहसील का नाम', labelEn: 'Tehsil Name', type: 'text', required: true, defaultValue: '' },
      { id: 'subjectMatters', labelHi: 'विषय / मुख्य बिंदु', labelEn: 'Subject Matter', type: 'text', required: true, defaultValue: '', placeholderHi: 'जैसे: पुलिस द्वारा कार्यवाही न करना / आवास योजना में धांधली' },
      { id: 'complaintDetails', labelHi: 'शिकायत का पूरा विवरण', labelEn: 'Complaint Details', type: 'textarea', required: true, defaultValue: '' },
    ],
    requiredDocumentsHi: ['आधार कार्ड', 'पूर्व शिकायतों की प्रति', 'अन्य साक्ष्य'],
    requiredDocumentsEn: ['Aadhaar Card', 'Previous Complaints Copy', 'Other Evidence'],
  },
];
