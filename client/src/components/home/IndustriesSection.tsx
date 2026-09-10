import React from 'react';
import { Building2, TrainTrack, Factory, Warehouse } from 'lucide-react';

export const IndustriesSection: React.FC = () => {
  const industries = [
    {
      icon: Building2,
      title: 'High-Rise Commercial & Residential',
      description: 'Primary Fe 500D/550D TMT reinforcement bars engineered for seismic zone load resistance.',
    },
    {
      icon: TrainTrack,
      title: 'Civil Infrastructure & Highways',
      description: 'Heavy structural beams, pier steel, and bridge plates for flyovers and metro corridors.',
    },
    {
      icon: Warehouse,
      title: 'Pre-Engineered Buildings (PEB)',
      description: 'Hot rolled plates, columns, and precision hollow sections for industrial logistics parks.',
    },
    {
      icon: Factory,
      title: 'Heavy Fabrication & Engineering',
      description: 'Boiler-quality carbon steel plates and structural shapes cut to project CAD dimensions.',
    },
  ];

  return (
    <section className="py-20 bg-steel-forest/30 border-t border-steel-rich/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block mb-2">
              Sectors Served
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
              Engineered For Every Project Scale
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {industries.map((ind, i) => {
            const Icon = ind.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl bg-steel-darkest border border-steel-rich hover:border-steel-accent transition group"
              >
                <div className="w-12 h-12 rounded-xl bg-steel-forest border border-steel-accent/40 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-105 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-2 uppercase tracking-tight">
                  {ind.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{ind.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
