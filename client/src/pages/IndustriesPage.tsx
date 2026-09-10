import React from 'react';
import { Building2, TrainTrack, Factory, Warehouse, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const IndustriesPage: React.FC = () => {
  const sectors = [
    {
      title: 'High-Rise Commercial & Residential Towers',
      icon: Building2,
      desc: 'Supplying Fe 500D and Fe 550D TMT reinforcement steel engineered for high ductility, bendability, and seismic resistance according to IS 13920.',
      materials: ['Fe 500D TMT Bars (8mm - 32mm)', 'Fe 550D High Tensile Rebars', 'Binding Wire & Couplers'],
    },
    {
      title: 'Civil Infrastructure, Bridges & Metro Rail',
      icon: TrainTrack,
      desc: 'Heavy industrial structural joists, channel columns, and pier cap reinforcement for national expressways, elevated metro viaducts, and port terminals.',
      materials: ['ISMB Heavy Beams (150 - 600)', 'Equal & Unequal Angles (IS 2062)', 'Corrosion Resistant Rebars (CRS)'],
    },
    {
      title: 'Pre-Engineered Buildings (PEB) & Warehousing',
      icon: Warehouse,
      desc: 'Comprehensive plates and cold-formed hollow tubular sections for clear-span industrial sheds, logistics parks, and distribution centers.',
      materials: ['Hot Rolled High Grade Plates', 'Rectangular Hollow Sections (RHS)', 'Square Hollow Sections (SHS)'],
    },
    {
      title: 'Heavy Plant Fabrication & Power Sector',
      icon: Factory,
      desc: 'Boiler quality and pressure vessel steel plates cut to CAD drawing specs for cement plants, thermal stations, and petrochemical refineries.',
      materials: ['ASTM A36 / IS 2062 E350 Plates', 'Seamless Heavy Wall Pipes', 'Custom Slit & Sheared Flats'],
    },
  ];

  return (
    <div className="py-14 bg-steel-darkest min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block mb-2">
            Project Applications
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase leading-tight font-sans">
            Engineered Steel For Strategic Industrial Sectors
          </h1>
          <p className="text-base text-zinc-300 mt-4 leading-relaxed font-normal">
            Every construction sector has unique load profiles and metallographic specifications. Apex Steel works closely with project structural consultants to supply the right grade on schedule.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sectors.map((sector, idx) => {
            const Icon = sector.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-steel-forest/50 border border-steel-rich space-y-5 hover:border-steel-accent transition"
              >
                <div className="w-12 h-12 rounded-xl bg-steel-primary border border-steel-accent flex items-center justify-center text-emerald-400">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-tight mb-2">
                    {sector.title}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed font-normal">{sector.desc}</p>
                </div>

                <div className="pt-4 border-t border-steel-rich/60">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-2">
                    Commonly Supplied Materials:
                  </span>
                  <ul className="space-y-1.5">
                    {sector.materials.map((m, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-zinc-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link to="/products" className="inline-block pt-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    View Relevant Products
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
