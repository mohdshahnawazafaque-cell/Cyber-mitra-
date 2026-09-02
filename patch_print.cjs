const fs = require('fs');

let code = fs.readFileSync('src/components/apps/ApplicationBuilder.tsx', 'utf8');

// Replace handlePrint
code = code.replace(
  /const handlePrint = \(\) => \{\n    window\.print\(\);\n  \};/,
  `const handlePrint = () => {
    const printContent = printAreaRef.current;
    if (!printContent) return;
    
    const originalContent = document.body.innerHTML;
    const printHtml = printContent.outerHTML;
    
    document.body.innerHTML = \`
      <div style="padding: 20px; font-family: sans-serif; max-width: 800px; margin: 0 auto; color: black; background: white;">
        \${printHtml}
      </div>
    \`;
    
    window.print();
    
    // Restore original content and reload state to reattach React listeners
    window.location.reload();
  };`
);

fs.writeFileSync('src/components/apps/ApplicationBuilder.tsx', code);
