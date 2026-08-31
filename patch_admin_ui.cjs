const fs = require('fs');
let code = fs.readFileSync('src/components/admin/AdminPanel.tsx', 'utf8');

const promoUI = `
              {activeTab === 'promos' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">
                        {isHindi ? 'प्रोमो बैनर (Promo Banners)' : 'Promotional Banners'}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">
                        {isHindi ? 'डैशबोर्ड स्लाइडर में दिखने वाले बैनर मैनेज करें' : 'Manage banners shown in the dashboard slider'}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingPromo(null);
                        setIsAddingPromo(true);
                      }}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      {isHindi ? 'नया प्रोमो' : 'Add Promo'}
                    </button>
                  </div>

                  {/* PROMO LIST */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(appState.promos || []).sort((a, b) => a.order - b.order).map((promo) => (
                      <div key={promo.id} className={\`border rounded-xl p-4 bg-white shadow-sm flex flex-col \${!promo.isActive ? 'opacity-60' : ''}\`}>
                        <img src={promo.imageUrl} alt={promo.title} className="w-full h-32 object-cover rounded-lg mb-4 bg-slate-100" />
                        <h4 className="font-bold text-slate-800">{promo.title}</h4>
                        <p className="text-xs text-slate-500 mb-2 truncate">{promo.subtitle}</p>
                        <a href={promo.linkUrl} target="_blank" rel="noreferrer" className="text-blue-600 text-[10px] underline mb-4 truncate">{promo.linkUrl}</a>
                        
                        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3">
                          <span className="text-[10px] font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">Order: {promo.order}</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                handleSavePromo({...promo, isActive: !promo.isActive});
                              }}
                              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded"
                              title="Toggle Active"
                            >
                              {promo.isActive ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
                            </button>
                            <button
                              onClick={() => {
                                setEditingPromo(promo);
                                setIsAddingPromo(true);
                              }}
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePromo(promo.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* PROMO FORM MODAL */}
                  {isAddingPromo && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100">
                          <h3 className="text-lg font-bold text-slate-800">
                            {editingPromo ? (isHindi ? 'प्रोमो एडिट करें' : 'Edit Promo') : (isHindi ? 'नया प्रोमो' : 'Add New Promo')}
                          </h3>
                          <button onClick={() => setIsAddingPromo(false)} className="text-slate-400 hover:bg-slate-100 p-2 rounded-xl transition-colors">
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="p-4 sm:p-5 overflow-y-auto">
                          <form
                            id="promo-form"
                            onSubmit={(e) => {
                              e.preventDefault();
                              const fd = new FormData(e.currentTarget);
                              const p = {
                                id: editingPromo?.id || \`promo-\${Date.now()}\`,
                                title: fd.get('title') as string,
                                subtitle: fd.get('subtitle') as string,
                                imageUrl: fd.get('imageUrl') as string,
                                linkUrl: fd.get('linkUrl') as string,
                                isActive: fd.get('isActive') === 'on',
                                order: parseInt(fd.get('order') as string, 10) || 1,
                              };
                              handleSavePromo(p as PromoItem);
                            }}
                            className="space-y-4"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1.5 sm:col-span-2">
                                <label className="text-xs font-bold text-slate-700">{isHindi ? 'टाइटल' : 'Title'}</label>
                                <input name="title" defaultValue={editingPromo?.title || ''} required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none" />
                              </div>
                              <div className="space-y-1.5 sm:col-span-2">
                                <label className="text-xs font-bold text-slate-700">{isHindi ? 'सबटाइटल' : 'Subtitle'}</label>
                                <input name="subtitle" defaultValue={editingPromo?.subtitle || ''} required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none" />
                              </div>
                              <div className="space-y-1.5 sm:col-span-2">
                                <label className="text-xs font-bold text-slate-700">{isHindi ? 'इमेज URL (Image URL)' : 'Image URL'}</label>
                                <input name="imageUrl" defaultValue={editingPromo?.imageUrl || ''} required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none" />
                              </div>
                              <div className="space-y-1.5 sm:col-span-2">
                                <label className="text-xs font-bold text-slate-700">{isHindi ? 'लिंक (Link URL)' : 'Link URL'}</label>
                                <input name="linkUrl" defaultValue={editingPromo?.linkUrl || '#'} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none" />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700">{isHindi ? 'ऑर्डर (Order)' : 'Order'}</label>
                                <input type="number" name="order" defaultValue={editingPromo?.order || 1} required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none" />
                              </div>
                              <div className="space-y-1.5 flex flex-col justify-end">
                                <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 p-2 rounded-lg hover:bg-slate-100">
                                  <input type="checkbox" name="isActive" defaultChecked={editingPromo ? editingPromo.isActive : true} className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-600" />
                                  <span className="text-sm font-semibold text-slate-700">{isHindi ? 'सक्रिय (Active)' : 'Active'}</span>
                                </label>
                              </div>
                            </div>
                          </form>
                        </div>
                        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end gap-3">
                          <button onClick={() => setIsAddingPromo(false)} className="px-4 py-2 font-bold text-sm text-slate-600 hover:text-slate-800 transition-colors">
                            {isHindi ? 'रद्द करें' : 'Cancel'}
                          </button>
                          <button type="submit" form="promo-form" className="px-5 py-2 font-bold text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md">
                            {isHindi ? 'सेव करें' : 'Save Promo'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
`;

code = code.replace(
  "{activeTab === 'ads' && (",
  promoUI + "\n              {activeTab === 'ads' && ("
);

// We need to add Plus, Edit3 to lucide-react import
code = code.replace(
  'Search,',
  'Search,\n  Plus,\n  Edit3,'
);

fs.writeFileSync('src/components/admin/AdminPanel.tsx', code);
console.log("Patched AdminPanel UI");
