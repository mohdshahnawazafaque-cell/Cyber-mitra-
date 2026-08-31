const fs = require('fs');

let code = fs.readFileSync('src/components/services/ServicesDashboard.tsx', 'utf8');

// 1. Add import
if (!code.includes('SponsoredBanner')) {
  code = code.replace(
    "import { PromoBanner } from '../common/PromoBanner';",
    "import { PromoBanner } from '../common/PromoBanner';\nimport { SponsoredBanner } from '../ads/SponsoredBanner';"
  );
}

// 2. Add component at the top of return statement
const returnRegex = /return \(\s*<div className="space-y-6">/;
if (code.match(returnRegex)) {
  code = code.replace(
    returnRegex,
    `return (\n    <div className="space-y-6">\n      {/* 0. SPONSORED BANNER */}\n      <SponsoredBanner />`
  );
} else {
  console.log("Could not find return statement in ServicesDashboard.tsx");
}

fs.writeFileSync('src/components/services/ServicesDashboard.tsx', code);
console.log("Patched ServicesDashboard.tsx");
