const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `  const handleOpenLink = (url: string, title: string, actionType: string) => {
    if (!url || url === '#') {
      alert(isHindi ? 'यह लिंक जल्द ही सक्रिय होगा' : 'Link will be available soon');
      return;
    }
    // Record audit log
    recordActivityLog(appState, \`Open Portal: \${title}\`, \`Clicked \${actionType} -> \${url}\`);
    
    try {
      window.open(url, '_blank');
    } catch (err) {
      window.location.href = url;
    }
  };`;

const replacement = `  const handleOpenLink = (url: string, title: string, actionType: string) => {
    if (!url || url === '#') {
      alert(isHindi ? 'यह लिंक जल्द ही सक्रिय होगा' : 'Link will be available soon');
      return;
    }
    // Record audit log
    recordActivityLog(appState, \`Open Portal: \${title}\`, \`Clicked \${actionType} -> \${url}\`);
    
    if (actionType !== 'Logged') {
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };`;

code = code.replace(targetStr, replacement);
fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx");
