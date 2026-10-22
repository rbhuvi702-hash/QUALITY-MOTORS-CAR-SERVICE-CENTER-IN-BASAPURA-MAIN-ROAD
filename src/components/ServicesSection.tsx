import React, { useState } from 'react';
import { Clock, ShieldCheck, ArrowRight, Check, X } from 'lucide-react';
import { ServiceItem } from '../types';

interface ServicesSectionProps {
  services: ServiceItem[];
  onSelectServiceForBooking: (serviceId: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  onSelectServiceForBooking,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedServiceForModal, setSelectedServiceForModal] = useState<ServiceItem | null>(null);

  const categories = ['all', 'Maintenance', 'Diagnostics', 'Safety & Brakes', 'Climate Control', 'Detailing'];

  const filteredServices = activeCategory === 'all'
    ? services
    : services.filter(s => s.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <section id="services" className="py-20 bg-slate-950 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="text-xs font-semibold tracking-wider uppercase text-amber-400">
              Workshop Capabilities & Pricing
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Expert Automobile Service & Mechanical Repairs
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Multi-brand car care executed with manufacturer-standard procedures, computerized diagnostic scanners, and certified OEM spare parts.
            </p>
          </div>

          {/* Category Filter Controls (Functional Buttons) */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-900 border border-slate-800 rounded-xl">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  activeCategory === cat
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat === 'all' ? 'All Services' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="flex flex-col justify-between rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 transition-all duration-200 overflow-hidden group"
            >
              <div>
                {/* Service Visual Frame */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-800">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  
                  {/* Category unboxed tag on image bottom */}
                  <div className="absolute bottom-3 left-4 flex items-center gap-2 text-xs font-medium text-amber-300">
                    <span>{service.category}</span>
                    <span aria-hidden="true" className="text-slate-400">·</span>
                    <span className="flex items-center gap-1 text-slate-200 font-mono tabular-nums">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      {service.durationMin} mins
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-4">
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors leading-snug">
                    {service.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed">
                    {service.shortDesc}
                  </p>

                  {/* Highlights */}
                  <ul className="space-y-1.5 pt-1">
                    {service.details.slice(0, 3).map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                        <span className="line-clamp-1">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card Footer with Price & Actions */}
              <div className="p-6 pt-0 border-t border-slate-800/60 mt-4 flex items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] text-slate-500 font-medium">Starting from</div>
                  <div className="text-xl font-extrabold text-white font-mono tabular-nums">
                    ₹{service.startingPrice.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedServiceForModal(service)}
                    className="px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => onSelectServiceForBooking(service.id)}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
                  >
                    <span>Book Slot</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service In-Depth Modal */}
      {selectedServiceForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase text-amber-400 mb-1">
                  {selectedServiceForModal.category} · {selectedServiceForModal.durationMin} mins turnaround
                </div>
                <h3 className="text-xl font-bold text-white">
                  {selectedServiceForModal.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedServiceForModal(null)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="relative h-56 rounded-xl overflow-hidden bg-slate-800">
                <img
                  src={selectedServiceForModal.image}
                  alt={selectedServiceForModal.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div>
                <h4 className="text-sm font-semibold text-white mb-2">Service Overview</h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {selectedServiceForModal.shortDesc}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Comprehensive Inclusions Checklist</span>
                </h4>
                <ul className="space-y-2.5">
                  {selectedServiceForModal.details.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 space-y-1">
                <div className="font-semibold text-slate-300">Quality Motors Workshop Guarantee:</div>
                <p>
                  All spares used are 100% genuine OEM / OES parts. No parts will be replaced without prior verbal or WhatsApp estimate confirmation from the car owner.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between gap-4">
              <div>
                <div className="text-xs text-slate-400">Standard Estimated Rate</div>
                <div className="text-2xl font-extrabold text-white font-mono tabular-nums">
                  ₹{selectedServiceForModal.startingPrice.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-slate-500">{selectedServiceForModal.priceNote}</div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedServiceForModal(null)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-lg transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const id = selectedServiceForModal.id;
                    setSelectedServiceForModal(null);
                    onSelectServiceForBooking(id);
                  }}
                  className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <span>Select & Book Time Slot</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
