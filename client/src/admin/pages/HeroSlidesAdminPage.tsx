import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { HeroSlide } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../context/ToastContext';
import { Plus, Trash2, Edit2 } from 'lucide-react';

export const HeroSlidesAdminPage: React.FC = () => {
  const { success, error } = useToast();
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    bgImageUrl: '',
    primaryCtaText: 'Explore Products',
    primaryCtaLink: '/products',
    secondaryCtaText: 'Request a Quote',
    secondaryCtaLink: '/quote',
    displayOrder: 1,
    isActive: true,
  });

  const loadSlides = () => {
    api
      .get('/hero-slides/admin/all')
      .then((res: any) => {
        if (res.data) setSlides(res.data);
      })
      .catch((err) => error(err.message));
  };

  useEffect(() => {
    loadSlides();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({
      title: 'BUILT FOR STRENGTH. ENGINEERED FOR SCALE.',
      subtitle: 'Primary mill direct steel supply with computerized weighbridge slips.',
      bgImageUrl:
        'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1920&q=85',
      primaryCtaText: 'Explore Products',
      primaryCtaLink: '/products',
      secondaryCtaText: 'Request a Quote',
      secondaryCtaLink: '/quote',
      displayOrder: slides.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (slide: HeroSlide) => {
    setEditingId(slide.id);
    setForm({
      title: slide.title,
      subtitle: slide.subtitle || '',
      bgImageUrl: slide.bgImageUrl,
      primaryCtaText: slide.primaryCtaText,
      primaryCtaLink: slide.primaryCtaLink,
      secondaryCtaText: slide.secondaryCtaText || '',
      secondaryCtaLink: slide.secondaryCtaLink || '',
      displayOrder: slide.displayOrder,
      isActive: slide.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/hero-slides/${editingId}`, form);
        success('Slide updated successfully.');
      } else {
        await api.post('/hero-slides', form);
        success('Slide added successfully.');
      }
      setIsModalOpen(false);
      loadSlides();
    } catch (err: any) {
      error(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this hero slide?')) return;
    try {
      await api.delete(`/hero-slides/${id}`);
      success('Slide deleted.');
      loadSlides();
    } catch (err: any) {
      error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight font-sans">
            Homepage Hero Slides
          </h1>
          <p className="text-xs text-steel-olive mt-1">
            Configure primary headlines, stock banner backgrounds, and action CTAs.
          </p>
        </div>

        <Button variant="primary" onClick={handleOpenAdd} className="gap-2 self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          <span>Add Hero Slide</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="rounded-2xl bg-steel-forest/50 border border-steel-rich overflow-hidden shadow-xl flex flex-col"
          >
            <div className="relative h-48 bg-zinc-900 overflow-hidden">
              <img src={slide.bgImageUrl} alt={slide.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-steel-darkest via-transparent to-black/30" />
              <div className="absolute top-3 left-3 bg-steel-darkest/90 px-2.5 py-0.5 rounded text-[10px] font-mono text-emerald-400 border border-steel-accent/40">
                Order #{slide.displayOrder}
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="font-bold text-white text-base uppercase tracking-tight leading-snug">
                  {slide.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed font-normal">
                  {slide.subtitle}
                </p>
                <div className="flex gap-2 mt-3 text-[11px] text-steel-olive">
                  <span>Primary: {slide.primaryCtaText}</span>
                  <span>•</span>
                  <span>Secondary: {slide.secondaryCtaText}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-steel-rich flex justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(slide)}
                  className="p-1.5 rounded text-zinc-300 hover:text-white hover:bg-steel-darkest transition"
                  title="Edit slide"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(slide.id)}
                  className="p-1.5 rounded text-zinc-500 hover:text-red-400 hover:bg-red-950/30 transition"
                  title="Delete slide"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Slide' : 'Add Slide'} maxWidth="xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Slide Headline (Bold Satoshi Display)"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <Textarea
            label="Subtitle"
            rows={2}
            value={form.subtitle}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
          />

          <Input
            label="Background Stock Image URL"
            required
            value={form.bgImageUrl}
            onChange={(e) => setForm({ ...form, bgImageUrl: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Primary CTA Text"
              value={form.primaryCtaText}
              onChange={(e) => setForm({ ...form, primaryCtaText: e.target.value })}
            />
            <Input
              label="Primary CTA Link"
              value={form.primaryCtaLink}
              onChange={(e) => setForm({ ...form, primaryCtaLink: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Secondary CTA Text"
              value={form.secondaryCtaText}
              onChange={(e) => setForm({ ...form, secondaryCtaText: e.target.value })}
            />
            <Input
              label="Secondary CTA Link"
              value={form.secondaryCtaLink}
              onChange={(e) => setForm({ ...form, secondaryCtaLink: e.target.value })}
            />
          </div>

          <Button type="submit" variant="primary" className="w-full">
            Save Slide
          </Button>
        </form>
      </Modal>
    </div>
  );
};
