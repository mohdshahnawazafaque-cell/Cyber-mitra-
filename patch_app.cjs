const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('const [searchQuery, setSearchQuery]')) {
    code = code.replace(
      'const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);',
      'const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);\n  const [searchQuery, setSearchQuery] = useState<string>(\'\');'
    );
    
    // Pass it to Navbar
    code = code.replace(
      'onOpenSearch={() => setIsSearchOpen(true)}',
      'onOpenSearch={() => setIsSearchOpen(true)}\n        searchQuery={searchQuery}\n        setSearchQuery={setSearchQuery}'
    );
    
    // Pass it to SmartSearch
    code = code.replace(
      'isOpen={isSearchOpen}',
      'isOpen={isSearchOpen}\n        searchQuery={searchQuery}\n        setSearchQuery={setSearchQuery}'
    );
    
    // Add global ctrl+k to focus input
    code = code.replace(
      'setIsSearchOpen(true);',
      'setIsSearchOpen(true);\n        document.getElementById("btn-search-trigger")?.focus();'
    );
    
    fs.writeFileSync('src/App.tsx', code);
    console.log("Patched App.tsx");
} else {
    console.log("Already patched");
}
