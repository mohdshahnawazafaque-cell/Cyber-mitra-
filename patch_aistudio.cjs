const fs = require('fs');
let code = fs.readFileSync('src/components/tools/AiStudioTools.tsx', 'utf8');

if (!code.includes('printElement')) {
  code = code.replace(/import React, \{ useState \} from 'react';/, "import React, { useState, useRef } from 'react';\nimport { printElement } from '../../utils/printUtils';");
}
code = code.replace(/const \[generatedLetter, setGeneratedLetter\] = useState<string>\(''\);/, "const [generatedLetter, setGeneratedLetter] = useState<string>('');\n  const letterRef = useRef<HTMLDivElement>(null);");

code = code.replace(/onClick=\{\(\) => window\.print\(\)\}/, "onClick={() => letterRef.current ? printElement(letterRef.current, '@page { margin: 20mm; }') : window.print()}");

code = code.replace(/<div className="whitespace-pre-line text-slate-800 text-sm leading-relaxed font-normal bg-slate-50 p-5 rounded-xl border border-slate-200">/, "<div ref={letterRef} className=\"whitespace-pre-line text-slate-800 text-sm leading-relaxed font-normal bg-slate-50 p-5 rounded-xl border border-slate-200\">");

fs.writeFileSync('src/components/tools/AiStudioTools.tsx', code);
