-- AMC (Annual Maintenance Contracts) Tables for Contractors Management

-- Main contracts table
CREATE TABLE IF NOT EXISTS amc_contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    company TEXT,
    category TEXT NOT NULL,
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Expired', 'On-Hold')),
    start_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Expiry tracking table
CREATE TABLE IF NOT EXISTS amc_expiry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID REFERENCES amc_contracts(id) ON DELETE CASCADE,
    expiry_date DATE NOT NULL,
    notification_sent BOOLEAN DEFAULT FALSE
);

-- Contacts table
CREATE TABLE IF NOT EXISTS amc_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID REFERENCES amc_contracts(id) ON DELETE CASCADE,
    contact_name TEXT NOT NULL,
    role TEXT,
    phone TEXT,
    email TEXT
);

-- Pricing table
CREATE TABLE IF NOT EXISTS amc_pricing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID REFERENCES amc_contracts(id) ON DELETE CASCADE,
    contract_value NUMERIC(12, 2) NOT NULL,
    currency TEXT DEFAULT 'OMR',
    payment_terms TEXT
);

-- Enable Row Level Security (RLS) - allow all for now (public read/write)
ALTER TABLE amc_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE amc_expiry ENABLE ROW LEVEL SECURITY;
ALTER TABLE amc_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE amc_pricing ENABLE ROW LEVEL SECURITY;

-- Create policies to allow anonymous access (for development)
CREATE POLICY "Allow anonymous read access" ON amc_contracts FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert access" ON amc_contracts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update access" ON amc_contracts FOR UPDATE USING (true);
CREATE POLICY "Allow anonymous delete access" ON amc_contracts FOR DELETE USING (true);

CREATE POLICY "Allow anonymous read access" ON amc_expiry FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert access" ON amc_expiry FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update access" ON amc_expiry FOR UPDATE USING (true);
CREATE POLICY "Allow anonymous delete access" ON amc_expiry FOR DELETE USING (true);

CREATE POLICY "Allow anonymous read access" ON amc_contacts FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert access" ON amc_contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update access" ON amc_contacts FOR UPDATE USING (true);
CREATE POLICY "Allow anonymous delete access" ON amc_contacts FOR DELETE USING (true);

CREATE POLICY "Allow anonymous read access" ON amc_pricing FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert access" ON amc_pricing FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update access" ON amc_pricing FOR UPDATE USING (true);
CREATE POLICY "Allow anonymous delete access" ON amc_pricing FOR DELETE USING (true);

-- Insert sample data
INSERT INTO amc_contracts (name, company, category, status, start_date) VALUES
    ('Oman National Engineering', 'ONEIC', 'Maintenance', 'Active', '2024-01-01'),
    ('Muscat Bay Services', 'MBS', 'Facility Management', 'Active', '2024-06-01'),
    ('Specialized Security', 'Securitas', 'Security', 'Active', '2024-03-15'),
    ('Green World Landscaping', 'Green World', 'Landscaping', 'Expired', '2023-01-01'),
    ('Rapid Response Plumbing', 'RRP', 'Plumbing', 'On-Hold', '2024-05-01');

-- Add expiry dates for each contract
INSERT INTO amc_expiry (contract_id, expiry_date, notification_sent)
SELECT id, '2025-12-31', false FROM amc_contracts WHERE name = 'Oman National Engineering';
INSERT INTO amc_expiry (contract_id, expiry_date, notification_sent)
SELECT id, '2026-06-30', false FROM amc_contracts WHERE name = 'Muscat Bay Services';
INSERT INTO amc_expiry (contract_id, expiry_date, notification_sent)
SELECT id, '2025-11-15', false FROM amc_contracts WHERE name = 'Specialized Security';
INSERT INTO amc_expiry (contract_id, expiry_date, notification_sent)
SELECT id, '2024-12-01', true FROM amc_contracts WHERE name = 'Green World Landscaping';
INSERT INTO amc_expiry (contract_id, expiry_date, notification_sent)
SELECT id, '2025-05-20', false FROM amc_contracts WHERE name = 'Rapid Response Plumbing';

-- Add contacts
INSERT INTO amc_contacts (contract_id, contact_name, role, phone, email)
SELECT id, 'Ahmed Al-Balushi', 'Project Manager', '+968 9123 4567', 'ahmed@oneic.om' FROM amc_contracts WHERE name = 'Oman National Engineering';
INSERT INTO amc_contacts (contract_id, contact_name, role, phone, email)
SELECT id, 'Fatima Al-Rashdi', 'Operations Head', '+968 9234 5678', 'fatima@mbs.om' FROM amc_contracts WHERE name = 'Muscat Bay Services';
INSERT INTO amc_contacts (contract_id, contact_name, role, phone, email)
SELECT id, 'Said Al-Hinai', 'Security Director', '+968 9345 6789', 'said@securitas.om' FROM amc_contracts WHERE name = 'Specialized Security';

-- Add pricing
INSERT INTO amc_pricing (contract_id, contract_value, currency, payment_terms)
SELECT id, 45000.00, 'OMR', 'Quarterly' FROM amc_contracts WHERE name = 'Oman National Engineering';
INSERT INTO amc_pricing (contract_id, contract_value, currency, payment_terms)
SELECT id, 120000.00, 'OMR', 'Monthly' FROM amc_contracts WHERE name = 'Muscat Bay Services';
INSERT INTO amc_pricing (contract_id, contract_value, currency, payment_terms)
SELECT id, 36000.00, 'OMR', 'Annually' FROM amc_contracts WHERE name = 'Specialized Security';
INSERT INTO amc_pricing (contract_id, contract_value, currency, payment_terms)
SELECT id, 15000.00, 'OMR', 'Bi-annually' FROM amc_contracts WHERE name = 'Green World Landscaping';
INSERT INTO amc_pricing (contract_id, contract_value, currency, payment_terms)
SELECT id, 8500.00, 'OMR', 'On-demand' FROM amc_contracts WHERE name = 'Rapid Response Plumbing';
