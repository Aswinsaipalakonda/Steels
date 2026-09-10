import React from 'react';
import { ShieldCheck, Scale, Truck, FileSpreadsheet } from 'lucide-react';

export const WhyChooseUsSection: React.FC = () => {
  const points = [
    {
      icon: ShieldCheck,
      title: '100% Primary Mill Certified',
      description:
        'All TMT rebars and structural members are sourced directly from integrated primary producers. No re-rolled or secondary scrap steel.',
    },
    {
      icon: Scale,
      title: 'Precision Weighbridge Accuracy',
      description:
        'Digital computerized weighbridge certification with every dispatch to guarantee gross, tare, and net weights with zero discrepancy.',
    },
    {
      icon: Truck,
      title: 'Scheduled Site Delivery',
      description:
        'Dedicated fleet logistics ensuring synchronized phased deliveries directly to project sites, highway corridors, and metro yards.',
    },
    {
      icon: FileSpreadsheet,
      title: 'Mill Test Certificates (MTC)',
      description:
        'Original batch-wise chemical composition and mechanical test certificates (yield, tensile, elongation) delivered with every invoice.',
    },
  ];

  return (
    <section className="py-20 bg-steel-darkest border-t border-steel-rich/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block mb-2">
            Industrial Credibility & Supply Assurance
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
            Why Contractors Choose Apex Steel
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {points.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-steel-forest/40 border border-steel-rich hover:border-steel-accent transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-steel-primary border border-steel-accent flex items-center justify-center text-emerald-400 mb-5">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-2 uppercase tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
