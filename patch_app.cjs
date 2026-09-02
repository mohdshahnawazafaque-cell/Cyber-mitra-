const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/const handleOpenLink = \([\s\S]*?if \(!win\) \{[\s\S]*?\}\s*\}/, 
`const handleOpenLink = (url: string, title: string, actionType: string) => {
    if (!url || url === '#') {
      alert(isHindi ? 'यह लिंक जल्द ही सक्रिय होगा' : 'Link will be available soon');
      return;
    }
    // Record audit log
    recordActivityLog(appState, \`Open Portal: \${title}\`, \`Clicked \${actionType} -> \${url}\`);
    
    const win = window.open(url, '_blank');
    if (!win) {
      alert(isHindi 
        ? "सुरक्षा कारणों से पॉप-अप ब्लॉक हो गया है। कृपया इस लिंक को कॉपी करें और नए टैब में खोलें:\\n\\n" + url 
        : "Pop-ups blocked. Please copy this link and open in a new tab:\\n\\n" + url);
    }
  }`);

fs.writeFileSync('src/App.tsx', code);
