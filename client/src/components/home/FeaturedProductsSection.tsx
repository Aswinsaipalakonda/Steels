import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { QuickQuoteModal } from '../enquiry/QuickQuoteModal';

interface FeaturedProductsSectionProps {
  products?: Product[];
}

export const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({ products = [] }) => {
  const [quoteTarget, setQuoteTarget] = useState<{ id: string; name: string } | null>(null);

  return (
    <section className="py-20 bg-steel-forest/40 border-t border-steel-rich/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block mb-2">
              Primary Mill Direct Products
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
              Featured Steel Materials
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-steel-olive max-w-md">
            Direct dispatch from primary manufacturers including Tata Steel, JSW Steel, and SAIL with certified physical & chemical test reports.
          </p>
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const primaryImage =
              product.images?.find((img) => img.isPrimary)?.imageUrl ||
              product.images?.[0]?.imageUrl ||
              'https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=800&q=80';

            return (
              <div
                key={product.id}
                className="bg-steel-darkest border border-steel-rich rounded-2xl overflow-hidden hover:border-steel-accent transition-all duration-300 flex flex-col shadow-xl"
              >
                {/* Product Thumbnail */}
                <Link to={`/products/${product.slug}`} className="relative h-52 overflow-hidden block group">
                  <img
                    src={primaryImage}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-steel-darkest via-transparent to-black/20" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    {product.category && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-steel-darkest/90 text-emerald-400 border border-steel-accent/40 backdrop-blur-sm">
                        {product.category.name}
                      </span>
                    )}
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge variant={product.availabilityStatus === 'AVAILABLE' ? 'available' : 'limited'}>
                      {product.availabilityStatus}
                    </Badge>
                  </div>
                </Link>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <Link to={`/products/${product.slug}`}>
                      <h3 className="text-lg font-bold text-white hover:text-emerald-400 transition-colors uppercase tracking-tight line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>

                    {product.primarySpecification && (
                      <div className="mt-1.5 flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>{product.primarySpecification}</span>
                      </div>
                    )}

                    <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                      {product.shortDescription}
                    </p>

                    {/* Variant quick pills */}
                    {product.variants && product.variants.length > 0 && (
                      <div className="mt-3.5 pt-3 border-t border-steel-rich/60">
                        <span className="text-[10px] uppercase font-bold text-steel-olive block mb-1.5">
                          Available Dimensions / Grades:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {product.variants.slice(0, 4).map((v) => (
                            <span
                              key={v.id}
                              className="text-[11px] px-2 py-0.5 rounded bg-steel-forest text-zinc-300 border border-steel-rich"
                            >
                              {v.diameter || v.size || v.thickness || v.name}
                            </span>
                          ))}
                          {product.variants.length > 4 && (
                            <span className="text-[10px] px-1.5 py-0.5 text-steel-olive">
                              +{product.variants.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-steel-rich/60 flex items-center gap-3">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setQuoteTarget({ id: product.id, name: product.name })}
                      className="flex-1 text-xs"
                    >
                      Request Quote
                    </Button>
                    <Link to={`/products/${product.slug}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full text-xs gap-1">
                        <span>Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <QuickQuoteModal
        isOpen={!!quoteTarget}
        onClose={() => setQuoteTarget(null)}
        productId={quoteTarget?.id}
        productName={quoteTarget?.name}
      />
    </section>
  );
};
