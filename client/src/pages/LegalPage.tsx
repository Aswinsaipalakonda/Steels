import React from 'react';

export const LegalPage: React.FC<{ type: 'privacy' | 'terms' }> = ({ type }) => {
  const isPrivacy = type === 'privacy';

  return (
    <div className="py-14 bg-[#FAFCFA] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#07552B] block mb-2">
            Compliance & Legal
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111814] tracking-tight uppercase">
            {isPrivacy ? 'Privacy Policy' : 'Terms & Conditions of Supply'}
          </h1>
          <p className="text-xs text-[#526458] mt-1">Last Updated: September 2026</p>
        </div>

        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#E2EBE5] space-y-6 text-sm text-[#526458] leading-relaxed font-normal shadow-sm">
          {isPrivacy ? (
            <>
              <section className="space-y-2">
                <h3 className="text-base font-bold text-[#111814] uppercase">1. Information We Collect</h3>
                <p>
                  Steels Industrial Supply Ltd. collects customer information submitted via our quotation forms, including company names, contact persons, phone numbers, delivery locations, and steel requirements to generate accurate commercial quotes and manage dispatches.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-[#111814] uppercase">2. Use of Information</h3>
                <p>
                  We utilize commercial contact data strictly for business purposes: pricing calculations, logistics scheduling, test certificate delivery, and ongoing sales follow-ups. We do not sell or trade customer information to third parties.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-[#111814] uppercase">3. Data Security</h3>
                <p>
                  All quotation requests, customer records, and communication histories are maintained within secure server infrastructure with strict authentication and role-based access control.
                </p>
              </section>
            </>
          ) : (
            <>
              <section className="space-y-2">
                <h3 className="text-base font-bold text-[#111814] uppercase">1. Quotations & Validity</h3>
                <p>
                  All commercial steel prices quoted are subject to prevailing mill market rates, excise, GST, and freight adjustments. Rates are confirmed upon receipt of formal purchase order and advance payment terms.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-[#111814] uppercase">2. Certified Weighing Guarantee</h3>
                <p>
                  Every delivery is invoiced strictly on the basis of certified electronic weighbridge receipts issued at our facility. All steel dimensions conform fully to national building safety standards.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-[#111814] uppercase">3. Quality Inspection & Certificates</h3>
                <p>
                  Official Manufacturer Quality Certificates verifying genuine strength and pure steel composition are furnished with each shipment. Independent third-party inspection can also be arranged upon request.
                </p>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
