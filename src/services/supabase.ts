import { createClient } from '@supabase/supabase-js';

export const SUPABASE_PROJECT_ID = 'tkodjrrpxyywduwsmwhg';
export const SUPABASE_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co`;
export const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_eEFWDP7CyW2sPUtdQLYsWg_BzQ3z899';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

export const SUPABASE_SQL_SCHEMA = `-- Quality Motors Appointments Table Setup for Supabase
-- Copy and paste this into your Supabase SQL Editor at:
-- https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/sql

CREATE TABLE IF NOT EXISTS public.appointments (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    vehicle_make TEXT NOT NULL,
    vehicle_model TEXT NOT NULL,
    vehicle_number TEXT NOT NULL,
    fuel_type TEXT,
    service_id TEXT NOT NULL,
    service_title TEXT NOT NULL,
    staff_id TEXT,
    staff_name TEXT,
    date DATE NOT NULL,
    time_slot TEXT NOT NULL,
    status TEXT DEFAULT 'confirmed',
    notes TEXT,
    price NUMERIC,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Allow public & website visitors to insert new appointment bookings
DROP POLICY IF EXISTS "Allow public booking insert" ON public.appointments;
CREATE POLICY "Allow public booking insert" 
ON public.appointments 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- Allow reading bookings for verification and workshop dashboard
DROP POLICY IF EXISTS "Allow public select" ON public.appointments;
CREATE POLICY "Allow public select" 
ON public.appointments 
FOR SELECT 
TO anon, authenticated 
USING (true);

-- Allow status updates and rescheduling
DROP POLICY IF EXISTS "Allow appointment updates" ON public.appointments;
CREATE POLICY "Allow appointment updates" 
ON public.appointments 
FOR UPDATE 
TO anon, authenticated 
USING (true);
`;
