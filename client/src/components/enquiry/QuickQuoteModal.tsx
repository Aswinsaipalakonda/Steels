import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { useToast } from '../../context/ToastContext';
import api from '../../lib/api';
import { CheckCircle2, ShieldCheck, Clock, FileCheck } from 'lucide-react';

interface QuickQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId?: string;
  productName?: string;
  variantId?: string;
  variantName?: string;
}

export const QuickQuoteModal: React.FC<QuickQuoteModalProps> = ({
  isOpen,
  onClose,
  productId,
  productName,
  variantId,
  variantName,
}) => {
  const { success, error } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEnquiryNumber, setSubmittedEnquiryNumber] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    company: '',
    location: '',
    quantity: '',
    unit: 'MT',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res: any = await api.post('/enquiries', {
        ...formData,
        quantity: formData.quantity ? parseFloat(formData.quantity) : null,
        productId: productId || null,
        variantId: variantId || null,
        sourcePage: window.location.pathname,
      });

      const refNo = res.data?.enquiryNumber || 'ENQ-CONFIRMED';
      setSubmittedEnquiryNumber(refNo);
      success('Quotation request submitted successfully!');
    } catch (err: any) {
      error(err.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedEnquiryNumber(null);
    setFormData({
      customerName: '',
      phone: '',
      email: '',
      company: '',
      location: '',
      quantity: '',
      unit: 'MT',
      message: '',
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleReset}
      title={submittedEnquiryNumber ? 'Quotation Request Received' : 'Request Commercial Steel Quotation'}
      description={
        submittedEnquiryNumber
          ? 'Your enquiry has been logged directly with our technical sales desk.'
          : productName
          ? `Inquiring for: ${productName}${variantName ? ` (${variantName})` : ''}`
          : 'Direct mill pricing with certified weighment and prompt delivery.'
      }
      maxWidth="lg"
    >
      {submittedEnquiryNumber ? (
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-emerald-50 border border-emerald-300 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-700">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="text-xl font-bold text-[#03281A] mb-1">Enquiry #{submittedEnquiryNumber}</h4>
          <p className="text-sm text-[#4B5563] max-w-sm mx-auto mb-6">
            A confirmation has been recorded. Our steel procurement specialist will connect with you within 2 business hours.
          </p>

          <div className="grid grid-cols-3 gap-2 bg-[#F8FAF7] p-3.5 rounded-2xl border border-[#E2EBE5] mb-6 text-xs text-left">
            <div className="flex items-center gap-1.5 text-[#03281A] font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>BIS Certified</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#03281A] font-semibold">
              <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Fast Callback</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#03281A] font-semibold">
              <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>MTC Provided</span>
            </div>
          </div>

          <Button variant="primary" onClick={handleReset} className="w-full">
            Done
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Full Name"
              name="customerName"
              placeholder="e.g. Rajesh Patil"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="procurement@company.com"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <Input
              label="Company / Firm Name"
              name="company"
              placeholder="e.g. Patil Builders & Infra"
              value={formData.company}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-3 gap-3.5">
            <div className="col-span-2">
              <Input
                label="Required Quantity"
                name="quantity"
                type="number"
                step="any"
                placeholder="e.g. 25"
                value={formData.quantity}
                onChange={handleChange}
              />
            </div>
            <div>
              <Select label="Unit" name="unit" value={formData.unit} onChange={handleChange}>
                <option value="MT">MT (Tons)</option>
                <option value="KG">Kilograms (KG)</option>
                <option value="PCS">Pieces (PCS)</option>
                <option value="Bundles">Bundles</option>
                <option value="Meters">Meters</option>
              </Select>
            </div>
          </div>

          <Input
            label="Delivery Site / Project Location"
            name="location"
            placeholder="City, Industrial Area, or Pincode"
            value={formData.location}
            onChange={handleChange}
          />

          <Textarea
            label="Specific Requirements / Cut Lengths / Notes"
            name="message"
            placeholder="Mention required steel grades, schedule of dispatch, or special test certificate needs..."
            value={formData.message}
            onChange={handleChange}
            rows={2}
          />

          <div className="pt-2">
            <Button type="submit" variant="primary" className="w-full py-3.5 text-sm font-bold" isLoading={isSubmitting}>
              Submit Quotation Request
            </Button>
            <p className="text-[11px] text-center text-[#697057] mt-2 font-medium">
              Instant sales response • Direct primary mill dispatch • Zero broker markups
            </p>
          </div>
        </form>
      )}
    </Modal>
  );
};
