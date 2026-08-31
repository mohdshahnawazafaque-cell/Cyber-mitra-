const fs = require('fs');
let code = fs.readFileSync('src/components/services/ServicesDashboard.tsx', 'utf8');

const targetStr = `            <button
              key={service.id}
              onClick={() =>
                onOpenLink(
                  service.officialLinks.officialPortal ||
                    service.officialLinks.apply ||
                    service.officialLinks.download ||
                    '#',
                  isHindi ? service.titleHi : service.titleEn,
                  'Quick Launch'
                )
              }
              className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-blue-50 hover:border-blue-300 transition-all text-left group flex flex-col justify-between hover:shadow-sm"
            >`;

const replacement = `            <a
              key={service.id}
              href={service.officialLinks.officialPortal || service.officialLinks.apply || service.officialLinks.download || '#'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                const url = service.officialLinks.officialPortal || service.officialLinks.apply || service.officialLinks.download || '#';
                if (url === '#') e.preventDefault();
                onOpenLink(
                  url,
                  isHindi ? service.titleHi : service.titleEn,
                  'Logged'
                );
              }}
              className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-blue-50 hover:border-blue-300 transition-all text-left group flex flex-col justify-between hover:shadow-sm"
            >`;

code = code.replace(targetStr, replacement);
code = code.replace(`</button>\n          ))}\n        </div>`, `</a>\n          ))}\n        </div>`);
fs.writeFileSync('src/components/services/ServicesDashboard.tsx', code);
console.log("Patched ServicesDashboard.tsx");
