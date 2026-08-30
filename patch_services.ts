import fs from 'fs';
let content = fs.readFileSync('src/components/services/ServicesDashboard.tsx', 'utf8');

// 1. Add prop to interface
content = content.replace(
  'onNavigate?: (view: string, subCategory?: string) => void;',
  'onNavigate?: (view: string, subCategory?: string) => void;\n  onOpenSearch?: () => void;'
);

// 2. Add prop to component destructing
content = content.replace(
  'onApplyPreset,\n  onNavigate,\n}) => {',
  'onApplyPreset,\n  onNavigate,\n  onOpenSearch,\n}) => {'
);

// 3. Modify Search Bar area
const searchReplacement = `
      {/* 1. Global Search Bar (Prominent) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm sticky top-16 z-20">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative w-full flex-1 flex items-center">
            <Search className="w-5 h-5 text-blue-600 absolute left-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isHindi
                  ? 'सरकारी पोर्टल यहाँ खोजें (जैसे- आय प्रमाण पत्र, खतौनी, पैन कार्ड)...'
                  : 'Search Govt Portals (e.g. Income Certificate, PAN, Bhulekh)...'
              }
              className="w-full pl-11 pr-10 py-3.5 border border-slate-300 rounded-xl text-sm sm:text-base font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none bg-slate-50 focus:bg-white transition-all shadow-inner"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 p-1.5 bg-slate-200 text-slate-600 hover:bg-slate-300 rounded-lg transition-colors"
                title="Clear Search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {onOpenSearch && (
            <button
              onClick={onOpenSearch}
              className="sm:w-auto w-full px-5 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm transition-colors shrink-0"
            >
              <Search className="w-4 h-4 text-slate-300" />
              {isHindi ? 'सभी टूल्स भी खोजें' : 'Global Search Tool'}
            </button>
          )}
        </div>
        <div className="text-[11px] font-semibold text-slate-500 mt-2 ml-1">
          {isHindi ? 'सुझाव: आधार, खसरा, बिजली बिल, लेबर कार्ड' : 'Popular searches: Aadhaar, Electricity Bill, PAN Card, Labour Card'}
        </div>
      </div>
`;

content = content.replace(
  /<div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm sticky top-16 z-20">[\s\S]*?<\/div>\s*<\/div>/,
  searchReplacement.trim()
);

fs.writeFileSync('src/components/services/ServicesDashboard.tsx', content);
