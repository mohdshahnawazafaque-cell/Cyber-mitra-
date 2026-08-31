const fs = require('fs');

let code = fs.readFileSync('src/components/tools/AwasCertificate.tsx', 'utf8');

// 1. Fix the Preview Container
const oldPreviewContainer = /<div \s*className="print-exact bg-white shadow-2xl relative mx-auto text-black font-serif flex flex-col"\s*style=\{\{ \s*width: '794px',\s*height: '1123px',\s*\/\/ Exact A4 aspect ratio at 96dpi\s*transform: 'scale\(0.65\)',\s*\/\/ Scaled down for screen\s*transformOrigin: 'top center',\s*marginBottom: '-390px' \/\/ Compensate for scale\(0.65\)\s*\}\}\s*ref=\{previewRef\}\s*>/;
const newPreviewContainer = `<div 
            className="print-exact bg-white shadow-2xl relative mx-auto text-black font-serif flex flex-col shrink-0"
            style={{ 
              width: '210mm',
              minHeight: '297mm',
              padding: '20mm'
            }}
            ref={previewRef}
          >`;
code = code.replace(oldPreviewContainer, newPreviewContainer);

// 2. Fix the inner container and Comment box
const oldInner = /\{\/\* Header Content \*\/}\s*<div className="pt-12 px-14 pb-12 relative flex flex-col h-full">/;
const newInner = `{/* Header Content */}
            <div className="relative flex flex-col h-full">`;
code = code.replace(oldInner, newInner);

// Remove the massive flex-1 from comment box, make it fixed min-height
const oldCommentBox = /\{\/\* Comment Box \*\/}\s*<div className="w-full border-\[1.5px\] border-black flex-1 p-3 mb-10 flex flex-col">/;
const newCommentBox = `{/* Comment Box */}
              <div className="w-full border-[1.5px] border-black min-h-[150px] p-3 mb-12 flex flex-col">`;
code = code.replace(oldCommentBox, newCommentBox);

// 3. Fix the printing CSS logic to let the browser handle A4 scaling
const oldPrintCSS = /@media print \{[\s\S]*?\}\s*\}/;
const newPrintCSS = `@media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 0;
            background-color: white;
          }
          body * {
            visibility: hidden;
          }
          .print-exact, .print-exact * {
            visibility: visible;
          }
          .print-exact {
            position: absolute;
            left: 0;
            top: 0;
            width: 210mm !important;
            height: 297mm !important;
            transform: none !important;
            margin: 0 !important;
            padding: 20mm !important;
            box-shadow: none !important;
            border: none !important;
          }
          .print\\:hidden {
            display: none !important;
          }
        }`;
code = code.replace(oldPrintCSS, newPrintCSS);

fs.writeFileSync('src/components/tools/AwasCertificate.tsx', code);
console.log("Patched successfully");
