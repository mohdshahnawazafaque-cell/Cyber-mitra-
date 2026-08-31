const fs = require('fs');

const code = `import React, { useEffect, useRef, useState } from 'react';
import { 
  ArrowRight, 
  CornerDownLeft, 
  FileCode, 
  Landmark, 
  Sparkles, 
  Wrench,
  Printer,
  Search
} from 'lucide-react';
import { Language, AppState } from '../../types';

interface SmartSearchProps {
  isOpen: boolean;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  onClose: () => void;
  language: Language;
  services: AppState['services'];
  templates: AppState['applicationTemplates'];
  onNavigate: (view: string, subCategory?: string) => void;
  onOpenServiceLink: (url: string, title: string) => void;
}

type SearchResultItem = {
  id: string;
  title: string;
  subtitle: string;
  type: 'service' | 'tool' | 'template' | 'ai' | 'preset';
  targetView: string;
  subCategory?: string;
  url?: string;
  tags: string[];
};

export const SmartSearch: React.FC<SmartSearchProps> = ({
  isOpen,
  searchQuery,
  setSearchQuery,
  onClose,
  language,
  services,
  templates,
  onNavigate,
  onOpenServiceLink,
}) => {
  const isHindi = language === 'hi';
  const [selectedIndex, setSelectedIndex] = useState(0);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Compile full search index
  const toolItems: SearchResultItem[] = [
    {
      id: 'photo-tools',
      title: isHindi ? 'फोटो क्रॉप व 20KB/50KB रिसाइज' : 'Photo Crop & 20KB/50KB Resize',
      subtitle: isHindi ? 'पासपोर्ट फोटो बनाएं व साइज कम करें' : 'Resize photos for online forms',
      type: 'tool',
      targetView: 'photo_tools',
      tags: ['photo', 'resize', 'crop', '20kb', '50kb', 'फोटो'],
    },
    {
      id: 'pdf-tools',
      title: isHindi ? 'PDF टूल्स (मर्ज, कंप्रेस, इमेज से PDF)' : 'PDF Tools (Merge, Compress, JPG to PDF)',
      subtitle: isHindi ? 'दस्तावेज स्कैन व साइज कम करें' : 'Document scanner and size reducer',
      type: 'tool',
      targetView: 'pdf_tools',
      tags: ['pdf', 'compress', 'merge', 'jpg to pdf', 'दस्तावेज'],
    },
    {
      id: 'ai-letter-writer',
      title: isHindi ? 'AI औपचारिक प्रार्थना पत्र लेखक' : 'AI Formal Application Writer',
      subtitle: isHindi ? 'तहसीलदार, बैंक प्रबंधक, बिजली विभाग हेतु त्वरित पत्र' : 'Instant formal application generator',
      type: 'ai',
      targetView: 'ai_studio',
      subCategory: 'writing',
      tags: ['ai', 'letter', 'application', 'प्रार्थना पत्र', 'आवेदन पत्र'],
    },
    {
      id: 'print-queue-hub',
      title: isHindi ? 'प्रिंट केंद्र व क्यू' : 'Print Center & Job Queue',
      subtitle: isHindi ? 'A4, 4x6, फोटो शीट व दस्तावेज प्रिंटिंग' : 'Manage print queue and formatting',
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

  const normalizedQuery = searchQuery.toLowerCase().trim();

  const filteredItems = allItems.filter((item) => {
    if (!normalizedQuery) return true;
    
    // STRICT SEARCH: ONLY match the title exactly or match the tags exactly
    // We removed subtitle matching and loose tag matching to prevent "extra" results
    const matchesTitle = item.title.toLowerCase().includes(normalizedQuery);
    const matchesTags = item.tags.some((tag) => tag.toLowerCase() === normalizedQuery || tag.toLowerCase().includes(normalizedQuery));
    
    return matchesTitle || matchesTags;
  });

  const displayedItems = filteredItems.slice(0, 16);

  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(0);
    } else {
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

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
        \`[data-item-index="\${selectedIndex}"]\`
      );
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  // If search is not open, OR search query is empty, do not render ANYTHING.
  if (!isOpen || !searchQuery.trim()) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 transition-all duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* We removed the backdrop bg-slate-950/20 so the user can easily click elsewhere without a blocking modal */}
      <div className="w-full max-w-3xl bg-white/95 backdrop-blur-2xl rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-200 ring-1 ring-black/5 overflow-hidden flex flex-col max-h-[84vh] animate-in fade-in slide-in-from-top-4 duration-200">
        
        {/* Results List with Enhanced Spacing & Visual Hierarchy */}
        <div
          ref={resultsContainerRef}
          className="flex-1 overflow-y-auto p-3 space-y-1.5 min-h-[100px]"
        >
          {displayedItems.length === 0 ? (
            <div className="py-14 text-center text-slate-400">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-700">
                {isHindi ? 'कोई परिणाम नहीं मिला' : 'No matching results found'}
              </p>
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
                  className={\`w-full text-left p-3.5 rounded-xl transition-all flex items-center justify-between gap-3 group border \${
                    isSelected
                      ? 'bg-blue-50/90 border-blue-200/80 shadow-2xs'
                      : 'bg-white/60 hover:bg-slate-50 border-transparent'
                  }\`}
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    {/* Visual Icon Badge */}
                    <div
                      className={\`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-2xs border transition-colors \${
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
                      }\`}
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
                          className={\`font-bold text-sm truncate \${
                            isSelected ? 'text-blue-900' : 'text-slate-800'
                          }\`}
                        >
                          {item.title}
                        </span>
                        <span
                          className={\`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider \${
                            item.type === 'service'
                              ? 'bg-blue-100/80 text-blue-700'
                              : item.type === 'tool'
                              ? 'bg-amber-100/80 text-amber-700'
                              : item.type === 'ai'
                              ? 'bg-purple-100/80 text-purple-700'
                              : item.type === 'template'
                              ? 'bg-emerald-100/80 text-emerald-700'
                              : 'bg-sky-100/80 text-sky-700'
                          }\`}
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
      </div>
    </div>
  );
};
`
fs.writeFileSync('src/components/common/SmartSearch.tsx', code);
console.log("Rewrote SmartSearch");
