import React from 'react';
import { Building, ShieldCheck, Truck, Users2, Award, Landmark } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="py-14 bg-steel-darkest min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Intro */}
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block mb-2">
            Company Heritage & Infrastructure
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase leading-tight font-sans">
            Built On Decades of Industrial Steel Reliability
          </h1>
          <p className="text-base text-zinc-300 mt-4 leading-relaxed font-normal">
            Apex Steel Industries Ltd. has served as a primary distribution partner for India’s infrastructure expansion. We supply certified thermo-mechanically treated reinforcement rebars, heavy structural beams, and custom plates to builders, civil contractors, metro authorities, and pre-engineered building fabricators.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-steel-forest/60 border border-steel-rich space-y-3">
            <div className="w-12 h-12 rounded-xl bg-steel-primary border border-steel-accent flex items-center justify-center text-emerald-400 mb-4">
              <Landmark className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white uppercase tracking-tight">Primary Mill Direct</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              We exclusively maintain direct tie-ups with primary integrated producers including Tata Steel, JSW Steel, and SAIL. We never distribute re-rolled or undocumented scrap metal.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-steel-forest/60 border border-steel-rich space-y-3">
            <div className="w-12 h-12 rounded-xl bg-steel-primary border border-steel-accent flex items-center justify-center text-emerald-400 mb-4">
              <Building className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white uppercase tracking-tight">Central Stockyard Scale</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Over 40,000 square meters of covered industrial stockyards equipped with dual 20-ton overhead gantry cranes, precision shearing lines, and 100-ton computerized weighbridges.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-steel-forest/60 border border-steel-rich space-y-3">
            <div className="w-12 h-12 rounded-xl bg-steel-primary border border-steel-accent flex items-center justify-center text-emerald-400 mb-4">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white uppercase tracking-tight">Synchronized Logistics</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              In-house trailer logistics fleet operating 24/7 to support tight concrete casting schedules, high-rise slab pouring, and heavy PEB erection deadlines.
            </p>
          </div>
        </div>

        {/* Distribution Network Map / Visual */}
        <div className="relative rounded-3xl overflow-hidden bg-steel-forest border border-steel-rich p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block mb-2">
                Supply Capability
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white uppercase tracking-tight mb-4">
                National Logistics Footprint
              </h2>
              <p className="text-sm text-zinc-300 leading-relaxed mb-6 font-normal">
                With regional stockyards in Mumbai, Pune, Ahmedabad, and Hyderabad, we offer same-day and scheduled dispatch across Maharashtra, Gujarat, and South-Central industrial belts.
              </p>

              <div className="space-y-2 text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>ISO 9001:2015 Quality Management System</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>Approved Vendor for National Highway Authorities & Metro Rail</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden h-72 sm:h-80 bg-zinc-900 border border-steel-accent/40">
              <img
                src="https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80"
                alt="Apex Steel Logistics Yard"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
