const fs = require('fs');

// AI Chat
let aiChat = fs.readFileSync('src/components/tools/AiChat.tsx', 'utf8');
let chatRegex = /const response = await fetch\('\/api\/ai\/chat'[\s\S]*?poweredBy = data\.poweredBy \|\| 'Gemini';/m;

aiChat = aiChat.replace(chatRegex, `
        await new Promise(resolve => setTimeout(resolve, 600));
        aiReply = getLocalFallbackResponse(textToSend, isHindi);
        poweredBy = 'Smart Local Bot';
`);
fs.writeFileSync('src/components/tools/AiChat.tsx', aiChat);

// Widget Chat
let widgetChat = fs.readFileSync('src/components/chat/FloatingAiChatWidget.tsx', 'utf8');
let widgetRegex = /const response = await fetch\('\/api\/ai\/chat'[\s\S]*?replyText = data\.reply \|\| data\.text \|\| 'Received empty response\.';/m;

widgetChat = widgetChat.replace(widgetRegex, `
        await new Promise(resolve => setTimeout(resolve, 600));
        replyText = getLocalFallbackResponse(query, isHindi);
`);
fs.writeFileSync('src/components/chat/FloatingAiChatWidget.tsx', widgetChat);

