import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { useToast } from '../context/ToastContext';
import api from '../lib/api';
import { CheckCircle2, ShieldCheck, Truck, Scale, FileText } from 'lucide-react';

export const RequestQuotePage: React.FC = () => {
  const { success, error } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    company: '',
    location: '',
    productCategory: 'TMT Rebars',
    quantity: '25',
    unit: 'MT',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res: any = await api.post('/enquiries', {
        ...formData,
        quantity: formData.quantity ? parseFloat(formData.quantity) : null,
        message: `[Category: ${formData.productCategory}] ${formData.message}`,
        sourcePage: '/quote',
      });

      setSubmittedRef(res.data?.enquiryNumber || 'ENQ-CONFIRMED');
      success('Your quotation request has been submitted successfully!');
    } catch (err: any) {
      error(err.message || 'Failed to submit quote request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-14 bg-steel-darkest min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Context & Guarantees (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block mb-2">
                Rapid Commercial Pricing
              </span>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase leading-tight font-sans">
                Request a Steel Quotation
              </h1>
              <p className="text-sm text-steel-olive mt-3 leading-relaxed">
                Submit your commercial steel bill of quantities. Our technical sales estimators calculate direct mill dispatch pricing with certified weighbridge and freight optimization.
              </p>
            </div>

            <div className="space-y-4 pt-4">
              <div className="p-4 rounded-xl bg-steel-forest/60 border border-steel-rich flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-steel-primary text-emerald-400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase">Direct Mill Rates</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Official primary producer pricing from Tata Tiscon, JSW Steel, and SAIL without intermediary broker overheads.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-steel-forest/60 border border-steel-rich flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-steel-primary text-emerald-400 shrink-0">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase">Computerized Weighbridge Slip</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Guaranteed gross and tare electronic weighment slips accompanying every trailer dispatch.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-steel-forest/60 border border-steel-rich flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-steel-primary text-emerald-400 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase">Original Test Certificates (MTC)</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Heat number and batch matched physical & chemical Mill Test Certificates with every delivery.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl bg-steel-forest/80 border border-steel-accent/40 shadow-2xl">
              {submittedRef ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-emerald-900/40 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-1">Quotation Request Registered</h2>
                  <p className="text-sm font-mono text-emerald-400 mb-4">Reference Number: {submittedRef}</p>
                  <p className="text-sm text-steel-olive max-w-md mx-auto mb-8">
                    Thank you, <span className="text-white font-semibold">{formData.customerName}</span>. A commercial quotation is being compiled by our estimating team and will be emailed to <span className="text-white">{formData.email}</span>.
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setSubmittedRef(null);
                    }}
                  >
                    Submit Another Requirement
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-lg font-bold text-white uppercase tracking-tight mb-2">
                    Project Steel Requirements
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select
                      label="Product Category"
                      name="productCategory"
                      value={formData.productCategory}
                      onChange={handleChange}
                    >
                      <option value="TMT Rebars">TMT Rebars (Fe 500D / 550D)</option>
                      <option value="Structural Steel">Structural Beams & Channels (ISMB/ISMC)</option>
                      <option value="Steel Plates & Coils">Hot Rolled MS Plates</option>
                      <option value="Pipes & Hollow Sections">Hollow Sections (SHS/RHS)</option>
                      <option value="Mixed Project Steel Bill">Mixed Structural & Rebar Bill</option>
                    </Select>

                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        label="Est. Quantity"
                        name="quantity"
                        type="number"
                        step="any"
                        placeholder="e.g. 50"
                        required
                        value={formData.quantity}
                        onChange={handleChange}
                      />
                      <Select label="Unit" name="unit" value={formData.unit} onChange={handleChange}>
                        <option value="MT">Metric Tons (MT)</option>
                        <option value="KG">KG</option>
                        <option value="PCS">Pieces</option>
                        <option value="Bundles">Bundles</option>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Contact Person Name"
                      name="customerName"
                      placeholder="e.g. Anand Deshmukh"
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Business Email"
                      name="email"
                      type="email"
                      placeholder="purchasing@company.com"
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                    <Input
                      label="Company / Contracting Entity"
                      name="company"
                      placeholder="e.g. Deshmukh Civil Projects LLP"
                      value={formData.company}
                      onChange={handleChange}
                    />
                  </div>

                  <Input
                    label="Project Delivery Site / City"
                    name="location"
                    placeholder="e.g. Navi Mumbai Airport Logistics Hub, Sector 12"
                    required
                    value={formData.location}
                    onChange={handleChange}
                  />

                  <Textarea
                    label="Detailed Steel Specifications / Cut Lengths"
                    name="message"
                    placeholder="List required bar diameters (e.g. 12mm: 15 MT, 16mm: 20 MT), delivery schedule dates, or special chemical composition constraints..."
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                  />

                  <Button type="submit" variant="primary" size="lg" className="w-full py-4 text-base font-bold" isLoading={isSubmitting}>
                    Generate Commercial Quote Request
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
