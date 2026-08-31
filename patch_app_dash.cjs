const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  '<ServicesDashboard',
  '<ServicesDashboard\n          promos={appState.promos || []}'
);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx for promos");
