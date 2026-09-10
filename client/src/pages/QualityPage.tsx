import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const QualityPage: React.FC = () => {
  const tests = [
    {
      title: 'Universal Testing Machine (UTM) Tensile Test',
      standard: 'IS 1608 / IS 1786',
      desc: 'Accurately tests Yield Stress (0.2% proof stress), Ultimate Tensile Strength (UTS), and Percentage Total Elongation at fracture.',
    },
    {
      title: 'Bend & Re-Bend Mandrel Testing',
      standard: 'IS 1599',
      desc: 'Bars are bent through 180° around specified mandrel diameters, reverse bent at 100°C water bath to prove zero surface crack propagation.',
    },
    {
      title: 'Optical Emission Spectrometry (Chemical Analysis)',
      standard: 'ASTM E415',
      desc: '16-channel spectro analysis checking Carbon (C), Sulphur (S), Phosphorus (P), and Carbon Equivalent (CE) within strict limits.',
    },
    {
      title: 'Digital Weighment Calibration',
      standard: 'Legal Metrology Department',
      desc: 'All yard weighbridges undergo quarterly verification with stamped calibration weights for 100% accurate tare and gross readings.',
    },
  ];

  return (
    <div className="py-14 bg-[#FAFCFA] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-[#07552B] block mb-2">
            Quality Assurance & Testing Protocols
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#111814] tracking-tight uppercase leading-tight font-sans">
            Certified Quality Guarantee & Mill Test Verification
          </h1>
          <p className="text-base text-[#526458] mt-4 leading-relaxed font-normal">
            Every trailer load dispatched from our stockyards carries an authentic Mill Test Certificate (MTC) issued by the primary manufacturer, detailing both the physical mechanical properties and the ladle chemical analysis.
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

        {/* Sample MTC Card */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#D0DDD4] shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#07552B] block mb-2">
                Documentation Standards
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#111814] uppercase tracking-tight mb-4">
                What A Mill Test Certificate (MTC) Contains
              </h2>
              <ul className="space-y-3 text-sm text-[#526458] mb-6 font-normal">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#07552B] shrink-0 mt-0.5" />
                  <span>Unique Cast / Heat Number matching embossed markings on the steel rebar.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#07552B] shrink-0 mt-0.5" />
                  <span>Exact Carbon Equivalent (CE) demonstrating superior weldability without preheating.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#07552B] shrink-0 mt-0.5" />
                  <span>Yield Stress, UTS, and UTS/YS ratio proving enhanced seismic dissipation capacity.</span>
                </li>
              </ul>

              <a href="tel:+919876543210">
                <Button variant="primary" size="md">
                  Request Sample MTC For Your Project
                </Button>
              </a>
            </div>

            <div className="p-6 rounded-2xl bg-[#F4F7F5] border border-[#E2EBE5] font-mono text-xs text-[#111814] space-y-3">
              <div className="text-[#07552B] font-bold text-sm border-b border-[#E2EBE5] pb-2">
                TYPICAL CHEMICAL & MECHANICAL TEST BENCHMARK
              </div>
              <div className="flex justify-between">
                <span className="text-[#526458]">Grade:</span>
                <span className="text-[#111814] font-bold">IS 1786 Fe 500D</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#526458]">Carbon (C):</span>
                <span className="text-[#111814]">0.25% Max (Actual: 0.21%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#526458]">Sulphur (S) + Phos (P):</span>
                <span className="text-[#111814]">0.075% Max (Actual: 0.054%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#526458]">Yield Strength:</span>
                <span className="text-[#111814] font-bold">Min 500 MPa (Actual: 535 MPa)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#526458]">Elongation:</span>
                <span className="text-[#111814] font-bold">Min 16.0% (Actual: 18.5%)</span>
              </div>
              <div className="pt-2 text-[10px] text-[#526458]">
                Verified by NABL Accredited Independent Testing Laboratory.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
