const fs = require('fs');
let code = fs.readFileSync('src/components/admin/AdminPanel.tsx', 'utf8');

// Add PromoItem to imports if needed
if (!code.includes('PromoItem')) {
  code = code.replace(
    'Language,',
    'Language,\n  PromoItem,'
  );
}

// update activeTab type
code = code.replace(
  "const [activeTab, setActiveTab] = useState<'services' | 'ads' | 'backup' | 'logs' | 'security'>('services');",
  "const [activeTab, setActiveTab] = useState<'services' | 'ads' | 'backup' | 'logs' | 'security' | 'promos'>('services');\n  const [editingPromo, setEditingPromo] = useState<PromoItem | null>(null);\n  const [isAddingPromo, setIsAddingPromo] = useState<boolean>(false);"
);

// Add promo save/delete functions right before handleLogout
const promoHandlers = `
  const handleSavePromo = (promo: PromoItem) => {
    let updatedPromos = [...(appState.promos || [])];
    if (updatedPromos.some(p => p.id === promo.id)) {
      updatedPromos = updatedPromos.map(p => p.id === promo.id ? promo : p);
    } else {
      updatedPromos.push(promo);
    }
    onUpdateState({ ...appState, promos: updatedPromos });
    setEditingPromo(null);
    setIsAddingPromo(false);
    showToast(isHindi ? 'प्रोमो सेव हो गया!' : 'Promo saved successfully!');
  };

  const handleDeletePromo = (id: string) => {
    if (window.confirm(isHindi ? 'क्या आप इस प्रोमो को हटाना चाहते हैं?' : 'Delete this promo?')) {
      const updated = (appState.promos || []).filter((p) => p.id !== id);
      onUpdateState({ ...appState, promos: updated });
      showToast(isHindi ? 'प्रोमो हटा दिया गया' : 'Promo deleted');
    }
  };
`;
code = code.replace(
  'const handleLogout = () => {',
  promoHandlers + '\n  const handleLogout = () => {'
);

fs.writeFileSync('src/components/admin/AdminPanel.tsx', code);
console.log("Patched AdminPanel state");
