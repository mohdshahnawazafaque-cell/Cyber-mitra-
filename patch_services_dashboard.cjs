const fs = require('fs');
let code = fs.readFileSync('src/components/services/ServicesDashboard.tsx', 'utf8');

// The "popular services" links
code = code.replace(/<a\s*key=\{service\.id\}\s*href=\{service\.officialLinks\.officialPortal \|\| service\.officialLinks\.apply \|\| service\.officialLinks\.download \|\| '#'\}\s*target="_blank"\s*rel="noopener noreferrer"\s*onClick=\{\(e\) => \{\s*const url = service\.officialLinks\.officialPortal \|\| service\.officialLinks\.apply \|\| service\.officialLinks\.download \|\| '#';\s*if \(url === '#'\) e\.preventDefault\(\);\s*\}\}\s*className="bg-slate-800[\s\S]*?<\/a>/g, 
(match) => {
  return `<button
              key={service.id}
              onClick={(e) => {
                e.preventDefault();
                const url = service.officialLinks.officialPortal || service.officialLinks.apply || service.officialLinks.download || '#';
                if (url === '#') { alert(isHindi ? 'यह लिंक जल्द ही सक्रिय होगा' : 'Link will be available soon'); }
                else { onOpenLink(url, isHindi ? service.titleHi : service.titleEn, 'Apply'); }
              }}
              className="bg-slate-800 hover:bg-slate-900 text-white p-4 rounded-xl flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{service.icon || '🏛️'}</span>
                <span className="font-bold text-sm">{isHindi ? service.titleHi : service.titleEn}</span>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
            </button>`;
});

// The common forms direct links
code = code.replace(/<a\s*href=\{f\.directLink\}\s*target="_blank"\s*rel="noopener noreferrer"\s*className="w-full py-1\.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1\.5 transition-colors"\s*>\s*<Download className="w-3\.5 h-3\.5" \/>\s*<span>\{isHindi \? 'डाउनलोड' : 'Download'\}<\/span>\s*<\/a>/g, 
`<button
                  onClick={(e) => {
                    e.preventDefault();
                    if (!f.directLink || f.directLink === '#') { alert(isHindi ? 'यह लिंक जल्द ही सक्रिय होगा' : 'Link will be available soon'); }
                    else { onOpenLink(f.directLink, isHindi ? f.titleHi : f.titleEn, 'Download_Form'); }
                  }}
                  className="w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'डाउनलोड' : 'Download'}</span>
                </button>`);

fs.writeFileSync('src/components/services/ServicesDashboard.tsx', code);
