import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, PhoneCall, ArrowUpRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { QuickQuoteModal } from '../enquiry/QuickQuoteModal';
import { AnimatePresence, motion } from 'framer-motion';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Products', href: '/products' },
    { label: 'Categories', href: '/products#categories' },
    { label: 'Industries', href: '/industries' },
    { label: 'Quality & Specs', href: '/quality' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-steel-forest/95 backdrop-blur-md border-b border-steel-rich/80 py-3 shadow-xl'
            : 'bg-gradient-to-b from-steel-darkest/90 via-steel-darkest/40 to-transparent py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Identity */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-steel-primary border border-steel-accent flex items-center justify-center font-bold text-lg text-emerald-400 shadow-md group-hover:border-emerald-400 transition">
              APEX
            </div>
            <div>
              <span className="text-lg sm:text-xl font-bold tracking-tight text-white block uppercase leading-tight font-sans">
                Apex Steel
              </span>
              <span className="text-[10px] uppercase tracking-widest text-steel-olive block font-medium">
                Industrial Supply Co.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`text-sm font-medium transition-colors hover:text-white ${
                    isActive ? 'text-emerald-400 font-semibold' : 'text-zinc-300'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-4">
            <a
              href="tel:+919876543210"
              className="hidden xl:flex items-center gap-2 text-xs font-semibold text-zinc-300 hover:text-emerald-400 transition"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>+91 98765 43210</span>
            </a>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsQuoteModalOpen(true)}
              className="gap-1.5 font-semibold text-xs sm:text-sm px-4 py-2"
            >
              <span>Request a Quote</span>
              <ArrowUpRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setIsQuoteModalOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold bg-steel-accent text-white rounded-lg border border-emerald-500/40"
            >
              Quote
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-zinc-300 hover:text-white bg-steel-forest/80 border border-steel-rich transition"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Sliding Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed right-0 top-0 bottom-0 w-4/5 max-w-sm bg-steel-darkest border-l border-steel-rich p-6 flex flex-col justify-between shadow-2xl z-50 overflow-y-auto"
            >
              <div>
                <div className="flex items-center justify-between pb-5 border-b border-steel-rich">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded bg-steel-primary border border-steel-accent flex items-center justify-center font-bold text-xs text-emerald-400">
                      APEX
                    </div>
                    <span className="font-bold text-base uppercase text-white tracking-tight">Apex Steel</span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg text-steel-olive hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="flex flex-col gap-4 mt-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      to={link.href}
                      className="text-base font-medium text-zinc-300 hover:text-emerald-400 py-1 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="pt-6 border-t border-steel-rich space-y-3">
                <Button
                  variant="primary"
                  className="w-full justify-center"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsQuoteModalOpen(true);
                  }}
                >
                  Request a Quote
                </Button>

                <a
                  href="tel:+919876543210"
                  className="flex items-center justify-center gap-2 text-xs text-zinc-400 hover:text-white py-2"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Call Sales: +91 98765 43210</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Quick Quote Modal */}
      <QuickQuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} />
    </>
  );
};
