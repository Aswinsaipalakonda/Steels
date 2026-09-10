import React from 'react';
import { Building, ShieldCheck, Truck, Award, Landmark } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="py-14 bg-[#FAFCFA] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Intro */}
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-[#07552B] block mb-2">
            Company Heritage & Infrastructure
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#111814] tracking-tight uppercase leading-tight font-sans">
            Built On Decades of Industrial Steel Reliability
          </h1>
          <p className="text-base text-[#526458] mt-4 leading-relaxed font-normal">
            Steels Industrial Supply Ltd. has served as a primary distribution partner for India’s infrastructure expansion. We supply certified thermo-mechanically treated reinforcement rebars, heavy structural beams, and custom plates to builders, civil contractors, metro authorities, and pre-engineered building fabricators.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-white border border-[#E2EBE5] space-y-3 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-[#EBF3ED] border border-[#D0DDD4] flex items-center justify-center text-[#07552B] mb-4">
              <Landmark className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#111814] uppercase tracking-tight">Primary Mill Direct</h3>
            <p className="text-sm text-[#526458] leading-relaxed">
              We exclusively maintain direct tie-ups with primary integrated producers including Tata Steel, JSW Steel, and SAIL. We never distribute re-rolled or undocumented scrap metal.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-[#E2EBE5] space-y-3 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-[#EBF3ED] border border-[#D0DDD4] flex items-center justify-center text-[#07552B] mb-4">
              <Building className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#111814] uppercase tracking-tight">Central Stockyard Scale</h3>
            <p className="text-sm text-[#526458] leading-relaxed">
              Over 40,000 square meters of covered industrial stockyards equipped with dual 20-ton overhead gantry cranes, precision shearing lines, and 100-ton computerized weighbridges.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-[#E2EBE5] space-y-3 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-[#EBF3ED] border border-[#D0DDD4] flex items-center justify-center text-[#07552B] mb-4">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#111814] uppercase tracking-tight">Synchronized Logistics</h3>
            <p className="text-sm text-[#526458] leading-relaxed">
              In-house trailer logistics fleet operating 24/7 to support tight concrete casting schedules, high-rise slab pouring, and heavy PEB erection deadlines.
            </p>
          </div>
        </div>

        {/* Distribution Network Map / Visual */}
        <div className="relative rounded-3xl overflow-hidden bg-white border border-[#E2EBE5] p-8 sm:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#07552B] block mb-2">
                Supply Capability
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#111814] uppercase tracking-tight mb-4">
                National Logistics Footprint
              </h2>
              <p className="text-sm text-[#526458] leading-relaxed mb-6 font-normal">
                With regional stockyards in Mumbai, Pune, Ahmedabad, and Hyderabad, we offer same-day and scheduled dispatch across Maharashtra, Gujarat, and South-Central industrial belts.
              </p>

              <div className="space-y-2 text-xs text-[#526458]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#07552B]" />
                  <span>ISO 9001:2015 Quality Management System</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#07552B]" />
                  <span>Approved Vendor for National Highway Authorities & Metro Rail</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden h-72 sm:h-80 bg-zinc-100 border border-[#E2EBE5]">
              <img
                src="https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80"
                alt="Steels Logistics Yard"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
