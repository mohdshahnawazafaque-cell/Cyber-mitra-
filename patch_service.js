const fs = require('fs');

let code = fs.readFileSync('src/components/services/ServiceCard.tsx', 'utf8');
code = code.replace(/onClick=\{\(e\) => \{ e\.stopPropagation\(\); if\(links\.([a-zA-Z0-9_]+) === '#' \|\| !links\.[a-zA-Z0-9_]+\) \{ e\.preventDefault\(\); onOpenLink\(links\.[a-zA-Z0-9_]+, title, 'Blocked'\); \} else \{ onOpenLink\(links\.[a-zA-Z0-9_]+, title, 'External_LogOnly'\); \} \}\}/g, 
  "onClick={(e) => { if (!links.$1 || links.$1 === '#') { e.preventDefault(); alert(isHindi ? 'यह लिंक जल्द ही सक्रिय होगा' : 'Link will be available soon'); } else { onOpenLink(links.$1, title, 'External_LogOnly'); } }}");

fs.writeFileSync('src/components/services/ServiceCard.tsx', code);
