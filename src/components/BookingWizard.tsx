import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Car,
  User,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CalendarDays,
  ShieldCheck,
  MapPin,
  MessageSquare,
  FileText
} from 'lucide-react';
import { ServiceItem, StaffMember, AvailableSlot, Appointment, BusinessInfo } from '../types';
import { api } from '../services/api';

interface BookingWizardProps {
  services: ServiceItem[];
  staff: StaffMember[];
  business: BusinessInfo | null;
  preSelectedServiceId?: string;
  onBookingSuccess?: (appointment: Appointment) => void;
}

export const BookingWizard: React.FC<BookingWizardProps> = ({
  services,
  staff,
  business,
  preSelectedServiceId,
  onBookingSuccess
}) => {
  // Step navigation (1: Service & Car, 2: Advisor, 3: Date & Slot, 4: Contact, 5: Review, 6: Confirmed)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form states
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    preSelectedServiceId || (services[0]?.id || '')
  );
  const [vehicleMake, setVehicleMake] = useState<string>('Hyundai');
  const [vehicleModel, setVehicleModel] = useState<string>('');
  const [vehicleNumber, setVehicleNumber] = useState<string>('');
  const [fuelType, setFuelType] = useState<string>('Petrol');

  const [selectedStaffId, setSelectedStaffId] = useState<string>('any');

  // Date defaults to today or tomorrow
  const getTodayString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [slotsLoading, setSlotsLoading] = useState<boolean>(false);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [isDateBlocked, setIsDateBlocked] = useState<boolean>(false);
  const [blockedReason, setBlockedReason] = useState<string>('');

  // Customer details
  const [customerName, setCustomerName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  // Update selected service if prop changes
  useEffect(() => {
    if (preSelectedServiceId) {
      setSelectedServiceId(preSelectedServiceId);
    }
  }, [preSelectedServiceId]);

  // Fetch slots whenever selectedDate or selectedStaffId changes
  useEffect(() => {
    let isCancelled = false;

    async function loadAvailability() {
      if (!selectedDate) return;
      setSlotsLoading(true);
      setSubmissionError(null);

      try {
        const resp = await api.getAvailability(selectedDate, selectedStaffId);
        if (!isCancelled) {
          setIsDateBlocked(resp.isBlocked);
          setBlockedReason(resp.reason || '');
          setAvailableSlots(resp.slots || []);
          
          // Clear time slot if it's no longer available
          if (selectedTimeSlot) {
            const currentSlot = resp.slots?.find(s => s.time === selectedTimeSlot);
            if (!currentSlot || !currentSlot.available) {
              setSelectedTimeSlot('');
            }
          }
        }
      } catch (err: any) {
        if (!isCancelled) {
          console.error(err);
          setSubmissionError('Could not fetch real-time slot availability. Please try again.');
        }
      } finally {
        if (!isCancelled) setSlotsLoading(false);
      }
    }

    loadAvailability();

    return () => {
      isCancelled = true;
    };
  }, [selectedDate, selectedStaffId]);

  const selectedService = services.find(s => s.id === selectedServiceId) || services[0];
  const selectedStaffObj = staff.find(st => st.id === selectedStaffId);

  // Step 1 Validation
  const canProceedStep1 = selectedServiceId && vehicleMake && vehicleModel.trim() && vehicleNumber.trim();
  
  // Step 3 Validation
  const canProceedStep3 = selectedDate && selectedTimeSlot && !isDateBlocked;

  // Step 4 Validation
  const canProceedStep4 = customerName.trim() && phone.trim().length >= 10;

  // Final Submit Handler
  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const response = await api.createAppointment({
        customerName,
        phone,
        email,
        vehicleMake,
        vehicleModel,
        vehicleNumber,
        fuelType,
        serviceId: selectedServiceId,
        staffId: selectedStaffId,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        notes
      });

      setConfirmedAppointment(response.data);
      setCurrentStep(6); // Step 6 is confirmed state
      if (onBookingSuccess) {
        onBookingSuccess(response.data);
      }
    } catch (err: any) {
      setSubmissionError(err.message || 'Slot reservation failed. The selected bay may have just been reserved.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setConfirmedAppointment(null);
    setSelectedTimeSlot('');
    setNotes('');
  };

  return (
    <section id="booking" className="py-20 bg-slate-950 border-b border-slate-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="text-xs font-semibold tracking-wider uppercase text-amber-400">
            Live Appointment Reservation
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Book Your Automobile Service
          </h2>
          <p className="text-sm text-slate-400">
            Guaranteed slot allocation with certified technicians. Real-time bay conflict prevention.
          </p>
        </div>

        {/* Step Indicator Bar */}
        {currentStep < 6 && (
          <div className="mb-10 p-2 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between text-xs font-medium">
            {[
              { num: 1, label: 'Vehicle & Service' },
              { num: 2, label: 'Service Advisor' },
              { num: 3, label: 'Date & Time' },
              { num: 4, label: 'Owner Details' },
              { num: 5, label: 'Review & Confirm' }
            ].map((s) => (
              <div
                key={s.num}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-1 text-center border-b-2 transition-colors ${
                  currentStep === s.num
                    ? 'border-amber-500 text-amber-400 font-bold'
                    : currentStep > s.num
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-500'
                }`}
              >
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-mono border border-current shrink-0">
                  {s.num}
                </span>
                <span className="hidden sm:inline whitespace-nowrap">{s.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Booking Card Frame */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          {/* STEP 1: SERVICE & VEHICLE */}
          {currentStep === 1 && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">
                  1. Choose Automotive Service
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Select the core service package needed for your vehicle.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                  {services.map((srv) => (
                    <div
                      key={srv.id}
                      onClick={() => setSelectedServiceId(srv.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        selectedServiceId === srv.id
                          ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500'
                          : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-semibold text-sm text-white">{srv.title}</span>
                        <span className="text-xs font-mono font-bold text-amber-400 tabular-nums">
                          ₹{srv.startingPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2">{srv.shortDesc}</p>
                      <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-amber-500" />
                        <span>Approx. {srv.durationMin} mins</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <h3 className="text-lg font-bold text-white mb-1">
                  Vehicle Information
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Used by our technicians to prepare appropriate diagnostic profiles and spares.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Car Brand / Make *
                    </label>
                    <select
                      value={vehicleMake}
                      onChange={(e) => setVehicleMake(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="Hyundai">Hyundai</option>
                      <option value="Maruti Suzuki">Maruti Suzuki</option>
                      <option value="Tata">Tata Motors</option>
                      <option value="Mahindra">Mahindra</option>
                      <option value="Honda">Honda</option>
                      <option value="Toyota">Toyota</option>
                      <option value="Kia">Kia</option>
                      <option value="Volkswagen">Volkswagen</option>
                      <option value="Skoda">Skoda</option>
                      <option value="MG">MG Motor</option>
                      <option value="Renault">Renault</option>
                      <option value="BMW">BMW</option>
                      <option value="Mercedes-Benz">Mercedes-Benz</option>
                      <option value="Audi">Audi</option>
                      <option value="Other">Other Make</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Model / Variant *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Creta SX / Swift Dzire"
                      value={vehicleModel}
                      onChange={(e) => setVehicleModel(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Registration Number *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. KA 51 ME 4821"
                      value={vehicleNumber}
                      onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white uppercase placeholder-slate-600 font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Fuel Type
                    </label>
                    <select
                      value={fuelType}
                      onChange={(e) => setFuelType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="CNG">CNG / Petrol</option>
                      <option value="Electric">Electric (EV)</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  disabled={!canProceedStep1}
                  onClick={() => setCurrentStep(2)}
                  className={`px-6 py-3 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors ${
                    canProceedStep1
                      ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 cursor-pointer'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <span>Continue to Advisor Selection</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: SERVICE SPECIALIST */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">
                  2. Select Workshop Advisor / Technician
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Choose a dedicated advisor or allow the workshop manager to allocate the earliest available bay specialist.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Any Specialist Option */}
                  <div
                    onClick={() => setSelectedStaffId('any')}
                    className={`p-5 rounded-xl border cursor-pointer transition-all ${
                      selectedStaffId === 'any'
                        ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500'
                        : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-white text-base">Any Available Specialist</span>
                      <span className="text-[11px] font-semibold text-emerald-400">Earliest Bay Slot</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Recommended. Your car will be assigned to whichever certified bay technician has first availability at your selected time.
                    </p>
                  </div>

                  {/* Specific Staff */}
                  {staff.map((st) => (
                    <div
                      key={st.id}
                      onClick={() => setSelectedStaffId(st.id)}
                      className={`p-5 rounded-xl border cursor-pointer transition-all ${
                        selectedStaffId === st.id
                          ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500'
                          : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-white text-base">{st.name}</span>
                        {st.id === 'sanjay' && (
                          <span className="text-[11px] font-semibold text-amber-400">Mentioned in Reviews</span>
                        )}
                      </div>
                      <div className="text-xs text-amber-300 font-medium mb-1.5">{st.role}</div>
                      <p className="text-xs text-slate-400">{st.specialty}</p>
                      <div className="mt-2 text-[11px] text-slate-500 font-mono">{st.experience}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Select Date & Time Slot</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: DATE & LIVE TIME SLOT */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">
                  3. Select Date & Live Workshop Slot
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Indian Standard Time (IST). Workshop operating hours: 9:30 AM to 7:30 PM.
                </p>

                {/* Date Picker Input */}
                <div className="max-w-xs mb-6">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Appointment Date *
                  </label>
                  <input
                    type="date"
                    min={getTodayString()}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-amber-500 cursor-pointer"
                  />
                </div>

                {/* Closed / Blocked Notice */}
                {isDateBlocked && (
                  <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-300 text-xs flex items-start gap-2.5 mb-6">
                    <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-bold">Workshop Closed on This Date</div>
                      <div>{blockedReason || 'Please pick another working day for your booking.'}</div>
                    </div>
                  </div>
                )}

                {/* Slots Grid */}
                {!isDateBlocked && (
                  <div>
                    <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
                      <span>Available Time Slots for {selectedDate}</span>
                      {slotsLoading && (
                        <span className="flex items-center gap-1.5 text-amber-400">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Checking bay availability...</span>
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                      {availableSlots.map((slot) => {
                        const isSelected = selectedTimeSlot === slot.time;
                        return (
                          <button
                            key={slot.time}
                            disabled={!slot.available}
                            onClick={() => setSelectedTimeSlot(slot.time)}
                            className={`p-3 rounded-xl border text-center transition-all ${
                              isSelected
                                ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold shadow-sm'
                                : slot.available
                                ? 'bg-slate-950/60 border-slate-800 text-slate-200 hover:border-amber-500/60 cursor-pointer'
                                : 'bg-slate-950/20 border-slate-900 text-slate-600 cursor-not-allowed opacity-50'
                            }`}
                          >
                            <div className="text-xs font-mono font-bold tracking-tight">{slot.time}</div>
                            <div className="text-[10px] mt-1">
                              {slot.available ? (
                                <span className={isSelected ? 'text-slate-900 font-medium' : 'text-emerald-400 font-medium'}>
                                  {slot.remainingBays} Bay{slot.remainingBays > 1 ? 's' : ''} Open
                                </span>
                              ) : (
                                <span className="text-slate-500">Booked</span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  disabled={!canProceedStep3}
                  onClick={() => setCurrentStep(4)}
                  className={`px-6 py-3 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors ${
                    canProceedStep3
                      ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 cursor-pointer'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <span>Enter Contact Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: CUSTOMER CONTACT DETAILS */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">
                  4. Vehicle Owner Details
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  We will send appointment confirmation and live service status updates to this contact.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="e.g. Ramesh Kumar"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Phone Number (WhatsApp Verified) *
                    </label>
                    <div className="relative">
                      <span className="text-slate-500 text-xs font-mono absolute left-3 top-3">+91</span>
                      <input
                        type="tel"
                        placeholder="98450 12345"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-12 pr-3 py-2.5 text-sm text-white placeholder-slate-600 font-mono focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Email Address (Optional - For Digital Invoice & Summary)
                    </label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Specific Issues or Symptoms to Check (Optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Strange clicking noise when turning steering full right; AC not cooling adequately in afternoon traffic."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  disabled={!canProceedStep4}
                  onClick={() => setCurrentStep(5)}
                  className={`px-6 py-3 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors ${
                    canProceedStep4
                      ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 cursor-pointer'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <span>Review Booking Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: REVIEW & FINAL CONFIRMATION */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">
                  5. Review & Confirm Appointment
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Please verify your details before submitting to our workshop scheduling system.
                </p>

                {submissionError && (
                  <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs flex items-start gap-2.5 mb-4">
                    <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-bold">Booking Conflict Error</div>
                      <div>{submissionError}</div>
                    </div>
                  </div>
                )}

                <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-500">Service:</span>
                      <div className="font-bold text-white text-sm mt-0.5">{selectedService.title}</div>
                      <div className="text-amber-400 font-mono mt-0.5">
                        ₹{selectedService.startingPrice.toLocaleString('en-IN')} (Starting rate)
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-500">Vehicle:</span>
                      <div className="font-bold text-white text-sm mt-0.5">
                        {vehicleMake} {vehicleModel} ({fuelType})
                      </div>
                      <div className="text-slate-400 font-mono">{vehicleNumber}</div>
                    </div>

                    <div>
                      <span className="text-slate-500">Date & Slot:</span>
                      <div className="font-bold text-white text-sm mt-0.5">
                        {selectedDate} at {selectedTimeSlot}
                      </div>
                      <div className="text-slate-400 font-mono">Indian Standard Time (IST)</div>
                    </div>

                    <div>
                      <span className="text-slate-500">Assigned Specialist:</span>
                      <div className="font-bold text-white text-sm mt-0.5">
                        {selectedStaffObj ? selectedStaffObj.name : 'Any Available Bay Advisor'}
                      </div>
                      <div className="text-slate-400">
                        {selectedStaffObj ? selectedStaffObj.role : 'Automatic Allocation'}
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-500">Customer:</span>
                      <div className="font-semibold text-white mt-0.5">{customerName}</div>
                      <div className="text-slate-400 font-mono">{phone}</div>
                    </div>

                    <div>
                      <span className="text-slate-500">Workshop Location:</span>
                      <div className="font-semibold text-white mt-0.5">Quality Motors Workshop</div>
                      <div className="text-slate-400 text-[11px]">Basapura Main Road, Electronic City</div>
                    </div>
                  </div>

                  {notes && (
                    <div className="pt-3 border-t border-slate-800/80 text-xs">
                      <span className="text-slate-500">Owner Notes:</span>
                      <p className="text-slate-300 italic mt-0.5">{notes}</p>
                    </div>
                  )}

                  {/* Policies box */}
                  <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                    <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Transparent Booking & Cancellation Policy</span>
                    </div>
                    <p>
                      No prepayment required to reserve your bay slot. Free cancellation and rescheduling up to 2 hours before the scheduled time. Formal repair estimate will be shared before replacing any parts.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                <button
                  disabled={isSubmitting}
                  onClick={() => setCurrentStep(4)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  disabled={isSubmitting}
                  onClick={handleConfirmBooking}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-md shadow-amber-500/10 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying Bay Slot & Confirming...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm & Reserve Slot</span>
                      <CheckCircle className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: CONFIRMED BOOKING PASS */}
          {currentStep === 6 && confirmedAppointment && (
            <div className="space-y-6 text-center animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-emerald-950/60 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-2xl font-extrabold text-white">
                  Appointment Confirmed!
                </h3>
                <p className="text-xs text-slate-400">
                  Your bay has been scheduled at Quality Motors on Basapura Main Road.
                </p>
              </div>

              {/* Digital Booking Ticket */}
              <div className="max-w-md mx-auto p-5 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-3 font-mono">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs text-slate-500 uppercase">Booking Tracking ID</span>
                  <span className="text-base font-bold text-amber-400">{confirmedAppointment.id}</span>
                </div>

                <div className="text-xs space-y-1 text-slate-300 font-sans">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Service:</span>
                    <span className="font-semibold text-white">{confirmedAppointment.serviceTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Vehicle:</span>
                    <span className="text-white">
                      {confirmedAppointment.vehicleMake} {confirmedAppointment.vehicleModel} ({confirmedAppointment.vehicleNumber})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Scheduled:</span>
                    <span className="text-amber-400 font-mono font-semibold">
                      {confirmedAppointment.date} · {confirmedAppointment.timeSlot}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Specialist:</span>
                    <span className="text-white">{confirmedAppointment.staffName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Estimated Rate:</span>
                    <span className="text-white font-mono font-bold">₹{confirmedAppointment.price.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 font-sans flex items-center justify-between">
                  <span>Status: <span className="text-emerald-400 font-bold uppercase">{confirmedAppointment.status}</span></span>
                  <span className="text-emerald-400 font-mono text-[10px] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                    <span>Supabase Connected</span>
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <a
                  href={`https://wa.me/${business?.whatsapp || '919945574983'}?text=${encodeURIComponent(
                    `Hi Quality Motors, I have booked appointment ${confirmedAppointment.id} for my ${confirmedAppointment.vehicleMake} ${confirmedAppointment.vehicleModel} (${confirmedAppointment.vehicleNumber}) on ${confirmedAppointment.date} at ${confirmedAppointment.timeSlot}. Please confirm bay reception.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 text-xs font-semibold text-emerald-300 bg-emerald-950/50 border border-emerald-800 rounded-lg hover:bg-emerald-950 flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>Notify via WhatsApp</span>
                </a>

                <a
                  href={business?.googleMapsUrl || 'https://maps.app.goo.gl/pAJ8AqN1PUp49bwq6'}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 text-xs font-semibold text-slate-200 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>Open Directions on Google Maps</span>
                </a>

                <button
                  onClick={resetForm}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Book Another Vehicle
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
