const fs = require('fs');
let code = fs.readFileSync('src/components/tools/QuickLinksDashboard.tsx', 'utf8');

code = code.replace(/<a\s*href=\{link\.url\}\s*target="_blank"\s*rel="noreferrer"\s*className="w-full py-2 bg-slate-50 hover:bg-blue-50 text-blue-600 border border-slate-200 hover:border-blue-200 font-bold rounded-lg text-xs flex items-center justify-center gap-2 transition-colors"\s*>\s*\{isHindi \? 'वेबसाइट खोलें' : 'Open Link'\} <ExternalLink className="w-3\.5 h-3\.5" \/>\s*<\/a>/g, 
`<button
                onClick={() => {
                  const win = window.open(link.url, '_blank');
                  if (!win) {
                    alert(isHindi 
                      ? "सुरक्षा कारणों से पॉप-अप ब्लॉक हो गया है। कृपया इस लिंक को कॉपी करें और नए टैब में खोलें:\\n\\n" + link.url 
                      : "Pop-ups blocked. Please copy this link and open in a new tab:\\n\\n" + link.url);
                  }
                }}
                className="w-full py-2 bg-slate-50 hover:bg-blue-50 text-blue-600 border border-slate-200 hover:border-blue-200 font-bold rounded-lg text-xs flex items-center justify-center gap-2 transition-colors"
              >
                {isHindi ? 'वेबसाइट खोलें' : 'Open Link'} <ExternalLink className="w-3.5 h-3.5" />
              </button>`);

fs.writeFileSync('src/components/tools/QuickLinksDashboard.tsx', code);
