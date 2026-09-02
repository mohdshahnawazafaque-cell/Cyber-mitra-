const fs = require('fs');
let code = fs.readFileSync('src/components/print/PrintCenter.tsx', 'utf8');

code = code.replace(/const handlePrintSheet = \(dataUrl: string\) => \{[\s\S]*?\}\s*win\.document\.write\([\s\S]*?<\/html>\\n    \`\);\s*\};/, 
`const handlePrintSheet = (dataUrl: string) => {
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(\`
        <html>
          <head>
            <title>CYBER CAFE MITRA PRINT</title>
            <style>
              @page { margin: 0; size: auto; }
              body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; }
              img { max-width: 100%; height: auto; display: block; }
            </style>
          </head>
          <body onload="window.print(); window.close();">
            <img src="\${dataUrl}" />
          </body>
        </html>
      \`);
    } else {
      // Fallback if popup blocked
      const previous = document.getElementById('temp-print-container');
      if (previous) previous.remove();
      const previousStyle = document.getElementById('temp-print-style');
      if (previousStyle) previousStyle.remove();

      const printContainer = document.createElement('div');
      printContainer.id = 'temp-print-container';
      printContainer.innerHTML = \`<img src="\${dataUrl}" style="max-width: 100%; height: auto; display: block; margin: 0 auto;" />\`;
      document.body.appendChild(printContainer);
      
      const style = document.createElement('style');
      style.id = 'temp-print-style';
      style.innerHTML = \`
        @media print {
          body > *:not(#temp-print-container) { display: none !important; }
          #temp-print-container {
            display: flex !important; justify-content: center; align-items: center;
            position: absolute; left: 0; top: 0; width: 100%; background: white; margin: 0; padding: 0;
          }
          @page { margin: 0; }
        }
        @media screen { #temp-print-container { display: none !important; } }
      \`;
      document.head.appendChild(style);
      
      window.print();
      
      setTimeout(() => {
        if (document.body.contains(printContainer)) document.body.removeChild(printContainer);
        if (document.head.contains(style)) document.head.removeChild(style);
      }, 1000);
    }
  };`);

fs.writeFileSync('src/components/print/PrintCenter.tsx', code);
