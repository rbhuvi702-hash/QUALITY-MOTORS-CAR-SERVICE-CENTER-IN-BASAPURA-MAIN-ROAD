import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { BookingWizard } from './components/BookingWizard';
import { AboutSection } from './components/AboutSection';
import { GallerySection } from './components/GallerySection';
import { ReviewsSection } from './components/ReviewsSection';
import { ContactSection } from './components/ContactSection';
import { FAQSection } from './components/FAQSection';
import { PoliciesModal } from './components/PoliciesModal';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { BusinessInfo, ServiceItem, StaffMember, ReviewItem, Appointment } from './types';
import { api } from './services/api';
import { AlertCircle, X } from 'lucide-react';

export default function App() {
  const [business, setBusiness] = useState<BusinessInfo | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modal states
  const [policyModalType, setPolicyModalType] = useState<'terms' | 'privacy' | 'cancellation' | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [preSelectedServiceId, setPreSelectedServiceId] = useState<string | undefined>(undefined);
  const [showOwnerBanner, setShowOwnerBanner] = useState<boolean>(true);

  // Load initial data
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [info, srvs, stf, revs] = await Promise.all([
          api.getBusinessInfo(),
          api.getServices(),
          api.getStaff(),
          api.getReviews(),
        ]);
        setBusiness(info);
        setServices(srvs);
        setStaff(stf);
        setReviews(revs);
      } catch (err) {
        console.error('Failed to load application data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();

    // Check for #admin in URL
    if (window.location.hash === '#admin') {
      setIsAdminOpen(true);
    }

    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setIsAdminOpen(true);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Smooth scroll handler
  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Open booking with preselected service
  const handleOpenBooking = (serviceId?: string) => {
    if (serviceId) {
      setPreSelectedServiceId(serviceId);
    }
    handleNavigate('booking');
  };

  const handleReviewAdded = (newReview: ReviewItem) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  const handleBookingSuccess = (_appointment: Appointment) => {
    // Appointment successfully confirmed
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <div className="text-sm font-semibold tracking-wider uppercase text-amber-400 font-mono">
          Loading Quality Motors...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Informative Owner Verification Ribbon */}
      {showOwnerBanner && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-xs text-amber-200">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Verified Google Maps Listing:</strong> Quality Motors, Basapura Main Road, Electronic City (+91 99455 74983 · 4.8★). Some settings (workshop UPI QR & SMS gateway) are marked for owner confirmation in the staff portal.
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsAdminOpen(true)}
                className="underline hover:text-white font-semibold cursor-pointer"
              >
                View Checklist
              </button>
              <button
                onClick={() => setShowOwnerBanner(false)}
                className="text-amber-400 hover:text-white p-0.5"
                aria-label="Dismiss banner"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Top Bar */}
      <Navbar
        onNavigate={handleNavigate}
        onOpenBooking={() => handleOpenBooking()}
        onOpenAdmin={() => setIsAdminOpen(true)}
        phone={business?.phone || '+919945574983'}
      />

      {/* Main Page Flow */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          business={business}
          onOpenBooking={() => handleOpenBooking()}
          onNavigate={handleNavigate}
        />

        {/* Services & Pricing Section */}
        <ServicesSection
          services={services}
          onSelectServiceForBooking={(serviceId) => handleOpenBooking(serviceId)}
        />

        {/* Live Booking Wizard */}
        <BookingWizard
          services={services}
          staff={staff}
          business={business}
          preSelectedServiceId={preSelectedServiceId}
          onBookingSuccess={handleBookingSuccess}
        />

        {/* About & Technical Workshop Pillars */}
        <AboutSection
          business={business}
          onOpenBooking={() => handleOpenBooking()}
        />

        {/* Workshop Environment Gallery */}
        <GallerySection />

        {/* Verified Customer Reviews */}
        <ReviewsSection
          reviews={reviews}
          onReviewAdded={handleReviewAdded}
        />

        {/* Contact, Directions & Hours */}
        <ContactSection business={business} />

        {/* Frequently Asked Questions */}
        <FAQSection />
      </main>

      {/* Quiet Footer */}
      <Footer
        business={business}
        onNavigate={handleNavigate}
        onOpenPolicy={(type) => setPolicyModalType(type)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Policy Modals */}
      <PoliciesModal
        type={policyModalType}
        onClose={() => setPolicyModalType(null)}
      />

      {/* Staff & Admin Console */}
      {isAdminOpen && (
        <AdminDashboard
          onClose={() => setIsAdminOpen(false)}
          business={business}
          services={services}
          staff={staff}
          onServicesUpdated={(updatedServices) => setServices(updatedServices)}
        />
      )}
    </div>
  );
}
