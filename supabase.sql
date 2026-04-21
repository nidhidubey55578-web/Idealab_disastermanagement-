-- Create the 'users' table
CREATE TABLE public.users (
    id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the 'alerts' table for live disasters
CREATE TABLE public.alerts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    location TEXT NOT NULL,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    disaster_type TEXT NOT NULL, -- e.g., 'Flood', 'Fire', 'Cyclone', 'Earthquake'
    severity TEXT NOT NULL, -- e.g., 'High', 'Medium', 'Low'
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the 'verified_news' table
CREATE TABLE public.verified_news (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    query_text TEXT NOT NULL,
    status TEXT NOT NULL, -- 'TRUE', 'FALSE', 'UNVERIFIED'
    confidence INTEGER NOT NULL,
    explanation TEXT,
    sources JSONB, -- Array of strings (sources)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the 'reported_fake' table for community reports
CREATE TABLE public.reported_fake (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    news_text TEXT NOT NULL,
    reported_by UUID REFERENCES public.users(id),
    status TEXT DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Optional: Enable RLS (Row Level Security)
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verified_news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reported_fake ENABLE ROW LEVEL SECURITY;

-- Policies for public access (Read-only for alerts and verified_news for MVP)
CREATE POLICY "Allow public read access for alerts" ON public.alerts FOR SELECT USING (true);
CREATE POLICY "Allow public read access for verified_news" ON public.verified_news FOR SELECT USING (true);
CREATE POLICY "Allow public insert for reported_fake" ON public.reported_fake FOR INSERT WITH CHECK (true);
