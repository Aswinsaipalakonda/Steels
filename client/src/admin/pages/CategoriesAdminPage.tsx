import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Category } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../context/ToastContext';
import { Plus, Trash2, Edit2, RotateCcw } from 'lucide-react';

export const CategoriesAdminPage: React.FC = () => {
  const { success, error } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    imageUrl: '',
    displayOrder: 0,
  });

  const loadCategories = () => {
    setIsLoading(true);
    api
      .get('/categories?all=true')
      .then((res: any) => {
        if (res.data) setCategories(res.data);
      })
      .catch((err) => error(err.message))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({
      name: '',
      description: '',
      imageUrl: '',
      displayOrder: categories.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingId(cat.id);
    setForm({
      name: cat.name,
      description: cat.description || '',
      imageUrl: cat.imageUrl || '',
      displayOrder: cat.displayOrder,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, form);
        success('Category updated successfully.');
      } else {
        await api.post('/categories', form);
        success('Category created successfully.');
      }
      setIsModalOpen(false);
      loadCategories();
    } catch (err: any) {
      error(err.message);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete category '${name}'?`)) return;
    try {
      await api.delete(`/categories/${id}`);
      success('Category deleted successfully.');
      loadCategories();
    } catch (err: any) {
      error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight font-sans">
            Steel Categories Management
          </h1>
          <p className="text-xs text-steel-olive mt-1">
            Organize steel product lines (Rebars, Structural Beams, Plates, Pipes).
          </p>
        </div>

        <Button variant="primary" onClick={handleOpenAdd} className="gap-2 self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-steel-forest/40 border border-steel-rich overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-steel-rich text-steel-olive uppercase font-bold text-[10px] bg-steel-forest/80">
            <tr>
              <th className="p-4">Category</th>
              <th className="p-4">Slug</th>
              <th className="p-4">Products</th>
              <th className="p-4">Order</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-steel-rich/60">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-steel-darkest/60 transition">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        cat.imageUrl ||
                        'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=200&q=80'
                      }
                      alt={cat.name}
                      className="w-12 h-12 rounded-lg object-cover bg-zinc-900 shrink-0"
                    />
                    <div>
                      <span className="font-bold text-white block text-sm">{cat.name}</span>
                      <span className="text-[11px] text-zinc-400 line-clamp-1 max-w-sm">
                        {cat.description || 'No description'}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="p-4 font-mono text-zinc-400">{cat.slug}</td>
                <td className="p-4 font-bold text-emerald-400">{cat._count?.products || 0}</td>
                <td className="p-4 text-zinc-300 font-mono">{cat.displayOrder}</td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-steel-forest transition"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="p-1.5 rounded text-zinc-400 hover:text-red-400 hover:bg-red-950/30 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Category' : 'Create Steel Category'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Category Name"
            placeholder="e.g. Wire Rods & Binding Wire"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <Input
            label="Stock Image URL"
            placeholder="https://images.unsplash.com/photo-..."
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          />

          <Input
            label="Display Order"
            type="number"
            value={form.displayOrder}
            onChange={(e) => setForm({ ...form, displayOrder: parseInt(e.target.value) || 0 })}
          />

          <Textarea
            label="Category Description"
            placeholder="Technical overview of materials in this category..."
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <Button type="submit" variant="primary" className="w-full">
            Save Category
          </Button>
        </form>
      </Modal>
    </div>
  );
};
