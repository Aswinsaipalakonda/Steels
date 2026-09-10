import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const QualityPage: React.FC = () => {
  const tests = [
    {
      title: 'High-Strength Load & Tension Testing',
      standard: 'Certified Strength Tested',
      desc: 'Rigorous tensile and proof testing ensures all steel bars withstand intense structural weight, earthquake vibrations, and heavy foundation loads.',
    },
    {
      title: 'Bending & Anti-Crack Guarantee',
      standard: 'Zero-Crack Standard',
      desc: 'All steel rods are tested with extreme 180-degree bend trials to verify maximum flexibility and eliminate structural fatigue or surface cracking.',
    },
    {
      title: 'Pure Steel Composition Verification',
      standard: 'Pure Steel Guarantee',
      desc: 'Certified factory laboratory analysis guarantees optimal carbon and mineral balance for superior weldability and lifetime corrosion resistance.',
    },
    {
      title: 'Computerized Weighbridge Calibration',
      standard: 'Accurate Weighing Guarantee',
      desc: 'Every dispatch truck passes through precision digital weighbridges to verify 100% accurate gross and net weight before leaving our facility.',
    },
  ];

  return (
    <div className="py-14 bg-[#FAFCFA] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-[#07552B] block mb-2">
            Quality Assurance & Material Standards
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#111814] tracking-tight uppercase leading-tight font-sans">
            Certified Quality Guarantee & Factory Inspection
          </h1>
          <p className="text-base text-[#526458] mt-4 leading-relaxed font-normal">
            Every delivery dispatched from our supply yards comes with an authentic Manufacturer Quality Certificate issued directly by the steel producer, confirming verified strength, purity, and certified durability.
          </p>
        </div>

        {/* Quality Standards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tests.map((test, idx) => (
            <div key={idx} className="p-8 rounded-3xl bg-white border border-[#E2EBE5] space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#07552B] font-mono">
                  {test.standard}
                </span>
                <ShieldCheck className="w-5 h-5 text-[#07552B]" />
              </div>
              <h3 className="text-lg font-bold text-[#111814] uppercase tracking-tight">{test.title}</h3>
              <p className="text-sm text-[#526458] leading-relaxed font-normal">{test.desc}</p>
            </div>
          ))}
        </div>

        {/* Sample Certificate Card */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#D0DDD4] shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#07552B] block mb-2">
                Documentation Standards
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#111814] uppercase tracking-tight mb-4">
                What Your Quality Certificate Verifies
              </h2>
              <ul className="space-y-3 text-sm text-[#526458] mb-6 font-normal">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#07552B] shrink-0 mt-0.5" />
                  <span>Unique batch tracking numbers matching the stamped markings on your steel.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#07552B] shrink-0 mt-0.5" />
                  <span>Verified pure steel purity for effortless, strong welding without cracking.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#07552B] shrink-0 mt-0.5" />
                  <span>Certified high tensile strength guaranteeing complete safety in all weather conditions.</span>
                </li>
              </ul>

              <a href="tel:+919876543210">
                <Button variant="primary" size="md">
                  Request Sample Quality Certificate
                </Button>
              </a>
            </div>

            <div className="p-6 rounded-2xl bg-[#F4F7F5] border border-[#E2EBE5] text-xs text-[#111814] space-y-3 font-sans">
              <div className="text-[#07552B] font-bold text-sm border-b border-[#E2EBE5] pb-2 font-mono">
                OFFICIAL QUALITY VERIFICATION BENCHMARK
              </div>
              <div className="flex justify-between">
                <span className="text-[#526458]">Product Category:</span>
                <span className="text-[#111814] font-bold">Premium High-Strength Steel Rebars</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#526458]">Steel Purity:</span>
                <span className="text-[#111814] font-bold">100% Primary Grade (Zero Scrap)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#526458]">Weather & Rust Protection:</span>
                <span className="text-[#111814] font-bold">Enhanced Anti-Corrosion Treatment</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#526458]">Load Bearing Capacity:</span>
                <span className="text-[#111814] font-bold">High Tensile Certified</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#526458]">Flexibility & Bend Safety:</span>
                <span className="text-[#111814] font-bold">100% Crack-Free Verified</span>
              </div>
              <div className="pt-2 text-[10px] text-[#526458]">
                Inspected and verified to conform with national construction building codes.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
