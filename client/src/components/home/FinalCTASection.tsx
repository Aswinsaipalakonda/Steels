import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { QuickQuoteModal } from '../enquiry/QuickQuoteModal';
import { ArrowRight, PhoneCall } from 'lucide-react';

export const FinalCTASection: React.FC = () => {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  return (
    <section className="relative py-20 overflow-hidden bg-steel-darkest border-t border-steel-rich/80">
      <div className="absolute inset-0 bg-gradient-to-r from-steel-darkest via-steel-forest to-steel-darkest opacity-90" />
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block mb-3">
          Direct Mill Supply Desk
        </span>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase leading-tight mb-5 font-sans">
          Need Certified Steel For Your Next Project?
        </h2>
        <p className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto mb-9 leading-relaxed font-normal">
          Get competitive commercial quotation rates direct from our primary stockyards. Computerized weighbridge slips and manufacturer test certificates with every order.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button variant="primary" size="lg" onClick={() => setIsQuoteOpen(true)} className="gap-2">
            <span>Request Commercial Quotation</span>
            <ArrowRight className="w-4 h-4" />
          </Button>

          <a href="tel:+919876543210">
            <Button
              variant="outline"
              size="lg"
              className="bg-steel-forest/60 border-steel-accent/40 text-white gap-2"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span>Talk to Steel Specialist</span>
            </Button>
          </a>
        </div>
      </div>

      <QuickQuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
    </section>
  );
};
