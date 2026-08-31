const fs = require('fs');
let code = fs.readFileSync('src/components/admin/AdminPanel.tsx', 'utf8');

// Update Email Hint
code = code.replace(
  'placeholder="admin@example.com"',
  'placeholder="koi bhi email likhein (e.g. admin)"'
);

// Update Password Hint
code = code.replace(
  'placeholder="••••••••"',
  'placeholder="admin"'
);

fs.writeFileSync('src/components/admin/AdminPanel.tsx', code);
