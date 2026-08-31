import React, { useState } from 'react';
import {
  ExternalLink,
  Star,
  FileCheck,
  PlusCircle,
  Edit3,
  Search,
  Download,
  Printer,
  Globe,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import { GovernmentService, Language } from '../../types';

interface ServiceCardProps {
  service: GovernmentService;
  language: Language;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpenLink: (url: string, title: string, actionType: string) => void;
  onApplyPreset?: (presetName: string) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  language,
  isFavorite,
  onToggleFavorite,
  onOpenLink,
  onApplyPreset,
}) => {
  const isHindi = language === 'hi';
  const [showDocs, setShowDocs] = useState(false);
  const links = service.officialLinks;

  const title = isHindi ? service.titleHi : service.titleEn;
  const desc = isHindi ? service.descHi : service.descEn;
  const docs = isHindi ? service.requiredDocsHi : service.requiredDocsEn;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:border-blue-300 relative">
      {/* Top Header Card */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="p-4 sm:p-5 pt-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap mb-3">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-50 text-slate-500 border border-slate-100">
              {service.stateCode === 'ALL'
                ? isHindi
                  ? 'अखिल भारतीय (Central)'
                  : 'Central / All India'
                : service.stateCode}
            </span>
            {service.isPopular && (
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                ⭐ {isHindi ? 'लोकप्रिय' : 'Popular'}
              </span>
            )}
          </div>

          {/* Favorite Toggle Button */}
          <button
            id={`btn-fav-${service.id}`}
            onClick={() => onToggleFavorite(service.id)}
            className={`p-1.5 rounded-lg transition-colors ${
              isFavorite
                ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                : 'text-slate-300 hover:text-amber-500 hover:bg-slate-50'
            }`}
            title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            aria-label="Favorite toggle"
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
          </button>
        </div>

        {/* Service Title & Sub-title (Dual English + Hindi / Bilingual clarity) */}
        <div>
          <h3 className="font-extrabold text-base text-slate-900 group-hover:text-blue-700 transition-colors mt-2 leading-snug">
            {isHindi ? service.titleHi : service.titleEn}
          </h3>
          <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
            {isHindi ? service.titleEn : service.titleHi}
          </p>
        </div>
        <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed font-normal">
          {desc}
        </p>

        {/* Smart Presets (if available) */}
        {service.smartPresets && service.smartPresets.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
              <Sliders className="w-2.5 h-2.5 text-blue-600" />
              <span>{isHindi ? 'रिसाइज प्रीसेट:' : 'Presets:'}</span>
            </span>
            {service.smartPresets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => onApplyPreset && onApplyPreset(preset)}
                className="text-[10px] bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 px-2 py-0.5 rounded-md font-semibold border border-slate-200 hover:border-blue-200 transition-colors"
                title={`Apply preset: ${preset}`}
              >
                {preset}
              </button>
            ))}
          </div>
        )}

        {/* Required Documents Toggle */}
        {docs && docs.length > 0 && (
          <div className="mt-2.5 pt-2 border-t border-slate-100">
            <button
              onClick={() => setShowDocs(!showDocs)}
              className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center justify-between w-full"
            >
              <div className="flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>{isHindi ? 'आवश्यक दस्तावेज सूची' : 'Required Documents'}</span>
                <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded-full font-bold">
                  {docs.length}
                </span>
              </div>
              {showDocs ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showDocs && (
              <ul className="mt-2 space-y-1.5 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                {docs.map((docItem, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{docItem}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Complete Official Link Action Panel */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center gap-2">
        {links.newApply && (
          <a href={links.newApply!} target="_blank" rel="noopener noreferrer"
            onClick={(e) => { e.stopPropagation(); if (links.newApply! === '#' || !links.newApply!) e.preventDefault(); onOpenLink(links.newApply!, title, 'Logged'); }}
            className="flex-1 min-w-[95px] flex items-center justify-center gap-1 px-2.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border border-blue-700/50 font-bold rounded-lg text-xs transition-colors shadow-2xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{isHindi ? 'नया आवेदन' : 'New Apply'}</span>
          </a>
        )}

        {links.apply && !links.newApply && (
          <a href={links.apply!} target="_blank" rel="noopener noreferrer"
            onClick={(e) => { e.stopPropagation(); if (links.apply! === '#' || !links.apply!) e.preventDefault(); onOpenLink(links.apply!, title, 'Logged'); }}
            className="flex-1 min-w-[95px] flex items-center justify-center gap-1 px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-colors shadow-2xs"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{isHindi ? 'आवेदन' : 'Apply Online'}</span>
          </a>
        )}

        {links.correction && (
          <a href={links.correction!} target="_blank" rel="noopener noreferrer"
            onClick={(e) => { e.stopPropagation(); if (links.correction! === '#' || !links.correction!) e.preventDefault(); onOpenLink(links.correction!, title, 'Logged'); }}
            className="flex-1 min-w-[80px] flex items-center justify-center gap-1 px-2 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg text-xs transition-colors shadow-2xs"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isHindi ? 'सुधार' : 'Correction'}</span>
          </a>
        )}

        {links.status && (
          <a href={links.status!} target="_blank" rel="noopener noreferrer"
            onClick={(e) => { e.stopPropagation(); if (links.status! === '#' || !links.status!) e.preventDefault(); onOpenLink(links.status!, title, 'Logged'); }}
            className="flex-1 min-w-[80px] flex items-center justify-center gap-1 px-2 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg text-xs transition-colors shadow-2xs"
          >
            <Search className="w-3.5 h-3.5" />
            <span>{isHindi ? 'स्टेटस' : 'Status'}</span>
          </a>
        )}

        {links.download && (
          <a href={links.download!} target="_blank" rel="noopener noreferrer"
            onClick={(e) => { e.stopPropagation(); if (links.download! === '#' || !links.download!) e.preventDefault(); onOpenLink(links.download!, title, 'Logged'); }}
            className="flex-1 min-w-[80px] flex items-center justify-center gap-1 px-2 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isHindi ? 'डाउनलोड' : 'Download'}</span>
          </a>
        )}

        {links.officialPortal && (
          <a href={links.officialPortal!} target="_blank" rel="noopener noreferrer"
            onClick={(e) => { e.stopPropagation(); if (links.officialPortal! === '#' || !links.officialPortal!) e.preventDefault(); onOpenLink(links.officialPortal!, title, 'Logged'); }}
            className="flex items-center justify-center gap-1 px-2 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-lg text-xs transition-colors border border-slate-300"
            title={isHindi ? 'आधिकारिक पोर्टल खोलें' : 'Open Official Govt Portal'}
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">{isHindi ? 'पोर्टल' : 'Portal'}</span>
          </a>
        )}
      </div>
    </div>
  );
};

