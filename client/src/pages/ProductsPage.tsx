import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../lib/api';
import { Product, Category } from '../types';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { QuickQuoteModal } from '../components/enquiry/QuickQuoteModal';
import { Search, Filter, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quoteTarget, setQuoteTarget] = useState<{ id: string; name: string } | null>(null);

  const activeCategory = searchParams.get('category') || '';
  const activeSearch = searchParams.get('search') || '';
  const activeSort = searchParams.get('sort') || 'order';

  const [searchInput, setSearchInput] = useState(activeSearch);

  // Load categories
  useEffect(() => {
    api
      .get('/categories')
      .then((res: any) => {
        if (res.data) setCategories(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  // Load products when query params change
  useEffect(() => {
    setIsLoading(true);
    const query = new URLSearchParams();
    if (activeCategory) query.set('category', activeCategory);
    if (activeSearch) query.set('search', activeSearch);
    if (activeSort) query.set('sort', activeSort);

    api
      .get(`/products?${query.toString()}`)
      .then((res: any) => {
        if (res.data) setProducts(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [activeCategory, activeSearch, activeSort]);

  const handleCategoryClick = (slug: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (slug) {
      nextParams.set('category', slug);
    } else {
      nextParams.delete('category');
    }
    setSearchParams(nextParams);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextParams = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      nextParams.set('search', searchInput.trim());
    } else {
      nextParams.delete('search');
    }
    setSearchParams(nextParams);
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="py-12 bg-[#FAFCFA] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#07552B] block mb-2">
            Commercial Steel Catalogue
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#111814] tracking-tight uppercase">
            Product Inventory & Specifications
          </h1>
          <p className="text-sm text-[#526458] mt-2 max-w-2xl">
            Explore certified reinforcement rebars, structural sections, plates, and hollow tubes. Select required dimensions and request instant commercial pricing.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white border border-[#E2EBE5] p-4 rounded-2xl mb-8 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center shadow-sm">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Input
                placeholder="Search by steel product name, grade (Fe 500D), or standard..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10"
              />
              <Search className="w-4 h-4 text-[#526458] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <Button type="submit" variant="primary" size="md">
              Search
            </Button>
          </form>

          {/* Sort Selector */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            <span className="text-xs text-[#526458] font-semibold whitespace-nowrap">Sort By:</span>
            <select
              value={activeSort}
              onChange={(e) => {
                const next = new URLSearchParams(searchParams);
                next.set('sort', e.target.value);
                setSearchParams(next);
              }}
              className="bg-white border border-[#D0DDD4] rounded-full px-3 py-2 text-xs text-[#111814] focus:outline-none focus:border-[#07552B]"
            >
              <option value="order">Recommended</option>
              <option value="newest">Newest Additions</option>
              <option value="name_asc">Name (A-Z)</option>
            </select>

            {(activeCategory || activeSearch) && (
              <button
                onClick={handleResetFilters}
                className="p-2 rounded-full bg-white border border-[#D0DDD4] text-[#526458] hover:text-[#111814] hover:bg-[#F4F7F5] text-xs flex items-center gap-1 transition"
                title="Clear filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Pills Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <button
            onClick={() => handleCategoryClick('')}
            className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition whitespace-nowrap border ${
              !activeCategory
                ? 'bg-[#07552B] text-white border-[#07552B] shadow-sm'
                : 'bg-white text-[#526458] border-[#E2EBE5] hover:text-[#111814] hover:border-[#D0DDD4]'
            }`}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.slug)}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition whitespace-nowrap border ${
                activeCategory === cat.slug
                  ? 'bg-[#07552B] text-white border-[#07552B] shadow-sm'
                  : 'bg-white text-[#526458] border-[#E2EBE5] hover:text-[#111814] hover:border-[#D0DDD4]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-white border border-[#E2EBE5] animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white border border-[#E2EBE5] rounded-2xl p-8 shadow-sm">
            <Filter className="w-12 h-12 text-[#526458] mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[#111814] mb-1">No products found</h3>
            <p className="text-xs text-[#526458] max-w-sm mx-auto mb-6">
              No steel products matched your current search and category filters. Try resetting the filters or contact our sales desk directly.
            </p>
            <Button variant="outline" onClick={handleResetFilters}>
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const primaryImg =
                product.images?.find((img) => img.isPrimary)?.imageUrl ||
                product.images?.[0]?.imageUrl ||
                'https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=800&q=80';

              return (
                <div
                  key={product.id}
                  className="bg-white border border-[#E2EBE5] rounded-2xl overflow-hidden hover:border-[#07552B] hover:shadow-lg transition-all duration-300 flex flex-col shadow-sm"
                >
                  <Link to={`/products/${product.slug}`} className="relative h-56 overflow-hidden block group bg-zinc-100">
                    <img
                      src={primaryImg}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      {product.category && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 text-[#07552B] border border-[#E2EBE5] backdrop-blur-sm shadow-sm">
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

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <Link to={`/products/${product.slug}`}>
                        <h3 className="text-lg font-bold text-[#111814] hover:text-[#07552B] transition-colors uppercase tracking-tight line-clamp-1">
                          {product.name}
                        </h3>
                      </Link>

                      {product.primarySpecification && (
                        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-[#07552B] font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>{product.primarySpecification}</span>
                        </div>
                      )}

                      <p className="text-xs text-[#526458] mt-2 line-clamp-2 leading-relaxed">
                        {product.shortDescription}
                      </p>

                      {/* Variant quick pills */}
                      {product.variants && product.variants.length > 0 && (
                        <div className="mt-3.5 pt-3 border-t border-[#E2EBE5]">
                          <span className="text-[10px] uppercase font-bold text-[#526458] block mb-1.5">
                            Available Variants / Sizes:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {product.variants.slice(0, 4).map((v) => (
                              <span
                                key={v.id}
                                className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#F4F7F5] text-[#111814] border border-[#E2EBE5] font-medium"
                              >
                                {v.diameter || v.size || v.thickness || v.name}
                              </span>
                            ))}
                            {product.variants.length > 4 && (
                              <span className="text-[10px] px-1.5 py-0.5 text-[#526458]">
                                +{product.variants.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-[#E2EBE5] flex items-center gap-3">
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
                          <span>Specifications</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <QuickQuoteModal
        isOpen={!!quoteTarget}
        onClose={() => setQuoteTarget(null)}
        productId={quoteTarget?.id}
        productName={quoteTarget?.name}
      />
    </div>
  );
};
