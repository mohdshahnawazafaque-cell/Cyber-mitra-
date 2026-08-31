const fs = require('fs');
let code = fs.readFileSync('src/components/admin/AdminPanel.tsx', 'utf8');

const oldLoginRegex = /const isEmailValid = true; \/\/ allow any for now to prevent issues[\s\S]*?passwordInput === 'cybermitra';/m;

const newLogin = `    const isEmailValid = cleanEmail === cleanCurrentEmail || cleanEmail === 'mohdshahnawaz.afaque@gmail.com';
    const isPassValid = passwordInput === currentPass || passwordInput === 'Sh@sahiba9653';`;

code = code.replace(oldLoginRegex, newLogin);

// Also restore placeholders if needed
code = code.replace(
  /placeholder="koi bhi email likhein \(e.g. admin\)"/g,
  'placeholder="mohdshahnawaz.afaque@gmail.com"'
);
code = code.replace(
  /placeholder="admin"/g,
  'placeholder="••••••••"'
);

fs.writeFileSync('src/components/admin/AdminPanel.tsx', code);
