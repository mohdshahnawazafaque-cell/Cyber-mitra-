const fs = require('fs');
let code = fs.readFileSync('src/components/tools/AiStudioTools.tsx', 'utf8');

// Add import
if (!code.includes('getLocalFallbackResponse')) {
  code = code.replace("import React,", "import { getLocalFallbackResponse } from '../../utils/localAiBot';\nimport React,");
}

// Fix Generate
const generateSearch = `
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          systemInstruction: 'You are Cyber Mitra AI Letter Generator. Output strictly clean, ready-to-print official letters.',
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate letter');
      }

      setGeneratedLetter(data.text);
`;

const generateReplace = `
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const draft = letterLanguage === 'hi' 
        ? \`सेवा में,
\${recipient}

विषय: \${subject}

महोदय,
सविनय निवेदन है कि \${keyDetails}। कृपया इस मामले में आवश्यक कार्रवाई करने की कृपा करें।

धन्यवाद,
प्रार्थी: \${customer.name || '___________'}
पता: \${customer.district || '___________'}\`
        : \`To,
\${recipient}

Subject: \${subject}

Respected Sir/Madam,
Respectfully I state that \${keyDetails}. Kindly look into the matter and take necessary action.

Thanking you,
Applicant: \${customer.name || '___________'}
Address: \${customer.district || '___________'}\`;

      setGeneratedLetter(draft);
`;

code = code.replace(generateSearch, generateReplace);

// Fix Chat
const chatSearch = `
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyPayload,
          userQuery: userText,
          language,
          customerContext: {
            name: customer.name,
            district: customer.district,
            state: customer.state,
          },
        }),
      });

      const data = await response.json();
      const aiText = data.reply || data.text || (isHindi ? 'उत्तर प्राप्त नहीं हो सका।' : 'Unable to retrieve answer.');
`;

const chatReplace = `
      await new Promise(resolve => setTimeout(resolve, 600));
      const aiText = getLocalFallbackResponse(userText, isHindi);
`;

code = code.replace(chatSearch, chatReplace);

fs.writeFileSync('src/components/tools/AiStudioTools.tsx', code);
