const fs = require('fs');
let code = fs.readFileSync('src/components/tools/AwasCertificate.tsx', 'utf8');

code = code.replace(/import React, \{ useState, useRef \} from 'react';/, "import React, { useState, useRef } from 'react';\nimport { printElement } from '../../utils/printUtils';");

code = code.replace(/const handlePrint = \(\) => \{\n\s*if \(validateForm\(\)\) \{\n\s*window\.print\(\);\n\s*\}\n\s*\};/, 
`const handlePrint = () => {
    if (validateForm()) {
      if (previewRef.current) {
        printElement(previewRef.current, '@page { margin: 10mm; }');
      } else {
        window.print();
      }
    }
  };`);

fs.writeFileSync('src/components/tools/AwasCertificate.tsx', code);
