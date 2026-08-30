import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  User,
  Copy,
  Printer,
  FileText,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Trash2,
  Download,
  RotateCcw,
  CheckCircle2,
  Zap,
  ArrowRight,
  ShieldCheck,
  Building,
  HelpCircle,
  Clock,
} from 'lucide-react';
import { CustomerData, Language, SessionFile } from '../../types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  modelBadge?: string;
}

interface AiChatProps {
  language: Language;
  customer: CustomerData;
  onNavigateToBuilder?: (presetSubject: string) => void;
  onSendToPrintQueue?: (title: string, dataUrl: string, paperSize: string) => void;
  onAddToWorkspace?: (file: SessionFile) => void;
}

const QUICK_PROMPTS_EN = [
  {
    title: 'Income Certificate',
    desc: 'Required documents & eligibility',
    prompt: 'What are the required documents and step-by-step procedure for applying for an Income Certificate (आय प्रमाण पत्र)?',
    icon: '📋',
  },
  {
    title: 'Caste Certificate',
    desc: 'OBC / SC / ST document rules',
    prompt: 'What documents are required for a Caste Certificate (जाति प्रमाण पत्र) for OBC and SC applicants, and what are the rules for married women?',
    icon: '📑',
  },
  {
    title: 'PAN Card 49A vs CSF',
    desc: 'New PAN vs correction guide',
    prompt: 'Explain the difference between PAN Form 49A and CSF Correction form, along with required photo and signature dimensions.',
    icon: '💳',
  },
  {
    title: 'SDM Formal Application',
    desc: 'Draft letter for land / records',
    prompt: 'Please draft a formal official application to the Sub-Divisional Magistrate (SDM) requesting correction in revenue land records (खतौनी में नाम सुधार).',
    icon: '✍️',
  },
  {
    title: 'Electricity Meter Dispute',
    desc: 'UPPCL wrong billing letter',
    prompt: 'Draft a formal application to the Electricity Executive Engineer (SDO) regarding an inflated electricity bill and faulty meter inspection.',
    icon: '⚡',
  },
  {
    title: 'PM Kisan eKYC Troubleshoot',
    desc: 'Biometric & OTP solution',
    prompt: 'How to troubleshoot PM Kisan eKYC biometric mismatch and Aadhaar mobile OTP failure for a farmer?',
    icon: '🌾',
  },
  {
    title: 'Exam Photo & Signature',
    desc: 'SSC / Police recruitment specs',
    prompt: 'What are the standard photo and signature dimensions, KB file size limits, and background requirements for government recruitment forms (SSC / UP Police)?',
    icon: '🖼️',
  },
  {
    title: 'Ration Card Member Add',
    desc: 'New born / bride name add',
    prompt: 'What is the complete process and required document list for adding a new family member (wife/child) to an existing Ration Card (पात्र गृहस्थी)?',
    icon: '🍚',
  },
];

const QUICK_PROMPTS_HI = [
  {
    title: 'आय प्रमाण पत्र दस्तावेज',
    desc: 'आवश्यक दस्तावेज व नियम',
    prompt: 'आय प्रमाण पत्र (Income Certificate) ऑनलाइन आवेदन के लिए कौन-कौन से दस्तावेज अनिवार्य हैं और कितनी समय सीमा होती है?',
    icon: '📋',
  },
  {
    title: 'जाति प्रमाण पत्र नियम',
    desc: 'OBC / SC / ST साक्ष्य',
    prompt: 'जाति प्रमाण पत्र हेतु पिता पक्ष के कौन से साक्ष्य मान्य हैं? विवाहित महिलाओं के लिए क्या नियम हैं?',
    icon: '📑',
  },
  {
    title: 'पैन कार्ड सुधार प्रक्रिया',
    desc: 'PAN CSF फॉर्म व फोटो साइज',
    prompt: 'पैन कार्ड में नाम या जन्मतिथि सुधार (PAN Correction CSF) के लिए क्या दस्तावेज लगेंगे और फोटो-हस्ताक्षर साइज क्या होना चाहिए?',
    icon: '💳',
  },
  {
    title: 'SDM को प्रार्थना पत्र',
    desc: 'खतौनी / जमीन नाम सुधार',
    prompt: 'श्रीमान उपजिलाधिकारी (SDM) महोदय को खतौनी में नाम सुधारने हेतु एक औपचारिक प्रार्थना पत्र तैयार करें।',
    icon: '✍️',
  },
  {
    title: 'बिजली बिल सुधार पत्र',
    desc: 'SDO विद्युत विभाग आवेदन',
    prompt: 'विद्युत वितरण खंड के SDO महोदय को मीटर जांच एवं अत्यधिक गलत बिजली बिल सुधारने हेतु प्रार्थना पत्र लिखें।',
    icon: '⚡',
  },
  {
    title: 'PM किसान eKYC समाधान',
    desc: 'बायोमेट्रिक एरर फिक्स',
    prompt: 'PM किसान सम्मान निधि में eKYC न होने पर या बायोमेट्रिक मिसमैच होने पर ऑपरेटर को क्या कदम उठाने चाहिए?',
    icon: '🌾',
  },
  {
    title: 'भर्ती फोटो-हस्ताक्षर नियम',
    desc: 'SSC / पुलिस भर्ती साइज',
    prompt: 'सरकारी भर्ती फॉर्म (जैसे SSC, UP Police) में फोटो व हस्ताक्षर के सटीक KB, DPI और पिक्सल नियम क्या होते हैं?',
    icon: '🖼️',
  },
  {
    title: 'राशन कार्ड में नाम जोड़ना',
    desc: 'नया सदस्य जोड़ने का फॉर्म',
    prompt: 'राशन कार्ड में नई बहू या नवजात बच्चे का नाम जोड़ने के लिए कौन से दस्तावेज और प्रक्रिया है?',
    icon: '🍚',
  },
];

export const AiChat: React.FC<AiChatProps> = ({
  language,
  customer,
  onNavigateToBuilder,
  onSendToPrintQueue,
  onAddToWorkspace,
}) => {
  const isHindi = language === 'hi';
  const quickPrompts = isHindi ? QUICK_PROMPTS_HI : QUICK_PROMPTS_EN;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: isHindi
        ? `### 🙏 नमस्ते! मैं **Cyber Mitra AI** सहायक हूँ।\n\nमैं भारत भर के साइबर कैफे, CSC और जन सेवा केंद्र संचालकों का संपूर्ण डिजिटल सहायक हूँ।\n\n**आप मुझसे क्या पूछ सकते हैं?**\n- 📑 **सरकारी प्रमाण पत्र:** आय, जाति, निवास, ईडब्ल्यूएस के नियम व दस्तावेज।\n- 🆔 **पहचान सेवाएं:** आधार, पैन कार्ड, वोटर आईडी, राशन कार्ड संशोधन।\n- 🌾 **सरकारी योजनाएं:** PM किसान, आयुष्मान भारत, बिजली बिल निवारण।\n- ✍️ **तत्काल प्रार्थना पत्र:** SDM, तहसीलदार, पुलिस, बैंक अधिकारियों हेतु प्रार्थना पत्र।\n- 🖼️ **फोटो/हस्ताक्षर साइज:** विभिन्न भर्ती परीक्षाओं के सटीक KB व पिक्सल।\n\n*नीचे दिए गए किसी भी त्वरित विषय पर क्लिक करें या अपना प्रश्न टाइप करें:*`
        : `### 🤖 Welcome to **Cyber Mitra AI Assistant**!\n\nI am your dedicated digital co-pilot for Cyber Cafe, CSC, and Jan Seva Kendra operations across India.\n\n**What can I assist you with today?**\n- 📑 **Government Certificates:** Exact document checklists & eligibility for Income, Caste, Domicile, EWS, Birth/Death certificates.\n- 🆔 **Identity Portals:** UIDAI Aadhaar, PAN Card (49A / CSF), Voter ID Form 6/8, Ration Card.\n- 🌾 **Schemes & Utilities:** PM Kisan eKYC, Ayushman Bharat, UPPCL Electricity corrections.\n- ✍️ **Instant Letter Drafting:** Pristine legal & administrative applications for SDM, Tehsildar, Police, Electricity SDO, and Banks.\n- 🖼️ **Photo & Signature Presets:** Exact KB sizes, DPI, and dimensions for all govt recruitments.\n\n*Click on any quick topic below or type your inquiry:*`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      modelBadge: 'Gemini 3.7 Flash',
    },
  ]);

  const [inputQuery, setInputQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll on message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = isHindi ? 'hi-IN' : 'en-IN';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputQuery((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [isHindi]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang = isHindi ? 'hi-IN' : 'en-IN';
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Text to Speech playback
  const handleToggleSpeak = (messageId: string, text: string) => {
    if (!window.speechSynthesis) return;

    if (speakingId === messageId) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Strip markdown formatting for cleaner speech
    const cleanText = text
      .replace(/[*#_`>]/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .slice(0, 1000);

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = isHindi ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(messageId);
    window.speechSynthesis.speak(utterance);
  };

  // Send message
  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputQuery).trim();
    if (!textToSend || isLoading) return;

    const userMessage: Message = {
      id: 'msg_' + Date.now(),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customText) setInputQuery('');
    setIsLoading(true);

    try {
      // Prepare message history for backend
      const historyPayload = messages
        .filter((m) => m.id !== 'welcome')
        .slice(-8)
        .map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          text: m.content,
        }));

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyPayload,
          userQuery: textToSend,
          language,
          customerContext: {
            name: customer.name,
            fatherName: customer.fatherMotherName,
            district: customer.district,
            state: customer.state,
            mobile: customer.mobile,
          },
        }),
      });

      const data = await response.json();
      const aiReply = data.reply || data.text || 'Received empty response from assistant.';
      const poweredBy = data.poweredBy || 'Gemini 3.7 Flash';

      const assistantMessage: Message = {
        id: 'msg_' + (Date.now() + 1),
        role: 'assistant',
        content: aiReply,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        modelBadge: poweredBy,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMessage: Message = {
        id: 'msg_' + (Date.now() + 1),
        role: 'assistant',
        content: isHindi
          ? `⚠️ **सेवा से संपर्क करने में समस्या हुई।**\n\nकृपया सुनिश्चित करें कि सर्वर सक्रिय है और आवश्यकतानुसार सेटिंग्स में \`GEMINI_API_KEY\` कॉन्फ़िगर है।`
          : `⚠️ **Unable to reach the AI service.**\n\nPlease ensure your server is active and the \`GEMINI_API_KEY\` is configured in Settings > Secrets if needed.`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        modelBadge: 'System Error',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleClearChat = () => {
    if (window.confirm(isHindi ? 'क्या आप चैट इतिहास साफ करना चाहते हैं?' : 'Clear all chat messages?')) {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      setSpeakingId(null);
      setMessages([
        {
          id: 'welcome_reset',
          role: 'assistant',
          content: isHindi
            ? 'चैट इतिहास साफ हो गया है। आप नया प्रश्न पूछ सकते हैं।'
            : 'Chat history cleared. How may I help you today?',
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          modelBadge: 'Gemini 3.7 Flash',
        },
      ]);
    }
  };

  const handleExportChat = () => {
    const formatted = messages
      .map((m) => `[${m.timestamp}] ${m.role === 'assistant' ? 'CYBER MITRA AI' : 'OPERATOR'}:\n${m.content}\n\n${'-'.repeat(50)}`)
      .join('\n\n');

    const blob = new Blob([formatted], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CyberMitra_AIChat_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Helper to render basic markdown formatting cleanly
  const renderMarkdown = (text: string) => {
    return text.split('\n').map((line, idx) => {
      // Heading 3
      if (line.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-sm sm:text-base font-bold text-slate-900 mt-2.5 mb-1 flex items-center gap-1.5">
            {line.replace('### ', '')}
          </h3>
        );
      }
      // Heading 2
      if (line.startsWith('## ')) {
        return (
          <h2 key={idx} className="text-base sm:text-lg font-extrabold text-slate-950 mt-3 mb-1.5 border-b border-slate-200 pb-1">
            {line.replace('## ', '')}
          </h2>
        );
      }
      // Bullet list item
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const itemContent = line.replace(/^[-*]\s+/, '');
        return (
          <li key={idx} className="ml-4 list-disc text-xs sm:text-sm text-slate-700 leading-relaxed my-0.5">
            {renderInlineMarkdown(itemContent)}
          </li>
        );
      }
      // Numbered list item
      if (/^\d+\.\s+/.test(line)) {
        return (
          <li key={idx} className="ml-4 list-decimal text-xs sm:text-sm text-slate-700 leading-relaxed my-0.5">
            {renderInlineMarkdown(line.replace(/^\d+\.\s+/, ''))}
          </li>
        );
      }
      // Empty line
      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }
      // Regular paragraph
      return (
        <p key={idx} className="text-xs sm:text-sm text-slate-700 leading-relaxed my-1">
          {renderInlineMarkdown(line)}
        </p>
      );
    });
  };

  const renderInlineMarkdown = (text: string) => {
    // Bold parsing
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="px-1 py-0.5 bg-slate-100 text-purple-700 rounded text-[11px] font-mono">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div className="space-y-4">
      {/* 1. TOP HERO HEADER */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-4 sm:p-6 shadow-md border border-purple-800/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-purple-500/20 text-purple-300 rounded-xl border border-purple-400/30 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                Cyber Mitra AI Chat
                <span className="text-[10px] uppercase font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Gemini 3.7 Flash Active
                </span>
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-purple-200/80 max-w-2xl">
              {isHindi
                ? 'सरकारी योजनाओं, आवश्यक दस्तावेजों, पोर्टल त्रुटि समाधान एवं कानूनी प्रार्थना पत्र निर्माण का आधिकारिक AI साथी।'
                : 'Intelligent digital co-pilot for Indian Cyber Cafe & CSC operators. Instant document rules, portal troubleshooting & letter generation.'}
            </p>
          </div>

          {/* Action Header Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {customer.name && (
              <div className="bg-purple-950/60 border border-purple-700/50 px-3 py-1.5 rounded-xl text-xs flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-purple-300" />
                <span className="text-purple-200 text-[11px]">
                  {isHindi ? 'ग्राहक:' : 'Client:'}{' '}
                  <strong className="text-white">{customer.name}</strong> ({customer.district || 'UP'})
                </span>
              </div>
            )}

            <button
              onClick={handleExportChat}
              title="Download chat as text"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/10"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isHindi ? 'निर्यात' : 'Export'}</span>
            </button>

            <button
              onClick={handleClearChat}
              title="Clear chat history"
              className="p-2 rounded-xl bg-white/10 hover:bg-rose-500/20 text-slate-300 hover:text-rose-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/10"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isHindi ? 'सफाई' : 'Clear'}</span>
            </button>
          </div>
        </div>

        {/* Quick Topic Chips Strip */}
        <div className="mt-4 pt-4 border-t border-purple-700/40">
          <p className="text-[11px] font-bold uppercase tracking-wider text-purple-300 mb-2 flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-amber-400" />
            {isHindi ? 'त्वरित विषय (क्लिक करके तुरंत उत्तर पाएं):' : 'Quick Inquiries (Click to Ask Immediately):'}
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {quickPrompts.slice(0, 5).map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(qp.prompt)}
                disabled={isLoading}
                className="shrink-0 bg-purple-950/70 hover:bg-purple-800/80 text-purple-100 border border-purple-600/40 hover:border-purple-400 px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <span>{qp.icon}</span>
                <span>{qp.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. CHAT CONVERSATION CONTAINER */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[600px] lg:h-[680px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isAi = msg.role === 'assistant';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isAi ? 'items-start' : 'items-start flex-row-reverse'}`}
              >
                {/* Avatar Icon */}
                <div
                  className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold shadow-xs ${
                    isAi
                      ? 'bg-gradient-to-br from-purple-600 to-indigo-700 text-white'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Message Bubble Card */}
                <div
                  className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 shadow-xs transition-all ${
                    isAi
                      ? 'bg-slate-50 border border-slate-200 text-slate-800'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  {/* Message Meta Info */}
                  <div
                    className={`flex items-center justify-between gap-2 pb-2 mb-2 border-b text-[10px] ${
                      isAi
                        ? 'border-slate-200 text-slate-500'
                        : 'border-blue-500/50 text-blue-100'
                    }`}
                  >
                    <span className="font-bold flex items-center gap-1">
                      {isAi ? 'Cyber Mitra AI' : customer.name || (isHindi ? 'संचालक (You)' : 'Operator')}
                      {isAi && msg.modelBadge && (
                        <span className="bg-purple-100 text-purple-800 border border-purple-200 px-1.5 py-0.2 rounded font-semibold text-[9px]">
                          {msg.modelBadge}
                        </span>
                      )}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className={isAi ? 'space-y-1' : 'text-xs sm:text-sm whitespace-pre-wrap leading-relaxed'}>
                    {isAi ? renderMarkdown(msg.content) : msg.content}
                  </div>

                  {/* AI Quick Actions Bar */}
                  {isAi && msg.id !== 'welcome' && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between gap-2 flex-wrap text-xs">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleCopyText(msg.id, msg.content)}
                          className="px-2 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-[11px] flex items-center gap-1 transition-colors"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-700">{isHindi ? 'कॉपी हो गया' : 'Copied'}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-slate-500" />
                              <span>{isHindi ? 'कॉपी करें' : 'Copy'}</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleToggleSpeak(msg.id, msg.content)}
                          className={`px-2 py-1 rounded-lg border font-semibold text-[11px] flex items-center gap-1 transition-colors ${
                            speakingId === msg.id
                              ? 'bg-purple-100 text-purple-700 border-purple-300 animate-pulse'
                              : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                          }`}
                        >
                          {speakingId === msg.id ? (
                            <>
                              <VolumeX className="w-3 h-3" />
                              <span>{isHindi ? 'रोकें' : 'Stop'}</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3 h-3 text-slate-500" />
                              <span>{isHindi ? 'सुने' : 'Listen'}</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Bridge to Application Builder if message has letter-like content */}
                      {onNavigateToBuilder && (
                        <button
                          onClick={() => onNavigateToBuilder('AI Generated Application')}
                          className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold text-[11px] flex items-center gap-1 transition-colors"
                        >
                          <FileText className="w-3 h-3" />
                          <span>{isHindi ? 'प्रार्थना पत्र मेकर में खोलें' : 'Open in Letter Builder'}</span>
                          <ArrowRight className="w-2.5 h-2.5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-xs">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-[80%] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-700">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  <span>{isHindi ? 'Cyber Mitra AI उत्तर तैयार कर रहा है...' : 'Cyber Mitra AI is thinking...'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 3. INPUT COMPOSER DOCK */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 rounded-b-2xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* Voice Input Button */}
            {speechSupported && (
              <button
                type="button"
                onClick={toggleListening}
                title={isListening ? 'Stop listening' : 'Speak your question'}
                className={`p-2.5 rounded-xl border transition-all ${
                  isListening
                    ? 'bg-rose-500 text-white border-rose-600 animate-pulse shadow-md'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            )}

            {/* Input Box */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder={
                  isHindi
                    ? 'कोई भी सरकारी योजना, दस्तावेज नियम, या पत्र लिखने को कहें...'
                    : 'Ask about any govt portal rules, document checklist, or draft letter...'
                }
                disabled={isLoading}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-purple-600 focus:outline-none placeholder:text-slate-400 disabled:bg-slate-100 shadow-inner"
              />
            </div>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className="px-4 sm:px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-sm flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">{isHindi ? 'पूछें' : 'Send'}</span>
            </button>
          </form>

          {/* Quick Prompts Lower Row */}
          <div className="mt-2.5 flex items-center justify-between gap-2 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              {isHindi ? '100% प्रामाणिक आधिकारिक सरकारी नियम' : '100% Official Government Portal Guidelines'}
            </span>
            <span className="hidden md:inline text-slate-400">
              {isHindi ? 'Enter दबाकर भेजें' : 'Press Enter to submit inquiry'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
