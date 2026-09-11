import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../lib/api';
import { Product, ProductVariant } from '../types';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useToast } from '../context/ToastContext';
import {
  deriveUnitWeight,
  getBaseRateForProduct,
  calculateTotals,
  SizeCalculationRow,
  CalculationSummary,
} from '../lib/steelCalculations';
import {
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
  Clock,
  ArrowRight,
  FileText,
  Truck,
  RotateCcw,
  Sparkles,
  Calculator,
  User,
  Phone,
  MapPin,
  MessageSquare,
  Check,
  Award,
  ChevronDown,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { success, error } = useToast();
  const requestFormRef = useRef<HTMLDivElement>(null);

  const [product, setProduct] = useState<Product | null>(null);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Size calculation rows state
  const [calcRows, setCalcRows] = useState<SizeCalculationRow[]>([]);

  // Simple 4-field quotation form state (Convenient for all customers - NO LOGIN required)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEnquiryNumber, setSubmittedEnquiryNumber] = useState<string | null>(null);
  const [showRequestForm, setShowRequestForm] = useState(true);
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    pincode: '',
    message: '',
  });

  // Fetch product data & public admin settings
  useEffect(() => {
    setIsLoading(true);
    setSubmittedEnquiryNumber(null);
    setSelectedImageIndex(0);

    Promise.all([api.get(`/products/${slug}`), api.get('/settings/public')])
      .then(([prodRes, settingsRes]: any) => {
        if (prodRes.data) {
          const prodData: Product = prodRes.data;
          setProduct(prodData);

          if (settingsRes?.data) {
            setSettings(settingsRes.data);
          }

          // Initialize size rows from variants configured in admin dashboard
          if (prodData.variants && prodData.variants.length > 0) {
            const initialRows: SizeCalculationRow[] = prodData.variants.map((v, idx) => {
              const unitWeight = deriveUnitWeight(v, prodData);
              const label = v.diameter || v.size || v.thickness || v.name;
              // Default pre-select first 2 sizes so user sees active calculation immediately
              const defaultPieces = idx === 0 ? 10 : idx === 1 ? 5 : 0;
              const defaultTonnes = defaultPieces > 0 ? parseFloat(((defaultPieces * unitWeight) / 1000).toFixed(3)) : 0;

              return {
                variantId: v.id,
                name: v.name || `${label} ${v.grade || ''}`.trim(),
                diameterOrSize: label,
                grade: v.grade || undefined,
                unitWeightKg: unitWeight,
                lengthMeters: 12,
                pieces: defaultPieces,
                tonnes: defaultTonnes,
              };
            });
            setCalcRows(initialRows);
          }
        }
      })
      .catch((err) => {
        console.error(err);
        error('Failed to load product details.');
      })
      .finally(() => setIsLoading(false));
  }, [slug, error]);

  // Base rate from admin dashboard settings
  const baseRatePerMt = useMemo(() => {
    return getBaseRateForProduct(product, settings);
  }, [product, settings]);

  const gstPercent = useMemo(() => {
    return parseFloat(settings.gst_rate_percent || '18');
  }, [settings]);

  // Calculated totals
  const totals: CalculationSummary = useMemo(() => {
    return calculateTotals(calcRows, baseRatePerMt, gstPercent);
  }, [calcRows, baseRatePerMt, gstPercent]);

  // Handle Pieces change for a row (auto-calculates Tonnes)
  const handlePiecesChange = (variantId: string, piecesVal: string) => {
    const p = Math.max(0, parseInt(piecesVal) || 0);
    setCalcRows((prev) =>
      prev.map((row) => {
        if (row.variantId === variantId) {
          const tonnes = p > 0 ? parseFloat(((p * row.unitWeightKg) / 1000).toFixed(3)) : 0;
          return { ...row, pieces: p, tonnes };
        }
        return row;
      })
    );
  };

  // Handle Tonnes change for a row (auto-calculates Pieces)
  const handleTonnesChange = (variantId: string, tonnesVal: string) => {
    const t = Math.max(0, parseFloat(tonnesVal) || 0);
    setCalcRows((prev) =>
      prev.map((row) => {
        if (row.variantId === variantId) {
          const pieces = t > 0 ? Math.round((t * 1000) / row.unitWeightKg) : 0;
          return { ...row, tonnes: t, pieces };
        }
        return row;
      })
    );
  };

  // Toggle row active/zero
  const handleToggleRow = (variantId: string) => {
    setCalcRows((prev) =>
      prev.map((row) => {
        if (row.variantId === variantId) {
          if (row.pieces > 0 || row.tonnes > 0) {
            return { ...row, pieces: 0, tonnes: 0 };
          } else {
            const p = 10;
            const tonnes = parseFloat(((p * row.unitWeightKg) / 1000).toFixed(3));
            return { ...row, pieces: p, tonnes };
          }
        }
        return row;
      })
    );
  };

  // Reset all quantities to 0
  const handleResetQuantities = () => {
    setCalcRows((prev) => prev.map((r) => ({ ...r, pieces: 0, tonnes: 0 })));
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const scrollToRequestForm = () => {
    setShowRequestForm(true);
    requestFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Submit simplified enquiry (Name, Phone, Pincode, Notes) - No Login Required
  const handleSubmitEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    if (totals.totalTonnes <= 0 && totals.totalPieces <= 0) {
      error('Please select at least one size quantity before requesting a quote.');
      return;
    }

    if (!formData.customerName.trim() || !formData.phone.trim()) {
      error('Please enter your Name and Phone Number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const breakdownText = totals.itemizedSummary
        .map((item) => `${item.name}: ${item.pieces} pcs (${item.tonnes} MT)`)
        .join(', ');

      const composedMessage = [
        formData.message ? `Customer Note: ${formData.message}` : '',
        `Delivery Pincode / Area: ${formData.pincode || 'Not specified'}`,
        `--- Selected Steel Requirement ---`,
        `Selected Sizes: ${breakdownText}`,
        `Total Weight: ${totals.totalTonnes} MT (${totals.totalKg} KG)`,
        `Estimated Price: ₹${totals.grandTotal.toLocaleString('en-IN')}`,
      ]
        .filter(Boolean)
        .join('\n');

      const res: any = await api.post('/enquiries', {
        customerName: formData.customerName,
        phone: formData.phone,
        location: formData.pincode ? `Pincode: ${formData.pincode}` : undefined,
        quantity: totals.totalTonnes > 0 ? totals.totalTonnes : null,
        unit: 'MT',
        productId: product.id,
        variantId: calcRows.find((r) => r.pieces > 0 || r.tonnes > 0)?.variantId || null,
        message: composedMessage,
        sourcePage: window.location.pathname,
      });

      const refNo = res.data?.enquiryNumber || 'ENQ-CONFIRMED';
      setSubmittedEnquiryNumber(refNo);
      success('Quotation request submitted! Our sales desk will call you shortly.');
    } catch (err: any) {
      error(err.message || 'Failed to submit quotation request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse">
          <div className="lg:col-span-7 space-y-6">
            <div className="h-[380px] bg-slate-200 rounded-2xl" />
            <div className="h-64 bg-slate-200 rounded-2xl" />
          </div>
          <div className="lg:col-span-5 space-y-6">
            <div className="h-56 bg-slate-200 rounded-2xl" />
            <div className="h-72 bg-slate-200 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-[#111814] mb-2">Product Not Found</h2>
        <p className="text-[#526458] text-sm mb-6">The requested steel product does not exist or has been removed.</p>
        <Link to="/products">
          <Button variant="primary">Return to Catalog</Button>
        </Link>
      </div>
    );
  }

  // Intelligent image fallbacks to high-res 3D studio renders
  const getProductFallbackImage = () => {
    const slugLower = (product.slug || '').toLowerCase();
    const catSlug = (product.category?.slug || '').toLowerCase();

    if (slugLower.includes('tmt') || catSlug.includes('tmt')) {
      return '/images/steel-items/tmt-steel-bars.jpg';
    }
    if (slugLower.includes('beam') || catSlug.includes('structural')) {
      return '/images/steel-items/structural-beams.jpg';
    }
    if (slugLower.includes('plate') || catSlug.includes('plate')) {
      return '/images/steel-items/ms-plates.jpg';
    }
    if (slugLower.includes('hollow') || catSlug.includes('pipe')) {
      return '/images/steel-items/hollow-sections.jpg';
    }
    return '/images/steel-items/tmt-steel-bars.jpg';
  };

  const defaultStudioImage = getProductFallbackImage();

  const galleryImages = [
    {
      id: 'studio-primary',
      imageUrl: defaultStudioImage,
      altText: product.name,
      isPrimary: true,
    },
    ...(product.images || []).map((img, idx) => ({
      id: img.id || `db-img-${idx}`,
      imageUrl: img.imageUrl,
      altText: img.altText || product.name,
      isPrimary: false,
    })),
  ];

  const currentImage = galleryImages[selectedImageIndex] || galleryImages[0];

  return (
    <div className="py-6 md:py-10 bg-[#F0F4F8] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-[#526458] mb-5 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-[#111814] transition font-medium">
            Home
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-[#111814] transition font-medium">
            Materials
          </Link>
          <span>/</span>
          {product.category && (
            <>
              <Link
                to={`/products?category=${product.category.slug}`}
                className="hover:text-[#111814] transition font-medium"
              >
                {product.category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-[#1D4ED8] font-bold truncate">{product.name}</span>
        </nav>

        {/* Top Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* LEFT MAIN COLUMN: Product Header, 3D Studio Image, SteelOnCall-style Interactive Size Selector */}
          <div className="lg:col-span-7 space-y-6">
            {/* Product Title Strip */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-5 items-start sm:items-center">
              {/* Product Thumbnail / 3D Image */}
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-gradient-to-b from-[#EFF6FF] to-[#DBEAFE] border border-blue-100 flex items-center justify-center p-2 shrink-0">
                <img
                  src={currentImage.imageUrl}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain drop-shadow-md hover:scale-105 transition-transform"
                />
              </div>

              {/* Overview Details */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  {product.category && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                      {product.category.name}
                    </span>
                  )}
                  {product.brand && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-800 text-white">
                      {product.brand.name}
                    </span>
                  )}
                </div>

                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight uppercase leading-tight font-sans">
                  {product.name}
                </h1>

                {product.primarySpecification && (
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-blue-700 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span>{product.primarySpecification}</span>
                  </div>
                )}

                <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                  {product.shortDescription || product.fullDescription}
                </p>

                <div className="mt-2.5 text-xs font-semibold text-slate-700">
                  Live Mill Dispatch Rate:{' '}
                  <span className="text-blue-700 font-extrabold text-sm font-mono">
                    ₹{baseRatePerMt.toLocaleString('en-IN')}/MT
                  </span>
                </div>
              </div>
            </div>

            {/* INTERACTIVE STEELONCALL-STYLE SIZE SELECTOR */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                    Select size
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Choose from various diameter & enter quantity
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleResetQuantities}
                  className="text-xs font-bold text-slate-500 hover:text-blue-600 flex items-center gap-1.5 self-start sm:self-center transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All</span>
                </button>
              </div>

              {/* SteelOnCall Size Rows */}
              <div className="space-y-3">
                {calcRows.map((row) => {
                  const isRowActive = row.pieces > 0 || row.tonnes > 0;

                  return (
                    <div
                      key={row.variantId}
                      className={`p-3.5 sm:p-4 rounded-xl transition-all ${
                        isRowActive
                          ? 'bg-white border-2 border-blue-600 shadow-md ring-1 ring-blue-600/20'
                          : 'bg-white border border-slate-200 hover:border-slate-300 shadow-xs'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        {/* Checkbox + Title */}
                        <div
                          onClick={() => handleToggleRow(row.variantId)}
                          className="flex items-center gap-3 cursor-pointer select-none"
                        >
                          <div
                            className={`w-5 h-5 rounded flex items-center justify-center transition-colors shrink-0 ${
                              isRowActive
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'border-2 border-slate-300 bg-white hover:border-blue-400'
                            }`}
                          >
                            {isRowActive && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>

                          <div>
                            <span className="font-bold text-sm sm:text-base text-slate-900">
                              {row.diameterOrSize} TMT Bars
                            </span>
                            <div className="text-[11px] text-slate-500">
                              Approx. {row.unitWeightKg} kg / pc (Standard 12m)
                            </div>
                          </div>
                        </div>

                        {/* Dual Inputs: [ Pieces ] or [ Tonnes ] */}
                        <div className="flex items-center gap-2.5 sm:gap-3 justify-end flex-wrap sm:flex-nowrap">
                          {/* Pieces Input */}
                          <div className="relative">
                            <input
                              type="number"
                              min="0"
                              value={row.pieces === 0 ? '' : row.pieces}
                              onChange={(e) => handlePiecesChange(row.variantId, e.target.value)}
                              placeholder="Enter Pieces"
                              className={`w-28 sm:w-32 text-left sm:text-center text-sm font-bold py-2 px-3 bg-white rounded-lg border outline-none transition focus:ring-2 focus:ring-blue-500 ${
                                isRowActive
                                  ? 'border-blue-500 text-slate-900'
                                  : 'border-slate-300 text-slate-700'
                              }`}
                            />
                            <span className="absolute right-2.5 top-2.5 text-[10px] text-slate-400 font-semibold pointer-events-none">
                              Pieces
                            </span>
                          </div>

                          {/* "or" separator exactly matching SteelOnCall */}
                          <span className="text-xs font-semibold text-slate-400">or</span>

                          {/* Tonnes Input */}
                          <div className="relative">
                            <input
                              type="number"
                              min="0"
                              step="0.001"
                              value={row.tonnes === 0 ? '' : row.tonnes}
                              onChange={(e) => handleTonnesChange(row.variantId, e.target.value)}
                              placeholder="Enter Tonnes"
                              className={`w-28 sm:w-32 text-left sm:text-center text-sm font-bold py-2 px-3 bg-white rounded-lg border outline-none transition focus:ring-2 focus:ring-blue-500 ${
                                isRowActive
                                  ? 'border-blue-500 text-slate-900'
                                  : 'border-slate-300 text-slate-700'
                              }`}
                            />
                            <span className="absolute right-2.5 top-2.5 text-[10px] text-slate-400 font-semibold pointer-events-none">
                              Tonnes
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Informative footer strip */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Price updated today from primary mills</span>
                </div>

                <div className="flex items-center gap-1.5 font-semibold text-blue-700">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Auto-calculated according to BIS IS 1786 specifications</span>
                </div>
              </div>
            </div>

            {/* Technical Parameters Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-700" />
                <h3 className="text-base font-bold text-slate-900 uppercase tracking-tight">
                  Technical Specifications & Compliance
                </h3>
              </div>

              {product.specifications && product.specifications.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.specifications.map((spec) => (
                    <div
                      key={spec.id}
                      className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                    >
                      <span className="text-slate-600 font-semibold">{spec.specKey}</span>
                      <span className="text-slate-900 font-bold">{spec.specValue}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">Certified factory test reports provided with every batch.</p>
              )}
            </div>
          </div>

          {/* RIGHT STICKY COLUMN: Best Price Estimator Card + Simple 4-Field Request Form */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-20">
            {/* 1. BEST PRICE ESTIMATOR CARD (MODELED DIRECTLY AFTER STEELONCALL) */}
            <div className="rounded-2xl bg-white border-2 border-blue-600 shadow-xl overflow-hidden">
              {/* Header Strip with SteelOnCall Style Blue/Orange Badge */}
              <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-5 text-white flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase font-bold tracking-widest text-blue-200 block">
                    SteelOnCall Benchmark
                  </span>
                  <h3 className="text-xl font-black tracking-tight">
                    Best Price Estimator
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-blue-200 block uppercase font-bold">Base Rate</span>
                  <span className="text-base font-black font-mono">
                    ₹{baseRatePerMt.toLocaleString('en-IN')}/MT
                  </span>
                </div>
              </div>

              {/* Price Details */}
              <div className="p-5 sm:p-6 space-y-4">
                {/* Weight & Total Quantity Pills */}
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-blue-50/70 border border-blue-200">
                  <div>
                    <span className="text-xs font-semibold text-slate-600 block">Total Weight</span>
                    <span className="text-xl font-black text-blue-800">
                      {totals.totalTonnes > 0 ? `${totals.totalTonnes} MT` : '0.000 MT'}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      ({totals.totalKg.toLocaleString('en-IN')} KG)
                    </span>
                  </div>
                  <div className="border-l border-blue-200 pl-3">
                    <span className="text-xs font-semibold text-slate-600 block">Total Pieces</span>
                    <span className="text-xl font-black text-slate-900">
                      {totals.totalPieces.toLocaleString('en-IN')} Pcs
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      Across {totals.itemizedSummary.length} selected size(s)
                    </span>
                  </div>
                </div>

                {/* Selected Items Breakdown List */}
                {totals.itemizedSummary.length > 0 && (
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Selected Breakdown:
                    </span>
                    {totals.itemizedSummary.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between text-xs py-1.5 px-3 rounded-lg bg-slate-50 border border-slate-100 text-slate-900"
                      >
                        <span className="font-bold truncate">{item.name}</span>
                        <span className="font-mono text-blue-700 font-extrabold shrink-0 ml-2">
                          {item.pieces} pcs • {item.tonnes} MT
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Subtotal & GST */}
                <div className="space-y-2 pt-2 border-t border-slate-200 text-sm">
                  <div className="flex justify-between text-slate-600 text-xs sm:text-sm">
                    <span>Subtotal ({totals.totalTonnes} MT × ₹{baseRatePerMt.toLocaleString('en-IN')})</span>
                    <span className="font-semibold text-slate-900 font-mono">
                      ₹{totals.subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-600 text-xs sm:text-sm">
                    <span>GST ({totals.gstPercent}%)</span>
                    <span className="font-semibold text-slate-900 font-mono">
                      ₹{totals.gstAmount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* PROMINENT TOTAL ESTIMATION PRICE */}
                  <div className="pt-3 border-t-2 border-slate-200 flex items-baseline justify-between bg-blue-50/40 -mx-5 -mb-2 px-5 py-3 rounded-b-xl">
                    <div>
                      <span className="text-xs uppercase font-bold text-slate-500 block">
                        Total Estimation Price:
                      </span>
                      <span className="text-[10px] text-slate-400">
                        (Inclusive of 18% GST)
                      </span>
                    </div>
                    <span className="text-2xl sm:text-3xl font-black text-blue-700 font-sans tracking-tight">
                      ₹{totals.grandTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Request CTA Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={scrollToRequestForm}
                    className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    <span>Request This Item</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* 2. SIMPLE 4-FIELD REQUEST FORM (BUILT FOR CONVENIENCE - NO LOGIN) */}
            <div
              ref={requestFormRef}
              className="rounded-2xl bg-white border border-slate-200 shadow-md p-5 sm:p-6 space-y-4"
            >
              {submittedEnquiryNumber ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-14 h-14 bg-emerald-100 border border-emerald-300 rounded-full flex items-center justify-center mx-auto text-emerald-700">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">Request Sent Successfully!</h3>
                    <p className="text-sm font-mono text-emerald-700 font-extrabold mt-1">
                      Enquiry Ref: {submittedEnquiryNumber}
                    </p>
                  </div>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                    Our sales team received your order estimation for <strong>{totals.totalTonnes} MT</strong> of {product.name}. We will call you directly to confirm delivery.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setSubmittedEnquiryNumber(null)}
                    className="w-full text-xs font-bold"
                  >
                    Send Another Request
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmitEnquiry} className="space-y-3.5">
                  <div className="border-b border-slate-100 pb-2">
                    <h3 className="text-base font-black text-slate-900 tracking-tight">
                      Quick Order Request
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Enter your phone number & address below. Our team will call you back.
                    </p>
                  </div>

                  {/* Field 1: Name */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-blue-600" />
                      <span>Your Name *</span>
                    </label>
                    <input
                      name="customerName"
                      type="text"
                      placeholder="Enter your name"
                      required
                      value={formData.customerName}
                      onChange={handleFormChange}
                      className="w-full py-2.5 px-3 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-slate-50/50"
                    />
                  </div>

                  {/* Field 2: Phone Number */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-blue-600" />
                      <span>Phone Number *</span>
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      placeholder="e.g. 9876543210"
                      required
                      value={formData.phone}
                      onChange={handleFormChange}
                      className="w-full py-2.5 px-3 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-slate-50/50"
                    />
                  </div>

                  {/* Field 3: Pincode */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      <span>Delivery Pincode / Area *</span>
                    </label>
                    <input
                      name="pincode"
                      type="text"
                      placeholder="e.g. 400001 or City name"
                      required
                      value={formData.pincode}
                      onChange={handleFormChange}
                      className="w-full py-2.5 px-3 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-slate-50/50"
                    />
                  </div>

                  {/* Field 4: Notes */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                      <span>Notes (Optional)</span>
                    </label>
                    <textarea
                      name="message"
                      rows={2}
                      placeholder="Any specific delivery instructions or questions..."
                      value={formData.message}
                      onChange={handleFormChange}
                      className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-slate-50/50 resize-none"
                    />
                  </div>

                  {/* Big Action Button */}
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full py-3.5 text-sm font-black bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-md transition-all rounded-xl"
                    isLoading={isSubmitting}
                  >
                    Confirm & Send Request
                  </Button>
                </form>
              )}
            </div>

            {/* 3. TALK TO A STEEL EXPERT & WHATSAPP (EXACTLY AS STEELONCALL) */}
            <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Talk to a Steel Expert</h4>
                  <p className="text-xs text-slate-500">For today’s price and bulk discount</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                  <PhoneCall className="w-4 h-4" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <a
                  href="tel:+919876543210"
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call 1800-833-2929</span>
                </a>

                <a
                  href={`https://api.whatsapp.com/send/?phone=919876543210&text=${encodeURIComponent(
                    `Hello Steels, I need an expert quote for ${product.name} (Estimated ${totals.totalTonnes} MT).`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold transition shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Complementary Products */}
        {product.relatedProducts && product.relatedProducts.length > 0 && (
          <div className="mt-16 pt-10 border-t border-slate-200">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight mb-6">
              More Steel Materials
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {product.relatedProducts.map((rel) => {
                const imgUrl =
                  rel.images?.[0]?.imageUrl ||
                  '/images/steel-items/tmt-steel-bars.jpg';

                return (
                  <Link
                    key={rel.id}
                    to={`/products/${rel.slug}`}
                    className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 transition group flex flex-col shadow-sm"
                  >
                    <div className="h-36 rounded-xl overflow-hidden mb-3 bg-gradient-to-b from-[#EFF6FF] to-[#DBEAFE] p-3 flex items-center justify-center">
                      <img
                        src={imgUrl}
                        alt={rel.name}
                        className="max-h-full max-w-full object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors uppercase line-clamp-1">
                      {rel.name}
                    </h4>
                    <span className="text-xs text-blue-600 font-bold mt-2 inline-flex items-center gap-1">
                      <span>View & Estimate</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </span>
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
