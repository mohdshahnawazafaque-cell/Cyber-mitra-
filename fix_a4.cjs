const fs = require('fs');

let code = fs.readFileSync('src/components/tools/AwasCertificate.tsx', 'utf8');

// Replace the preview wrapper and container
const oldWrapper = /<div \s*className="print-exact bg-white shadow-2xl relative w-\[210mm\] min-h-\[297mm\] mx-auto text-black font-serif"[\s\S]*?ref=\{previewRef\}\s*>/;

const newWrapper = `<div 
            className="print-exact bg-white shadow-2xl relative mx-auto text-black font-serif flex flex-col"
            style={{ 
              width: '794px',
              height: '1123px', // Exact A4 aspect ratio at 96dpi
              transform: 'scale(0.65)', // Scaled down for screen
              transformOrigin: 'top center',
              marginBottom: '-390px' // Compensate for scale(0.65)
            }}
            ref={previewRef}
          >`;

code = code.replace(oldWrapper, newWrapper);

// Fix the padding and flex layout of the inner container
const oldInner = /\{\/\* Header Content \*\/}\s*<div className="pt-10 px-12 pb-6 relative">/;
const newInner = `{/* Header Content */}
            <div className="pt-12 px-14 pb-12 relative flex flex-col h-full">`;
code = code.replace(oldInner, newInner);

// Make the comment box flex-1 so it takes remaining space, pushing signatures to bottom
const oldCommentBox = /\{\/\* Comment Box \*\/}\s*<div className="w-full border-\[1.5px\] border-black min-h-\[160px\] p-2 mb-12">/;
const newCommentBox = `{/* Comment Box */}
              <div className="w-full border-[1.5px] border-black flex-1 p-3 mb-10 flex flex-col">`;
code = code.replace(oldCommentBox, newCommentBox);

const oldSignatures = /\{\/\* Signatures \*\/}\s*<div className="flex justify-between items-start px-2 text-center pb-8">/;
const newSignatures = `{/* Signatures */}
              <div className="flex justify-between items-end px-2 text-center shrink-0">`;
code = code.replace(oldSignatures, newSignatures);

// Fix the print CSS
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
