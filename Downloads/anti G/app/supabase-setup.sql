-- ================================================
-- SUPABASE ASSETS TABLE SETUP
-- Run this SQL in your Supabase SQL Editor
-- Dashboard: https://supabase.com/dashboard/project/wwnolziatkkshslhbove/sql/new
-- ================================================

-- 1. Create the assets table
CREATE TABLE IF NOT EXISTS assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    location TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Active', 'Under Maintenance', 'Decommissioned', 'In Storage')),
    purchase_date DATE,
    value NUMERIC(12, 2) DEFAULT 0,
    serial_number TEXT,
    last_service DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

-- 3. Create a policy to allow public read access (using anon key)
CREATE POLICY "Allow public read access" 
ON assets 
FOR SELECT 
USING (true);

-- 4. Optional: Insert sample data to test the connection
INSERT INTO assets (name, type, location, status, purchase_date, value, serial_number, last_service) VALUES
('HVAC Unit A1', 'HVAC System', 'Building A - Floor 1', 'Active', '2023-01-15', 15000.00, 'HVAC-2023-001', '2024-06-15'),
('Fire Pump FP-01', 'Fire Safety', 'Building A - Basement', 'Active', '2022-06-20', 25000.00, 'FP-2022-001', '2024-03-10'),
('Generator G1', 'Power', 'Building B - Basement', 'Under Maintenance', '2021-03-10', 50000.00, 'GEN-2021-001', '2024-09-01'),
('Water Pump WP-02', 'Plumbing', 'Building C - Roof', 'Active', '2023-08-05', 8000.00, 'WP-2023-002', '2024-07-20'),
('Elevator EL-01', 'Vertical Transport', 'Building A', 'Active', '2020-01-01', 120000.00, 'EL-2020-001', '2024-08-15');

-- Done! Your assets table is now ready for use.
