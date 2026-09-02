const fs = require('fs');
let code = fs.readFileSync('src/components/tools/VanshavaliCertificate.tsx', 'utf8');
code = code.replace(/import React, \{ useState, useRef \} from 'react';\\nimport \{ printElement \} from '\.\.\/\.\.\/utils\/printUtils'; from 'react';/, 
"import React, { useState, useRef } from 'react';\nimport { printElement } from '../../utils/printUtils';");
// Let's just do a simpler replace
code = code.replace("import { printElement } from '../../utils/printUtils'; from 'react';", "import { printElement } from '../../utils/printUtils';");
fs.writeFileSync('src/components/tools/VanshavaliCertificate.tsx', code);
