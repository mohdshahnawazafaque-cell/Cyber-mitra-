const fs = require('fs');
let code = fs.readFileSync('src/components/common/SmartSearch.tsx', 'utf8');

// I will just replace the whole return (...) block inside the map.
// Let's find the map:
// displayedItems.map((item, index) => {
//   const isSelected = index === selectedIndex;
//   return (
//     ...
//   );
// })

// Instead of regex, I'll find where `return (` is inside `displayedItems.map`.
const lines = code.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('return (') && lines[i-1].includes('const isSelected = index === selectedIndex;')) {
        lines[i] = \`              return item.type === 'service' && item.url ? (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-item-index={index}
                  onClick={(e) => { e.stopPropagation(); onOpenServiceLink(item.url, item.title); onClose(); }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={\\\`w-full text-left p-3.5 rounded-xl transition-all flex items-center justify-between gap-3 group border \${
                    isSelected
                      ? 'bg-blue-50/90 border-blue-200/80 shadow-2xs'
                      : 'bg-white/60 hover:bg-slate-50 border-transparent'
                  }\\\`}
                >\` + lines[i+1].substring(lines[i+1].indexOf('<button') + 7);
        
        break;
    }
}
// wait, replacing just the opening tag is easier!
