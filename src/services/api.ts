import { BusinessInfo, ServiceItem, StaffMember, ReviewItem, Appointment, AvailabilityResponse, AdminStats, AdminUser, AdminAuthResponse } from '../types';

const ADMIN_TOKEN_KEY = 'qm_admin_token';
const ADMIN_USER_KEY = 'qm_admin_user';

export const authStorage = {
  getToken(): string | null {
    try {
      return sessionStorage.getItem(ADMIN_TOKEN_KEY);
    } catch {
      return null;
    }
  },
  setToken(token: string) {
    try {
      sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
    } catch {}
  },
  getUser(): AdminUser | null {
    try {
      const u = sessionStorage.getItem(ADMIN_USER_KEY);
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  },
  setUser(user: AdminUser) {
    try {
      sessionStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
    } catch {}
  },
  clear() {
    try {
      sessionStorage.removeItem(ADMIN_TOKEN_KEY);
      sessionStorage.removeItem(ADMIN_USER_KEY);
    } catch {}
  }
};

function getAuthHeaders(): Record<string, string> {
  const token = authStorage.getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Public Business & Catalog Endpoints
  async getBusinessInfo(): Promise<BusinessInfo> {
    const res = await fetch('/api/info');
    const json = await res.json();
    return json.data;
  },

  async getServices(): Promise<ServiceItem[]> {
    const res = await fetch('/api/services');
    const json = await res.json();
    return json.data;
  },

  async getStaff(): Promise<StaffMember[]> {
    const res = await fetch('/api/staff');
    const json = await res.json();
    return json.data;
  },

  async getReviews(): Promise<ReviewItem[]> {
    const res = await fetch('/api/reviews');
    const json = await res.json();
    return json.data;
  },

  async createReview(data: { author: string; rating: number; carModel: string; service: string; text: string }): Promise<ReviewItem> {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to post review');
    return json.data;
  },

  async getAvailability(date: string, staffId?: string): Promise<AvailabilityResponse> {
    const query = new URLSearchParams({ date });
    if (staffId) query.set('staffId', staffId);
    const res = await fetch(`/api/availability?${query.toString()}`);
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to fetch slot availability');
    return json;
  },

  async createAppointment(data: {
    customerName: string;
    phone: string;
    email?: string;
    vehicleMake: string;
    vehicleModel: string;
    vehicleNumber: string;
    fuelType: string;
    serviceId: string;
    staffId?: string;
    date: string;
    timeSlot: string;
    notes?: string;
  }): Promise<{ message: string; data: Appointment }> {
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || 'Failed to book appointment');
    }
    return json;
  },

  // Admin Authentication Endpoints
  async adminLogin(credentials: { emailOrUsername: string; password: string }): Promise<AdminAuthResponse> {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || 'Login failed');
    }
    if (json.token && json.admin) {
      authStorage.setToken(json.token);
      authStorage.setUser(json.admin);
    }
    return json;
  },

  async adminVerify(): Promise<{ valid: boolean; admin?: AdminUser }> {
    const token = authStorage.getToken();
    if (!token) return { valid: false };

    try {
      const res = await fetch('/api/admin/verify', {
        headers: getAuthHeaders(),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        if (json.admin) authStorage.setUser(json.admin);
        return { valid: true, admin: json.admin };
      }
      authStorage.clear();
      return { valid: false };
    } catch {
      return { valid: false };
    }
  },

  async adminLogout(): Promise<void> {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: getAuthHeaders(),
      });
    } catch {}
    authStorage.clear();
  },

  async adminChangePassword(payload: { currentPassword: string; newPassword: string }): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/admin/password', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update password');
    return json;
  },

  // Protected Admin Management Endpoints (Require Bearer Token)
  async getAppointments(filters?: { q?: string; status?: string; date?: string }): Promise<Appointment[]> {
    const query = new URLSearchParams();
    if (filters?.q) query.set('q', filters.q);
    if (filters?.status) query.set('status', filters.status);
    if (filters?.date) query.set('date', filters.date);

    const res = await fetch(`/api/appointments?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || 'Access denied: Admin credentials required');
    }
    return json.data;
  },

  async updateAppointment(id: string, data: Partial<Appointment>): Promise<Appointment> {
    const res = await fetch(`/api/appointments/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update appointment');
    return json.data;
  },

  async updateAppointmentStatus(id: string, status: string): Promise<Appointment> {
    const res = await fetch(`/api/appointments/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update status');
    return json.data;
  },

  async rescheduleAppointment(id: string, date: string, timeSlot: string): Promise<Appointment> {
    const res = await fetch(`/api/appointments/${id}/reschedule`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ date, timeSlot }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to reschedule');
    return json.data;
  },

  async cancelAppointment(id: string, permanent: boolean = false): Promise<void> {
    const url = permanent ? `/api/appointments/${id}?permanent=true` : `/api/appointments/${id}`;
    const res = await fetch(url, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to cancel appointment');
  },

  async createService(data: Partial<ServiceItem>): Promise<ServiceItem> {
    const res = await fetch('/api/services', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to create service');
    return json.data;
  },

  async updateService(id: string, data: Partial<ServiceItem>): Promise<ServiceItem> {
    const res = await fetch(`/api/services/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update service');
    return json.data;
  },

  async deleteService(id: string): Promise<void> {
    const res = await fetch(`/api/services/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete service');
  },

  async getBlockedDates(): Promise<string[]> {
    const res = await fetch('/api/blocked-dates');
    const json = await res.json();
    return json.data;
  },

  async addBlockedDate(date: string): Promise<string[]> {
    const res = await fetch('/api/blocked-dates', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ date }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to block date');
    return json.data;
  },

  async removeBlockedDate(date: string): Promise<string[]> {
    const res = await fetch(`/api/blocked-dates/${date}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to remove blocked date');
    return json.data;
  },

  async getAdminStats(): Promise<AdminStats> {
    const res = await fetch('/api/stats', {
      headers: getAuthHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to load stats');
    return json.data;
  },

  async getSupabaseStatus(): Promise<{
    connected: boolean;
    tableReady: boolean;
    projectId: string;
    supabaseUrl: string;
    message: string;
    error?: string;
  }> {
    const res = await fetch('/api/supabase/status', {
      headers: getAuthHeaders(),
    });
    return await res.json();
  },

  async syncToSupabase(): Promise<{
    success: boolean;
    total: number;
    synced: number;
    errors: string[];
  }> {
    const res = await fetch('/api/supabase/sync', {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to sync to Supabase');
    return json;
  }
};
