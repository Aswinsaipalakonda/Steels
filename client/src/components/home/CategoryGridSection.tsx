import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../../types';
import { ArrowUpRight } from 'lucide-react';

interface CategoryGridSectionProps {
  categories?: Category[];
}

export const CategoryGridSection: React.FC<CategoryGridSectionProps> = ({ categories = [] }) => {
  return (
    <section id="categories" className="py-20 bg-steel-darkest border-t border-steel-rich/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block mb-2">
              Steel Product Categories
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
              Engineered Steel Portfolio
            </h2>
          </div>
          <Link
            to="/products"
            className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 group self-start"
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
              className="group relative rounded-2xl overflow-hidden bg-steel-forest/60 border border-steel-rich hover:border-steel-accent transition-all duration-300 flex flex-col h-[380px] shadow-lg hover:shadow-emerald-950/30"
            >
              {/* Category Image */}
              <div className="relative h-48 w-full overflow-hidden bg-zinc-900">
                <img
                  src={
                    cat.imageUrl ||
                    'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-steel-darkest via-transparent to-black/30" />
                {cat._count?.products !== undefined && (
                  <span className="absolute top-3 right-3 text-[11px] font-semibold bg-steel-darkest/80 text-emerald-400 border border-steel-accent/40 px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                    {cat._count.products} {cat._count.products === 1 ? 'Product' : 'Products'}
                  </span>
                )}
              </div>

              {/* Category Details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tight">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-2 line-clamp-3 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-steel-rich/60 flex items-center justify-between text-xs font-semibold text-emerald-400">
                  <span>Explore Range</span>
                  <div className="w-7 h-7 rounded-full bg-steel-primary border border-steel-accent flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
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
