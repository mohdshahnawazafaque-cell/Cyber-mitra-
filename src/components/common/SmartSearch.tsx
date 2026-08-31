import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  Zap,
  Wrench,
  Sparkles,
  Printer,
  FileCode,
  ArrowRight,
  Landmark,
  CornerDownLeft,
  SlidersHorizontal,
} from 'lucide-react';
import { GovernmentService, Language, ApplicationTemplate } from '../../types';

interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  type: 'service' | 'tool' | 'template' | 'preset' | 'ai';
  targetView: string;
  subCategory?: string;
  url?: string;
  tags: string[];
}

interface SmartSearchProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  services: GovernmentService[];
  templates: ApplicationTemplate[];
  onNavigate: (view: string, subCategory?: string) => void;
  onOpenServiceLink: (url: string, serviceTitle: string) => void;
}

export const SmartSearch: React.FC<SmartSearchProps> = ({
  isOpen,
  onClose,
  language,
  services,
  templates,
  onNavigate,
}) => {
  const isHindi = language === 'hi';
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'gov' | 'tool' | 'ai' | 'form'>('all');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Build searchable items
  const toolItems: SearchResultItem[] = [
    {
      id: 'tool-photo-resize',
      title: isHindi ? 'फोटो रिसाइज व केबी सेट (Photo Resize / KB Target)' : 'Photo Resize & KB Target',
      subtitle: isHindi ? '20KB, 50KB, 100KB साइज फिक्स करें' : 'Resize photos to exact KB limits',
      type: 'tool',
      targetView: 'photo_tools',
      tags: ['photo', 'resize', 'compress', 'kb', 'फोटो', 'रिसाइज'],
    },
    {
      id: 'tool-passport-photo',
      title: isHindi ? 'पासपोर्ट फोटो शीट मेकर (Passport Photo Sheet 4x6 / A4)' : 'Passport Photo Sheet Maker',
      subtitle: isHindi ? 'नाम व तारीख स्टैम्प के साथ 6, 8, 12, 16 फोटो शीट बनाएं' : 'Make 4x6 or A4 photo sheets with name & date stamp',
      type: 'tool',
      targetView: 'photo_tools',
      tags: ['passport', 'sheet', 'stamp', 'पासपोर्ट फोटो', 'शीट'],
    },
    {
      id: 'tool-signature-clean',
      title: isHindi ? 'हस्ताक्षर क्लीनर व रिसाइजर (Signature Enhancer)' : 'Signature Enhancer & B/W Cleaner',
      subtitle: isHindi ? '10-20 KB ब्लैक एंड व्हाइट हस्ताक्षर पोर्टल अपलोड हेतु' : 'High contrast clean signature for portal upload',
      type: 'tool',
      targetView: 'photo_tools',
      tags: ['signature', 'sign', 'दस्तखत', 'हस्ताक्षर', 'सिग्नेचर'],
    },
    {
      id: 'tool-jpg-pdf',
      title: isHindi ? 'फोटो से पीडीएफ बनाएं (Images to PDF)' : 'Images / Scans to PDF Converter',
      subtitle: isHindi ? 'मल्टीपल फोटो व स्कैन को एक A4 PDF में जोड़ें' : 'Combine multiple photos into single A4 PDF',
      type: 'tool',
      targetView: 'pdf_tools',
      tags: ['pdf', 'jpg to pdf', 'merge', 'पीडीएफ'],
    },
    {
      id: 'tool-id-duo',
      title: isHindi ? 'आईडी कार्ड डुप्लेक्स प्रिंट (ID Card Front & Back)' : 'ID Card Front & Back Print Layout',
      subtitle: isHindi ? 'आधार/पैन कार्ड को 85.6mm x 53.98mm साइज में प्रिंट करें' : 'Print side by side ID card on standard photo paper',
      type: 'tool',
      targetView: 'print_center',
      tags: ['id card', 'pvc', 'aadhaar print', 'pan print', 'आईडी कार्ड'],
    },
    {
      id: 'ai-writing-letter',
      title: isHindi ? 'एआई औपचारिक प्रार्थना पत्र लेखक (AI Letter Writer)' : 'AI Formal Application Writer',
      subtitle: isHindi ? 'तहसीलदार, बैंक प्रबंधक, बिजली विभाग हेतु त्वरित पत्र' : 'Instant formal Hindi/English application generator',
      type: 'ai',
      targetView: 'ai_studio',
      subCategory: 'writing',
      tags: ['ai', 'letter', 'application', 'प्रार्थना पत्र', 'आवेदन पत्र'],
    },
    {
      id: 'ai-assistant-bot',
      title: isHindi ? 'एआई साइबर मित्र सहायक (AI Cyber Cafe Assistant)' : 'AI Cyber Cafe Query Assistant',
      subtitle: isHindi ? 'सरकारी नियमों, आवश्यक दस्तावेजों और समस्याओं का समाधान' : 'Ask questions about government portal procedures',
      type: 'ai',
      targetView: 'ai_studio',
      subCategory: 'assistant',
      tags: ['ai', 'assistant', 'help', 'सहायक', 'पूछें'],
    },
    {
      id: 'print-queue-hub',
      title: isHindi ? 'प्रिंट केंद्र व क्यू (Print Center)' : 'Print Center & Job Queue',
      subtitle: isHindi ? 'A4, 4x6, पासपोर्ट फोटो शीट व दस्तावेज प्रिंटिंग' : 'Manage print queue and instant formatting',
      type: 'preset',
      targetView: 'print_center',
      tags: ['print', 'printer', 'कलर प्रिंट', 'प्रिंट'],
    },
  ];

  const govItems: SearchResultItem[] = services
    .filter((s) => s.active)
    .map((s) => ({
      id: 'gov-' + s.id,
      title: isHindi ? s.titleHi : s.titleEn,
      subtitle: isHindi ? s.descHi : s.descEn,
      type: 'service',
      targetView: 'services',
      subCategory: s.category,
      url: s.officialLinks.officialPortal || s.officialLinks.apply,
      tags: [...s.tags, s.titleHi, s.titleEn, s.descHi, s.descEn],
    }));

  const formItems: SearchResultItem[] = templates.map((t) => ({
    id: 'tpl-' + t.id,
    title: isHindi ? t.titleHi : t.titleEn,
    subtitle: isHindi ? t.descriptionHi : t.descriptionEn,
    type: 'template',
    targetView: 'application-builder',
    tags: [t.titleHi, t.titleEn, t.descriptionHi, t.descriptionEn, 'template', 'आवेदन पत्र'],
  }));

  const allItems = [...govItems, ...toolItems, ...formItems];
  const normalizedQuery = query.toLowerCase().trim();

  const filteredItems = allItems.filter((item) => {
    if (activeFilter === 'gov' && item.type !== 'service') return false;
    if (activeFilter === 'tool' && item.type !== 'tool' && item.type !== 'preset') return false;
    if (activeFilter === 'ai' && item.type !== 'ai') return false;
    if (activeFilter === 'form' && item.type !== 'template') return false;

    if (!normalizedQuery) return true;

    const matchesTitle = item.title.toLowerCase().includes(normalizedQuery);
    const matchesSubtitle = item.subtitle.toLowerCase().includes(normalizedQuery);
    const matchesTags = item.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));

    return matchesTitle || matchesSubtitle || matchesTags;
  });

  const displayedItems = filteredItems.slice(0, 16);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query, activeFilter]);

  const handleSelect = (item: SearchResultItem) => {
    onClose();
    if (item.type === 'service' && item.url) {
      onOpenServiceLink(item.url, item.title);
    } else {
      onNavigate(item.targetView, item.subCategory);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < displayedItems.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (displayedItems[selectedIndex]) {
          handleSelect(displayedItems[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, displayedItems, selectedIndex, onClose]);

  // Keep highlighted item in view
  useEffect(() => {
    if (resultsContainerRef.current) {
      const selectedEl = resultsContainerRef.current.querySelector(
        `[data-item-index="${selectedIndex}"]`
      );
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  const quickPills = [
    { label: isHindi ? 'आधार सेवाएं' : 'Aadhaar Card', query: 'aadhaar' },
    { label: isHindi ? 'पैन कार्ड (PAN)' : 'PAN Card', query: 'pan' },
    { label: isHindi ? 'किसान सेवाएं (Kisan)' : 'Kisan Services', query: 'kisan' },
    { label: isHindi ? 'फोटो 20KB रिसाइज' : 'Photo 20KB', query: 'photo' },
    { label: isHindi ? 'हस्ताक्षर क्लीन' : 'Signature Clean', query: 'signature' },
    { label: isHindi ? 'AI पत्र लेखन' : 'AI Letter', query: 'letter' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-14 sm:pt-16 px-4 transition-all duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-3xl bg-white/95 backdrop-blur-2xl rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-200 ring-1 ring-black/5 overflow-hidden flex flex-col max-h-[84vh] animate-in fade-in slide-in-from-top-4 duration-200">
        {/* Top Search Input Box */}
        <div className="p-3 sm:p-4 border-b border-slate-200 flex items-center gap-3 bg-white">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-2xs border border-blue-100">
            <Search className="w-5 h-5" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              isHindi
                ? 'सरकारी सेवा, टूल, फोटो रिसाइज, आवेदन पत्र खोजें...'
                : 'Search Govt Service, Photo Tool, PDF, Application Template...'
            }
            className="flex-1 bg-transparent text-slate-900 text-base sm:text-lg font-medium placeholder-slate-400 focus:outline-none"
          />

          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center gap-1.5 shrink-0">
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-1 text-[11px] font-mono font-semibold bg-slate-100 text-slate-500 rounded-md border border-slate-200">
              ESC
            </kbd>
            <button
              onClick={onClose}
              className="sm:hidden p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Navigation Chips */}
        <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/70 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-full font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              activeFilter === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-200/80 border border-slate-200/70'
            }`}
          >
            <span>{isHindi ? 'सभी' : 'All'}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeFilter === 'all' ? 'bg-blue-700 text-blue-100' : 'bg-slate-100 text-slate-500'
              }`}
            >
              {allItems.length}
            </span>
          </button>

          <button
            onClick={() => setActiveFilter('gov')}
            className={`px-3 py-1.5 rounded-full font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
              activeFilter === 'gov'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-200/80 border border-slate-200/70'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>{isHindi ? 'सरकारी सेवाएं' : 'Govt Services'}</span>
          </button>

          <button
            onClick={() => setActiveFilter('tool')}
            className={`px-3 py-1.5 rounded-full font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
              activeFilter === 'tool'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-200/80 border border-slate-200/70'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>{isHindi ? 'फोटो व PDF टूल्स' : 'Photo & PDF Tools'}</span>
          </button>

          <button
            onClick={() => setActiveFilter('ai')}
            className={`px-3 py-1.5 rounded-full font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
              activeFilter === 'ai'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-200/80 border border-slate-200/70'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isHindi ? 'AI स्टूडियो' : 'AI Studio'}</span>
          </button>

          <button
            onClick={() => setActiveFilter('form')}
            className={`px-3 py-1.5 rounded-full font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
              activeFilter === 'form'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-200/80 border border-slate-200/70'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>{isHindi ? 'आवेदन प्रारूप' : 'Templates'}</span>
          </button>
        </div>

        {/* Quick Suggestion Pills (Shown when no search query is typed) */}
        {!normalizedQuery && (
          <div className="px-4 py-2.5 bg-blue-50/40 border-b border-blue-100/60 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
            <span className="text-[11px] font-bold text-slate-500 shrink-0 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
              {isHindi ? 'त्वरित खोज:' : 'Popular:'}
            </span>
            {quickPills.map((pill, i) => (
              <button
                key={i}
                onClick={() => setQuery(pill.query)}
                className="px-2.5 py-0.5 rounded-full bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200 font-medium text-[11px] shrink-0 transition-colors"
              >
                {pill.label}
              </button>
            ))}
          </div>
        )}

        {/* Results List with Enhanced Spacing & Visual Hierarchy */}
        <div
          ref={resultsContainerRef}
          className="flex-1 overflow-y-auto p-3 space-y-1.5 min-h-[220px]"
        >
          {displayedItems.length === 0 ? (
            <div className="py-14 text-center text-slate-400">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-700">
                {isHindi ? 'कोई परिणाम नहीं मिला' : 'No matching results found'}
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                {isHindi
                  ? 'कृपया अन्य कीवर्ड खोजें (जैसे: आधार, पैन, फोटो, आय, जाति, निवास)'
                  : 'Try searching for Aadhaar, PAN, Photo resize, Income certificate, or AI'}
              </p>
              {activeFilter !== 'all' && (
                <button
                  onClick={() => setActiveFilter('all')}
                  className="mt-3.5 px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg border border-blue-200 transition-colors"
                >
                  {isHindi ? 'सभी श्रेणियों में खोजें' : 'Search All Categories'}
                </button>
              )}
            </div>
          ) : (
            displayedItems.map((item, index) => {
              const isSelected = index === selectedIndex;

              return (
                <button
                  key={item.id}
                  data-item-index={index}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full text-left p-3.5 rounded-xl transition-all flex items-center justify-between gap-3 group border ${
                    isSelected
                      ? 'bg-blue-50/90 border-blue-200/80 shadow-2xs'
                      : 'bg-white/60 hover:bg-slate-50 border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    {/* Visual Icon Badge */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-2xs border transition-colors ${
                        item.type === 'service'
                          ? isSelected
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-blue-50 text-blue-600 border-blue-100'
                          : item.type === 'tool'
                          ? isSelected
                            ? 'bg-amber-500 text-white border-amber-500'
                            : 'bg-amber-50 text-amber-600 border-amber-100'
                          : item.type === 'ai'
                          ? isSelected
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'bg-purple-50 text-purple-600 border-purple-100'
                          : item.type === 'template'
                          ? isSelected
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          : isSelected
                          ? 'bg-sky-600 text-white border-sky-600'
                          : 'bg-sky-50 text-sky-600 border-sky-100'
                      }`}
                    >
                      {item.type === 'service' && <Landmark className="w-4 h-4" />}
                      {item.type === 'tool' && <Wrench className="w-4 h-4" />}
                      {item.type === 'ai' && <Sparkles className="w-4 h-4" />}
                      {item.type === 'template' && <FileCode className="w-4 h-4" />}
                      {item.type === 'preset' && <Printer className="w-4 h-4" />}
                    </div>

                    {/* Text Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`font-bold text-sm truncate ${
                            isSelected ? 'text-blue-900' : 'text-slate-800'
                          }`}
                        >
                          {item.title}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            item.type === 'service'
                              ? 'bg-blue-100/80 text-blue-700'
                              : item.type === 'tool'
                              ? 'bg-amber-100/80 text-amber-700'
                              : item.type === 'ai'
                              ? 'bg-purple-100/80 text-purple-700'
                              : item.type === 'template'
                              ? 'bg-emerald-100/80 text-emerald-700'
                              : 'bg-sky-100/80 text-sky-700'
                          }`}
                        >
                          {item.type === 'service'
                            ? isHindi
                              ? 'पोर्टल'
                              : 'Gov Portal'
                            : item.type === 'tool'
                            ? isHindi
                              ? 'टूल'
                              : 'Tool'
                            : item.type === 'ai'
                            ? 'AI'
                            : item.type === 'template'
                            ? isHindi
                              ? 'प्रारूप'
                              : 'Template'
                            : isHindi
                            ? 'प्रिंट'
                            : 'Print'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-1 font-normal">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Action Hint */}
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    {isSelected ? (
                      <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 bg-blue-100/70 px-2 py-1 rounded-md border border-blue-200/80">
                        <span>{isHindi ? 'खोलें' : 'Open'}</span>
                        <CornerDownLeft className="w-3 h-3" />
                      </span>
                    ) : (
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Modal Footer with Keyboard Nav Legend */}
        <div className="p-3 bg-slate-50/90 border-t border-slate-200/80 text-xs text-slate-500 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <span className="hidden sm:inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">
                ↑
              </kbd>
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">
                ↓
              </kbd>
              <span>{isHindi ? 'चुनें' : 'Navigate'}</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">
                ↵
              </kbd>
              <span>{isHindi ? 'खोलें' : 'Select'}</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">
                ESC
              </kbd>
              <span>{isHindi ? 'बंद करें' : 'Close'}</span>
            </span>
          </div>

          <span className="font-bold text-[11px] text-blue-700 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-blue-500" />
            CYBER MITRA Smart Search
          </span>
        </div>
      </div>
    </div>
  );
};
