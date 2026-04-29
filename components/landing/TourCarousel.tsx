'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function TourCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Tours reales
  const tours = [
    {
      id: 'terreno-colomitos-78c9a3de',
      title: 'Terreno Colomitos',
      location: 'Colomitos',
    },
    {
      id: 'terreno-colomitos-78c9a3de', // Duplicado por ahora - agregar más tours aquí
      title: 'Villa con Vista al Mar',
      location: 'Puerto Vallarta',
    },
    {
      id: 'terreno-colomitos-78c9a3de', // Duplicado por ahora - agregar más tours aquí
      title: 'Casa en la Playa',
      location: 'Nuevo Vallarta',
    },
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % tours.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + tours.length) % tours.length);
  };

  return (
    <div className="relative w-full h-screen">
      {/* Tour Info - Floating on top */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 text-center">
        <div className="bg-black/40 backdrop-blur-md px-6 py-3 rounded-full">
          <h3 className="text-lg font-semibold text-white mb-0.5">
            {tours[currentIndex].title}
          </h3>
          <p className="text-sm text-white/80">
            {tours[currentIndex].location}
          </p>
        </div>
      </div>

      {/* iframe Container - Full Screen */}
      <div className="relative w-full h-full">
        <iframe
          key={currentIndex}
          src={`/terreno/${tours[currentIndex].id}`}
          className="w-full h-full"
          frameBorder="0"
          allowFullScreen
          loading="lazy"
        />
      </div>

      {/* Navigation Buttons - Apple Style */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white/90 backdrop-blur-md hover:bg-white rounded-full flex items-center justify-center shadow-[var(--shadow-lg)] transition-all duration-[var(--transition-base)] hover:scale-110 border border-[var(--gray-200)]"
        aria-label="Tour anterior"
      >
        <ChevronLeft className="w-7 h-7 text-[var(--gray-800)]" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white/90 backdrop-blur-md hover:bg-white rounded-full flex items-center justify-center shadow-[var(--shadow-lg)] transition-all duration-[var(--transition-base)] hover:scale-110 border border-[var(--gray-200)]"
        aria-label="Siguiente tour"
      >
        <ChevronRight className="w-7 h-7 text-[var(--gray-800)]" />
      </button>

      {/* Indicators - Apple Style Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-md px-5 py-3 rounded-full">
        {tours.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all duration-[var(--transition-base)] rounded-full ${
              index === currentIndex
                ? 'w-8 h-2 bg-white'
                : 'w-2 h-2 bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Ir al tour ${index + 1}`}
          />
        ))}
      </div>

      {/* Tour Counter */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20">
        <p className="text-sm font-medium text-white bg-black/40 backdrop-blur-md px-4 py-2 rounded-full">
          {currentIndex + 1} / {tours.length}
        </p>
      </div>
    </div>
  );
}
