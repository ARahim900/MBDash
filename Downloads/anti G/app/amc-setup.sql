-- ================================================
-- SUPABASE AMC CONTRACTORS TABLES SETUP
-- Run this SQL in your Supabase SQL Editor
-- ================================================

-- 1. Create amc_contracts table
CREATE TABLE IF NOT EXISTS amc_contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    company TEXT,
    category TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Active',
    start_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create amc_expiry table (Foreign Key to contracts)
CREATE TABLE IF NOT EXISTS amc_expiry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID REFERENCES amc_contracts(id) ON DELETE CASCADE,
    expiry_date DATE NOT NULL,
    notification_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create amc_contacts table
CREATE TABLE IF NOT EXISTS amc_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID REFERENCES amc_contracts(id) ON DELETE CASCADE,
    contact_name TEXT NOT NULL,
    role TEXT,
    phone TEXT,
    email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create amc_pricing table
CREATE TABLE IF NOT EXISTS amc_pricing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID REFERENCES amc_contracts(id) ON DELETE CASCADE,
    contract_value NUMERIC(12, 2) DEFAULT 0,
    currency TEXT DEFAULT 'AED',
    payment_terms TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Enable RLS on all tables
ALTER TABLE amc_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE amc_expiry ENABLE ROW LEVEL SECURITY;
ALTER TABLE amc_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE amc_pricing ENABLE ROW LEVEL SECURITY;

-- 6. Create Public Read Policies
DROP POLICY IF EXISTS "Allow public read access on amc_contracts" ON amc_contracts;
CREATE POLICY "Allow public read access on amc_contracts" ON amc_contracts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access on amc_expiry" ON amc_expiry;
CREATE POLICY "Allow public read access on amc_expiry" ON amc_expiry FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access on amc_contacts" ON amc_contacts;
CREATE POLICY "Allow public read access on amc_contacts" ON amc_contacts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access on amc_pricing" ON amc_pricing;
CREATE POLICY "Allow public read access on amc_pricing" ON amc_pricing FOR SELECT USING (true);

-- 7. Insert Sample Data
WITH new_contract AS (
    INSERT INTO amc_contracts (name, company, category, status, start_date)
    VALUES ('Annual Elevator Maintenance', 'Kone Elevators', 'Vertical Transport', 'Active', '2024-01-01')
    RETURNING id
)
INSERT INTO amc_expiry (contract_id, expiry_date, notification_sent)
SELECT id, '2024-12-31', false FROM new_contract;

WITH new_contract AS (
    INSERT INTO amc_contracts (name, company, category, status, start_date)
    VALUES ('Fire Alarm System Check', 'Honeywell', 'Fire Safety', 'Active', '2024-03-15')
    RETURNING id
)
INSERT INTO amc_expiry (contract_id, expiry_date, notification_sent)
SELECT id, '2025-03-14', false FROM new_contract;
