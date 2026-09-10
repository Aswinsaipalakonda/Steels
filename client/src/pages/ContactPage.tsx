import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { useToast } from '../context/ToastContext';
import api from '../lib/api';
import { Phone, Mail, MapPin, Clock, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { success, error } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post('/contact', formData);
      setIsSent(true);
      success('Your message has been sent successfully. Our team will contact you soon.');
    } catch (err: any) {
      error(err.message || 'Failed to send message.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-14 bg-steel-darkest min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block mb-2">
            Direct Commercial Contact
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase leading-tight font-sans">
            Connect With Our Technical Sales Desk
          </h1>
          <p className="text-base text-zinc-300 mt-4 leading-relaxed font-normal">
            Have questions regarding bulk mill direct orders, specialized grades, credit facilities, or project deliveries? Contact our industrial desk or visit our main steel yard.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-steel-forest/60 border border-steel-rich space-y-4">
              <h3 className="text-base font-bold text-white uppercase tracking-tight text-emerald-400">
                Registered Office & Main Stockyard
              </h3>
              <ul className="space-y-4 text-sm text-zinc-300">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Apex Steel Stockyard</span>
                    <span>Plot 42, Heavy Industrial Area, Steel Hub Phase II, Kalamboli / Mumbai - 400072</span>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-xs text-steel-olive block">Sales Hotline</span>
                    <a href="tel:+919876543210" className="font-bold text-white hover:text-emerald-400 transition">
                      +91 98765 43210 / +91 98200 11223
                    </a>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-xs text-steel-olive block">Direct Enquiries</span>
                    <a href="mailto:sales@steelplatform.com" className="font-bold text-white hover:text-emerald-400 transition">
                      sales@steelplatform.com
                    </a>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-xs text-steel-olive block">Weighbridge & Dispatch Hours</span>
                    <span>Monday - Saturday: 8:00 AM - 7:30 PM (Sunday by appointment)</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl bg-steel-forest/80 border border-steel-accent/40 shadow-2xl">
              {isSent ? (
                <div className="text-center py-10">
                  <div className="w-14 h-14 bg-emerald-900/40 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Message Dispatched</h3>
                  <p className="text-sm text-steel-olive max-w-sm mx-auto mb-6">
                    Thank you for reaching out. Our steel desk manager will review your submission and connect with you shortly.
                  </p>
                  <Button variant="outline" onClick={() => setIsSent(false)}>
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-lg font-bold text-white uppercase tracking-tight mb-2">
                    Send Us an Inquiry
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Your Name"
                      name="name"
                      placeholder="e.g. Ramesh Kumar"
                      required
                      value={formData.name}
                      onChange={handleChange}
                    />
                    <Input
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Email Address"
                      name="email"
                      type="email"
                      placeholder="ramesh@construction.com"
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                    <Input
                      label="Subject"
                      name="subject"
                      placeholder="e.g. Bulk 500 MT Supply Inquiry"
                      value={formData.subject}
                      onChange={handleChange}
                    />
                  </div>

                  <Textarea
                    label="Your Message / Query"
                    name="message"
                    placeholder="Tell us about your requirements, project details, or delivery location..."
                    rows={4}
                    required
                    value={formData.message}
                    onChange={handleChange}
                  />

                  <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isSubmitting}>
                    Send Message
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
