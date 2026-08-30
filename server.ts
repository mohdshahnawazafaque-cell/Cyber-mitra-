import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '20mb' }));

// Lazy Gemini client helper
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Check AI status
app.get('/api/ai/status', (req, res) => {
  const hasKey = !!process.env.GEMINI_API_KEY;
  res.json({
    available: hasKey,
    model: 'gemini-3.7-flash',
    message: hasKey
      ? 'Gemini AI API is active & ready.'
      : 'Gemini API Key is not configured yet. Server structure is ready for direct activation via Settings > Secrets.',
  });
});

// AI Assistant & Writing Endpoint
app.post('/api/ai/generate', async (req, res) => {
  try {
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: 'API_KEY_MISSING',
        message: 'Gemini API Key is not configured on the server. Please configure GEMINI_API_KEY in Settings > Secrets to enable live AI capabilities.',
      });
    }

    const { prompt, systemInstruction, taskType } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'PROMPT_REQUIRED', message: 'Prompt parameter is required.' });
    }

    const defaultSystem = `You are Cyber Mitra AI Assistant, an expert digital assistant for Indian Cyber Cafe and Common Service Center (CSC / Jan Seva Kendra) operators.
You provide precise, official, clear guidance on:
- Official government applications (Edistrict UP, UIDAI Aadhaar, PAN Card, Voter ID, Ration Card, PM Kisan, UPPCL, Domicile, Caste, Income certificates)
- Formal letters in flawless Hindi (औपचारिक प्रार्थना पत्र / आवेदन पत्र) and English
- Exact document requirements, official portals, eligibility criteria, and step-by-step guidance.
Never generate fake IDs or misleading documents. Always format responses cleanly with bullet points and clear sections.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || defaultSystem,
        temperature: 0.3,
      },
    });

    res.json({
      text: response.text || '',
      taskType: taskType || 'general',
    });
  } catch (error: any) {
    console.error('Error in /api/ai/generate:', error);
    res.status(500).json({
      error: 'GENERATION_ERROR',
      message: error?.message || 'Failed to generate AI response.',
    });
  }
});

// Dedicated Multi-turn AI Chat Endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { messages, userQuery, language, customerContext } = req.body;
    const ai = getGeminiClient();

    const systemInstruction = `You are Cyber Mitra AI — the expert, dedicated AI Assistant for Indian Cyber Cafe Operators, CSC VLEs, Jan Seva Kendra operators, and citizens.
Your capabilities:
1. Provide exact official document checklists and eligibility criteria for central and state government services (UIDAI Aadhaar, PAN Card, UP eDistrict, Bhulekh, PM Kisan, UPPCL Electricity, Voter ID, Ration Card, Ayushman Card, Driving License).
2. Draft pristine, ready-to-print official formal letters / applications (प्रार्थना पत्र) in formal Hindi or English for Sub-Divisional Magistrates (SDM), Tehsildar, Electricity SDO, Bank Branch Managers, SHO Police, and Municipal Officers.
3. Provide exact specifications for government photo/signature uploads (KB limits, pixels, dimensions, DPI, white background rules for SSC, UPSC, NSDL, Police recruitment).
4. Guide operators through troubleshooting portal error codes (eDistrict session timeout, biometric RD service failure, payment gateway issues).
5. Always output structured, readable Markdown with clear bullet points, bold key terms, and actionable steps.
6. Provide answers in ${language === 'hi' ? 'clear Hindi with key technical terms in English' : 'clear professional English'}.
${customerContext ? `\nActive Customer in current operator session: Name: ${customerContext.name || 'N/A'}, District: ${customerContext.district || 'N/A'}, State: ${customerContext.state || 'N/A'}` : ''}`;

    if (ai) {
      // Build conversation contents for Gemini 3.7 Flash
      let contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

      if (Array.isArray(messages) && messages.length > 0) {
        contents = messages.map((m: any) => ({
          role: m.role === 'assistant' || m.role === 'model' ? ('model' as const) : ('user' as const),
          parts: [{ text: String(m.content || m.text || '') }],
        }));
      }

      if (userQuery) {
        contents.push({
          role: 'user',
          parts: [{ text: userQuery }],
        });
      }

      if (contents.length === 0) {
        return res.status(400).json({ error: 'EMPTY_QUERY', message: 'No messages or user query provided.' });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: contents,
        config: {
          systemInstruction,
          temperature: 0.3,
        },
      });

      return res.json({
        reply: response.text || '',
        model: 'gemini-3.7-flash',
        poweredBy: 'Gemini 3.7 Flash',
      });
    }

    // Knowledge-base fallback if GEMINI_API_KEY is not configured yet
    const queryLower = (userQuery || '').toLowerCase();
    let reply = '';

    if (queryLower.includes('income') || queryLower.includes('आय प्रमाण पत्र') || queryLower.includes('aay')) {
      reply = language === 'hi'
        ? `### 📋 आय प्रमाण पत्र (Income Certificate) हेतु आवश्यक दस्तावेज:\n\n1. **स्व-प्रमाणित घोषणा पत्र** (Self Declaration Form)\n2. **आधार कार्ड** की छायाप्रति\n3. **राशन कार्ड / परिवार रजिस्टर की नकल**\n4. **वेतन पर्ची / पटवारी आख्या** (यदि लागू हो)\n5. **पासपोर्ट साइज फोटो** (20 KB से 50 KB)\n\n⏱️ **समय सीमा:** 7 से 15 कार्य दिवस\n🌐 **आधिकारिक पोर्टल:** UP eDistrict (edistrict.up.gov.in)`
        : `### 📋 Income Certificate Required Documents Checklist:\n\n1. **Self-Declaration Form** (Signed by applicant)\n2. **Aadhaar Card** copy\n3. **Ration Card or Family Register excerpt**\n4. **Salary Slip / Patwari / Lekhpal Verification Report**\n5. **Passport Size Photograph** (20 KB – 50 KB, JPEG)\n\n⏱️ **Timeline:** 7 to 15 working days\n🌐 **Official Portal:** State eDistrict Portal (e.g. edistrict.up.gov.in)`;
    } else if (queryLower.includes('caste') || queryLower.includes('जाति') || queryLower.includes('jati')) {
      reply = language === 'hi'
        ? `### 📋 जाति प्रमाण पत्र (Caste Certificate) हेतु दस्तावेज:\n\n1. **स्व-प्रमाणित घोषणा पत्र**\n2. **आधार कार्ड**\n3. **पिता / परिवार के किसी सदस्य का पुराना जाति प्रमाण पत्र** या खतौनी/साक्ष्य\n4. **पासपोर्ट साइज रंगीन फोटो** (20-50 KB)\n5. **राशन कार्ड की कॉपी**\n\n📌 **नोट:** विवाहित महिलाओं के मामले में पिता पक्ष का जाति प्रमाण पत्र/साक्ष्य संलग्न करना अनिवार्य है।`
        : `### 📋 Caste Certificate Required Documents:\n\n1. **Self-Declaration Form**\n2. **Aadhaar Card** of the applicant\n3. **Father's / Blood Relative's prior Caste Certificate or Land Record excerpt**\n4. **Passport Size Photo** (20 KB – 50 KB)\n5. **Ration Card / ID Proof**\n\n📌 **Note:** For married female applicants, caste proof from the paternal side (father's lineage) is strictly required.`;
    } else if (queryLower.includes('domicile') || queryLower.includes('निवास') || queryLower.includes('niwas')) {
      reply = language === 'hi'
        ? `### 📋 निवास प्रमाण पत्र (Domicile / Residence Certificate):\n\n1. **स्व-प्रमाणित घोषणा पत्र**\n2. **आधार कार्ड / वोटर आईडी**\n3. **बिजली का बिल / पानी का बिल / हाउस टैक्स रसीद**\n4. **निवास का साक्ष्य (कम से कम 3 वर्ष का प्रमाण या पैतृक भूमि खतौनी)**\n5. **पासपोर्ट साइज फोटो**\n\n🌐 **पोर्टल:** eDistrict Portal (शुल्क: ₹15-₹30 सरकारी फीस)`
        : `### 📋 Domicile / Residence Certificate Checklist:\n\n1. **Self-Declaration Form**\n2. **Aadhaar Card / Voter ID**\n3. **Electricity Bill / Water Bill / House Tax Receipt**\n4. **Proof of continuous residence (minimum 3 years in state or ancestral land records)**\n5. **Passport Size Photo**\n\n🌐 **Portal:** eDistrict State Portal`;
    } else if (queryLower.includes('pan') || queryLower.includes('पैन कार्ड')) {
      reply = language === 'hi'
        ? `### 💳 पैन कार्ड (PAN Card - NSDL / UTIITSL) दिशा-निर्देश:\n\n1. **नया पैन कार्ड (Form 49A):**\n   - पहचान, पता और जन्म तिथि हेतु केवल आधार कार्ड पर्याप्त है (Aadhaar Paperless eKYC).\n   - फोटो: 3.5cm x 2.5cm (300 DPI, < 50 KB).\n   - हस्ताक्षर: < 50 KB.\n2. **पैन कार्ड सुधार / रिप्रिंट (CSF Form):**\n   - मौजूदा पैन कार्ड की प्रति + आधार कार्ड + सुधार से संबंधित साक्ष्य।\n3. **आधार-पैन लिंक स्थिति:** Income Tax e-Filing पोर्टल पर 'Link Aadhaar Status' से जांचें।`
        : `### 💳 PAN Card (Form 49A / CSF Correction) Guidelines:\n\n1. **New PAN Card (Form 49A):**\n   - Aadhaar Card alone suffices for Identity, Address, and Date of Birth proof.\n   - Photo dimensions: 3.5 cm x 2.5 cm (300 DPI, < 50 KB).\n   - Signature dimensions: 2 cm x 4.5 cm (< 50 KB).\n2. **PAN Correction / Update (CSF Form):**\n   - Copy of existing PAN card + Aadhaar card + Gazetted certificate if major name correction.\n3. **Aadhaar-PAN Linkage:** Verify via Income Tax e-Filing portal.`;
    } else if (queryLower.includes('aadhaar') || queryLower.includes('आधार')) {
      reply = language === 'hi'
        ? `### 🆔 आधार कार्ड सेवाएं (UIDAI myAadhaar):\n\n1. **पता अपडेट (Address Update Online):**\n   - मूल निवास प्रमाण पत्र, बिजली बिल, बैंक पासबुक या वोटर आईडी मान्य हैं।\n2. **नाम / जन्मतिथि / लिंग सुधार:**\n   - केवल अधिकृत आधार सेवा केंद्र पर बायोमेट्रिक प्रमाणीकरण के साथ (Name: 2 बार, DOB: 1 बार आजीवन).\n3. **दस्तावेज नवीनीकरण (Document Update):**\n   - 10 वर्ष पुराने आधार कार्डों के लिए पहचान (PoI) और पते (PoA) का दस्तावेज अपलोड अनिवार्य है।`
        : `### 🆔 Aadhaar Card Operations (UIDAI myAadhaar):\n\n1. **Online Address Update:** Valid proofs include Domicile certificate, Electricity bill, Bank passbook, or Voter ID.\n2. **Biometric, Name & DOB Correction:** Must be performed at an authorized Aadhaar Seva Kendra / Bank / Post Office with biometric authentication.\n3. **Mandatory Document Update:** Citizens holding 10+ year old Aadhaar cards must upload fresh Proof of Identity (PoI) and Proof of Address (PoA).`;
    } else if (queryLower.includes('letter') || queryLower.includes('आवेदन') || queryLower.includes('प्रार्थना पत्र') || queryLower.includes('draft')) {
      reply = language === 'hi'
        ? `### ✍️ औपचारिक प्रार्थना पत्र प्रारूप:\n\n**सेवा में,**\nश्रीमान उपजिलाधिकारी महोदय,\nतहसील - [तहसील का नाम], जनपद - [जनपद का नाम]\n\n**विषय:** [यहाँ विषय लिखें]\n\n**महोदय,**\nसविनय निवेदन है कि प्रार्थी [नाम] पुत्र [पिता का नाम], निवासी [ग्राम/मोहल्ला, पोस्ट, जनपद] का स्थायी निवासी है।\n\n[यहाँ अपनी समस्या अथवा अनुरोध का विवरण 2-3 पंक्तियों में लिखें]\n\nअतः श्रीमान जी से विनम्र प्रार्थना है कि उक्त प्रकरण की स्थलीय जांच कराकर आवश्यक कार्यवाही करने की कृपा करें।\n\n**संलग्नक:** आधार कार्ड, खतौनी/दस्तावेज प्रति।\n**दिनांक:** ${new Date().toLocaleDateString('hi-IN')}\n**प्रार्थी:** [नाम], मो०: [मोबाइल नंबर]`
        : `### ✍️ Formal Official Application Template:\n\n**To,**\nThe Sub-Divisional Magistrate (SDM),\nTehsil / District: [District Name]\n\n**Subject:** Application regarding [Enter Subject]\n\n**Respected Sir/Madam,**\nI, [Applicant Name], son/daughter of [Father Name], resident of [Address, Village/Town, District], respectfully state the following:\n\n[Explain the issue or request clearly in 2-3 concise paragraphs]\n\nTherefore, I humbly request your esteemed authority to kindly investigate this matter and initiate appropriate action at the earliest.\n\n**Enclosures:** Copy of Aadhaar Card & Relevant proofs.\n**Date:** ${new Date().toLocaleDateString('en-IN')}\n**Applicant:** [Name], Mobile: [Mobile Number]`;
    } else {
      reply = language === 'hi'
        ? `नमस्ते! मैं **Cyber Mitra AI** सहायक हूँ। आप मुझसे निम्नलिखित विषयों पर कभी भी प्रश्न पूछ सकते हैं:
- 📑 **सरकारी प्रमाण पत्र:** आय, जाति, निवास, जन्म-मृत्यु, ईडब्ल्यूएस प्रमाण पत्र के दस्तावेज एवं प्रक्रिया।
- 🆔 **पहचान पत्र व पोर्टल:** आधार सुधार, पैन कार्ड 49A/CSF, वोटर आईडी फॉर्म 6/8, राशन कार्ड में नाम जोड़ना/काटना।
- 🌾 **योजनाएं व बिल:** PM किसान eKYC, आयुष्मान भारत कार्ड, बिजली बिल संशोधन (UPPCL)।
- ✍️ **प्रार्थना पत्र लेखन:** SDM, तहसीलदार, थाना प्रभारी, बिजली विभाग, बैंक हेतु तत्काल औपचारिक पत्र।
- 🖼️ **फोटो व हस्ताक्षर साइज:** विभिन्न सरकारी भर्तियों (SSC, Railway, Police) के सटीक KB व पिक्सल नियम।`
        : `Hello! I am **Cyber Mitra AI Assistant**. I can assist you with:
- 📑 **Government Certificates:** Required documents, eligibility, and step-by-step application procedures for Income, Caste, Domicile, EWS, Birth & Death certificates.
- 🆔 **Identity & Registrations:** Aadhaar updates, PAN Card new/correction (Form 49A / CSF), Voter ID Form 6/8, Ration Card modifications.
- 🌾 **Schemes & Utilities:** PM Kisan eKYC status, Ayushman Bharat Golden Card, UPPCL Electricity bill rectification.
- ✍️ **Formal Letter Drafting:** Instant ready-to-print official applications to SDM, Tehsildar, Police, Electricity SDO, and Bank Managers.
- 🖼️ **Photo & Signature Presets:** Exact KB size, dimensions, and DPI requirements for all recruitment and entrance exam portals.`;
    }

    res.json({
      reply,
      model: 'cybermitra-local-kb',
      poweredBy: 'Cyber Mitra Knowledge Base',
    });
  } catch (error: any) {
    console.error('Error in /api/ai/chat:', error);
    res.status(500).json({
      error: 'CHAT_ERROR',
      message: error?.message || 'Failed to process AI chat query.',
    });
  }
});

// Link verification checker helper
async function verifySingleUrl(url: string): Promise<{ url: string; status: number; ok: boolean; error?: string }> {
  if (!url || typeof url !== 'string' || !url.startsWith('http')) {
    return { url, status: 0, ok: false, error: 'Invalid URL scheme' };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    // Try HEAD first, fall back to GET if HEAD blocked
    let res: Response;
    try {
      res = await fetch(url, {
        method: 'HEAD',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        signal: controller.signal,
        redirect: 'follow',
      });
    } catch {
      // Retry once with GET
      res = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        },
        signal: controller.signal,
        redirect: 'follow',
      });
    }

    clearTimeout(timeoutId);
    // Government portals returning 2xx, 3xx, or 401/403 are alive and reachable
    const isReachable = res.status >= 200 && res.status < 500;
    return { url, status: res.status, ok: isReachable };
  } catch (e: any) {
    return { url, status: 0, ok: false, error: e?.name === 'AbortError' ? 'Timeout (4.5s)' : e.message || 'Connection failed' };
  }
}

app.post('/api/check-link', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL required' });
  const result = await verifySingleUrl(url);
  res.json(result);
});

// Batch link verification
app.post('/api/check-links', async (req, res) => {
  const { urls } = req.body;
  if (!Array.isArray(urls)) return res.status(400).json({ error: 'Array of urls required' });

  const results: Record<string, { status: number; ok: boolean; error?: string }> = {};
  
  // Run in chunks of 5 parallel requests
  const chunkSize = 5;
  for (let i = 0; i < urls.length; i += chunkSize) {
    const chunk = urls.slice(i, i + chunkSize);
    const chunkResults = await Promise.all(chunk.map((u) => verifySingleUrl(u)));
    chunkResults.forEach((r) => {
      results[r.url] = { status: r.status, ok: r.ok, error: r.error };
    });
  }

  res.json({ results });
});

// Vite Middleware / Static Server
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CYBER MITRA Server running on http://localhost:${PORT}`);
  });
}

startServer();
