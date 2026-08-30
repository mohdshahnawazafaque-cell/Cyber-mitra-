import React from 'react';
import { AdSlotConfig } from '../../types';

interface AdSlotProps {
  slot: AdSlotConfig;
  className?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({ slot, className = '' }) => {
  if (!slot.enabled) return null;

  return (
    <aside
      aria-label="Advertisement"
      className={`my-4 p-3 bg-slate-50 border border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center text-center overflow-hidden relative ${className}`}
    >
      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2 z-10 bg-white/80 px-2 py-0.5 rounded-full backdrop-blur-sm">
        SPONSORED
      </span>

      {slot.adType === 'custom_image' && slot.imageUrl ? (
        <a href={slot.linkUrl || '#'} target="_blank" rel="noopener noreferrer" className="w-full h-full block">
          <img 
            src={slot.imageUrl} 
            alt="Promotion Banner" 
            className="w-full h-auto max-h-48 object-contain rounded-xl"
          />
        </a>
      ) : slot.code ? (
        <div
          dangerouslySetInnerHTML={{ __html: slot.code }}
          className="w-full flex justify-center relative z-10"
        />
      ) : (
        <div className="w-full max-w-2xl py-3 px-4 bg-slate-100 rounded-xl border border-slate-200 text-slate-500 text-xs relative z-10">
          <p className="font-semibold">Advertisement Slot ({slot.size})</p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Ad slot is ready. Admin can set up promotions from Admin Panel.
          </p>
        </div>
      )}
    </aside>
  );
};
