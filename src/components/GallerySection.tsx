import React, { useState } from 'react';
import { ZoomIn, X } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
}

export const GallerySection: React.FC = () => {
  const [activeImage, setActiveImage] = useState<GalleryItem | null>(null);

  const galleryItems: GalleryItem[] = [
    {
      id: 'gal-1',
      title: 'Modern Service Workshop & Hydraulic Lifts',
      subtitle: 'Clean multi-bay garage with organized tooling and hydraulic hoists',
      image: '/src/assets/images/hero_car_workshop_1792656724235.jpg'
    },
    {
      id: 'gal-2',
      title: 'Digital Diagnostic Bay & OBD-II Scanner',
      subtitle: 'Real-time engine telemetry, sensor testing, and ECU programming',
      image: '/src/assets/images/service_engine_diagnostics_1792656724921.jpg'
    },
    {
      id: 'gal-3',
      title: 'Precision Brake Rotor & Caliper Station',
      subtitle: 'Disc thickness measurement, rotor resurfacing, and high-temp synthetic lubrication',
      image: '/src/assets/images/service_brake_suspension_1792656726008.jpg'
    },
    {
      id: 'gal-4',
      title: 'Dual-Action Machine Paint Polishing & Detailing',
      subtitle: 'Deep swirl elimination, foam decontamination, and ceramic gloss protection',
      image: '/src/assets/images/service_detailing_polish_1792656725417.jpg'
    }
  ];

  return (
    <section id="gallery" className="py-20 bg-slate-950 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="text-xs font-semibold tracking-wider uppercase text-amber-400">
            Workshop Environment
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Inside Quality Motors
          </h2>
          <p className="text-sm text-slate-400">
            A glimpse into our workshop facilities, high-precision equipment, and service bays located on Basapura Main Road.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveImage(item)}
              className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 cursor-pointer h-72 transition-all hover:border-slate-700"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />

              <div className="absolute bottom-4 left-4 right-4 space-y-1">
                <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-[11px] text-slate-400 line-clamp-1">
                  {item.subtitle}
                </p>
              </div>

              <div className="absolute top-3 right-3 p-2 rounded-lg bg-slate-950/60 backdrop-blur-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-4 h-4 text-amber-400" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div
          onClick={() => setActiveImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl"
          >
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 z-10 p-2 text-white bg-slate-950/70 rounded-full hover:bg-slate-800 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative h-[480px] bg-slate-950">
              <img
                src={activeImage.image}
                alt={activeImage.title}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="p-6 bg-slate-900 border-t border-slate-800">
              <h3 className="text-lg font-bold text-white">{activeImage.title}</h3>
              <p className="text-xs text-slate-400 mt-1">{activeImage.subtitle}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
