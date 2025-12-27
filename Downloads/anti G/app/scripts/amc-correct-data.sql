-- ================================================
-- CORRECT AMC CONTRACTORS DATA FOR SUPABASE
-- Run this SQL in your Supabase SQL Editor
-- Project: utnlgeuqajmwibqmdmgt
-- ================================================

-- Step 1: Drop existing tables (clean start)
DROP TABLE IF EXISTS amc_contractor_pricing CASCADE;
DROP TABLE IF EXISTS amc_contractor_expiry CASCADE;
DROP TABLE IF EXISTS amc_contractor_details CASCADE;
DROP TABLE IF EXISTS amc_contractor_summary CASCADE;

-- Also drop old tables if they exist
DROP TABLE IF EXISTS amc_pricing CASCADE;
DROP TABLE IF EXISTS amc_contacts CASCADE;
DROP TABLE IF EXISTS amc_expiry CASCADE;
DROP TABLE IF EXISTS amc_contracts CASCADE;

-- ================================================
-- TABLE 1: AMC_Contractor_Summary (Main table)
-- ================================================
CREATE TABLE amc_contractor_summary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    no INT,
    contractor TEXT NOT NULL,
    service_category TEXT,
    contract_ref TEXT,
    contract_type TEXT,
    start_date TEXT,
    end_date TEXT,
    duration TEXT,
    monthly_fee_omr TEXT,
    annual_fee_omr TEXT,
    total_contract_value_omr TEXT,
    status TEXT,
    alert TEXT,
    document_status TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- TABLE 2: AMC_Contractor_Details
-- ================================================
CREATE TABLE amc_contractor_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contractor TEXT NOT NULL,
    contract_ref TEXT,
    scope_of_work TEXT,
    ppm_frequency TEXT,
    response_time_emergency TEXT,
    response_time_normal TEXT,
    liquidated_damages TEXT,
    performance_bond TEXT,
    payment_terms TEXT,
    warranty_period TEXT,
    key_exclusions TEXT,
    contact_person TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- TABLE 3: AMC_Contractor_Expiry
-- ================================================
CREATE TABLE amc_contractor_expiry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contractor TEXT NOT NULL,
    end_date TEXT,
    days_remaining INT,
    renewal_action_required_by TEXT,
    priority TEXT,
    renewal_status TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- TABLE 4: AMC_Contractor_Pricing
-- ================================================
CREATE TABLE amc_contractor_pricing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contractor TEXT NOT NULL,
    year_1_omr TEXT,
    year_2_omr TEXT,
    year_3_omr TEXT,
    year_4_omr TEXT,
    year_5_omr TEXT,
    total_omr TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- ENABLE RLS ON ALL TABLES
-- ================================================
ALTER TABLE amc_contractor_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE amc_contractor_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE amc_contractor_expiry ENABLE ROW LEVEL SECURITY;
ALTER TABLE amc_contractor_pricing ENABLE ROW LEVEL SECURITY;

-- ================================================
-- CREATE PUBLIC READ POLICIES
-- ================================================
DROP POLICY IF EXISTS "Allow public read on amc_contractor_summary" ON amc_contractor_summary;
CREATE POLICY "Allow public read on amc_contractor_summary" ON amc_contractor_summary FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read on amc_contractor_details" ON amc_contractor_details;
CREATE POLICY "Allow public read on amc_contractor_details" ON amc_contractor_details FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read on amc_contractor_expiry" ON amc_contractor_expiry;
CREATE POLICY "Allow public read on amc_contractor_expiry" ON amc_contractor_expiry FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read on amc_contractor_pricing" ON amc_contractor_pricing;
CREATE POLICY "Allow public read on amc_contractor_pricing" ON amc_contractor_pricing FOR SELECT USING (true);

-- ================================================
-- INSERT DATA: AMC_Contractor_Summary (12 records)
-- ================================================
INSERT INTO amc_contractor_summary (no, contractor, service_category, contract_ref, contract_type, start_date, end_date, duration, monthly_fee_omr, annual_fee_omr, total_contract_value_omr, status, alert, document_status) VALUES
(1, 'KONE Assarain LLC', 'Elevator Maintenance', '0042356335', 'AMC', '01-Jan-2026', '31-Dec-2027', '2 Years', '962.50', '11,550.00', '23,100.00', 'Active', '✅ Active', '✅ Complete'),
(2, 'OWATCO', 'STP Operation & Maintenance', 'CO-SBJ-24-0231', 'AMC', '26-Jan-2024', '25-Jan-2029', '5 Years', '3,103.80', '37,245.40', '199,496.08', 'Active', '✅ Active', '✅ Complete'),
(3, 'Kalhat Services & Trading', 'Facility Management (FM)', 'CO-SBJ-24-0232', 'AMC', '07-May-2024', '06-May-2030', '5 Years', '32,200.81', '386,409.72', '1,932,048.59', 'Active', '✅ Active', '✅ Complete'),
(4, 'Future Cities (Tadoom)', 'Smart Water Meters & Billing', 'Jun-2022 Agreement', 'AMC', '24-Sep-2024', '23-Sep-2032', '8 Years', '184.30', '2,211.60', '17,692.80', 'Active', '✅ Active', '✅ Complete'),
(5, 'Muna Noor International', 'Pest Control Services', 'CO-SBJ-24-0235', 'AMC', '01-Jul-2024', '30-Jun-2026', '2 Years', '140.00', '1,680.00', '3,360.00', 'Active', '⚠️ Expiring Soon', '✅ Complete'),
(6, 'Gulf Expert', 'Chillers, BMS & Pressurisation', 'GE-2025-BMS', 'AMC', '03-Jun-2025', '02-Jun-2026', '1 Year', '603.00', '7,234.50', '7,234.50', 'Active', '⚠️ Expiring Soon', '✅ Complete'),
(7, 'Gulf Expert', 'BMS AMC FM & Staff Accommodation', 'GE-2025-HVAC', 'AMC', '03-Jun-2025', '02-Jun-2026', '1 Year', '2,205.00', '26,460.00', '26,460.00', 'Active', '⚠️ Expiring Soon', '✅ Complete'),
(8, 'BEC (Bahwan Engineering)', 'Fire Alarm & Fire Fighting', 'MIS-SBJ-25-077', 'AMC', '01-Nov-2025', '31-Oct-2027', '2 Years', '634.38', '7,612.50', '15,225.00', 'Active', '✅ Active', '✅ Complete'),
(9, 'National Marine Services', 'Diving Services', 'PO Based', 'PO', '06-Nov-2024', '05-Nov-2026', '2 Years', '4,757.76', '57,093.12', '114,186.24', 'Active', '✅ Active', '⚠️ Missing'),
(10, 'Muscat Electronics', 'Daikin AC (Sale Center)', 'PO Based', 'PO', '03-Jun-2025', '02-Jun-2026', '1 Year', '871.82', '10,461.84', '10,461.84', 'Active', '⚠️ Expiring Soon', '⚠️ Missing'),
(11, 'Iron Mountain / ARAMEX', 'Offsite Record Storage', 'Schedule Based', 'Contract', '01-Jan-2025', '31-Dec-2025', '1 Year', '0.00', '0.00', '0.00', 'Active', '⚠️ Expiring Soon', '⚠️ Missing'),
(12, 'Al Khalili', 'CCTV Contract', 'AK-2025-CCTV', 'AMC', '01-Sep-2025', '31-Aug-2030', '5 Years', '1,166.31', '13,995.66', '69,978.30', 'Active', '✅ Active', '⚠️ Missing');

-- ================================================
-- INSERT DATA: AMC_Contractor_Details (12 records)
-- ================================================
INSERT INTO amc_contractor_details (contractor, contract_ref, scope_of_work, ppm_frequency, response_time_emergency, response_time_normal, liquidated_damages, performance_bond, payment_terms, warranty_period, key_exclusions, contact_person) VALUES
('KONE Assarain LLC', '0042356335', 'Comprehensive lift maintenance for 22 elevators including Village Square', 'Quarterly PPM visits', 'N/A', 'N/A', 'As per base contract', 'N/A', 'Quarterly in advance, 45 days net', 'As per base contract', 'N/A', 'Said Al Mahruqy'),
('OWATCO', 'CO-SBJ-24-0231', 'Full STP O&M, MBR operation, chemicals, PPM, 750m³/day target', 'Daily maintenance + PPM', '3 hrs inspection, 24 hrs repair', '24 hrs inspection, 3 days repair', 'Emergency: OMR 50/day (max 500), Urgent: OMR 35/day, Normal: OMR 25/day', '5% of contract value', '60 days after certification', '12 months', 'Electrical damage from power surges, natural calamities', 'Karthick'),
('Kalhat Services', 'CO-SBJ-24-0232', 'FM services: cleaning, landscaping, MEP maintenance, waste management', 'As per PPM schedule', '30 min inspection, 8 hrs repair', '3 hrs inspection, 5 days repair', 'Emergency: OMR 25/day, Normal: OMR 15/day', '5% within 7 days', '60 days in arrears', '12 months', 'VRF system, specialized systems (elevators, chillers)', 'Amjad Khan / Jyotirmoy'),
('Tadoom', 'Jun-2022 Agreement', 'AMR meter installation, billing, collection & debt factoring', 'As per agreement', 'N/A', 'N/A', 'N/A', 'N/A', 'Per meter collection fee', 'N/A', 'N/A', 'Mohammed Al Rawahi'),
('Muna Noor', 'CO-SBJ-24-0235', 'Pest control for common areas - mosquitoes, lizards, snakes, rats', 'Daily evening logging', 'N/A', 'N/A', 'N/A', 'N/A', 'Monthly, 30 days', 'N/A', 'Extra services charged separately', 'Sayed Raza'),
('Gulf Expert (BMS)', 'GE-2025-BMS', 'Johnson Control BMS maintenance, DDC testing, calibration', 'Quarterly (4 PPM/year)', '24 hours', 'N/A', 'N/A', 'N/A', '30 days after service', 'N/A', 'Spare parts, civil works, software upgrades', 'N/A'),
('Gulf Expert (HVAC)', 'GE-2025-HVAC', 'YORK Chillers maintenance (18 units), chemical dosing, pressurization', 'Quarterly (3 Minor + 1 Major)', '2-4 hours', 'N/A', 'N/A', 'N/A', '30 days after service', 'N/A', 'Spare parts, chemical treatment, VRF, tube failures', 'N/A'),
('BEC', 'MIS-SBJ-25-077', 'Fire alarm & fire fighting for office, 21 apartments, external facilities', '4-monthly (FA/FF), Half-yearly (extinguishers)', '3 hours (Priority 1)', '24 hours (Priority 3)', 'N/A', 'Insurance: OMR 100K property, OMR 250K third party', 'In arrears after completion', 'N/A', 'Civil, carpentry, false ceiling works', 'Joji John'),
('National Marine', 'PO Based', 'Professional diving services for marine infrastructure', 'As required', 'N/A', 'N/A', 'N/A', 'N/A', 'Per PO terms', 'N/A', 'N/A', 'N/A'),
('Muscat Electronics', 'PO Based', 'Daikin AC maintenance at Sales Center', 'Quarterly service', 'N/A', 'N/A', 'N/A', 'N/A', 'Per PO terms', 'N/A', 'N/A', 'N/A'),
('Iron Mountain', 'Schedule Based', 'Offsite document storage and retrieval', 'As per schedule', 'N/A', 'N/A', 'N/A', 'N/A', 'Per rate schedule', 'N/A', 'N/A', 'N/A'),
('Al Khalili', 'AK-2025-CCTV', 'CCTV and gate barrier system maintenance', 'As per contract', 'N/A', 'N/A', 'N/A', 'N/A', 'As per contract', 'N/A', 'N/A', 'Hamed AlAlawi (internal)');

-- ================================================
-- INSERT DATA: AMC_Contractor_Expiry (12 records)
-- ================================================
INSERT INTO amc_contractor_expiry (contractor, end_date, days_remaining, renewal_action_required_by, priority, renewal_status) VALUES
('Iron Mountain / ARAMEX', '31-Dec-2025', 15, '01-Oct-2025', '🔴 HIGH', 'Action Required'),
('Gulf Expert (BMS)', '02-Jun-2026', 168, '01-Mar-2026', '🟡 MEDIUM', 'Planning'),
('Gulf Expert (HVAC)', '02-Jun-2026', 168, '01-Mar-2026', '🟡 MEDIUM', 'Planning'),
('Muscat Electronics', '02-Jun-2026', 168, '01-Mar-2026', '🟡 MEDIUM', 'Planning'),
('Muna Noor', '30-Jun-2026', 196, '01-Apr-2026', '🟡 MEDIUM', 'Planning'),
('National Marine', '05-Nov-2026', 324, '01-Aug-2026', '🟢 LOW', 'Not Started'),
('KONE', '31-Dec-2027', 746, '01-Oct-2027', '🟢 LOW', 'Not Started'),
('BEC (Fire)', '31-Oct-2027', 685, '01-Aug-2027', '🟢 LOW', 'Not Started'),
('OWATCO', '25-Jan-2029', 1136, '01-Nov-2028', '🟢 LOW', 'Not Started'),
('Al Khalili', '31-Aug-2030', 1720, '01-Jun-2030', '🟢 LOW', 'Not Started'),
('Kalhat', '06-May-2030', 1603, '01-Feb-2030', '🟢 LOW', 'Not Started'),
('Tadoom', '23-Sep-2032', 2473, '01-Jun-2032', '🟢 LOW', 'Not Started');

-- ================================================
-- INSERT DATA: AMC_Contractor_Pricing (10 records)
-- ================================================
INSERT INTO amc_contractor_pricing (contractor, year_1_omr, year_2_omr, year_3_omr, year_4_omr, year_5_omr, total_omr, notes) VALUES
('OWATCO (STP)', '37,245.60', '38,757.82', '40,269.54', '41,290.01', '41,933.11', '199,496.08', 'Annual escalation applied'),
('Kalhat (FM)', '386,409.72', '386,409.72', '386,409.72', '386,409.72', '386,409.72', '1,932,048.59', 'Fixed annual rate'),
('KONE (Lifts)', '11,550.00', '11,550.00', '-', '-', '-', '23,100.00', '2-year contract'),
('BEC (Fire)', '7,612.50', '7,612.50', '-', '-', '-', '15,225.00', '2-year contract'),
('Gulf Expert (BMS)', '2,205.00', '-', '-', '-', '-', '2,205.00', '1-year, renewal pending'),
('Gulf Expert (HVAC)', '7,234.50', '-', '-', '-', '-', '7,234.50', '1-year, renewal pending'),
('Muna Noor (Pest)', '1,680.00', '1,680.00', '-', '-', '-', '3,360.00', '2-year contract'),
('National Marine', '57,093.12', '57,093.12', '-', '-', '-', '114,186.24', '2-year PO'),
('Al Khalili (CCTV)', '13,995.66', '13,995.66', '13,995.66', '13,995.66', '13,995.66', '69,978.30', '5-year contract'),
('TOTAL ANNUAL COMMITMENT', '525,026.10', '', '', '', '', '2,366,833.71', '');

-- ================================================
-- VERIFICATION: Check data was inserted
-- ================================================
SELECT 'amc_contractor_summary' as table_name, COUNT(*) as record_count FROM amc_contractor_summary
UNION ALL
SELECT 'amc_contractor_details', COUNT(*) FROM amc_contractor_details
UNION ALL
SELECT 'amc_contractor_expiry', COUNT(*) FROM amc_contractor_expiry
UNION ALL
SELECT 'amc_contractor_pricing', COUNT(*) FROM amc_contractor_pricing;
