import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, ShieldCheck, Award } from 'lucide-react';
import { Logo } from '../ui/Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#F8FAF8] border-t border-[#E2EBE5] text-[#4B5563] text-sm">
      {/* Upper Footer / Value Strip */}
      <div className="border-b border-[#E2EBE5] py-8 bg-[#F0F5F2]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-white border border-[#D0DDD4] shadow-sm flex items-center justify-center text-[#07552B] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-[#03281A] text-sm">Certified Quality Guarantee</h5>
              <p className="text-xs text-[#697057]">100% factory verified strength and chemical purity on all steel.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-white border border-[#D0DDD4] shadow-sm flex items-center justify-center text-[#07552B] shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-[#03281A] text-sm">Direct Mill Authorized</h5>
              <p className="text-xs text-[#697057]">Official distribution partnerships with top primary steel mills.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-white border border-[#D0DDD4] shadow-sm flex items-center justify-center text-[#07552B] shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-[#03281A] text-sm">Fast Dispatch Across India</h5>
              <p className="text-xs text-[#697057]">Central stockyards with electronic weighbridge guarantee.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <Logo variant="light" size="md" />
            </Link>
            <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed max-w-sm font-medium">
              Premier industrial steel stockist and infrastructure supply partner. Supplying high ductility TMT rebars, heavy structural sections, and custom plates to builders, EPCs, and fabricators.
            </p>
            <div className="pt-2 text-xs text-[#697057] font-semibold">
              GSTIN: 27AAACA0000A1Z5 • ISO 9001:2015 Certified
            </div>
          </div>

          {/* Steel Categories */}
          <div>
            <h4 className="font-black text-[#03281A] text-xs uppercase tracking-wider mb-4">
              Steel Catalog
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium">
              <li>
                <Link to="/products?category=tmt-rebars" className="hover:text-[#07552B] transition">
                  TMT Rebars (Fe 500D / 550D)
                </Link>
              </li>
              <li>
                <Link to="/products?category=structural-steel" className="hover:text-[#07552B] transition">
                  Structural Beams & Channels
                </Link>
              </li>
              <li>
                <Link to="/products?category=steel-plates-coils" className="hover:text-[#07552B] transition">
                  MS Plates & Slit Coils
                </Link>
              </li>
              <li>
                <Link to="/products?category=pipes-hollow-sections" className="hover:text-[#07552B] transition">
                  Hollow Sections (SHS/RHS)
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-[#07552B] font-bold hover:underline">
                  View Full Product Index →
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-black text-[#03281A] text-xs uppercase tracking-wider mb-4">
              Company & Specs
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium">
              <li>
                <Link to="/about" className="hover:text-[#07552B] transition">
                  About Our Infrastructure
                </Link>
              </li>
              <li>
                <Link to="/industries" className="hover:text-[#07552B] transition">
                  Industries & Applications
                </Link>
              </li>
              <li>
                <Link to="/quality" className="hover:text-[#07552B] transition">
                  Quality Assurance & Standards
                </Link>
              </li>
              <li>
                <Link to="/quote" className="hover:text-[#07552B] transition">
                  Request Commercial Quote
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="text-zinc-400 hover:text-[#03281A] transition text-xs">
                  Staff Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-black text-[#03281A] text-xs uppercase tracking-wider mb-4">
              Sales Desk & Yard
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm font-medium">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#07552B] shrink-0 mt-0.5" />
                <span>Plot 42, Heavy Industrial Area, Steel Hub Phase II, Mumbai - 400072</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#07552B] shrink-0" />
                <a href="tel:+919876543210" className="hover:text-[#07552B] transition font-bold text-[#03281A]">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#07552B] shrink-0" />
                <a href="mailto:sales@steels.com" className="hover:text-[#07552B] transition">
                  sales@steels.com
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-xs text-[#697057]">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>Mon - Sat: 8:00 AM - 7:30 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#E2EBE5] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#697057]">
          <p>© {new Date().getFullYear()} Steels Industrial Supply Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6 font-medium">
            <Link to="/privacy" className="hover:text-[#03281A] transition">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-[#03281A] transition">
              Terms of Supply
            </Link>
            <Link to="/contact" className="hover:text-[#03281A] transition">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
