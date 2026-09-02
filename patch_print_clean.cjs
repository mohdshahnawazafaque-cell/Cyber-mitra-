const fs = require('fs');

let code = fs.readFileSync('src/components/apps/ApplicationBuilder.tsx', 'utf8');

// Replace handlePrint (it might currently be the reload version)
code = code.replace(
  /const handlePrint = \(\) => \{[\s\S]*?\/\/ Restore original content and reload state to reattach React listeners\n    window\.location\.reload\(\);\n  \};/,
  `const handlePrint = () => {
    const style = document.createElement('style');
    style.innerHTML = \`
      @media print {
        body * {
          visibility: hidden;
        }
        #print-application-area, #print-application-area * {
          visibility: visible;
        }
        #print-application-area {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          margin: 0;
          padding: 20px;
          border: none;
          box-shadow: none;
        }
      }
    \`;
    document.head.appendChild(style);
    window.print();
    setTimeout(() => {
      document.head.removeChild(style);
    }, 1000);
  };`
);

// We need to add ID 'print-application-area' to the div that has printAreaRef
code = code.replace(/<div\n            ref=\{printAreaRef\}/, `<div\n            id="print-application-area"\n            ref={printAreaRef}`);

fs.writeFileSync('src/components/apps/ApplicationBuilder.tsx', code);
