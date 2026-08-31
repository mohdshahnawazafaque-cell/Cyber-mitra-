const fs = require('fs');
let code = fs.readFileSync('src/components/common/SmartSearch.tsx', 'utf8');

// Strict search logic
code = code.replace(
  'const matchesTitle = item.title.toLowerCase().includes(normalizedQuery);',
  'const matchesTitle = item.title.toLowerCase().includes(normalizedQuery);'
);
// Make sure it doesn't match subtitle or loosely match tags
code = code.replace(
  'return matchesTitle || matchesTags;',
  'return matchesTitle || item.tags.some(t => t.toLowerCase() === normalizedQuery);' // strict tag match or title includes
);

// Remove the "activeFilter !== 'all'" block from empty state if it's there
const filterBtnRegex = /\{activeFilter !== 'all' && \([\s\S]*?\}\)/m;
code = code.replace(filterBtnRegex, '');

fs.writeFileSync('src/components/common/SmartSearch.tsx', code);
console.log("Patched SmartSearch strict");
