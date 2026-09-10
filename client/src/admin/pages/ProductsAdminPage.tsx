import React, { useState, useEffect, useMemo } from 'react';
import api from '../../lib/api';
import { Product, Category } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../context/ToastContext';
import {
  Plus,
  Search,
  Trash2,
  Star,
  CheckCircle2,
  RotateCcw,
  Edit3,
  Eye,
  X,
  Layers,
  FileText,
  Sparkles,
  Package,
  ChevronRight,
  Save,
  Check,
  Building2,
  TrendingUp,
  AlertCircle,
  Clock,
  ArrowUpRight,
  ExternalLink,
} from 'lucide-react';

type DrawerMode = 'view' | 'edit' | 'create';

export const ProductsAdminPage: React.FC = () => {
  const { success, error } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'newest' | 'name' | 'variants'>('newest');
  const [isLoading, setIsLoading] = useState(true);

  // Sliding Side Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>('view');
  const [activeDrawerTab, setActiveDrawerTab] = useState<'overview' | 'form'>('overview');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State for Create & Edit
  const [formName, setFormName] = useState('');
  const [formCategoryId, setFormCategoryId] = useState('');
  const [formPrimarySpec, setFormPrimarySpec] = useState('');
  const [formShortDesc, setFormShortDesc] = useState('');
  const [formFullDesc, setFormFullDesc] = useState('');
  const [formAvailableUnits, setFormAvailableUnits] = useState('MT,KG,PCS,Bundles');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formAvailabilityStatus, setFormAvailabilityStatus] = useState('AVAILABLE');
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formVariants, setFormVariants] = useState<Array<{ name: string; diameter: string; grade: string }>>([
    { name: '', diameter: '', grade: '' },
  ]);
  const [formSpecs, setFormSpecs] = useState<Array<{ specKey: string; specValue: string }>>([
    { specKey: '', specValue: '' },
  ]);

  // Load Data from API
  const loadData = () => {
    setIsLoading(true);
    const query = new URLSearchParams({ all: 'true' });
    if (selectedCategory) query.set('category', selectedCategory);

    Promise.all([api.get(`/products?${query.toString()}`), api.get('/categories?all=true')])
      .then(([prodRes, catRes]: any) => {
        if (prodRes.data) setProducts(prodRes.data);
        if (catRes.data) {
          setCategories(catRes.data);
        }
      })
      .catch((err) => error(err.message))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory]);

  // Keyboard shortcut: close drawer on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        handleCloseDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen]);

  // Status & KPI Metrics
  const metrics = useMemo(() => {
    const total = products.length;
    const available = products.filter((p) => p.availabilityStatus === 'AVAILABLE').length;
    const featured = products.filter((p) => p.isFeatured).length;
    const categoriesCount = new Set(products.map((p) => p.categoryId)).size;
    const totalVariants = products.reduce((acc, p) => acc + (p.variants?.length || 0), 0);

    return {
      total,
      available,
      featured,
      categoriesCount,
      totalVariants,
    };
  }, [products]);

  // Filtered and Sorted Products List
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.primarySpecification?.toLowerCase().includes(q) ||
          p.category?.name.toLowerCase().includes(q) ||
          p.shortDescription?.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'ALL') {
      list = list.filter((p) => p.availabilityStatus === statusFilter);
    }

    if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    } else if (sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'variants') {
      list.sort((a, b) => (b.variants?.length || 0) - (a.variants?.length || 0));
    }

    return list;
  }, [products, search, statusFilter, sortBy]);

  // Toggle Featured Status
  const handleToggleFeatured = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await api.patch(`/products/${id}/feature`, {});
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isFeatured: !p.isFeatured } : p))
      );
      if (selectedProduct && selectedProduct.id === id) {
        setSelectedProduct((prev) => (prev ? { ...prev, isFeatured: !prev.isFeatured } : null));
      }
      success('Featured status updated.');
    } catch (err: any) {
      error(err.message);
    }
  };

  // Delete Product
  const handleDelete = async (id: string, name: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete '${name}'? This action cannot be undone.`)) return;

    try {
      await api.delete(`/products/${id}`);
      success('Product deleted successfully.');
      if (selectedProduct?.id === id) {
        handleCloseDrawer();
      }
      loadData();
    } catch (err: any) {
      error(err.message);
    }
  };

  // Open Sliding Side Window for View/Edit
  const handleOpenProduct = (product: Product, mode: DrawerMode = 'view') => {
    setSelectedProduct(product);
    setDrawerMode(mode);
    setActiveDrawerTab(mode === 'edit' ? 'form' : 'overview');

    // Populate form fields for edit
    setFormName(product.name || '');
    setFormCategoryId(product.categoryId || (categories[0]?.id || ''));
    setFormPrimarySpec(product.primarySpecification || '');
    setFormShortDesc(product.shortDescription || '');
    setFormFullDesc(product.fullDescription || '');
    setFormAvailableUnits(product.availableUnits || 'MT,KG,PCS,Bundles');
    setFormImageUrl(product.images?.[0]?.imageUrl || '');
    setFormAvailabilityStatus(product.availabilityStatus || 'AVAILABLE');
    setFormIsFeatured(product.isFeatured || false);

    // Variants
    if (product.variants && product.variants.length > 0) {
      setFormVariants(
        product.variants.map((v) => ({
          name: v.name || '',
          diameter: v.diameter || '',
          grade: v.grade || '',
        }))
      );
    } else {
      setFormVariants([{ name: '', diameter: '', grade: '' }]);
    }

    // Specifications
    if (product.specifications && product.specifications.length > 0) {
      setFormSpecs(
        product.specifications.map((s) => ({
          specKey: s.specKey || '',
          specValue: s.specValue || '',
        }))
      );
    } else {
      setFormSpecs([{ specKey: '', specValue: '' }]);
    }

    setIsDrawerOpen(true);
  };

  // Open Sliding Side Window for Create
  const handleOpenCreate = () => {
    setSelectedProduct(null);
    setDrawerMode('create');
    setActiveDrawerTab('form');

    // Clear form
    setFormName('');
    setFormCategoryId(categories[0]?.id || '');
    setFormPrimarySpec('');
    setFormShortDesc('');
    setFormFullDesc('');
    setFormAvailableUnits('MT,KG,PCS,Bundles');
    setFormImageUrl('');
    setFormAvailabilityStatus('AVAILABLE');
    setFormIsFeatured(false);
    setFormVariants([{ name: '', diameter: '', grade: '' }]);
    setFormSpecs([
      { specKey: 'Standard Benchmark', specValue: 'IS 1786 / IS 2062' },
      { specKey: 'Yield Strength', specValue: '500 N/mm²' },
      { specKey: 'Elongation', specValue: '16% minimum' },
    ]);

    setIsDrawerOpen(true);
  };

  // Close Sliding Drawer
  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => {
      setSelectedProduct(null);
      setDrawerMode('view');
    }, 500);
  };

  // Handle Form Submit (Create or Update)
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      error('Product name is required');
      return;
    }
    if (!formCategoryId) {
      error('Please select a category');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: any = {
        name: formName.trim(),
        categoryId: formCategoryId,
        primarySpecification: formPrimarySpec.trim() || undefined,
        shortDescription: formShortDesc.trim() || undefined,
        fullDescription: formFullDesc.trim() || undefined,
        availableUnits: formAvailableUnits,
        availabilityStatus: formAvailabilityStatus,
        isFeatured: formIsFeatured,
        images: formImageUrl.trim()
          ? [{ imageUrl: formImageUrl.trim(), isPrimary: true, altText: formName }]
          : undefined,
        variants: formVariants.filter((v) => v.name.trim().length > 0),
        specifications: formSpecs.filter((s) => s.specKey.trim().length > 0),
      };

      if (drawerMode === 'create') {
        const res: any = await api.post('/products', payload);
        success('Steel product created successfully!');
        if (res.data) {
          setSelectedProduct(res.data);
          setDrawerMode('view');
          setActiveDrawerTab('overview');
        } else {
          handleCloseDrawer();
        }
      } else if (drawerMode === 'edit' && selectedProduct) {
        const res: any = await api.put(`/products/${selectedProduct.id}`, payload);
        success('Steel product updated successfully!');
        if (res.data) {
          setSelectedProduct(res.data);
          setDrawerMode('view');
          setActiveDrawerTab('overview');
        } else {
          handleCloseDrawer();
        }
      }

      loadData();
    } catch (err: any) {
      error(err.message || 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Status Badge Helper
  const renderStatusBadge = (status: string) => {
    if (status === 'AVAILABLE') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border border-emerald-300 bg-emerald-100 text-emerald-900 shadow-2xs whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
          <span>IN STOCK</span>
        </span>
      );
    }
    if (status === 'LIMITED') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border border-amber-300 bg-amber-100 text-amber-900 shadow-2xs whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />
          <span>LIMITED STOCK</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border border-blue-300 bg-blue-100 text-blue-900 shadow-2xs whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
        <span>ON INQUIRY</span>
      </span>
    );
  };

  return (
    <div className="space-y-6 w-full max-w-[1600px] mx-auto font-sans pb-12 relative">
      {/* 1. Page Header with Title & Top Actions */}
      <div className="bg-white border border-[#E2EBE5] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-[#111814]">
              Steel Catalogue & Inventory
            </h1>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <p className="text-xs sm:text-sm text-[#526458] mt-1 font-sans">
            Manage industrial steel products, dimensional grades, technical specifications, and featured storefront visibility.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={handleOpenCreate}
            className="px-5 py-2.5 rounded-full text-xs font-bold bg-[#07552B] hover:bg-[#053d1f] text-white shadow-xs hover:shadow-md transition-all active:scale-95 flex items-center gap-2"
            title="Add steel product"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Add Steel Product</span>
          </button>

          <button
            onClick={loadData}
            disabled={isLoading}
            className="p-2.5 rounded-full bg-[#061B12] hover:bg-[#07552B] text-white transition-all shadow-xs hover:shadow-md active:scale-95 disabled:opacity-70"
            title="Refresh catalogue"
          >
            <RotateCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. Top Interactive KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Products */}
        <div
          onClick={() => {
            setStatusFilter('ALL');
            setSelectedCategory('');
          }}
          className="p-5 rounded-3xl bg-white border border-[#E2EBE5] cursor-pointer transition-all duration-200 shadow-xs hover:shadow-md hover:border-[#07552B]"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#526458]">Total Catalogue</span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-serif font-black text-[#111814]">{metrics.total}</div>
          <div className="mt-2 text-xs text-[#526458] flex items-center gap-1 font-medium">
            <Layers className="w-3.5 h-3.5 text-[#07552B]" />
            <span>{metrics.totalVariants} total variants configured</span>
          </div>
        </div>

        {/* Available In Stock */}
        <div
          onClick={() => setStatusFilter('AVAILABLE')}
          className={`p-5 rounded-3xl bg-white border cursor-pointer transition-all duration-200 shadow-xs hover:shadow-md ${
            statusFilter === 'AVAILABLE' ? 'border-emerald-600 ring-2 ring-emerald-600/25 bg-emerald-50/20' : 'border-[#E2EBE5]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">In Active Stock</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#07552B] flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-serif font-black text-[#07552B]">{metrics.available}</div>
          <div className="mt-2 text-xs text-emerald-800 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Immediate mill dispatch ready</span>
          </div>
        </div>

        {/* Featured Products */}
        <div
          onClick={() => {
            setSearch('');
            setStatusFilter('ALL');
          }}
          className="p-5 rounded-3xl bg-white border border-[#E2EBE5] cursor-pointer transition-all duration-200 shadow-xs hover:shadow-md hover:border-amber-400"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">Featured Storefront</span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-serif font-black text-amber-900">{metrics.featured}</div>
          <div className="mt-2 text-xs text-amber-800 font-medium">
            Displayed on public homepage hero
          </div>
        </div>

        {/* Categories Covered */}
        <div className="p-5 rounded-3xl bg-white border border-[#E2EBE5] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800">Steel Categories</span>
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-serif font-black text-blue-900">{categories.length}</div>
          <div className="mt-2 text-xs text-blue-800 font-medium">
            TMT Rebars, Beams, Pipes & Sheets
          </div>
        </div>
      </div>

      {/* 3. Filter Bar & Search Controls */}
      <div className="bg-white border border-[#E2EBE5] rounded-3xl p-4 shadow-xs flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-lg">
          <Input
            placeholder="Search products by title, grade, or specification..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 text-xs rounded-full bg-[#F4F7F5] border-[#D0DDD4] focus:border-[#07552B]"
          />
          <Search className="w-4 h-4 text-[#526458] absolute left-3.5 top-3" />
        </div>

        {/* Controls: Category Dropdown and Sorting */}
        <div className="flex items-center gap-3 flex-wrap justify-between lg:justify-end">
          {/* Category Dropdown */}
          <div className="flex items-center gap-2 text-xs text-[#526458]">
            <span className="font-semibold hidden sm:inline">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white border border-[#D0DDD4] rounded-full px-3.5 py-1.5 text-xs text-[#111814] font-semibold focus:outline-none focus:border-[#07552B]"
            >
              <option value="">All Categories ({categories.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sorting */}
          <div className="flex items-center gap-2 text-xs text-[#526458]">
            <span className="font-semibold hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-[#D0DDD4] rounded-full px-3.5 py-1.5 text-xs text-[#111814] font-semibold focus:outline-none focus:border-[#07552B]"
            >
              <option value="newest">Newest Added</option>
              <option value="name">Product Name (A-Z)</option>
              <option value="variants">Most Variants</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Quick Status Pills with Thematic Colors */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 scrollbar-none">
        {[
          {
            key: 'ALL',
            label: 'All Products',
            count: products.length,
            activeCls: 'bg-slate-900 text-white shadow-md ring-2 ring-slate-900/30',
            inactiveCls: 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200',
            badgeActive: 'bg-white/20 text-white',
            badgeInactive: 'bg-slate-200 text-slate-900 font-bold',
          },
          {
            key: 'AVAILABLE',
            label: 'In Stock',
            count: metrics.available,
            activeCls: 'bg-[#07552B] text-white shadow-md ring-2 ring-[#07552B]/30',
            inactiveCls: 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100',
            badgeActive: 'bg-white/20 text-white',
            badgeInactive: 'bg-emerald-200 text-emerald-950 font-black',
          },
          {
            key: 'LIMITED',
            label: 'Limited Stock',
            count: products.filter((p) => p.availabilityStatus === 'LIMITED').length,
            activeCls: 'bg-amber-500 text-white shadow-md ring-2 ring-amber-500/30',
            inactiveCls: 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100',
            badgeActive: 'bg-white/20 text-white',
            badgeInactive: 'bg-amber-200 text-amber-950 font-black',
          },
        ].map((tab) => {
          const isActive = statusFilter === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-2 shrink-0 border active:scale-95 ${
                isActive ? tab.activeCls : tab.inactiveCls
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full transition-colors ${
                  isActive ? tab.badgeActive : tab.badgeInactive
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 5. Main Products Table */}
      <div className="rounded-3xl bg-white border border-[#E2EBE5] overflow-hidden shadow-xs">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-xs table-auto">
            <thead className="border-b border-[#E2EBE5] text-[#526458] uppercase font-bold text-[10px] bg-[#F4F7F5] tracking-wider">
              <tr>
                <th className="py-3.5 px-3.5 sm:px-4">Product Name & Specifications</th>
                <th className="py-3.5 px-3.5 sm:px-4">Category</th>
                <th className="py-3.5 px-3.5 sm:px-4">Primary Specification</th>
                <th className="py-3.5 px-3.5 sm:px-4 whitespace-nowrap">Stock Status</th>
                <th className="py-3.5 px-3.5 sm:px-4 text-center whitespace-nowrap">Featured</th>
                <th className="py-3.5 px-3.5 sm:px-4 text-right whitespace-nowrap">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2EBE5]">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => {
                  const img =
                    p.images?.[0]?.imageUrl ||
                    'https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=300&q=80';

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-emerald-50/40 even:bg-slate-50/40 transition-colors group cursor-pointer"
                      onClick={() => handleOpenProduct(p, 'view')}
                    >
                      {/* Product Thumbnail & Details */}
                      <td className="py-3.5 px-3.5 sm:px-4 align-middle">
                        <div className="flex items-center gap-3">
                          <img
                            src={img}
                            alt={p.name}
                            className="w-12 h-12 rounded-xl object-cover bg-zinc-100 shrink-0 border border-[#E2EBE5] shadow-2xs group-hover:scale-105 transition-transform"
                            onError={(e: any) => {
                              e.target.src =
                                'https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=300&q=80';
                            }}
                          />
                          <div className="min-w-0">
                            <span className="font-bold text-[#111814] block text-sm truncate max-w-[220px] group-hover:text-[#07552B] transition-colors">
                              {p.name}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[11px] font-bold text-[#07552B] bg-[#EBF3ED] px-2 py-0.5 rounded-full border border-[#D0DDD4] whitespace-nowrap">
                                {p.variants?.length || 0} variants
                              </span>
                              {p.availableUnits && (
                                <span className="text-[10px] text-[#526458] truncate hidden sm:inline">
                                  {p.availableUnits}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-3.5 sm:px-4 align-middle">
                        <span className="font-semibold text-xs text-[#111814] bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 inline-block whitespace-nowrap">
                          {p.category?.name || 'Heavy Industry'}
                        </span>
                      </td>

                      {/* Primary Specification */}
                      <td className="py-3.5 px-3.5 sm:px-4 align-middle">
                        <span className="font-mono font-bold text-xs text-[#07552B] bg-[#EBF3ED] px-2.5 py-1 rounded-md border border-[#D0DDD4] inline-block whitespace-nowrap">
                          {p.primarySpecification || 'Mill Standard Grade'}
                        </span>
                      </td>

                      {/* Availability Status */}
                      <td className="py-3.5 px-3.5 sm:px-4 align-middle whitespace-nowrap">
                        {renderStatusBadge(p.availabilityStatus)}
                      </td>

                      {/* Featured Star Toggle */}
                      <td className="py-3.5 px-3.5 sm:px-4 text-center align-middle whitespace-nowrap">
                        <button
                          onClick={(e) => handleToggleFeatured(p.id, e)}
                          className={`p-2 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 ${
                            p.isFeatured
                              ? 'text-amber-500 bg-amber-50 border border-amber-300 shadow-2xs'
                              : 'text-zinc-400 hover:text-amber-500 hover:bg-amber-50 border border-transparent'
                          }`}
                          title={p.isFeatured ? 'Featured on storefront (click to remove)' : 'Click to feature on homepage'}
                        >
                          <Star className={`w-4 h-4 ${p.isFeatured ? 'fill-current' : ''}`} />
                        </button>
                      </td>

                      {/* Quick Actions */}
                      <td className="py-3.5 px-3.5 sm:px-4 text-right whitespace-nowrap align-middle">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          {/* Quick Inspect Button */}
                          <button
                            onClick={() => handleOpenProduct(p, 'view')}
                            className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-900 hover:text-white border border-slate-300 flex items-center justify-center transition-all duration-200 shadow-2xs hover:scale-105 active:scale-95 shrink-0"
                            title="Inspect product overview"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Quick Edit Button */}
                          <button
                            onClick={() => handleOpenProduct(p, 'edit')}
                            className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 hover:bg-amber-600 hover:text-white border border-amber-300 flex items-center justify-center transition-all duration-200 shadow-2xs hover:scale-105 active:scale-95 shrink-0"
                            title="Edit product record"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Quick Delete Button */}
                          <button
                            onClick={(e) => handleDelete(p.id, p.name, e)}
                            className="w-8 h-8 rounded-full bg-rose-100 text-rose-800 hover:bg-rose-600 hover:text-white border border-rose-300 flex items-center justify-center transition-all duration-200 shadow-2xs hover:scale-105 active:scale-95 shrink-0"
                            title="Delete product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Manage Pill */}
                          <button
                            onClick={() => handleOpenProduct(p, 'view')}
                            className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#061B12] to-[#07552B] hover:from-[#07552B] hover:to-[#0D7A40] text-white font-bold text-[11px] shadow-xs hover:shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-95 flex items-center gap-1 border border-[#07552B]/40 shrink-0"
                            title="Open sliding side window"
                          >
                            <span>Manage</span>
                            <ChevronRight className="w-3 h-3 text-emerald-300" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#526458]">
                    <div className="w-12 h-12 rounded-full bg-[#F4F7F5] flex items-center justify-center mx-auto mb-3 text-[#526458]">
                      <Package className="w-6 h-6" />
                    </div>
                    <p className="font-bold text-[#111814] text-sm">No steel products found</p>
                    <p className="text-xs text-[#526458] mt-1">Try changing your search terms or category filter.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. SLIDING SIDE WINDOW / DRAWER (Opens slowly right-to-left, closes slowly left-to-right) */}
      {/* Backdrop Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-xs z-50 transition-opacity duration-500 ease-in-out ${
          isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleCloseDrawer}
        aria-hidden="true"
      />

      {/* Sliding Window Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full sm:w-[580px] md:w-[680px] bg-white shadow-2xl border-l border-[#D0DDD4] flex flex-col transform transition-transform duration-500 ease-in-out ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Drawer Top Header */}
          <div className="p-6 border-b border-[#E2EBE5] flex items-center justify-between bg-[#FAFCFA] shrink-0">
            <div className="min-w-0 pr-4">
              <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                <span className="font-mono text-sm font-black text-[#07552B] bg-[#EBF3ED] px-2.5 py-0.5 rounded-lg border border-[#D0DDD4] tracking-tight">
                  {drawerMode === 'create' ? 'NEW PRODUCT' : selectedProduct?.slug || 'STEEL PRODUCT'}
                </span>
                {selectedProduct && renderStatusBadge(selectedProduct.availabilityStatus)}
              </div>
              <h3 className="font-bold text-base text-[#111814] truncate">
                {drawerMode === 'create'
                  ? 'Add New Steel Product'
                  : selectedProduct?.name || 'Product Details'}
              </h3>
            </div>

            {/* Close Button */}
            <button
              onClick={handleCloseDrawer}
              className="p-2 rounded-full text-[#526458] hover:text-rose-600 hover:bg-rose-50 transition shrink-0"
              title="Close window (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Navigation Tabs (when viewing/editing existing product) */}
          {drawerMode !== 'create' && (
            <div className="px-6 pt-3 pb-3 border-b border-[#E2EBE5] bg-white flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
              <button
                onClick={() => {
                  setDrawerMode('view');
                  setActiveDrawerTab('overview');
                }}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap active:scale-95 ${
                  activeDrawerTab === 'overview'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-[#526458] hover:text-[#111814] hover:bg-[#F4F7F5]'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Product Overview</span>
              </button>

              <button
                onClick={() => {
                  setDrawerMode('edit');
                  setActiveDrawerTab('form');
                }}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap active:scale-95 ${
                  activeDrawerTab === 'form'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-[#526458] hover:text-[#111814] hover:bg-[#F4F7F5]'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit & Update</span>
              </button>
            </div>
          )}

          {/* Drawer Body Scroll Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* VIEW MODE: PRODUCT OVERVIEW TAB */}
            {activeDrawerTab === 'overview' && selectedProduct && (
              <div className="space-y-5 text-xs">
                {/* Hero Image & Headline Card */}
                <div className="p-5 rounded-2xl bg-[#FAFCFA] border border-[#E2EBE5] space-y-4">
                  <div className="relative rounded-xl overflow-hidden border border-[#E2EBE5] aspect-video bg-zinc-100">
                    <img
                      src={
                        selectedProduct.images?.[0]?.imageUrl ||
                        'https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=600&q=80'
                      }
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <button
                        onClick={() => handleToggleFeatured(selectedProduct.id)}
                        className={`p-2 rounded-full shadow-md backdrop-blur-md transition ${
                          selectedProduct.isFeatured
                            ? 'bg-amber-500 text-white'
                            : 'bg-white/80 text-zinc-600 hover:text-amber-500'
                        }`}
                        title="Toggle featured"
                      >
                        <Star className={`w-4 h-4 ${selectedProduct.isFeatured ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#07552B] uppercase tracking-wider">
                        {selectedProduct.category?.name || 'Industrial Steel'}
                      </span>
                      <span className="font-mono text-xs font-bold text-[#111814] bg-[#EBF3ED] px-2.5 py-0.5 rounded border border-[#D0DDD4]">
                        {selectedProduct.primarySpecification || 'Standard Grade'}
                      </span>
                    </div>
                    <h3 className="text-lg font-serif font-black text-[#111814] mt-1">
                      {selectedProduct.name}
                    </h3>
                    {selectedProduct.shortDescription && (
                      <p className="text-xs text-[#526458] mt-2 leading-relaxed">
                        {selectedProduct.shortDescription}
                      </p>
                    )}
                  </div>

                  {/* Direct Action Buttons */}
                  <div className="flex items-center gap-2 pt-3 border-t border-[#E2EBE5]">
                    <button
                      onClick={() => {
                        setDrawerMode('edit');
                        setActiveDrawerTab('form');
                      }}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-amber-100 hover:bg-amber-600 text-amber-900 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs active:scale-95 border border-amber-300"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Product</span>
                    </button>

                    <button
                      onClick={() => handleToggleFeatured(selectedProduct.id)}
                      className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs active:scale-95 border ${
                        selectedProduct.isFeatured
                          ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                          : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${selectedProduct.isFeatured ? 'fill-amber-500 text-amber-500' : ''}`} />
                      <span>{selectedProduct.isFeatured ? 'Featured on Home' : 'Set as Featured'}</span>
                    </button>

                    <button
                      onClick={(e) => handleDelete(selectedProduct.id, selectedProduct.name, e)}
                      className="p-2.5 rounded-xl bg-rose-100 hover:bg-rose-600 text-rose-800 hover:text-white transition-all shadow-2xs active:scale-95 border border-rose-300"
                      title="Delete product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Variant Matrix List */}
                <div className="p-5 rounded-2xl bg-[#FAFCFA] border border-[#E2EBE5] space-y-3">
                  <div className="flex items-center justify-between border-b border-[#E2EBE5] pb-2">
                    <span className="text-[#07552B] font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      Configured Variants ({selectedProduct.variants?.length || 0})
                    </span>
                  </div>

                  {selectedProduct.variants && selectedProduct.variants.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {selectedProduct.variants.map((v, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-xl bg-white border border-[#E2EBE5] flex items-center justify-between"
                        >
                          <div>
                            <span className="font-bold text-[#111814] block text-xs">{v.name}</span>
                            <span className="text-[10px] text-[#526458]">
                              {v.diameter ? `Diameter: ${v.diameter}` : ''} {v.grade ? `• Grade: ${v.grade}` : ''}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                            Ready
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-[#526458] py-4 text-center border-2 border-dashed border-[#E2EBE5] rounded-xl">
                      No custom variants configured yet.
                    </p>
                  )}
                </div>

                {/* Technical Specifications */}
                <div className="p-5 rounded-2xl bg-[#FAFCFA] border border-[#E2EBE5] space-y-3">
                  <div className="flex items-center justify-between border-b border-[#E2EBE5] pb-2">
                    <span className="text-[#07552B] font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" />
                      Technical Specifications ({selectedProduct.specifications?.length || 0})
                    </span>
                  </div>

                  {selectedProduct.specifications && selectedProduct.specifications.length > 0 ? (
                    <div className="divide-y divide-[#E2EBE5] rounded-xl bg-white border border-[#E2EBE5] overflow-hidden">
                      {selectedProduct.specifications.map((s, idx) => (
                        <div key={idx} className="p-3 flex items-center justify-between">
                          <span className="font-semibold text-[#526458] text-xs">{s.specKey}</span>
                          <span className="font-bold text-[#111814] text-xs font-mono">{s.specValue}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-[#526458] py-4 text-center border-2 border-dashed border-[#E2EBE5] rounded-xl">
                      Standard Mill Specifications apply.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* FORM MODE: CREATE OR EDIT PRODUCT */}
            {activeDrawerTab === 'form' && (
              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                {/* Basic Details */}
                <div className="p-4 rounded-2xl bg-[#FAFCFA] border border-[#E2EBE5] space-y-3">
                  <span className="font-bold text-xs uppercase tracking-wider text-[#07552B] block">
                    Basic Product Information
                  </span>

                  <div className="space-y-3">
                    <div>
                      <label className="font-bold text-[#111814] block mb-1">Product Title *</label>
                      <input
                        type="text"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="e.g. Fe 500D High Ductility TMT Rebar"
                        className="w-full bg-white border border-[#D0DDD4] rounded-xl px-3.5 py-2 text-xs text-[#111814] font-bold focus:outline-none focus:border-[#07552B]"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-[#111814] block mb-1">Category *</label>
                        <select
                          value={formCategoryId}
                          onChange={(e) => setFormCategoryId(e.target.value)}
                          className="w-full bg-white border border-[#D0DDD4] rounded-xl px-3.5 py-2 text-xs text-[#111814] font-semibold focus:outline-none focus:border-[#07552B]"
                          required
                        >
                          <option value="">Select Category</option>
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="font-bold text-[#111814] block mb-1">Primary Specification</label>
                        <input
                          type="text"
                          value={formPrimarySpec}
                          onChange={(e) => setFormPrimarySpec(e.target.value)}
                          placeholder="e.g. IS 1786:2008 Grade Fe 500D"
                          className="w-full bg-white border border-[#D0DDD4] rounded-xl px-3.5 py-2 text-xs text-[#111814] focus:outline-none focus:border-[#07552B]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-[#111814] block mb-1">Stock Availability Status</label>
                        <select
                          value={formAvailabilityStatus}
                          onChange={(e) => setFormAvailabilityStatus(e.target.value)}
                          className="w-full bg-white border border-[#D0DDD4] rounded-xl px-3.5 py-2 text-xs font-bold text-[#111814] focus:outline-none focus:border-[#07552B]"
                        >
                          <option value="AVAILABLE">In Stock (Available)</option>
                          <option value="LIMITED">Limited Stock</option>
                          <option value="ON_REQUEST">On Custom Inquiry</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-bold text-[#111814] block mb-1">Commercial Units</label>
                        <input
                          type="text"
                          value={formAvailableUnits}
                          onChange={(e) => setFormAvailableUnits(e.target.value)}
                          placeholder="MT,KG,PCS,Bundles"
                          className="w-full bg-white border border-[#D0DDD4] rounded-xl px-3.5 py-2 text-xs text-[#111814] focus:outline-none focus:border-[#07552B]"
                        />
                      </div>
                    </div>

                    {/* Featured Checkbox */}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="featuredToggle"
                        checked={formIsFeatured}
                        onChange={(e) => setFormIsFeatured(e.target.checked)}
                        className="w-4 h-4 rounded text-[#07552B] focus:ring-[#07552B]"
                      />
                      <label htmlFor="featuredToggle" className="font-bold text-[#111814] cursor-pointer flex items-center gap-1.5">
                        <Star className={`w-3.5 h-3.5 ${formIsFeatured ? 'fill-amber-500 text-amber-500' : 'text-zinc-400'}`} />
                        <span>Feature this product on homepage hero & showcase</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Imagery & Descriptions */}
                <div className="p-4 rounded-2xl bg-[#FAFCFA] border border-[#E2EBE5] space-y-3">
                  <span className="font-bold text-xs uppercase tracking-wider text-[#07552B] block">
                    Product Media & Descriptions
                  </span>

                  <div>
                    <label className="font-bold text-[#111814] block mb-1">Image URL (Unsplash or Cloudinary)</label>
                    <input
                      type="url"
                      value={formImageUrl}
                      onChange={(e) => setFormImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full bg-white border border-[#D0DDD4] rounded-xl px-3.5 py-2 text-xs text-[#111814] focus:outline-none focus:border-[#07552B]"
                    />
                    {formImageUrl && (
                      <div className="mt-2 flex items-center gap-3 p-2 bg-white rounded-xl border border-[#D0DDD4]">
                        <img
                          src={formImageUrl}
                          alt="Preview"
                          className="w-16 h-12 rounded-lg object-cover bg-zinc-100"
                          onError={(e: any) => {
                            e.target.style.display = 'none';
                          }}
                        />
                        <span className="text-[11px] text-[#526458]">Live preview rendered</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="font-bold text-[#111814] block mb-1">Short Description</label>
                    <textarea
                      rows={2}
                      value={formShortDesc}
                      onChange={(e) => setFormShortDesc(e.target.value)}
                      placeholder="Brief 1-2 sentence overview for catalogue cards and search results..."
                      className="w-full bg-white border border-[#D0DDD4] rounded-xl p-3 text-xs text-[#111814] focus:outline-none focus:border-[#07552B]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#111814] block mb-1">Full Technical Description</label>
                    <textarea
                      rows={3}
                      value={formFullDesc}
                      onChange={(e) => setFormFullDesc(e.target.value)}
                      placeholder="Detailed engineering specifications, chemical composition, bending tolerance..."
                      className="w-full bg-white border border-[#D0DDD4] rounded-xl p-3 text-xs text-[#111814] focus:outline-none focus:border-[#07552B]"
                    />
                  </div>
                </div>

                {/* Variant Builder */}
                <div className="p-4 rounded-2xl bg-[#FAFCFA] border border-[#E2EBE5] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs uppercase tracking-wider text-[#07552B] block">
                      Dimensional Variants
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setFormVariants([...formVariants, { name: '', diameter: '', grade: '' }])
                      }
                      className="text-xs text-[#07552B] hover:text-[#053d1f] font-bold flex items-center gap-1 bg-emerald-100/70 hover:bg-emerald-200 px-3 py-1 rounded-full transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Variant</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {formVariants.map((v, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          placeholder="Variant Name (e.g. 16mm Rebar)"
                          className="flex-1 bg-white border border-[#D0DDD4] rounded-xl px-3 py-1.5 text-xs text-[#111814] focus:outline-none focus:border-[#07552B]"
                          value={v.name}
                          onChange={(e) => {
                            const newV = [...formVariants];
                            newV[idx].name = e.target.value;
                            setFormVariants(newV);
                          }}
                        />
                        <input
                          placeholder="Diameter (16mm)"
                          className="w-24 bg-white border border-[#D0DDD4] rounded-xl px-2.5 py-1.5 text-xs text-[#111814] focus:outline-none focus:border-[#07552B]"
                          value={v.diameter}
                          onChange={(e) => {
                            const newV = [...formVariants];
                            newV[idx].diameter = e.target.value;
                            setFormVariants(newV);
                          }}
                        />
                        <input
                          placeholder="Grade (Fe 500D)"
                          className="w-28 bg-white border border-[#D0DDD4] rounded-xl px-2.5 py-1.5 text-xs text-[#111814] focus:outline-none focus:border-[#07552B]"
                          value={v.grade}
                          onChange={(e) => {
                            const newV = [...formVariants];
                            newV[idx].grade = e.target.value;
                            setFormVariants(newV);
                          }}
                        />
                        {formVariants.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              setFormVariants(formVariants.filter((_, i) => i !== idx));
                            }}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                            title="Remove variant"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technical Specifications Builder */}
                <div className="p-4 rounded-2xl bg-[#FAFCFA] border border-[#E2EBE5] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs uppercase tracking-wider text-[#07552B] block">
                      Technical Attributes & Standards
                    </span>
                    <button
                      type="button"
                      onClick={() => setFormSpecs([...formSpecs, { specKey: '', specValue: '' }])}
                      className="text-xs text-[#07552B] hover:text-[#053d1f] font-bold flex items-center gap-1 bg-emerald-100/70 hover:bg-emerald-200 px-3 py-1 rounded-full transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Spec</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {formSpecs.map((s, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          placeholder="Attribute (e.g. Tensile Strength)"
                          className="flex-1 bg-white border border-[#D0DDD4] rounded-xl px-3 py-1.5 text-xs text-[#111814] focus:outline-none focus:border-[#07552B]"
                          value={s.specKey}
                          onChange={(e) => {
                            const newS = [...formSpecs];
                            newS[idx].specKey = e.target.value;
                            setFormSpecs(newS);
                          }}
                        />
                        <input
                          placeholder="Value (e.g. 565 N/mm²)"
                          className="flex-1 bg-white border border-[#D0DDD4] rounded-xl px-3 py-1.5 text-xs text-[#111814] font-mono focus:outline-none focus:border-[#07552B]"
                          value={s.specValue}
                          onChange={(e) => {
                            const newS = [...formSpecs];
                            newS[idx].specValue = e.target.value;
                            setFormSpecs(newS);
                          }}
                        />
                        {formSpecs.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              setFormSpecs(formSpecs.filter((_, i) => i !== idx));
                            }}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                            title="Remove attribute"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Form Action Buttons */}
                <div className="pt-2 flex items-center gap-2.5">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 font-black text-xs rounded-full py-3 bg-gradient-to-r from-[#07552B] to-[#0D7A40] hover:from-[#053d1f] hover:to-[#07552B] text-white shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    <Save className="w-4 h-4" />
                    <span>
                      {isSubmitting
                        ? 'Saving Product...'
                        : drawerMode === 'create'
                        ? 'Create Steel Product'
                        : 'Save & Update Product'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCloseDrawer}
                    className="px-5 py-3 rounded-full bg-white border border-[#D0DDD4] text-[#526458] hover:text-[#111814] hover:bg-[#F4F7F5] font-bold text-xs transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
