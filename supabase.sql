-- ================================================================
-- DISASTER MANAGEMENT SYSTEM - COMPLETE SUPABASE SCHEMA
-- Paste this entire file into Supabase SQL Editor and click Run
-- ================================================================

-- Drop existing tables if they exist (safe reset)
DROP TABLE IF EXISTS public.reported_fake CASCADE;
DROP TABLE IF EXISTS public.verified_news CASCADE;
DROP TABLE IF EXISTS public.alerts CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- ----------------------------------------------------------------
-- 1. USERS TABLE
-- ----------------------------------------------------------------
CREATE TABLE public.users (
    id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------
-- 2. ALERTS TABLE (Live Disaster Alerts shown on the map)
-- ----------------------------------------------------------------
CREATE TABLE public.alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    location TEXT NOT NULL,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    disaster_type TEXT NOT NULL,
    severity TEXT NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------
-- 3. VERIFIED NEWS TABLE (AI fact-check results cache)
-- ----------------------------------------------------------------
CREATE TABLE public.verified_news (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    news_text TEXT NOT NULL,
    status TEXT NOT NULL,
    confidence INTEGER NOT NULL,
    explanation TEXT,
    sources JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------
-- 4. REPORTED FAKE NEWS TABLE (community reports)
-- ----------------------------------------------------------------
CREATE TABLE public.reported_fake (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    news_text TEXT NOT NULL,
    reported_by UUID REFERENCES public.users(id),
    status TEXT DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------
-- 5. ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- ----------------------------------------------------------------
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verified_news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reported_fake ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------
-- 6. SECURITY POLICIES
-- ----------------------------------------------------------------

-- ALERTS: anyone can read
CREATE POLICY "Allow public read access for alerts"
    ON public.alerts FOR SELECT USING (true);

-- ALERTS: anyone can insert (for demo/admin use)
CREATE POLICY "Allow public insert for alerts"
    ON public.alerts FOR INSERT WITH CHECK (true);

-- VERIFIED NEWS: anyone can read cached results
CREATE POLICY "Allow public read access for verified_news"
    ON public.verified_news FOR SELECT USING (true);

-- VERIFIED NEWS: backend can save AI results
CREATE POLICY "Allow backend insert for verified_news"
    ON public.verified_news FOR INSERT WITH CHECK (true);

-- REPORTED FAKE: anyone can submit a report
CREATE POLICY "Allow public insert for reported_fake"
    ON public.reported_fake FOR INSERT WITH CHECK (true);

-- REPORTED FAKE: anyone can read reports
CREATE POLICY "Allow public read access for reported_fake"
    ON public.reported_fake FOR SELECT USING (true);

-- ----------------------------------------------------------------
-- 7. SEED SAMPLE ALERT DATA (so the map is not empty)
-- ----------------------------------------------------------------
INSERT INTO public.alerts (title, location, lat, lng, disaster_type, severity, active) VALUES
('Severe Flooding Warning',  'Assam',          26.2006, 92.9376, 'Flood',      'High',   TRUE),
('Cyclone Biparjoy Path',   'Gujarat Coast',  22.2587, 71.1924, 'Cyclone',    'High',   TRUE),
('Forest Fire Alert',       'Uttarakhand',    30.0668, 79.0193, 'Fire',       'Medium', TRUE),
('Mild Earth Tremors',      'Delhi NCR',      28.7041, 77.1025, 'Earthquake', 'Low',    TRUE),
('Heavy Rainfall Warning',  'Mumbai',         19.0760, 72.8777, 'Flood',      'Medium', TRUE);
