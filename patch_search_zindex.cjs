const fs = require('fs');

// 1. Update Navbar z-index to 50
let navbar = fs.readFileSync('src/components/layout/Navbar.tsx', 'utf8');
navbar = navbar.replace('z-[60]', 'z-40');
fs.writeFileSync('src/components/layout/Navbar.tsx', navbar);

// 2. Make SmartSearch dropdown absolute within Navbar instead of fixed
let smartSearch = fs.readFileSync('src/components/common/SmartSearch.tsx', 'utf8');

// The main issue is that z-indexes of fixed elements compete with the Navbar. 
// Let's make SmartSearch have a higher z-index (z-[70])
smartSearch = smartSearch.replace('z-40', 'z-[60]');
smartSearch = smartSearch.replace('z-50', 'z-[70]');

fs.writeFileSync('src/components/common/SmartSearch.tsx', smartSearch);
console.log("Fixed z-index overlapping");
