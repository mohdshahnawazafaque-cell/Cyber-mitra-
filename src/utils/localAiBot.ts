export const getLocalFallbackResponse = (query: string, isHindi: boolean): string => {
  const q = query.toLowerCase();
  
  if (q.includes('aadhaar') || q.includes('aadhar') || q.includes('आधार')) {
    return isHindi 
      ? 'आधार कार्ड के लिए मुख्य वेबसाइट myAadhaar (myaadhaar.uidai.gov.in) है। नया आधार या सुधार के लिए आपको आधार केंद्र जाना होगा। ऑनलाइन आप PVC कार्ड आर्डर, पता बदलना और आधार डाउनलोड कर सकते हैं।'
      : 'For Aadhaar services, visit myAadhaar (myaadhaar.uidai.gov.in). You can download Aadhaar, order PVC cards, and update address online. For biometric updates, visit an Aadhaar Kendra.';
  }
  if (q.includes('pan') || q.includes('पैन')) {
    return isHindi
      ? 'नया पैन कार्ड या सुधार (Form 49A/CSF) आप NSDL या UTIITSL पोर्टल से कर सकते हैं। इसके लिए 107/- रुपये की सरकारी फीस लगती है। इंस्टेंट ई-पैन (e-PAN) इनकम टैक्स की वेबसाइट से फ्री में बन जाता है।'
      : 'You can apply for a new PAN or corrections (Form 49A/CSF) via NSDL or UTIITSL portal (Govt fee ~Rs 107). Instant e-PAN can be generated for free on the Income Tax portal.';
  }
  if (q.includes('kisan') || q.includes('किसान')) {
    return isHindi
      ? 'पीएम किसान (PM Kisan) योजना की ई-केवाईसी (e-KYC) और स्टेटस pmkisan.gov.in से चेक करें। किसान रजिस्ट्री के लिए agristack.gov.in का उपयोग करें।'
      : 'For PM Kisan e-KYC and status, visit pmkisan.gov.in. For the new Kisan Registry, use agristack.gov.in.';
  }
  if (q.includes('pension') || q.includes('पेंशन')) {
    return isHindi
      ? 'यूपी में वृद्धावस्था, विधवा और दिव्यांग पेंशन के लिए sspy-up.gov.in पर ऑनलाइन आवेदन करें। साथ में आय प्रमाण पत्र और आधार होना आवश्यक है।'
      : 'In UP, apply for Old Age, Widow, and Handicap pension online at sspy-up.gov.in. Income certificate and Aadhaar are mandatory.';
  }
  if (q.includes('khatauni') || q.includes('bhulekh') || q.includes('खतौनी') || q.includes('भूलेख')) {
    return isHindi
      ? 'जमीन की खतौनी देखने के लिए upbhulekh.gov.in पर जाएं। अपने जिले, तहसील और गांव का चयन करके आप खाता संख्या या नाम से खतौनी निकाल सकते हैं।'
      : 'To check land records (Khatauni) in UP, visit upbhulekh.gov.in. Select your district, tehsil, and village to search by account number or name.';
  }
  if (q.includes('income') || q.includes('caste') || q.includes('domicile') || q.includes('आय') || q.includes('जाति') || q.includes('निवास')) {
    return isHindi
      ? 'आय, जाति और निवास प्रमाण पत्र ई-डिस्ट्रिक्ट (e-District) पोर्टल के माध्यम से बनाए जाते हैं। ई-साथी (e-Sathi) सिटीजन पोर्टल से भी आप खुद अप्लाई कर सकते हैं (फीस 15 रुपये)।'
      : 'Income, Caste, and Domicile certificates are applied via the e-District portal. Citizens can also apply directly using the e-Sathi portal (Fee Rs 15).';
  }
  if (q.includes('scholarship') || q.includes('स्कॉलरशिप') || q.includes('छात्रवृत्ति')) {
    return isHindi
      ? 'यूपी स्कॉलरशिप के लिए scholarship.up.gov.in और नेशनल स्कॉलरशिप (NSP) के लिए scholarships.gov.in पर आवेदन करें। बैंक खाते में NPCI / DBT लिंक होना अनिवार्य है।'
      : 'Apply for UP Scholarship at scholarship.up.gov.in and National Scholarship at scholarships.gov.in. Ensure the bank account is NPCI/DBT linked.';
  }
  if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('नमस्ते') || q.includes('हेलो')) {
    return isHindi
      ? 'नमस्ते! मैं साइबर मित्रा (Cyber Mitra) AI हूँ। आप मुझसे किसी भी सरकारी योजना, फॉर्म या पोर्टल के बारे में पूछ सकते हैं। मैं आपकी क्या मदद कर सकता हूँ?'
      : 'Hello! I am Cyber Mitra AI. You can ask me about any government scheme, form, or portal. How can I help you today?';
  }
  
  return isHindi
    ? 'क्षमा करें, मुझे इस प्रश्न का सटीक उत्तर नहीं मिल रहा है। कृपया "आधार", "पैन कार्ड", "पेंशन", "खतौनी", "आय प्रमाण" या "किसान" से जुड़ा कोई सवाल पूछें।\n\n(ध्यान दें: यह एक स्मार्ट ऑफलाइन असिस्टेंट है। सभी सवालों के जवाब के लिए सेटिंग्स (⚙️) में जाकर अपनी Gemini API Key दर्ज करें।)'
    : 'Sorry, I couldn\'t find an exact answer for this. Please ask about "Aadhaar", "PAN", "Pension", "Khatauni", "Income Certificate", or "PM Kisan".\n\n(Note: This is an offline smart assistant. For advanced answers, add your Gemini API Key in Settings ⚙️.)';
};
