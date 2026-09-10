import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { Brand } from '../../types';
import { ArrowRight } from 'lucide-react';

// Authentic Vector SVGs for Top Selling Steel Brands
const BrandLogoSVG: React.FC<{ name: string; slug?: string }> = ({ name, slug = '' }) => {
  const normalized = (name + ' ' + slug).toLowerCase();

  // 1. Vizag Steel (RINL)
  if (normalized.includes('vizag') || normalized.includes('rinl')) {
    return (
      <svg viewBox="0 0 200 60" className="w-full h-full max-h-12 object-contain" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(10, 6)">
          {/* Circular Chakra Emblem */}
          <circle cx="24" cy="24" r="16" stroke="#007A3D" strokeWidth="2.5" fill="none" />
          <circle cx="24" cy="24" r="4" fill="#007A3D" />
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <line
              key={deg}
              x1="24"
              y1="24"
              x2={24 + 14 * Math.cos((deg * Math.PI) / 180)}
              y2={24 + 14 * Math.sin((deg * Math.PI) / 180)}
              stroke="#007A3D"
              strokeWidth="1.5"
            />
          ))}
          {/* Telugu / Hindi inscription curved simulation */}
          <path d="M 8 10 Q 24 2 40 10" stroke="#007A3D" strokeWidth="1" fill="none" />
        </g>
        <g transform="translate(62, 10)">
          {/* Top Hindi/RINL subtext */}
          <text x="0" y="8" fill="#007A3D" fontSize="8" fontWeight="600" fontFamily="sans-serif">
            राष्ट्रीय इस्पात निगम • RINL
          </text>
          {/* VIZAG */}
          <text x="0" y="24" fill="#007A3D" fontSize="17" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.5">
            VIZAG
          </text>
          {/* STEEL */}
          <text x="68" y="24" fill="#007A3D" fontSize="17" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.5">
            STEEL
          </text>
          {/* Pride of Steel in italic cursive */}
          <text x="1" y="36" fill="#007A3D" fontSize="9" fontStyle="italic" fontWeight="600" fontFamily="Georgia, serif">
            Pride of Steel
          </text>
        </g>
      </svg>
    );
  }

  // 2. Tata Steel
  if (normalized.includes('tata') && !normalized.includes('tiscon')) {
    return (
      <svg viewBox="0 0 200 60" className="w-full h-full max-h-12 object-contain" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(14, 10)">
          {/* Tata Classic Blue Oval Emblem */}
          <circle cx="20" cy="20" r="18" fill="#00508F" />
          <path d="M 9 14 C 15 14, 25 14, 31 14" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 12 20 C 17 20, 23 20, 28 20" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 15 26 C 18 26, 22 26, 25 26" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
        </g>
        <g transform="translate(62, 16)">
          <text x="0" y="22" fill="#00508F" fontSize="16" fontWeight="900" fontFamily="sans-serif" letterSpacing="1.2">
            TATA STEEL
          </text>
          <text x="0" y="32" fill="#526458" fontSize="7.5" fontWeight="600" fontFamily="sans-serif" letterSpacing="0.5">
            #1 INDIAN STEELMAKER
          </text>
        </g>
      </svg>
    );
  }

  // 3. Tata Tiscon
  if (normalized.includes('tiscon')) {
    return (
      <svg viewBox="0 0 200 60" className="w-full h-full max-h-12 object-contain" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(10, 12)">
          <circle cx="18" cy="18" r="16" fill="#00508F" />
          <path d="M 8 13 C 13 13, 23 13, 28 13" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M 11 18 C 15 18, 21 18, 25 18" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
        </g>
        <g transform="translate(52, 14)">
          <text x="0" y="14" fill="#00508F" fontSize="12" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.8">
            TATA
          </text>
          <rect x="0" y="18" width="84" height="18" rx="4" fill="#E63946" />
          <text x="6" y="31" fill="#FFFFFF" fontSize="12" fontWeight="900" fontFamily="sans-serif" letterSpacing="1">
            TISCON
          </text>
          <text x="90" y="31" fill="#00508F" fontSize="10" fontWeight="800" fontFamily="sans-serif">
            550D
          </text>
        </g>
      </svg>
    );
  }

  // 4. Jindal Panther
  if (normalized.includes('panther')) {
    return (
      <svg viewBox="0 0 200 60" className="w-full h-full max-h-12 object-contain" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(10, 8)">
          {/* Orange Hexagon with Panther Silhouette */}
          <polygon points="22,2 38,11 38,33 22,42 6,33 6,11" fill="#F37021" />
          {/* Panther head silhouette */}
          <path
            d="M 13 26 C 13 18, 17 14, 22 14 C 27 14, 31 18, 31 26 C 29 24, 27 24, 25 26 C 23 27, 21 27, 19 26 C 17 24, 15 24, 13 26 Z"
            fill="#111814"
          />
          <circle cx="18" cy="20" r="1.5" fill="#F37021" />
          <circle cx="26" cy="20" r="1.5" fill="#F37021" />
          <polygon points="22,23 20,26 24,26" fill="#111814" />
        </g>
        <g transform="translate(56, 12)">
          {/* Green swoosh over Panther */}
          <path d="M 28 6 Q 44 -2 58 4" stroke="#009639" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <text x="0" y="8" fill="#111814" fontSize="8" fontWeight="700" fontFamily="sans-serif">
            JINDAL
          </text>
          <text x="0" y="24" fill="#111814" fontSize="15" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.5">
            PANTHER
          </text>
          <text x="82" y="16" fill="#111814" fontSize="6" fontWeight="bold">
            TM
          </text>
          <text x="0" y="35" fill="#526458" fontSize="8.5" fontWeight="800" fontFamily="sans-serif" letterSpacing="1">
            TMT REBARS
          </text>
        </g>
      </svg>
    );
  }

  // 5. Essar Steel
  if (normalized.includes('essar')) {
    return (
      <svg viewBox="0 0 200 60" className="w-full h-full max-h-12 object-contain" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(18, 14)">
          <text x="0" y="22" fill="#111814" fontSize="22" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.5">
            ESSAR
          </text>
          {/* Orange 4-pointed Star on top of R */}
          <g transform="translate(92, 4)">
            <path
              d="M 8 0 Q 8 8 16 8 Q 8 8 8 16 Q 8 8 0 8 Q 8 8 8 0 Z"
              fill="#FF6600"
            />
          </g>
          <text x="2" y="34" fill="#111814" fontSize="10" fontWeight="900" fontFamily="sans-serif" letterSpacing="2">
            STEEL
          </text>
        </g>
      </svg>
    );
  }

  // 6. JSW Neo / JSW Neosteel / JSW Steel
  if (normalized.includes('jsw')) {
    return (
      <svg viewBox="0 0 200 60" className="w-full h-full max-h-12 object-contain" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(14, 10)">
          {/* JSW Iconic Red & Blue Letters */}
          <text x="24" y="20" fill="#003366" fontSize="18" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">
            J
          </text>
          {/* Dynamic italic red S */}
          <path
            d="M 36 6 C 30 6, 28 10, 32 14 C 36 18, 38 22, 32 26 C 26 26, 24 22, 24 22"
            stroke="#D3122A"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          <text x="48" y="20" fill="#003366" fontSize="18" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">
            W
          </text>
          {/* Neosteel */}
          <text x="5" y="33" fill="#003366" fontSize="13" fontWeight="800" fontFamily="sans-serif">
            Neosteel
          </text>
          {/* Pure TMT Bars */}
          <text x="6" y="42" fill="#526458" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">
            Pure TMT Bars
          </text>
        </g>
      </svg>
    );
  }

  // 7. Kamachi TMT
  if (normalized.includes('kamachi')) {
    return (
      <svg viewBox="0 0 200 60" className="w-full h-full max-h-12 object-contain" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(10, 10)">
          {/* Crossed Ribbon Red & Blue Blades */}
          <path d="M 6 30 C 14 20, 20 12, 28 6" stroke="#D3122A" strokeWidth="4" strokeLinecap="round" />
          <path d="M 6 6 C 14 14, 20 22, 28 30" stroke="#003366" strokeWidth="4" strokeLinecap="round" />
        </g>
        <g transform="translate(46, 12)">
          <text x="0" y="16" fill="#003366" fontSize="16" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.8">
            KAMACHI
          </text>
          <text x="92" y="10" fill="#D3122A" fontSize="7" fontWeight="bold">
            TM
          </text>
          <text x="0" y="26" fill="#D3122A" fontSize="8.5" fontWeight="900" fontFamily="sans-serif" letterSpacing="1">
            TMT BARS
          </text>
          <text x="0" y="34" fill="#526458" fontSize="6.5" fontStyle="italic" fontWeight="600" fontFamily="Georgia, serif">
            THE SOUL OF STEEL
          </text>
        </g>
      </svg>
    );
  }

  // 8. SAIL (Steel Authority of India Ltd)
  if (normalized.includes('sail')) {
    return (
      <svg viewBox="0 0 200 60" className="w-full h-full max-h-12 object-contain" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(14, 10)">
          {/* SAIL Triangular Ingot Badge */}
          <polygon points="18,2 34,34 2,34" fill="#004B87" />
          <polygon points="18,12 28,30 8,30" fill="#FFFFFF" />
          <circle cx="18" cy="24" r="3.5" fill="#004B87" />
        </g>
        <g transform="translate(56, 14)">
          <text x="0" y="18" fill="#004B87" fontSize="20" fontWeight="900" fontFamily="sans-serif" letterSpacing="1">
            SAIL
          </text>
          <text x="56" y="16" fill="#004B87" fontSize="12" fontWeight="bold" fontFamily="sans-serif">
            सेल
          </text>
          <text x="0" y="29" fill="#526458" fontSize="7" fontWeight="600" fontFamily="sans-serif">
            STEEL AUTHORITY OF INDIA LTD
          </text>
        </g>
      </svg>
    );
  }

  // 9. APL Apollo
  if (normalized.includes('apollo') || normalized.includes('apl')) {
    return (
      <svg viewBox="0 0 200 60" className="w-full h-full max-h-12 object-contain" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(12, 12)">
          {/* Double Dynamic Loop Emblem */}
          <ellipse cx="18" cy="18" rx="16" ry="10" stroke="#00529B" strokeWidth="3.5" fill="none" />
          <ellipse cx="18" cy="18" rx="10" ry="16" stroke="#ED1C24" strokeWidth="2.5" fill="none" transform="rotate(25 18 18)" />
        </g>
        <g transform="translate(52, 14)">
          <text x="0" y="16" fill="#00529B" fontSize="15" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.8">
            APL APOLLO
          </text>
          <text x="0" y="27" fill="#ED1C24" fontSize="8.5" fontWeight="800" fontFamily="sans-serif" letterSpacing="0.5">
            STEEL PIPES & TUBES
          </text>
          <text x="0" y="36" fill="#526458" fontSize="7" fontWeight="600" fontFamily="sans-serif">
            Structural Steel Conduits
          </text>
        </g>
      </svg>
    );
  }

  // 10. Shyam Steel
  if (normalized.includes('shyam')) {
    return (
      <svg viewBox="0 0 200 60" className="w-full h-full max-h-12 object-contain" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(12, 10)">
          {/* Shield Emblem with Flame */}
          <path d="M 6 4 L 30 4 C 30 18, 22 28, 18 32 C 14 28, 6 18, 6 4 Z" fill="#C8102E" />
          <path d="M 18 10 C 22 14, 22 18, 18 24 C 14 18, 14 14, 18 10 Z" fill="#FFB81C" />
        </g>
        <g transform="translate(52, 14)">
          <text x="0" y="16" fill="#C8102E" fontSize="14" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.8">
            SHYAM STEEL
          </text>
          <text x="0" y="26" fill="#FFB81C" fontSize="8.5" fontWeight="800" fontFamily="sans-serif" letterSpacing="0.5">
            FLEXI-STRONG TMT
          </text>
          <text x="0" y="34" fill="#526458" fontSize="7" fontWeight="600" fontFamily="sans-serif">
            High Strength Rebars
          </text>
        </g>
      </svg>
    );
  }

  // 11. Electrosteel (ESL)
  if (normalized.includes('electrosteel') || normalized.includes('esl')) {
    return (
      <svg viewBox="0 0 200 60" className="w-full h-full max-h-12 object-contain" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(14, 12)">
          {/* Vedanta / ESL Steel Mark */}
          <polygon points="6,6 18,2 30,6 30,22 18,28 6,22" fill="#005571" />
          <circle cx="18" cy="15" r="4.5" fill="#F37021" />
        </g>
        <g transform="translate(54, 14)">
          <text x="0" y="15" fill="#005571" fontSize="13" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.5">
            ELECTROSTEEL
          </text>
          <text x="0" y="26" fill="#F37021" fontSize="8" fontWeight="800" fontFamily="sans-serif" letterSpacing="0.5">
            A VEDANTA COMPANY
          </text>
          <text x="0" y="35" fill="#526458" fontSize="7" fontWeight="600" fontFamily="sans-serif">
            Certified Ductile & TMT
          </text>
        </g>
      </svg>
    );
  }

  // 12. AM/NS India
  if (normalized.includes('am/ns') || normalized.includes('amns') || normalized.includes('arcelor')) {
    return (
      <svg viewBox="0 0 200 60" className="w-full h-full max-h-12 object-contain" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(12, 12)">
          <path d="M 6 22 C 6 12, 14 6, 22 6 C 30 6, 30 16, 22 20 C 14 24, 14 30, 24 30" stroke="#FF6200" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <circle cx="28" cy="18" r="3.5" fill="#002B49" />
        </g>
        <g transform="translate(52, 14)">
          <text x="0" y="16" fill="#002B49" fontSize="16" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.8">
            AM/NS
          </text>
          <text x="64" y="16" fill="#FF6200" fontSize="14" fontWeight="800" fontFamily="sans-serif">
            INDIA
          </text>
          <text x="0" y="27" fill="#526458" fontSize="7" fontWeight="700" fontFamily="sans-serif">
            ArcelorMittal Nippon Steel
          </text>
        </g>
      </svg>
    );
  }

  // 13. Jindal Steel & Power (JSPL)
  if (normalized.includes('jindal')) {
    return (
      <svg viewBox="0 0 200 60" className="w-full h-full max-h-12 object-contain" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(14, 10)">
          <polygon points="18,4 32,32 4,32" fill="#002A54" />
          <line x1="18" y1="4" x2="18" y2="32" stroke="#BF212F" strokeWidth="2.5" />
        </g>
        <g transform="translate(54, 14)">
          <text x="0" y="14" fill="#002A54" fontSize="12" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.8">
            JINDAL
          </text>
          <text x="0" y="25" fill="#BF212F" fontSize="10" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.5">
            STEEL & POWER
          </text>
          <text x="0" y="34" fill="#526458" fontSize="6.5" fontWeight="600" fontFamily="sans-serif">
            Heavy Parallel Beams
          </text>
        </g>
      </svg>
    );
  }

  // Generic Clean Fallback Logo
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center p-2">
      <span className="text-sm font-black text-[#111814] uppercase tracking-wider line-clamp-1 font-sans">
        {name}
      </span>
      <span className="text-[10px] text-[#07552B] font-bold uppercase tracking-widest mt-0.5">
        STEEL MILL
      </span>
    </div>
  );
};

const defaultTopSellingBrands: Brand[] = [
  { id: '1', name: 'Vizag Steel', slug: 'vizag-steel', isActive: true },
  { id: '2', name: 'Tata Steel', slug: 'tata-steel', isActive: true },
  { id: '3', name: 'Jindal Panther', slug: 'jindal-panther', isActive: true },
  { id: '4', name: 'Essar Steel', slug: 'essar-steel', isActive: true },
  { id: '5', name: 'JSW Neo', slug: 'jsw-neo', isActive: true },
  { id: '6', name: 'Kamachi TMT', slug: 'kamachi-tmt', isActive: true },
  { id: '7', name: 'SAIL', slug: 'sail', isActive: true },
  { id: '8', name: 'APL Apollo', slug: 'apl-apollo', isActive: true },
  { id: '9', name: 'Shyam Steel', slug: 'shyam-steel', isActive: true },
  { id: '10', name: 'Electrosteel', slug: 'electrosteel', isActive: true },
  { id: '11', name: 'Tata Tiscon', slug: 'tata-tiscon', isActive: true },
  { id: '12', name: 'AM/NS India', slug: 'amns-india', isActive: true },
];

export const CompanyLogosMarquee: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    api
      .get('/brands')
      .then((res: any) => {
        const rawList =
          res.data && Array.isArray(res.data) && res.data.length > 0
            ? res.data.filter((b: Brand) => b.isActive)
            : defaultTopSellingBrands;

        // Combine with defaults to ensure all 12 key brands exist
        const combined = [...rawList];
        for (const d of defaultTopSellingBrands) {
          if (!combined.some((m) => m.name.toLowerCase() === d.name.toLowerCase())) {
            combined.push(d);
          }
        }

        // Deduplicate so each corporate brand is uniquely showcased
        const uniqueBrands: Brand[] = [];
        const seenKeys = new Set<string>();

        for (const b of combined) {
          const lower = b.name.toLowerCase();
          let key = lower;
          if (lower.includes('apollo')) key = 'apollo';
          else if (lower.includes('vizag') || lower.includes('rinl')) key = 'vizag';
          else if (lower.includes('panther')) key = 'panther';
          else if (lower.includes('jsw')) key = 'jsw';
          else if (lower.includes('tiscon')) key = 'tiscon';
          else if (lower.includes('tata')) key = 'tata';
          else if (lower.includes('essar')) key = 'essar';
          else if (lower.includes('kamachi')) key = 'kamachi';
          else if (lower.includes('sail')) key = 'sail';
          else if (lower.includes('shyam')) key = 'shyam';
          else if (lower.includes('electrosteel')) key = 'electrosteel';
          else if (lower.includes('am/ns') || lower.includes('amns')) key = 'amns';
          else if (lower.includes('jindal')) key = 'jindal';

          if (!seenKeys.has(key)) {
            seenKeys.add(key);
            uniqueBrands.push(b);
          }
        }

        setBrands(uniqueBrands.length > 0 ? uniqueBrands : defaultTopSellingBrands);
      })
      .catch(() => {
        setBrands(defaultTopSellingBrands);
      });
  }, []);

  const displayList = brands.length > 0 ? brands : defaultTopSellingBrands;
  // Duplicate list to achieve continuous, gapless marquee scrolling
  const marqueeItems = [...displayList, ...displayList];

  return (
    <section className="relative w-full bg-[#FFFFFF] border-b border-[#E2EBE5] py-7 sm:py-9 overflow-hidden select-none">
      {/* Header Matching Image 2: "Top Selling Brands" on left, "View All" on right */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-5 flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-[#111814] tracking-tight font-sans">
          Top Selling Brands
        </h2>

        <Link
          to="/products"
          className="text-sm font-bold text-blue-600 hover:text-blue-800 transition flex items-center gap-1 group"
        >
          <span>View All</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Left and Right gradient edge masks for smooth continuous entry/exit */}
      <div className="pointer-events-none absolute left-0 top-16 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-16 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />

      {/* Marquee Track (Continuous Smooth Movement Left) */}
      <div className="flex overflow-hidden group">
        <div className="animate-marquee-infinite flex items-start gap-4 sm:gap-6 py-2 px-4">
          {marqueeItems.map((brand, idx) => (
            <Link
              key={`${brand.id || brand.slug}-${idx}`}
              to={`/products?search=${encodeURIComponent(brand.name)}`}
              className="group/item flex flex-col items-center shrink-0"
              title={`View ${brand.name} Steel Products`}
            >
              {/* Rectangular Card Matching Image 2 */}
              <div className="w-44 sm:w-52 h-26 sm:h-28 bg-white border border-[#E2EBE5] rounded-xl shadow-2xs hover:shadow-md hover:border-slate-300 transition duration-300 flex items-center justify-center p-4 group-hover/item:scale-102">
                {brand.logoUrl && !brand.logoUrl.includes('unsplash') ? (
                  <img
                    src={brand.logoUrl}
                    alt={brand.name}
                    className="w-full h-full max-h-12 object-contain"
                    onError={(e) => {
                      // If remote URL fails, fallback to vector SVG
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <BrandLogoSVG name={brand.name} slug={brand.slug} />
                )}
              </div>

              {/* Company Title Below Card Matching Image 2 */}
              <span className="text-xs sm:text-sm font-semibold text-[#111814] text-center mt-2.5 group-hover/item:text-blue-600 transition">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
