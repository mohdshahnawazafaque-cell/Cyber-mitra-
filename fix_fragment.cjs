const fs = require('fs');
let code = fs.readFileSync('src/components/common/SmartSearch.tsx', 'utf8');

code = code.replace(
  /<\/div>\s*\);\s*};\s*$/,
  '</div>\n    </>\n  );\n};\n'
);

fs.writeFileSync('src/components/common/SmartSearch.tsx', code);
console.log("Fixed fragment");
