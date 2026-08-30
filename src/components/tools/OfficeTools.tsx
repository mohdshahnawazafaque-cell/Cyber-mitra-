import React, { useState } from 'react';
import {
  BookOpen,
  Keyboard,
  FileSpreadsheet,
  FileText,
  Printer,
  Copy,
  CheckCircle2,
} from 'lucide-react';
import { Language } from '../../types';

interface OfficeToolsProps {
  initialTab?: "typing" | "pagesetup" | "scanner" | "shortcuts" | "utility";
  language: Language;
}

export const OfficeTools: React.FC<OfficeToolsProps> = ({ language, initialTab = "typing" }) => {
  const isHindi = language === 'hi';
  const [activeTab, setActiveTab] = useState<'typing' | 'pagesetup' | 'scanner' | 'shortcuts' | 'utility'>(initialTab);
  const [utilityText, setUtilityText] = useState<string>("");
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  };

  const krutiDevCodes = [
    { char: 'क्ष', code: 'Alt + 0216 / Shift + K' },
    { char: 'त्र', code: 'Alt + 0217 / Shift + 6' },
    { char: 'ज्ञ', code: 'Alt + 0218 / Shift + %' },
    { char: 'श्र', code: 'Alt + 0219 / Shift + Z' },
    { char: 'कृ', code: 'd + Shift + +' },
    { char: 'हृ', code: 'Alt + 0227' },
    { char: 'द्य', code: 'Alt + 0228' },
    { char: 'द्व', code: 'Alt + 0229' },
    { char: 'द्भ', code: 'Alt + 0230' },
    { char: 'ड़', code: 'Alt + 0241' },
    { char: 'ढ़', code: 'Alt + 0242' },
    { char: '?', code: 'Shift + /' },
    { char: '!', code: 'Shift + 1' },
    { char: '(', code: 'Shift + 9' },
    { char: ')', code: 'Shift + 0' },
    { char: 'रू', code: 'Shift + 4' },
  ];

  return (
    <div className="space-y-6">
      {notification && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-700 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-sm font-semibold animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <BookOpen className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800">
              {isHindi ? 'साइबर कैफे ऑफिस संदर्भ टूल्स' : 'Cyber Cafe Office Reference Tools'}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isHindi
              ? 'हिंदी टाइपिंग (मङ्गल/कृति देव) कोड, एमएस वर्ड पेज सेटअप नियम, स्कैनर DPI गाइड और शॉर्टकट्स।'
              : 'Hindi typing cheat sheets, MS Word page setup rules, scanner DPI chart, and essential shortcuts.'}
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl flex-wrap">
          <button
            onClick={() => setActiveTab('typing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'typing' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ⌨️ {isHindi ? 'हिंदी टाइपिंग कोड' : 'Hindi Typing'}
          </button>
          <button
            onClick={() => setActiveTab('pagesetup')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'pagesetup' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📄 {isHindi ? 'वर्ड पेज सेटअप' : 'Word Setup'}
          </button>
          <button
            onClick={() => setActiveTab('scanner')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'scanner' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🖨️ {isHindi ? 'स्कैनर DPI गाइड' : 'Scanner DPI'}
          </button>
          <button
            onClick={() => setActiveTab('shortcuts')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'shortcuts' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ⚡ {isHindi ? 'शॉर्टकट कीज़' : 'Shortcuts'}
          </button>
          <button
            onClick={() => setActiveTab('utility')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'utility' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🛠️ {isHindi ? 'टेक्स्ट टूल्स' : 'Text Tools'}
          </button>
        </div>
      </div>

      {/* 1. HINDI TYPING CODES */}
      {activeTab === 'typing' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-800 mb-3 flex items-center justify-between">
              <span>{isHindi ? 'कृति देव (Kruti Dev 010) महत्वपूर्ण Alt कोड' : 'Kruti Dev 010 Alt Codes'}</span>
              <span className="text-xs bg-amber-50 text-amber-800 px-2 py-0.5 rounded font-bold border border-amber-200">
                100% सटीक
              </span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {krutiDevCodes.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    navigator.clipboard.writeText(item.code);
                    showToast(`${item.char} -> ${item.code} copied!`);
                  }}
                  className="p-3 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-xl cursor-pointer transition-all flex items-center justify-between group"
                >
                  <span className="font-extrabold text-lg text-slate-800 group-hover:text-amber-700">
                    {item.char}
                  </span>
                  <span className="text-xs font-mono text-slate-500 group-hover:text-amber-900 font-semibold">
                    {item.code}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. MS WORD PAGE SETUP */}
      {activeTab === 'pagesetup' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="font-extrabold text-base text-slate-800">
              📄 {isHindi ? 'प्रार्थना पत्र / एफिडेविट (A4 & Legal)' : 'Affidavit & Letter Setup'}
            </h3>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="p-2.5 bg-slate-50 rounded-lg">
                <span className="font-bold block text-slate-900">कागज़ साइज (Paper Size):</span>
                A4 (210 × 297 mm) या Legal (8.5 × 14 in)
              </li>
              <li className="p-2.5 bg-slate-50 rounded-lg">
                <span className="font-bold block text-slate-900">मार्जिन (Margins):</span>
                Top: 1.0", Bottom: 1.0", Left: 1.25" (बाइंडिंग स्पेस हेतु), Right: 0.75"
              </li>
              <li className="p-2.5 bg-slate-50 rounded-lg">
                <span className="font-bold block text-slate-900">फॉन्ट साइज (Font Size):</span>
                हिंदी कृति देव: 14pt | मङ्गल (Unicode): 12pt | Line Spacing: 1.15
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="font-extrabold text-base text-slate-800">
              🏷️ {isHindi ? 'प्रमाण पत्र एवं रसीद प्रिंट' : 'Receipt & Certificate Print'}
            </h3>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="p-2.5 bg-slate-50 rounded-lg">
                <span className="font-bold block text-slate-900">ई-डिस्ट्रिक्ट प्रमाण पत्र:</span>
                Scale: 100% (Fit to Printable Area), Orientation: Portrait
              </li>
              <li className="p-2.5 bg-slate-50 rounded-lg">
                <span className="font-bold block text-slate-900">खतौनी / भूलेख प्रिंट:</span>
                Orientation: Landscape, Scale: 90% ताकि दोनों पेज एक शीट में आएं
              </li>
              <li className="p-2.5 bg-slate-50 rounded-lg">
                <span className="font-bold block text-slate-900">बिजली बिल रसीद:</span>
                Scale: 100%, 2 Copies per A4 Sheet (Landscape 2-Up)
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* 3. SCANNER DPI GUIDELINES */}
      {activeTab === 'scanner' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <h3 className="font-extrabold text-base text-slate-800 mb-4">
            🖨️ {isHindi ? 'सरकारी पोर्टल अनुसार सही स्कैनर DPI सेटिंग्स' : 'Official Scanner DPI Chart'}
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-800 uppercase font-bold">
                <tr>
                  <th className="p-3">दस्तावेज प्रकार</th>
                  <th className="p-3">अनुशंसित DPI</th>
                  <th className="p-3">रंग मोड (Color)</th>
                  <th className="p-3">लक्षित साइज (Target Size)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="p-3 font-bold">पासपोर्ट साइज फोटो</td>
                  <td className="p-3 text-blue-700 font-bold">300 DPI</td>
                  <td className="p-3">24-bit Color</td>
                  <td className="p-3 font-semibold text-emerald-700">20 KB - 50 KB</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">हस्ताक्षर (Signature)</td>
                  <td className="p-3 text-blue-700 font-bold">200 DPI</td>
                  <td className="p-3">Grayscale / B&W</td>
                  <td className="p-3 font-semibold text-emerald-700">10 KB - 20 KB</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">आय/जाति/निवास स्वप्रमाणित घोषणा</td>
                  <td className="p-3 text-blue-700 font-bold">100 - 150 DPI</td>
                  <td className="p-3">Grayscale</td>
                  <td className="p-3 font-semibold text-emerald-700">≤ 100 KB</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">मार्कशीट / खतौनी / राशन कार्ड</td>
                  <td className="p-3 text-blue-700 font-bold">150 - 200 DPI</td>
                  <td className="p-3">Color / Grayscale</td>
                  <td className="p-3 font-semibold text-emerald-700">100 KB - 300 KB (PDF)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. SHORTCUTS */}
      {activeTab === 'shortcuts' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <h4 className="font-bold text-sm text-slate-800 mb-2">🌐 Browser (Chrome/Edge)</h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li><kbd className="font-mono bg-slate-100 px-1.5 py-0.5 rounded border">Ctrl + P</kbd> प्रिंट डायलॉग</li>
              <li><kbd className="font-mono bg-slate-100 px-1.5 py-0.5 rounded border">Ctrl + Shift + T</kbd> बंद टैब दोबारा खोलें</li>
              <li><kbd className="font-mono bg-slate-100 px-1.5 py-0.5 rounded border">Ctrl + Shift + N</kbd> इनकॉग्निटो विंडो</li>
              <li><kbd className="font-mono bg-slate-100 px-1.5 py-0.5 rounded border">Ctrl + F5</kbd> हार्ड रिफ्रेश / कैश क्लियर</li>
            </ul>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <h4 className="font-bold text-sm text-slate-800 mb-2">📝 MS Word / Office</h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li><kbd className="font-mono bg-slate-100 px-1.5 py-0.5 rounded border">Ctrl + J</kbd> जस्टिफाई (दोनों तरफ बराबर)</li>
              <li><kbd className="font-mono bg-slate-100 px-1.5 py-0.5 rounded border">Ctrl + E</kbd> सेंटर टेक्स्ट</li>
              <li><kbd className="font-mono bg-slate-100 px-1.5 py-0.5 rounded border">Ctrl + [ / ]</kbd> फॉन्ट साइज घटाएं/बढ़ाएं</li>
              <li><kbd className="font-mono bg-slate-100 px-1.5 py-0.5 rounded border">Shift + F3</kbd> केस बदलें (Capital/Small)</li>
            </ul>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <h4 className="font-bold text-sm text-slate-800 mb-2">🎨 MS Paint & Image</h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li><kbd className="font-mono bg-slate-100 px-1.5 py-0.5 rounded border">Ctrl + W</kbd> रिसाइज व स्क्यू बॉक्स</li>
              <li><kbd className="font-mono bg-slate-100 px-1.5 py-0.5 rounded border">Ctrl + Shift + X</kbd> क्रॉप सिलेक्टेड एरिया</li>
              <li><kbd className="font-mono bg-slate-100 px-1.5 py-0.5 rounded border">Ctrl + R</kbd> रूलर चालू/बंद</li>
            </ul>
          </div>
        </div>
      )}

      {/* 5. TEXT UTILITIES */}
      {activeTab === 'utility' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-800 mb-3">
              {isHindi ? 'वर्ड / कैरेक्टर काउंटर व कनवर्टर' : 'Word / Character Counter & Case Converter'}
            </h3>
            <textarea
              value={utilityText}
              onChange={(e) => setUtilityText(e.target.value)}
              placeholder={isHindi ? "यहाँ अपना टेक्स्ट टाइप करें या पेस्ट करें..." : "Type or paste your text here..."}
              className="w-full h-40 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4 resize-y text-sm"
            />
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
                <p className="text-xs text-slate-500 font-semibold mb-1">{isHindi ? 'शब्द (Words)' : 'Words'}</p>
                <p className="text-2xl font-black text-slate-800">{utilityText.trim() ? utilityText.trim().split(/\s+/).length : 0}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
                <p className="text-xs text-slate-500 font-semibold mb-1">{isHindi ? 'अक्षर (Characters)' : 'Characters'}</p>
                <p className="text-2xl font-black text-slate-800">{utilityText.length}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
                <p className="text-xs text-slate-500 font-semibold mb-1">{isHindi ? 'बिना स्पेस के' : 'Chars (No Space)'}</p>
                <p className="text-2xl font-black text-slate-800">{utilityText.replace(/\s/g, '').length}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
                <p className="text-xs text-slate-500 font-semibold mb-1">{isHindi ? 'पैराग्राफ' : 'Paragraphs'}</p>
                <p className="text-2xl font-black text-slate-800">{utilityText.trim() ? utilityText.split(/\n+/).filter(p => p.trim().length > 0).length : 0}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setUtilityText(utilityText.toUpperCase())}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-lg border border-blue-200 transition-colors"
              >
                UPPERCASE
              </button>
              <button 
                onClick={() => setUtilityText(utilityText.toLowerCase())}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-lg border border-blue-200 transition-colors"
              >
                lowercase
              </button>
              <button 
                onClick={() => {
                  const titleCase = utilityText.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                  setUtilityText(titleCase);
                }}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-lg border border-blue-200 transition-colors"
              >
                Title Case
              </button>
              <button 
                onClick={() => setUtilityText(utilityText.replace(/\s+/g, ' ').trim())}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg border border-slate-300 transition-colors"
              >
                {isHindi ? 'एक्स्ट्रा स्पेस हटाएं' : 'Remove Extra Spaces'}
              </button>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(utilityText);
                  showToast(isHindi ? 'टेक्स्ट कॉपी हो गया!' : 'Text copied to clipboard!');
                }}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-lg border border-emerald-200 transition-colors ml-auto flex items-center gap-1"
              >
                <Copy className="w-3 h-3" /> {isHindi ? 'कॉपी करें' : 'Copy Text'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
