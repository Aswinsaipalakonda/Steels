import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../../types';
import { ArrowUpRight } from 'lucide-react';

interface CategoryGridSectionProps {
  categories?: Category[];
}

export const CategoryGridSection: React.FC<CategoryGridSectionProps> = ({ categories = [] }) => {
  return (
    <section id="categories" className="py-20 bg-[#FAFCFA] border-t border-[#E2EBE5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#07552B] block mb-2">
              Steel Product Categories
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#111814] tracking-tight uppercase">
              Engineered Steel Portfolio
            </h2>
          </div>
          <Link
            to="/products"
            className="text-sm font-semibold text-[#07552B] hover:text-[#03281A] flex items-center gap-1 group self-start"
          >
            <span>View Complete Inventory</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden bg-white border border-[#E2EBE5] hover:border-[#07552B] hover:shadow-lg transition-all duration-300 flex flex-col h-[380px] shadow-sm"
            >
              {/* Category Image */}
              <div className="relative h-48 w-full overflow-hidden bg-zinc-100">
                <img
                  src={
                    cat.imageUrl ||
                    'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                {cat._count?.products !== undefined && (
                  <span className="absolute top-3 right-3 text-[11px] font-bold bg-white/90 text-[#07552B] border border-[#E2EBE5] px-2.5 py-0.5 rounded-full backdrop-blur-sm shadow-sm">
                    {cat._count.products} {cat._count.products === 1 ? 'Product' : 'Products'}
                  </span>
                )}
              </div>

              {/* Category Details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#111814] group-hover:text-[#07552B] transition-colors uppercase tracking-tight">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-[#526458] mt-2 line-clamp-3 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E2EBE5] flex items-center justify-between text-xs font-semibold text-[#07552B]">
                  <span>Explore Range</span>
                  <div className="w-7 h-7 rounded-full bg-[#EBF3ED] border border-[#D0DDD4] text-[#07552B] flex items-center justify-center group-hover:bg-[#07552B] group-hover:text-white transition-colors">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
