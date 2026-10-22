import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
}

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      q: 'What is the standard turnaround time for a periodic car service?',
      a: 'For routine periodic maintenance (engine oil change, filter replacement, 40-point inspection, and wash), turnaround is typically 2 to 3 hours. If you book an early slot (e.g. 9:30 AM or 10:30 AM), your vehicle is generally ready before lunch. Major overhauls like clutch or suspension work may require half a day.'
    },
    {
      q: 'Do you offer pickup and drop service around Basapura & Electronic City?',
      a: 'Yes, we provide convenient driver pickup and delivery for vehicles located within a 5-8 km radius covering Basapura Main Road, Bettadasanapura, Pragathi Nagar, Electronic City Phase 1 & 2, and Singasandra.'
    },
    {
      q: 'Are the replacement spare parts 100% genuine OEM?',
      a: 'Absolutely. We strictly source genuine OEM (Original Equipment Manufacturer) and certified OES parts (Bosch, Valeo, Brembo, NGK, Mobil, Castrol, Motul). We also hand over the old replaced components for your verification upon delivery.'
    },
    {
      q: 'Will there be any hidden costs or surprise repairs on my bill?',
      a: 'Never. Our policy since 2014 has been 100% upfront transparency. Service Advisor Sanjay or your assigned technician will perform a digital inspection, send an itemized estimate with labor and parts breakdown via WhatsApp or phone call, and only commence work after your explicit authorization.'
    },
    {
      q: 'What is your appointment rescheduling and cancellation policy?',
      a: 'We understand schedules change. You can freely cancel or reschedule your reserved slot up to 2 hours before the scheduled time either online through your tracking code or with a quick WhatsApp message. No cancellation fees apply.'
    },
    {
      q: 'Which vehicle brands and makes do your technicians service?',
      a: 'We service all major passenger vehicles in India, including Maruti Suzuki, Hyundai, Tata Motors, Mahindra, Honda, Toyota, Kia, Volkswagen, Skoda, MG, Renault, Nissan, as well as premium brands like BMW, Mercedes-Benz, and Audi.'
    }
  ];

  return (
    <section id="faq" className="py-20 bg-slate-950 border-b border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-2">
          <div className="text-xs font-semibold tracking-wider uppercase text-amber-400">
            Common Questions
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-400">
            Everything you need to know about Quality Motors workshop procedures, parts guarantee, and booking.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden transition-colors hover:border-slate-700"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 text-white font-semibold text-sm sm:text-base cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-amber-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
