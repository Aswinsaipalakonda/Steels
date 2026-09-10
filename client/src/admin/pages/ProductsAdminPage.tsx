import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Product, Category } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../context/ToastContext';
import { Plus, Search, Trash2, Star, CheckCircle2, RotateCcw } from 'lucide-react';

export const ProductsAdminPage: React.FC = () => {
  const { success, error } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modal State for Create / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    categoryId: '',
    primarySpecification: '',
    shortDescription: '',
    fullDescription: '',
    availableUnits: 'MT,KG,PCS,Bundles',
    imageUrl: '',
    availabilityStatus: 'AVAILABLE',
    isFeatured: false,
    variants: [{ name: '', diameter: '', grade: '' }],
    specifications: [{ specKey: '', specValue: '' }],
  });

  const loadData = () => {
    setIsLoading(true);
    const query = new URLSearchParams({ all: 'true' });
    if (search) query.set('search', search);
    if (selectedCategory) query.set('category', selectedCategory);

    Promise.all([api.get(`/products?${query.toString()}`), api.get('/categories?all=true')])
      .then(([prodRes, catRes]: any) => {
        if (prodRes.data) setProducts(prodRes.data);
        if (catRes.data) {
          setCategories(catRes.data);
          if (catRes.data.length > 0 && !form.categoryId) {
            setForm((prev) => ({ ...prev, categoryId: catRes.data[0].id }));
          }
        }
      })
      .catch((err) => error(err.message))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory]);

  const handleToggleFeatured = async (id: string) => {
    try {
      await api.patch(`/products/${id}/feature`, {});
      success('Featured status updated.');
      loadData();
    } catch (err: any) {
      error(err.message);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete '${name}'?`)) return;

    try {
      await api.delete(`/products/${id}`);
      success('Product deleted successfully.');
      loadData();
    } catch (err: any) {
      error(err.message);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        name: form.name,
        categoryId: form.categoryId,
        primarySpecification: form.primarySpecification,
        shortDescription: form.shortDescription,
        fullDescription: form.fullDescription,
        availableUnits: form.availableUnits,
        availabilityStatus: form.availabilityStatus,
        isFeatured: form.isFeatured,
        images: form.imageUrl
          ? [{ imageUrl: form.imageUrl, isPrimary: true, altText: form.name }]
          : undefined,
        variants: form.variants.filter((v) => v.name.trim().length > 0),
        specifications: form.specifications.filter((s) => s.specKey.trim().length > 0),
      };

      await api.post('/products', payload);
      success('Product added successfully!');
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight font-sans">
            Steel Products Management
          </h1>
          <p className="text-xs text-steel-olive mt-1">
            Manage commercial steel catalog, variants, specifications, and featured flags.
          </p>
        </div>

        <Button variant="primary" onClick={() => setIsModalOpen(true)} className="gap-2 self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          <span>Add Steel Product</span>
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-steel-forest/60 border border-steel-rich flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex gap-2 flex-1 max-w-md">
          <Input
            placeholder="Search products by title or grade..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button variant="secondary" onClick={loadData}>
            <Search className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-steel-darkest border border-steel-rich rounded-lg px-3 py-2 text-xs text-white"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            onClick={loadData}
            className="p-2 rounded-lg bg-steel-darkest border border-steel-rich text-zinc-400 hover:text-white"
            title="Refresh"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl bg-steel-forest/40 border border-steel-rich overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-steel-rich text-steel-olive uppercase font-bold text-[10px] bg-steel-forest/80">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Primary Specification</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Featured</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-steel-rich/60">
              {products.length > 0 ? (
                products.map((p) => {
                  const img =
                    p.images?.[0]?.imageUrl ||
                    'https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=200&q=80';

                  return (
                    <tr key={p.id} className="hover:bg-steel-darkest/60 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={img} alt={p.name} className="w-12 h-12 rounded-lg object-cover bg-zinc-900 shrink-0" />
                          <div>
                            <span className="font-bold text-white block text-sm">{p.name}</span>
                            <span className="text-[11px] text-steel-olive">
                              {p.variants?.length || 0} variants configured
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-zinc-300 font-medium">{p.category?.name}</td>
                      <td className="p-4 text-emerald-400 font-semibold">{p.primarySpecification || 'N/A'}</td>
                      <td className="p-4">
                        <Badge variant={p.availabilityStatus === 'AVAILABLE' ? 'available' : 'limited'}>
                          {p.availabilityStatus}
                        </Badge>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleToggleFeatured(p.id)}
                          className={`p-1.5 rounded-lg transition ${
                            p.isFeatured ? 'text-amber-400 bg-amber-950/40' : 'text-zinc-600 hover:text-zinc-400'
                          }`}
                          title="Toggle featured homepage visibility"
                        >
                          <Star className="w-4 h-4 fill-current" />
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-1.5 rounded text-zinc-500 hover:text-red-400 hover:bg-red-950/30 transition"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-steel-olive">
                    No steel products match query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Steel Product" maxWidth="2xl">
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Product Name"
              placeholder="e.g. Fe 500D TMT Bar"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Select
              label="Category"
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Primary Specification"
              placeholder="e.g. IS 1786:2008 Grade Fe 500D"
              value={form.primarySpecification}
              onChange={(e) => setForm({ ...form, primarySpecification: e.target.value })}
            />
            <Input
              label="Image URL (Unsplash or Cloudinary)"
              placeholder="https://images.unsplash.com/photo-..."
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            />
          </div>

          <Textarea
            label="Short Summary"
            placeholder="Brief description for catalogue cards..."
            rows={2}
            value={form.shortDescription}
            onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
          />

          {/* Quick Variant Adder */}
          <div className="p-4 rounded-xl bg-steel-darkest border border-steel-rich space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase text-emerald-400">Variant Matrix</span>
              <button
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    variants: [...form.variants, { name: '', diameter: '', grade: '' }],
                  })
                }
                className="text-xs text-emerald-400 hover:underline"
              >
                + Add Variant
              </button>
            </div>
            {form.variants.map((v, idx) => (
              <div key={idx} className="grid grid-cols-3 gap-2">
                <input
                  placeholder="Variant Name (e.g. 16mm)"
                  className="bg-steel-forest border border-steel-rich rounded p-2 text-xs text-white"
                  value={v.name}
                  onChange={(e) => {
                    const newV = [...form.variants];
                    newV[idx].name = e.target.value;
                    setForm({ ...form, variants: newV });
                  }}
                />
                <input
                  placeholder="Diameter/Size"
                  className="bg-steel-forest border border-steel-rich rounded p-2 text-xs text-white"
                  value={v.diameter}
                  onChange={(e) => {
                    const newV = [...form.variants];
                    newV[idx].diameter = e.target.value;
                    setForm({ ...form, variants: newV });
                  }}
                />
                <input
                  placeholder="Grade"
                  className="bg-steel-forest border border-steel-rich rounded p-2 text-xs text-white"
                  value={v.grade}
                  onChange={(e) => {
                    const newV = [...form.variants];
                    newV[idx].grade = e.target.value;
                    setForm({ ...form, variants: newV });
                  }}
                />
              </div>
            ))}
          </div>

          <Button type="submit" variant="primary" className="w-full" isLoading={isSubmitting}>
            Save Steel Product
          </Button>
        </form>
      </Modal>
    </div>
  );
};
