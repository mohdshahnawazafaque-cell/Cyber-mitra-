import fs from 'fs';
let code = fs.readFileSync('src/components/layout/Sidebar.tsx', 'utf8');

code = code.replace(
  /\{\s*\{\s*id: 'bulk_sms'/g,
  "{ id: 'bulk_sms'"
);

fs.writeFileSync('src/components/layout/Sidebar.tsx', code);
