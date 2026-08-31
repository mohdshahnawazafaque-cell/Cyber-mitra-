const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  'isOpen={isSearchOpen}',
  'isOpen={isSearchOpen && searchQuery.trim().length > 0}'
);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx");
