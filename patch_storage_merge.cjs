const fs = require('fs');
let code = fs.readFileSync('src/services/storageService.ts', 'utf8');

const targetStr = `const mergedServices = INITIAL_SERVICES.map(initService => {
      const existing = parsed.services?.find((s: any) => s.id === initService.id);
      return existing || initService;
    });`;

const replacement = `const mergedServices = INITIAL_SERVICES.map(initService => {
      const existing = parsed.services?.find((s: any) => s.id === initService.id);
      if (existing) {
        // Ensure officialLinks exists even if it was saved without it
        if (!existing.officialLinks) {
          existing.officialLinks = { ...initService.officialLinks };
        }
        return existing;
      }
      return initService;
    });`;

code = code.replace(targetStr, replacement);
fs.writeFileSync('src/services/storageService.ts', code);
console.log("Patched storageService.ts to ensure officialLinks");
