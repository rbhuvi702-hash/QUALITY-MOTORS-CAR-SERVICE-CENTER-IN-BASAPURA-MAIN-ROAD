import React from 'react';
import { X, ShieldCheck } from 'lucide-react';

interface PoliciesModalProps {
  type: 'terms' | 'privacy' | 'cancellation' | null;
  onClose: () => void;
}

export const PoliciesModal: React.FC<PoliciesModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[85vh] space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <span>
              {type === 'terms' && 'Terms of Service & Workshop Guidelines'}
              {type === 'privacy' && 'Customer Privacy & Data Protection Policy'}
              {type === 'cancellation' && 'Appointment Cancellation & Rescheduling Policy'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-xs sm:text-sm text-slate-300 space-y-4 leading-relaxed">
          {type === 'cancellation' && (
            <>
              <p>
                At Quality Motors, we respect your time and schedule changes. Our cancellation and slot modification guidelines are structured as follows:
              </p>
              <h4 className="font-bold text-white text-sm">1. Free Cancellation & Rescheduling</h4>
              <p>
                Appointments can be rescheduled or cancelled with zero fee or penalty up to 2 hours prior to your scheduled bay intake time. You can reschedule online using your booking tracking ID or by messaging our WhatsApp support desk at +91 99455 74983.
              </p>
              <h4 className="font-bold text-white text-sm">2. Punctuality & Grace Period</h4>
              <p>
                To ensure all vehicle bays operate smoothly without delays, we maintain a 20-minute arrival grace period. If you expect a delay due to Bangalore traffic, please let your service advisor know in advance.
              </p>
              <h4 className="font-bold text-white text-sm">3. No Mandatory Advance Payment</h4>
              <p>
                Slot reservations do not require advance token payments. All service charges, parts costs, and diagnostic fees are payable only upon physical inspection, estimate authorization, and vehicle delivery.
              </p>
            </>
          )}

          {type === 'terms' && (
            <>
              <p>
                Welcome to Quality Motors - Car Service Center located on Basapura Main Road, Electronic City, Bengaluru.
              </p>
              <h4 className="font-bold text-white text-sm">1. Vehicle Intake & Inspection</h4>
              <p>
                Every car entering our workshop undergoes an initial multi-point condition assessment. Our advisors document existing cosmetic dents, scratches, fuel levels, and odometer reading in an intake log.
              </p>
              <h4 className="font-bold text-white text-sm">2. Pre-Repair Estimate Authorization</h4>
              <p>
                No mechanical, electrical, or structural replacement will be initiated without explicit prior customer approval via phone call, SMS, or WhatsApp message.
              </p>
              <h4 className="font-bold text-white text-sm">3. Parts & Labor Warranty</h4>
              <p>
                All OEM replacement spares carry standard manufacturer warranties against manufacturing defects. Mechanical labor is backed by a 30-day or 1,000 km workmanship guarantee.
              </p>
            </>
          )}

          {type === 'privacy' && (
            <>
              <p>
                Quality Motors is dedicated to safeguarding customer privacy. We collect only necessary vehicle information (make, model, fuel type, registration number) and contact credentials (name, phone number, email) to manage appointments and share service updates.
              </p>
              <h4 className="font-bold text-white text-sm">1. Information Usage</h4>
              <p>
                Your phone number is used exclusively for appointment verification, repair estimates, and vehicle readiness alerts. We do not sell or lease customer numbers to third-party telemarketers.
              </p>
              <h4 className="font-bold text-white text-sm">2. Data Security</h4>
              <p>
                Customer records are protected on secure database instances with restricted administrator access controls.
              </p>
            </>
          )}
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
