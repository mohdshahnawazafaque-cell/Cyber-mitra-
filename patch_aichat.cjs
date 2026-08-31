const fs = require('fs');
let code = fs.readFileSync('src/components/tools/AiChat.tsx', 'utf8');

// Add import
if (!code.includes('getLocalFallbackResponse')) {
  code = code.replace("import React,", "import { getLocalFallbackResponse } from '../../utils/localAiBot';\nimport React,");
}

// Replace the fallback API logic
const fallbackSearch = `
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

        if (!response.ok) { 
          throw new Error('Netlify Error: Backend not found');
        }

        const data = await response.json();
        aiReply = data.reply || data.text || 'Received empty response from assistant.';
        poweredBy = data.poweredBy || 'Gemini';
`;

const fallbackReplace = `
        // Simulated latency for local bot
        await new Promise(resolve => setTimeout(resolve, 800));
        aiReply = getLocalFallbackResponse(textToSend, isHindi);
        poweredBy = 'Smart Local Bot';
`;

code = code.replace(fallbackSearch, fallbackReplace);

// Also remove the "Netlify Error: Backend not found" check in the catch block 
code = code.replace(
  "const isMissingKey = err.message.includes('Backend not found') || err.message.includes('API Key invalid');",
  "const isMissingKey = err.message.includes('API Key invalid');"
);

fs.writeFileSync('src/components/tools/AiChat.tsx', code);
