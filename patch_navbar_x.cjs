const fs = require('fs');
let code = fs.readFileSync('src/components/layout/Navbar.tsx', 'utf8');

const inputReplacement = `<div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600" />
              <input
                id="btn-search-trigger"
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); if (!isSidebarOpen) onOpenSearch(); }}
                onFocus={onOpenSearch}
                placeholder={isHindi ? 'खोजें: आधार, पैन, आय, निवास, फोटो रिसाइज, फॉर्म...' : 'Search Aadhaar, PAN, Certificates, Photo tools...'}
                className="w-full pl-10 pr-12 py-2 bg-slate-100/90 hover:bg-slate-200/90 focus:bg-white text-slate-800 rounded-xl text-xs sm:text-sm border border-slate-200 focus:border-blue-500 transition-all shadow-2xs outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              {!searchQuery && (
                <kbd className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-semibold bg-white text-slate-500 rounded-md border border-slate-200 shadow-2xs">
                  Ctrl+K
                </kbd>
              )}
            </div>`;

// Search for the existing div.relative containing the input
const start = code.indexOf('<div className="relative">');
const end = code.indexOf('</div>', start) + 6;
if (start !== -1 && end !== -1) {
    code = code.substring(0, start) + inputReplacement + code.substring(end);
    fs.writeFileSync('src/components/layout/Navbar.tsx', code);
    console.log("Patched Navbar X button");
}
