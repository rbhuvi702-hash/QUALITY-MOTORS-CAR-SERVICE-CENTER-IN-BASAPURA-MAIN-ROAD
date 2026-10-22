import React from 'react';
import { MapPin, Phone, MessageSquare, Shield, Clock } from 'lucide-react';
import { BusinessInfo } from '../types';

interface FooterProps {
  business: BusinessInfo | null;
  onNavigate: (id: string) => void;
  onOpenPolicy: (type: 'terms' | 'privacy' | 'cancellation') => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  business,
  onNavigate,
  onOpenPolicy,
  onOpenAdmin
}) => {
  const phone = business?.phone || '+919945574983';
  const displayPhone = business?.displayPhone || '+91 99455 74983';
  const whatsapp = business?.whatsapp || '919945574983';

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Wordmark & Heritage */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-extrabold text-xl tracking-tight">
              <span className="w-2.5 h-5 bg-amber-500 rounded-xs"></span>
              <span>Quality Motors</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Professional multi-brand automotive repair and computerized diagnostic service workshop on Basapura Main Road, Electronic City, Bengaluru.
            </p>
            <div className="text-[11px] text-slate-500 font-mono">
              Established 2014 · 4.8★ Google Verified
            </div>
          </div>

          {/* Col 2: Navigation Mirror */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Services & Pricing
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('booking')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Book Appointment Online
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Workshop Heritage
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('gallery')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Workshop Gallery
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('reviews')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Customer Reviews (38+)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Location & Driving Directions
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Workshop Contact
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-snug">
                  30, Bettadasanapura Rd, Pragathi Nagar, Basapura Main Road, Electronic City, Bengaluru 560100
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:${phone}`} className="hover:text-white font-mono">
                  {displayPhone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white"
                >
                  WhatsApp Booking Support
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                <span>Mon – Sun: 9:30 AM – 7:30 PM</span>
              </div>
            </div>
          </div>

          {/* Col 4: Policies & Staff Portal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Policies & Administration
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onOpenPolicy('cancellation')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Cancellation & Rescheduling
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy('terms')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy('privacy')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Customer Privacy Policy
                </button>
              </li>
              <li className="pt-2">
                <button
                  onClick={onOpenAdmin}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 transition-colors text-xs"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Staff / Admin Console</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Quiet Sub-footer */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Quality Motors. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>GST & UPI: Pending Owner Confirmation</span>
            <span aria-hidden="true">·</span>
            <span>Made for Bengaluru Car Owners</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
