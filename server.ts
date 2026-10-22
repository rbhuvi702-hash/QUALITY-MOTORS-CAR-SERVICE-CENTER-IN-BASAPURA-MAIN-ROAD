import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const DB_PATH = path.join(__dirname, 'data', 'db.json');

// Supabase Configuration for project tkodjrrpxyywduwsmwhg
const SUPABASE_PROJECT_ID = process.env.SUPABASE_PROJECT_ID || 'tkodjrrpxyywduwsmwhg';
const SUPABASE_URL = process.env.SUPABASE_URL || `https://${SUPABASE_PROJECT_ID}.supabase.co`;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_eEFWDP7CyW2sPUtdQLYsWg_BzQ3z899';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

app.use(express.json());

// Ensure data folder exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}

// Initial default seed data representing the real Google Maps listing
const defaultData = {
  business: {
    name: "Quality Motors",
    listingName: "QUALITY MOTORS - CAR SERVICE CENTER IN BASAPURA MAIN ROAD",
    category: "Automobile Repair & Multi-Brand Car Service Center",
    tagline: "Precision Auto Care & Multi-Brand Car Service Specialists in Electronic City",
    address: "30, Chikkathogur Post, 1, Bettadasanapura Rd, Pragathi Nagar, Basapura Main Road, Electronic City, Bengaluru, Karnataka 560100",
    phone: "+919945574983",
    displayPhone: "+91 99455 74983",
    whatsapp: "919945574983",
    email: "contact@qualitymotors.in",
    establishedYear: 2014,
    googleRating: 4.8,
    totalReviews: 38,
    coordinates: {
      lat: 12.8628481,
      lng: 77.6495644
    },
    googleMapsUrl: "https://maps.app.goo.gl/pAJ8AqN1PUp49bwq6",
    hours: {
      mon_sat: "9:30 AM - 7:30 PM",
      sunday: "9:30 AM - 7:30 PM",
      emergency: "24/7 Breakdown & Towing Assistance"
    },
    ownerConfirmationNeeded: [
      {
        id: "payment_upi",
        label: "Official Workshop UPI ID / QR Code for advance booking tokens",
        status: "Pending Owner Confirmation"
      },
      {
        id: "gstin",
        label: "Workshop GSTIN / Tax Identification Number for formal invoices",
        status: "Pending Owner Confirmation"
      },
      {
        id: "sms_gateway",
        label: "SMS Gateway API Key (e.g. Twilio / Gupshup / Fast2SMS) for automated SMS alerts",
        status: "Using Web & WhatsApp Direct Notification"
      }
    ]
  },
  services: [
    {
      id: "general-periodic-service",
      title: "Comprehensive Periodic Car Maintenance",
      shortDesc: "Complete 40-point vehicle health check, engine oil flush & replacement, air/oil filter change, brake pad cleaning, and top-ups.",
      durationMin: 120,
      startingPrice: 2499,
      priceNote: "Starting from ₹2,499 (Excludes synthetic oil & spare parts)",
      category: "Maintenance",
      featured: true,
      image: "/src/assets/images/hero_car_workshop_1792656724235.jpg",
      details: [
        "Synthetic / Mineral Engine Oil Replacement",
        "OEM Oil Filter & Air Filter Cleaning / Replacement",
        "40-Point Comprehensive Electronic & Mechanical Check",
        "Coolant, Brake Fluid, & Washer Fluid Top-Up",
        "Spark Plug & Ignition Coil Inspection",
        "Complete Interior Vacuuming & Exterior Foam Wash"
      ]
    },
    {
      id: "engine-diagnostics-scanning",
      title: "Computerized Engine Diagnostics & ECU Scan",
      shortDesc: "High-precision OBD-II diagnostic scan, check-engine light troubleshooting, sensor calibration, and live powertrain data analysis.",
      durationMin: 60,
      startingPrice: 999,
      priceNote: "₹999 Fixed Scanning & Comprehensive Diagnostic Report",
      category: "Diagnostics",
      featured: true,
      image: "/src/assets/images/service_engine_diagnostics_1792656724921.jpg",
      details: [
        "Full ECU, ABS, Airbag, & Transmission Scan",
        "Check Engine Light & Error Code Clearing",
        "O2 Sensor, Mass Air Flow (MAF) & Throttle Body Testing",
        "Battery Charging & Alternator Performance Check",
        "Detailed Technician Diagnostic Report with Quote"
      ]
    },
    {
      id: "brake-system-overhaul",
      title: "Brake System Service & Disc Rotor Resurfacing",
      shortDesc: "Inspection of front and rear brake pads, caliper lubrication, rotor thickness check, brake fluid flush, and bleeding.",
      durationMin: 90,
      startingPrice: 1499,
      priceNote: "Starting from ₹1,499 per axle + parts",
      category: "Safety & Brakes",
      featured: true,
      image: "/src/assets/images/service_brake_suspension_1792656726008.jpg",
      details: [
        "Front & Rear Brake Pad Wear Inspection",
        "Brake Disc / Rotor Resurfacing or Replacement",
        "Caliper Pin Cleaning & Synthetic High-Temp Lubrication",
        "DOT 4 Brake Fluid Bleeding & Pressure Test",
        "Handbrake Cable Calibration & Drum Adjustment"
      ]
    },
    {
      id: "ac-service-gas-refill",
      title: "Car Air Conditioning Service & Cooling Coil Cleaning",
      shortDesc: "Advanced AC gas recovery & refilling (R134a/R1234yf), condenser cleaning, cabin pollen filter replacement, and anti-bacterial duct treatment.",
      durationMin: 90,
      startingPrice: 1899,
      priceNote: "Starting from ₹1,899 (Includes refrigerant gas top-up)",
      category: "Climate Control",
      featured: true,
      image: "/src/assets/images/service_engine_diagnostics_1792656724921.jpg",
      details: [
        "Pure R134a Refrigerant Gas Refilling to Factory Specs",
        "AC Compressor Oil Top-Up & Pressure Testing",
        "Cooling Coil & Condenser Deep Wash",
        "Cabin AC Filter Inspection & Replacement",
        "Evaporator Odor Elimination & Anti-Bacterial Sanitization"
      ]
    },
    {
      id: "suspension-steering-repair",
      title: "Suspension, Steering & Strut Overhaul",
      shortDesc: "Eliminate thuds, wobbles, and uneven tire wear with complete shock absorber, link rod, bushing, and steering rack overhaul.",
      durationMin: 120,
      startingPrice: 2199,
      priceNote: "Starting from ₹2,199 inspection & labor + parts",
      category: "Suspension",
      featured: false,
      image: "/src/assets/images/service_brake_suspension_1792656726008.jpg",
      details: [
        "Front & Rear Shock Absorber Leakage & Rebound Test",
        "Lower Arm, Bushing, and Ball Joint Inspection",
        "Stabilizer Link Rod & Tie Rod End Replacement",
        "Power Steering Fluid Flush & Rack Inspection",
        "Test Drive on Basapura Road Testing Tracks"
      ]
    },
    {
      id: "car-detailing-ceramic-polish",
      title: "Deep Interior Detailing & Machine Paint Polishing",
      shortDesc: "Restores showroom gloss with deep foam wash, clay bar paint decontamination, dual-action machine polishing, and fabric dry cleaning.",
      durationMin: 180,
      startingPrice: 2999,
      priceNote: "Starting from ₹2,999 (Hatchback/Sedan)",
      category: "Detailing",
      featured: true,
      image: "/src/assets/images/service_detailing_polish_1792656725417.jpg",
      details: [
        "pH-Neutral Snow Foam Exterior Wash & Underbody Jet Rinse",
        "Clay Bar Paint Decontamination & Iron Fallout Removal",
        "Rotary / Dual Action 2-Stage Machine Swirl Polish",
        "Interior Upholstery Steam Extraction & Leather Conditioning",
        "Tire Dressing, Glass De-scaling, & Carnauba Wax Sealant"
      ]
    },
    {
      id: "battery-electrical-diagnostics",
      title: "Car Battery Health Test & Electrical Diagnostics",
      shortDesc: "Digital cranking amp test, alternator charging verification, parasitic drain troubleshooting, and genuine Exide/Amaron battery replacement.",
      durationMin: 45,
      startingPrice: 499,
      priceNote: "Starting from ₹499 checkup (Free with battery replacement)",
      category: "Electrical",
      featured: false,
      image: "/src/assets/images/service_engine_diagnostics_1792656724921.jpg",
      details: [
        "Cold Cranking Amps (CCA) & Battery Life Percentage Test",
        "Alternator Diode & Voltage Regulator Load Test",
        "Starter Motor Amperage Draw Analysis",
        "Parasitic Current Drain / Battery Leakage Check",
        "Genuine OEM Battery Sales with Manufacturer Warranty"
      ]
    },
    {
      id: "breakdown-emergency-inspection",
      title: "24/7 Breakdown Assistance & Emergency Inspection",
      shortDesc: "On-site battery jumpstart, flat tire replacement, radiator overheating diagnosis, and workshop flatbed towing across Electronic City and Basapura.",
      durationMin: 60,
      startingPrice: 899,
      priceNote: "Starting from ₹899 on-site call-out fee",
      category: "Emergency",
      featured: false,
      image: "/src/assets/images/hero_car_workshop_1792656724235.jpg",
      details: [
        "Rapid Dispatch along Basapura Main Rd, Hosur Rd & Electronic City",
        "Professional Heavy-Duty Jumpstart & Battery Diagnostics",
        "Flat Tire Puncture Repair & Spare Wheel Replacement",
        "Coolant Leakage & Overheating Roadside Diagnostics",
        "Safe Flatbed Towing Directly to Quality Motors Workshop"
      ]
    }
  ],
  staff: [
    {
      id: "sanjay",
      name: "Sanjay",
      role: "Lead Service Advisor & Diagnostics Lead",
      experience: "9+ Years Automotive Experience",
      specialty: "Customer Consultation, Multi-Brand Diagnostics & Transparent Estimates",
      verified: true
    },
    {
      id: "ramesh",
      name: "Ramesh K.",
      role: "Senior Master Technician",
      experience: "12+ Years Experience",
      specialty: "Engine Rebuilds, Automatic/Manual Transmissions & Powertrain",
      verified: true
    },
    {
      id: "vikram",
      name: "Vikram N.",
      role: "Suspension, Brakes & Electrical Specialist",
      experience: "8+ Years Experience",
      specialty: "High-Precision Brake Systems, Steering Geometry & Electronic Modules",
      verified: true
    }
  ],
  reviews: [
    {
      id: "rev-1",
      author: "Venkatesh R.",
      rating: 5,
      date: "2 weeks ago",
      carModel: "Honda City 1.5 i-VTEC",
      service: "Comprehensive Periodic Car Maintenance",
      text: "Service Advisor Sanjay was very good and transparent. He clearly walked me through what needed attention without any pushy upselling. Car was delivered smooth and punctually on Basapura Main Road.",
      verified: true
    },
    {
      id: "rev-2",
      author: "Arjun Nair",
      rating: 5,
      date: "1 month ago",
      carModel: "Hyundai Creta SX",
      service: "Car Air Conditioning Service & Cooling Coil Cleaning",
      text: "My AC had completely stopped blowing cold air during peak Bangalore traffic. The team at Quality Motors diagnosed the refrigerant leakage, replaced the valve, and refilled gas. Super chilled cooling now!",
      verified: true
    },
    {
      id: "rev-3",
      author: "Deepak Sharma",
      rating: 5,
      date: "2 months ago",
      carModel: "Maruti Suzuki Swift Dzire",
      service: "Brake System Service & Disc Rotor Resurfacing",
      text: "Had persistent brake squeal and vibration on highway driving. They skimmed the rotors and fitted new brake pads. Very satisfied with Quality Motors - affordable rates compared to authorized showrooms.",
      verified: true
    },
    {
      id: "rev-4",
      author: "Preeti Kulkarni",
      rating: 4,
      date: "3 months ago",
      carModel: "Volkswagen Polo GT TSI",
      service: "Computerized Engine Diagnostics & ECU Scan",
      text: "Check engine warning had popped up. Their technician identified the faulty oxygen sensor quickly with computerized scanner and fixed the harness. Professional and reliable workshop in Basapura.",
      verified: true
    }
  ],
  blockedDates: [
    // Format YYYY-MM-DD
  ],
  appointments: [
    {
      id: "QM-9842-A",
      createdAt: "2026-10-20T10:30:00.000Z",
      customerName: "Anand Murthy",
      phone: "+91 98450 12345",
      email: "anand.murthy@example.com",
      vehicleMake: "Hyundai",
      vehicleModel: "Venue SX(O)",
      vehicleNumber: "KA 51 ME 4821",
      fuelType: "Petrol",
      serviceId: "general-periodic-service",
      serviceTitle: "Comprehensive Periodic Car Maintenance",
      staffId: "sanjay",
      staffName: "Sanjay",
      date: "2026-10-23",
      timeSlot: "10:30 AM",
      status: "confirmed",
      notes: "Please check slight steering vibration at 80 km/h.",
      price: 2499
    },
    {
      id: "QM-7319-B",
      createdAt: "2026-10-21T14:15:00.000Z",
      customerName: "Karthik Sundaram",
      phone: "+91 99001 88772",
      email: "karthik.s@example.com",
      vehicleMake: "Tata",
      vehicleModel: "Nexon EV",
      vehicleNumber: "KA 05 MN 9012",
      fuelType: "Electric",
      serviceId: "brake-system-overhaul",
      serviceTitle: "Brake System Service & Disc Rotor Resurfacing",
      staffId: "vikram",
      staffName: "Vikram N.",
      date: "2026-10-23",
      timeSlot: "02:30 PM",
      status: "confirmed",
      notes: "Brake squeak on slow deceleration.",
      price: 1499
    }
  ]
};

// Database helper functions
function readDb() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify(defaultData, null, 2), 'utf-8');
      return defaultData;
    }
    const content = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error("Error reading database, using in-memory default", err);
    return defaultData;
  }
}

function writeDb(data: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error("Error writing to database:", err);
  }
}

// Admin Security & Password Utilities
function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

function verifyPassword(password: string, salt: string, expectedHash: string): boolean {
  try {
    const key = crypto.scryptSync(password, salt, 64);
    const expectedKey = Buffer.from(expectedHash, 'hex');
    return crypto.timingSafeEqual(key, expectedKey);
  } catch {
    return false;
  }
}

// Ensure database file and admin user are initialized
function ensureAdminUser(db: any) {
  let changed = false;
  if (!db.admin) {
    const salt = crypto.randomBytes(16).toString('hex');
    const initialPassword = process.env.ADMIN_PASSWORD || 'QualityMotors@2026!';
    db.admin = {
      id: "admin-master",
      email: process.env.ADMIN_EMAIL || "rbhuvi702@gmail.com",
      username: "admin",
      name: "Workshop Administrator",
      salt,
      passwordHash: hashPassword(initialPassword, salt),
      role: "admin",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    changed = true;
  }
  if (changed) {
    writeDb(db);
  }
  return db;
}

const initialDb = readDb();
ensureAdminUser(initialDb);

// Active Sessions in Memory (24 hour expiration)
interface AdminSession {
  token: string;
  admin: {
    id: string;
    email: string;
    username: string;
    name: string;
    role: 'admin';
    lastLogin: string;
  };
  expiresAt: number;
}

const activeSessions = new Map<string, AdminSession>();

// Rate Limiter for Brute-force Protection (max 5 failed attempts per 15 minutes per IP)
const loginAttempts = new Map<string, { count: number; lockedUntil: number }>();

function checkRateLimit(ip: string): { allowed: boolean; waitMinutes?: number } {
  const record = loginAttempts.get(ip);
  if (!record) return { allowed: true };
  if (record.lockedUntil > Date.now()) {
    const waitMinutes = Math.ceil((record.lockedUntil - Date.now()) / (60 * 1000));
    return { allowed: false, waitMinutes };
  }
  if (record.lockedUntil <= Date.now() && record.count >= 5) {
    loginAttempts.delete(ip);
  }
  return { allowed: true };
}

function recordFailedLogin(ip: string) {
  const record = loginAttempts.get(ip) || { count: 0, lockedUntil: 0 };
  record.count += 1;
  if (record.count >= 5) {
    record.lockedUntil = Date.now() + 15 * 60 * 1000; // 15-minute lockout
  }
  loginAttempts.set(ip, record);
}

function clearRateLimit(ip: string) {
  loginAttempts.delete(ip);
}

// Admin Authorization Middleware - Blocks unauthorized access to sensitive endpoints
function requireAdminAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: "Access Denied: Only authenticated administrators can access this data or action."
    });
  }

  const token = authHeader.split(' ')[1];
  const session = activeSessions.get(token);

  if (!session || session.expiresAt < Date.now()) {
    if (session) activeSessions.delete(token);
    return res.status(401).json({
      success: false,
      error: "Session expired or invalid. Please sign in to the Admin Panel."
    });
  }

  (req as any).admin = session.admin;
  next();
}

// Available daily time slots (9:30 AM to 6:30 PM last intake)
const ALL_TIME_SLOTS = [
  "09:30 AM",
  "10:30 AM",
  "11:30 AM",
  "12:30 PM",
  "01:30 PM",
  "02:30 PM",
  "03:30 PM",
  "04:30 PM",
  "05:30 PM",
  "06:30 PM"
];

// Maximum concurrent appointments the workshop bays can comfortably process per slot
const MAX_SLOT_CAPACITY = 2;

// API Routes

// --- ADMIN AUTHENTICATION & ACCESS CONTROL ENDPOINTS ---

// Admin Login with Brute-Force Rate Limiting
app.post('/api/admin/login', (req, res) => {
  const { emailOrUsername, password } = req.body;
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.ip || req.socket.remoteAddress || 'unknown';

  // Check rate limit lockout
  const rateStatus = checkRateLimit(ip);
  if (!rateStatus.allowed) {
    return res.status(429).json({
      success: false,
      error: `Too many failed login attempts. Access temporarily locked for ${rateStatus.waitMinutes} minutes for security.`
    });
  }

  if (!emailOrUsername || !password) {
    return res.status(400).json({
      success: false,
      error: "Please enter your admin email/username and password."
    });
  }

  const db = readDb();
  ensureAdminUser(db);
  const admin = db.admin;

  const inputId = String(emailOrUsername).trim().toLowerCase();
  const matchesUser =
    inputId === admin.email.toLowerCase() ||
    inputId === admin.username.toLowerCase();

  const isValidPassword = matchesUser && verifyPassword(String(password), admin.salt, admin.passwordHash);

  if (!matchesUser || !isValidPassword) {
    recordFailedLogin(ip);
    return res.status(401).json({
      success: false,
      error: "Invalid admin credentials. Access is strictly restricted to authorized workshop administrators only."
    });
  }

  // Clear failed rate limit count on successful login
  clearRateLimit(ip);

  // Generate cryptographically secure session token
  const token = crypto.randomBytes(32).toString('hex');
  const now = new Date().toISOString();

  const adminUser = {
    id: admin.id || 'admin-master',
    email: admin.email,
    username: admin.username,
    name: admin.name || 'Workshop Administrator',
    role: 'admin' as const,
    lastLogin: now
  };

  activeSessions.set(token, {
    token,
    admin: adminUser,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours validity
  });

  admin.lastLogin = now;
  writeDb(db);

  res.json({
    success: true,
    message: "Admin authentication successful.",
    token,
    admin: adminUser
  });
});

// Admin Verify Active Session
app.get('/api/admin/verify', requireAdminAuth, (req, res) => {
  res.json({
    success: true,
    valid: true,
    admin: (req as any).admin
  });
});

// Admin Logout
app.post('/api/admin/logout', requireAdminAuth, (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    activeSessions.delete(token);
  }
  res.json({
    success: true,
    message: "Admin logged out successfully."
  });
});

// Admin Change Password
app.put('/api/admin/password', requireAdminAuth, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      error: "Current password and new password are required."
    });
  }

  if (String(newPassword).length < 8) {
    return res.status(400).json({
      success: false,
      error: "New password must be at least 8 characters long."
    });
  }

  const db = readDb();
  ensureAdminUser(db);
  const admin = db.admin;

  if (!verifyPassword(String(currentPassword), admin.salt, admin.passwordHash)) {
    return res.status(401).json({
      success: false,
      error: "Current password does not match. Please enter your existing password correctly."
    });
  }

  // Update salt and hash
  const newSalt = crypto.randomBytes(16).toString('hex');
  admin.salt = newSalt;
  admin.passwordHash = hashPassword(String(newPassword), newSalt);
  admin.updatedAt = new Date().toISOString();
  writeDb(db);

  res.json({
    success: true,
    message: "Admin password successfully changed and securely saved in database."
  });
});

// Business Info
app.get('/api/info', (_req, res) => {
  const db = readDb();
  res.json({
    success: true,
    data: db.business
  });
});

// Services
app.get('/api/services', (_req, res) => {
  const db = readDb();
  res.json({
    success: true,
    data: db.services
  });
});

app.post('/api/services', requireAdminAuth, (req, res) => {
  const { title, shortDesc, startingPrice, durationMin, category, details, image } = req.body;
  if (!title || !startingPrice) {
    return res.status(400).json({ success: false, error: "Title and price are required." });
  }

  const db = readDb();
  const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const newService = {
    id: id || `service-${Date.now()}`,
    title,
    shortDesc: shortDesc || "",
    durationMin: Number(durationMin) || 60,
    startingPrice: Number(startingPrice),
    priceNote: `Starting from ₹${Number(startingPrice).toLocaleString('en-IN')}`,
    category: category || "General",
    featured: false,
    image: image || "/src/assets/images/hero_car_workshop_1792656724235.jpg",
    details: Array.isArray(details) ? details : ["Standard automotive inspection and service"]
  };

  db.services.push(newService);
  writeDb(db);
  res.status(201).json({ success: true, data: newService });
});

app.put('/api/services/:id', requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const index = db.services.findIndex((s: any) => s.id === id);
  if (index === -1) {
    return res.status(400).json({ success: false, error: "Service not found." });
  }

  db.services[index] = { ...db.services[index], ...req.body };
  writeDb(db);
  res.json({ success: true, data: db.services[index] });
});

app.delete('/api/services/:id', requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const db = readDb();
  db.services = db.services.filter((s: any) => s.id !== id);
  writeDb(db);
  res.json({ success: true, message: "Service deleted" });
});

// Staff
app.get('/api/staff', (_req, res) => {
  const db = readDb();
  res.json({
    success: true,
    data: db.staff
  });
});

// Reviews
app.get('/api/reviews', (_req, res) => {
  const db = readDb();
  res.json({
    success: true,
    data: db.reviews
  });
});

app.post('/api/reviews', (req, res) => {
  const { author, rating, carModel, service, text } = req.body;
  if (!author || !rating || !text) {
    return res.status(400).json({ success: false, error: "Name, rating, and review text are required." });
  }

  const db = readDb();
  const newReview = {
    id: `rev-${Date.now()}`,
    author: String(author).trim(),
    rating: Math.min(5, Math.max(1, Number(rating))),
    date: "Just now",
    carModel: carModel ? String(carModel).trim() : "Verified Car Owner",
    service: service ? String(service).trim() : "General Car Service",
    text: String(text).trim(),
    verified: true
  };

  db.reviews.unshift(newReview);
  writeDb(db);
  res.status(201).json({ success: true, data: newReview });
});

// Blocked Dates
app.get('/api/blocked-dates', (_req, res) => {
  const db = readDb();
  res.json({ success: true, data: db.blockedDates || [] });
});

app.post('/api/blocked-dates', requireAdminAuth, (req, res) => {
  const { date } = req.body;
  if (!date) return res.status(400).json({ success: false, error: "Date required (YYYY-MM-DD)." });
  const db = readDb();
  if (!db.blockedDates) db.blockedDates = [];
  if (!db.blockedDates.includes(date)) {
    db.blockedDates.push(date);
    writeDb(db);
  }
  res.json({ success: true, data: db.blockedDates });
});

app.delete('/api/blocked-dates/:date', requireAdminAuth, (req, res) => {
  const { date } = req.params;
  const db = readDb();
  if (db.blockedDates) {
    db.blockedDates = db.blockedDates.filter((d: string) => d !== date);
    writeDb(db);
  }
  res.json({ success: true, data: db.blockedDates || [] });
});

// Live Availability Calculation (Server-authoritative)
app.get('/api/availability', (req, res) => {
  const { date, staffId } = req.query;

  if (!date || typeof date !== 'string') {
    return res.status(400).json({ success: false, error: "Query param 'date' (YYYY-MM-DD) is required." });
  }

  const db = readDb();

  // Check if date is blocked/holiday
  if (db.blockedDates && db.blockedDates.includes(date)) {
    return res.json({
      success: true,
      date,
      isBlocked: true,
      reason: "Workshop is closed on this date (Scheduled holiday/maintenance).",
      slots: []
    });
  }

  // Check if date is in the past
  const requestedDate = new Date(date + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (requestedDate < today) {
    return res.json({
      success: true,
      date,
      isBlocked: true,
      reason: "Past dates cannot be selected.",
      slots: []
    });
  }

  // Active appointments on this date
  const appointmentsOnDate = (db.appointments || []).filter((apt: any) =>
    apt.date === date && apt.status !== 'cancelled'
  );

  // Compute available slots with capacity check
  const slots = ALL_TIME_SLOTS.map((time) => {
    // Check bookings for this exact slot
    const slotBookings = appointmentsOnDate.filter((apt: any) => apt.timeSlot === time);
    
    // If staffId filter was specified, also check if that specific advisor/technician is booked
    let staffBooked = false;
    if (staffId && staffId !== 'any') {
      staffBooked = slotBookings.some((apt: any) => apt.staffId === staffId);
    }

    const isAvailable = slotBookings.length < MAX_SLOT_CAPACITY && !staffBooked;
    const remainingBays = Math.max(0, MAX_SLOT_CAPACITY - slotBookings.length);

    return {
      time,
      available: isAvailable,
      remainingBays,
      reason: !isAvailable ? (staffBooked ? "Advisor already scheduled" : "Workshop bays fully booked") : null
    };
  });

  res.json({
    success: true,
    date,
    isBlocked: false,
    slots
  });
});

// Appointments Management with Atomic Conflict Detection & Supabase Sync
app.post('/api/appointments', async (req, res) => {
  const {
    customerName,
    phone,
    email,
    vehicleMake,
    vehicleModel,
    vehicleNumber,
    fuelType,
    serviceId,
    staffId,
    date,
    timeSlot,
    notes
  } = req.body;

  // Validation
  if (!customerName || !phone || !vehicleMake || !vehicleModel || !vehicleNumber || !serviceId || !date || !timeSlot) {
    return res.status(400).json({
      success: false,
      error: "Missing required booking details. Please fill all fields marked with an asterisk."
    });
  }

  const db = readDb();

  // Validate date is not blocked
  if (db.blockedDates && db.blockedDates.includes(date)) {
    return res.status(409).json({
      success: false,
      error: "Selected date is blocked for workshop maintenance. Please select another date."
    });
  }

  // Check if past date
  const requestedDate = new Date(date + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (requestedDate < today) {
    return res.status(400).json({
      success: false,
      error: "Appointments cannot be booked for past dates."
    });
  }

  // Atomic conflict check: count active bookings for this date and slot
  const currentSlotBookings = (db.appointments || []).filter((apt: any) =>
    apt.date === date && apt.timeSlot === timeSlot && apt.status !== 'cancelled'
  );

  if (currentSlotBookings.length >= MAX_SLOT_CAPACITY) {
    return res.status(409).json({
      success: false,
      error: "This time slot was just booked by another vehicle owner. Please select a different time slot."
    });
  }

  // If specific staff was chosen, check if they are already assigned in this slot
  if (staffId && staffId !== 'any') {
    const isStaffBusy = currentSlotBookings.some((apt: any) => apt.staffId === staffId);
    if (isStaffBusy) {
      return res.status(409).json({
        success: false,
        error: "Selected service specialist is already assigned at this time. Please choose another time or select Any Available Advisor."
      });
    }
  }

  // Find service details
  const serviceObj = (db.services || []).find((s: any) => s.id === serviceId) || {
    id: serviceId,
    title: "Custom Automobile Service",
    startingPrice: 1999
  };

  // Find staff details
  const staffObj = (db.staff || []).find((st: any) => st.id === staffId);
  const staffName = staffObj ? staffObj.name : "Assigned Workshop Advisor";

  // Generate unique booking tracking ID
  const trackingNumber = `QM-${Math.floor(1000 + Math.random() * 9000)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;

  const newAppointment = {
    id: trackingNumber,
    createdAt: new Date().toISOString(),
    customerName: String(customerName).trim(),
    phone: String(phone).trim(),
    email: email ? String(email).trim() : "",
    vehicleMake: String(vehicleMake).trim(),
    vehicleModel: String(vehicleModel).trim(),
    vehicleNumber: String(vehicleNumber).trim().toUpperCase(),
    fuelType: fuelType || "Petrol",
    serviceId,
    serviceTitle: serviceObj.title,
    staffId: staffId || "any",
    staffName,
    date,
    timeSlot,
    status: "confirmed",
    notes: notes ? String(notes).trim() : "",
    price: serviceObj.startingPrice
  };

  db.appointments.unshift(newAppointment);
  writeDb(db);

  // Synchronize automatically to Supabase database
  let supabaseSynced = false;
  let supabaseError: string | null = null;
  try {
    const { error: supaErr } = await supabase.from('appointments').insert({
      id: newAppointment.id,
      created_at: newAppointment.createdAt,
      customer_name: newAppointment.customerName,
      phone: newAppointment.phone,
      email: newAppointment.email,
      vehicle_make: newAppointment.vehicleMake,
      vehicle_model: newAppointment.vehicleModel,
      vehicle_number: newAppointment.vehicleNumber,
      fuel_type: newAppointment.fuelType,
      service_id: newAppointment.serviceId,
      service_title: newAppointment.serviceTitle,
      staff_id: newAppointment.staffId,
      staff_name: newAppointment.staffName,
      date: newAppointment.date,
      time_slot: newAppointment.timeSlot,
      status: newAppointment.status,
      notes: newAppointment.notes,
      price: newAppointment.price
    });

    if (supaErr) {
      console.warn("Supabase insert note:", supaErr.message);
      supabaseError = supaErr.message;
    } else {
      supabaseSynced = true;
      console.log("Appointment saved to Supabase successfully:", newAppointment.id);
    }
  } catch (sErr: any) {
    console.error("Supabase exception:", sErr.message);
    supabaseError = sErr.message;
  }

  res.status(201).json({
    success: true,
    message: "Appointment successfully confirmed by Quality Motors workshop backend.",
    data: newAppointment,
    supabase: {
      synced: supabaseSynced,
      projectId: SUPABASE_PROJECT_ID,
      error: supabaseError
    }
  });
});

// Get All Appointments (Directly retrieves from Supabase Cloud & Local storage - ADMIN ONLY)
app.get('/api/appointments', requireAdminAuth, async (req, res) => {
  const { q, status, date } = req.query;
  const db = readDb();
  const localList = db.appointments || [];

  // Query Supabase directly
  let supabaseList: any[] = [];
  try {
    const { data: supaRows, error: supaErr } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false });

    if (!supaErr && supaRows && supaRows.length > 0) {
      supabaseList = supaRows.map((row: any) => ({
        id: row.id,
        createdAt: row.created_at,
        customerName: row.customer_name,
        phone: row.phone,
        email: row.email || "",
        vehicleMake: row.vehicle_make,
        vehicleModel: row.vehicle_model,
        vehicleNumber: row.vehicle_number,
        fuelType: row.fuel_type || "Petrol",
        serviceId: row.service_id,
        serviceTitle: row.service_title,
        staffId: row.staff_id || "any",
        staffName: row.staff_name || "Assigned Workshop Advisor",
        date: row.date,
        timeSlot: row.time_slot,
        status: row.status || "confirmed",
        notes: row.notes || "",
        price: Number(row.price) || 0,
        updatedAt: row.updated_at,
        source: 'supabase'
      }));
    }
  } catch (err: any) {
    console.warn("Notice querying Supabase appointments:", err.message);
  }

  // Merge map: local first, then Supabase (so any cloud row is included)
  const mergedMap = new Map<string, any>();
  for (const item of localList) {
    mergedMap.set(item.id, { ...item, source: 'local' });
  }
  for (const item of supabaseList) {
    mergedMap.set(item.id, item);
  }

  let results = Array.from(mergedMap.values());

  // Sort by date / created_at descending
  results.sort((a, b) => {
    const timeA = new Date(a.createdAt || a.date).getTime();
    const timeB = new Date(b.createdAt || b.date).getTime();
    return timeB - timeA;
  });

  if (status && status !== 'all') {
    results = results.filter((apt: any) => apt.status === status);
  }

  if (date) {
    results = results.filter((apt: any) => apt.date === date);
  }

  if (q && typeof q === 'string') {
    const term = q.toLowerCase();
    results = results.filter((apt: any) =>
      apt.customerName?.toLowerCase().includes(term) ||
      apt.phone?.includes(term) ||
      apt.id?.toLowerCase().includes(term) ||
      apt.vehicleNumber?.toLowerCase().includes(term) ||
      apt.vehicleModel?.toLowerCase().includes(term) ||
      apt.serviceTitle?.toLowerCase().includes(term)
    );
  }

  res.json({
    success: true,
    data: results,
    counts: {
      total: results.length,
      supabase: supabaseList.length,
      local: localList.length
    }
  });
});

// Full Edit Appointment endpoint (Updates customer, vehicle, service, notes, price across Supabase and local DB)
app.put('/api/appointments/:id', requireAdminAuth, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const db = readDb();
  let index = (db.appointments || []).findIndex((apt: any) => apt.id === id);

  if (index === -1) {
    const newRecord = {
      id,
      createdAt: updates.createdAt || new Date().toISOString(),
      customerName: updates.customerName || "Customer",
      phone: updates.phone || "",
      email: updates.email || "",
      vehicleMake: updates.vehicleMake || "",
      vehicleModel: updates.vehicleModel || "",
      vehicleNumber: updates.vehicleNumber || "",
      fuelType: updates.fuelType || "Petrol",
      serviceId: updates.serviceId || "general-periodic-service",
      serviceTitle: updates.serviceTitle || "Custom Service",
      staffId: updates.staffId || "any",
      staffName: updates.staffName || "Assigned Advisor",
      date: updates.date,
      timeSlot: updates.timeSlot,
      status: updates.status || "confirmed",
      notes: updates.notes || "",
      price: Number(updates.price) || 0,
      updatedAt: new Date().toISOString()
    };
    db.appointments.unshift(newRecord);
    index = 0;
  } else {
    db.appointments[index] = {
      ...db.appointments[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
  }
  writeDb(db);

  // Sync edit to Supabase
  try {
    await supabase.from('appointments').update({
      customer_name: updates.customerName,
      phone: updates.phone,
      email: updates.email,
      vehicle_make: updates.vehicleMake,
      vehicle_model: updates.vehicleModel,
      vehicle_number: updates.vehicleNumber,
      fuel_type: updates.fuelType,
      service_id: updates.serviceId,
      service_title: updates.serviceTitle,
      staff_id: updates.staffId,
      staff_name: updates.staffName,
      date: updates.date,
      time_slot: updates.timeSlot,
      status: updates.status,
      notes: updates.notes,
      price: updates.price,
      updated_at: new Date().toISOString()
    }).eq('id', id);
  } catch (err: any) {
    console.warn("Supabase edit sync warning:", err.message);
  }

  res.json({
    success: true,
    message: "Appointment successfully updated.",
    data: db.appointments[index]
  });
});

// Update appointment status with Supabase sync
app.put('/api/appointments/:id/status', requireAdminAuth, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !['confirmed', 'in-progress', 'completed', 'cancelled'].includes(status)) {
    return res.status(400).json({ success: false, error: "Invalid status" });
  }

  const db = readDb();
  const index = (db.appointments || []).findIndex((apt: any) => apt.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: "Appointment not found." });
  }

  db.appointments[index].status = status;
  db.appointments[index].updatedAt = new Date().toISOString();
  writeDb(db);

  // Sync to Supabase
  try {
    await supabase.from('appointments').update({
      status,
      updated_at: new Date().toISOString()
    }).eq('id', id);
  } catch (err: any) {
    console.warn("Supabase status update note:", err.message);
  }

  res.json({
    success: true,
    data: db.appointments[index]
  });
});

// Reschedule appointment with Supabase sync
app.put('/api/appointments/:id/reschedule', requireAdminAuth, async (req, res) => {
  const { id } = req.params;
  const { date, timeSlot } = req.body;

  if (!date || !timeSlot) {
    return res.status(400).json({ success: false, error: "New date and timeSlot required." });
  }

  const db = readDb();
  const index = (db.appointments || []).findIndex((apt: any) => apt.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: "Appointment not found." });
  }

  // Conflict check for new slot
  const currentSlotBookings = (db.appointments || []).filter((apt: any) =>
    apt.id !== id && apt.date === date && apt.timeSlot === timeSlot && apt.status !== 'cancelled'
  );

  if (currentSlotBookings.length >= MAX_SLOT_CAPACITY) {
    return res.status(409).json({
      success: false,
      error: "Requested new time slot is currently full. Please pick another slot."
    });
  }

  db.appointments[index].date = date;
  db.appointments[index].timeSlot = timeSlot;
  db.appointments[index].status = "confirmed";
  db.appointments[index].updatedAt = new Date().toISOString();
  writeDb(db);

  // Sync to Supabase
  try {
    await supabase.from('appointments').update({
      date,
      time_slot: timeSlot,
      status: "confirmed",
      updated_at: new Date().toISOString()
    }).eq('id', id);
  } catch (err: any) {
    console.warn("Supabase reschedule sync note:", err.message);
  }

  res.json({
    success: true,
    message: "Appointment successfully rescheduled.",
    data: db.appointments[index]
  });
});

// Delete or Cancel appointment with Supabase sync (supports ?permanent=true)
app.delete('/api/appointments/:id', requireAdminAuth, async (req, res) => {
  const { id } = req.params;
  const { permanent } = req.query;
  const db = readDb();

  if (permanent === 'true') {
    db.appointments = (db.appointments || []).filter((apt: any) => apt.id !== id);
    writeDb(db);

    try {
      await supabase.from('appointments').delete().eq('id', id);
    } catch (e) {}

    return res.json({
      success: true,
      message: "Appointment permanently deleted from database."
    });
  }

  const index = (db.appointments || []).findIndex((apt: any) => apt.id === id);
  if (index !== -1) {
    db.appointments[index].status = "cancelled";
    db.appointments[index].updatedAt = new Date().toISOString();
    writeDb(db);
  }

  // Sync cancellation to Supabase
  try {
    await supabase.from('appointments').update({
      status: "cancelled",
      updated_at: new Date().toISOString()
    }).eq('id', id);
  } catch (err: any) {
    console.warn("Supabase cancel sync note:", err.message);
  }

  res.json({
    success: true,
    message: "Appointment marked as cancelled and bay slot released."
  });
});

// Supabase Status & Sync Endpoints
app.get('/api/supabase/status', requireAdminAuth, async (_req, res) => {
  try {
    const { data, error } = await supabase.from('appointments').select('*').limit(1);
    if (error) {
      const isTableMissing = error.code === 'PGRST205' || error.message?.includes('Could not find the table');
      return res.json({
        success: true,
        connected: true,
        tableReady: !isTableMissing,
        projectId: SUPABASE_PROJECT_ID,
        supabaseUrl: SUPABASE_URL,
        error: error.message,
        code: error.code,
        message: isTableMissing
          ? "Connected to Supabase, but the 'appointments' table has not been created yet in your Supabase SQL Editor."
          : `Supabase status: ${error.message}`
      });
    }

    return res.json({
      success: true,
      connected: true,
      tableReady: true,
      projectId: SUPABASE_PROJECT_ID,
      supabaseUrl: SUPABASE_URL,
      message: "Connected to Supabase. 'appointments' table is live and active!"
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      connected: false,
      tableReady: false,
      projectId: SUPABASE_PROJECT_ID,
      error: err.message
    });
  }
});

app.post('/api/supabase/sync', requireAdminAuth, async (_req, res) => {
  const db = readDb();
  const appointments = db.appointments || [];
  let syncedCount = 0;
  const errors: string[] = [];

  for (const apt of appointments) {
    try {
      const { error } = await supabase.from('appointments').upsert({
        id: apt.id,
        created_at: apt.createdAt || new Date().toISOString(),
        customer_name: apt.customerName,
        phone: apt.phone,
        email: apt.email || "",
        vehicle_make: apt.vehicleMake,
        vehicle_model: apt.vehicleModel,
        vehicle_number: apt.vehicleNumber,
        fuel_type: apt.fuelType,
        service_id: apt.serviceId,
        service_title: apt.serviceTitle,
        staff_id: apt.staffId,
        staff_name: apt.staffName,
        date: apt.date,
        time_slot: apt.timeSlot,
        status: apt.status,
        notes: apt.notes || "",
        price: apt.price
      }, { onConflict: 'id' });

      if (error) {
        errors.push(`${apt.id}: ${error.message}`);
      } else {
        syncedCount++;
      }
    } catch (err: any) {
      errors.push(`${apt.id}: ${err.message}`);
    }
  }

  res.json({
    success: true,
    total: appointments.length,
    synced: syncedCount,
    errors
  });
});

// Analytics & Dashboard Summary
app.get('/api/stats', requireAdminAuth, (_req, res) => {
  const db = readDb();
  const appointments = db.appointments || [];

  const total = appointments.length;
  const confirmed = appointments.filter((a: any) => a.status === 'confirmed').length;
  const inProgress = appointments.filter((a: any) => a.status === 'in-progress').length;
  const completed = appointments.filter((a: any) => a.status === 'completed').length;
  const cancelled = appointments.filter((a: any) => a.status === 'cancelled').length;

  const revenue = appointments
    .filter((a: any) => a.status === 'completed' || a.status === 'confirmed')
    .reduce((sum: number, a: any) => sum + (Number(a.price) || 0), 0);

  res.json({
    success: true,
    data: {
      total,
      confirmed,
      inProgress,
      completed,
      cancelled,
      estimatedRevenue: revenue,
      rating: db.business.googleRating,
      reviewCount: db.business.totalReviews + (db.reviews ? db.reviews.length - 4 : 0)
    }
  });
});

// Vite middleware in dev or static files in production
async function setupVite() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Quality Motors Server running on http://0.0.0.0:${PORT}`);
  });
}

setupVite();
