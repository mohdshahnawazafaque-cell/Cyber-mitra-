const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /if \(actionType !== 'Logged'\) \{[\s\S]*?const win = window\.open\(url, '_blank'\);[\s\S]*?if \(!win\) \{[\s\S]*?\/\/ Fallback if popup blocked[\s\S]*?const a = document\.createElement\('a'\);[\s\S]*?a\.href = url;[\s\S]*?a\.target = '_blank';[\s\S]*?a\.rel = 'noopener noreferrer';[\s\S]*?document\.body\.appendChild\(a\);[\s\S]*?a\.click\(\);[\s\S]*?document\.body\.removeChild\(a\);[\s\S]*?\}[\s\S]*?\}/g,
  `const win = window.open(url, '_blank');
    if (!win) {
      alert(isHindi ? 'ब्राउज़र पॉप-अप ब्लॉक है! कृपया लिंक खोलने के लिए पॉप-अप चालू करें।' : 'Browser popup blocked! Please allow popups to open the link.');
    }`
);

fs.writeFileSync('src/App.tsx', code);
