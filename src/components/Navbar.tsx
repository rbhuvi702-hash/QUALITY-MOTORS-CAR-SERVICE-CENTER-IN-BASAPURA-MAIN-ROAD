import React, { useState } from 'react';
import { Menu, X, Shield, PhoneCall } from 'lucide-react';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  onOpenBooking: (serviceId?: string) => void;
  onOpenAdmin: () => void;
  phone: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigate,
  onOpenBooking,
  onOpenAdmin,
  phone
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single Element) */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('home');
          }}
          className="text-xl sm:text-2xl font-extrabold tracking-tight text-white hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span className="w-2.5 h-6 bg-amber-500 rounded-xs inline-block"></span>
          <span>Quality Motors</span>
        </a>

        {/* Zone 2: 4-5 Single-Line Concise Nav Links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-300">
          <button
            onClick={() => handleNavClick('services')}
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0"
          >
            Services & Pricing
          </button>
          <button
            onClick={() => handleNavClick('booking')}
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0"
          >
            Book Appointment
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0"
          >
            About & Workshop
          </button>
          <button
            onClick={() => handleNavClick('reviews')}
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0"
          >
            Customer Reviews
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0"
          >
            Find Workshop
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action (+ Admin & Mobile toggles) */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href={`tel:${phone}`}
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 hover:text-white transition-colors whitespace-nowrap shrink-0"
            title="Call Workshop"
          >
            <PhoneCall className="w-3.5 h-3.5 text-amber-500" />
            <span>+91 99455 74983</span>
          </a>

          <button
            onClick={() => onOpenBooking()}
            className="px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-slate-950 bg-amber-500 rounded-lg hover:bg-amber-400 transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            Book Appointment
          </button>

          <button
            onClick={onOpenAdmin}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-200 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
            title="Open Workshop Admin Panel & Bookings"
            aria-label="Admin Panel"
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Admin Panel</span>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-900 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950 px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => handleNavClick('services')}
              className="text-left py-2 px-3 text-base font-medium text-slate-200 hover:bg-slate-900 rounded-md"
            >
              Services & Pricing
            </button>
            <button
              onClick={() => handleNavClick('booking')}
              className="text-left py-2 px-3 text-base font-medium text-slate-200 hover:bg-slate-900 rounded-md"
            >
              Book Appointment
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className="text-left py-2 px-3 text-base font-medium text-slate-200 hover:bg-slate-900 rounded-md"
            >
              About & Workshop
            </button>
            <button
              onClick={() => handleNavClick('reviews')}
              className="text-left py-2 px-3 text-base font-medium text-slate-200 hover:bg-slate-900 rounded-md"
            >
              Customer Reviews
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="text-left py-2 px-3 text-base font-medium text-slate-200 hover:bg-slate-900 rounded-md"
            >
              Find Workshop & Directions
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="text-left py-2 px-3 text-base font-medium text-amber-400 hover:bg-slate-900 rounded-md flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              <span>Staff / Admin Console</span>
            </button>
          </div>
          <div className="pt-2 border-t border-slate-800 flex gap-2">
            <a
              href={`tel:${phone}`}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold text-white bg-slate-900 border border-slate-800 rounded-lg"
            >
              <PhoneCall className="w-4 h-4 text-amber-400" />
              <span>Call Workshop</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
