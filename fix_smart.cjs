const fs = require('fs');
let code = fs.readFileSync('src/components/common/SmartSearch.tsx', 'utf8');

code = code.replace("                </button>\\n                )}\\n              );", "                </button>\\n              );");
// wait, I'll just use a regex replace
code = code.replace(/<\/button>\s*\}\)\s*\);/g, "</button>\n                )}\n              );");

