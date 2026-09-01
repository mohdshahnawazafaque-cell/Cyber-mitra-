const fs = require('fs');

// Patch App.tsx
let appCode = fs.readFileSync('src/App.tsx', 'utf8');
appCode = appCode.replace(/const win = window\.open\(url, '_blank'\);/g, `if (actionType !== 'External_LogOnly') {\n      const win = window.open(url, '_blank');`);
appCode = appCode.replace(/Browser popup blocked! Please allow popups to open the link\.'\);\n    \}/g, `Browser popup blocked! Please allow popups to open the link.');\n      }\n    }`);
fs.writeFileSync('src/App.tsx', appCode);

// Patch ServiceCard.tsx
let cardCode = fs.readFileSync('src/components/services/ServiceCard.tsx', 'utf8');
cardCode = cardCode.replace(/e\.stopPropagation\(\); e\.preventDefault\(\); onOpenLink\(links\.([^!]+)!, title, 'External'\);/g, "e.stopPropagation(); if(links.$1 === '#' || !links.$1) { e.preventDefault(); onOpenLink(links.$1, title, 'Blocked'); } else { onOpenLink(links.$1, title, 'External_LogOnly'); }");
fs.writeFileSync('src/components/services/ServiceCard.tsx', cardCode);
