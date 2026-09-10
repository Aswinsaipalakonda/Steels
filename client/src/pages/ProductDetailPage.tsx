import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../lib/api';
import { Product, ProductVariant } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { Badge } from '../components/ui/Badge';
import { useToast } from '../context/ToastContext';
import {
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
  Clock,
  ArrowRight,
  FileText,
  Truck,
  Building,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { success, error } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Quotation form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEnquiryNumber, setSubmittedEnquiryNumber] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    company: '',
    location: '',
    quantity: '10',
    unit: 'MT',
    message: '',
  });

  useEffect(() => {
    setIsLoading(true);
    setSubmittedEnquiryNumber(null);
    setSelectedImageIndex(0);

    api
      .get(`/products/${slug}`)
      .then((res: any) => {
        if (res.data) {
          setProduct(res.data);
          if (res.data.variants && res.data.variants.length > 0) {
            setSelectedVariant(res.data.variants[0]);
          }
        }
      })
      .catch((err) => {
        console.error(err);
        error('Failed to load product details.');
      })
      .finally(() => setIsLoading(false));
  }, [slug, error]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmitEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setIsSubmitting(true);
    try {
      const res: any = await api.post('/enquiries', {
        ...formData,
        quantity: formData.quantity ? parseFloat(formData.quantity) : null,
        productId: product.id,
        variantId: selectedVariant?.id || null,
        sourcePage: window.location.pathname,
      });

      const refNo = res.data?.enquiryNumber || 'ENQ-CONFIRMED';
      setSubmittedEnquiryNumber(refNo);
      success('Your quotation request has been submitted successfully!');
    } catch (err: any) {
      error(err.message || 'Failed to submit quotation request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
          <div className="h-[500px] bg-steel-forest/40 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-8 bg-steel-forest/60 rounded w-2/3" />
            <div className="h-4 bg-steel-forest/40 rounded w-1/3" />
            <div className="h-40 bg-steel-forest/20 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Product Not Found</h2>
        <p className="text-steel-olive text-sm mb-6">The requested steel product does not exist or has been removed.</p>
        <Link to="/products">
          <Button variant="primary">Return to Catalog</Button>
        </Link>
      </div>
    );
  }

  const galleryImages =
    product.images && product.images.length > 0
      ? product.images
      : [
          {
            id: 'fallback',
            imageUrl:
              'https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=1200&q=80',
            altText: product.name,
            isPrimary: true,
            displayOrder: 0,
          },
        ];

  const currentImage = galleryImages[selectedImageIndex] || galleryImages[0];

  return (
    <div className="py-10 bg-[#FAFCFA] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-[#526458] mb-6 overflow-x-auto">
          <Link to="/" className="hover:text-[#111814] transition">
            Home
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-[#111814] transition">
            Products
          </Link>
          <span>/</span>
          {product.category && (
            <>
              <Link to={`/products?category=${product.category.slug}`} className="hover:text-[#111814] transition">
                {product.category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-[#07552B] font-bold truncate">{product.name}</span>
        </nav>

        {/* Top Product Section: Gallery & Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Gallery Column (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Stage Image */}
            <div className="relative h-[380px] sm:h-[480px] rounded-2xl overflow-hidden bg-white border border-[#E2EBE5] shadow-md">
              <img
                src={currentImage.imageUrl}
                alt={currentImage.altText || product.name}
                className="w-full h-full object-cover object-center transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

              {/* Status and Category Chips */}
              <div className="absolute top-4 left-4 flex gap-2">
                {product.category && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/95 text-[#07552B] border border-[#E2EBE5] backdrop-blur-md shadow-sm">
                    {product.category.name}
                  </span>
                )}
                {product.brand && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#07552B] text-white border border-[#07552B] backdrop-blur-md shadow-sm">
                    {product.brand.name}
                  </span>
                )}
              </div>

              <div className="absolute top-4 right-4">
                <Badge variant={product.availabilityStatus === 'AVAILABLE' ? 'available' : 'limited'}>
                  {product.availabilityStatus}
                </Badge>
              </div>
            </div>

            {/* Thumbnail Strip */}
            {galleryImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                {galleryImages.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition shrink-0 ${
                      idx === selectedImageIndex
                        ? 'border-[#07552B] ring-2 ring-[#07552B]/20'
                        : 'border-[#E2EBE5] hover:border-[#07552B] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img.imageUrl} alt={img.altText || ''} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Specifications Details Table */}
            <div className="mt-8 bg-white border border-[#E2EBE5] rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-[#07552B]" />
                <h3 className="text-base font-bold text-[#111814] uppercase tracking-tight">
                  Technical Specifications & Compliance
                </h3>
              </div>

              {product.specifications && product.specifications.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.specifications.map((spec) => (
                    <div
                      key={spec.id}
                      className="flex justify-between p-3 rounded-xl bg-[#F4F7F5] border border-[#E2EBE5] text-xs"
                    >
                      <span className="text-[#526458] font-semibold">{spec.specKey}</span>
                      <span className="text-[#111814] font-bold">{spec.specValue}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#526458]">Detailed mill test certificate available on request.</p>
              )}
            </div>
          </div>

          {/* Configuration & Quotation Form Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-[#111814] tracking-tight uppercase leading-tight font-sans">
                {product.name}
              </h1>

              {product.primarySpecification && (
                <div className="mt-2.5 flex items-center gap-2 text-sm text-[#07552B] font-semibold">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>{product.primarySpecification}</span>
                </div>
              )}

              <p className="text-sm text-[#526458] mt-4 leading-relaxed font-normal">
                {product.fullDescription || product.shortDescription}
              </p>
            </div>

            {/* Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="p-5 rounded-2xl bg-white border border-[#E2EBE5] space-y-3 shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#07552B]">
                    Select Size & Specification:
                  </span>
                  {selectedVariant && (
                    <span className="text-xs text-[#526458] font-mono">
                      Item Code: {selectedVariant.sku || 'N/A'}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {product.variants.map((variant) => {
                    const isSelected = selectedVariant?.id === variant.id;
                    const label = variant.diameter || variant.size || variant.thickness || variant.name;

                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => setSelectedVariant(variant)}
                        className={`p-2.5 rounded-xl text-left border transition text-xs ${
                          isSelected
                            ? 'bg-[#07552B] border-[#07552B] text-white shadow-sm'
                            : 'bg-[#FAFCFA] border-[#E2EBE5] text-[#111814] hover:border-[#07552B]'
                        }`}
                      >
                        <div className="font-bold truncate">{label}</div>
                        {variant.grade && <div className={`text-[10px] ${isSelected ? 'text-emerald-100' : 'text-[#526458]'}`}>{variant.grade}</div>}
                        {variant.weight && <div className={`text-[10px] ${isSelected ? 'text-emerald-200' : 'text-[#07552B]'}`}>{variant.weight}</div>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Inline Quotation Form Card */}
            <div className="p-6 rounded-2xl bg-white border border-[#D0DDD4] shadow-md">
              {submittedEnquiryNumber ? (
                <div className="text-center py-6">
                  <div className="w-14 h-14 bg-[#EBF3ED] border border-[#D0DDD4] rounded-full flex items-center justify-center mx-auto mb-4 text-[#07552B]">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-[#111814] mb-1">Enquiry Registered</h3>
                  <p className="text-xs font-mono text-[#07552B] font-bold mb-3">Ref: {submittedEnquiryNumber}</p>
                  <p className="text-xs text-[#526458] max-w-xs mx-auto mb-6">
                    Our sales desk has received your request for {product.name}. A technical quote with current mill dispatch rates will be sent to your email and phone.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSubmittedEnquiryNumber(null);
                    }}
                    className="w-full text-xs"
                  >
                    Submit Another Request
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmitEnquiry} className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-[#111814] uppercase tracking-tight">
                      Request Instant Commercial Quote
                    </h3>
                    <p className="text-xs text-[#526458] mt-0.5">
                      Selected: {selectedVariant?.name || product.name}
                    </p>
                  </div>

                  {/* Quantity & Unit */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <Input
                        label="Required Quantity"
                        name="quantity"
                        type="number"
                        step="any"
                        placeholder="e.g. 20"
                        required
                        value={formData.quantity}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <Select label="Unit" name="unit" value={formData.unit} onChange={handleChange}>
                        <option value="MT">MT (Tons)</option>
                        <option value="KG">Kilograms</option>
                        <option value="PCS">Pieces</option>
                        <option value="Bundles">Bundles</option>
                        <option value="Meters">Meters</option>
                      </Select>
                    </div>
                  </div>

                  {/* Name & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Full Name"
                      name="customerName"
                      placeholder="Your Name"
                      required
                      value={formData.customerName}
                      onChange={handleChange}
                    />
                    <Input
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Email & Company */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Email Address"
                      name="email"
                      type="email"
                      placeholder="name@company.com"
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                    <Input
                      label="Company / Project"
                      name="company"
                      placeholder="Firm Name"
                      value={formData.company}
                      onChange={handleChange}
                    />
                  </div>

                  <Input
                    label="Delivery Site / City"
                    name="location"
                    placeholder="Project Site, City or Pincode"
                    value={formData.location}
                    onChange={handleChange}
                  />

                  <Textarea
                    label="Delivery Schedule / Requirements"
                    name="message"
                    placeholder="Schedule of delivery, specific tolerance or custom cut requirements..."
                    rows={2}
                    value={formData.message}
                    onChange={handleChange}
                  />

                  <Button type="submit" variant="primary" className="w-full py-3 text-sm font-semibold" isLoading={isSubmitting}>
                    Submit Quotation Request
                  </Button>

                  <div className="flex items-center justify-between text-[11px] text-[#526458] pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#07552B]" />
                      <span>Response within 2h</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-[#07552B]" />
                      <span>Direct Mill Dispatch</span>
                    </span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {product.relatedProducts && product.relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-[#E2EBE5]">
            <h3 className="text-xl sm:text-2xl font-bold text-[#111814] uppercase tracking-tight mb-8">
              Complementary Products in {product.category?.name}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {product.relatedProducts.map((rel) => {
                const imgUrl =
                  rel.images?.[0]?.imageUrl ||
                  'https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=600&q=80';

                return (
                  <Link
                    key={rel.id}
                    to={`/products/${rel.slug}`}
                    className="p-4 rounded-2xl bg-white border border-[#E2EBE5] hover:border-[#07552B] transition group flex flex-col shadow-sm"
                  >
                    <div className="h-40 rounded-xl overflow-hidden mb-3 bg-zinc-100">
                      <img
                        src={imgUrl}
                        alt={rel.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="font-bold text-sm text-[#111814] group-hover:text-[#07552B] transition-colors uppercase line-clamp-1">
                      {rel.name}
                    </h4>
                    <span className="text-xs text-[#526458] mt-1">View specifications →</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
