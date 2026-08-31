const fs = require('fs');
let code = fs.readFileSync('src/components/tools/AwasCertificate.tsx', 'utf8');

// Insert states
const stateHook = `const [nagarNikay, setNagarNikay] = useState('');`;
const newStateHooks = `const [nagarNikay, setNagarNikay] = useState('');
  const [isCustomNikay, setIsCustomNikay] = useState(false);
  const [isCustomMohalla, setIsCustomMohalla] = useState(false);`;

code = code.replace(stateHook, newStateHooks);

// Patch District onChange to reset custom states
const oldDistrictChange = `onChange={(e) => { 
                    setDistrict(e.target.value); 
                    setNagarNikay(''); 
                    setMohalla(''); 
                    let newErr = {...errors}; 
                    if(newErr.district) delete newErr.district; 
                    setErrors(newErr); 
                  }}`;
const newDistrictChange = `onChange={(e) => { 
                    setDistrict(e.target.value); 
                    setNagarNikay(''); 
                    setMohalla(''); 
                    setIsCustomNikay(false);
                    setIsCustomMohalla(false);
                    let newErr = {...errors}; 
                    if(newErr.district) delete newErr.district; 
                    setErrors(newErr); 
                  }}`;
code = code.replace(oldDistrictChange, newDistrictChange);

// Patch reset form
const oldReset = `setMohalla('');
    setNagarNikay('');
    setDistrict('');`;
const newReset = `setMohalla('');
    setNagarNikay('');
    setDistrict('');
    setIsCustomNikay(false);
    setIsCustomMohalla(false);`;
code = code.replace(oldReset, newReset);


// Replace Nagar Nikay input with Select + Input
const oldNagarNikayBlockRegex = /\{\/\*\s*Nagar Nikay\s*\*\/\}[\s\S]*?<\/datalist>[\s\S]*?<\/div>/;

const newNagarNikayBlock = `{/* Nagar Nikay */}
              <div>
                <div className="flex justify-between items-end mb-1.5">
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    नगर निकाय <span className="text-red-500">*</span>
                  </label>
                  {isCustomNikay && (
                    <button type="button" onClick={() => { setIsCustomNikay(false); setNagarNikay(''); }} className="text-xs text-blue-600 hover:underline">
                      लिस्ट से चुनें
                    </button>
                  )}
                </div>
                {!isCustomNikay ? (
                  <select
                    value={nagarNikay}
                    onChange={(e) => { 
                      if(e.target.value === '__OTHER__') {
                        setIsCustomNikay(true);
                        setNagarNikay('');
                        setMohalla('');
                        setIsCustomMohalla(false);
                      } else {
                        setNagarNikay(e.target.value); 
                        setMohalla('');
                        setIsCustomMohalla(false);
                        let newErr = {...errors}; 
                        if(newErr.nagarNikay) delete newErr.nagarNikay; 
                        setErrors(newErr); 
                      }
                    }}
                    disabled={!district} 
                    className={\`w-full px-4 py-2 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:ring-2 outline-none transition-all disabled:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 \${errors.nagarNikay ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-blue-500 focus:border-blue-600'}\`}
                  >
                    <option value="">{district ? "नगर निकाय चुनें" : "पहले जनपद चुनें"}</option>
                    {district && upGeoData[district as string] && Object.keys(upGeoData[district as string]).map(nikay => (
                      <option key={nikay} value={nikay}>{nikay}</option>
                    ))}
                    {district && <option value="__OTHER__" className="font-bold text-blue-600">अन्य (खुद टाइप करें) ...</option>}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={nagarNikay}
                    onChange={(e) => { setNagarNikay(e.target.value); if(errors.nagarNikay) setErrors({...errors, nagarNikay: ''}); }}
                    placeholder="नगर निकाय का नाम टाइप करें"
                    autoFocus
                    className={\`w-full px-4 py-2 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:ring-2 outline-none transition-all \${errors.nagarNikay ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-blue-500 focus:border-blue-600'}\`}
                  />
                )}
                {errors.nagarNikay && <p className="text-[10px] text-red-500 mt-1 font-medium">{errors.nagarNikay}</p>}
              </div>`;

code = code.replace(oldNagarNikayBlockRegex, newNagarNikayBlock);


// Replace Mohalla input with Select + Input
const oldMohallaBlockRegex = /\{\/\*\s*Mohalla \/ Gram\s*\*\/\}[\s\S]*?<\/datalist>[\s\S]*?<\/div>/;

const newMohallaBlock = `{/* Mohalla / Gram */}
              <div>
                <div className="flex justify-between items-end mb-1.5">
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    मोहल्ला / ग्राम <span className="text-red-500">*</span>
                  </label>
                  {isCustomMohalla && (
                    <button type="button" onClick={() => { setIsCustomMohalla(false); setMohalla(''); }} className="text-xs text-blue-600 hover:underline">
                      लिस्ट से चुनें
                    </button>
                  )}
                </div>
                {!isCustomMohalla ? (
                  <select
                    value={mohalla}
                    onChange={(e) => { 
                      if(e.target.value === '__OTHER__') {
                        setIsCustomMohalla(true);
                        setMohalla('');
                      } else {
                        setMohalla(e.target.value); 
                        let newErr = {...errors}; 
                        if(newErr.mohalla) delete newErr.mohalla; 
                        setErrors(newErr); 
                      }
                    }}
                    disabled={!nagarNikay} 
                    className={\`w-full px-4 py-2 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:ring-2 outline-none transition-all disabled:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 \${errors.mohalla ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-blue-500 focus:border-blue-600'}\`}
                  >
                    <option value="">{nagarNikay ? "मोहल्ला / ग्राम चुनें" : "पहले नगर निकाय चुनें"}</option>
                    {district && upGeoData[district as string] && nagarNikay && upGeoData[district as string][nagarNikay as string] && 
                      upGeoData[district as string][nagarNikay as string].map(m => (
                        <option key={m} value={m}>{m}</option>
                    ))}
                    {nagarNikay && <option value="__OTHER__" className="font-bold text-blue-600">अन्य (खुद टाइप करें) ...</option>}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={mohalla}
                    onChange={(e) => { setMohalla(e.target.value); if(errors.mohalla) setErrors({...errors, mohalla: ''}); }}
                    placeholder="मोहल्ला या ग्राम का नाम टाइप करें"
                    autoFocus
                    className={\`w-full px-4 py-2 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:ring-2 outline-none transition-all \${errors.mohalla ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-blue-500 focus:border-blue-600'}\`}
                  />
                )}
                {errors.mohalla && <p className="text-[10px] text-red-500 mt-1 font-medium">{errors.mohalla}</p>}
              </div>`;

code = code.replace(oldMohallaBlockRegex, newMohallaBlock);

fs.writeFileSync('src/components/tools/AwasCertificate.tsx', code);
console.log("Replaced datalists with select + custom input");
