import React from 'react';
import { MapPin, Phone, MessageSquare, Clock, Navigation, AlertCircle, Compass } from 'lucide-react';
import { BusinessInfo } from '../types';

interface ContactSectionProps {
  business: BusinessInfo | null;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ business }) => {
  const phone = business?.phone || '+919945574983';
  const displayPhone = business?.displayPhone || '+91 99455 74983';
  const whatsapp = business?.whatsapp || '919945574983';
  const googleMapsUrl = business?.googleMapsUrl || 'https://maps.app.goo.gl/pAJ8AqN1PUp49bwq6';

  return (
    <section id="contact" className="py-20 bg-slate-950 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="text-xs font-semibold tracking-wider uppercase text-amber-400">
            Location & Direct Contact
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Visit Quality Motors Workshop
          </h2>
          <p className="text-sm text-slate-400">
            Located on Basapura Main Road, conveniently accessible from Electronic City, Bettadasanapura, and Hosur Road.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Address Card */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white">Workshop Address</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    30, Chikkathogur Post, 1, Bettadasanapura Rd, Pragathi Nagar, Basapura Main Road, Electronic City, Bengaluru, Karnataka 560100
                  </p>
                  <div className="pt-2">
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
                    >
                      <span>Open in Google Maps Navigation</span>
                      <Navigation className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Calling & WhatsApp Card */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h3 className="text-xs text-slate-400">Direct Workshop Phone</h3>
                    <div className="text-sm font-extrabold text-white font-mono">{displayPhone}</div>
                  </div>
                </div>
                <a
                  href={`tel:${phone}`}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors"
                >
                  Call Now
                </a>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h3 className="text-xs text-slate-400">WhatsApp Desk</h3>
                    <div className="text-xs font-semibold text-slate-200">Instant Estimate & Queries</div>
                  </div>
                </div>
                <a
                  href={`https://wa.me/${whatsapp}?text=${encodeURIComponent('Hi Quality Motors, I need an inquiry regarding car service at Basapura Main Road.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-800 rounded-lg hover:bg-emerald-950 transition-colors"
                >
                  Chat
                </a>
              </div>
            </div>

            {/* Operating Hours Card */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2.5 text-white font-bold text-sm">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Working Hours & Schedule</span>
              </div>

              <div className="text-xs space-y-2 text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Monday – Saturday</span>
                  <span className="font-mono text-white font-semibold">9:30 AM – 7:30 PM</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Sunday</span>
                  <span className="font-mono text-white font-semibold">9:30 AM – 7:30 PM</span>
                </div>
                <div className="flex justify-between py-1 text-emerald-400">
                  <span>Breakdown Assistance</span>
                  <span className="font-mono font-bold">24 Hours / 7 Days</span>
                </div>
              </div>
            </div>

            {/* Landmarks / Driving Directions */}
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-slate-300">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>How to Reach Us:</span>
              </div>
              <p>
                From Hosur Road / Electronic City Toll: Take Bettadasanapura Road towards Pragathi Nagar. Continue onto Basapura Main Road. Quality Motors is clearly signposted with wide roadside parking bays.
              </p>
            </div>
          </div>

          {/* Interactive Google Map Visual (7 cols) */}
          <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 h-[480px] relative shadow-xl">
            <iframe
              title="Quality Motors Google Maps Location"
              src="https://maps.google.com/maps?q=12.8628481,77.6495644&hl=en&z=16&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(105%)' }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            
            {/* Map Overlay Badge */}
            <div className="absolute top-4 left-4 p-3 rounded-xl bg-slate-950/90 border border-slate-800 backdrop-blur-md shadow-lg max-w-xs space-y-1">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Quality Motors Car Service Center</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Basapura Main Road, Pragathi Nagar, Electronic City
              </p>
              <div className="pt-1 flex items-center gap-2">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-bold text-amber-400 hover:underline"
                >
                  Get Route Directions →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
