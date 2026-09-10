import React from 'react';

export const StatsSection: React.FC = () => {
  const stats = [
    { value: '500,000+', label: 'Metric Tons Supplied', sub: 'Across Tier 1 Infrastructure' },
    { value: '1,250+', label: 'Commercial Projects', sub: 'Bridges, Metro & PEB Sheds' },
    { value: '28+', label: 'Years in Steel Trade', sub: 'Established Credibility' },
    { value: '120+', label: 'Industrial Cities', sub: 'Pan-India Distribution Reach' },
  ];

  return (
    <section className="py-16 bg-steel-darkest border-t border-steel-rich/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-steel-rich/60">
          {stats.map((stat, i) => (
            <div key={i} className={`pt-6 sm:pt-0 ${i > 0 ? 'sm:pl-8' : ''}`}>
              <div className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-1 font-sans">
                {stat.value}
              </div>
              <div className="text-sm font-bold text-emerald-400 uppercase tracking-wider">{stat.label}</div>
              <div className="text-xs text-steel-olive mt-1">{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
