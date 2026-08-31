const fs = require('fs');
let widgetChat = fs.readFileSync('src/components/chat/FloatingAiChatWidget.tsx', 'utf8');

const widgetRegex = /const response = await fetch\('\/api\/ai\/chat'[\s\S]*?data = await response\.json\(\);\s*}/m;

widgetChat = widgetChat.replace(widgetRegex, `
        await new Promise(resolve => setTimeout(resolve, 600));
        data = { reply: getLocalFallbackResponse(query, isHindi) };
      }
`);

fs.writeFileSync('src/components/chat/FloatingAiChatWidget.tsx', widgetChat);
