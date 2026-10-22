import React from 'react';
import { Calendar, Phone, MapPin, CheckCircle2, MessageSquare } from 'lucide-react';
import { BusinessInfo } from '../types';

interface HeroProps {
  business: BusinessInfo | null;
  onOpenBooking: () => void;
  onNavigate: (id: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ business, onOpenBooking, onNavigate }) => {
  const phone = business?.phone || '+919945574983';
  const whatsapp = business?.whatsapp || '919945574983';

  return (
    <section id="home" className="relative w-full overflow-hidden bg-slate-950">
      {/* Hero Visual Container */}
      <div className="relative min-h-[580px] lg:min-h-[640px] flex items-center">
        {/* Background Workshop Image with Measured Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/hero_car_workshop_1792656724235.jpg"
            alt="Quality Motors modern automobile service workshop"
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-2xl space-y-6">
            {/* Clean unboxed kicker metadata */}
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-amber-400">
              <span>Basapura Main Road</span>
              <span aria-hidden="true" className="text-slate-500">·</span>
              <span>Electronic City, Bengaluru</span>
              <span aria-hidden="true" className="text-slate-500">·</span>
              <span>Est. 2014</span>
            </div>

            {/* Display Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white text-balance leading-tight">
              Precision Multi-Brand Auto Service & Computerized Diagnostics
            </h1>

            {/* Value Proposition */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Complete vehicle care by certified technicians. From periodic maintenance and computer ECU scans to suspension overhauls and AC service—with 100% genuine spares and transparent upfront estimates.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenBooking}
                className="px-6 py-3.5 text-sm sm:text-base font-bold text-slate-950 bg-amber-500 rounded-lg hover:bg-amber-400 transition-colors inline-flex items-center gap-2.5 shadow-md shadow-amber-500/10 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-slate-950" />
                <span>Book Appointment Online</span>
              </button>

              <a
                href={`tel:${phone}`}
                className="px-5 py-3.5 text-sm sm:text-base font-semibold text-white bg-slate-900 border border-slate-700/80 rounded-lg hover:bg-slate-800 transition-colors inline-flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>Call +91 99455 74983</span>
              </a>

              <a
                href={`https://wa.me/${whatsapp}?text=${encodeURIComponent('Hello Quality Motors, I would like to book a car service slot.')}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-3.5 text-sm font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 rounded-lg hover:bg-emerald-950/70 transition-colors inline-flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Workshop</span>
              </a>
            </div>

            {/* Address Hint */}
            <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
              <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
              <span>30, Bettadasanapura Rd, Pragathi Nagar, Basapura Main Road</span>
              <button
                onClick={() => onNavigate('contact')}
                className="text-amber-400 hover:underline ml-1 font-medium"
              >
                View Map & Directions →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4-Item Proof & Trust Metric Strip */}
      <div className="border-y border-slate-800 bg-slate-900/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums flex items-center gap-1.5">
                <span className="text-amber-400">4.8</span>
                <span className="text-amber-400 text-lg">★</span>
              </div>
              <p className="text-xs text-slate-400">
                Verified Google & local customer rating across 38+ real reviews.
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
                <span>10+ Years</span>
              </div>
              <p className="text-xs text-slate-400">
                Established in 2014, serving Basapura & Electronic City car owners.
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
                <span>40-Point</span>
              </div>
              <p className="text-xs text-slate-400">
                Comprehensive digital multi-point health check with clear technician report.
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono tabular-nums flex items-center gap-1.5">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                <span>100% Genuine</span>
              </div>
              <p className="text-xs text-slate-400">
                Guaranteed OEM & OES spare parts with upfront repair authorization.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
