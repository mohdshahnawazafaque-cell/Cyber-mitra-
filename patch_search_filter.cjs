const fs = require('fs');
let code = fs.readFileSync('src/components/common/SmartSearch.tsx', 'utf8');

// I need to change how the search filters works. Right now it says:
// const matchesTitle = item.title.toLowerCase().includes(normalizedQuery);
// const matchesTags = item.tags.some((tag) => tag.toLowerCase() === normalizedQuery || tag.toLowerCase().includes(normalizedQuery));
// return matchesTitle || matchesTags;

// But users might be searching in Hindi or English, and we stripped out `item.subtitle` from the search which often contains important keywords. 
// Let's add subtitle back, BUT make it only match if it actually includes the word, to prevent the strict search from being too strict.
code = code.replace(
  'const matchesTitle = item.title.toLowerCase().includes(normalizedQuery);',
  'const matchesTitle = item.title.toLowerCase().includes(normalizedQuery) || item.subtitle.toLowerCase().includes(normalizedQuery);'
);

fs.writeFileSync('src/components/common/SmartSearch.tsx', code);
console.log("Patched search filters to include subtitle");
