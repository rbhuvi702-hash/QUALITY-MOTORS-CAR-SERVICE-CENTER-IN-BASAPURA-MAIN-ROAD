import React from 'react';
import { Wrench, Award, CheckCircle, Shield, Cpu, Users } from 'lucide-react';
import { BusinessInfo } from '../types';

interface AboutSectionProps {
  business: BusinessInfo | null;
  onOpenBooking: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ business, onOpenBooking }) => {
  return (
    <section id="about" className="py-20 bg-slate-950 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Image Asset Frame */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 group">
            <img
              src="/src/assets/images/service_engine_diagnostics_1792656724921.jpg"
              alt="Automotive diagnostic technician at Quality Motors"
              className="w-full h-[450px] object-cover group-hover:scale-102 transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
            
            {/* Overlay Trust Pill */}
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-slate-950/80 border border-slate-800 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
                    Basapura Main Road Facility
                  </div>
                  <div className="text-sm font-bold text-white">
                    Established 2014 · 10+ Years Serving Electronic City
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-mono font-extrabold text-amber-400">4.8★</div>
                  <div className="text-[11px] text-slate-400">Google Rating</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial & Story */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="text-xs font-semibold tracking-wider uppercase text-amber-400">
                About Quality Motors
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Independent Automotive Engineering Excellence in Electronic City
              </h2>
            </div>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Founded in 2014, Quality Motors was established to provide Bangalore vehicle owners with a credible, transparent, and high-precision alternative to expensive dealership service centers.
            </p>

            <p className="text-sm text-slate-400 leading-relaxed">
              Situated strategically on Basapura Main Road (near Bettadasanapura Road and Pragathi Nagar), our multi-bay workshop is equipped with state-of-the-art computerized diagnostic scanners, high-lift hydraulic bays, and precision disc resurfacing machinery.
            </p>

            {/* Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-white font-semibold text-sm">
                  <Cpu className="w-4 h-4 text-amber-400" />
                  <span>Computerized Diagnostics</span>
                </div>
                <p className="text-xs text-slate-400">
                  OBD-II scans and live telemetry reading for accurate root-cause fault identification.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-white font-semibold text-sm">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>100% Genuine Parts</span>
                </div>
                <p className="text-xs text-slate-400">
                  Strict policy of utilizing OEM/OES components with manufacturer packaging verification.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-white font-semibold text-sm">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span>Transparent Advisors</span>
                </div>
                <p className="text-xs text-slate-400">
                  Guided by Service Advisor Sanjay and senior technicians who explain every inspection step.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-white font-semibold text-sm">
                  <Wrench className="w-4 h-4 text-purple-400" />
                  <span>Multi-Brand Competency</span>
                </div>
                <p className="text-xs text-slate-400">
                  Comprehensive mastery over Japanese, Korean, German, and Indian passenger vehicles.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenBooking}
                className="px-6 py-3 text-xs sm:text-sm font-bold text-slate-950 bg-amber-500 rounded-lg hover:bg-amber-400 transition-colors cursor-pointer"
              >
                Schedule Vehicle Inspection
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
