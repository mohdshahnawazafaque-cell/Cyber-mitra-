const fs = require('fs');
let code = fs.readFileSync('src/components/tools/A4PhotoGenerator.tsx', 'utf8');

code = code.replace(/const handlePrintPage = \(pageIndex: number\) => \{[\s\S]*?\}\s*win\.document\.write\([\s\S]*?<\/html>\\n    \`\);\s*\};/, 
`const handlePrintPage = (pageIndex: number) => {
    const dataUrl = pages[pageIndex];
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(\`
        <html>
          <head>
            <title>A4 Photo Sheet</title>
            <style>
              @page { margin: 0; size: A4 portrait; }
              body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: flex-start; }
              img { width: 100%; max-width: 210mm; max-height: 297mm; display: block; }
            </style>
          </head>
          <body onload="setTimeout(() => { window.print(); window.close(); }, 500);">
            <img src="\${dataUrl}" />
          </body>
        </html>
      \`);
    } else {
      const previous = document.getElementById('temp-print-container');
      if (previous) previous.remove();
      const previousStyle = document.getElementById('temp-print-style');
      if (previousStyle) previousStyle.remove();

      const printContainer = document.createElement('div');
      printContainer.id = 'temp-print-container';
      printContainer.innerHTML = \`<img src="\${dataUrl}" style="width: 100%; max-width: 210mm; display: block; margin: 0 auto;" />\`;
      document.body.appendChild(printContainer);
      
      const style = document.createElement('style');
      style.id = 'temp-print-style';
      style.innerHTML = \`
        @media print {
          body > *:not(#temp-print-container) { display: none !important; }
          #temp-print-container {
            display: flex !important; justify-content: center; align-items: flex-start;
            position: absolute; left: 0; top: 0; width: 100%; background: white; margin: 0; padding: 0;
          }
          @page { margin: 0; size: A4 portrait; }
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

fs.writeFileSync('src/components/tools/A4PhotoGenerator.tsx', code);
