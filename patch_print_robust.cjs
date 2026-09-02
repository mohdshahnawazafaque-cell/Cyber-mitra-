const fs = require('fs');

let code = fs.readFileSync('src/components/apps/ApplicationBuilder.tsx', 'utf8');

const newHandlePrint = `const handlePrint = () => {
    const printContent = printAreaRef.current;
    if (!printContent) return;
    
    const printContainer = document.createElement('div');
    printContainer.id = 'temp-print-container';
    // Copy the outerHTML so it includes the classes of the main container itself
    printContainer.innerHTML = printContent.outerHTML;
    document.body.appendChild(printContainer);
    
    const style = document.createElement('style');
    style.innerHTML = \`
      @media print {
        body > *:not(#temp-print-container) {
          display: none !important;
        }
        #temp-print-container {
          display: block !important;
          margin: 0;
          padding: 0;
        }
        /* Hide the print button inside the cloned content if it exists */
        #temp-print-container button {
          display: none !important;
        }
      }
      @media screen {
        #temp-print-container {
          display: none !important;
        }
      }
    \`;
    document.head.appendChild(style);
    
    window.print();
    
    setTimeout(() => {
      if (document.body.contains(printContainer)) document.body.removeChild(printContainer);
      if (document.head.contains(style)) document.head.removeChild(style);
    }, 1000);
  };`;

code = code.replace(/const handlePrint = \(\) => \{[\s\S]*?setTimeout\(\(\) => \{\n      document\.head\.removeChild\(style\);\n    \}, 1000\);\n  \};/, newHandlePrint);

fs.writeFileSync('src/components/apps/ApplicationBuilder.tsx', code);
