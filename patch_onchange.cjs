const fs = require('fs');
let code = fs.readFileSync('src/components/tools/AwasCertificate.tsx', 'utf8');

// Patch District onChange
const oldDistrictChange = `onChange={(e) => { setDistrict(e.target.value); if(errors.district) setErrors({...errors, district: ''}); }}`;
const newDistrictChange = `onChange={(e) => { 
                    setDistrict(e.target.value); 
                    setNagarNikay(''); 
                    setMohalla(''); 
                    let newErr = {...errors}; 
                    if(newErr.district) delete newErr.district; 
                    setErrors(newErr); 
                  }}`;
code = code.replace(oldDistrictChange, newDistrictChange);

// Patch Nagar Nikay onChange
const oldNagarNikayChange = `onChange={(e) => { setNagarNikay(e.target.value); if(errors.nagarNikay) setErrors({...errors, nagarNikay: ''}); }}`;
const newNagarNikayChange = `onChange={(e) => { 
                    setNagarNikay(e.target.value); 
                    setMohalla(''); 
                    let newErr = {...errors}; 
                    if(newErr.nagarNikay) delete newErr.nagarNikay; 
                    setErrors(newErr); 
                  }}`;
code = code.replace(oldNagarNikayChange, newNagarNikayChange);

// Modify placeholder text slightly to make behavior clearer
code = code.replace('placeholder="निकाय चुनें या टाइप करें"', 'placeholder={district ? "निकाय चुनें या टाइप करें" : "पहले जनपद चुनें"}');
code = code.replace('placeholder="मोहल्ला/ग्राम चुनें या टाइप करें"', 'placeholder={nagarNikay ? "मोहल्ला/ग्राम चुनें या टाइप करें" : "पहले नगर निकाय चुनें"}');

fs.writeFileSync('src/components/tools/AwasCertificate.tsx', code);
console.log("onChange patched successfully");
