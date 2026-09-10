import React from 'react';
import { ShieldCheck, Scale, Truck, FileSpreadsheet } from 'lucide-react';

export const WhyChooseUsSection: React.FC = () => {
  const points = [
    {
      icon: ShieldCheck,
      title: '100% Genuine Certified Steel',
      description:
        'All construction steel rebars and structural beams are sourced directly from top brand manufacturers. Zero compromise on strength.',
    },
    {
      icon: Scale,
      title: 'Guaranteed Accurate Weighing',
      description:
        'Certified computerized weighing slips provided with every delivery so you receive exactly what you ordered with full transparency.',
    },
    {
      icon: Truck,
      title: 'On-Time Project Site Delivery',
      description:
        'Reliable fleet logistics ensuring prompt, hassle-free deliveries directly to your construction site, workshop, or project location.',
    },
    {
      icon: FileSpreadsheet,
      title: 'Official Quality Certificates',
      description:
        'Authentic factory inspection and quality test certificates delivered with every invoice for complete peace of mind.',
    },
  ];

  return (
    <section className="py-20 bg-[#FAFCFA] border-t border-[#E2EBE5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#07552B] block mb-2">
            Industrial Credibility & Supply Assurance
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#111814] tracking-tight uppercase">
            Why Contractors Choose Steels
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {points.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-[#E2EBE5] hover:border-[#07552B] hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#EBF3ED] border border-[#D0DDD4] flex items-center justify-center text-[#07552B] mb-5">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#111814] mb-2 uppercase tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#526458] leading-relaxed font-normal">
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
