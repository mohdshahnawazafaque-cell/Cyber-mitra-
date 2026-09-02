import React from 'react';
import {
  ShieldCheck,
  Mail,
  FileText,
  AlertTriangle,
  Info,
  Scale,
  CheckCircle2,
} from 'lucide-react';
import { Language } from '../../types';

interface SupportPagesProps {
  view: 'about' | 'contact' | 'privacy' | 'terms' | 'disclaimer';
  language: Language;
  onNavigateHome: () => void;
}

export const SupportPages: React.FC<SupportPagesProps> = ({
  view,
  language,
  onNavigateHome,
}) => {
  const isHindi = language === 'hi';

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-10 space-y-6">
      {/* 1. ABOUT US */}
      {view === 'about' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
            <div className="p-3 bg-blue-100 text-blue-700 rounded-xl">
              <Info className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                {isHindi ? 'हमारे बारे में (About Cyber Cafe Mitra)' : 'About Cyber Cafe Mitra'}
              </h1>
              <p className="text-xs text-slate-500">
                {isHindi
                  ? 'साइबर कैफे एवं जन सेवा केंद्र संचालकों का संपूर्ण सहायक पोर्टल'
                  : 'The Comprehensive Citizen Services & Cyber Cafe Operations Hub'}
              </p>
            </div>
          </div>

          <div className="text-sm text-slate-700 leading-relaxed space-y-3">
            {isHindi ? (
              <>
                <p>
                  <strong>Cyber Cafe Mitra</strong> भारत भर के साइबर कैफे, सीएससी (CSC) और जन सेवा केंद्र (Jan Seva Kendra) संचालकों के दैनिक कार्यों को तेज, सुगम और त्रुटिहीन बनाने के उद्देश्य से विकसित किया गया एक आधुनिक वर्क पोर्टल है।
                </p>
                <p>
                  हमारा मुख्य उद्देश्य संचालक भाइयों को केंद्र एवं राज्य सरकारों (जैसे UIDAI, Income Tax PAN, UP eDistrict, Bhulekh, PM Kisan, UPPCL) की सभी आवश्यक सेवाओं के आधिकारिक लिंक्स, फोटो रिसाइजिंग टूल्स, सटीक KB कंप्रेसर, पासपोर्ट फोटो शीट मेकर और कानूनी प्रार्थना पत्र प्रारूप एक ही सुरक्षित प्लेटफॉर्म पर उपलब्ध कराना है।
                </p>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <h3 className="font-bold text-slate-900">हमारी मुख्य विशेषताएं:</h3>
                  <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
                    <li>100% प्रामाणिक आधिकारिक सरकारी पोर्टल लिंक्स (Zero fake links/buttons)।</li>
                    <li>सुरक्षित क्लाइंट-साइड फोटो व पीडीएफ टूल्स (कोई भी ग्राहक डेटा हमारे सर्वर पर स्टोर नहीं होता)।</li>
                    <li>1-क्लिक कस्टमर सेशन डेटा वाइप (Customer Privacy First)।</li>
                    <li>मानक कानूनी व प्रशासनिक प्रार्थना पत्र प्रारूप एवं AI सहायक।</li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <p>
                  <strong>Cyber Cafe Mitra</strong> is an all-in-one productivity and citizen service navigation platform built specifically for Cyber Cafe, CSC (Common Service Center), and Jan Seva Kendra operators across India.
                </p>
                <p>
                  Our mission is to simplify daily operator workflows by providing verified direct links to central and state government portals (such as UIDAI myAadhaar, NSDL PAN, UP eDistrict, Bhulekh Land Records, PM Kisan, UPPCL Electricity Bill), precision client-side photo resizers with exact KB limit compressors, instant passport photo sheet generators, standard formal legal letter templates, and AI-powered document helpers.
                </p>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <h3 className="font-bold text-slate-900">Core Highlights & Standards:</h3>
                  <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
                    <li>100% verified official government portals (.gov.in / .nic.in).</li>
                    <li>Zero-server data storage for maximum customer privacy — all photo and PDF processing happens locally in the browser.</li>
                    <li>1-Click instant Customer Session Data Wipe.</li>
                    <li>Pre-formatted legal applications for Tehsildar, Police, Electricity, and Banking departments.</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* 2. CONTACT US */}
      {view === 'contact' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
            <div className="p-3 bg-blue-100 text-blue-700 rounded-xl">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                {isHindi ? 'संपर्क करें (Contact Us)' : 'Contact Us'}
              </h1>
              <p className="text-xs text-slate-500">
                {isHindi ? 'सुझाव, सहायता या पोर्टल संबंधी प्रश्नों के लिए संपर्क करें' : 'Get in touch with the Cyber Cafe Mitra team for inquiries & support'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-700">
            <div className="space-y-3">
              <p>
                {isHindi
                  ? 'यदि आपके पास किसी नई सरकारी सेवा को जोड़ने का सुझाव है, किसी लिंक में सुधार की आवश्यकता है, या किसी टूल के संबंध में तकनीकी सहायता चाहिए, तो आप हमसे सीधे संपर्क कर सकते हैं:'
                  : 'If you have suggestions for adding new government services, need link verification updates, or require technical support for tools, feel free to reach out:'}
              </p>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <p><strong>{isHindi ? 'संस्थापक (Founder):' : 'Founder:'}</strong> Mohd Shahnawaz</p>
                <p><strong>{isHindi ? 'ईमेल (Official Email):' : 'Official Email:'}</strong> shahnawaztechsolution@gmail.com</p>
                <p><strong>{isHindi ? 'संचालक हेल्पलाइन:' : 'Operator Helpline:'}</strong> +91 98384 16560 (10:00 AM - 6:00 PM)</p>
                <p><strong>{isHindi ? 'मुख्यालय:' : 'Headquarters:'}</strong> Sirs Tola ward 12, Tambour, Sitapur, Uttar Pradesh - 261208</p>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert(isHindi ? 'संदेश भेज दिया गया है!' : 'Message sent successfully! We will get back to you soon.');
              }}
              className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs"
            >
              <h4 className="font-bold text-slate-900 text-sm">
                {isHindi ? 'त्वरित संदेश भेजें' : 'Send a Quick Message'}
              </h4>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isHindi ? 'आपका नाम' : 'Your Name'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={isHindi ? 'अपना नाम दर्ज करें' : 'Enter your name'}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isHindi ? 'ईमेल / मोबाइल नंबर' : 'Email / Mobile Number'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={isHindi ? 'ईमेल या मोबाइल' : 'Email or phone number'}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isHindi ? 'संदेश' : 'Message'}
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder={isHindi ? 'अपना सुझाव या समस्या लिखें...' : 'Type your suggestion or feedback...'}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isHindi ? 'संदेश भेजें' : 'Submit Message'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. PRIVACY POLICY */}
      {view === 'privacy' && (
        <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
            <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                {isHindi ? 'गोपनीयता नीति (Privacy Policy)' : 'Privacy Policy'}
              </h1>
              <p className="text-xs text-slate-500">Last updated: January 2026</p>
            </div>
          </div>

          {isHindi ? (
            <>
              <h3 className="font-bold text-slate-900 text-base">1. डेटा सुरक्षा एवं क्लाइंट-साइड प्रोसेसिंग</h3>
              <p>
                Cyber Cafe Mitra पोर्टल पर प्रोसेस की जाने वाली सभी तस्वीरें, हस्ताक्षर, पीडीएफ और ग्राहक जानकारी आपके ब्राउज़र के भीतर (Client-side HTML5 Canvas/JS) ही प्रोसेस होती हैं। हम आपके ग्राहकों के आधार कार्ड, फोटो या व्यक्तिगत पहचान दस्तावेजों को अपने किसी भी केंद्रीय सर्वर पर अपलोड या संग्रहीत (Store) नहीं करते हैं।
              </p>

              <h3 className="font-bold text-slate-900 text-base">2. कुकीज़ एवं तृतीय-पक्ष विज्ञापन (Google AdSense)</h3>
              <p>
                यह वेबसाइट Google AdSense जैसे तीसरे पक्ष के विज्ञापनदाताओं का उपयोग कर सकती है, जो उपयोगकर्ताओं की प्राथमिकताओं के आधार पर विज्ञापन प्रदर्शित करने हेतु गैर-व्यक्तिगत कुकीज़ का उपयोग कर सकते हैं।
              </p>

              <h3 className="font-bold text-slate-900 text-base">3. 1-क्लिक सत्र सफ़ाई (One-Click Clear Session)</h3>
              <p>
                संचालकों की सुविधा एवं ग्राहक की गोपनीयता हेतु पोर्टल पर "Clear Session" बटन उपलब्ध है, जिससे एक क्लिक में ब्राउज़र मेमोरी से ग्राहक का नाम व लोड की गई फाइलें तुरंत हटाई जा सकती हैं।
              </p>
            </>
          ) : (
            <>
              <h3 className="font-bold text-slate-900 text-base">1. Zero-Server Data Processing & Client-Side Privacy</h3>
              <p>
                All image resizing, KB compression, signature enhancement, PDF compilation, and customer forms processed on Cyber Cafe Mitra run strictly client-side inside your browser environment (HTML5 Canvas / Web APIs). We do not upload, transmit, or store your customers' Aadhaar cards, personal photos, or sensitive identity documents on any central server.
              </p>

              <h3 className="font-bold text-slate-900 text-base">2. Cookies & Advertising (Google AdSense Compliance)</h3>
              <p>
                This website may host non-intrusive advertisements served by Google AdSense and its partners. Third-party vendors may use non-personally identifiable cookies to serve ads based on user visits. Operators may configure ad preferences or opt out via standard browser cookie controls.
              </p>

              <h3 className="font-bold text-slate-900 text-base">3. One-Click Instant Session Wipe</h3>
              <p>
                To protect customer confidentiality during public cafe operations, the "Clear Session" feature instantly wipes all customer names, phone numbers, and workspace files from memory.
              </p>
            </>
          )}
        </div>
      )}

      {/* 4. TERMS & CONDITIONS */}
      {view === 'terms' && (
        <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
            <div className="p-3 bg-indigo-100 text-indigo-700 rounded-xl">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                {isHindi ? 'नियम एवं शर्तें (Terms & Conditions)' : 'Terms & Conditions'}
              </h1>
              <p className="text-xs text-slate-500">Portal Usage Terms</p>
            </div>
          </div>

          {isHindi ? (
            <>
              <p>
                Cyber Cafe Mitra पोर्टल का उपयोग करते समय आप निम्नलिखित नियमों का पालन करने के लिए सहमत होते हैं:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs text-slate-600">
                <li>यह पोर्टल केवल अधिकृत साइबर कैफे संचालकों एवं नागरिकों के कार्य को सुलभ बनाने के लिए एक निःशुल्क सूचनात्मक एवं यूटिलिटी मंच है।</li>
                <li>उपयोगकर्ता किसी भी अनधिकृत या अवैध कार्य के लिए टूल्स का उपयोग नहीं करेंगे।</li>
                <li>सरकारी पोर्टल्स पर आवेदन करते समय केवल आधिकारिक पोर्टल पर प्रदर्शित वास्तविक शुल्क ही लागू होगा।</li>
              </ul>
            </>
          ) : (
            <>
              <p>
                By using the Cyber Cafe Mitra platform, you agree to comply with the following terms:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs text-slate-600">
                <li>This portal is a free utility and informational indexing workstation created for cyber cafe operators, CSC VLEs, and citizens.</li>
                <li>Users agree not to use any photo/PDF tools for fraudulent or unlawful purposes.</li>
                <li>All government portal applications, payments, and fees are governed exclusively by the respective government department portals.</li>
              </ul>
            </>
          )}
        </div>
      )}

      {/* 5. DISCLAIMER */}
      {view === 'disclaimer' && (
        <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
            <div className="p-3 bg-amber-100 text-amber-800 rounded-xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                {isHindi ? 'आधिकारिक अस्वीकरण (Official Disclaimer)' : 'Official Disclaimer'}
              </h1>
              <p className="text-xs text-slate-500">Government Affiliation Disclaimer</p>
            </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs sm:text-sm font-semibold space-y-2">
            <p>
              ⚠️ <strong>{isHindi ? 'Cyber Cafe Mitra कोई सरकारी वेबसाइट या सरकारी विभाग नहीं है।' : 'Cyber Cafe Mitra is NOT an official government website or government agency.'}</strong>
            </p>
            <p>
              {isHindi
                ? 'यह पोर्टल केवल साइबर कैफे संचालकों की सुविधा के लिए सभी केंद्र व राज्य सरकारों के प्रामाणिक आधिकारिक पोर्टल्स (जैसे myAadhaar, NSDL PAN, UP eDistrict, Bhulekh, PM Kisan आदि) के सीधे वेब लिंक्स एक जगह एकत्र करता है।'
                : 'This portal is an independent cyber cafe productivity workstation that organizes verified direct links to official Central and State Government portals (such as UIDAI myAadhaar, NSDL PAN, UP eDistrict, Bhulekh, PM Kisan, etc.) for operator reference.'}
            </p>
            <p>
              {isHindi
                ? 'सभी सरकारी योजनाओं, प्रमाण पत्रों और सेवाओं के वास्तविक नियम, शर्तें, शुल्क और दिशा-निर्देश संबंधित सरकारी विभागों और मंत्रालयों के क्षेत्राधिकार में हैं। किसी भी सेवा के लिए हमेशा आधिकारिक सरकारी वेबसाइट (.gov.in / .nic.in) पर ही अंतिम जानकारी की पुष्टि करें।'
                : 'All rules, guidelines, eligibility criteria, and fee structures are strictly governed by the official government ministries. Always verify details on the official government portals ending in .gov.in or .nic.in.'}
            </p>
          </div>
        </div>
      )}

      {/* Back to Home Button */}
      <div className="pt-6 border-t border-slate-200">
        <button
          onClick={onNavigateHome}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-sm transition-colors"
        >
          ← {isHindi ? 'मुख्य डैशबोर्ड पर वापस जाएं' : 'Back to Home Dashboard'}
        </button>
      </div>
    </div>
  );
};
