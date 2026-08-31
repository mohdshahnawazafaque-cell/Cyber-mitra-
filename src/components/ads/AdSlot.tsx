import React, { useState, useEffect } from 'react';
import { AdSlotConfig } from '../../types';

interface AdSlotProps {
  slot: AdSlotConfig;
  className?: string;
}

const DEFAULT_BANNERS = [
  {
    title: 'New Service Alert: E-Shram & PAN Cards',
    subtitle: 'Start making documents directly from our portal. Fast & secure.',
    color: 'from-orange-500 to-red-600',
    link: '#'
  },
  {
    title: 'Upgrade to Premium AI Tools',
    subtitle: 'Draft formal applications, generate custom invoices & more using AI.',
    color: 'from-purple-600 to-fuchsia-600',
    link: '#'
  }
];

export const AdSlot: React.FC<AdSlotProps> = ({ slot, className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Only auto-slide if we are showing the default banners
    if (slot.adType === 'custom_image' && slot.imageUrl) return;
    if (slot.code) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % DEFAULT_BANNERS.length);
    }, 4000); // 4 seconds
    return () => clearInterval(interval);
  }, [slot]);

  if (!slot.enabled) return null;

  return (
    <aside
      aria-label="Advertisement"
      className={`my-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center overflow-hidden relative shadow-sm ${className}`}
    >
      <div className="absolute top-2 right-2 z-20">
        <span className="text-[9px] uppercase font-bold text-white/90 tracking-wider bg-black/20 px-2 py-0.5 rounded-full backdrop-blur-md border border-white/20 shadow-sm">
          SPONSORED
        </span>
      </div>

      {slot.adType === 'custom_image' && slot.imageUrl ? (
        <a href={slot.linkUrl || '#'} target="_blank" rel="noopener noreferrer" className="w-full h-full block">
          <img 
            src={slot.imageUrl} 
            alt="Promotion Banner" 
            className="w-full h-auto max-h-48 object-cover"
          />
        </a>
      ) : slot.code ? (
        <div
          dangerouslySetInnerHTML={{ __html: slot.code }}
          className="w-full flex justify-center relative z-10 p-4"
        />
      ) : (
        <div className="w-full relative h-28 sm:h-32 bg-slate-900 overflow-hidden cursor-pointer">
          {DEFAULT_BANNERS.map((banner, index) => (
            <a
              key={index}
              href={banner.link}
              className={`absolute inset-0 w-full h-full p-4 flex flex-col items-center justify-center text-white transition-opacity duration-1000 ease-in-out bg-gradient-to-r ${banner.color} ${
                index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <h3 className="font-bold text-sm sm:text-base md:text-lg mb-1 drop-shadow-md">{banner.title}</h3>
              <p className="text-xs sm:text-sm text-white/90 max-w-lg drop-shadow-sm px-4">{banner.subtitle}</p>
            </a>
          ))}
          {/* Dots Indicator */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {DEFAULT_BANNERS.map((_, idx) => (
              <div 
                key={idx} 
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 shadow-sm ${idx === currentIndex ? 'bg-white scale-125 w-3' : 'bg-white/40'}`}
              />
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};
