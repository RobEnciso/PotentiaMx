export default function SocialProofSection() {
  const partners = [
    { name: 'Partner 1', width: 120 },
    { name: 'Partner 2', width: 140 },
    { name: 'Partner 3', width: 130 },
    { name: 'Partner 4', width: 120 },
    { name: 'Partner 5', width: 135 },
  ];

  return (
    <section className="py-20 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <p className="text-center text-xs font-semibold text-[var(--gray-500)] mb-16 uppercase tracking-[0.05em]">
          Colaboramos con
        </p>

        <div className="flex flex-wrap items-center justify-center gap-12 sm:gap-16 lg:gap-20">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-[var(--transition-base)] opacity-40 hover:opacity-100"
            >
              {/* Placeholder logo - replace with actual logos */}
              <div
                className="bg-[var(--gray-100)] rounded-[var(--radius-md)] flex items-center justify-center border border-[var(--gray-200)]"
                style={{ width: `${partner.width}px`, height: '60px' }}
              >
                <span className="text-[var(--gray-600)] font-semibold text-xs">
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
