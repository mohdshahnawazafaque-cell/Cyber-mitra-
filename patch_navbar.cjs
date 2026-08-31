const fs = require('fs');
let code = fs.readFileSync('src/components/layout/Navbar.tsx', 'utf8');

// Modify Navbar's search input behavior
code = code.replace(
  'onChange={(e) => { setSearchQuery(e.target.value); if (!isSidebarOpen) onOpenSearch(); }}',
  'onChange={(e) => { const val = e.target.value; setSearchQuery(val); if (val.trim().length > 0 && !isSidebarOpen) onOpenSearch(); }}'
);
code = code.replace(
  'onFocus={onOpenSearch}',
  'onFocus={() => { if (searchQuery.trim().length > 0 && !isSidebarOpen) onOpenSearch(); }}'
);

fs.writeFileSync('src/components/layout/Navbar.tsx', code);
console.log("Patched Navbar");
