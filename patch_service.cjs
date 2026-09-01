const fs = require('fs');
let code = fs.readFileSync('src/components/services/ServiceCard.tsx', 'utf8');

code = code.replace(/if \(links\.newApply! === '#' \|\| !links\.newApply!\) e\.preventDefault\(\); onOpenLink\(links\.newApply!, title, 'External'\);/g, "e.preventDefault(); onOpenLink(links.newApply!, title, 'External');");
code = code.replace(/if \(links\.apply! === '#' \|\| !links\.apply!\) e\.preventDefault\(\); onOpenLink\(links\.apply!, title, 'External'\);/g, "e.preventDefault(); onOpenLink(links.apply!, title, 'External');");
code = code.replace(/if \(links\.correction! === '#' \|\| !links\.correction!\) e\.preventDefault\(\); onOpenLink\(links\.correction!, title, 'External'\);/g, "e.preventDefault(); onOpenLink(links.correction!, title, 'External');");
code = code.replace(/if \(links\.status! === '#' \|\| !links\.status!\) e\.preventDefault\(\); onOpenLink\(links\.status!, title, 'External'\);/g, "e.preventDefault(); onOpenLink(links.status!, title, 'External');");
code = code.replace(/if \(links\.download! === '#' \|\| !links\.download!\) e\.preventDefault\(\); onOpenLink\(links\.download!, title, 'External'\);/g, "e.preventDefault(); onOpenLink(links.download!, title, 'External');");
code = code.replace(/if \(links\.officialPortal! === '#' \|\| !links\.officialPortal!\) e\.preventDefault\(\); onOpenLink\(links\.officialPortal!, title, 'External'\);/g, "e.preventDefault(); onOpenLink(links.officialPortal!, title, 'External');");

fs.writeFileSync('src/components/services/ServiceCard.tsx', code);
