const fs = require('fs');
let code = fs.readFileSync('src/components/services/ServiceCard.tsx', 'utf8');

// Replace onClick={(e) => { e.stopPropagation(); onOpenLink(links.xxx!, title, 'Logged'); }}
// with onClick={(e) => { e.stopPropagation(); if(links.xxx === '#' || !links.xxx) { e.preventDefault(); } onOpenLink(links.xxx!, title, 'Logged'); }}

code = code.replace(/onClick=\{\(e\) => \{ e\.stopPropagation\(\); onOpenLink\(([^,]+), title, 'Logged'\); \}\}/g, 
  "onClick={(e) => { e.stopPropagation(); if ($1 === '#' || !$1) e.preventDefault(); onOpenLink($1, title, 'Logged'); }}");

fs.writeFileSync('src/components/services/ServiceCard.tsx', code);
console.log("Patched ServiceCard.tsx for preventDefault");
