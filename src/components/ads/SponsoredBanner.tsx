import React, { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';

interface BannerData {
  id: string;
  imageUrl: string;
  title: string;
  link: string;
}

export const SponsoredBanner: React.FC = () => {
  const [banners, setBanners] = useState<BannerData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Simulate fetching promotional banners from an API
  useEffect(() => {
    const fetchBanners = async () => {
      setLoading(true);
      // Simulating network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockBanners: BannerData[] = [
        {
          id: 'promo-1',
          imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=1600&h=400',
          title: 'Special Offer: Cyber Cafe Management Software',
          link: '#'
        },
        {
          id: 'promo-2',
          imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1600&h=400',
          title: 'Boost Your Online Services Revenue',
          link: '#'
        },
        {
          id: 'promo-3',
          imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1600&h=400',
          title: 'Partner with us for Digital Services',
          link: '#'
        },
        {
          id: 'promo-4',
          imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1600&h=400',
          title: 'Start PAN Card Agency - Instant Approvals',
          link: '#'
        },
        {
          id: 'promo-5',
          imageUrl: 'https://images.unsplash.com/photo-1556740714-a8395b3bf30f?auto=format&fit=crop&q=80&w=1600&h=400',
          title: 'Become an Authorized AEPS Banking Point',
          link: '#'
        },
        {
          id: 'promo-6',
          imageUrl: 'https://images.unsplash.com/photo-1621574539437-4b7b91384f5e?auto=format&fit=crop&q=80&w=1600&h=400',
          title: 'Bulk SMS Plans for Local Marketing',
          link: '#'
        },
        {
          id: 'promo-7',
          imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=1600&h=400',
          title: 'Flight & Train Ticket Booking Agent Access',
          link: '#'
        },
        {
          id: 'promo-8',
          imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1600&h=400',
          title: 'Get Premium Tech Support for CSC Operators',
          link: '#'
        },
        {
          id: 'promo-9',
          imageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=1600&h=400',
          title: 'Aadhaar Print Services - High Quality PVC',
          link: '#'
        },
        {
          id: 'promo-10',
          imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1600&h=400',
          title: 'Income, Caste & Domicile Certificates - Fast Track',
          link: '#'
        }
      ];
      
      setBanners(mockBanners);
      setLoading(false);
    };

    fetchBanners();
  }, []);

  // Auto-sliding carousel logic
  useEffect(() => {
    if (banners.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 5000); // 5 seconds per slide

    return () => clearInterval(interval);
  }, [banners.length]);

  if (loading) {
    return (
      <div className="w-full h-32 md:h-40 bg-slate-200 rounded-2xl animate-pulse flex items-center justify-center border border-slate-300">
        <span className="text-slate-400 font-medium text-sm">Loading Sponsored Offers...</span>
      </div>
    );
  }

  if (banners.length === 0) return null;

  return (
    <div className="relative w-full h-32 md:h-48 lg:h-56 rounded-2xl overflow-hidden bg-slate-900 group shadow-sm ring-1 ring-slate-200">
      {/* Banner Label */}
      <div className="absolute top-3 right-3 z-30 pointer-events-none">
        <span className="bg-black/40 backdrop-blur-md text-white text-[9px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full border border-white/20">
          Sponsored
        </span>
      </div>

      {/* Slides */}
      {banners.map((banner, index) => {
        const isActive = index === currentIndex;
        return (
          <a
            key={banner.id}
            href={banner.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Image Background */}
            <img
              src={banner.imageUrl}
              alt={banner.title}
              className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            
            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
            
            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-20 flex items-end justify-between gap-4">
              <h3 className="text-white font-bold text-sm md:text-lg lg:text-xl drop-shadow-md line-clamp-2 max-w-[80%]">
                {banner.title}
              </h3>
              <div className="shrink-0 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-blue-600 transition-colors">
                <ExternalLink className="w-4 h-4" />
              </div>
            </div>
          </a>
        );
      })}

      {/* Dots Indicator */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-30">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`transition-all duration-300 rounded-full h-1.5 ${
                idx === currentIndex ? 'bg-white w-4' : 'bg-white/40 w-1.5 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
