export default function SocialProofSection() {
  const partners = [
    { name: 'Partner 1', width: 120 },
    { name: 'Partner 2', width: 140 },
    { name: 'Partner 3', width: 130 },
    { name: 'Partner 4', width: 120 },
    { name: 'Partner 5', width: 135 },
  ];

  return (
    <section className="py-16 sm:py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <p className="text-center text-sm sm:text-base font-medium text-slate-500 mb-12 uppercase tracking-wider">
          Colaboramos con
        </p>

        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 lg:gap-16">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
            >
              {/* Placeholder logo - replace with actual logos */}
              <div
                className="bg-slate-300 rounded-lg flex items-center justify-center"
                style={{ width: `${partner.width}px`, height: '60px' }}
              >
                <span className="text-slate-600 font-semibold text-xs">
                  {partner.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
