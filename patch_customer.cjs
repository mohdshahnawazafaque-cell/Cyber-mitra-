const fs = require('fs');
let code = fs.readFileSync('src/services/storageService.ts', 'utf8');

code = code.replace("address: 'Sirs Tola ward 12',", "address: '',");
code = code.replace("villageTown: 'Tambour',", "villageTown: '',");
code = code.replace("district: 'Sitapur',", "district: '',");
code = code.replace("pincode: '261208',", "pincode: '',");
code = code.replace("mobile: '9956078419',", "mobile: '',");

fs.writeFileSync('src/services/storageService.ts', code);
console.log("Patched storageService.ts");
