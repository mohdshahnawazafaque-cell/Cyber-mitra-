import fs from 'fs';

let dashboardCode = fs.readFileSync('src/components/services/ServicesDashboard.tsx', 'utf8');

// Remove the giant top search bar completely
dashboardCode = dashboardCode.replace(/\{\/\* 1\. Global Search Bar \(Prominent\) \*\/\}(.|\n)*?\{\/\* 2\. CSC \/ Digital Seva Portal Stat Banner \*\/\}/gm, "{/* 2. CSC / Digital Seva Portal Stat Banner */}");

// In the category filters, add a local small search
const filterBarTarget = `{/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2 w-full justify-between">`;

const newFilterBar = `{/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-3 border-t border-slate-100">
          <div className="relative flex-1 w-full sm:max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isHindi ? 'इस लिस्ट में खोजें...' : 'Filter list...'}
              className="w-full pl-9 pr-8 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none bg-slate-50"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 w-full justify-between sm:w-auto">`;

dashboardCode = dashboardCode.replace(filterBarTarget, newFilterBar);

fs.writeFileSync('src/components/services/ServicesDashboard.tsx', dashboardCode);

console.log("Fixed double search bar.");
