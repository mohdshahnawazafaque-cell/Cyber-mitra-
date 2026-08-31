const fs = require('fs');
let code = fs.readFileSync('src/components/admin/AdminPanel.tsx', 'utf8');

code = code.replace("  Edit3,\n} from 'lucide-react';", "  Edit3,\n  Image,\n  X,\n} from 'lucide-react';");

fs.writeFileSync('src/components/admin/AdminPanel.tsx', code);
console.log("Patched AdminPanel.tsx");
