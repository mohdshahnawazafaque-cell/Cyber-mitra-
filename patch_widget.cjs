const fs = require('fs');
let code = fs.readFileSync('src/components/chat/FloatingAiChatWidget.tsx', 'utf8');

// Add import
if (!code.includes('getLocalFallbackResponse')) {
  code = code.replace("import React,", "import { getLocalFallbackResponse } from '../../utils/localAiBot';\nimport React,");
}

const fallbackSearch = `
        const response = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: historyPayload,
            userQuery: query,
            language: language,
          }),
        });

        if (!response.ok) {
          throw new Error('Netlify Error: Backend not found');
        }

        const data = await response.json();
        replyText = data.reply || data.text || 'Received empty response.';
`;

const fallbackReplace = `
        // Simulated latency for local bot
        await new Promise(resolve => setTimeout(resolve, 600));
        replyText = getLocalFallbackResponse(query, isHindi);
`;

code = code.replace(fallbackSearch, fallbackReplace);

code = code.replace(
  "const isMissingKey = err.message.includes('Backend not found') || err.message.includes('API Key invalid');",
  "const isMissingKey = err.message.includes('API Key invalid');"
);

fs.writeFileSync('src/components/chat/FloatingAiChatWidget.tsx', code);
