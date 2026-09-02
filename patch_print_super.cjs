const fs = require('fs');
let code = fs.readFileSync('src/components/apps/ApplicationBuilder.tsx', 'utf8');

code = code.replace(/const handlePrint = \(\) => \{\n\s*window\.print\(\);\n\s*\};/, 
`const handlePrint = () => {
    const printContent = printAreaRef.current;
    if (!printContent) return;
    
    const previous = document.getElementById('temp-print-container');
    if (previous) previous.remove();
    
    const previousStyle = document.getElementById('temp-print-style');
    if (previousStyle) previousStyle.remove();

    const printContainer = document.createElement('div');
    printContainer.id = 'temp-print-container';
    
    // Copy the outerHTML so we keep the layout classes
    printContainer.innerHTML = printContent.outerHTML;
    document.body.appendChild(printContainer);
    
    const style = document.createElement('style');
    style.id = 'temp-print-style';
    style.innerHTML = \`
      @media print {
        body > *:not(#temp-print-container) {
          display: none !important;
        }
        #temp-print-container {
          display: block !important;
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          background: white;
          margin: 0;
          padding: 0;
        }
        #temp-print-container > div {
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
          margin: 0 !important;
          width: 100% !important;
          max-width: none !important;
        }
        @page {
          margin: 20mm;
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
  };`);

fs.writeFileSync('src/components/apps/ApplicationBuilder.tsx', code);
