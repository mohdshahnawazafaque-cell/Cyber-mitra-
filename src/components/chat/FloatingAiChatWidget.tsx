import { getLocalFallbackResponse } from '../../utils/localAiBot';
import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  X,
  Send,
  Minimize2,
  Maximize2,
  Copy,
  CheckCircle2,
  Volume2,
  VolumeX,
  Trash2,
} from 'lucide-react';
import { CustomerData, Language } from '../../types';

interface FloatingAiChatWidgetProps {
  language: Language;
  customer: CustomerData;
  onOpenFullChat: () => void;
}

export const FloatingAiChatWidget: React.FC<FloatingAiChatWidgetProps> = ({
  language,
  customer,
  onOpenFullChat,
}) => {
  const isHindi = language === 'hi';
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; time: string }>>([
    {
      role: 'assistant',
      text: isHindi
        ? 'नमस्ते! मैं Cyber Mitra AI हूँ। किसी भी सरकारी सेवा या दस्तावेज के नियम पूछें।'
        : 'Hi! I am Cyber Mitra AI. Ask me about any govt portal rules or document checklists.',
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = input.trim();
    if (!query || loading) return;

    const userMsg = {
      role: 'user' as const,
      text: query,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const apiKey = localStorage.getItem('gemini_api_key');
      
      let data;
      if (apiKey) {
        // Direct client-side fetch using Gemini REST API
        const systemInstruction = isHindi 
          ? 'आप Cyber Mitra AI हैं, जो सीएससी (CSC) और साइबर कैफे संचालकों के लिए एक स्मार्ट सहायक है। आप सरकारी योजनाओं, फॉर्म भरने, दस्तावेज़ों की सूची आदि की सटीक जानकारी देते हैं। हिंदी में उत्तर दें।'
          : 'You are Cyber Mitra AI, a smart assistant for CSC and Cyber Cafe operators. You provide accurate information about govt schemes, forms, and documents. Reply in English.';

        const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: query }]
              }
            ],
            systemInstruction: {
              role: 'user',
              parts: [{ text: systemInstruction }]
            }
          })
        });
        
        if (!aiResponse.ok) {
          throw new Error('API Key invalid or quota exceeded');
        }
        
        const aiData = await aiResponse.json();
        const textReply = aiData.candidates?.[0]?.content?.parts?.[0]?.text || 'Answer generated.';
        data = { reply: textReply };
      } else {
        // Fallback to backend (if running locally with Express)
        
        await new Promise(resolve => setTimeout(resolve, 600));
        data = { reply: getLocalFallbackResponse(query, isHindi) };
      }


      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: data.reply || data.text || 'Answer generated.',
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err: any) {
      const isMissingKey = err.message.includes('API Key invalid');
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: isMissingKey 
            ? (isHindi ? '⚠️ AI चैट चलाने के लिए कृपया ऊपर ⚙️ Settings में अपनी Google Gemini API Key डालें (Netlify पर यह आवश्यक है)।' : '⚠️ Please click the ⚙️ Settings icon above and add your Gemini API Key to use AI Chat on Netlify.') 
            : (isHindi ? 'सेवा से संपर्क नहीं हो सका।' : 'Service temporarily unavailable.'),
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (idx: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-slate-900 text-white rounded-full shadow-2xl hover:shadow-purple-500/25 hover:scale-105 transition-all border border-purple-400/40"
          title="Open Cyber Mitra AI Assistant"
        >
          <div className="relative">
            <Bot className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-900 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-900 rounded-full" />
          </div>
          <span className="font-bold text-xs tracking-wide">
            {isHindi ? 'Cyber Mitra AI चैट' : 'AI Assistant'}
          </span>
          <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded-full font-mono font-semibold hidden sm:inline">
            3.7
          </span>
        </button>
      )}

      {/* Floating Chat Modal Box */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[380px] h-[520px] bg-white rounded-2xl shadow-2xl border border-slate-300 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white p-3 sm:p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-purple-500/20 rounded-lg border border-purple-400/30">
                <Bot className="w-4 h-4 text-purple-200" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-white leading-tight">Cyber Mitra AI</h3>
                <div className="flex items-center gap-1 text-[10px] text-emerald-300 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Gemini 3.7 Flash
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  const currentKey = localStorage.getItem('gemini_api_key') || '';
                  const newKey = window.prompt(
                    isHindi 
                      ? 'यहाँ अपनी Google Gemini API Key डालें:' 
                      : 'Enter your Google Gemini API Key here:',
                    currentKey
                  );
                  if (newKey !== null) {
                    localStorage.setItem('gemini_api_key', newKey.trim());
                    alert(isHindi ? 'API Key सेव हो गई! अब चैट काम करेगी।' : 'API Key saved! Chat will now work.');
                  }
                }}
                title="Settings / API Key"
                className="p-1.5 hover:bg-white/20 rounded-lg text-white transition-colors"
              >
                <span className="text-[14px]">⚙️</span>
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenFullChat();
                }}
                title="Expand to Full View"
                className="p-1.5 hover:bg-white/20 rounded-lg text-white transition-colors"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close Chat"
                className="p-1.5 hover:bg-white/20 rounded-lg text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs bg-slate-50">
            {messages.map((m, idx) => {
              const isAi = m.role === 'assistant';
              return (
                <div key={idx} className={`flex gap-2 ${isAi ? 'items-start' : 'items-start flex-row-reverse'}`}>
                  <div
                    className={`w-6 h-6 rounded-lg shrink-0 flex items-center justify-center text-[10px] font-bold ${
                      isAi ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'
                    }`}
                  >
                    {isAi ? 'AI' : 'U'}
                  </div>
                  <div
                    className={`max-w-[85%] rounded-xl p-2.5 shadow-2xs ${
                      isAi
                        ? 'bg-white border border-slate-200 text-slate-800'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    <div className="text-[11px] whitespace-pre-wrap leading-relaxed">
                      {m.text}
                    </div>
                    {isAi && (
                      <div className="mt-1.5 pt-1 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-400">
                        <span>{m.time}</span>
                        <button
                          onClick={() => handleCopy(idx, m.text)}
                          className="hover:text-slate-700 flex items-center gap-0.5"
                        >
                          {copiedIdx === idx ? (
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-2.5 h-2.5" />
                          )}
                          <span>{copiedIdx === idx ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex gap-2 items-start">
                <div className="w-6 h-6 rounded-lg shrink-0 bg-purple-600 text-white flex items-center justify-center text-[10px] animate-spin">
                  ⚡
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-2.5 text-[11px] text-purple-700 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 animate-spin" />
                  <span>{isHindi ? 'सोच रहा है...' : 'Thinking...'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick suggestions */}
          <div className="p-2 bg-slate-100 border-t border-slate-200 flex gap-1 overflow-x-auto scrollbar-none text-[10px]">
            <button
              onClick={() => {
                setInput(isHindi ? 'आय प्रमाण पत्र के दस्तावेज' : 'Income certificate docs');
              }}
              className="shrink-0 bg-white border border-slate-300 px-2 py-0.5 rounded-full text-slate-700 hover:border-purple-500"
            >
              📋 {isHindi ? 'आय दस्तावेज' : 'Income Docs'}
            </button>
            <button
              onClick={() => {
                setInput(isHindi ? 'पैन कार्ड 93 vs CSF' : 'PAN 93 vs CSF rules');
              }}
              className="shrink-0 bg-white border border-slate-300 px-2 py-0.5 rounded-full text-slate-700 hover:border-purple-500"
            >
              💳 {isHindi ? 'पैन सुधार' : 'PAN Correction'}
            </button>
            <button
              onClick={() => {
                setInput(isHindi ? 'SDM को प्रार्थना पत्र' : 'Draft SDM letter');
              }}
              className="shrink-0 bg-white border border-slate-300 px-2 py-0.5 rounded-full text-slate-700 hover:border-purple-500"
            >
              ✍️ {isHindi ? 'पत्र लिखें' : 'Draft application'}
            </button>
          </div>

          {/* Composer Input */}
          <form onSubmit={handleSend} className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-1.5">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isHindi ? 'प्रश्न पूछें...' : 'Ask question...'}
              className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white rounded-lg transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
