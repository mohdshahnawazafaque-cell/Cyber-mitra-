const fs = require('fs');
let code = fs.readFileSync('src/components/common/SmartSearch.tsx', 'utf8');

// 1. Update Props
code = code.replace(
  'onOpenServiceLink: (url: string, serviceTitle: string) => void;',
  'onOpenServiceLink: (url: string, serviceTitle: string) => void;\n  searchQuery: string;\n  setSearchQuery: (val: string) => void;'
);

code = code.replace(
  'onOpenServiceLink,\n}) => {',
  'onOpenServiceLink,\n  searchQuery,\n  setSearchQuery,\n}) => {'
);

// 2. Remove internal query state
code = code.replace('const [query, setQuery] = useState(\'\');', '');

// 3. Replace all uses of `query` with `searchQuery` and `setQuery` with `setSearchQuery`
// Actually just replace all `query` (standalone) to `searchQuery` inside the component
// Since we removed `query`, let's just do text replaces.
code = code.replace(/query\.toLowerCase\(\)/g, 'searchQuery.toLowerCase()');
code = code.replace(/query\.trim\(\)/g, 'searchQuery.trim()');
code = code.replace(/setQuery\(''\)/g, 'setSearchQuery(\'\')');
code = code.replace(/setQuery\(/g, 'setSearchQuery(');

// 4. In useEffect for isOpen, we have `setQuery('')`. It's now `setSearchQuery('')`.
// We removed the inputRef focus from SmartSearch, since Navbar holds the input.
code = code.replace('setTimeout(() => inputRef.current?.focus(), 50);', '');

// 5. Remove the top search input box from render
// Search for `{/* Top Search Input Box */}` and its `</div>`
const renderStart = code.indexOf('{/* Top Search Input Box */}');
const renderEnd = code.indexOf('{/* Filter Navigation Chips */}');
if (renderStart !== -1 && renderEnd !== -1) {
    code = code.substring(0, renderStart) + code.substring(renderEnd);
}

// 6. Adjust the backdrop and positioning. 
// It was: <div className="fixed inset-0 z-50 flex items-start justify-center pt-14 sm:pt-16 px-4 transition-all duration-200"
// Change it so it has a transparent backdrop, or just less dim backdrop so the Navbar is visible (Navbar is z-[60]).
// Wait, the backdrop is `fixed inset-0`, which covers the screen. If Navbar is z-60, it will sit on top of this.
// So we can keep it exactly as is, maybe just add `pt-20` so it sits below the Navbar.
code = code.replace(
  'pt-14 sm:pt-16 px-4',
  'pt-20 px-4 bg-slate-950/20'
);

// Also remove `inputRef` declaration
code = code.replace('const inputRef = useRef<HTMLInputElement>(null);', '');

fs.writeFileSync('src/components/common/SmartSearch.tsx', code);
console.log("Patched SmartSearch");
