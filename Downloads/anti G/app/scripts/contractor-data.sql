-- SQL Script to insert Contractor_Tracker data into Supabase
-- Run this in Supabase SQL Editor
-- NOTE: This script INSERTS data without deleting existing rows

-- First, disable RLS if needed
ALTER TABLE "Contractor_Tracker" DISABLE ROW LEVEL SECURITY;

-- Insert all contractor data (will add to existing rows)
INSERT INTO "Contractor_Tracker" (
    "Contractor",
    "Service Provided",
    "Status",
    "Contract Type",
    "Start Date",
    "End Date",
    "Contract (OMR)/Month",
    "Contract Total (OMR)/Year",
    "Annual Value (OMR)",
    "Renewal Plan",
    "Note"
) VALUES
-- Active Contracts
('ACME Arabian LLC', 'Fit Maintenance Services', 'Active', 'Contract', '1/9/2023', '12/31/2028', '913.500 OMR', '11,316 OMR (inc VAT)', 11316, '5 year contract', NULL),
('Oman Water Treatment Company LLC', 'Extensive Water STP Operations And Maintenance', 'Active', 'Contract', '1/8/2024', '1/7/2029', NULL, '389,400 OMR (inc VAT)', 389400, '5 year contract - via RFP', NULL),
('Akkas', 'Fire/Firefighting SIL', 'Active', 'PO', '9/4/2023', '9/4/2024', NULL, '15,943.100 OMR', 15943.10, 'View contract and replace EFIC', NULL),
('Nama Elect (MEDC) / TANWEER', 'Supply and Maintenance EVSE (Power Meters, Bill)', 'Active', 'Contract', NULL, NULL, NULL, NULL, NULL, 'View contract and replace EFIC', NULL),
('Muscat Waste Mgt (Beaah)', 'Pest Control Services', 'Active', 'PO', '7/2/2023', '6/22/2024', NULL, '4,640 OMR/Year', 4640, NULL, NULL),
('Gulf Egypt', 'Chiller, BMCS & Preventive Maint only', 'Active', 'Contract', '6/7/2022', '6/7/2025', NULL, '17,820.350 OMR', 17820.35, '2 year contract for fire alarm & fire fighting systems', NULL),
('Bahwan Engineering Company LLC', 'Maintenance of Fire Alarm & Fire Fighting Equipment', 'Active', 'Contract', '1/1/2024', '12/31/2025', NULL, '4,546.192 OMR/Year', 4546.19, NULL, NULL),
('Gulf Expert', 'CCTV Access & Staff Accommodation', 'Active', 'Contract', '7/1/2024', '6/30/2027', NULL, '1,079,500 OMR', 1079500, NULL, NULL),
('COSMO', 'Facility Management (FM)', 'Active', 'Contract', '2/1/2022', '2/28/2025', '46,882 OMR/Month', '562,584 OMR', 562584, NULL, NULL),
('Future Cities S.A.O.C (Estidama)', 'Supply and Installation of Smart Control S.', 'Active', 'Contract', NULL, NULL, NULL, '1,474 OMR/milestone onetime', 1474, 'New comments applied', NULL),
('Garaloo', 'Park AC Chillers/Core Pit Maintenance & Details', 'Active', 'Contract', NULL, NULL, NULL, NULL, NULL, 'Details to be confirmed/uploaded', NULL),
('Ras Mountain / ARAMEX', 'Offsite Record Storage', 'Active', 'Contract', NULL, '5/17/2025', NULL, NULL, NULL, 'Changes on next calendar year January', NULL),
('Nasco', 'Facility Management (FM)', 'Active', 'Contract', '6/1/2024', NULL, NULL, '389,468 OMR/hr VTE', 389468, '1 year contract to be evaluated with COSMO', NULL),
('KONE Hiessen LLC', 'Lift Maintenance Services', 'Active', 'Contract', '7/1/2024', '2/28/2025', NULL, '16,200 OMR/hr (inc VTE)', 16200, 'New contract - As Omanized WITH COSMO', NULL),
('Mann Appel (Frankland) LLC', 'Pest Control Services', 'Active', 'Contract', '2/1/2024', '1/31/2025', NULL, '9,488 OMR', 9488, NULL, NULL),
('Warner Electricals LLC', 'Interim AC Maintenance', 'Active', 'Contract', '1/1/2024', '12/31/2025', NULL, NULL, NULL, 'Awaiting agreement, evaluation for external', NULL),
('Muscat Electronics LLC', 'AC of Sela Center', 'Active', 'PO', '1/1/2024', '1/25/2025', NULL, NULL, NULL, NULL, NULL),
('Hayward Marine Services LLC', 'Display Services', 'Active', 'PO', '4/1/2024', NULL, NULL, NULL, NULL, NULL, NULL),
('Ocean Prime Manufacturing Om', 'Supply, Installation, and Commissioning', 'Active', 'Contract', NULL, NULL, NULL, '22,080 OMR on delivery', 22080, 'Done - review & note on qty. temperature', NULL),
-- Expired Contracts
('Color Vision', 'Comprehensive STP Operation and Maintenance', 'Expired', 'Contract', '4/2/2019', '4/25/2023', '4,682 OMR /Month', NULL, NULL, NULL, NULL),
('Advance Technology and Financial', 'BMS Maintenance (prev Aspect Control Group)', 'Expired', 'Contract', NULL, '4/12/2023', NULL, NULL, NULL, 'Not Renewing - Service covered by others', 'Transferred to Radfield before contract end'),
('Al Water Services LLC', 'Drainage/Flooded Rain Water', 'Expired', 'Contract', '4/2/2019', NULL, NULL, NULL, NULL, NULL, NULL),
('Saeed Dabal', 'Provision of Services', 'Expired', 'Contract', '1/5/2020', '1/5/2021', '10,927 OMR per annum', '12,073 OMR', 12073, NULL, 'Due to termination / note - no documentation'),
('Muscat Electricity LLC', 'Sales AC Controls Maintenance', 'Expired', 'Contract', '8/15/2021', '8/14/2023', NULL, '8,100 OMR', 8100, NULL, NULL),
-- Retaining
('Oman Water Treatment Company (CWAN)', 'Comprehensive STP Operation and Maintenance', 'Retaining', 'Contract', '1/8/2024', '1/7/2028', NULL, NULL, NULL, NULL, NULL),
('Mr Plus', 'Master Bay Maintenance', 'Expired', 'NC', NULL, NULL, NULL, NULL, NULL, 'Details to be confirmed/uploaded', NULL);

-- Verify the insert
SELECT COUNT(*) as total_rows FROM "Contractor_Tracker";
