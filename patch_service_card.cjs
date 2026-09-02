const fs = require('fs');
let code = fs.readFileSync('src/components/services/ServiceCard.tsx', 'utf8');

// Replace <a> tags for links with <button>
code = code.replace(/<a href=\{links\.([a-zA-Z]+)!?\} target="_blank" rel="noopener noreferrer"\s*onClick=\{\(e\) => \{ if \(!links\.[a-zA-Z]+ \|\| links\.[a-zA-Z]+ === '#'\) \{ e\.preventDefault\(\); alert\([^)]+\); \} else \{ onOpenLink\(links\.[a-zA-Z]+!, title, 'External_LogOnly'\); \} \}\}/g, 
(match, p1) => {
  return `<button onClick={(e) => { e.preventDefault(); if (!links.${p1} || links.${p1} === '#') { alert(isHindi ? 'यह लिंक जल्द ही सक्रिय होगा' : 'Link will be available soon'); } else { onOpenLink(links.${p1}!, title, 'Apply'); } }}`;
});

code = code.replace(/<\/a>/g, '</button>');

fs.writeFileSync('src/components/services/ServiceCard.tsx', code);
