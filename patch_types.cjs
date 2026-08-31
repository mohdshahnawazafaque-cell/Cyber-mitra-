const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

const newTypes = `export interface PromoItem {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  linkUrl: string;
  isActive: boolean;
  order: number;
}
`;

if (!code.includes('export interface PromoItem')) {
  // insert right before AppState
  code = code.replace('export interface AppState', newTypes + '\nexport interface AppState');
  
  // add to AppState
  code = code.replace(
    'applicationTemplates: ApplicationTemplate[];',
    'applicationTemplates: ApplicationTemplate[];\n  promos: PromoItem[];'
  );
  
  fs.writeFileSync('src/types.ts', code);
  console.log("Patched types.ts");
}
