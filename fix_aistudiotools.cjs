const fs = require('fs');
let code = fs.readFileSync('src/components/tools/AiStudioTools.tsx', 'utf8');

// Fix Generate
const generateSearch = `
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const draft = letterLanguage === 'hi' 
        ? \\\`सेवा में,
\${recipient}

विषय: \${subject}

महोदय,
सविनय निवेदन है कि \${keyDetails}। कृपया इस मामले में आवश्यक कार्रवाई करने की कृपा करें।

धन्यवाद,
प्रार्थी: \${customer.name || '___________'}
पता: \${customer.district || '___________'}\\\`
        : \\\`To,
\${recipient}

Subject: \${subject}

Respected Sir/Madam,
Respectfully I state that \${keyDetails}. Kindly look into the matter and take necessary action.

Thanking you,
Applicant: \${customer.name || '___________'}
Address: \${customer.district || '___________'}\\\`;

      setGeneratedLetter(draft);
`;

const generateReplace = `
      const apiKey = localStorage.getItem('gemini_api_key');
      
      if (apiKey) {
         const aiResponse = await fetch(\`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=\${apiKey}\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{role: 'user', parts: [{text: prompt}]}],
            systemInstruction: {
              role: 'user',
              parts: [{ text: 'You are Cyber Mitra AI Letter Generator. Output strictly clean, ready-to-print official letters.' }]
            }
          })
        });
        const aiData = await aiResponse.json();
        if (!aiResponse.ok) throw new Error('API Error');
        setGeneratedLetter(aiData.candidates?.[0]?.content?.parts?.[0]?.text || 'Draft generated.');
      } else {
        await new Promise(resolve => setTimeout(resolve, 800));
        const draft = letterLanguage === 'hi' 
          ? \`सेवा में,\n\${recipient}\n\nविषय: \${subject}\n\nमहोदय,\nसविनय निवेदन है कि \${keyDetails}। कृपया इस मामले में आवश्यक कार्रवाई करने की कृपा करें।\n\nधन्यवाद,\nप्रार्थी: \${customer.name || '___________'}\nपता: \${customer.district || '___________'}\`
          : \`To,\n\${recipient}\n\nSubject: \${subject}\n\nRespected Sir/Madam,\nRespectfully I state that \${keyDetails}. Kindly look into the matter and take necessary action.\n\nThanking you,\nApplicant: \${customer.name || '___________'}\nAddress: \${customer.district || '___________'}\`;
        setGeneratedLetter(draft);
      }
`;
code = code.replace(generateSearch, generateReplace);


// Fix chat
const chatSearch = `
      await new Promise(resolve => setTimeout(resolve, 600));
      const aiText = getLocalFallbackResponse(userText, isHindi);
`;
const chatReplace = `
      const apiKey = localStorage.getItem('gemini_api_key');
      let aiText = '';
      if (apiKey) {
        const history = assistantMessages.slice(-6).map((m) => ({
          role: m.sender === 'ai' ? 'model' : 'user',
          parts: [{ text: m.text }],
        }));
        history.push({ role: 'user', parts: [{ text: userText }] });
        
        const aiResponse = await fetch(\`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=\${apiKey}\`, {
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
`;
code = code.replace(chatSearch, chatReplace);


fs.writeFileSync('src/components/tools/AiStudioTools.tsx', code);
