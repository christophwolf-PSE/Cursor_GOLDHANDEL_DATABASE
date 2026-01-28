-- Access requests table (run in Supabase SQL editor)
CREATE TABLE IF NOT EXISTS access_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    note TEXT,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','APPROVED','REJECTED')),
    approved_by TEXT,
    approved_at TIMESTAMP WITH TIME ZONE,
    rejected_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Minimal RLS suggestion (adjust for your policy)
-- ALTER TABLE access_requests ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "allow insert" ON access_requests FOR INSERT WITH CHECK (true);
-- CREATE POLICY "allow admin read" ON access_requests FOR SELECT USING (auth.role() = 'authenticated');
