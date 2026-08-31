const fs = require('fs');
let code = fs.readFileSync('src/components/admin/AdminPanel.tsx', 'utf8');

code = code.replace(
  'import { AppState, AdSlotConfig } from \'../../types\';',
  'import { AppState, AdSlotConfig, PromoItem } from \'../../types\';'
);

code = code.replace(
  'const [activeTab, setActiveTab] = useState<\'dashboard\' | \'settings\' | \'ads\'>(\'dashboard\');',
  'const [activeTab, setActiveTab] = useState<\'dashboard\' | \'settings\' | \'ads\' | \'promos\'>(\'dashboard\');\n  const [localPromos, setLocalPromos] = useState<PromoItem[]>(appState.promos || []);'
);

const saveFunc = `  const handleSavePromos = () => {
    onUpdateState({ ...appState, promos: localPromos });
    alert(isHindi ? 'प्रोमो सेटिंग्स सुरक्षित कर ली गई हैं।' : 'Promo settings saved successfully.');
  };`;

if (!code.includes('handleSavePromos')) {
  code = code.replace('const handleSaveSettings = () => {', saveFunc + '\n\n  const handleSaveSettings = () => {');
}

const tabButton = `<button
                onClick={() => setActiveTab('promos')}
                className={\`flex items-center gap-2 px-4 py-2 font-medium border-b-2 transition-colors \${activeTab === 'promos' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}\`}
              >
                <Image className="w-4 h-4" />
                {isHindi ? 'प्रोमो बैनर' : 'Promo Banners'}
              </button>
              <button
                onClick={() => setActiveTab('ads')}`;

if (!code.includes("setActiveTab('promos')")) {
    code = code.replace(
        `<button\n                onClick={() => setActiveTab('ads')}`,
        tabButton
    );
    
    // Also we need to import Image icon
    code = code.replace(
        'Database,',
        'Database, Image,'
    );
}

const promoTabContent = `{activeTab === 'promos' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  {isHindi ? 'प्रोमोशनल बैनर्स' : 'Promotional Banners'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {isHindi ? 'होम पेज पर स्क्रॉल होने वाले बैनर्स मैनेज करें' : 'Manage scrolling banners on home page'}
                </p>
              </div>
              <button onClick={handleSavePromos} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">
                <Save className="w-4 h-4" />
                {isHindi ? 'सेव करें' : 'Save'}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {localPromos.map((promo, idx) => (
                <div key={promo.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-slate-700">Banner {idx + 1}</span>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={promo.isActive} onChange={(e) => {
                        const newPromos = [...localPromos];
                        newPromos[idx].isActive = e.target.checked;
                        setLocalPromos(newPromos);
                      }} className="w-4 h-4 text-blue-600 rounded" />
                      <span className="text-xs font-semibold text-slate-600">{isHindi ? 'सक्रिय' : 'Active'}</span>
                    </label>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Title</label>
                    <input type="text" value={promo.title} onChange={(e) => {
                      const newPromos = [...localPromos];
                      newPromos[idx].title = e.target.value;
                      setLocalPromos(newPromos);
                    }} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Subtitle</label>
                    <input type="text" value={promo.subtitle} onChange={(e) => {
                      const newPromos = [...localPromos];
                      newPromos[idx].subtitle = e.target.value;
                      setLocalPromos(newPromos);
                    }} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Image URL</label>
                    <input type="text" value={promo.imageUrl} onChange={(e) => {
                      const newPromos = [...localPromos];
                      newPromos[idx].imageUrl = e.target.value;
                      setLocalPromos(newPromos);
                    }} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Link URL</label>
                    <input type="text" value={promo.linkUrl} onChange={(e) => {
                      const newPromos = [...localPromos];
                      newPromos[idx].linkUrl = e.target.value;
                      setLocalPromos(newPromos);
                    }} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}`;

if (!code.includes("activeTab === 'promos'")) {
    code = code.replace(
        `{activeTab === 'ads' && (`,
        promoTabContent + `\n\n        {activeTab === 'ads' && (`
    );
}

fs.writeFileSync('src/components/admin/AdminPanel.tsx', code);
console.log("Patched AdminPanel.tsx");
