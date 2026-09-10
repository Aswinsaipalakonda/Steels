import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HeroSlide } from '../../types';
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import { QuickQuoteModal } from '../enquiry/QuickQuoteModal';

interface HeroSectionProps {
  slides?: HeroSlide[];
}

const fallbackSlides: HeroSlide[] = [
  {
    id: '1',
    title: 'BUILT FOR STRENGTH. ENGINEERED FOR SCALE.',
    subtitle:
      'Premier industrial distributor of certified primary TMT rebars, heavy structural beams, and precision steel products direct from primary mills.',
    bgImageUrl:
      'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1920&q=85',
    primaryCtaText: 'Explore Products',
    primaryCtaLink: '/products',
    secondaryCtaText: 'Request a Quote',
    secondaryCtaLink: '/quote',
    displayOrder: 1,
    isActive: true,
  },
  {
    id: '2',
    title: 'PRIMARY MILL DIRECT. ZERO COMPROMISE.',
    subtitle:
      'Supplying certified steel infrastructure materials to commercial towers, highways, bridges, and heavy industrial fabrication facilities across the nation.',
    bgImageUrl:
      'https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=1920&q=85',
    primaryCtaText: 'View TMT Bars',
    primaryCtaLink: '/products?category=tmt-rebars',
    secondaryCtaText: 'Quality Standards',
    secondaryCtaLink: '/quality',
    displayOrder: 2,
    isActive: true,
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({ slides }) => {
  const activeSlides = slides && slides.length > 0 ? slides : fallbackSlides;
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % activeSlides.length);
    }, 5500);

    return () => clearInterval(timer);
  }, [activeSlides.length]);

  const currentSlide = activeSlides[currentSlideIndex];

  return (
    <div className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center overflow-hidden bg-[#02150C]">
      {/* Background Image Carousel with motion */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="absolute inset-0 z-0"
        >
          <img
            src={currentSlide.bgImageUrl}
            alt={currentSlide.title}
            className="w-full h-full object-cover object-center"
          />
          {/* Refined Deep Forest & Black Industrial Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#02150C]/95 via-[#02150C]/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#02150C] via-transparent to-[#02150C]/50" />
        </motion.div>
      </AnimatePresence>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 w-full">
        <div className="max-w-3xl">
          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-emerald-400/30 text-xs font-bold text-emerald-300 mb-6 backdrop-blur-md"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>BIS Certified • IS 1786:2008 & IS 2062:2011 Grade Materials</span>
          </motion.div>

          {/* Confident Headline */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1] uppercase mb-5 font-sans">
                {currentSlide.title}
              </h1>

              <p className="text-base sm:text-lg text-zinc-200 mb-8 leading-relaxed max-w-2xl font-normal">
                {currentSlide.subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap items-center gap-4"
          >
            <Link to={currentSlide.primaryCtaLink || '/products'}>
              <Button
                variant="accent"
                size="lg"
                className="gap-2 bg-emerald-500 hover:bg-emerald-400 text-[#02150C] font-black rounded-full shadow-lg"
              >
                <span>{currentSlide.primaryCtaText || 'Explore Products'}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            <Button
              variant="outline"
              size="lg"
              onClick={() => setIsQuoteModalOpen(true)}
              className="bg-white/10 hover:bg-white text-white hover:text-[#03281A] border-2 border-white/60 hover:border-white rounded-full backdrop-blur-sm transition-colors"
            >
              {currentSlide.secondaryCtaText || 'Request a Quote'}
            </Button>
          </motion.div>

          {/* Metrics Bar */}
          <div className="mt-12 pt-8 border-t border-white/15 grid grid-cols-3 gap-4 max-w-lg">
            <div>
              <span className="block text-2xl sm:text-3xl font-black text-white">500k+</span>
              <span className="text-xs text-zinc-300 font-medium">Metric Tons Supplied</span>
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-black text-white">1,250+</span>
              <span className="text-xs text-zinc-300 font-medium">Active Projects</span>
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-black text-white">100%</span>
              <span className="text-xs text-zinc-300 font-medium">Primary Mill Tested</span>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Navigation Controls */}
      {activeSlides.length > 1 && (
        <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 z-20 flex items-center gap-2">
          <button
            onClick={() =>
              setCurrentSlideIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length)
            }
            className="p-2.5 rounded-full bg-white/20 hover:bg-white text-white hover:text-[#03281A] transition backdrop-blur-md"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-1.5 px-2">
            {activeSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentSlideIndex ? 'w-6 bg-emerald-400' : 'w-2 bg-white/40'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
          <button
            onClick={() => setCurrentSlideIndex((prev) => (prev + 1) % activeSlides.length)}
            className="p-2.5 rounded-full bg-white/20 hover:bg-white text-white hover:text-[#03281A] transition backdrop-blur-md"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      <QuickQuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} />
    </div>
  );
};
