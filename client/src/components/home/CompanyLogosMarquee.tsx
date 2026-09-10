import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { Brand } from '../../types';
import { ShieldCheck, ExternalLink, Award } from 'lucide-react';

const fallbackBrands: Brand[] = [
  {
    id: '1',
    name: 'Tata Steel',
    slug: 'tata-steel',
    logoUrl: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=400&q=80',
    description: 'Certified Construction Rebars • Heavy Structural Beams',
    isActive: true,
  },
  {
    id: '2',
    name: 'JSW Steel',
    slug: 'jsw-steel',
    logoUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80',
    description: 'High-Strength Steel • Earthquake Resistant Construction Steel',
    isActive: true,
  },
  {
    id: '3',
    name: 'SAIL',
    slug: 'sail',
    logoUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=400&q=80',
    description: 'Government Steel Authority • Heavy Industrial Plates & Beams',
    isActive: true,
  },
  {
    id: '4',
    name: 'Jindal Steel & Power',
    slug: 'jindal-steel-power',
    logoUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80',
    description: 'High-Tensile Parallel Beams • Premium Quality Steel Rebars',
    isActive: true,
  },
  {
    id: '5',
    name: 'AM/NS India',
    slug: 'amns-india',
    logoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
    description: 'ArcelorMittal Nippon Steel • Premium Sheets & Galvanized Steel',
    isActive: true,
  },
  {
    id: '6',
    name: 'RINL Vizag Steel',
    slug: 'rinl-vizag-steel',
    logoUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=400&q=80',
    description: 'Vizag Steel Plant • Heavy Structural Angles & Steel Rods',
    isActive: true,
  },
  {
    id: '7',
    name: 'APL Apollo Tubes',
    slug: 'apl-apollo-tubes',
    logoUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80',
    description: 'Heavy-Duty Hollow Sections • Industrial Square & Round Pipes',
    isActive: true,
  },
];

export const CompanyLogosMarquee: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get('/brands')
      .then((res: any) => {
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          const activeOnly = res.data.filter((b: Brand) => b.isActive);
          setBrands(activeOnly.length > 0 ? activeOnly : fallbackBrands);
        } else {
          setBrands(fallbackBrands);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch brands from API, using fallback:', err);
        setBrands(fallbackBrands);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const displayList = brands.length > 0 ? brands : fallbackBrands;
  // Duplicate list to achieve continuous, gapless marquee scrolling
  const marqueeItems = [...displayList, ...displayList, ...displayList];

  return (
    <section className="relative w-full bg-[#FAFCFA] border-b border-[#E2EBE5] py-4 sm:py-5 overflow-hidden select-none">
      {/* Subtle section label */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#07552B] animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#07552B]">
            Authorized Steel Manufacturers & Supply Partners
          </span>
        </div>
        <span className="hidden sm:inline-block text-[11px] font-medium text-[#526458]">
          Direct Factory Supply • 100% Certified Quality Guaranteed
        </span>
      </div>

      {/* Left and Right gradient edge masks for smooth appearance */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#FAFCFA] to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#FAFCFA] to-transparent z-10" />

      {/* Marquee Track (Smooth Continuous Right to Left) */}
      <div className="flex overflow-hidden group">
        <div className="animate-marquee-infinite flex items-center gap-4 sm:gap-6 py-1">
          {marqueeItems.map((brand, idx) => {
            // Derive clean badge label or spec code from description
            const desc = brand.description || 'Primary Industrial Grade Steel';
            const parts = desc.split('•');
            const subLabel = parts.length > 1 ? parts[0].trim() : 'AUTHORISED MILL';
            const specBadge = parts.length > 1 ? parts[1].trim() : parts[0].trim();

            return (
              <Link
                key={`${brand.id}-${idx}`}
                to={`/products?search=${encodeURIComponent(brand.name)}`}
                className="group/card flex items-center gap-3.5 px-4 py-3 bg-white border border-[#E2EBE5] rounded-2xl shadow-sm hover:shadow-md hover:border-[#07552B] transition-all duration-300 shrink-0 min-w-[280px] sm:min-w-[320px] max-w-[340px]"
              >
                {/* Logo Avatar Box */}
                <div className="w-12 h-12 rounded-xl bg-[#FAFCFA] border border-[#E2EBE5] flex items-center justify-center p-1.5 shrink-0 overflow-hidden group-hover/card:border-[#07552B]/40 transition">
                  {brand.logoUrl ? (
                    <img
                      src={brand.logoUrl}
                      alt={brand.name}
                      className="w-full h-full object-cover rounded-lg"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full rounded-lg bg-[#EBF3ED] flex items-center justify-center text-[#07552B] font-black text-sm">
                      {brand.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Content Info */}
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#526458] truncate">
                      {subLabel}
                    </span>
                    <ShieldCheck className="w-3.5 h-3.5 text-[#07552B] shrink-0 opacity-80" />
                  </div>

                  <span className="text-sm font-black text-[#111814] truncate font-sans group-hover/card:text-[#07552B] transition">
                    {brand.name}
                  </span>

                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="inline-flex items-center text-[10px] font-bold text-[#07552B] bg-[#EBF3ED] px-2 py-0.5 rounded-full border border-[#D0DDD4] truncate max-w-[200px]">
                      {specBadge}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
