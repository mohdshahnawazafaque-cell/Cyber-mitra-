const fs = require('fs');
let code = fs.readFileSync('src/components/services/ServicesDashboard.tsx', 'utf8');

const regex = /\{\/\* PROMOTIONAL BANNERS CAROUSEL \*\/\}(.|\n)*?\{\/\* 3\. QUICK OPERATOR TOOLS \(PRO-TOOLS\) \*\/\}/m;

const replacement = `{/* PROMOTIONAL BANNERS CAROUSEL */}
      <div className="relative w-full rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-white mb-6">
        <div className="flex w-full animate-marquee hover:[animation-play-state:paused]">
          <div className="flex gap-4 p-4 min-w-max">
            {/* --- SET 1 --- */}
            {/* Promo 1 */}
            <a href="#" className="block w-[280px] sm:w-[350px] h-[140px] sm:h-[160px] rounded-xl overflow-hidden flex-shrink-0 group relative shadow-md">
              <img src="https://images.unsplash.com/photo-1432821596592-e2c18b78144f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Govt Schemes" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4">
                <span className="text-white font-extrabold text-sm sm:text-base">सभी सरकारी योजनाएं</span>
                <span className="text-blue-200 text-xs font-medium mt-0.5">PM किसान, पेंशन और अन्य आवेदन</span>
              </div>
            </a>
            {/* Promo 2 */}
            <a href="#" className="block w-[280px] sm:w-[350px] h-[140px] sm:h-[160px] rounded-xl overflow-hidden flex-shrink-0 group relative shadow-md">
              <img src="https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="ID Services" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4">
                <span className="text-white font-extrabold text-sm sm:text-base">पैन कार्ड एवं पहचान पत्र</span>
                <span className="text-emerald-300 text-xs font-medium mt-0.5">नया पैन कार्ड बनाएं या सुधार करें</span>
              </div>
            </a>
            {/* Promo 3 */}
            <a href="#" className="block w-[280px] sm:w-[350px] h-[140px] sm:h-[160px] rounded-xl overflow-hidden flex-shrink-0 group relative shadow-md">
              <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Data & Print" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4">
                <span className="text-white font-extrabold text-sm sm:text-base">प्रोमो डिज़ाइनर व बिलिंग</span>
                <span className="text-amber-300 text-xs font-medium mt-0.5">बिज़नेस के लिए पोस्टर और बिल बनाएं</span>
              </div>
            </a>
            {/* Promo 4 */}
            <a href="#" className="block w-[280px] sm:w-[350px] h-[140px] sm:h-[160px] rounded-xl overflow-hidden flex-shrink-0 group relative shadow-md">
              <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Certificates" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4">
                <span className="text-white font-extrabold text-sm sm:text-base">ई-डिस्ट्रिक्ट सेवाएं</span>
                <span className="text-purple-300 text-xs font-medium mt-0.5">आय, जाति, निवास व जन्म प्रमाण पत्र</span>
              </div>
            </a>
            {/* Promo 5 */}
            <a href="#" className="block w-[280px] sm:w-[350px] h-[140px] sm:h-[160px] rounded-xl overflow-hidden flex-shrink-0 group relative shadow-md">
              <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Payments" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4">
                <span className="text-white font-extrabold text-sm sm:text-base">बैंकिंग व बिल भुगतान</span>
                <span className="text-pink-300 text-xs font-medium mt-0.5">बिजली बिल, मनी ट्रान्सफर और बीमा</span>
              </div>
            </a>

            {/* --- SET 2 (DUPLICATE FOR SEAMLESS SCROLLING) --- */}
            {/* Promo 1 */}
            <a href="#" className="block w-[280px] sm:w-[350px] h-[140px] sm:h-[160px] rounded-xl overflow-hidden flex-shrink-0 group relative shadow-md">
              <img src="https://images.unsplash.com/photo-1432821596592-e2c18b78144f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Govt Schemes" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4">
                <span className="text-white font-extrabold text-sm sm:text-base">सभी सरकारी योजनाएं</span>
                <span className="text-blue-200 text-xs font-medium mt-0.5">PM किसान, पेंशन और अन्य आवेदन</span>
              </div>
            </a>
            {/* Promo 2 */}
            <a href="#" className="block w-[280px] sm:w-[350px] h-[140px] sm:h-[160px] rounded-xl overflow-hidden flex-shrink-0 group relative shadow-md">
              <img src="https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="ID Services" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4">
                <span className="text-white font-extrabold text-sm sm:text-base">पैन कार्ड एवं पहचान पत्र</span>
                <span className="text-emerald-300 text-xs font-medium mt-0.5">नया पैन कार्ड बनाएं या सुधार करें</span>
              </div>
            </a>
            {/* Promo 3 */}
            <a href="#" className="block w-[280px] sm:w-[350px] h-[140px] sm:h-[160px] rounded-xl overflow-hidden flex-shrink-0 group relative shadow-md">
              <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Data & Print" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4">
                <span className="text-white font-extrabold text-sm sm:text-base">प्रोमो डिज़ाइनर व बिलिंग</span>
                <span className="text-amber-300 text-xs font-medium mt-0.5">बिज़नेस के लिए पोस्टर और बिल बनाएं</span>
              </div>
            </a>
            {/* Promo 4 */}
            <a href="#" className="block w-[280px] sm:w-[350px] h-[140px] sm:h-[160px] rounded-xl overflow-hidden flex-shrink-0 group relative shadow-md">
              <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Certificates" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4">
                <span className="text-white font-extrabold text-sm sm:text-base">ई-डिस्ट्रिक्ट सेवाएं</span>
                <span className="text-purple-300 text-xs font-medium mt-0.5">आय, जाति, निवास व जन्म प्रमाण पत्र</span>
              </div>
            </a>
            {/* Promo 5 */}
            <a href="#" className="block w-[280px] sm:w-[350px] h-[140px] sm:h-[160px] rounded-xl overflow-hidden flex-shrink-0 group relative shadow-md">
              <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Payments" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4">
                <span className="text-white font-extrabold text-sm sm:text-base">बैंकिंग व बिल भुगतान</span>
                <span className="text-pink-300 text-xs font-medium mt-0.5">बिजली बिल, मनी ट्रान्सफर और बीमा</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* 3. QUICK OPERATOR TOOLS (PRO-TOOLS) */}`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/components/services/ServicesDashboard.tsx', code);
console.log("Replaced promos with 5 images");
