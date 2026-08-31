import React from 'react';
import { PromoItem } from '../../types';

interface PromoBannerProps {
  promos: PromoItem[];
}

export const PromoBanner: React.FC<PromoBannerProps> = ({ promos }) => {
  const activePromos = promos.filter(p => p.isActive).sort((a, b) => a.order - b.order);

  if (activePromos.length === 0) return null;

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-white mb-6">
      <div className="flex w-full animate-marquee hover:[animation-play-state:paused]">
        <div className="flex gap-4 p-4 min-w-max">
          {/* Main set */}
          {activePromos.map((promo) => (
            <a
              key={promo.id}
              href={promo.linkUrl || '#'}
              target={promo.linkUrl && promo.linkUrl !== '#' ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className="block w-[280px] sm:w-[350px] h-[140px] sm:h-[160px] rounded-xl overflow-hidden flex-shrink-0 group relative shadow-md"
            >
              <img
                src={promo.imageUrl}
                alt={promo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4">
                <span className="text-white font-extrabold text-sm sm:text-base">{promo.title}</span>
                <span className="text-blue-200 text-xs font-medium mt-0.5">{promo.subtitle}</span>
              </div>
            </a>
          ))}
          
          {/* Duplicate set for seamless scrolling */}
          {activePromos.map((promo) => (
            <a
              key={promo.id + '-dup'}
              href={promo.linkUrl || '#'}
              target={promo.linkUrl && promo.linkUrl !== '#' ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className="block w-[280px] sm:w-[350px] h-[140px] sm:h-[160px] rounded-xl overflow-hidden flex-shrink-0 group relative shadow-md"
            >
              <img
                src={promo.imageUrl}
                alt={promo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4">
                <span className="text-white font-extrabold text-sm sm:text-base">{promo.title}</span>
                <span className="text-blue-200 text-xs font-medium mt-0.5">{promo.subtitle}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
