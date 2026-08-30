import fs from 'fs';
let code = fs.readFileSync('src/components/tools/A4PhotoGenerator.tsx', 'utf8');

const printFunc = `
  const handlePrintPage = (pageIndex: number) => {
    const win = window.open('', '_blank');
    if (!win) {
      alert(isHindi ? 'कृपया पॉप-अप ब्लॉकर्स को बंद करें' : 'Please disable pop-up blockers');
      return;
    }
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
          <img src="\${pages[pageIndex]}" />
        </body>
      </html>
    \`);
    win.document.close();
  };

  const handleDownloadPage =`;

code = code.replace("  const handleDownloadPage =", printFunc);

code = code.replace(
  "onClick={() => {\n                      onSendToPrintQueue(`A4_Sheet_${currentPage + 1}`, pages[currentPage], 'A4');\n                      showToast(isHindi ? `पेज ${currentPage + 1} प्रिंट हेतु भेजा गया` : `Sent Page ${currentPage + 1} to Printer`);\n                    }}",
  "onClick={() => handlePrintPage(currentPage)}"
);

fs.writeFileSync('src/components/tools/A4PhotoGenerator.tsx', code);
