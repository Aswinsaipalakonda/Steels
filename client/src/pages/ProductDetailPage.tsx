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
} from 'lucide-react';

// Official authentic WhatsApp Logo SVG
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

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
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    pincode: '',
    message: '',
  });

  const [formErrors, setFormErrors] = useState<{
    customerName?: string;
    phone?: string;
    pincode?: string;
  }>({});

  const [touched, setTouched] = useState<{
    customerName?: boolean;
    phone?: boolean;
    pincode?: boolean;
  }>({});

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

          // Initialize size rows from variants with 0 quantity (user selects on demand)
          if (prodData.variants && prodData.variants.length > 0) {
            const initialRows: SizeCalculationRow[] = prodData.variants.map((v) => {
              const unitWeight = deriveUnitWeight(v, prodData);
              const label = v.diameter || v.size || v.thickness || v.name;

              return {
                variantId: v.id,
                name: v.name || `${label} ${v.grade || ''}`.trim(),
                diameterOrSize: label,
                grade: v.grade || undefined,
                unitWeightKg: unitWeight,
                lengthMeters: 12,
                pieces: 0,
                tonnes: 0,
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

  // Validation functions
  const validateField = (name: string, value: string) => {
    let errorMsg = '';
    if (name === 'customerName') {
      if (!value.trim()) {
        errorMsg = 'Full name is required.';
      } else if (value.trim().length < 2) {
        errorMsg = 'Name must be at least 2 characters.';
      }
    } else if (name === 'phone') {
      const cleanPhone = value.replace(/\D/g, '');
      if (!cleanPhone) {
        errorMsg = 'Mobile number is required.';
      } else if (cleanPhone.length !== 10) {
        errorMsg = 'Please enter a valid 10-digit mobile number.';
      } else if (!/^[6-9]/.test(cleanPhone)) {
        errorMsg = 'Mobile number should begin with 6, 7, 8, or 9.';
      }
    } else if (name === 'pincode') {
      const cleanPin = value.replace(/\D/g, '');
      if (!cleanPin) {
        errorMsg = 'Delivery pincode is required.';
      } else if (cleanPin.length !== 6) {
        errorMsg = 'Pincode must be exactly 6 digits.';
      }
    }
    return errorMsg;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({ ...prev, customerName: val }));
    if (touched.customerName) {
      setFormErrors((prev) => ({ ...prev, customerName: validateField('customerName', val) }));
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits up to 10 characters
    const numericOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData((prev) => ({ ...prev, phone: numericOnly }));
    if (touched.phone) {
      setFormErrors((prev) => ({ ...prev, phone: validateField('phone', numericOnly) }));
    }
  };

  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits up to 6 characters
    const numericOnly = e.target.value.replace(/\D/g, '').slice(0, 6);
    setFormData((prev) => ({ ...prev, pincode: numericOnly }));
    if (touched.pincode) {
      setFormErrors((prev) => ({ ...prev, pincode: validateField('pincode', numericOnly) }));
    }
  };

  const handleBlur = (field: 'customerName' | 'phone' | 'pincode') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setFormErrors((prev) => ({
      ...prev,
      [field]: validateField(field, formData[field]),
    }));
  };

  const scrollToRequestForm = () => {
    requestFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Submit simplified enquiry with strict validation
  const handleSubmitEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    // Trigger all validation
    const nameErr = validateField('customerName', formData.customerName);
    const phoneErr = validateField('phone', formData.phone);
    const pinErr = validateField('pincode', formData.pincode);

    setTouched({ customerName: true, phone: true, pincode: true });
    setFormErrors({ customerName: nameErr, phone: phoneErr, pincode: pinErr });

    if (nameErr || phoneErr || pinErr) {
      error(nameErr || phoneErr || pinErr || 'Please fill in the required fields correctly.');
      return;
    }

    if (totals.totalTonnes <= 0 && totals.totalPieces <= 0) {
      error('Please select at least one steel size & quantity before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      const breakdownText = totals.itemizedSummary
        .map((item) => `${item.name}: ${item.pieces} pcs (${item.tonnes} MT)`)
        .join(', ');

      const composedMessage = [
        formData.message ? `Customer Note: ${formData.message}` : '',
        `Delivery Pincode: ${formData.pincode}`,
        `--- Selected Steel Requirement ---`,
        `Selected Sizes: ${breakdownText}`,
        `Total Weight: ${totals.totalTonnes} MT (${totals.totalKg} KG)`,
        `Estimated Quotation Total: ₹${totals.grandTotal.toLocaleString('en-IN')}`,
      ]
        .filter(Boolean)
        .join('\n');

      const res: any = await api.post('/enquiries', {
        customerName: formData.customerName.trim(),
        phone: formData.phone.trim(),
        location: `Pincode: ${formData.pincode.trim()}`,
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
            <div className="h-[380px] bg-emerald-100/40 rounded-2xl" />
            <div className="h-64 bg-emerald-100/30 rounded-2xl" />
          </div>
          <div className="lg:col-span-5 space-y-6">
            <div className="h-56 bg-emerald-100/40 rounded-2xl" />
            <div className="h-72 bg-emerald-100/30 rounded-2xl" />
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
    <div className="py-6 md:py-10 bg-[#F4F7F5] min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-[#526458] mb-5 overflow-x-auto whitespace-nowrap font-sans">
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
          <span className="text-[#07552B] font-bold truncate">{product.name}</span>
        </nav>

        {/* Top Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* LEFT MAIN COLUMN: Product Header, 3D Studio Image, Interactive Size Selector */}
          <div className="lg:col-span-7 space-y-6">
            {/* Product Title Strip - Clean & Modern (No raw rate highlighting) */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#D0DDD4] shadow-sm flex flex-col sm:flex-row gap-5 items-start sm:items-center">
              {/* Product Thumbnail / 3D Image */}
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-gradient-to-b from-[#EBF3ED] to-[#D8E6DB] border border-[#D0DDD4] flex items-center justify-center p-2.5 shrink-0 shadow-2xs">
                <img
                  src={currentImage.imageUrl}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain drop-shadow-md hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Overview Details */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {product.category && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#EBF3ED] text-[#07552B] border border-[#D0DDD4]">
                      {product.category.name}
                    </span>
                  )}
                  {product.brand && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#07552B] text-white">
                      {product.brand.name}
                    </span>
                  )}
                </div>

                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#111814] tracking-tight uppercase leading-snug">
                  {product.name}
                </h1>

                {product.primarySpecification && (
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs text-[#07552B] font-bold">
                    <ShieldCheck className="w-4 h-4 shrink-0 text-[#07552B]" />
                    <span>{product.primarySpecification}</span>
                  </div>
                )}

                <p className="text-xs sm:text-sm text-[#526458] mt-2 line-clamp-2 leading-relaxed">
                  {product.shortDescription || product.fullDescription}
                </p>

                {/* Reassurance Tags */}
                <div className="mt-3 flex flex-wrap items-center gap-2 pt-2 border-t border-[#EBF3ED]">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#07552B] bg-[#EBF3ED] px-2.5 py-1 rounded-full border border-[#D0DDD4]">
                    <CheckCircle2 className="w-3 h-3 text-[#07552B]" />
                    <span>Direct Mill Dispatch</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#526458] bg-[#F4F7F5] px-2.5 py-1 rounded-full border border-[#D0DDD4]">
                    <Clock className="w-3 h-3 text-[#07552B]" />
                    <span>Same-Day Quotation</span>
                  </span>
                </div>
              </div>
            </div>

            {/* INTERACTIVE SIZE SELECTOR */}
            <div className="bg-white border border-[#D0DDD4] rounded-2xl p-4 sm:p-7 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2EBE5]">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#111814] tracking-tight">
                    Select size
                  </h2>
                  <p className="text-xs text-[#526458] mt-0.5">
                    Choose from various diameters & enter your required quantity
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleResetQuantities}
                  className="px-3.5 py-1.5 rounded-full bg-[#F4F7F5] hover:bg-[#E2EBE5] text-xs font-bold text-[#07552B] hover:text-[#03281A] border border-[#D0DDD4] flex items-center gap-1.5 self-start sm:self-center transition shadow-2xs cursor-pointer active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All</span>
                </button>
              </div>

              {/* Steel Size Rows - Fully Responsive Layout */}
              <div className="space-y-3">
                {calcRows.map((row) => {
                  const isRowActive = row.pieces > 0 || row.tonnes > 0;

                  return (
                    <div
                      key={row.variantId}
                      className={`p-3.5 sm:p-4 rounded-2xl transition-all duration-200 ${
                        isRowActive
                          ? 'bg-[#F4F9F6] border-2 border-[#07552B] shadow-sm ring-1 ring-[#07552B]/15'
                          : 'bg-white border border-[#D0DDD4] hover:border-[#07552B]/40 shadow-2xs'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                        {/* Checkbox + Title */}
                        <div
                          onClick={() => handleToggleRow(row.variantId)}
                          className="flex items-center gap-3 cursor-pointer select-none flex-1 min-w-0"
                        >
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors shrink-0 ${
                              isRowActive
                                ? 'bg-[#07552B] text-white shadow-xs'
                                : 'border-2 border-[#CBD5E1] bg-white hover:border-[#07552B]'
                            }`}
                          >
                            {isRowActive && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>

                          <div className="min-w-0">
                            <span className="font-bold text-sm sm:text-base text-[#111814] block truncate">
                              {row.diameterOrSize} TMT Bars
                            </span>
                            <div className="text-[11px] text-[#526458] flex items-center gap-1">
                              <span>Approx.</span>
                              <span className="font-numbers font-semibold text-[#111814]">{row.unitWeightKg}</span>
                              <span>kg / pc (Standard 12m)</span>
                            </div>
                          </div>
                        </div>

                        {/* Dual Inputs: [ Pieces ] or [ Tonnes ] */}
                        <div className="flex items-center gap-2 sm:gap-2.5 justify-between sm:justify-end w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E2EBE5]">
                          {/* Pieces Input */}
                          <div className="relative flex-1 sm:flex-initial flex items-center">
                            <input
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              value={row.pieces === 0 ? '' : row.pieces}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '');
                                handlePiecesChange(row.variantId, val);
                              }}
                              placeholder="0"
                              className={`w-full sm:w-32 text-left pl-3.5 pr-11 py-2 font-numbers font-bold text-base bg-white rounded-xl border outline-none transition focus:ring-2 focus:ring-[#07552B] ${
                                isRowActive
                                  ? 'border-[#07552B] text-[#111814]'
                                  : 'border-[#CBD5E1] text-[#111814]'
                              }`}
                            />
                            <span className="absolute right-3 font-sans text-xs text-[#526458] font-bold pointer-events-none select-none">
                              pcs
                            </span>
                          </div>

                          {/* "or" separator */}
                          <span className="text-xs font-semibold text-[#94A3B8] px-1 shrink-0 font-sans">
                            or
                          </span>

                          {/* Tonnes Input */}
                          <div className="relative flex-1 sm:flex-initial flex items-center">
                            <input
                              type="text"
                              inputMode="decimal"
                              value={row.tonnes === 0 ? '' : row.tonnes}
                              onChange={(e) => {
                                const val = e.target.value.replace(/[^0-9.]/g, '');
                                const parts = val.split('.');
                                const formatted = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : val;
                                handleTonnesChange(row.variantId, formatted);
                              }}
                              placeholder="0.000"
                              className={`w-full sm:w-32 text-left pl-3.5 pr-11 py-2 font-numbers font-bold text-base bg-white rounded-xl border outline-none transition focus:ring-2 focus:ring-[#07552B] ${
                                isRowActive
                                  ? 'border-[#07552B] text-[#111814]'
                                  : 'border-[#CBD5E1] text-[#111814]'
                              }`}
                            />
                            <span className="absolute right-3 font-sans text-xs text-[#526458] font-bold pointer-events-none select-none">
                              MT
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Informative footer strip */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-[#526458] pt-3 border-t border-[#E2EBE5]">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#07552B] shrink-0" />
                  <span>Daily updated rates from primary steel mills</span>
                </div>

                <div className="flex items-center gap-1.5 font-semibold text-[#07552B]">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Auto-calculated according to BIS IS 1786 specifications</span>
                </div>
              </div>
            </div>

            {/* Technical Parameters Card */}
            <div className="bg-white border border-[#D0DDD4] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
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
                      className="flex justify-between p-3 rounded-xl bg-[#F7FAF8] border border-[#E2EBE5] text-xs"
                    >
                      <span className="text-[#526458] font-semibold">{spec.specKey}</span>
                      <span className="text-[#111814] font-bold">{spec.specValue}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#526458]">Certified factory test reports provided with every batch.</p>
              )}
            </div>
          </div>

          {/* RIGHT STICKY COLUMN: Estimated Price Calculator + Simple 4-Field Request Form */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-20">
            {/* 1. ESTIMATED PRICE CALCULATOR CARD */}
            <div className="rounded-2xl bg-white border-2 border-[#07552B] shadow-xl overflow-hidden">
              {/* Header Strip - Clean and Focused (No base rate highlighting) */}
              <div className="bg-gradient-to-r from-[#03281A] via-[#07552B] to-[#02150C] p-5 text-white">
                <span className="text-[11px] uppercase font-bold tracking-widest text-[#A7F3D0] block">
                  Indicative Rate Engine
                </span>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight mt-0.5">
                  Estimated Price Calculator
                </h3>
              </div>

              {/* Price Details */}
              <div className="p-5 sm:p-6 space-y-4">
                {/* Weight & Total Quantity Pills */}
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-[#EBF3ED] border border-[#D0DDD4]">
                  <div>
                    <span className="text-xs font-semibold text-[#526458] block">Estimated Weight</span>
                    <span className="text-xl sm:text-2xl font-bold font-numbers text-[#07552B] block mt-0.5">
                      {totals.totalTonnes > 0 ? `${totals.totalTonnes} MT` : '0.000 MT'}
                    </span>
                    <span className="text-[11px] text-[#526458] block font-numbers font-medium">
                      ({totals.totalKg.toLocaleString('en-IN')} KG)
                    </span>
                  </div>
                  <div className="border-l border-[#D0DDD4] pl-3.5">
                    <span className="text-xs font-semibold text-[#526458] block">Total Pieces</span>
                    <span className="text-xl sm:text-2xl font-bold font-numbers text-[#111814] block mt-0.5">
                      {totals.totalPieces.toLocaleString('en-IN')} Pcs
                    </span>
                    <span className="text-[11px] text-[#526458] block">
                      Across <span className="font-numbers font-bold">{totals.itemizedSummary.length}</span> selected size(s)
                    </span>
                  </div>
                </div>

                {/* Selected Items Breakdown List or Prompt */}
                {totals.itemizedSummary.length > 0 ? (
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    <span className="text-[11px] font-bold text-[#526458] uppercase tracking-wider block">
                      Selected Breakdown:
                    </span>
                    {totals.itemizedSummary.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center text-xs py-2 px-3 rounded-xl bg-[#F7FAF8] border border-[#E2EBE5] text-[#111814]"
                      >
                        <span className="font-bold truncate">{item.name}</span>
                        <span className="font-numbers text-[#07552B] font-bold text-sm shrink-0 ml-2">
                          {item.pieces} pcs • {item.tonnes} MT
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-3.5 px-3.5 rounded-xl bg-[#F8FAF7] border border-dashed border-[#D0DDD4] text-center">
                    <p className="text-xs text-[#526458] font-medium leading-relaxed">
                      👉 Select one or more sizes on the left to calculate your instant estimated price.
                    </p>
                  </div>
                )}

                {/* Subtotal & GST */}
                <div className="space-y-2 pt-2 border-t border-[#E2EBE5] text-sm">
                  <div className="flex justify-between items-center text-[#526458] text-xs sm:text-sm">
                    <span>Estimated Material Subtotal ({totals.totalTonnes} MT)</span>
                    <span className="font-numbers font-bold text-base text-[#111814]">
                      ₹{totals.subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[#526458] text-xs sm:text-sm">
                    <span>Est. GST ({totals.gstPercent}%)</span>
                    <span className="font-numbers font-bold text-base text-[#111814]">
                      ₹{totals.gstAmount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* PROMINENT TOTAL ESTIMATION PRICE */}
                  <div className="pt-3 border-t-2 border-[#E2EBE5] flex items-baseline justify-between bg-[#EBF3ED]/60 -mx-5 -mb-2 px-5 py-3.5 rounded-b-2xl">
                    <div>
                      <span className="text-xs uppercase font-bold text-[#526458] block">
                        TOTAL ESTIMATED PRICE:
                      </span>
                      <span className="text-[10px] text-[#526458]">
                        (Approx. incl. 18% GST)
                      </span>
                    </div>
                    <span className="text-3xl sm:text-4xl font-bold font-numbers text-[#07552B] tracking-tight">
                      ₹{totals.grandTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Price Disclaimer */}
                <p className="text-[11px] text-[#526458] leading-relaxed pt-1">
                  * Note: All prices are estimated indicative rates. Binding quote with custom freight & mill volume discounts will be confirmed upon enquiry submission.
                </p>

                {/* Request CTA Button (Pill Rounded) */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={scrollToRequestForm}
                    className="w-full py-3.5 px-6 rounded-full bg-[#07552B] hover:bg-[#03281A] active:scale-[0.99] text-white font-extrabold text-sm sm:text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Request This Item</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* 2. SIMPLE 4-FIELD REQUEST FORM WITH STRICT VALIDATION */}
            <div
              ref={requestFormRef}
              className="rounded-2xl bg-white border border-[#D0DDD4] shadow-md p-5 sm:p-6 space-y-4"
            >
              {submittedEnquiryNumber ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-14 h-14 bg-[#EBF3ED] border border-[#D0DDD4] rounded-full flex items-center justify-center mx-auto text-[#07552B]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#111814]">Request Sent Successfully!</h3>
                    <p className="text-sm font-numbers text-[#07552B] font-bold mt-1">
                      Enquiry Ref: {submittedEnquiryNumber}
                    </p>
                  </div>
                  <p className="text-xs text-[#526458] max-w-sm mx-auto leading-relaxed">
                    Our sales team received your order estimation for <strong className="font-numbers">{totals.totalTonnes} MT</strong> of {product.name}. We will call you directly to confirm delivery.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setSubmittedEnquiryNumber(null)}
                    className="w-full text-xs font-bold rounded-full py-3"
                  >
                    Send Another Request
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmitEnquiry} className="space-y-3.5" noValidate>
                  <div className="border-b border-[#E2EBE5] pb-2">
                    <h3 className="text-base font-black text-[#111814] tracking-tight">
                      Quick Order Request
                    </h3>
                    <p className="text-xs text-[#526458] mt-0.5">
                      Enter your phone number & address below. Our team will call you back.
                    </p>
                  </div>

                  {/* Field 1: Name */}
                  <div>
                    <label className="text-xs font-bold text-[#111814] mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#07552B]" />
                        <span>Your Name *</span>
                      </span>
                      {touched.customerName && formErrors.customerName && (
                        <span className="text-[11px] font-semibold text-red-600">
                          {formErrors.customerName}
                        </span>
                      )}
                    </label>
                    <input
                      name="customerName"
                      type="text"
                      placeholder="Enter your full name"
                      required
                      value={formData.customerName}
                      onChange={handleNameChange}
                      onBlur={() => handleBlur('customerName')}
                      className={`w-full py-2.5 px-3.5 rounded-xl border text-sm font-medium outline-none transition bg-[#F7FAF8] ${
                        touched.customerName && formErrors.customerName
                          ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                          : 'border-[#D0DDD4] focus:ring-2 focus:ring-[#07552B]'
                      }`}
                    />
                  </div>

                  {/* Field 2: Phone Number */}
                  <div>
                    <label className="text-xs font-bold text-[#111814] mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#07552B]" />
                        <span>Phone Number (10 Digits) *</span>
                      </span>
                      {touched.phone && formErrors.phone && (
                        <span className="text-[11px] font-semibold text-red-600">
                          {formErrors.phone}
                        </span>
                      )}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#526458] pointer-events-none">
                        +91
                      </span>
                      <input
                        name="phone"
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        placeholder="Enter your 10-digit mobile number"
                        required
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        onBlur={() => handleBlur('phone')}
                        className={`w-full py-2.5 pl-12 pr-3.5 rounded-xl border text-sm font-bold font-numbers text-[#111814] outline-none transition bg-[#F7FAF8] ${
                          touched.phone && formErrors.phone
                            ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                            : 'border-[#D0DDD4] focus:ring-2 focus:ring-[#07552B]'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Field 3: Pincode */}
                  <div>
                    <label className="text-xs font-bold text-[#111814] mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#07552B]" />
                        <span>Delivery Pincode (6 Digits) *</span>
                      </span>
                      {touched.pincode && formErrors.pincode && (
                        <span className="text-[11px] font-semibold text-red-600">
                          {formErrors.pincode}
                        </span>
                      )}
                    </label>
                    <input
                      name="pincode"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="Enter 6-digit delivery pincode"
                      required
                      value={formData.pincode}
                      onChange={handlePincodeChange}
                      onBlur={() => handleBlur('pincode')}
                      className={`w-full py-2.5 px-3.5 rounded-xl border text-sm font-medium font-numbers font-bold outline-none transition bg-[#F7FAF8] ${
                        touched.pincode && formErrors.pincode
                          ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                          : 'border-[#D0DDD4] focus:ring-2 focus:ring-[#07552B]'
                      }`}
                    />
                  </div>

                  {/* Field 4: Notes */}
                  <div>
                    <label className="text-xs font-bold text-[#111814] mb-1 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-[#07552B]" />
                      <span>Notes (Optional)</span>
                    </label>
                    <textarea
                      name="message"
                      rows={2}
                      maxLength={500}
                      placeholder="Enter any specific delivery instructions, cut lengths, or notes..."
                      value={formData.message}
                      onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                      className="w-full py-2 px-3.5 rounded-xl border border-[#D0DDD4] text-xs font-medium focus:ring-2 focus:ring-[#07552B] focus:border-transparent outline-none bg-[#F7FAF8] resize-none"
                    />
                  </div>

                  {/* Big Action Button (Pill Rounded) */}
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full py-3.5 text-sm font-black bg-[#07552B] hover:bg-[#03281A] text-white shadow-md transition-all rounded-full"
                    isLoading={isSubmitting}
                  >
                    Confirm & Send Request
                  </Button>
                </form>
              )}
            </div>

            {/* 3. TALK TO A STEEL EXPERT & WHATSAPP (PILL ROUNDED BUTTONS) */}
            <div className="rounded-2xl bg-white border border-[#D0DDD4] shadow-sm p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#111814]">Talk to a Steel Expert</h4>
                  <p className="text-xs text-[#526458]">For today’s price and bulk discount</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-[#EBF3ED] flex items-center justify-center text-[#07552B]">
                  <PhoneCall className="w-4 h-4" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <a
                  href="tel:+919876543210"
                  className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#07552B] hover:bg-[#03281A] text-white text-xs font-bold transition shadow-xs active:scale-[0.98]"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span className="font-sans">Call 1800-833-2929</span>
                </a>

                <a
                  href={`https://api.whatsapp.com/send/?phone=919876543210&text=${encodeURIComponent(
                    `Hello Steels, I need an expert quote for ${product.name} (Estimated ${totals.totalTonnes} MT).`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold transition shadow-xs active:scale-[0.98]"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span className="font-sans">Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Complementary Products */}
        {product.relatedProducts && product.relatedProducts.length > 0 && (
          <div className="mt-16 pt-10 border-t border-[#E2EBE5]">
            <h3 className="text-xl sm:text-2xl font-black text-[#111814] uppercase tracking-tight mb-6">
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
                    className="p-4 rounded-2xl bg-white border border-[#D0DDD4] hover:border-[#07552B] transition group flex flex-col shadow-sm"
                  >
                    <div className="h-36 rounded-xl overflow-hidden mb-3 bg-gradient-to-b from-[#EBF3ED] to-[#D8E6DB] p-3 flex items-center justify-center">
                      <img
                        src={imgUrl}
                        alt={rel.name}
                        className="max-h-full max-w-full object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="font-bold text-sm text-[#111814] group-hover:text-[#07552B] transition-colors uppercase line-clamp-1">
                      {rel.name}
                    </h4>
                    <span className="text-xs text-[#07552B] font-bold mt-2 inline-flex items-center gap-1">
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

