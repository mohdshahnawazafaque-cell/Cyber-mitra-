const fs = require('fs');

let code = fs.readFileSync('src/components/tools/AwasCertificate.tsx', 'utf8');

// Change font-serif to font-sans to match the Arial/Helvetica clean look in the photo
code = code.replace('className="print-exact bg-white shadow-2xl relative mx-auto text-black font-serif flex flex-col shrink-0"', 'className="print-exact bg-white shadow-2xl relative mx-auto text-black font-sans flex flex-col shrink-0"');

const oldHeader = /\{\/\* Header Content \*\/\}[\s\S]*?(?=<\/div>\s*<\/div>\s*<\/div>\s*\{\/\* Print Styles \*\/})/;

const newHeader = `{/* Header Content */}
            <div className="relative flex flex-col h-full px-[15mm] pt-[15mm]">
              
              {/* Outer Box for Title and Photo */}
              <div className="border-[1.5px] border-black mb-8 flex flex-col">
                <div className="w-full bg-gray-200/60 border-b-[1.5px] border-black py-2.5">
                  <h1 className="text-[28px] font-bold text-center tracking-wide text-black">
                    प्रधानमंत्री आवास योजना-शहरी 2.0
                  </h1>
                </div>
                <div className="p-2 w-full flex justify-center bg-white">
                   <div className="w-[85%] h-[360px] flex items-center justify-center overflow-hidden">
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
              </div>

              <h2 className="text-[26px] font-bold text-center underline underline-offset-8 decoration-[1.5px] mb-8 tracking-wide">
                प्रमाण -पत्र
              </h2>

              {/* Certificate Body */}
              <div className="text-[17px] leading-[2.4] text-justify mb-8 font-medium px-2">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                प्रमाणित किया जाता है कि प्रधानमंत्री आवास योजना-शहरी 2.0 के घटक <strong>बी० एल० सी०</strong> के अन्तर्गत <br/>
                श्री/श्रीमती/कुमारी ...<strong>{name || '\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0'}</strong>.... पुत्र/पुत्री/पत्नी..<strong>{guardianName || '\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0'}</strong>..... निवासी <strong>मोहल्ला {mohalla || '\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0'}</strong> नगर निकाय <strong>{nagarNikay || '\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0'}</strong> – <br/>
                जनपद <strong>{district || '\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0'}</strong>, मोबाइल नं...<strong>{mobile || '\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0'}</strong>.... एप्लीकेशन आई0<br/>
                डी0....<strong>{appId || '\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0\\u00A0'}</strong>.. पात्र लाभार्थी हैं।
              </div>

              {/* Comment Box */}
              <div className="w-[98%] mx-auto border-[1.5px] border-black min-h-[180px] p-2 mb-10 flex flex-col">
                <span className="text-[17px] font-medium">जांच समिति की टिप्पणी :</span>
                {comment && (
                  <div className="mt-1 text-[17px] whitespace-pre-wrap pl-2">{comment}</div>
                )}
              </div>

              {/* Signatures */}
              <div className="flex justify-between items-start px-4 text-center shrink-0">
                <div className="flex flex-col items-center w-[30%]">
                  <div className="font-bold text-[18px] mb-10">हस्ताक्षर</div>
                  <div className="text-[15px] font-medium leading-snug">
                    अधिशासी अधिकारी<br/>
                    नगर पं० तम्बौर, अहमदाबाद<br/>
                    जनपद सीतापुर
                  </div>
                </div>
                <div className="flex flex-col items-center w-[30%]">
                  <div className="font-bold text-[18px] mb-10">हस्ताक्षर</div>
                  <div className="text-[15px] font-medium leading-snug">
                    परियोजना अधिकारी<br/>
                    डूडा – सीतापुर
                  </div>
                </div>
                <div className="flex flex-col items-center w-[30%]">
                  <div className="font-bold text-[18px] mb-10">हस्ताक्षर</div>
                  <div className="text-[15px] font-medium leading-snug">
                    उप जिलाधिकारी<br/>
                    तह० लहरपुर<br/>
                    जनपद सीतापुर
                  </div>
                </div>
              </div>
            </div>`;

code = code.replace(oldHeader, newHeader);

// Adjust the print padding slightly so it looks perfectly framed
const oldPrintPadding = /padding: 20mm !important;/;
const newPrintPadding = 'padding: 0 !important;';
code = code.replace(oldPrintPadding, newPrintPadding);

fs.writeFileSync('src/components/tools/AwasCertificate.tsx', code);
console.log("Patched successfully");
