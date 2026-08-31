const fs = require('fs');
let code = fs.readFileSync('src/components/tools/AiStudioTools.tsx', 'utf8');

const docSearch = `
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      setDocOutputText(data.text || '');
`;

const docReplace = `
      const apiKey = localStorage.getItem('gemini_api_key');
      if (apiKey) {
         const aiResponse = await fetch(\`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=\${apiKey}\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{role: 'user', parts: [{text: prompt}]}] })
        });
        const aiData = await aiResponse.json();
        setDocOutputText(aiData.candidates?.[0]?.content?.parts?.[0]?.text || docInputText);
      } else {
        await new Promise(resolve => setTimeout(resolve, 500));
        setDocOutputText(docInputText + '\\n\\n[Formatted via local preview]');
      }
`;

code = code.replace(docSearch, docReplace);
fs.writeFileSync('src/components/tools/AiStudioTools.tsx', code);
