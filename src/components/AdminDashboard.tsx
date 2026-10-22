import React, { useState, useEffect } from 'react';
import {
  Shield,
  Calendar,
  Search,
  CheckCircle,
  Clock,
  XCircle,
  Plus,
  RefreshCw,
  DollarSign,
  AlertTriangle,
  User,
  Wrench,
  Ban,
  TrendingUp,
  FileText,
  Lock,
  LogOut,
  Car,
  Database,
  ExternalLink,
  Copy,
  Check,
  Eye,
  EyeOff,
  Key,
  Edit2,
  Trash2,
  Phone,
  MessageSquare,
  Download,
  Filter,
  X
} from 'lucide-react';
import { Appointment, ServiceItem, StaffMember, AdminStats, BusinessInfo, AdminUser } from '../types';
import { api, authStorage } from '../services/api';
import { SUPABASE_SQL_SCHEMA, SUPABASE_PROJECT_ID, SUPABASE_PUBLISHABLE_KEY } from '../services/supabase';

interface AdminDashboardProps {
  onClose: () => void;
  business: BusinessInfo | null;
  services: ServiceItem[];
  staff: StaffMember[];
  onServicesUpdated: (services: ServiceItem[]) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onClose,
  business,
  services,
  staff,
  onServicesUpdated
}) => {
  // Auth state with secure session token
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(authStorage.getToken());
  });
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    return authStorage.getUser();
  });
  const [loginInput, setLoginInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Security & Password Change State
  const [currentPasswordInput, setCurrentPasswordInput] = useState<string>('');
  const [newPasswordInput, setNewPasswordInput] = useState<string>('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState<string>('');
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [passwordChangeLoading, setPasswordChangeLoading] = useState<boolean>(false);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState<string | null>(null);
  const [passwordChangeError, setPasswordChangeError] = useState<string | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'appointments' | 'services' | 'staff' | 'blocked' | 'checklist' | 'analytics' | 'supabase' | 'security'>('appointments');

  // Appointments state
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingApts, setLoadingApts] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'supabase' | 'local'>('all');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('');
  const [viewMode, setViewMode] = useState<'list' | 'today'>('list');
  const [dbCounts, setDbCounts] = useState<{ total: number; supabase: number; local: number }>({ total: 0, supabase: 0, local: 0 });

  // Analytics stats
  const [stats, setStats] = useState<AdminStats | null>(null);

  // Modals state
  const [viewingApt, setViewingApt] = useState<Appointment | null>(null);
  const [editingApt, setEditingApt] = useState<Appointment | null>(null);
  const [editForm, setEditForm] = useState<Partial<Appointment>>({});
  const [editSaving, setEditSaving] = useState<boolean>(false);
  const [editError, setEditError] = useState<string | null>(null);

  const [reschedulingApt, setReschedulingApt] = useState<Appointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState<string>('');
  const [rescheduleSlot, setRescheduleSlot] = useState<string>('10:30 AM');
  const [rescheduleError, setRescheduleError] = useState<string | null>(null);

  const [deletingApt, setDeletingApt] = useState<Appointment | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  // Create manual booking modal
  const [manualModalOpen, setManualModalOpen] = useState<boolean>(false);
  const [manualName, setManualName] = useState<string>('');
  const [manualPhone, setManualPhone] = useState<string>('');
  const [manualEmail, setManualEmail] = useState<string>('');
  const [manualMake, setManualMake] = useState<string>('Maruti Suzuki');
  const [manualModel, setManualModel] = useState<string>('');
  const [manualNumber, setManualNumber] = useState<string>('');
  const [manualFuel, setManualFuel] = useState<string>('Petrol');
  const [manualServiceId, setManualServiceId] = useState<string>(services[0]?.id || '');
  const [manualStaffId, setManualStaffId] = useState<string>('any');
  const [manualDate, setManualDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [manualSlot, setManualSlot] = useState<string>('11:30 AM');
  const [manualNotes, setManualNotes] = useState<string>('');
  const [manualError, setManualError] = useState<string | null>(null);

  // Edit Service Modal
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editDuration, setEditDuration] = useState<number>(60);

  // Blocked dates state
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [newBlockedDate, setNewBlockedDate] = useState<string>('');

  // Supabase Integration state
  const [supabaseStatus, setSupabaseStatus] = useState<{
    connected: boolean;
    tableReady: boolean;
    projectId: string;
    supabaseUrl: string;
    message: string;
    error?: string;
  } | null>(null);
  const [supabaseLoading, setSupabaseLoading] = useState<boolean>(false);
  const [syncingSupabase, setSyncingSupabase] = useState<boolean>(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);

  const checkSupabase = async () => {
    setSupabaseLoading(true);
    setSyncResult(null);
    try {
      const res = await api.getSupabaseStatus();
      setSupabaseStatus(res);
    } catch (err: any) {
      setSupabaseStatus({
        connected: false,
        tableReady: false,
        projectId: SUPABASE_PROJECT_ID,
        supabaseUrl: `https://${SUPABASE_PROJECT_ID}.supabase.co`,
        message: err.message || 'Could not connect to Supabase server'
      });
    } finally {
      setSupabaseLoading(false);
    }
  };

  const handleSyncSupabase = async () => {
    setSyncingSupabase(true);
    setSyncResult(null);
    try {
      const res = await api.syncToSupabase();
      if (res.errors && res.errors.length > 0) {
        setSyncResult(`Synced ${res.synced} of ${res.total} bookings. Notice: ${res.errors[0]}`);
      } else {
        setSyncResult(`Successfully synced all ${res.synced} bookings directly into Supabase 'appointments' table!`);
      }
      checkSupabase();
      loadDashboardData();
    } catch (err: any) {
      setSyncResult(`Sync failed: ${err.message}`);
    } finally {
      setSyncingSupabase(false);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  // Verify active session on mount
  useEffect(() => {
    async function verifyCurrentSession() {
      if (authStorage.getToken()) {
        const { valid, admin } = await api.adminVerify();
        if (valid && admin) {
          setIsAuthenticated(true);
          setAdminUser(admin);
        } else {
          setIsAuthenticated(false);
          setAdminUser(null);
        }
      }
    }
    verifyCurrentSession();
  }, []);

  // Handle Secure Admin Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginInput.trim() || !passwordInput) {
      setAuthError('Please enter both your admin email/username and password.');
      return;
    }
    setLoginLoading(true);
    setAuthError(null);
    try {
      const res = await api.adminLogin({
        emailOrUsername: loginInput.trim(),
        password: passwordInput
      });
      if (res.success && res.admin) {
        setAdminUser(res.admin);
        setIsAuthenticated(true);
        setLoginInput('');
        setPasswordInput('');
        loadDashboardData();
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed. Access is strictly restricted to workshop administrators.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await api.adminLogout();
    setIsAuthenticated(false);
    setAdminUser(null);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeError(null);
    setPasswordChangeSuccess(null);
    if (!currentPasswordInput || !newPasswordInput) {
      setPasswordChangeError('Current password and new password are required.');
      return;
    }
    if (newPasswordInput.length < 8) {
      setPasswordChangeError('New password must be at least 8 characters long.');
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordChangeError('New password and confirmation do not match.');
      return;
    }
    setPasswordChangeLoading(true);
    try {
      const res = await api.adminChangePassword({
        currentPassword: currentPasswordInput,
        newPassword: newPasswordInput
      });
      setPasswordChangeSuccess(res.message || 'Admin password successfully updated!');
      setCurrentPasswordInput('');
      setNewPasswordInput('');
      setConfirmPasswordInput('');
    } catch (err: any) {
      setPasswordChangeError(err.message || 'Failed to update password');
    } finally {
      setPasswordChangeLoading(false);
    }
  };

  // Load appointments & stats
  const loadDashboardData = async () => {
    if (!isAuthenticated) return;
    setLoadingApts(true);
    try {
      const dateParam = viewMode === 'today' ? new Date().toISOString().split('T')[0] : selectedDateFilter;
      const [aptList, statsData, blocked] = await Promise.all([
        api.getAppointments({ q: searchQuery, status: statusFilter, date: dateParam }),
        api.getAdminStats(),
        api.getBlockedDates()
      ]);
      setAppointments(aptList);
      setStats(statsData);
      setBlockedDates(blocked);

      // Count sources
      const supaCount = aptList.filter(a => a.source === 'supabase').length;
      const locCount = aptList.filter(a => a.source === 'local').length;
      setDbCounts({ total: aptList.length, supabase: supaCount, local: locCount });
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingApts(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated, searchQuery, statusFilter, selectedDateFilter, viewMode]);

  // Update Status
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.updateAppointmentStatus(id, newStatus);
      loadDashboardData();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (apt: Appointment) => {
    setEditingApt(apt);
    setEditForm({
      customerName: apt.customerName,
      phone: apt.phone,
      email: apt.email || '',
      vehicleMake: apt.vehicleMake,
      vehicleModel: apt.vehicleModel,
      vehicleNumber: apt.vehicleNumber,
      fuelType: apt.fuelType,
      serviceId: apt.serviceId,
      serviceTitle: apt.serviceTitle,
      staffId: apt.staffId,
      staffName: apt.staffName,
      date: apt.date,
      timeSlot: apt.timeSlot,
      status: apt.status,
      notes: apt.notes || '',
      price: apt.price
    });
    setEditError(null);
  };

  // Save Edit
  const handleSaveEdit = async () => {
    if (!editingApt) return;
    setEditSaving(true);
    setEditError(null);

    try {
      const selectedSrv = services.find(s => s.id === editForm.serviceId);
      const selectedStaffMember = staff.find(st => st.id === editForm.staffId);

      const payload = {
        ...editForm,
        serviceTitle: selectedSrv ? selectedSrv.title : editForm.serviceTitle,
        staffName: selectedStaffMember ? selectedStaffMember.name : (editForm.staffId === 'any' ? 'Assigned Workshop Advisor' : editForm.staffName)
      };

      await api.updateAppointment(editingApt.id, payload);
      setEditingApt(null);
      loadDashboardData();
    } catch (err: any) {
      setEditError(err.message || 'Failed to update appointment');
    } finally {
      setEditSaving(false);
    }
  };

  // Submit Reschedule
  const handleConfirmReschedule = async () => {
    if (!reschedulingApt) return;
    setRescheduleError(null);
    try {
      await api.rescheduleAppointment(reschedulingApt.id, rescheduleDate, rescheduleSlot);
      setReschedulingApt(null);
      loadDashboardData();
    } catch (err: any) {
      setRescheduleError(err.message || 'Slot conflict. Please choose another slot.');
    }
  };

  // Delete or Cancel Appointment
  const handleConfirmDelete = async (permanent: boolean) => {
    if (!deletingApt) return;
    setDeleteLoading(true);
    try {
      await api.cancelAppointment(deletingApt.id, permanent);
      setDeletingApt(null);
      loadDashboardData();
    } catch (err: any) {
      alert(err.message || 'Action failed');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Submit Manual Booking
  const handleCreateManualBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setManualError(null);
    try {
      await api.createAppointment({
        customerName: manualName,
        phone: manualPhone,
        email: manualEmail,
        vehicleMake: manualMake,
        vehicleModel: manualModel,
        vehicleNumber: manualNumber,
        fuelType: manualFuel,
        serviceId: manualServiceId,
        staffId: manualStaffId,
        date: manualDate,
        timeSlot: manualSlot,
        notes: manualNotes || 'Direct booking created via Workshop Admin Panel'
      });
      setManualModalOpen(false);
      setManualName('');
      setManualPhone('');
      setManualEmail('');
      setManualModel('');
      setManualNumber('');
      setManualNotes('');
      loadDashboardData();
    } catch (err: any) {
      setManualError(err.message || 'Failed to create manual appointment');
    }
  };

  // Export to CSV
  const handleExportCsv = () => {
    if (appointments.length === 0) {
      alert('No appointments to export.');
      return;
    }

    const headers = ['ID', 'Date', 'Time Slot', 'Customer Name', 'Phone', 'Email', 'Vehicle Make', 'Model', 'Plate Number', 'Fuel', 'Service', 'Price (INR)', 'Advisor', 'Status', 'Notes', 'Database Source'];
    const rows = filteredAppointments.map(a => [
      `"${a.id}"`,
      `"${a.date}"`,
      `"${a.timeSlot}"`,
      `"${a.customerName.replace(/"/g, '""')}"`,
      `"${a.phone}"`,
      `"${a.email || ''}"`,
      `"${a.vehicleMake}"`,
      `"${a.vehicleModel}"`,
      `"${a.vehicleNumber}"`,
      `"${a.fuelType}"`,
      `"${a.serviceTitle.replace(/"/g, '""')}"`,
      a.price,
      `"${a.staffName}"`,
      `"${a.status}"`,
      `"${(a.notes || '').replace(/"/g, '""')}"`,
      `"${a.source || 'Database'}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `quality_motors_bookings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Submit Service Price Edit
  const handleSaveServiceEdit = async () => {
    if (!editingService) return;
    try {
      const updated = await api.updateService(editingService.id, {
        startingPrice: editPrice,
        durationMin: editDuration,
        priceNote: `Starting from ₹${editPrice.toLocaleString('en-IN')}`
      });
      const newServices = services.map(s => s.id === updated.id ? updated : s);
      onServicesUpdated(newServices);
      setEditingService(null);
    } catch (err: any) {
      alert(err.message || 'Failed to update service');
    }
  };

  // Block / Unblock Date
  const handleAddBlockedDate = async () => {
    if (!newBlockedDate) return;
    try {
      const updated = await api.addBlockedDate(newBlockedDate);
      setBlockedDates(updated);
      setNewBlockedDate('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveBlockedDate = async (date: string) => {
    try {
      const updated = await api.removeBlockedDate(date);
      setBlockedDates(updated);
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md animate-in fade-in duration-200">
        <div className="relative max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto text-amber-400 shadow-inner">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white">Workshop Administrator Portal</h3>
              <p className="text-xs text-amber-400/90 font-mono mt-0.5 font-medium tracking-wide">
                Restricted Access · Authorized Personnel Only
              </p>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sign in with your verified workshop credentials to inspect, manage, edit, and sync booking data with Supabase Cloud.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {authError && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Admin Email or Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="rbhuvi702@gmail.com or admin"
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-300">
                  Admin Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter administrator password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-mono transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 p-0.5"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-400 font-medium">
                <Shield className="w-3.5 h-3.5" />
                <span>Security Protected</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                All booking records, phone numbers, and vehicle data are protected by server-side authorization and rate limiting.
              </p>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-xl transition-all shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loginLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Sign In to Admin Console</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800 text-center">
            <button
              onClick={onClose}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
            >
              Return to Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  const todayStr = new Date().toISOString().split('T')[0];

  // Apply source filter
  const filteredAppointments = appointments.filter((apt) => {
    if (sourceFilter === 'supabase') return apt.source === 'supabase';
    if (sourceFilter === 'local') return apt.source === 'local';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-slate-100 overflow-hidden">
      {/* Admin Top Navigation */}
      <header className="h-16 border-b border-slate-800 bg-slate-900 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-5 bg-amber-500 rounded-xs"></span>
          <span className="font-extrabold text-white text-base">Quality Motors</span>
          <span className="text-xs font-mono text-amber-400 bg-amber-950/60 border border-amber-800/80 px-2 py-0.5 rounded">
            Admin & Database Panel
          </span>
        </div>

        {/* Navigation Tabs */}
        <div className="hidden md:flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'appointments' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Bookings & Management
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'services' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Services & Rates
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'staff' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Advisors & Roster
          </button>
          <button
            onClick={() => setActiveTab('blocked')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'blocked' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Workshop Holidays
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'checklist' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Owner Checklist
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'analytics' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => {
              setActiveTab('supabase');
              checkSupabase();
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'supabase' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-emerald-400 hover:text-emerald-300'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Supabase Sync</span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Exit Console
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* KPI Mini-Dashboard */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[11px] text-slate-400 font-medium">Total Stored Bookings</div>
              <div className="text-xl font-extrabold text-white font-mono mt-0.5">{dbCounts.total}</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[11px] text-amber-400 font-medium">Confirmed / Open</div>
              <div className="text-xl font-extrabold text-amber-400 font-mono mt-0.5">{stats.confirmed}</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[11px] text-blue-400 font-medium">In-Bay Active</div>
              <div className="text-xl font-extrabold text-blue-400 font-mono mt-0.5">{stats.inProgress}</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[11px] text-emerald-400 font-medium">Completed Jobs</div>
              <div className="text-xl font-extrabold text-emerald-400 font-mono mt-0.5">{stats.completed}</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[11px] text-slate-400 font-medium">Pipeline Revenue</div>
              <div className="text-xl font-extrabold text-white font-mono mt-0.5">
                ₹{stats.estimatedRevenue.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                <Database className="w-3 h-3 text-emerald-400" />
                <span>Supabase Cloud</span>
              </div>
              <div className="text-xs font-mono font-semibold text-slate-300 mt-1 truncate">
                {SUPABASE_PROJECT_ID}
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: ALL BOOKINGS & MANAGEMENT */}
        {activeTab === 'appointments' && (
          <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
              <div className="flex flex-wrap items-center gap-3 flex-1">
                {/* Search */}
                <div className="relative min-w-[220px] flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search by customer, phone, car plate (KA 51), ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-2.5 text-slate-500 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Status filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="confirmed">Confirmed Only</option>
                  <option value="in-progress">In-Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                {/* Database Source filter */}
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                >
                  <option value="all">All DB Sources</option>
                  <option value="supabase">Supabase Cloud Only</option>
                  <option value="local">Local Storage Only</option>
                </select>

                {/* Specific Date Filter */}
                <input
                  type="date"
                  value={selectedDateFilter}
                  onChange={(e) => {
                    setSelectedDateFilter(e.target.value);
                    if (e.target.value) setViewMode('list');
                  }}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 font-mono focus:outline-none"
                  title="Filter by appointment date"
                />

                {selectedDateFilter && (
                  <button
                    onClick={() => setSelectedDateFilter('')}
                    className="text-xs text-amber-400 hover:underline"
                  >
                    Clear Date
                  </button>
                )}

                {/* Today toggle */}
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                  <button
                    onClick={() => {
                      setViewMode('list');
                      setSelectedDateFilter('');
                    }}
                    className={`px-2.5 py-1 rounded ${viewMode === 'list' && !selectedDateFilter ? 'bg-slate-800 text-white font-bold' : 'text-slate-400'}`}
                  >
                    All Dates
                  </button>
                  <button
                    onClick={() => {
                      setViewMode('today');
                      setSelectedDateFilter('');
                    }}
                    className={`px-2.5 py-1 rounded ${viewMode === 'today' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400'}`}
                  >
                    Today Only
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportCsv}
                  className="px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-950 border border-slate-800 rounded-lg flex items-center gap-1.5"
                  title="Export Bookings to CSV spreadsheet"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>

                <button
                  onClick={loadDashboardData}
                  className="p-2 text-slate-400 hover:text-white bg-slate-950 border border-slate-800 rounded-lg"
                  title="Refresh Database Data"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setManualModalOpen(true)}
                  className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg flex items-center gap-1.5 shrink-0 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Booking</span>
                </button>
              </div>
            </div>

            {/* Appointments Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
              {loadingApts ? (
                <div className="p-12 text-center text-xs text-slate-400 space-y-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-amber-400 mx-auto" />
                  <div>Retrieving booking records from database...</div>
                </div>
              ) : filteredAppointments.length === 0 ? (
                <div className="p-12 text-center text-xs text-slate-400 space-y-2">
                  <Car className="w-8 h-8 text-slate-600 mx-auto" />
                  <div className="text-white font-semibold">No bookings found in database.</div>
                  <p className="text-slate-500">
                    Try adjusting your search query, status filter, or create a new booking using the button above.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                      <tr>
                        <th className="py-3.5 px-4">Booking ID & Date</th>
                        <th className="py-3.5 px-4">Customer</th>
                        <th className="py-3.5 px-4">Vehicle Details</th>
                        <th className="py-3.5 px-4">Service & Rate</th>
                        <th className="py-3.5 px-4">Advisor</th>
                        <th className="py-3.5 px-4">DB Source</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {filteredAppointments.map((apt) => (
                        <tr key={apt.id} className="hover:bg-slate-800/40 transition-colors">
                          {/* Booking ID & Date */}
                          <td className="py-3.5 px-4">
                            <div className="font-mono font-bold text-amber-400">{apt.id}</div>
                            <div className="font-mono text-slate-300 text-[11px] mt-0.5">{apt.date} · {apt.timeSlot}</div>
                          </td>

                          {/* Customer & Contacts */}
                          <td className="py-3.5 px-4 space-y-1">
                            <div className="font-semibold text-white">{apt.customerName}</div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-slate-400 text-[11px]">{apt.phone}</span>
                              <a
                                href={`https://wa.me/${apt.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${apt.customerName}, regarding your booking ${apt.id} at Quality Motors:`)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-emerald-400 hover:text-emerald-300"
                                title="Chat with customer on WhatsApp"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </a>
                              <a
                                href={`tel:${apt.phone}`}
                                className="text-slate-400 hover:text-white"
                                title="Call customer"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </td>

                          {/* Vehicle Details */}
                          <td className="py-3.5 px-4 space-y-0.5">
                            <div className="font-medium text-white">{apt.vehicleMake} {apt.vehicleModel}</div>
                            <div className="font-mono text-amber-300 text-[11px] flex items-center gap-1.5">
                              <span>{apt.vehicleNumber}</span>
                              <span className="text-[10px] text-slate-500">({apt.fuelType})</span>
                            </div>
                          </td>

                          {/* Service & Rate */}
                          <td className="py-3.5 px-4 space-y-0.5">
                            <div className="line-clamp-1 text-slate-200 max-w-[180px]">{apt.serviceTitle}</div>
                            <div className="font-mono font-semibold text-emerald-400">₹{apt.price?.toLocaleString('en-IN')}</div>
                          </td>

                          {/* Advisor */}
                          <td className="py-3.5 px-4 text-slate-300">
                            {apt.staffName || 'General Advisor'}
                          </td>

                          {/* Database Source */}
                          <td className="py-3.5 px-4">
                            {apt.source === 'supabase' ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 flex items-center gap-1 w-fit">
                                <Database className="w-2.5 h-2.5 text-emerald-400" />
                                <span>Supabase</span>
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-950 text-slate-400 border border-slate-800 w-fit">
                                Local
                              </span>
                            )}
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4">
                            <select
                              value={apt.status}
                              onChange={(e) => handleStatusChange(apt.id, e.target.value)}
                              className={`px-2 py-1 rounded text-[11px] font-mono font-bold uppercase border focus:outline-none cursor-pointer ${
                                apt.status === 'confirmed'
                                  ? 'bg-amber-950/60 text-amber-300 border-amber-800'
                                  : apt.status === 'in-progress'
                                  ? 'bg-blue-950/60 text-blue-300 border-blue-800'
                                  : apt.status === 'completed'
                                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                                  : 'bg-rose-950/60 text-rose-300 border-rose-800'
                              }`}
                            >
                              <option value="confirmed">CONFIRMED</option>
                              <option value="in-progress">IN-PROGRESS</option>
                              <option value="completed">COMPLETED</option>
                              <option value="cancelled">CANCELLED</option>
                            </select>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* View Details */}
                              <button
                                onClick={() => setViewingApt(apt)}
                                className="p-1.5 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                                title="View Complete Booking Details"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              {/* Edit */}
                              <button
                                onClick={() => handleOpenEdit(apt)}
                                className="p-1.5 text-amber-400 hover:text-amber-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                                title="Edit Customer, Car & Service Details"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              {/* Reschedule */}
                              <button
                                onClick={() => {
                                  setReschedulingApt(apt);
                                  setRescheduleDate(apt.date);
                                  setRescheduleSlot(apt.timeSlot);
                                }}
                                className="px-2 py-1 text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
                                title="Reschedule Date & Time"
                              >
                                Reschedule
                              </button>

                              {/* Delete / Cancel */}
                              <button
                                onClick={() => setDeletingApt(apt)}
                                className="p-1.5 text-rose-400 hover:text-rose-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                                title="Cancel or Delete Booking"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: SERVICES & PRICING MANAGEMENT */}
        {activeTab === 'services' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Workshop Services & Labor Rates</h3>
                <p className="text-xs text-slate-400">Configure published prices and estimated turnaround times.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((srv) => (
                <div key={srv.id} className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-white text-sm">{srv.title}</h4>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      ₹{srv.startingPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">{srv.shortDesc}</p>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Duration: {srv.durationMin} mins · Category: {srv.category}
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex justify-end">
                    <button
                      onClick={() => {
                        setEditingService(srv);
                        setEditPrice(srv.startingPrice);
                        setEditDuration(srv.durationMin);
                      }}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-lg"
                    >
                      Update Rate & Duration
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: STAFF & ADVISORS ROSTER */}
        {activeTab === 'staff' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-white">Workshop Technical Staff & Advisors</h3>
              <p className="text-xs text-slate-400">Specialist rosters assigned to bay consultations.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {staff.map((st) => (
                <div key={st.id} className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-base">{st.name}</span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                      Active
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-amber-400">{st.role}</div>
                  <p className="text-xs text-slate-300">{st.specialty}</p>
                  <div className="text-[11px] text-slate-500 font-mono pt-2 border-t border-slate-800">
                    {st.experience}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: BLOCKED DATES & WORKSHOP HOLIDAYS */}
        {activeTab === 'blocked' && (
          <div className="max-w-xl space-y-6">
            <div>
              <h3 className="text-base font-bold text-white">Blocked Dates & Workshop Maintenance</h3>
              <p className="text-xs text-slate-400">
                Dates configured here will be marked closed on the customer appointment booking calendar.
              </p>
            </div>

            <div className="flex gap-2">
              <input
                type="date"
                min={todayStr}
                value={newBlockedDate}
                onChange={(e) => setNewBlockedDate(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={handleAddBlockedDate}
                className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg"
              >
                Block Date
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                Currently Blocked Dates
              </h4>
              {blockedDates.length === 0 ? (
                <div className="text-xs text-slate-500 italic">No scheduled workshop closures.</div>
              ) : (
                <div className="space-y-1.5">
                  {blockedDates.map((d) => (
                    <div
                      key={d}
                      className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <span className="font-mono text-white font-medium">{d}</span>
                      <button
                        onClick={() => handleRemoveBlockedDate(d)}
                        className="text-rose-400 hover:text-rose-300 text-xs font-semibold"
                      >
                        Unblock
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: OWNER VERIFICATION CHECKLIST */}
        {activeTab === 'checklist' && (
          <div className="max-w-3xl space-y-6">
            <div>
              <h3 className="text-base font-bold text-white">Owner Listing Verification & Integration Checklist</h3>
              <p className="text-xs text-slate-400">
                Audit of verified public Google Maps details vs credentials marked for workshop owner confirmation.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-900 border border-emerald-900/40 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>Verified Public Google Maps Listing Facts (Confirmed)</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-1 pl-6 list-disc">
                  <li><strong>Business Name:</strong> QUALITY MOTORS - CAR SERVICE CENTER IN BASAPURA MAIN ROAD</li>
                  <li><strong>Physical Address:</strong> 30, Chikkathogur Post, 1, Bettadasanapura Rd, Pragathi Nagar, Basapura Main Road, Electronic City, Bengaluru 560100</li>
                  <li><strong>Coordinates:</strong> 12.8628481, 77.6495644</li>
                  <li><strong>Direct Phone:</strong> +91 99455 74983 (Verified on Maps & Justdial)</li>
                  <li><strong>Google Maps Rating:</strong> 4.8★ across 38+ verified reviews</li>
                  <li><strong>Operating Timings:</strong> 9:30 AM – 7:30 PM (All days)</li>
                  <li><strong>Verified Service Advisor:</strong> Sanjay (Commended in reviews for clear diagnostics)</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-amber-900/40 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Items Marked for Owner Confirmation / Setup</span>
                </div>
                <div className="space-y-2 text-xs">
                  {business?.ownerConfirmationNeeded.map((item) => (
                    <div key={item.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                      <div className="font-semibold text-white">{item.label}</div>
                      <div className="text-[11px] text-amber-400 font-mono">{item.status}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: ANALYTICS & INSIGHTS */}
        {activeTab === 'analytics' && stats && (
          <div className="max-w-3xl space-y-6">
            <div>
              <h3 className="text-base font-bold text-white">Workshop Performance & Booking Velocity</h3>
              <p className="text-xs text-slate-400">Metrics aggregated directly from live database appointments.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Appointment Status Breakdown
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-amber-400">Confirmed (Upcoming):</span>
                    <span className="font-mono font-bold text-white">{stats.confirmed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-400">In-Bay Active:</span>
                    <span className="font-mono font-bold text-white">{stats.inProgress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-400">Completed & Delivered:</span>
                    <span className="font-mono font-bold text-white">{stats.completed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-rose-400">Cancelled / Released:</span>
                    <span className="font-mono font-bold text-white">{stats.cancelled}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Database & Cloud Storage
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Total Bookings:</span>
                    <span className="font-mono font-bold text-white">{dbCounts.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-400">Supabase Cloud Rows:</span>
                    <span className="font-mono font-bold text-emerald-400">{dbCounts.supabase}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Local Database Rows:</span>
                    <span className="font-mono font-bold text-slate-400">{dbCounts.local}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: SUPABASE LIVE BACKEND INTEGRATION */}
        {activeTab === 'supabase' && (
          <div className="max-w-4xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase text-emerald-400 font-mono flex items-center gap-1.5 mb-1">
                  <Database className="w-3.5 h-3.5" />
                  <span>Supabase Backend Integration</span>
                </div>
                <h3 className="text-xl font-extrabold text-white">Live PostgreSQL Cloud Sync</h3>
                <p className="text-xs text-slate-400">
                  Every appointment booked by customers automatically synchronizes with your Supabase database project.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={checkSupabase}
                  disabled={supabaseLoading}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${supabaseLoading ? 'animate-spin' : ''}`} />
                  <span>Check Status</span>
                </button>

                <button
                  onClick={handleSyncSupabase}
                  disabled={syncingSupabase}
                  className="px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg flex items-center gap-1.5 shadow-sm"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${syncingSupabase ? 'animate-spin' : ''}`} />
                  <span>Sync Bookings Now</span>
                </button>
              </div>
            </div>

            {/* Sync Alert Banner if triggered */}
            {syncResult && (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/80 text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{syncResult}</span>
              </div>
            )}

            {/* Connection Credentials Card */}
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-950 border border-emerald-800/80 flex items-center justify-center text-emerald-400">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <span>Supabase Project Connected</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold uppercase">
                        Active
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 font-mono">
                      https://{SUPABASE_PROJECT_ID}.supabase.co
                    </div>
                  </div>
                </div>

                <a
                  href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-medium"
                >
                  <span>Open Supabase Dashboard</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[11px]">Project ID:</span>
                  <div className="font-mono text-white font-semibold mt-0.5">{SUPABASE_PROJECT_ID}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[11px]">Publishable API Key:</span>
                  <div className="font-mono text-emerald-400 font-semibold mt-0.5 truncate">
                    {SUPABASE_PUBLISHABLE_KEY}
                  </div>
                </div>
              </div>

              {/* Status diagnosis banner */}
              {supabaseStatus && (
                <div
                  className={`p-4 rounded-xl border text-xs flex items-start gap-3 ${
                    supabaseStatus.tableReady
                      ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200'
                      : 'bg-amber-950/30 border-amber-800/60 text-amber-200'
                  }`}
                >
                  {supabaseStatus.tableReady ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                  )}
                  <div className="space-y-1">
                    <div className="font-bold">
                      {supabaseStatus.tableReady
                        ? "Table 'appointments' is ready and receiving bookings!"
                        : "One-Time Setup: Create the 'appointments' table in Supabase"}
                    </div>
                    <p className="text-[11px] leading-relaxed opacity-90">
                      {supabaseStatus.message}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Step-by-Step Table Setup Guide */}
            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Database Table Schema Setup</h4>
                  <p className="text-xs text-slate-400">
                    Run this SQL script once in your Supabase SQL Editor so your project has the table with Row Level Security (RLS) enabled.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopySql}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedSql ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-slate-950" />
                        <span>Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-950" />
                        <span>Copy SQL Script</span>
                      </>
                    )}
                  </button>

                  <a
                    href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/sql`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <span>Open Supabase SQL Editor</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Code display */}
              <div className="relative rounded-lg bg-slate-950 border border-slate-800 p-4 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-64">
                <pre>{SUPABASE_SQL_SCHEMA}</pre>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center gap-4">
                <span>1. Copy SQL script</span>
                <span>→</span>
                <span>2. Open Supabase SQL Editor and click 'New Query'</span>
                <span>→</span>
                <span>3. Paste and click 'Run'</span>
                <span>→</span>
                <span>4. Click 'Sync Bookings Now' above</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* VIEW DETAILS MODAL */}
      {viewingApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-mono">Appointment Details</div>
                  <h3 className="text-lg font-bold text-white font-mono">{viewingApt.id}</h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold uppercase border ${
                  viewingApt.status === 'confirmed' ? 'bg-amber-950/60 text-amber-300 border-amber-800' :
                  viewingApt.status === 'in-progress' ? 'bg-blue-950/60 text-blue-300 border-blue-800' :
                  viewingApt.status === 'completed' ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800' :
                  'bg-rose-950/60 text-rose-300 border-rose-800'
                }`}>
                  {viewingApt.status}
                </span>
                <button
                  onClick={() => setViewingApt(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              {/* Customer & Vehicle Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="font-bold text-white flex items-center gap-1.5 text-sm">
                    <User className="w-4 h-4 text-amber-400" />
                    <span>Customer Information</span>
                  </div>
                  <div className="space-y-1">
                    <div><span className="text-slate-500">Name:</span> <span className="text-white font-medium">{viewingApt.customerName}</span></div>
                    <div><span className="text-slate-500">Phone:</span> <span className="text-amber-300 font-mono font-medium">{viewingApt.phone}</span></div>
                    <div><span className="text-slate-500">Email:</span> <span className="text-slate-300">{viewingApt.email || 'Not provided'}</span></div>
                  </div>
                  <div className="pt-2 flex gap-2">
                    <a
                      href={`https://wa.me/${viewingApt.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${viewingApt.customerName}, this is regarding your car service booking ${viewingApt.id} at Quality Motors:`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded-lg flex items-center gap-1 hover:bg-emerald-900"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp Customer</span>
                    </a>
                    <a
                      href={`tel:${viewingApt.phone}`}
                      className="px-3 py-1.5 bg-slate-800 text-slate-200 rounded-lg flex items-center gap-1 hover:bg-slate-700"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call</span>
                    </a>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="font-bold text-white flex items-center gap-1.5 text-sm">
                    <Car className="w-4 h-4 text-amber-400" />
                    <span>Vehicle Profile</span>
                  </div>
                  <div className="space-y-1">
                    <div><span className="text-slate-500">Make & Model:</span> <span className="text-white font-medium">{viewingApt.vehicleMake} {viewingApt.vehicleModel}</span></div>
                    <div><span className="text-slate-500">Plate Number:</span> <span className="text-amber-400 font-mono font-bold">{viewingApt.vehicleNumber}</span></div>
                    <div><span className="text-slate-500">Fuel Type:</span> <span className="text-slate-300">{viewingApt.fuelType}</span></div>
                  </div>
                </div>
              </div>

              {/* Service & Schedule */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="font-bold text-white flex items-center gap-1.5 text-sm">
                  <Wrench className="w-4 h-4 text-amber-400" />
                  <span>Service Package & Schedule</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-500">Service:</span>
                    <div className="text-white font-semibold text-sm mt-0.5">{viewingApt.serviceTitle}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Estimated Price:</span>
                    <div className="text-emerald-400 font-mono font-bold text-base mt-0.5">₹{viewingApt.price?.toLocaleString('en-IN')}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Scheduled Date:</span>
                    <div className="text-white font-mono font-medium mt-0.5">{viewingApt.date} at {viewingApt.timeSlot}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Assigned Advisor:</span>
                    <div className="text-white font-medium mt-0.5">{viewingApt.staffName}</div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {viewingApt.notes && (
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <div className="font-semibold text-slate-400">Owner Complaints / Workshop Notes:</div>
                  <p className="text-slate-200 italic leading-relaxed">{viewingApt.notes}</p>
                </div>
              )}

              {/* Database metadata */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between font-mono">
                <span>Created: {new Date(viewingApt.createdAt).toLocaleString()}</span>
                <span>DB Source: {viewingApt.source === 'supabase' ? 'Supabase Cloud PostgreSQL' : 'Local DB'}</span>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const apt = viewingApt;
                    setViewingApt(null);
                    handleOpenEdit(apt);
                  }}
                  className="px-3.5 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Details</span>
                </button>

                <button
                  onClick={() => {
                    const apt = viewingApt;
                    setViewingApt(null);
                    setReschedulingApt(apt);
                    setRescheduleDate(apt.date);
                    setRescheduleSlot(apt.timeSlot);
                  }}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg"
                >
                  Reschedule
                </button>
              </div>

              <button
                onClick={() => setViewingApt(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT APPOINTMENT MODAL */}
      {editingApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div>
                <h3 className="text-base font-bold text-white">Edit Appointment {editingApt.id}</h3>
                <p className="text-xs text-slate-400">Updates will automatically sync across Supabase and workshop databases.</p>
              </div>
              <button
                onClick={() => setEditingApt(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {editError && (
                <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300">
                  {editError}
                </div>
              )}

              {/* Customer Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Customer Name *</label>
                  <input
                    type="text"
                    value={editForm.customerName || ''}
                    onChange={(e) => setEditForm({ ...editForm, customerName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Phone Number *</label>
                  <input
                    type="text"
                    value={editForm.phone || ''}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={editForm.email || ''}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Vehicle Info */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Make</label>
                  <input
                    type="text"
                    value={editForm.vehicleMake || ''}
                    onChange={(e) => setEditForm({ ...editForm, vehicleMake: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Model</label>
                  <input
                    type="text"
                    value={editForm.vehicleModel || ''}
                    onChange={(e) => setEditForm({ ...editForm, vehicleModel: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Plate Number</label>
                  <input
                    type="text"
                    value={editForm.vehicleNumber || ''}
                    onChange={(e) => setEditForm({ ...editForm, vehicleNumber: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white uppercase font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Fuel Type</label>
                  <select
                    value={editForm.fuelType || 'Petrol'}
                    onChange={(e) => setEditForm({ ...editForm, fuelType: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="CNG">CNG</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              {/* Service & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-medium mb-1">Service Package</label>
                  <select
                    value={editForm.serviceId || ''}
                    onChange={(e) => {
                      const srv = services.find(s => s.id === e.target.value);
                      setEditForm({
                        ...editForm,
                        serviceId: e.target.value,
                        serviceTitle: srv ? srv.title : editForm.serviceTitle,
                        price: srv ? srv.startingPrice : editForm.price
                      });
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    {services.map(s => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Estimated Rate (₹)</label>
                  <input
                    type="number"
                    value={editForm.price || 0}
                    onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Advisor & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Service Advisor</label>
                  <select
                    value={editForm.staffId || 'any'}
                    onChange={(e) => setEditForm({ ...editForm, staffId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="any">Any Available Advisor</option>
                    {staff.map(st => (
                      <option key={st.id} value={st.id}>{st.name} ({st.role})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Status</label>
                  <select
                    value={editForm.status || 'confirmed'}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="in-progress">In-Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-slate-300 font-medium mb-1">Complaints / Technician Notes</label>
                <textarea
                  rows={3}
                  value={editForm.notes || ''}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center justify-end gap-3">
              <button
                onClick={() => setEditingApt(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                disabled={editSaving}
                onClick={handleSaveEdit}
                className="px-5 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg flex items-center gap-1.5"
              >
                {editSaving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>Save & Sync Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESCHEDULE MODAL */}
      {reschedulingApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Reschedule Appointment {reschedulingApt.id}</h3>
            <p className="text-xs text-slate-400">
              Customer: {reschedulingApt.customerName} ({reschedulingApt.vehicleNumber})
            </p>

            {rescheduleError && (
              <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
                {rescheduleError}
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">New Date</label>
                <input
                  type="date"
                  min={todayStr}
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">New Time Slot</label>
                <select
                  value={rescheduleSlot}
                  onChange={(e) => setRescheduleSlot(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                >
                  {['09:30 AM', '10:30 AM', '11:30 AM', '12:30 PM', '01:30 PM', '02:30 PM', '03:30 PM', '04:30 PM', '05:30 PM', '06:30 PM'].map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setReschedulingApt(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReschedule}
                className="px-5 py-2 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg"
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE / CANCEL CONFIRMATION MODAL */}
      {deletingApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <Trash2 className="w-6 h-6" />
              <h3 className="text-base font-bold text-white">Manage Appointment Removal</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Appointment <strong>{deletingApt.id}</strong> for <strong>{deletingApt.customerName}</strong> ({deletingApt.vehicleMake} {deletingApt.vehicleModel} - {deletingApt.vehicleNumber}).
            </p>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-2">
              <div>
                <strong className="text-amber-400">Option 1: Cancel Booking (Recommended)</strong>
                <p className="text-[11px] mt-0.5">Marks the booking as cancelled and releases the workshop bay slot for other customers while keeping a record.</p>
              </div>
              <div className="pt-2 border-t border-slate-800/80">
                <strong className="text-rose-400">Option 2: Delete Permanently</strong>
                <p className="text-[11px] mt-0.5">Completely removes this record from both Supabase and workshop databases.</p>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                disabled={deleteLoading}
                onClick={() => handleConfirmDelete(false)}
                className="w-full py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg"
              >
                Mark as Cancelled (Release Slot)
              </button>

              <button
                disabled={deleteLoading}
                onClick={() => handleConfirmDelete(true)}
                className="w-full py-2.5 text-xs font-semibold text-rose-300 bg-rose-950/60 border border-rose-800 hover:bg-rose-900 rounded-lg"
              >
                Delete Record Permanently
              </button>

              <button
                onClick={() => setDeletingApt(null)}
                className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE MANUAL BOOKING MODAL */}
      {manualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Create Direct Walk-in / Phone Booking</h3>
              <button onClick={() => setManualModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {manualError && (
              <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
                {manualError}
              </div>
            )}

            <form onSubmit={handleCreateManualBooking} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="98450 12345"
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Email (Optional)</label>
                <input
                  type="email"
                  placeholder="customer@example.com"
                  value={manualEmail}
                  onChange={(e) => setManualEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Make</label>
                  <input
                    type="text"
                    value={manualMake}
                    onChange={(e) => setManualMake(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Model *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Swift / Creta"
                    value={manualModel}
                    onChange={(e) => setManualModel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Plate Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="KA 51 ..."
                    value={manualNumber}
                    onChange={(e) => setManualNumber(e.target.value.toUpperCase())}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white uppercase font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Fuel Type</label>
                  <select
                    value={manualFuel}
                    onChange={(e) => setManualFuel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="CNG">CNG</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Service Specialist</label>
                  <select
                    value={manualStaffId}
                    onChange={(e) => setManualStaffId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="any">Any Available Advisor</option>
                    {staff.map(st => (
                      <option key={st.id} value={st.id}>{st.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Service Package</label>
                <select
                  value={manualServiceId}
                  onChange={(e) => setManualServiceId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>{s.title} (₹{s.startingPrice})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Appointment Date</label>
                  <input
                    type="date"
                    min={todayStr}
                    value={manualDate}
                    onChange={(e) => setManualDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Slot</label>
                  <select
                    value={manualSlot}
                    onChange={(e) => setManualSlot(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                  >
                    {['09:30 AM', '10:30 AM', '11:30 AM', '12:30 PM', '01:30 PM', '02:30 PM', '03:30 PM', '04:30 PM', '05:30 PM', '06:30 PM'].map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Owner Notes / Complaints</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Walk-in requested suspension check and brake inspection"
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setManualModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg"
                >
                  Create & Save Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT SERVICE PRICE MODAL */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Update Service: {editingService.title}</h3>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Starting Price (₹)</label>
                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Estimated Duration (Minutes)</label>
                <input
                  type="number"
                  value={editDuration}
                  onChange={(e) => setEditDuration(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingService(null)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveServiceEdit}
                className="px-5 py-2 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
