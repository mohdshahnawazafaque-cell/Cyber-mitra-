const fs = require('fs');

let code = fs.readFileSync('src/data/initialData.ts', 'utf8');

// For Aadhaar
code = code.replace(/newApply:\s*'https:\/\/appointments\.uidai\.gov\.in\/easearch\.aspx',\n\s*apply:\s*'https:\/\/myaadhaar\.uidai\.gov\.in\/genricPVC',/, '');

// For PAN Card
code = code.replace(/newApply:\s*'https:\/\/www\.onlineservices\.nsdl\.com\/paam\/endUserRegisterContact\.html',\n\s*apply:\s*'https:\/\/www\.pan\.utiitsl\.com\/PAN_ONLINE\/panTracker\.do',/, '');

fs.writeFileSync('src/data/initialData.ts', code);
