const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `    if (actionType !== 'Logged') {
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }`;

const replacement = `    if (actionType !== 'Logged') {
      const win = window.open(url, '_blank');
      if (!win) {
        // Fallback if popup blocked
        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    }`;

code = code.replace(targetStr, replacement);
fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx for better fallback");
