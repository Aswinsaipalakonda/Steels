import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, ShieldCheck, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-steel-darkest border-t border-steel-rich text-zinc-400 text-sm">
      {/* Upper Footer / Value Strip */}
      <div className="border-b border-steel-rich/60 py-8 bg-steel-forest/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-steel-primary border border-steel-accent/40 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">BIS 1786 & IS 2062 Certified</h5>
              <p className="text-xs text-steel-olive">100% primary mill verified physical & chemical test certs.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-steel-primary border border-steel-accent/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">Direct Mill Authorized</h5>
              <p className="text-xs text-steel-olive">Official distribution partnerships with top primary steel mills.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-steel-primary border border-steel-accent/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">Fast Dispatch Across India</h5>
              <p className="text-xs text-steel-olive">Central stockyards with weighbridge accuracy guarantee.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-steel-primary border border-steel-accent flex items-center justify-center font-bold text-base text-emerald-400">
                APEX
              </div>
              <span className="text-xl font-bold tracking-tight text-white uppercase">
                Apex Steel Industries
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-steel-olive leading-relaxed max-w-sm">
              Premier industrial steel stockist and infrastructure supply partner. Supplying high ductility TMT rebars, heavy structural sections, and custom plates to builders, EPCs, and fabricators.
            </p>
            <div className="pt-2 text-xs text-zinc-500">
              GSTIN: 27AAACA0000A1Z5 • ISO 9001:2015 Certified
            </div>
          </div>

          {/* Steel Categories */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4 text-emerald-400">
              Steel Catalog
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/products?category=tmt-rebars" className="hover:text-white transition">
                  TMT Rebars (Fe 500D / 550D)
                </Link>
              </li>
              <li>
                <Link to="/products?category=structural-steel" className="hover:text-white transition">
                  Structural Beams & Channels
                </Link>
              </li>
              <li>
                <Link to="/products?category=steel-plates-coils" className="hover:text-white transition">
                  MS Plates & Slit Coils
                </Link>
              </li>
              <li>
                <Link to="/products?category=pipes-hollow-sections" className="hover:text-white transition">
                  Hollow Sections (SHS/RHS)
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-emerald-400 hover:underline">
                  View Full Product Index →
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4 text-emerald-400">
              Company & Specs
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/about" className="hover:text-white transition">
                  About Our Infrastructure
                </Link>
              </li>
              <li>
                <Link to="/industries" className="hover:text-white transition">
                  Industries & Applications
                </Link>
              </li>
              <li>
                <Link to="/quality" className="hover:text-white transition">
                  Quality Standards & MTC
                </Link>
              </li>
              <li>
                <Link to="/quote" className="hover:text-white transition">
                  Request Commercial Quote
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="text-zinc-600 hover:text-zinc-400 transition text-xs">
                  Staff Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4 text-emerald-400">
              Sales Desk & Yard
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Plot 42, Heavy Industrial Area, Steel Hub Phase II, Mumbai - 400072</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="tel:+919876543210" className="hover:text-white transition">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="mailto:sales@steelplatform.com" className="hover:text-white transition">
                  sales@steelplatform.com
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-xs text-steel-olive">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>Mon - Sat: 8:00 AM - 7:30 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-steel-rich flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} Apex Steel Industries Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-zinc-400 transition">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-zinc-400 transition">
              Terms of Supply
            </Link>
            <Link to="/contact" className="hover:text-zinc-400 transition">
              Site Map
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
