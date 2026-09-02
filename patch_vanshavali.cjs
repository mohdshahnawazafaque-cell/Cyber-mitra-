const fs = require('fs');
let code = fs.readFileSync('src/components/tools/VanshavaliCertificate.tsx', 'utf8');

if (!code.includes('printElement')) {
  code = code.replace(/import React, \{ useState, useRef \}/, "import React, { useState, useRef } from 'react';\nimport { printElement } from '../../utils/printUtils';");
}

code = code.replace(/const handlePrint = \(\) => \{\n\s*window\.print\(\);\n\s*\};/, 
`const handlePrint = () => {
    if (previewRef.current) {
      printElement(previewRef.current, '@page { margin: 10mm; }');
    } else {
      window.print();
    }
  };`);

fs.writeFileSync('src/components/tools/VanshavaliCertificate.tsx', code);
