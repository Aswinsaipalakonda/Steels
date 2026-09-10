import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { QuickQuoteModal } from '../enquiry/QuickQuoteModal';
import { ArrowRight, PhoneCall } from 'lucide-react';

export const FinalCTASection: React.FC = () => {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  return (
    <section className="py-20 bg-white border-t border-[#E2EBE5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-[#F4F7F5] border border-[#D0DDD4] p-8 sm:p-14 text-center shadow-sm overflow-hidden">
          <span className="text-xs font-bold uppercase tracking-widest text-[#07552B] block mb-3">
            Direct Mill Supply Desk
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-[#111814] tracking-tight uppercase leading-tight mb-5 font-sans">
            Need Certified Steel For Your Next Project?
          </h2>
          <p className="text-sm sm:text-base text-[#526458] max-w-2xl mx-auto mb-9 leading-relaxed font-normal">
            Get competitive commercial quotation rates direct from our primary stockyards. Computerized weighbridge slips and manufacturer test certificates with every order.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button variant="primary" size="lg" onClick={() => setIsQuoteOpen(true)} className="gap-2 shadow-md">
              <span>Request Commercial Quotation</span>
              <ArrowRight className="w-4 h-4" />
            </Button>

            <a href="tel:+919876543210">
              <Button
                variant="outline"
                size="lg"
                className="bg-white border-[#D0DDD4] text-[#03281A] hover:bg-[#EBF3ED] gap-2 shadow-sm"
              >
                <PhoneCall className="w-4 h-4 text-[#07552B]" />
                <span>Talk to Steel Specialist</span>
              </Button>
            </a>
          </div>
        </div>
      </div>

      <QuickQuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
    </section>
  );
};
