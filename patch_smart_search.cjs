const fs = require('fs');
let code = fs.readFileSync('src/components/common/SmartSearch.tsx', 'utf8');

const targetStr = `                <button
                  key={item.id}
                  data-item-index={index}
                  onClick={() => handleExecute(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={\`w-full text-left flex items-center gap-3 p-3 transition-colors border-b border-slate-100 last:border-0 \${
                    isSelected ? 'bg-indigo-50/80' : 'hover:bg-slate-50'
                  }\`}`;

const replacement = `                {item.type === 'service' && item.url ? (
                <a
                  key={item.id}
                  data-item-index={index}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => { e.stopPropagation(); onOpenServiceLink(item.url, item.title); onClose(); }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={\`w-full text-left flex items-center gap-3 p-3 transition-colors border-b border-slate-100 last:border-0 \${
                    isSelected ? 'bg-indigo-50/80' : 'hover:bg-slate-50'
                  }\`}
                  style={{ display: 'flex' }}
                >
                  <div className={\`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center shadow-sm \${
                    isSelected ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'
                  }\`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={\`font-bold text-[13px] truncate \${isSelected ? 'text-indigo-800' : 'text-slate-800'}\`}>
                      {item.title}
                    </div>
                    {item.subtitle && (
                      <div className="text-[10px] text-slate-500 truncate mt-0.5">
                        {item.subtitle}
                      </div>
                    )}
                  </div>
                </a>
                ) : (
                <button
                  key={item.id}
                  data-item-index={index}
                  onClick={() => handleExecute(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={\`w-full text-left flex items-center gap-3 p-3 transition-colors border-b border-slate-100 last:border-0 \${
                    isSelected ? 'bg-indigo-50/80' : 'hover:bg-slate-50'
                  }\`}
                >`;

code = code.replace(targetStr, replacement);
code = code.replace(`                </button>\n              );`, `                </button>\n                )}\n              );`);

fs.writeFileSync('src/components/common/SmartSearch.tsx', code);
console.log("Patched SmartSearch.tsx");
