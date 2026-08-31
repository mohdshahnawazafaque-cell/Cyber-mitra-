const fs = require('fs');
let code = fs.readFileSync('src/components/services/ServicesDashboard.tsx', 'utf8');

const anchor = `{/* 3. QUICK OPERATOR TOOLS (PRO-TOOLS) */}`;
const promoBlock = `{/* PROMOTIONAL BANNERS CAROUSEL */}
      <div className="relative w-full rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-white mb-6">
        <div className="flex w-full animate-marquee hover:[animation-play-state:paused]">
          <div className="flex gap-4 p-4 min-w-max">
            {/* Promo 1 */}
            <a href="#" className="block w-[300px] sm:w-[400px] h-[150px] sm:h-[180px] rounded-xl overflow-hidden flex-shrink-0 group relative">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Cyber Mitra Promotion" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                <span className="text-white font-bold text-sm sm:text-base">Grow Your Business</span>
                <span className="text-blue-200 text-xs font-medium">Get listed on our premium operator network</span>
              </div>
            </a>
            {/* Promo 2 */}
            <a href="#" className="block w-[300px] sm:w-[400px] h-[150px] sm:h-[180px] rounded-xl overflow-hidden flex-shrink-0 group relative">
              <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Special Offer" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                <span className="text-white font-bold text-sm sm:text-base">New Tools Added</span>
                <span className="text-amber-200 text-xs font-medium">Try our latest Bulk SMS & Promo Designer</span>
              </div>
            </a>
            {/* Promo 3 */}
            <a href="#" className="block w-[300px] sm:w-[400px] h-[150px] sm:h-[180px] rounded-xl overflow-hidden flex-shrink-0 group relative">
              <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Support" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                <span className="text-white font-bold text-sm sm:text-base">24/7 Priority Support</span>
                <span className="text-emerald-200 text-xs font-medium">We are here to help you succeed</span>
              </div>
            </a>
            
            {/* DUPLICATE FOR SEAMLESS SCROLLING */}
            <a href="#" className="block w-[300px] sm:w-[400px] h-[150px] sm:h-[180px] rounded-xl overflow-hidden flex-shrink-0 group relative">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Cyber Mitra Promotion" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                <span className="text-white font-bold text-sm sm:text-base">Grow Your Business</span>
                <span className="text-blue-200 text-xs font-medium">Get listed on our premium operator network</span>
              </div>
            </a>
            <a href="#" className="block w-[300px] sm:w-[400px] h-[150px] sm:h-[180px] rounded-xl overflow-hidden flex-shrink-0 group relative">
              <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Special Offer" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                <span className="text-white font-bold text-sm sm:text-base">New Tools Added</span>
                <span className="text-amber-200 text-xs font-medium">Try our latest Bulk SMS & Promo Designer</span>
              </div>
            </a>
            <a href="#" className="block w-[300px] sm:w-[400px] h-[150px] sm:h-[180px] rounded-xl overflow-hidden flex-shrink-0 group relative">
              <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Support" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                <span className="text-white font-bold text-sm sm:text-base">24/7 Priority Support</span>
                <span className="text-emerald-200 text-xs font-medium">We are here to help you succeed</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      ` + anchor;

code = code.replace(anchor, promoBlock);
fs.writeFileSync('src/components/services/ServicesDashboard.tsx', code);
console.log("Patched ServicesDashboard.tsx");
