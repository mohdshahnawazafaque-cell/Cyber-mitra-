const fs = require('fs');

let code = fs.readFileSync('src/components/tools/AwasCertificate.tsx', 'utf8');

const oldPara = `{/* Certificate Body */}
              <div className="text-[17px] leading-[2.4] text-justify mb-8 font-medium px-2">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                प्रमाणित किया जाता है कि प्रधानमंत्री आवास योजना-शहरी 2.0 के घटक <strong>बी० एल० सी०</strong> के अन्तर्गत <br/>
                श्री/श्रीमती/कुमारी ...<strong>{name || '\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0'}</strong>.... पुत्र/पुत्री/पत्नी..<strong>{guardianName || '\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0'}</strong>..... निवासी <strong>मोहल्ला {mohalla || '\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0'}</strong> नगर निकाय <strong>{nagarNikay || '\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0'}</strong> – <br/>
                जनपद <strong>{district || '\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0'}</strong>, मोबाइल नं...<strong>{mobile || '\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0'}</strong>.... एप्लीकेशन आई0<br/>
                डी0....<strong>{appId || '\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0'}</strong>.. पात्र लाभार्थी हैं।
              </div>`;

const newPara = `{/* Certificate Body */}
              <div className="text-[17px] leading-[2.4] text-justify mb-8 font-medium px-2">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                प्रमाणित किया जाता है कि प्रधानमंत्री आवास योजना-शहरी 2.0 के घटक <strong>बी० एल० सी०</strong> के अन्तर्गत 
                श्री/श्रीमती/कुमारी ...<strong>{name || '\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0'}</strong>.... पुत्र/पुत्री/पत्नी..<strong>{guardianName || '\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0'}</strong>..... निवासी <strong>मोहल्ला {mohalla || '\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0'}</strong> नगर निकाय <strong>{nagarNikay || '\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0'}</strong> - 
                जनपद <strong>{district || '\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0'}</strong>, मोबाइल नं...<strong>{mobile || '\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0'}</strong>.... एप्लीकेशन आई0
                डी0....<strong>{appId || '\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0'}</strong>.. पात्र लाभार्थी हैं।
              </div>`;

code = code.replace(oldPara, newPara);

fs.writeFileSync('src/components/tools/AwasCertificate.tsx', code);
console.log("Paragraph patched");
