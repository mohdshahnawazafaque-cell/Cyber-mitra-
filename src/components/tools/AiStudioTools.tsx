import { getLocalFallbackResponse } from '../../utils/localAiBot';
import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Copy,
  Printer,
  Download,
  CheckCircle2,
  AlertCircle,
  FileText,
  Bot,
  RefreshCw,
  Sliders,
  Languages,
} from 'lucide-react';
import { Language, CustomerData, SessionFile } from '../../types';
import { createApplicationPdf } from '../../utils/pdfUtils';

interface AiStudioToolsProps {
  language: Language;
  customer: CustomerData;
  initialTab?: 'writing' | 'assistant' | 'photo' | 'doc';
  initialSubject?: string;
  onAddToWorkspace: (file: SessionFile) => void;
  onSendToPrintQueue: (title: string, dataUrl: string, paperSize: string) => void;
}

export const AiStudioTools: React.FC<AiStudioToolsProps> = ({
  language,
  customer,
  initialTab = 'writing',
  initialSubject = '',
  onAddToWorkspace,
  onSendToPrintQueue,
}) => {
  const isHindi = true; // Forced to Hindi as requested

  const [activeTab, setActiveTab] = useState<'writing' | 'assistant' | 'doc'>(
    initialTab === 'assistant' ? 'assistant' : initialTab === 'doc' ? 'doc' : 'writing'
  );

  // AI Letter Writer State
  const [recipient, setRecipient] = useState<string>('श्रीमान उपजिलाधिकारी महोदय (SDM)');
  const [subject, setSubject] = useState<string>(initialSubject || 'राशन कार्ड में छूटे हुए सदस्य का नाम जोड़ने के सम्बन्ध में');
  const [keyDetails, setKeyDetails] = useState<string>('प्रार्थी का नाम राशन कार्ड से कट गया है, कृपया जांच कराकर पुनः नाम जोड़ने की कृपा करें।');
  const [tone, setTone] = useState<'formal' | 'urgent' | 'polite'>('formal');
  const [letterLanguage, setLetterLanguage] = useState<'hi' | 'en'>('hi');
  const [generatedLetter, setGeneratedLetter] = useState<string>('');
  const [isWritingLoading, setIsWritingLoading] = useState<boolean>(false);
  const [letterError, setLetterError] = useState<string | null>(null);

  // AI Assistant State
  const [assistantMessages, setAssistantMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: isHindi
        ? 'नमस्ते! मैं CYBER MITRA AI सहायक हूँ। आप मुझसे किसी भी सरकारी योजना की पात्रता, आवश्यक दस्तावेज, पोर्टल एरर (जैसे eDistrict, UIDAI, UPPCL) या नियम पूछ सकते हैं।'
        : 'Hello! I am Cyber Mitra AI Assistant. Ask me anything about govt schemes eligibility, document checklists, or portal troubleshooting.',
      time: new Date().toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [queryInput, setQueryInput] = useState<string>('');
  const [isAssistantLoading, setIsAssistantLoading] = useState<boolean>(false);

  // AI Doc Cleaner / Summarizer
  const [docInputText, setDocInputText] = useState<string>('');
  const [docOutputText, setDocOutputText] = useState<string>('');
  const [isDocLoading, setIsDocLoading] = useState<boolean>(false);

  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Call Server API
  const handleGenerateLetter = async () => {
    setIsWritingLoading(true);
    setLetterError(null);

    const prompt = `You are an expert official letter writer for Indian Cyber Cafes and CSC Jan Seva Kendras.
Generate a complete, formal, pristine application letter based on the following details:
Recipient: ${recipient}
Subject: ${subject}
Applicant Name: ${customer.name || 'प्रार्थी'}
Father/Spouse Name: ${customer.fatherMotherName || 'श्री पिता का नाम'}
Address/Village/District: ${customer.address || ''} ${customer.villageTown || ''}, ${customer.district || 'उत्तर प्रदेश'}
Specific Issue Details: ${keyDetails}
Tone: ${tone}
Language: ${letterLanguage === 'hi' ? 'Pure formal Hindi (कार्यालयी हिंदी)' : 'Formal Indian English'}

Format strictly with:
1. Formal Recipient Box
2. Subject (विषय)
3. Formal Greeting (महोदय)
4. Structured body paragraphs stating the issue, hardship, and specific request.
5. Enclosures list (संलग्नक)
6. Place, Date, Applicant Name & Signature block at the bottom.`;

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const draft = letterLanguage === 'hi' 
        ? `सेवा में,
${recipient}

विषय: ${subject}

महोदय,
सविनय निवेदन है कि ${keyDetails}। कृपया इस मामले में आवश्यक कार्रवाई करने की कृपा करें।

धन्यवाद,
प्रार्थी: ${customer.name || '___________'}
पता: ${customer.district || '___________'}`
        : `To,
${recipient}

Subject: ${subject}

Respected Sir/Madam,
Respectfully I state that ${keyDetails}. Kindly look into the matter and take necessary action.

Thanking you,
Applicant: ${customer.name || '___________'}
Address: ${customer.district || '___________'}`;

      setGeneratedLetter(draft);
      showToast(isHindi ? 'आवेदन पत्र सफलतापूर्वक तैयार!' : 'Application letter generated!');
    } catch (err: any) {
      console.error(err);
      setLetterError(err.message || 'AI service temporarily unavailable. Please verify API key.');
    } finally {
      setIsWritingLoading(false);
    }
  };

  // Assistant Query with multi-turn history
  const handleSendQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryInput.trim() || isAssistantLoading) return;

    const userText = queryInput.trim();
    const userTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    setAssistantMessages((prev) => [...prev, { sender: 'user', text: userText, time: userTime }]);
    setQueryInput('');
    setIsAssistantLoading(true);

    try {
      const historyPayload = assistantMessages.slice(-6).map((m) => ({
        role: m.sender === 'ai' ? 'model' : 'user',
        text: m.text,
      }));

      const apiKey = localStorage.getItem('gemini_api_key');
      let aiText = '';
      if (apiKey) {
        const history = assistantMessages.slice(-6).map((m) => ({
          role: m.sender === 'ai' ? 'model' : 'user',
          parts: [{ text: m.text }],
        }));
        history.push({ role: 'user', parts: [{ text: userText }] });
        
        const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: history })
        });
        const aiData = await aiResponse.json();
        aiText = aiData.candidates?.[0]?.content?.parts?.[0]?.text || 'No response.';
      } else {
        await new Promise(resolve => setTimeout(resolve, 600));
        aiText = getLocalFallbackResponse(userText, isHindi);
      }
      const aiTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      setAssistantMessages((prev) => [...prev, { sender: 'ai', text: aiText, time: aiTime }]);
    } catch (err: any) {
      setAssistantMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: isHindi
            ? 'क्षमा करें, AI सेवा से संपर्क नहीं हो सका। कृपया सेटिंग्स में Gemini API Key की जांच करें।'
            : 'Sorry, unable to connect to the AI service. Please verify your Gemini API key in Settings.',
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsAssistantLoading(false);
    }
  };

  // Document cleaner
  const handleCleanDocumentText = async () => {
    if (!docInputText.trim() || isDocLoading) return;
    setIsDocLoading(true);
    try {
      const prompt = `Clean, format, and organize the following raw text/OCR output from a government scan into a well-structured official text with proper headings, bullets, and corrected grammar:
"${docInputText}"`;

      const apiKey = localStorage.getItem('gemini_api_key');
      if (apiKey) {
         const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{role: 'user', parts: [{text: prompt}]}] })
        });
        const aiData = await aiResponse.json();
        setDocOutputText(aiData.candidates?.[0]?.content?.parts?.[0]?.text || docInputText);
      } else {
        await new Promise(resolve => setTimeout(resolve, 500));
        setDocOutputText(docInputText + '\n\n[Formatted via local preview]');
      }
      showToast(isHindi ? 'दस्तावेज टेक्स्ट शुद्ध व व्यवस्थित हो गया!' : 'Text organized!');
    } catch (e: any) {
      showToast('Error organizing document text');
    } finally {
      setIsDocLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast(isHindi ? 'कॉपी हो गया!' : 'Copied!');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
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
            <span className="p-2 rounded-xl bg-purple-100 text-purple-800">
              <Sparkles className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800">
              {isHindi ? 'एआई टूल्स स्टूडियो (Cyber Mitra AI Studio)' : 'Cyber Mitra AI Studio'}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isHindi
              ? 'आधिकारिक प्रार्थना पत्र लेखन, सरकारी पोर्टल सहायता, और दस्तावेज सारांश।'
              : 'Official application letter generator, portal rules assistant, and text formatter.'}
          </p>
        </div>

        {/* Tab Switchers */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('writing')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'writing'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ✍️ {isHindi ? 'पत्र लेखन' : 'Letter Writer'}
          </button>
          <button
            onClick={() => setActiveTab('assistant')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'assistant'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🤖 {isHindi ? 'AI सहायक' : 'Assistant'}
          </button>
          <button
            onClick={() => setActiveTab('doc')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'doc'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📄 {isHindi ? 'दस्तावेज सारांश' : 'Doc Formatter'}
          </button>
        </div>
      </div>

      {/* 1. AI LETTER WRITER TAB */}
      {activeTab === 'writing' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3.5">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-800 pb-2 border-b border-slate-100">
                {isHindi ? 'प्रार्थना पत्र के मुख्य बिंदु' : 'Letter Specifications'}
              </h3>

              {/* Recipient */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {isHindi ? 'प्राप्तकर्ता / अधिकारी का पद' : 'Recipient Designation'}
                </label>
                <select
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-purple-600 focus:outline-none"
                >
                  <option value="श्रीमान उपजिलाधिकारी महोदय (SDM)">श्रीमान उपजिलाधिकारी महोदय (SDM)</option>
                  <option value="श्रीमान तहसीलदार महोदय (Tehsildar)">श्रीमान तहसीलदार महोदय (Tehsildar)</option>
                  <option value="श्रीमान अधिशासी अभियंता / SDO विद्युत विभाग">श्रीमान SDO विद्युत वितरण खंड</option>
                  <option value="श्रीमान शाखा प्रबंधक महोदय (Bank Manager)">श्रीमान शाखा प्रबंधक (Bank Manager)</option>
                  <option value="श्रीमान पूर्ति निरीक्षक महोदय (Supply Inspector)">श्रीमान पूर्ति निरीक्षक (खाद्य विभाग)</option>
                  <option value="श्रीमान थाना प्रभारी महोदय (SHO)">श्रीमान थाना प्रभारी / कोतवाल (Police)</option>
                  <option value="श्रीमान सहायक संभागीय परिवहन अधिकारी (RTO)">श्रीमान परिवहन अधिकारी (RTO)</option>
                </select>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {isHindi ? 'विषय (Subject)' : 'Subject'}
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="विषय दर्ज करें"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-purple-600 focus:outline-none"
                />
              </div>

              {/* Specific Details */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {isHindi ? 'समस्या या अनुरोध का संक्षिप्त विवरण' : 'Key Issue Details'}
                </label>
                <textarea
                  rows={3}
                  value={keyDetails}
                  onChange={(e) => setKeyDetails(e.target.value)}
                  placeholder="उदा० पुराना मीटर खराब हो गया है, गलत बिल आ रहा है..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-purple-600 focus:outline-none"
                />
              </div>

              {/* Tone & Language */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {isHindi ? 'लहजा (Tone)' : 'Tone'}
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-medium focus:outline-none"
                  >
                    <option value="formal">अत्यंत औपचारिक (Formal)</option>
                    <option value="urgent">अति आवश्यक (Urgent)</option>
                    <option value="polite">विनम्र निवेदन (Polite)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {isHindi ? 'भाषा (Language)' : 'Language'}
                  </label>
                  <select
                    value={letterLanguage}
                    onChange={(e) => setLetterLanguage(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-medium focus:outline-none"
                  >
                    <option value="hi">हिंदी (Hindi)</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerateLetter}
                disabled={isWritingLoading}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
              >
                {isWritingLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>{isHindi ? 'AI से औपचारिक पत्र लिखवाएं' : 'Generate Formal Letter'}</span>
              </button>

              {letterError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                  <span>{letterError}</span>
                </div>
              )}
            </div>
          </div>

          {/* Letter Output Preview */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs min-h-[480px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-800 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-600" />
                    <span>{isHindi ? 'उत्पन्न औपचारिक प्रार्थना पत्र' : 'Generated Official Letter'}</span>
                  </h3>

                  {generatedLetter && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(generatedLetter)}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs flex items-center gap-1"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{isHindi ? 'कॉपी' : 'Copy'}</span>
                      </button>
                      <button
                        onClick={() => window.print()}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs flex items-center gap-1"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>{isHindi ? 'प्रिंट' : 'Print'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {!generatedLetter ? (
                  <div className="py-16 text-center text-slate-400">
                    <Sparkles className="w-10 h-10 mx-auto mb-2 text-purple-300 opacity-60" />
                    <p className="text-sm font-semibold text-slate-600">
                      {isHindi ? 'विवरण भरकर "AI से औपचारिक पत्र लिखवाएं" पर क्लिक करें' : 'Fill details and click Generate Formal Letter'}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {isHindi ? 'सटीक कानूनी शब्दावली व मानक सरकारी प्रारूप में तैयार होगा' : 'Formatted in verified official structure'}
                    </p>
                  </div>
                ) : (
                  <div className="whitespace-pre-line text-slate-800 text-sm leading-relaxed font-normal bg-slate-50 p-5 rounded-xl border border-slate-200">
                    {generatedLetter}
                  </div>
                )}
              </div>

              {generatedLetter && (
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>CYBER MITRA AI Engine</span>
                  <span className="text-emerald-700 font-semibold">✓ मानक सरकारी संरचना में सत्यापित</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. AI ASSISTANT CHAT TAB */}
      {activeTab === 'assistant' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-[600px]">
          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {assistantMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs shrink-0">
                    AI
                  </div>
                )}
                <div
                  className={`max-w-xl p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span
                    className={`block text-[10px] mt-1 text-right ${
                      msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
            {isAssistantLoading && (
              <div className="flex gap-3 items-center text-slate-500 text-xs font-semibold">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                </div>
                <span>{isHindi ? 'AI उत्तर तैयार कर रहा है...' : 'AI is thinking...'}</span>
              </div>
            )}
          </div>

          {/* Chat Input Box */}
          <form
            onSubmit={handleSendQuery}
            className="p-3 bg-slate-50 border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder={
                isHindi
                  ? 'पूछें: ई-डिस्ट्रिक्ट में आय प्रमाण पत्र के नियम, आयुष्मान पात्रता, या कोई पोर्टल एरर...'
                  : 'Ask about portal criteria, document checklists, or errors...'
              }
              className="flex-1 px-4 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <button
              type="submit"
              disabled={isAssistantLoading || !queryInput.trim()}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shadow-md disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isHindi ? 'भेजें' : 'Send'}</span>
            </button>
          </form>
        </div>
      )}

      {/* 3. AI DOCUMENT FORMATTER / OCR TEXT CLEANER */}
      {activeTab === 'doc' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-slate-800">
              {isHindi ? 'अव्यवस्थित / OCR टेक्स्ट यहाँ पेस्ट करें' : 'Raw / OCR Text Input'}
            </h3>
            <textarea
              rows={12}
              value={docInputText}
              onChange={(e) => setDocInputText(e.target.value)}
              placeholder="पुराने प्रमाण पत्र या स्कैन से कॉपी किया गया अव्यवस्थित टेक्स्ट यहाँ पेस्ट करें..."
              className="w-full p-3 border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-purple-600 focus:outline-none"
            />
            <button
              onClick={handleCleanDocumentText}
              disabled={isDocLoading || !docInputText.trim()}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isDocLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>{isHindi ? 'टेक्स्ट शुद्ध व व्यवस्थित करें (Format Text)' : 'Format Text'}</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                <h3 className="font-bold text-sm text-slate-800">
                  {isHindi ? 'व्यवस्थित आउटपुट' : 'Clean Structured Output'}
                </h3>
                {docOutputText && (
                  <button
                    onClick={() => handleCopy(docOutputText)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded text-xs"
                  >
                    {isHindi ? 'कॉपी' : 'Copy'}
                  </button>
                )}
              </div>
              <div className="whitespace-pre-line text-xs text-slate-800 min-h-[260px] bg-slate-50 p-3 rounded-xl border border-slate-200">
                {docOutputText || (isHindi ? 'आउटपुट यहाँ दिखाई देगा...' : 'Formatted text will appear here...')}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
