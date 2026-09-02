const fs = require('fs');
let code = fs.readFileSync('src/components/services/ServicesDashboard.tsx', 'utf8');

code = code.replace(/<a\s*href=\{f\.directLink\}\s*target="_blank"\s*rel="noopener noreferrer"[\s\S]*?<\/a>/g, 
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
