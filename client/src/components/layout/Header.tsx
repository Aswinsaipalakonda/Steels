import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, PhoneCall, ArrowUpRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { Logo } from '../ui/Logo';
import { QuickQuoteModal } from '../enquiry/QuickQuoteModal';
import { AnimatePresence, motion } from 'framer-motion';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
            ? 'bg-white/95 backdrop-blur-md border-b border-[#E2EBE5] py-3.5 shadow-sm'
            : 'bg-white/80 backdrop-blur-sm border-b border-[#E2EBE5]/60 py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Steels Logo */}
          <Link to="/" className="flex items-center">
            <Logo variant="light" size="md" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`text-sm font-semibold transition-colors hover:text-[#07552B] ${
                    isActive ? 'text-[#03281A] font-bold underline decoration-[#07552B] underline-offset-8' : 'text-[#4B5563]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-5">
            <a
              href="tel:+919876543210"
              className="hidden xl:flex items-center gap-2 text-xs font-bold text-[#03281A] hover:text-[#07552B] transition"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#07552B]" />
              <span>+91 98765 43210</span>
            </a>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsQuoteModalOpen(true)}
              className="gap-1.5 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full"
            >
              <span>Request a Quote</span>
              <ArrowUpRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex sm:hidden items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsQuoteModalOpen(true)}
              className="px-3.5 py-1.5 text-xs font-bold rounded-full"
            >
              Quote
            </Button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-[#03281A] hover:bg-[#F0F5F2] border border-[#D0DDD4] transition"
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed right-0 top-0 bottom-0 w-4/5 max-w-sm bg-white border-l border-[#E2EBE5] p-6 flex flex-col justify-between shadow-2xl z-50 overflow-y-auto"
            >
              <div>
                <div className="flex items-center justify-between pb-5 border-b border-[#E2EBE5]">
                  <Logo variant="light" size="sm" />
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="flex flex-col gap-4 mt-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      to={link.href}
                      className="text-base font-bold text-[#111814] hover:text-[#07552B] py-1 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="pt-6 border-t border-[#E2EBE5] space-y-3">
                <Button
                  variant="primary"
                  className="w-full justify-center rounded-full"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsQuoteModalOpen(true);
                  }}
                >
                  Request a Quote
                </Button>

                <a
                  href="tel:+919876543210"
                  className="flex items-center justify-center gap-2 text-xs font-bold text-[#03281A] hover:text-[#07552B] py-2"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#07552B]" />
                  <span>Call Sales: +91 98765 43210</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <QuickQuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} />
    </>
  );
};
