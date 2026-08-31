const fs = require('fs');

let code = fs.readFileSync('src/components/tools/AwasCertificate.tsx', 'utf8');

// 1. Remove the Date input block
const dateBlockRegex = /\{\/\*\s*Date\s*\*\/\}[\s\S]*?<\/div>\s*<\/div>/;
// Wait, the div ends are:
// {/* Date */}
// <div className="sm:col-span-2">
//   <label ...>प्रमाण-पत्र दिनांक</label>
//   <input type="date" ... />
// </div>

const specificDateBlock = `              {/* Date */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  प्रमाण-पत्र दिनांक
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-600 outline-none transition-all"
                />
              </div>`;

code = code.replace(specificDateBlock, '');

// Also remove `const [date, setDate] = useState...`
// And `setDate(...)` in reset if they exist, but maybe leaving them is harmless.
// Just hiding it from the UI is enough as per user's request "Formet se date praman ptra option removd karo"

fs.writeFileSync('src/components/tools/AwasCertificate.tsx', code);
console.log("Date block removed");
