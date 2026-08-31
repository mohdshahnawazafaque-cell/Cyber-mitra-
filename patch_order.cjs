const fs = require('fs');

let code = fs.readFileSync('src/components/tools/AwasCertificate.tsx', 'utf8');

// We need to reorder the blocks: Janpad, then Nagar Nikay, then Mohalla
// Currently it is Mohalla, Nagar Nikay, Janpad.

// Let's extract the form section that contains these three fields
const formRegex = /(\{\/\*\s*Mohalla \/ Gram\s*\*\/\}[\s\S]*?)(\{\/\*\s*Nagar Nikay\s*\*\/\}[\s\S]*?)(\{\/\*\s*Janpad\s*\*\/\}[\s\S]*?)(?=\{\/\*\s*Mobile Number\s*\*\/})/;

const match = code.match(formRegex);
if (match) {
  const mohallaBlock = match[1];
  const nagarNikayBlock = match[2];
  let janpadBlock = match[3];

  // Modify Nagar Nikay block to be disabled if !district
  let newNagarNikayBlock = nagarNikayBlock.replace(
    /className=\{\`w-full px-4/, 
    'disabled={!district} className={`w-full px-4 disabled:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 '
  );

  // Modify Mohalla block to be disabled if !nagarNikay
  let newMohallaBlock = mohallaBlock.replace(
    /className=\{\`w-full px-4/,
    'disabled={!nagarNikay} className={`w-full px-4 disabled:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 '
  );

  // Combine in new order: Janpad -> Nagar Nikay -> Mohalla
  const newOrder = janpadBlock + newNagarNikayBlock + newMohallaBlock;

  code = code.replace(formRegex, newOrder);
  fs.writeFileSync('src/components/tools/AwasCertificate.tsx', code);
  console.log("Patched successfully");
} else {
  console.log("Could not find the blocks to reorder");
}
