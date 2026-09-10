import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Brand } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../context/ToastContext';
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ShieldCheck,
  Search,
} from 'lucide-react';

export const BrandsAdminPage: React.FC = () => {
  const { success, error } = useToast();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadBrands = () => {
    setIsLoading(true);
    api
      .get('/brands?all=true')
      .then((res: any) => {
        if (res.data) setBrands(res.data);
      })
      .catch((err) => error(err.message))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadBrands();
  }, []);

  const openCreateModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setName('');
    setSlug('');
    setLogoUrl('');
    setDescription('');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (b: Brand) => {
    setIsEditing(true);
    setCurrentId(b.id);
    setName(b.name);
    setSlug(b.slug);
    setLogoUrl(b.logoUrl || '');
    setDescription(b.description || '');
    setIsActive(b.isActive);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      error('Company / Brand name is required.');
      return;
    }

    setIsSaving(true);
    const payload = {
      name: name.trim(),
      slug: slug.trim() || undefined,
      logoUrl: logoUrl.trim() || undefined,
      description: description.trim() || undefined,
      isActive,
    };

    try {
      if (isEditing && currentId) {
        await api.put(`/brands/${currentId}`, payload);
        success('Partner brand updated successfully.');
      } else {
        await api.post('/brands', payload);
        success('New partner brand added to the homepage marquee.');
      }
      setIsModalOpen(false);
      loadBrands();
    } catch (err: any) {
      error(err.message || 'Failed to save brand');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (brand: Brand) => {
    try {
      await api.put(`/brands/${brand.id}`, { isActive: !brand.isActive });
      success(
        `Brand '${brand.name}' is now ${!brand.isActive ? 'active in' : 'hidden from'} marquee.`
      );
      setBrands((prev) =>
        prev.map((b) => (b.id === brand.id ? { ...b, isActive: !b.isActive } : b))
      );
    } catch (err: any) {
      error(err.message || 'Failed to toggle status');
    }
  };

  const handleDelete = async (brand: Brand) => {
    if (!window.confirm(`Are you sure you want to remove '${brand.name}'?`)) return;

    try {
      await api.delete(`/brands/${brand.id}`);
      success(`Brand '${brand.name}' deleted successfully.`);
      loadBrands();
    } catch (err: any) {
      error(err.message || 'Failed to delete brand');
    }
  };

  const filteredBrands = brands.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      (b.description && b.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Page Header */}
      <div className="bg-white border border-[#E2EBE5] rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#07552B] mb-1">
            <Building2 className="w-4 h-4" />
            <span>Dynamic Homepage Marquee</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-[#111814]">
            Partner Brands & Mill Logos
          </h1>
          <p className="text-xs text-[#526458] mt-1">
            Manage the partner logos and certified steel mill alliances that scroll continuously under the homepage hero section.
          </p>
        </div>

        <Button
          onClick={openCreateModal}
          variant="primary"
          size="md"
          className="self-start sm:self-auto flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Partner Brand</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E2EBE5] rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#526458] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search partner brands or grades..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-full bg-[#FAFCFA] border border-[#D0DDD4] text-xs font-medium text-[#111814] focus:outline-none focus:border-[#07552B]"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-[#526458]">
          <span className="font-bold text-[#111814]">{brands.filter((b) => b.isActive).length}</span> active in marquee •
          <span className="font-bold text-[#111814]">{brands.length}</span> total brands
        </div>
      </div>

      {/* Brands Grid / Table */}
      <div className="bg-white border border-[#E2EBE5] rounded-3xl p-6 sm:p-8 shadow-sm">
        {isLoading ? (
          <div className="py-12 text-center text-xs text-[#526458] animate-pulse">
            Loading partner brands...
          </div>
        ) : filteredBrands.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#526458]">
            No partner brands found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBrands.map((b) => (
              <div
                key={b.id}
                className="p-5 rounded-2xl bg-[#FAFCFA] border border-[#E2EBE5] shadow-xs flex flex-col justify-between hover:border-[#07552B]/40 hover:shadow-sm transition duration-200"
              >
                <div>
                  {/* Top Header: Logo + Active Switch */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-white border border-[#E2EBE5] p-2 flex items-center justify-center shrink-0 shadow-xs overflow-hidden">
                      {b.logoUrl ? (
                        <img
                          src={b.logoUrl}
                          alt={b.name}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <span className="font-black text-[#07552B] text-base">
                          {b.name.substring(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleToggleActive(b)}
                      className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition ${
                        b.isActive
                          ? 'bg-[#EBF3ED] text-[#07552B] border border-[#D0DDD4]'
                          : 'bg-gray-100 text-gray-500 border border-gray-200'
                      }`}
                      title="Click to toggle active status in homepage marquee"
                    >
                      {b.isActive ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-[#07552B]" />
                          <span>Active in Marquee</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 text-gray-400" />
                          <span>Hidden</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Company Name & Slug */}
                  <h3 className="text-base font-black text-[#111814] tracking-tight">{b.name}</h3>
                  <span className="text-[10px] font-mono text-[#526458] block mb-2">/{b.slug}</span>

                  {/* Description / Specification tag */}
                  <p className="text-xs text-[#526458] line-clamp-2 bg-white p-2.5 rounded-xl border border-[#E2EBE5] text-[11px] leading-relaxed">
                    {b.description || 'No grade specifications listed.'}
                  </p>
                </div>

                {/* Bottom Actions */}
                <div className="mt-5 pt-3 border-t border-[#E2EBE5] flex items-center justify-between text-xs">
                  <span className="text-[10px] font-semibold text-[#526458]">
                    {b.isActive ? '● Live on Frontpage' : '○ Disabled'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(b)}
                      className="p-2 rounded-full bg-white border border-[#D0DDD4] text-[#526458] hover:text-[#07552B] hover:border-[#07552B] transition"
                      title="Edit Brand Details"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(b)}
                      className="p-2 rounded-full bg-white border border-red-200 text-red-600 hover:bg-red-50 transition"
                      title="Delete Brand"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Partner Brand Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? 'Edit Partner Company Brand' : 'Add New Partner Brand to Marquee'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Company / Mill Name"
            placeholder="e.g. Tata Steel Tiscon"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="URL Slug (Optional)"
            placeholder="e.g. tata-steel"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />

          <Input
            label="Company Logo Image URL"
            placeholder="https://images.unsplash.com/..."
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
          />

          <Textarea
            label="Subtitle / Grade Specification / Code Tag"
            placeholder="e.g. IS 1786 Certified • Tiscon 550D & Heavy Sections Direct Mill Dispatch"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isActiveBrand"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded text-[#07552B] focus:ring-[#07552B] border-gray-300"
            />
            <label htmlFor="isActiveBrand" className="text-xs font-bold text-[#111814] cursor-pointer">
              Visible and actively scrolling in the homepage marquee
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#E2EBE5]">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSaving}
            >
              {isEditing ? 'Save Changes' : 'Add to Marquee'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
