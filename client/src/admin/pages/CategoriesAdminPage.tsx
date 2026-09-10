import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { Category } from '../../types';
import { useToast } from '../../context/ToastContext';
import {
  Plus,
  Trash2,
  Edit3,
  RotateCcw,
  Search,
  Eye,
  X,
  Check,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Layers,
  Box,
  Globe,
  ShieldCheck,
  AlertTriangle,
  LayoutGrid,
  ListFilter,
  Image as ImageIcon,
  CheckCircle2,
  Package,
  TrendingUp,
} from 'lucide-react';

const STEEL_IMAGE_PRESETS = [
  {
    label: 'TMT Rebars',
    url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
    description: 'High-yield thermo-mechanically treated construction rebars',
  },
  {
    label: 'Structural Beams',
    url: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=800&q=80',
    description: 'Universal columns, I-beams, H-beams, and structural angles',
  },
  {
    label: 'Pipes & Tubes',
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
    description: 'Seamless & ERW industrial hollow sections and conduits',
  },
  {
    label: 'Plates & Sheets',
    url: 'https://images.unsplash.com/photo-1535813547-99c456a41d4a?auto=format&fit=crop&w=800&q=80',
    description: 'Hot-rolled, cold-rolled, boiler quality and chequered plates',
  },
  {
    label: 'Wire Rods & Coils',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    description: 'High carbon drawing wire rods and annealed binding wire',
  },
];

export const CategoriesAdminPage: React.FC = () => {
  const { success, error } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search, Filtering & View State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE' | 'WITH_PRODUCTS' | 'EMPTY'>('ALL');
  const [viewMode, setViewMode] = useState<'GRID' | 'TABLE'>('GRID');

  // Drawer (Small Window) States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'CREATE' | 'INSPECT'>('CREATE');
  const [activeDrawerTab, setActiveDrawerTab] = useState<'OVERVIEW' | 'EDIT'>('OVERVIEW');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // Form State
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    displayOrder: 1,
    isActive: true,
  });

  // Delete Safety Dialog State
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Auto-generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const loadCategories = () => {
    setIsLoading(true);
    api
      .get('/categories?all=true')
      .then((res: any) => {
        if (res.data) {
          setCategories(res.data);
        }
      })
      .catch((err) => error(err.message || 'Failed to load steel categories.'))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Keyboard escape listener for drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (deleteTarget) {
          setDeleteTarget(null);
        } else if (isDrawerOpen) {
          setIsDrawerOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, deleteTarget]);

  // Derived KPI Metrics
  const stats = useMemo(() => {
    const totalCategories = categories.length;
    const totalProducts = categories.reduce((sum, c) => sum + (c._count?.products || 0), 0);
    const activeInStorefront = categories.filter((c) => c.isActive !== false).length;
    const leadCategory = [...categories].sort((a, b) => (b._count?.products || 0) - (a._count?.products || 0))[0];

    return {
      totalCategories,
      totalProducts,
      activeInStorefront,
      leadCategoryName: leadCategory ? leadCategory.name : 'None',
      leadCategoryCount: leadCategory ? leadCategory._count?.products || 0 : 0,
    };
  }, [categories]);

  // Filtered & Searched Categories
  const filteredCategories = useMemo(() => {
    return categories
      .filter((cat) => {
        const query = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !query ||
          cat.name.toLowerCase().includes(query) ||
          cat.slug.toLowerCase().includes(query) ||
          (cat.description && cat.description.toLowerCase().includes(query));

        if (!matchesQuery) return false;

        if (statusFilter === 'ACTIVE') return cat.isActive !== false;
        if (statusFilter === 'INACTIVE') return cat.isActive === false;
        if (statusFilter === 'WITH_PRODUCTS') return (cat._count?.products || 0) > 0;
        if (statusFilter === 'EMPTY') return (cat._count?.products || 0) === 0;

        return true;
      })
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }, [categories, searchQuery, statusFilter]);

  // Drawer Handlers
  const handleOpenCreate = () => {
    setSelectedCategory(null);
    setDrawerMode('CREATE');
    setActiveDrawerTab('EDIT');
    setForm({
      name: '',
      slug: '',
      description: '',
      imageUrl: STEEL_IMAGE_PRESETS[0].url,
      displayOrder: categories.length + 1,
      isActive: true,
    });
    setIsDrawerOpen(true);
  };

  const handleOpenInspect = (cat: Category, defaultTab: 'OVERVIEW' | 'EDIT' = 'OVERVIEW') => {
    setSelectedCategory(cat);
    setDrawerMode('INSPECT');
    setActiveDrawerTab(defaultTab);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      imageUrl: cat.imageUrl || '',
      displayOrder: cat.displayOrder,
      isActive: cat.isActive !== false,
    });
    setIsDrawerOpen(true);
  };

  const handleNameChange = (newName: string) => {
    setForm((prev) => ({
      ...prev,
      name: newName,
      slug: drawerMode === 'CREATE' ? generateSlug(newName) : prev.slug,
    }));
  };

  // Instant Toggle Active in Storefront
  const handleToggleActive = async (cat: Category, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newStatus = !cat.isActive;

    // Optimistic update
    setCategories((prev) =>
      prev.map((item) => (item.id === cat.id ? { ...item, isActive: newStatus } : item))
    );

    if (selectedCategory && selectedCategory.id === cat.id) {
      setSelectedCategory((prev) => (prev ? { ...prev, isActive: newStatus } : null));
    }

    try {
      await api.put(`/categories/${cat.id}`, { isActive: newStatus });
      success(
        `Category '${cat.name}' is now ${newStatus ? 'visible' : 'hidden'} in the storefront.`
      );
    } catch (err: any) {
      error(err.message || 'Failed to update visibility status.');
      loadCategories();
    }
  };

  // Move Category Up / Down Order
  const handleMoveOrder = async (index: number, direction: 'UP' | 'DOWN', e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (direction === 'UP' && index === 0) return;
    if (direction === 'DOWN' && index === filteredCategories.length - 1) return;

    const targetIndex = direction === 'UP' ? index - 1 : index + 1;
    const currentItem = filteredCategories[index];
    const targetItem = filteredCategories[targetIndex];

    const updatedCategories = [...categories];
    const currIdx = updatedCategories.findIndex((c) => c.id === currentItem.id);
    const targIdx = updatedCategories.findIndex((c) => c.id === targetItem.id);

    const tempOrder = updatedCategories[currIdx].displayOrder;
    updatedCategories[currIdx].displayOrder = updatedCategories[targIdx].displayOrder;
    updatedCategories[targIdx].displayOrder = tempOrder;

    // Sort to reflect new state
    updatedCategories.sort((a, b) => a.displayOrder - b.displayOrder);
    setCategories(updatedCategories);

    try {
      await api.put('/categories/reorder', {
        items: [
          { id: currentItem.id, displayOrder: updatedCategories[currIdx].displayOrder },
          { id: targetItem.id, displayOrder: updatedCategories[targIdx].displayOrder },
        ],
      });
      success('Category order updated.');
    } catch (err: any) {
      error(err.message || 'Failed to reorder categories.');
      loadCategories();
    }
  };

  // Form Submit (Create or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      error('Category name is required.');
      return;
    }

    setIsSubmitting(true);
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim() || generateSlug(form.name),
      description: form.description.trim() || undefined,
      imageUrl: form.imageUrl.trim() || undefined,
      displayOrder: Number(form.displayOrder) || 0,
      isActive: form.isActive,
    };

    try {
      if (drawerMode === 'CREATE') {
        const res: any = await api.post('/categories', payload);
        success(`Category '${payload.name}' created successfully.`);
        if (res.data) {
          setCategories((prev) => [...prev, res.data]);
        }
      } else if (selectedCategory) {
        const res: any = await api.put(`/categories/${selectedCategory.id}`, payload);
        success(`Category '${payload.name}' updated successfully.`);
        if (res.data) {
          setCategories((prev) =>
            prev.map((c) => (c.id === selectedCategory.id ? { ...c, ...res.data } : c))
          );
          setSelectedCategory((prev) => (prev ? { ...prev, ...res.data } : null));
        }
      }
      setIsDrawerOpen(false);
      loadCategories();
    } catch (err: any) {
      error(err.message || 'Failed to save category.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Category
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    if ((deleteTarget._count?.products || 0) > 0) {
      error(
        `Cannot delete '${deleteTarget.name}' because it contains ${deleteTarget._count?.products} products. Reassign or delete products first.`
      );
      setDeleteTarget(null);
      return;
    }

    setIsDeleting(true);
    try {
      await api.delete(`/categories/${deleteTarget.id}`);
      success(`Category '${deleteTarget.name}' deleted successfully.`);
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      if (selectedCategory && selectedCategory.id === deleteTarget.id) {
        setIsDrawerOpen(false);
      }
      setDeleteTarget(null);
    } catch (err: any) {
      error(err.message || 'Failed to delete category.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#D0DDD4] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EBF3ED] text-[#07552B] border border-[#D0DDD4]">
              <Layers className="w-3.5 h-3.5 text-[#07552B]" />
              Catalogue Hierarchy
            </span>
            <span className="text-xs text-[#526458]">● Active B2B Product Lines</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#061B12] mt-1 tracking-tight">
            Steel Product Categories
          </h1>
          <p className="text-xs sm:text-sm text-[#526458] mt-1 max-w-2xl">
            Configure primary steel portfolios, public storefront navigation, promotional imagery,
            and display hierarchies.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={loadCategories}
            title="Refresh Categories"
            className="p-2.5 rounded-xl border border-[#D0DDD4] text-[#526458] hover:text-[#061B12] hover:bg-[#F4F7F5] transition shadow-xs"
          >
            <RotateCcw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#07552B]' : ''}`} />
          </button>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#061B12] to-[#07552B] text-white rounded-xl text-sm font-semibold hover:from-[#07552B] hover:to-[#0D7A40] transition shadow-sm hover:shadow-md active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Add Steel Category</span>
          </button>
        </div>
      </div>

      {/* 4 Top KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Categories */}
        <div className="bg-white p-5 rounded-2xl border border-[#D0DDD4] shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#526458]">
              Total Categories
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#EBF3ED] flex items-center justify-center text-[#07552B]">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#061B12] font-mono tracking-tight">
              {stats.totalCategories}
            </span>
            <span className="text-xs text-[#07552B] font-medium bg-[#EBF3ED] px-2 py-0.5 rounded-full">
              Industrial Lines
            </span>
          </div>
          <p className="text-[11px] text-[#526458] mt-2">
            Standard structural & civil categories
          </p>
        </div>

        {/* Card 2: Catalogued Products */}
        <div className="bg-white p-5 rounded-2xl border border-[#D0DDD4] shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#526458]">
              Catalogued Products
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
              <Box className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#061B12] font-mono tracking-tight">
              {stats.totalProducts}
            </span>
            <span className="text-xs text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">
              Active SKUs
            </span>
          </div>
          <p className="text-[11px] text-[#526458] mt-2">
            Distributed across all categories
          </p>
        </div>

        {/* Card 3: Storefront Active */}
        <div className="bg-white p-5 rounded-2xl border border-[#D0DDD4] shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#526458]">
              Active in Storefront
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#061B12] font-mono tracking-tight">
              {stats.activeInStorefront}
            </span>
            <span className="text-xs text-blue-700 font-medium bg-blue-50 px-2 py-0.5 rounded-full">
              Public Visible
            </span>
          </div>
          <p className="text-[11px] text-[#526458] mt-2">
            Rendered in header menu & catalogues
          </p>
        </div>

        {/* Card 4: Lead Category */}
        <div className="bg-white p-5 rounded-2xl border border-[#D0DDD4] shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#526458]">
              Lead Portfolio
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-lg font-bold text-[#061B12] truncate max-w-[170px]" title={stats.leadCategoryName}>
              {stats.leadCategoryName}
            </span>
          </div>
          <p className="text-[11px] text-amber-800 mt-2 font-medium">
            {stats.leadCategoryCount} products actively listed
          </p>
        </div>
      </div>

      {/* Filter & View Mode Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#D0DDD4] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-[#526458] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search categories by name, slug, or technical scope..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-[#F4F7F5] border border-[#D0DDD4] rounded-xl text-[#061B12] placeholder-[#526458] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#07552B]/20 focus:border-[#07552B] transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#526458] hover:text-[#061B12]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
              statusFilter === 'ALL'
                ? 'bg-[#061B12] text-white shadow-xs'
                : 'bg-[#F4F7F5] text-[#526458] hover:bg-[#EBF3ED] hover:text-[#061B12]'
            }`}
          >
            All ({categories.length})
          </button>
          <button
            onClick={() => setStatusFilter('ACTIVE')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
              statusFilter === 'ACTIVE'
                ? 'bg-[#07552B] text-white shadow-xs'
                : 'bg-[#F4F7F5] text-[#526458] hover:bg-[#EBF3ED] hover:text-[#07552B]'
            }`}
          >
            Active ({categories.filter((c) => c.isActive !== false).length})
          </button>
          <button
            onClick={() => setStatusFilter('INACTIVE')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
              statusFilter === 'INACTIVE'
                ? 'bg-amber-700 text-white shadow-xs'
                : 'bg-[#F4F7F5] text-[#526458] hover:bg-amber-50 hover:text-amber-800'
            }`}
          >
            Hidden ({categories.filter((c) => c.isActive === false).length})
          </button>
          <button
            onClick={() => setStatusFilter('WITH_PRODUCTS')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
              statusFilter === 'WITH_PRODUCTS'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-[#F4F7F5] text-[#526458] hover:bg-emerald-50 hover:text-emerald-900'
            }`}
          >
            Stocked ({categories.filter((c) => (c._count?.products || 0) > 0).length})
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-[#F4F7F5] p-1 rounded-xl border border-[#D0DDD4] shrink-0 self-end md:self-auto">
          <button
            onClick={() => setViewMode('GRID')}
            className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
              viewMode === 'GRID'
                ? 'bg-white text-[#061B12] shadow-xs font-semibold'
                : 'text-[#526458] hover:text-[#061B12]'
            }`}
            title="Visual Card Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">Grid</span>
          </button>
          <button
            onClick={() => setViewMode('TABLE')}
            className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
              viewMode === 'TABLE'
                ? 'bg-white text-[#061B12] shadow-xs font-semibold'
                : 'text-[#526458] hover:text-[#061B12]'
            }`}
            title="Structured Table View"
          >
            <ListFilter className="w-4 h-4" />
            <span className="hidden sm:inline">Table</span>
          </button>
        </div>
      </div>

      {/* Main Categories Presentation */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-[#D0DDD4] p-16 text-center shadow-xs">
          <div className="w-10 h-10 border-3 border-[#07552B] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-[#061B12]">Loading steel categories...</p>
          <p className="text-xs text-[#526458] mt-1">Synchronizing industrial product lines</p>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#D0DDD4] p-16 text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-[#EBF3ED] text-[#07552B] flex items-center justify-center mx-auto mb-4">
            <Layers className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-[#061B12]">No categories match your criteria</h3>
          <p className="text-xs text-[#526458] mt-1.5 max-w-md mx-auto">
            {searchQuery
              ? `No steel categories matching "${searchQuery}". Try clearing filters.`
              : 'Start by creating your first steel product line.'}
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('ALL');
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-[#D0DDD4] text-[#526458] hover:text-[#061B12] hover:bg-[#F4F7F5]"
              >
                Clear Search
              </button>
            )}
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#07552B] text-white hover:bg-[#061B12] shadow-xs"
            >
              Add New Category
            </button>
          </div>
        </div>
      ) : viewMode === 'GRID' ? (
        /* Visual Card Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCategories.map((cat, index) => (
            <div
              key={cat.id}
              onClick={() => handleOpenInspect(cat, 'OVERVIEW')}
              className="group bg-white rounded-2xl border border-[#D0DDD4] overflow-hidden shadow-xs hover:shadow-md hover:border-[#07552B]/40 transition duration-300 cursor-pointer flex flex-col justify-between"
            >
              {/* Card Banner Image */}
              <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                <img
                  src={
                    cat.imageUrl ||
                    'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80'
                  }
                  alt={cat.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80';
                  }}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#061B12]/80 via-black/20 to-transparent" />

                {/* Badges Overlay */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                  {/* Active / Hidden Pill */}
                  <button
                    onClick={(e) => handleToggleActive(cat, e)}
                    title={cat.isActive !== false ? 'Click to hide from store' : 'Click to activate in store'}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md transition flex items-center gap-1 shadow-sm ${
                      cat.isActive !== false
                        ? 'bg-[#07552B]/90 text-white border border-emerald-400/30'
                        : 'bg-zinc-800/90 text-zinc-300 border border-zinc-600/30'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        cat.isActive !== false ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-400'
                      }`}
                    />
                    {cat.isActive !== false ? 'Storefront Live' : 'Hidden Draft'}
                  </button>

                  {/* Order Rank Badge */}
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-white/90 text-[#061B12] backdrop-blur-md shadow-sm border border-white/40">
                    Order #{cat.displayOrder}
                  </span>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-white text-[11px] font-semibold">
                    <Package className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{cat._count?.products || 0} Products</span>
                  </div>

                  {/* Public Storefront Link Button */}
                  <a
                    href={`/products?category=${cat.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 bg-white/20 hover:bg-white text-white hover:text-[#061B12] backdrop-blur-md rounded-lg transition border border-white/20"
                    title="View public category page"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif font-bold text-lg text-[#061B12] group-hover:text-[#07552B] transition">
                      {cat.name}
                    </h3>
                  </div>
                  <span className="inline-block mt-0.5 text-[11px] font-mono text-[#526458] bg-[#F4F7F5] px-2 py-0.5 rounded border border-[#E2EBE5]">
                    /{cat.slug}
                  </span>

                  <p className="text-xs text-[#526458] mt-2.5 line-clamp-2 leading-relaxed">
                    {cat.description || 'Standard industrial steel specifications and dimensional varieties.'}
                  </p>
                </div>

                {/* Card Action Footer */}
                <div className="mt-5 pt-4 border-t border-[#E2EBE5] flex items-center justify-between gap-2">
                  {/* Reordering mini controls */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleMoveOrder(index, 'UP', e)}
                      disabled={index === 0}
                      title="Move Up"
                      className={`p-1 rounded-lg border border-[#D0DDD4] transition ${
                        index === 0
                          ? 'opacity-30 cursor-not-allowed bg-[#F4F7F5]'
                          : 'hover:bg-[#EBF3ED] hover:text-[#07552B] text-[#526458]'
                      }`}
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleMoveOrder(index, 'DOWN', e)}
                      disabled={index === filteredCategories.length - 1}
                      title="Move Down"
                      className={`p-1 rounded-lg border border-[#D0DDD4] transition ${
                        index === filteredCategories.length - 1
                          ? 'opacity-30 cursor-not-allowed bg-[#F4F7F5]'
                          : 'hover:bg-[#EBF3ED] hover:text-[#07552B] text-[#526458]'
                      }`}
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenInspect(cat, 'OVERVIEW');
                      }}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[#F4F7F5] text-[#526458] hover:bg-[#EBF3ED] hover:text-[#07552B] border border-[#D0DDD4] transition flex items-center gap-1"
                      title="Inspect Overview"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenInspect(cat, 'EDIT');
                      }}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[#EBF3ED] text-[#07552B] hover:bg-[#07552B] hover:text-white border border-[#D0DDD4] transition flex items-center gap-1"
                      title="Edit Category"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget(cat);
                      }}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition"
                      title="Delete Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Structured Table View */
        <div className="rounded-2xl bg-white border border-[#D0DDD4] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[760px]">
              <thead className="border-b border-[#D0DDD4] text-[#526458] uppercase font-bold text-[10px] bg-[#F4F7F5]">
                <tr>
                  <th className="p-4 pl-6">Order</th>
                  <th className="p-4">Category & Banner</th>
                  <th className="p-4">Slug Key</th>
                  <th className="p-4">Products</th>
                  <th className="p-4">Storefront Status</th>
                  <th className="p-4 text-right pr-6">Management Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2EBE5]">
                {filteredCategories.map((cat, index) => (
                  <tr
                    key={cat.id}
                    onClick={() => handleOpenInspect(cat, 'OVERVIEW')}
                    className="hover:bg-[#F4F7F5]/80 transition cursor-pointer group"
                  >
                    {/* Order Controls */}
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-[#061B12] w-5 text-center">
                          {cat.displayOrder}
                        </span>
                        <div className="flex flex-col gap-0.5">
                          <button
                            onClick={(e) => handleMoveOrder(index, 'UP', e)}
                            disabled={index === 0}
                            className={`p-0.5 rounded text-[#526458] hover:bg-[#EBF3ED] hover:text-[#07552B] ${
                              index === 0 ? 'opacity-20 cursor-not-allowed' : ''
                            }`}
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => handleMoveOrder(index, 'DOWN', e)}
                            disabled={index === filteredCategories.length - 1}
                            className={`p-0.5 rounded text-[#526458] hover:bg-[#EBF3ED] hover:text-[#07552B] ${
                              index === filteredCategories.length - 1 ? 'opacity-20 cursor-not-allowed' : ''
                            }`}
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Category Title & Thumbnail */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            cat.imageUrl ||
                            'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=200&q=80'
                          }
                          alt={cat.name}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=200&q=80';
                          }}
                          className="w-12 h-12 rounded-xl object-cover bg-zinc-100 shrink-0 border border-[#D0DDD4] shadow-2xs"
                        />
                        <div>
                          <span className="font-bold text-[#061B12] block text-sm group-hover:text-[#07552B] transition">
                            {cat.name}
                          </span>
                          <span className="text-[11px] text-[#526458] line-clamp-1 max-w-sm">
                            {cat.description || 'Standard industrial steel specifications.'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Slug */}
                    <td className="p-4 font-mono text-[#526458]">
                      <span className="bg-[#F4F7F5] px-2 py-0.5 rounded border border-[#E2EBE5]">
                        {cat.slug}
                      </span>
                    </td>

                    {/* Product Count */}
                    <td className="p-4">
                      <Link
                        to={`/admin/products?category=${cat.slug}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#EBF3ED] text-[#07552B] hover:bg-[#07552B] hover:text-white transition"
                        title="View products in this category"
                      >
                        <Package className="w-3.5 h-3.5" />
                        <span>{cat._count?.products || 0} items</span>
                      </Link>
                    </td>

                    {/* Storefront Status Toggle */}
                    <td className="p-4">
                      <button
                        onClick={(e) => handleToggleActive(cat, e)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition shadow-2xs ${
                          cat.isActive !== false
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                            : 'bg-zinc-100 text-zinc-600 border border-zinc-300 hover:bg-zinc-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            cat.isActive !== false ? 'bg-emerald-600' : 'bg-zinc-400'
                          }`}
                        />
                        <span>{cat.isActive !== false ? 'Visible' : 'Hidden'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right pr-6">
                      <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <a
                          href={`/products?category=${cat.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg text-[#526458] hover:text-[#061B12] hover:bg-[#EBF3ED] transition"
                          title="Open live category page"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>

                        <button
                          onClick={() => handleOpenInspect(cat, 'OVERVIEW')}
                          className="p-1.5 rounded-lg text-[#526458] hover:text-[#07552B] hover:bg-[#EBF3ED] transition"
                          title="Inspect Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleOpenInspect(cat, 'EDIT')}
                          className="p-1.5 rounded-lg text-[#07552B] hover:bg-[#EBF3ED] transition"
                          title="Edit Category"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setDeleteTarget(cat)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition"
                          title="Delete Category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SLIDING SMALL WINDOW (SIDE DRAWER) FEATURE                                */}
      {/* Slides right-to-left when opened, slides left-to-right when closed         */}
      {/* ========================================================================= */}
      {/* Backdrop */}
      <div
        onClick={() => setIsDrawerOpen(false)}
        className={`fixed inset-0 bg-black/40 backdrop-blur-xs z-40 transition-opacity duration-500 ease-in-out ${
          isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Sliding Drawer Container */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full sm:w-[580px] md:w-[680px] bg-white shadow-2xl border-l border-[#D0DDD4] flex flex-col transform transition-transform duration-500 ease-in-out ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-6 bg-[#FAFCFA] border-b border-[#D0DDD4] flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#EBF3ED] text-[#07552B] border border-[#D0DDD4]">
                <Layers className="w-3 h-3 text-[#07552B]" />
                {drawerMode === 'CREATE' ? 'New Specification Line' : 'Category Manager'}
              </span>
              {drawerMode === 'INSPECT' && selectedCategory && (
                <span className="font-mono text-xs text-[#526458]">
                  #{selectedCategory.displayOrder}
                </span>
              )}
            </div>
            <h2 className="text-xl font-serif font-bold text-[#061B12] mt-1 truncate max-w-[420px]">
              {drawerMode === 'CREATE'
                ? 'Add Steel Category'
                : selectedCategory?.name || 'Category Details'}
            </h2>
          </div>

          <button
            onClick={() => setIsDrawerOpen(false)}
            className="p-2 rounded-xl text-[#526458] hover:text-[#061B12] hover:bg-[#EBF3ED] transition"
            title="Close Drawer (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Tabs (When in Inspect Mode) */}
        {drawerMode === 'INSPECT' && (
          <div className="px-6 bg-[#FAFCFA] border-b border-[#D0DDD4] flex items-center gap-4 shrink-0">
            <button
              onClick={() => setActiveDrawerTab('OVERVIEW')}
              className={`py-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
                activeDrawerTab === 'OVERVIEW'
                  ? 'border-[#07552B] text-[#07552B]'
                  : 'border-transparent text-[#526458] hover:text-[#061B12]'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Category Overview</span>
            </button>
            <button
              onClick={() => setActiveDrawerTab('EDIT')}
              className={`py-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
                activeDrawerTab === 'EDIT'
                  ? 'border-[#07552B] text-[#07552B]'
                  : 'border-transparent text-[#526458] hover:text-[#061B12]'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit & Update</span>
            </button>
          </div>
        )}

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: OVERVIEW (INSPECT MODE) */}
          {drawerMode === 'INSPECT' && activeDrawerTab === 'OVERVIEW' && selectedCategory && (
            <div className="space-y-6">
              {/* High-Res Banner Showcase */}
              <div className="relative h-56 rounded-2xl overflow-hidden border border-[#D0DDD4] shadow-sm bg-slate-900">
                <img
                  src={
                    selectedCategory.imageUrl ||
                    'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={selectedCategory.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80';
                  }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#061B12]/80 via-transparent to-black/30" />

                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md ${
                      selectedCategory.isActive !== false
                        ? 'bg-[#07552B]/90 text-white'
                        : 'bg-zinc-800/90 text-zinc-300'
                    }`}
                  >
                    {selectedCategory.isActive !== false ? 'Live in Storefront' : 'Hidden from Storefront'}
                  </span>

                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-white/90 text-[#061B12] backdrop-blur-md shadow-xs">
                    Display Priority: {selectedCategory.displayOrder}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-xl font-serif font-bold text-white">
                    {selectedCategory.name}
                  </h3>
                  <p className="text-xs text-zinc-300 font-mono mt-0.5">
                    Slug ID: /{selectedCategory.slug}
                  </p>
                </div>
              </div>

              {/* Quick Actions Bar */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`/products?category=${selectedCategory.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#EBF3ED] text-[#07552B] rounded-xl text-xs font-bold hover:bg-[#07552B] hover:text-white transition border border-[#D0DDD4]"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Public Storefront</span>
                </a>

                <Link
                  to={`/admin/products?category=${selectedCategory.slug}`}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#F4F7F5] text-[#061B12] rounded-xl text-xs font-bold hover:bg-[#EBF3ED] hover:text-[#07552B] transition border border-[#D0DDD4]"
                >
                  <Package className="w-4 h-4" />
                  <span>Manage {selectedCategory._count?.products || 0} Products</span>
                </Link>
              </div>

              {/* Category Technical Scope */}
              <div className="bg-[#FAFCFA] p-5 rounded-2xl border border-[#D0DDD4] space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#526458] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#07552B]" />
                  Technical Scope & Industrial Purpose
                </h4>
                <p className="text-xs text-[#061B12] leading-relaxed">
                  {selectedCategory.description ||
                    'No technical description has been provided for this category yet. Click "Edit & Update" above to describe steel grades, applicable manufacturing standards (e.g. IS 1786, IS 2062, ASTM), and primary engineering applications.'}
                </p>
              </div>

              {/* Inventory Summary Card */}
              <div className="bg-white p-5 rounded-2xl border border-[#D0DDD4] shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-[#E2EBE5]">
                  <div>
                    <h4 className="text-sm font-bold text-[#061B12]">Catalogue Allocation</h4>
                    <p className="text-xs text-[#526458]">Products linked to this primary category</p>
                  </div>
                  <span className="text-2xl font-mono font-black text-[#07552B]">
                    {selectedCategory._count?.products || 0}
                  </span>
                </div>
                <p className="text-xs text-[#526458] mt-3">
                  All products under this category share this banner image as fallback imagery in the public enquiry portal.
                </p>
              </div>

              {/* Drawer Quick Action Footer */}
              <div className="pt-4 border-t border-[#E2EBE5] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(selectedCategory)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Category</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveDrawerTab('EDIT')}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#07552B] text-white rounded-xl text-xs font-bold hover:bg-[#061B12] transition shadow-xs"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Category Details</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2 / CREATE MODE: FORM (CREATE OR EDIT) */}
          {(drawerMode === 'CREATE' || activeDrawerTab === 'EDIT') && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Category Name */}
              <div>
                <label className="block text-xs font-bold text-[#061B12] uppercase tracking-wider mb-1.5">
                  Category Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Wire Rods & Binding Wire"
                  required
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#D0DDD4] rounded-xl text-[#061B12] placeholder-[#526458] focus:outline-none focus:ring-2 focus:ring-[#07552B]/20 focus:border-[#07552B] transition"
                />
              </div>

              {/* Slug Key */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-[#061B12] uppercase tracking-wider">
                    Slug URL Key
                  </label>
                  <button
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, slug: generateSlug(p.name) }))}
                    className="text-[11px] text-[#07552B] hover:underline font-semibold"
                  >
                    Regenerate from Name
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-[#526458]">
                    /products?category=
                  </span>
                  <input
                    type="text"
                    required
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full pl-38 pr-4 py-2.5 text-xs font-mono bg-white border border-[#D0DDD4] rounded-xl text-[#061B12] focus:outline-none focus:ring-2 focus:ring-[#07552B]/20 focus:border-[#07552B] transition"
                  />
                </div>
              </div>

              {/* Display Order & Active Visibility Switch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#061B12] uppercase tracking-wider mb-1.5">
                    Display Order Priority
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.displayOrder}
                    onChange={(e) =>
                      setForm({ ...form, displayOrder: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#D0DDD4] rounded-xl text-[#061B12] focus:outline-none focus:ring-2 focus:ring-[#07552B]/20 focus:border-[#07552B] transition"
                  />
                  <span className="text-[10px] text-[#526458] mt-1 block">
                    Lower numbers appear first in the navigation.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#061B12] uppercase tracking-wider mb-1.5">
                    Storefront Visibility
                  </label>
                  <button
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, isActive: !p.isActive }))}
                    className={`w-full py-2.5 px-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition ${
                      form.isActive
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-zinc-100 text-zinc-600 border-zinc-300'
                    }`}
                  >
                    <span>{form.isActive ? 'Visible to Buyers' : 'Hidden from Storefront'}</span>
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        form.isActive ? 'bg-emerald-600 animate-pulse' : 'bg-zinc-400'
                      }`}
                    />
                  </button>
                  <span className="text-[10px] text-[#526458] mt-1 block">
                    Toggle visibility on public website.
                  </span>
                </div>
              </div>

              {/* Steel Presets Gallery */}
              <div>
                <label className="block text-xs font-bold text-[#061B12] uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Quick Steel Imagery Presets</span>
                  <span className="text-[10px] font-normal text-[#526458]">Click to apply curated stock image</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {STEEL_IMAGE_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() =>
                        setForm((p) => ({
                          ...p,
                          imageUrl: preset.url,
                          description: p.description || preset.description,
                        }))
                      }
                      className={`p-2 rounded-xl border text-left text-xs transition flex items-center gap-2 ${
                        form.imageUrl === preset.url
                          ? 'border-[#07552B] bg-[#EBF3ED] font-bold text-[#07552B]'
                          : 'border-[#D0DDD4] bg-[#FAFCFA] text-[#526458] hover:bg-white hover:border-[#07552B]/40'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=100&q=80';
                        }}
                        className="w-7 h-7 rounded-lg object-cover shrink-0"
                      />
                      <span className="truncate">{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Image URL with Live Thumbnail Preview */}
              <div>
                <label className="block text-xs font-bold text-[#061B12] uppercase tracking-wider mb-1.5">
                  Banner Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#D0DDD4] rounded-xl text-[#061B12] placeholder-[#526458] focus:outline-none focus:ring-2 focus:ring-[#07552B]/20 focus:border-[#07552B] transition font-mono"
                />

                {/* Live Preview Box */}
                {form.imageUrl && (
                  <div className="mt-2.5 p-3 bg-[#FAFCFA] rounded-xl border border-[#D0DDD4] flex items-center gap-3">
                    <img
                      src={form.imageUrl}
                      alt="Preview"
                      className="w-16 h-12 rounded-lg object-cover border border-[#D0DDD4] bg-zinc-100"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=200&q=80';
                      }}
                    />
                    <div className="text-[11px] text-[#526458]">
                      <span className="font-semibold text-[#061B12] block">Live Thumbnail Preview</span>
                      <span className="truncate max-w-xs block font-mono text-[10px] text-emerald-700">
                        Image link validated
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Technical Description */}
              <div>
                <label className="block text-xs font-bold text-[#061B12] uppercase tracking-wider mb-1.5">
                  Technical Overview & Industrial Scope
                </label>
                <textarea
                  rows={4}
                  placeholder="Detailed engineering summary of steel products, mechanical properties, and construction utilities in this category..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#D0DDD4] rounded-xl text-[#061B12] placeholder-[#526458] focus:outline-none focus:ring-2 focus:ring-[#07552B]/20 focus:border-[#07552B] transition"
                />
              </div>

              {/* Form Submit Action Buttons */}
              <div className="pt-4 border-t border-[#E2EBE5] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#D0DDD4] text-xs font-semibold text-[#526458] hover:bg-[#F4F7F5] hover:text-[#061B12] transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#061B12] to-[#07552B] text-white rounded-xl text-xs font-bold hover:from-[#07552B] hover:to-[#0D7A40] transition shadow-sm hover:shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  <span>{drawerMode === 'CREATE' ? 'Create Category' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TWO-STEP SAFETY DELETE CONFIRMATION MODAL                                  */}
      {/* ========================================================================= */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#D0DDD4] shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-serif font-bold text-[#061B12]">
                Delete Category '{deleteTarget.name}'?
              </h3>
              <p className="text-xs text-[#526458] mt-1.5">
                This will permanently remove this steel portfolio line from your database.
              </p>
            </div>

            {/* Check if products are currently assigned */}
            {(deleteTarget._count?.products || 0) > 0 ? (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Deletion Guard Active</span>
                </div>
                <p>
                  This category contains{' '}
                  <span className="font-bold font-mono">{deleteTarget._count?.products}</span> products.
                  You must reassign or remove these products before deleting this category.
                </p>
                <Link
                  to={`/admin/products?category=${deleteTarget.slug}`}
                  onClick={() => setDeleteTarget(null)}
                  className="inline-flex items-center gap-1 font-bold text-amber-900 hover:underline pt-1"
                >
                  <span>Reassign Products in Inventory ↗</span>
                </Link>
              </div>
            ) : (
              <div className="p-3 bg-slate-50 rounded-xl border border-[#E2EBE5] text-xs text-[#526458]">
                <span className="font-semibold text-[#061B12] block">Safe to remove</span>
                No products are currently assigned to this category.
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-[#D0DDD4] text-[#526458] hover:bg-[#F4F7F5]"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={(deleteTarget._count?.products || 0) > 0 || isDeleting}
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Deletion'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
