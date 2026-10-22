export interface BusinessInfo {
  name: string;
  listingName: string;
  category: string;
  tagline: string;
  address: string;
  phone: string;
  displayPhone: string;
  whatsapp: string;
  email: string;
  establishedYear: number;
  googleRating: number;
  totalReviews: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  googleMapsUrl: string;
  hours: {
    mon_sat: string;
    sunday: string;
    emergency: string;
  };
  ownerConfirmationNeeded: {
    id: string;
    label: string;
    status: string;
  }[];
}

export interface ServiceItem {
  id: string;
  title: string;
  shortDesc: string;
  durationMin: number;
  startingPrice: number;
  priceNote: string;
  category: string;
  featured: boolean;
  image: string;
  details: string[];
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  experience: string;
  specialty: string;
  verified: boolean;
}

export interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  date: string;
  carModel: string;
  service: string;
  text: string;
  verified: boolean;
}

export interface Appointment {
  id: string;
  createdAt: string;
  customerName: string;
  phone: string;
  email?: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleNumber: string;
  fuelType: string;
  serviceId: string;
  serviceTitle: string;
  staffId: string;
  staffName: string;
  date: string;
  timeSlot: string;
  status: 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
  price: number;
  updatedAt?: string;
  source?: 'supabase' | 'local';
}

export interface AvailableSlot {
  time: string;
  available: boolean;
  remainingBays: number;
  reason: string | null;
}

export interface AvailabilityResponse {
  success: boolean;
  date: string;
  isBlocked: boolean;
  reason?: string;
  slots: AvailableSlot[];
}

export interface AdminStats {
  total: number;
  confirmed: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  estimatedRevenue: number;
  rating: number;
  reviewCount: number;
}

export interface AdminUser {
  id: string;
  email: string;
  username: string;
  role: 'admin';
  name: string;
  lastLogin?: string;
}

export interface AdminAuthResponse {
  success: boolean;
  token?: string;
  admin?: AdminUser;
  error?: string;
}
