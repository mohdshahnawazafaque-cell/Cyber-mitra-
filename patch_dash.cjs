const fs = require('fs');
let code = fs.readFileSync('src/components/services/ServicesDashboard.tsx', 'utf8');

code = code.replace(
  'import { GovernmentService, Language } from \'../../types\';',
  'import { GovernmentService, Language, PromoItem } from \'../../types\';\nimport { PromoBanner } from \'../common/PromoBanner\';'
);

code = code.replace(
  'services: GovernmentService[];',
  'services: GovernmentService[];\n  promos: PromoItem[];'
);

code = code.replace(
  'onOpenSearch?: () => void;\n}',
  'onOpenSearch?: () => void;\n}'
);

code = code.replace(
  'onOpenSearch,\n}) => {',
  'onOpenSearch,\n  promos,\n}) => {'
);

const promoRegex = /\{\/\* PROMOTIONAL BANNERS CAROUSEL \*\/\}[\s\S]*?\{\/\* 3\. QUICK OPERATOR TOOLS \(PRO-TOOLS\) \*\/\}/m;
code = code.replace(promoRegex, '<PromoBanner promos={promos} />\n\n      {/* 3. QUICK OPERATOR TOOLS (PRO-TOOLS) */}');

fs.writeFileSync('src/components/services/ServicesDashboard.tsx', code);
console.log("Patched ServicesDashboard.tsx");
