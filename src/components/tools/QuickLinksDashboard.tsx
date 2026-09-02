import React, { useState, useEffect } from 'react';
import { Link, ExternalLink, Plus, Trash2, Globe, Bookmark } from 'lucide-react';
import { Language } from '../../types';

interface QuickLinksDashboardProps {
  language: Language;
}

interface QuickLink {
  id: string;
  title: string;
  url: string;
  category: 'government' | 'banking' | 'utility' | 'other';
}

const defaultLinks: QuickLink[] = [
  { id: '1', title: 'UIDAI Aadhaar', url: 'https://uidai.gov.in/', category: 'government' },
  { id: '2', title: 'NSDL PAN (Protean)', url: 'https://www.onlineservices.nsdl.com/', category: 'government' },
  { id: '3', title: 'PM-Kisan', url: 'https://pmkisan.gov.in/', category: 'government' },
  { id: '4', title: 'Digital Seva Portal', url: 'https://digitalseva.csc.gov.in/', category: 'utility' },
  { id: '5', title: 'EPFO (PF)', url: 'https://unifiedportal-mem.epfindia.gov.in/', category: 'government' },
  { id: '6', title: 'Voter ID (NVSP)', url: 'https://voters.eci.gov.in/', category: 'government' }
];

export const QuickLinksDashboard: React.FC<QuickLinksDashboardProps> = ({ language }) => {
  const isHindi = language === 'hi';
  const [links, setLinks] = useState<QuickLink[]>(() => {
    const saved = localStorage.getItem('quick_links');
    return saved ? JSON.parse(saved) : defaultLinks;
  });

  const [newLink, setNewLink] = useState<Partial<QuickLink>>({ category: 'other' });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    localStorage.setItem('quick_links', JSON.stringify(links));
  }, [links]);

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLink.title || !newLink.url) return;
    
    let formattedUrl = newLink.url;
    if (!formattedUrl.startsWith('http')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    const link: QuickLink = {
      id: Date.now().toString(),
      title: newLink.title,
      url: formattedUrl,
      category: newLink.category as any
    };
    
    setLinks([...links, link]);
    setNewLink({ category: 'other', title: '', url: '' });
    setIsAdding(false);
  };

  const deleteLink = (id: string) => {
    setLinks(links.filter(l => l.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">{isHindi ? 'CSC शॉर्टकट लिंक्स (Quick Links)' : 'CSC Quick Links Dashboard'}</h2>
              <p className="text-xs text-slate-500">{isHindi ? 'रोज़मर्रा की वेबसाइट्स को 1-क्लिक में खोलें।' : 'Access your daily websites in 1-click.'}</p>
            </div>
          </div>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> {isHindi ? 'लिंक जोड़ें' : 'Add Link'}
          </button>
        </div>
      </div>

      {isAdding && (
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-4">{isHindi ? 'नया वेबसाइट लिंक जोड़ें' : 'Add New Website Link'}</h3>
          <form onSubmit={handleAddLink} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-xs font-semibold text-slate-600 mb-1">{isHindi ? 'वेबसाइट का नाम' : 'Website Name'}</label>
              <input type="text" value={newLink.title || ''} onChange={e => setNewLink({...newLink, title: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" placeholder="e.g. PF Portal" required />
            </div>
            <div className="flex-1 w-full">
              <label className="block text-xs font-semibold text-slate-600 mb-1">{isHindi ? 'वेबसाइट का URL (Link)' : 'Website URL'}</label>
              <input type="text" value={newLink.url || ''} onChange={e => setNewLink({...newLink, url: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" placeholder="e.g. google.com" required />
            </div>
            <div className="w-full md:w-48">
              <label className="block text-xs font-semibold text-slate-600 mb-1">{isHindi ? 'श्रेणी' : 'Category'}</label>
              <select value={newLink.category} onChange={e => setNewLink({...newLink, category: e.target.value as any})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold">
                <option value="government">{isHindi ? 'सरकारी' : 'Government'}</option>
                <option value="banking">{isHindi ? 'बैंकिंग' : 'Banking'}</option>
                <option value="utility">{isHindi ? 'पोर्टल (CSC/Sahaj)' : 'Utility'}</option>
                <option value="other">{isHindi ? 'अन्य' : 'Other'}</option>
              </select>
            </div>
            <button type="submit" className="w-full md:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-sm transition-colors">
              {isHindi ? 'सेव करें' : 'Save'}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {links.map(link => (
          <div key={link.id} className="bg-white border border-slate-200 hover:border-blue-400 p-4 rounded-xl shadow-sm transition-all group flex flex-col justify-between">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                  <Bookmark className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{link.title}</h4>
                  <span className="text-[10px] uppercase font-bold text-slate-400">{link.category}</span>
                </div>
              </div>
              <button 
                onClick={() => deleteLink(link.id)}
                className="text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <button
                onClick={() => {
                  const win = window.open(link.url, '_blank');
                  if (!win) {
                    alert(isHindi 
                      ? "सुरक्षा कारणों से पॉप-अप ब्लॉक हो गया है। कृपया इस लिंक को कॉपी करें और नए टैब में खोलें:\n\n" + link.url 
                      : "Pop-ups blocked. Please copy this link and open in a new tab:\n\n" + link.url);
                  }
                }}
                className="w-full py-2 bg-slate-50 hover:bg-blue-50 text-blue-600 border border-slate-200 hover:border-blue-200 font-bold rounded-lg text-xs flex items-center justify-center gap-2 transition-colors"
              >
                {isHindi ? 'वेबसाइट खोलें' : 'Open Link'} <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
