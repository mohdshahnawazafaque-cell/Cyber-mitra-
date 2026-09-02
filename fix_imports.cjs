const fs = require('fs');

const files = [
  'src/components/tools/AwasCertificate.tsx',
  'src/components/tools/PromoDesigner.tsx',
  'src/components/tools/AiStudioTools.tsx'
];

for (const file of files) {
  let code = fs.readFileSync(file, 'utf8');
  if (!code.includes('import { printElement } from')) {
     code = code.replace(/import React, \{[^\}]+\} from 'react';/, match => match + "\nimport { printElement } from '../../utils/printUtils';");
     fs.writeFileSync(file, code);
  }
}
