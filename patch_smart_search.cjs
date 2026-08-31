const fs = require('fs');
let code = fs.readFileSync('src/components/common/SmartSearch.tsx', 'utf8');

// 1. Remove quick pills entirely
const quickPillsRegex = /const quickPills = \[[\s\S]*?\];/;
code = code.replace(quickPillsRegex, '');

// 2. Remove the activeFilter chips (they just clutter if they want exact search)
// Actually, let's keep the filters but make the logic strict.
code = code.replace(
  'const matchesSubtitle = item.subtitle.toLowerCase().includes(normalizedQuery);',
  '// removed subtitle matching'
);
code = code.replace(
  'return matchesTitle || matchesSubtitle || matchesTags;',
  'return matchesTitle || matchesTags;'
);

// 3. Make sure it ONLY renders if searchQuery has text
code = code.replace(
  'if (!isOpen || !searchQuery.trim()) return null;',
  'if (!isOpen || !searchQuery.trim()) return null;'
);

// 4. Update the empty state to not show quick pills or suggestions, just "No results"
const emptyStateRegex = /\{filteredItems\.length === 0 \? \([\s\S]*?\) : \(/m;
const newEmptyState = `{filteredItems.length === 0 ? (
            <div className="p-8 text-center flex flex-col items-center justify-center">
              <p className="text-sm font-bold text-slate-700">
                {isHindi ? 'कोई परिणाम नहीं मिला' : 'No matching results found'}
              </p>
            </div>
          ) : (`;
// code = code.replace(emptyStateRegex, newEmptyState);

fs.writeFileSync('src/components/common/SmartSearch.tsx', code);
console.log("Patched SmartSearch");
