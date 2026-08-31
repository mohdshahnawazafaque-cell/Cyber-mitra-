const fs = require('fs');
let code = fs.readFileSync('src/services/storageService.ts', 'utf8');

const INITIAL_PROMOS = `export const INITIAL_PROMOS: PromoItem[] = [
  {
    id: 'promo-1',
    title: 'सभी सरकारी योजनाएं',
    subtitle: 'PM किसान, पेंशन और अन्य आवेदन',
    imageUrl: 'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    linkUrl: '#',
    isActive: true,
    order: 1
  },
  {
    id: 'promo-2',
    title: 'पैन कार्ड एवं पहचान पत्र',
    subtitle: 'नया पैन कार्ड बनाएं या सुधार करें',
    imageUrl: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    linkUrl: '#',
    isActive: true,
    order: 2
  },
  {
    id: 'promo-3',
    title: 'प्रोमो डिज़ाइनर व बिलिंग',
    subtitle: 'बिज़नेस के लिए पोस्टर और बिल बनाएं',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    linkUrl: '#',
    isActive: true,
    order: 3
  },
  {
    id: 'promo-4',
    title: 'ई-डिस्ट्रिक्ट सेवाएं',
    subtitle: 'आय, जाति, निवास व जन्म प्रमाण पत्र',
    imageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    linkUrl: '#',
    isActive: true,
    order: 4
  },
  {
    id: 'promo-5',
    title: 'बैंकिंग व बिल भुगतान',
    subtitle: 'बिजली बिल, मनी ट्रान्सफर और बीमा',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    linkUrl: '#',
    isActive: true,
    order: 5
  }
];`;

if (!code.includes('INITIAL_PROMOS')) {
  // We need to import PromoItem if not already imported, but let's check the import list.
  // The imports are usually from '../types'. Let's add it to the import block.
  code = code.replace(
    /import \{\s*Language,/,
    "import { PromoItem, Language,"
  );
  
  // Insert INITIAL_PROMOS before DEFAULT_STATE
  code = code.replace(
    'export const DEFAULT_STATE',
    INITIAL_PROMOS + '\\n\\nexport const DEFAULT_STATE'
  );
  
  // Update DEFAULT_STATE to include promos
  code = code.replace(
    'theme: \\'professional\\',\\n};',
    'theme: \\'professional\\',\\n  promos: INITIAL_PROMOS,\\n};'
  );
  
  // Update loadAppState
  code = code.replace(
    'theme: parsed.theme || \\'professional\\',',
    'theme: parsed.theme || \\'professional\\',\\n      promos: parsed.promos?.length ? parsed.promos : INITIAL_PROMOS,'
  );

  // Update importBackupJSON
  code = code.replace(
    'favorites: Array.isArray(data.favorites) ? data.favorites : state.favorites,',
    'favorites: Array.isArray(data.favorites) ? data.favorites : state.favorites,\\n    promos: Array.isArray(data.promos) ? data.promos : state.promos,'
  );
  
  fs.writeFileSync('src/services/storageService.ts', code);
  console.log("Patched storageService.ts");
}
