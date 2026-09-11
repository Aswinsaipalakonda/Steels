import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Category } from '../../types';
import { ArrowUpRight, Send, Layers } from 'lucide-react';
import { QuickQuoteModal } from '../enquiry/QuickQuoteModal';

interface SteelCatalogItem {
  id: string;
  name: string;
  image: string;
  badge?: string;
  categorySlug: string;
  description?: string;
}

interface SteelCategoryGroup {
  id: string;
  title: string;
  slug: string;
  viewAllLink: string;
  items: SteelCatalogItem[];
}

const STEEL_CATALOG_GROUPS: SteelCategoryGroup[] = [
  {
    id: 'tmt-bars',
    title: 'Buy TMT Bars of Construction',
    slug: 'tmt-rebars',
    viewAllLink: '/products?category=tmt-rebars',
    items: [
      {
        id: 'tmt-bars-item',
        name: 'TMT Steel Bars',
        image: '/images/steel-items/tmt-steel-bars.jpg',
        badge: 'Fe 500D / 550D',
        categorySlug: 'tmt-rebars',
        description: 'High-yield thermo-mechanically treated reinforcement bars for earthquake resistance.',
      },
      {
        id: 'binding-wire-item',
        name: 'Binding Wire',
        image: '/images/steel-items/binding-wire.jpg',
        badge: 'GI & Black Annealed',
        categorySlug: 'tmt-rebars',
        description: 'Pliable, high-ductility binding wire coils for construction tie work.',
      },
      {
        id: 'stirrups-item',
        name: 'Stirrups',
        image: '/images/steel-items/stirrups.jpg',
        badge: 'Custom Sized',
        categorySlug: 'tmt-rebars',
        description: 'Prefabricated high-tensile column and beam reinforcement rings.',
      },
    ],
  },
  {
    id: 'fabrication-steel',
    title: 'Buy Fabrication steel',
    slug: 'structural-steel',
    viewAllLink: '/products?category=structural-steel',
    items: [
      {
        id: 'ms-rounds-item',
        name: 'MS Rounds',
        image: '/images/steel-items/ms-rounds.jpg',
        badge: 'IS 2062',
        categorySlug: 'structural-steel',
        description: 'Solid cylindrical mild steel bars for shafts, rollers, and general fabrication.',
      },
      {
        id: 'ms-angles-item',
        name: 'MS Angles',
        image: '/images/steel-items/ms-angles.jpg',
        badge: 'Equal & Unequal',
        categorySlug: 'structural-steel',
        description: 'Hot-rolled structural L-angles for transmission towers and shed frames.',
      },
      {
        id: 'ms-squares-item',
        name: 'MS Squares',
        image: '/images/steel-items/ms-squares.jpg',
        badge: 'Solid Section',
        categorySlug: 'structural-steel',
        description: 'Precision solid square bars for gates, architectural grilles, and machinery.',
      },
      {
        id: 'ms-plates-item',
        name: 'MS Plates',
        image: '/images/steel-items/ms-plates.jpg',
        badge: 'Custom Sheared',
        categorySlug: 'structural-steel',
        description: 'High-grade carbon steel plates with uniform flatness and sheared edges.',
      },
    ],
  },
  {
    id: 'special-steel',
    title: 'Buy Special steel',
    slug: 'steel-plates-coils',
    viewAllLink: '/products?category=steel-plates-coils',
    items: [
      {
        id: 'en-flats-item',
        name: 'EN Flats',
        image: '/images/steel-items/en-flats.jpg',
        badge: 'EN Series / Bright',
        categorySlug: 'steel-plates-coils',
        description: 'High-tensile alloy steel flat bars for die sets, tooling, and machine parts.',
      },
      {
        id: 'en-plates-item',
        name: 'EN Plates',
        image: '/images/steel-items/en-plates.jpg',
        badge: 'Hardened & Tempered',
        categorySlug: 'steel-plates-coils',
        description: 'Precision ground wear-resistant alloy plates for heavy tooling and molds.',
      },
      {
        id: 'en-rounds-item',
        name: 'EN Rounds',
        image: '/images/steel-items/en-rounds.jpg',
        badge: 'EN8 / EN19 / EN24',
        categorySlug: 'steel-plates-coils',
        description: 'High-carbon and alloy round bars engineered for gear shafts and stress components.',
      },
      {
        id: 'hr-plates-item',
        name: 'HR Plates',
        image: '/images/steel-items/hr-plates.jpg',
        badge: 'Hot Rolled Boiler',
        categorySlug: 'steel-plates-coils',
        description: 'Heavy duty hot-rolled structural steel plates for pressure vessels and bridges.',
      },
    ],
  },
  {
    id: 'pipes-structural',
    title: 'Buy Pipes & Hollow Sections',
    slug: 'pipes-hollow-sections',
    viewAllLink: '/products?category=pipes-hollow-sections',
    items: [
      {
        id: 'shs-tubes-item',
        name: 'Hollow Sections (SHS/RHS)',
        image: '/images/steel-items/hollow-sections.jpg',
        badge: 'IS 4923 / YST 310',
        categorySlug: 'pipes-hollow-sections',
        description: 'High-torsion square and rectangular hollow structural steel sections.',
      },
      {
        id: 'structural-beams-item',
        name: 'Heavy I-Beams & Joists',
        image: '/images/steel-items/structural-beams.jpg',
        badge: 'ISMB / NPB',
        categorySlug: 'structural-steel',
        description: 'Primary structural joists with uniform flange for heavy PEB construction.',
      },
      {
        id: 'steel-coils-item',
        name: 'HR & CR Steel Coils',
        image: '/images/steel-items/steel-coils.jpg',
        badge: 'Primary Mill',
        categorySlug: 'steel-plates-coils',
        description: 'Continuous hot-rolled and cold-rolled steel coils with mill test certificates.',
      },
    ],
  },
];

interface CategoryGridSectionProps {
  categories?: Category[];
}

export const CategoryGridSection: React.FC<CategoryGridSectionProps> = ({ categories = [] }) => {
  const navigate = useNavigate();
  const [activeQuoteItem, setActiveQuoteItem] = useState<{ id: string; name: string } | null>(null);

  const handleEnquire = (item: SteelCatalogItem, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveQuoteItem({
      id: item.id,
      name: `${item.name} (${item.badge || 'Commercial Grade'})`,
    });
  };

  const handleCardClick = (item: SteelCatalogItem) => {
    navigate(item.categorySlug ? `/products?category=${item.categorySlug}` : '/products');
  };

  return (
    <section id="categories" className="py-16 md:py-24 bg-[#FAFCFA] border-t border-[#E2EBE5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4 pb-6 border-b border-[#E2EBE5]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF3ED] border border-[#D0DDD4] mb-3">
              <Layers className="w-3.5 h-3.5 text-[#07552B]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#07552B]">
                Steel Product Catalogue
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#111814] tracking-tight uppercase">
              Engineered Steel Portfolio
            </h2>
            <p className="text-sm text-[#526458] mt-2 max-w-2xl">
              Mill-certified industrial steel stock ready for immediate dispatch. Click any item to explore specifications or make an instant enquiry.
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#07552B] hover:bg-[#03281A] text-white text-sm font-bold shadow-sm hover:shadow transition-all group self-start md:self-end"
          >
            <span>View Complete Inventory</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Categorized Product Groups */}
        <div className="space-y-14">
          {STEEL_CATALOG_GROUPS.map((group) => (
            <div key={group.id} className="space-y-5">
              {/* Category Group Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#111814] tracking-tight">
                  {group.title}
                </h3>
                <Link
                  to={group.viewAllLink}
                  className="text-sm font-bold text-[#07552B] hover:text-[#03281A] hover:underline flex items-center gap-1 group transition-colors"
                >
                  <span>View All</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>

              {/* Items Grid */}
              <div
                className={`grid gap-5 sm:gap-6 ${
                  group.items.length === 3
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                }`}
              >
                {group.items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleCardClick(item)}
                    className="group cursor-pointer rounded-2xl overflow-hidden bg-white border border-[#E2EBE5] hover:border-[#07552B] hover:shadow-xl transition-all duration-300 flex flex-col shadow-sm"
                  >
                    {/* Item Image Container with 3D Studio Styling */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-b from-[#EFF3F8] to-[#E2E8F0] flex items-center justify-center p-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        className="w-full h-full object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Grade Badge */}
                      {item.badge && (
                        <span className="absolute top-2.5 right-2.5 text-[10px] font-bold bg-white/90 text-[#07552B] border border-[#D0DDD4] px-2.5 py-0.5 rounded-full backdrop-blur-sm shadow-xs">
                          {item.badge}
                        </span>
                      )}

                      {/* Quick Enquiry Floating Button on Hover */}
                      <button
                        type="button"
                        onClick={(e) => handleEnquire(item, e)}
                        className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#07552B] hover:bg-[#03281A] text-white text-xs font-bold shadow-md"
                        title="Make an instant enquiry"
                      >
                        <Send className="w-3 h-3" />
                        <span>Enquire</span>
                      </button>
                    </div>

                    {/* Item Details */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-base sm:text-lg font-bold text-[#111814] group-hover:text-[#07552B] transition-colors">
                          {item.name}
                        </h4>
                        {item.description && (
                          <p className="text-xs text-[#526458] mt-1.5 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#F0F4F1] flex items-center justify-between">
                        <button
                          type="button"
                          onClick={(e) => handleEnquire(item, e)}
                          className="text-xs font-bold text-[#07552B] hover:text-[#03281A] flex items-center gap-1.5 transition-colors"
                        >
                          <Send className="w-3 h-3" />
                          <span>Make Enquiry</span>
                        </button>

                        <div className="w-7 h-7 rounded-full bg-[#EBF3ED] text-[#07552B] flex items-center justify-center group-hover:bg-[#07552B] group-hover:text-white transition-colors">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Quote Enquiry Modal */}
      {activeQuoteItem && (
        <QuickQuoteModal
          isOpen={!!activeQuoteItem}
          onClose={() => setActiveQuoteItem(null)}
          productName={activeQuoteItem.name}
        />
      )}
    </section>
  );
};
