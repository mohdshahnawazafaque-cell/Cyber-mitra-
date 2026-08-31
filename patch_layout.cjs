const fs = require('fs');

let code = fs.readFileSync('src/components/tools/AwasCertificate.tsx', 'utf8');

const oldHeader = `            {/* Header Content */}
            <div className="pt-10 px-12 pb-6">
              <h1 className="text-3xl font-bold text-center underline underline-offset-4 decoration-2 mb-6 tracking-wide">
                प्रधानमंत्री आवास योजना-शहरी 2.0
              </h1>

              {/* Photo Box */}
              <div className="flex justify-center mb-6">
                <div className="w-[300px] h-[350px] border-2 border-black flex items-center justify-center overflow-hidden">
                  {photoUrl ? (
                    <img src={photoUrl} alt="Beneficiary" className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-gray-400 text-sm flex flex-col items-center gap-2">
                      <ImageIcon className="w-8 h-8 opacity-50" />
                      फोटो
                    </span>
                  )}
                </div>
              </div>

              <h2 className="text-2xl font-bold text-center underline underline-offset-4 decoration-2 mb-8">
                प्रमाण -पत्र
              </h2>

              {/* Certificate Body */}
              <div className="text-lg leading-[2.2] text-justify mb-8">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                प्रमाणित किया जाता है कि प्रधानमंत्री आवास योजना-शहरी 2.0 के घटक <strong>बी०एल०सी०</strong> के अन्तर्गत 
                श्री/श्रीमती/कुमारी <strong>{name || '......................................'}</strong>, 
                पुत्र/पुत्री/पत्नी <strong>{guardianName || '......................................'}</strong>, 
                निवासी मोहल्ला/ग्राम <strong>{mohalla || '......................................'}</strong>, 
                नगर निकाय <strong>{nagarNikay || '......................................'}</strong> – 
                जनपद <strong>{district || '......................................'}</strong>, 
                मोबाइल नं. <strong>{mobile || '......................................'}</strong>, 
                एप्लीकेशन आई०डी० <strong>{appId || '......................................'}</strong>, पात्र लाभार्थी हैं।
              </div>

              {/* Comment Box */}
              <div className="w-full border-[1.5px] border-black min-h-[140px] p-4 mb-20">
                <span className="text-lg font-medium">जांच समिति की टिप्पणी :</span>
                {comment && (
                  <div className="mt-2 text-lg whitespace-pre-wrap">{comment}</div>
                )}
              </div>

              {/* Signatures */}
              <div className="flex justify-between items-end px-4 text-center pb-12">
                <div className="flex flex-col items-center w-1/3">
                  <div className="font-bold text-lg mb-8">हस्ताक्षर</div>
                  <div className="text-base font-medium leading-snug">
                    अधिशासी अधिकारी<br/>
                    नगर पं० तम्बौर, अहमदाबाद<br/>
                    जनपद सीतापुर
                  </div>
                </div>

                <div className="flex flex-col items-center w-1/3">
                  <div className="font-bold text-lg mb-8">हस्ताक्षर</div>
                  <div className="text-base font-medium leading-snug">
                    परियोजना अधिकारी<br/>
                    डूडा – सीतापुर
                  </div>
                </div>

                <div className="flex flex-col items-center w-1/3">
                  <div className="font-bold text-lg mb-8">हस्ताक्षर</div>
                  <div className="text-base font-medium leading-snug">
                    उप जिलाधिकारी<br/>
                    तह० लहरपुर<br/>
                    जनपद सीतापुर
                  </div>
                </div>
              </div>
              
              {/* Date (Optional, can be placed anywhere, but usually bottom left or top right. Leaving out from certificate body as per user prompt, wait, user mentioned "प्रमाण-पत्र दिनांक" in form. I should add Date somewhere. Let's add it at bottom left, or top right? The user didn't specify position, just "Date field Default current date रखें।" Maybe in the signature block or above it? Let's add "दिनांक : [date]" at the top right, or just below the signature.) */}
              <div className="absolute top-10 right-12 text-lg font-medium">
                दिनांक: {date ? new Date(date).toLocaleDateString('en-IN') : ''}
              </div>
            </div>`;

const newHeader = `            {/* Header Content */}
            <div className="pt-10 px-12 pb-6 relative">
              <h1 className="text-[32px] font-bold text-center underline underline-offset-8 decoration-[1.5px] mb-6 tracking-wide">
                प्रधानमंत्री आवास योजना-शहरी 2.0
              </h1>

              {/* Photo Box */}
              <div className="flex justify-center mb-6">
                <div className="w-[85%] h-[360px] border-[1.5px] border-black flex items-center justify-center overflow-hidden p-0.5">
                  {photoUrl ? (
                    <img src={photoUrl} alt="Beneficiary" className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-gray-400 text-sm flex flex-col items-center gap-2">
                      <ImageIcon className="w-8 h-8 opacity-50" />
                      फोटो
                    </span>
                  )}
                </div>
              </div>

              <h2 className="text-[28px] font-bold text-center underline underline-offset-8 decoration-[1.5px] mb-6 tracking-wide">
                प्रमाण -पत्र
              </h2>

              {/* Certificate Body */}
              <div className="text-[19px] leading-[2.2] text-justify mb-6 font-medium">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                प्रमाणित किया जाता है कि प्रधानमंत्री आवास योजना-शहरी 2.0 के घटक <strong>बी० एल० सी०</strong> के अन्तर्गत <br/>
                श्री/श्रीमती/कुमारी .....<strong>{name || '\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0'}</strong>..... पुत्र/पुत्री/पत्नी..<strong>{guardianName || '\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0'}</strong>..... निवासी मोहल्ला <strong>{mohalla || '\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0'}</strong> नगर निकाय <strong>{nagarNikay || '\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0'}</strong> – <br/>
                जनपद <strong>{district || '\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0'}</strong>, मोबाइल नं...<strong>{mobile || '\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0'}</strong>.... एप्लीकेशन आई0<br/>
                डी0....<strong>{appId || '\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0'}</strong>.. पात्र लाभार्थी हैं।
              </div>

              {/* Comment Box */}
              <div className="w-full border-[1.5px] border-black min-h-[160px] p-2 mb-12">
                <span className="text-[19px] font-medium">जांच समिति की टिप्पणी :</span>
                {comment && (
                  <div className="mt-1 text-[19px] whitespace-pre-wrap pl-2">{comment}</div>
                )}
              </div>

              {/* Signatures */}
              <div className="flex justify-between items-start px-2 text-center pb-8">
                <div className="flex flex-col items-center w-1/3">
                  <div className="font-bold text-xl mb-12">हस्ताक्षर</div>
                  <div className="text-lg font-medium leading-tight">
                    अधिशासी अधिकारी<br/>
                    नगर पं० तम्बौर, अहमदाबाद<br/>
                    जनपद सीतापुर
                  </div>
                </div>

                <div className="flex flex-col items-center w-1/3">
                  <div className="font-bold text-xl mb-12">हस्ताक्षर</div>
                  <div className="text-lg font-medium leading-tight">
                    परियोजना अधिकारी<br/>
                    डूडा – सीतापुर
                  </div>
                </div>

                <div className="flex flex-col items-center w-1/3">
                  <div className="font-bold text-xl mb-12">हस्ताक्षर</div>
                  <div className="text-lg font-medium leading-tight">
                    उप जिलाधिकारी<br/>
                    तह० लहरपुर<br/>
                    जनपद सीतापुर
                  </div>
                </div>
              </div>
            </div>`;

if(code.includes('flex flex-col items-center w-1/3">')) {
  // We'll replace by searching for the marker up to the end tag
  const regex = /\{\/\* Header Content \*\/\}[\s\S]*?(?=<\/div>\s*<\/div>\s*<\/div>\s*\{\/\* Print Styles \*\/})/
  code = code.replace(regex, newHeader);
  fs.writeFileSync('src/components/tools/AwasCertificate.tsx', code);
  console.log("Patched successfully");
} else {
  console.log("Could not patch");
}
