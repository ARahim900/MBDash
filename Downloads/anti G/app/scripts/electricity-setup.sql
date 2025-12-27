-- ================================================
-- ELECTRICITY METERS DATA SETUP
-- ================================================
-- Run this script in your Supabase SQL Editor
-- Project: Muscat Bay Facility Management
-- ================================================

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS electricity_readings CASCADE;
DROP TABLE IF EXISTS electricity_meters CASCADE;

-- ================================================
-- CREATE TABLES
-- ================================================

-- Electricity Meters table (meter metadata)
CREATE TABLE electricity_meters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    meter_type TEXT NOT NULL,
    account_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Electricity Readings table (monthly consumption data)
CREATE TABLE electricity_readings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    meter_id UUID NOT NULL REFERENCES electricity_meters(id) ON DELETE CASCADE,
    month TEXT NOT NULL,
    consumption NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_electricity_readings_meter_id ON electricity_readings(meter_id);
CREATE INDEX idx_electricity_readings_month ON electricity_readings(month);
CREATE INDEX idx_electricity_meters_type ON electricity_meters(meter_type);

-- ================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================

-- Enable RLS
ALTER TABLE electricity_meters ENABLE ROW LEVEL SECURITY;
ALTER TABLE electricity_readings ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous read access
CREATE POLICY "Allow anonymous read access on electricity_meters"
ON electricity_meters FOR SELECT
TO anon
USING (true);

CREATE POLICY "Allow anonymous read access on electricity_readings"
ON electricity_readings FOR SELECT
TO anon
USING (true);

-- ================================================
-- INSERT METER DATA
-- ================================================

INSERT INTO electricity_meters (name, meter_type, account_number) VALUES
('Beachwell', 'Beach well', 'R51903'),
('Central Park', 'Common Building', 'R54672'),
('ROP Building', 'Common Building', 'R53648'),
('Security Building', 'Common Building', 'R53649'),
('Village Square', 'Common Building', 'R56628'),
('D Building 44', 'D_Building', 'R53705'),
('D Building 45', 'D_Building', 'R53665'),
('D Building 46', 'D_Building', 'R53700'),
('D Building 47', 'D_Building', 'R53690'),
('D Building 48', 'D_Building', 'R53666'),
('D Building 49', 'D_Building', 'R53715'),
('D Building 50', 'D_Building', 'R53672'),
('D Building 51', 'D_Building', 'R53657'),
('D Building 52', 'D_Building', 'R53699'),
('D Building 53', 'D_Building', 'R54782'),
('D Building 54', 'D_Building', 'R54793'),
('D Building 55', 'D_Building', 'R54804'),
('D Building 56', 'D_Building', 'R54815'),
('D Building 57', 'D_Building', 'R54826'),
('D Building 58', 'D_Building', 'R54836'),
('D Building 59', 'D_Building', 'R54847'),
('D Building 60', 'D_Building', 'R54858'),
('D Building 61', 'D_Building', 'R54869'),
('D Building 62', 'D_Building', 'R53717'),
('D Building 74', 'D_Building', 'R53675'),
('D Building 75', 'D_Building', 'R53668'),
('Actuator DB 01 (Z8)', 'DB', 'R53196'),
('Actuator DB 02', 'DB', 'R51900'),
('Actuator DB 03', 'DB', 'R51904'),
('Actuator DB 04', 'DB', 'R51901'),
('Actuator DB 05', 'DB', 'R51907'),
('Actuator DB 06', 'DB', 'R51909'),
('Guard House', 'DB', 'R53651'),
('Helipad', 'DB', 'R52334'),
('Zone-3 landscape light 17', 'FP-Landscape Lights Z3', 'R54872'),
('Zone-3 landscape light 21', 'FP-Landscape Lights Z3', 'R54873'),
('Zone-3 landscape light 22', 'FP-Landscape Lights Z3', 'R54874'),
('Irrigation Tank 01', 'IRR', 'R52324 (R52326)'),
('Irrigation Tank 02', 'IRR', 'R52331'),
('Irrigation Tank 03', 'IRR', 'R52323'),
('Irrigation Tank 04', 'IRR', 'R53195'),
('Lifting Station 02', 'LS', 'R52328'),
('Lifting Station 03', 'LS', 'R52333'),
('Lifting Station 04', 'LS', 'R52324'),
('Lifting Station 05', 'LS', 'R52332'),
('Pumping Station 01', 'PS', 'R52330'),
('Pumping Station 03', 'PS', 'R52329'),
('Pumping Station 04', 'PS', 'R52327'),
('Pumping Station 05', 'PS', 'R52325'),
('Bank muscat', 'Retail', NULL),
('CIF kitchen', 'Retail', NULL),
('OUA Store (BTU Meter)', 'Retail', NULL),
('Street Light FP 01 (Z8)', 'Street Light', 'R53197'),
('Street Light FP 02', 'Street Light', 'R51906'),
('Street Light FP 03', 'Street Light', 'R51905'),
('Street Light FP 04', 'Street Light', 'R51908'),
('Street Light FP 05', 'Street Light', 'R51902');

-- ================================================
-- INSERT READINGS DATA
-- ================================================

-- Helper: Insert readings for each meter
-- Beachwell readings
INSERT INTO electricity_readings (meter_id, month, consumption)
SELECT id, month, consumption FROM electricity_meters, 
(VALUES 
    ('Apr-24', 16908), ('May-24', 46), ('Jun-24', 19332), ('Jul-24', 23170), ('Aug-24', 42241),
    ('Sep-24', 15223), ('Oct-24', 25370), ('Nov-24', 24383), ('Dec-24', 37236), ('Jan-25', 38168),
    ('Feb-25', 18422), ('Mar-25', 40), ('Apr-25', 27749), ('May-25', 23674), ('Jun-25', 46800),
    ('Jul-25', 33727), ('Aug-25', 29775), ('Sep-25', 32040), ('Oct-25', 29438)
) AS readings(month, consumption)
WHERE name = 'Beachwell';

-- Central Park readings
INSERT INTO electricity_readings (meter_id, month, consumption)
SELECT id, month, consumption FROM electricity_meters, 
(VALUES 
    ('Apr-24', 12208), ('May-24', 21845), ('Jun-24', 29438), ('Jul-24', 28186), ('Aug-24', 21995),
    ('Sep-24', 20202), ('Oct-24', 14900), ('Nov-24', 9604), ('Dec-24', 19032), ('Jan-25', 22819),
    ('Feb-25', 19974), ('Mar-25', 14190), ('Apr-25', 13846), ('May-25', 18783), ('Jun-25', 32135),
    ('Jul-25', 24330), ('Aug-25', 20201), ('Sep-25', 19814), ('Oct-25', 16122)
) AS readings(month, consumption)
WHERE name = 'Central Park';

-- ROP Building readings
INSERT INTO electricity_readings (meter_id, month, consumption)
SELECT id, month, consumption FROM electricity_meters, 
(VALUES 
    ('Apr-24', 2047), ('May-24', 4442), ('Jun-24', 3057), ('Jul-24', 4321), ('Aug-24', 4185),
    ('Sep-24', 3554), ('Oct-24', 3692), ('Nov-24', 3581), ('Dec-24', 2352), ('Jan-25', 2090),
    ('Feb-25', 2246), ('Mar-25', 1939), ('Apr-25', 3537), ('May-25', 4503), ('Jun-25', 4868),
    ('Jul-25', 3099), ('Aug-25', 3724), ('Sep-25', 2701), ('Oct-25', 2165)
) AS readings(month, consumption)
WHERE name = 'ROP Building';

-- Security Building readings
INSERT INTO electricity_readings (meter_id, month, consumption)
SELECT id, month, consumption FROM electricity_meters, 
(VALUES 
    ('Apr-24', 3529), ('May-24', 3898), ('Jun-24', 4255), ('Jul-24', 4359), ('Aug-24', 3728),
    ('Sep-24', 3676), ('Oct-24', 3140), ('Nov-24', 5702), ('Dec-24', 5131), ('Jan-25', 5559),
    ('Feb-25', 5417), ('Mar-25', 4504), ('Apr-25', 5978), ('May-25', 4964), ('Jun-25', 8519),
    ('Jul-25', 6940), ('Aug-25', 7909), ('Sep-25', 4345), ('Oct-25', 3551)
) AS readings(month, consumption)
WHERE name = 'Security Building';

-- Village Square readings
INSERT INTO electricity_readings (meter_id, month, consumption)
SELECT id, month, consumption FROM electricity_meters, 
(VALUES 
    ('Apr-24', 2550), ('May-24', 2550), ('Jun-24', 2550), ('Jul-24', 2550), ('Aug-24', 8117),
    ('Sep-24', 9087), ('Oct-24', 4038), ('Nov-24', 6229), ('Dec-24', 3695), ('Jan-25', 3304),
    ('Feb-25', 3335), ('Mar-25', 3383), ('Apr-25', 4415), ('May-25', 5963), ('Jun-25', 9112),
    ('Jul-25', 6904), ('Aug-25', 6890), ('Sep-25', 5908), ('Oct-25', 5946)
) AS readings(month, consumption)
WHERE name = 'Village Square';

-- D Building 44 readings
INSERT INTO electricity_readings (meter_id, month, consumption)
SELECT id, month, consumption FROM electricity_meters, 
(VALUES 
    ('Apr-24', 463), ('May-24', 2416), ('Jun-24', 2036), ('Jul-24', 2120), ('Aug-24', 1645),
    ('Sep-24', 1717), ('Oct-24', 1643), ('Nov-24', 1377), ('Dec-24', 764), ('Jan-25', 647),
    ('Feb-25', 657), ('Mar-25', 650), ('Apr-25', 1306), ('May-25', 2499), ('Jun-25', 3598),
    ('Jul-25', 1768), ('Aug-25', 2087), ('Sep-25', 1247), ('Oct-25', 1179)
) AS readings(month, consumption)
WHERE name = 'D Building 44';

-- D Building 45 readings
INSERT INTO electricity_readings (meter_id, month, consumption)
SELECT id, month, consumption FROM electricity_meters, 
(VALUES 
    ('Apr-24', 709), ('May-24', 2944), ('Jun-24', 1267), ('Jul-24', 262), ('Aug-24', 3212),
    ('Sep-24', 1330), ('Oct-24', 1570), ('Nov-24', 1252), ('Dec-24', 841), ('Jan-25', 670),
    ('Feb-25', 556), ('Mar-25', 608), ('Apr-25', 1069), ('May-25', 1974), ('Jun-25', 2840),
    ('Jul-25', 957), ('Aug-25', 544), ('Sep-25', 1825), ('Oct-25', 1043)
) AS readings(month, consumption)
WHERE name = 'D Building 45';

-- D Building 46 readings
INSERT INTO electricity_readings (meter_id, month, consumption)
SELECT id, month, consumption FROM electricity_meters, 
(VALUES 
    ('Apr-24', 818), ('May-24', 2392), ('Jun-24', 1620), ('Jul-24', 2216), ('Aug-24', 1671),
    ('Sep-24', 1718), ('Oct-24', 1734), ('Nov-24', 1577), ('Dec-24', 890), ('Jan-25', 724),
    ('Feb-25', 690), ('Mar-25', 752), ('Apr-25', 1292), ('May-25', 1969), ('Jun-25', 2517),
    ('Jul-25', 1739), ('Aug-25', 2273), ('Sep-25', 1872), ('Oct-25', 1749)
) AS readings(month, consumption)
WHERE name = 'D Building 46';

-- D Building 47 readings
INSERT INTO electricity_readings (meter_id, month, consumption)
SELECT id, month, consumption FROM electricity_meters, 
(VALUES 
    ('Apr-24', 918), ('May-24', 2678), ('Jun-24', 1446), ('Jul-24', 2173), ('Aug-24', 2068),
    ('Sep-24', 2073), ('Oct-24', 1651), ('Nov-24', 1774), ('Dec-24', 1055), ('Jan-25', 887),
    ('Feb-25', 738), ('Mar-25', 792), ('Apr-25', 1545), ('May-25', 1395), ('Jun-25', 2864),
    ('Jul-25', 1814), ('Aug-25', 2491), ('Sep-25', 2633), ('Oct-25', 2246)
) AS readings(month, consumption)
WHERE name = 'D Building 47';

-- D Building 48 readings
INSERT INTO electricity_readings (meter_id, month, consumption)
SELECT id, month, consumption FROM electricity_meters, 
(VALUES 
    ('Apr-24', 725), ('May-24', 1970), ('Jun-24', 1415), ('Jul-24', 1895), ('Aug-24', 1853),
    ('Sep-24', 1084), ('Oct-24', 1127), ('Nov-24', 1046), ('Dec-24', 785), ('Jan-25', 826),
    ('Feb-25', 676), ('Mar-25', 683), ('Apr-25', 1092), ('May-25', 1851), ('Jun-25', 1927),
    ('Jul-25', 1175), ('Aug-25', 1974), ('Sep-25', 1772), ('Oct-25', 1569)
) AS readings(month, consumption)
WHERE name = 'D Building 48';

-- D Building 49 readings
INSERT INTO electricity_readings (meter_id, month, consumption)
SELECT id, month, consumption FROM electricity_meters, 
(VALUES 
    ('Apr-24', 947), ('May-24', 2912), ('Jun-24', 780), ('Jul-24', 1911), ('Aug-24', 1714),
    ('Sep-24', 1839), ('Oct-24', 1785), ('Nov-24', 1608), ('Dec-24', 1068), ('Jan-25', 860),
    ('Feb-25', 837), ('Mar-25', 818), ('Apr-25', 984), ('May-25', 1346), ('Jun-25', 2986),
    ('Jul-25', 1092), ('Aug-25', 1105), ('Sep-25', 1848), ('Oct-25', 1616)
) AS readings(month, consumption)
WHERE name = 'D Building 49';

-- D Building 50 readings
INSERT INTO electricity_readings (meter_id, month, consumption)
SELECT id, month, consumption FROM electricity_meters, 
(VALUES 
    ('Apr-24', 577), ('May-24', 1253), ('Jun-24', 849), ('Jul-24', 1097), ('Aug-24', 1059),
    ('Sep-24', 1091), ('Oct-24', 1107), ('Nov-24', 1102), ('Dec-24', 789), ('Jan-25', 765),
    ('Feb-25', 785), ('Mar-25', 707), ('Apr-25', 1331), ('May-25', 2376), ('Jun-25', 3556),
    ('Jul-25', 1893), ('Aug-25', 2207), ('Sep-25', 1716.9), ('Oct-25', 1686.1)
) AS readings(month, consumption)
WHERE name = 'D Building 50';

-- D Building 51 readings
INSERT INTO electricity_readings (meter_id, month, consumption)
SELECT id, month, consumption FROM electricity_meters, 
(VALUES 
    ('Apr-24', 735), ('May-24', 3030), ('Jun-24', 1677), ('Jul-24', 2046), ('Aug-24', 2472),
    ('Sep-24', 2285), ('Oct-24', 2165), ('Nov-24', 1855), ('Dec-24', 710), ('Jan-25', 661),
    ('Feb-25', 682), ('Mar-25', 642), ('Apr-25', 904), ('May-25', 2170), ('Jun-25', 2235),
    ('Jul-25', 1825), ('Aug-25', 2406), ('Sep-25', 2149), ('Oct-25', 1970)
) AS readings(month, consumption)
WHERE name = 'D Building 51';

-- D Building 52 readings
INSERT INTO electricity_readings (meter_id, month, consumption)
SELECT id, month, consumption FROM electricity_meters, 
(VALUES 
    ('Apr-24', 727), ('May-24', 2882), ('Jun-24', 2087), ('Jul-24', 2897), ('Aug-24', 2786),
    ('Sep-24', 2990), ('Oct-24', 2501), ('Nov-24', 1986), ('Dec-24', 1208), ('Jan-25', 979),
    ('Feb-25', 896), ('Mar-25', 952), ('Apr-25', 1651), ('May-25', 2676), ('Jun-25', 3662),
    ('Jul-25', 2099), ('Aug-25', 2691), ('Sep-25', 2018), ('Oct-25', 1949)
) AS readings(month, consumption)
WHERE name = 'D Building 52';

-- D Building 53 readings
INSERT INTO electricity_readings (meter_id, month, consumption)
SELECT id, month, consumption FROM electricity_meters, 
(VALUES 
    ('Apr-24', 714), ('May-24', 2699), ('Jun-24', 1405), ('Jul-24', 1845), ('Aug-24', 1494),
    ('Sep-24', 1709), ('Oct-24', 1525), ('Nov-24', 1764), ('Dec-24', 968), ('Jan-25', 693),
    ('Feb-25', 732), ('Mar-25', 760), ('Apr-25', 1281), ('May-25', 1674), ('Jun-25', 1411),
    ('Jul-25', 1180), ('Aug-25', 1306), ('Sep-25', 1279.3), ('Oct-25', 2453.7)
) AS readings(month, consumption)
WHERE name = 'D Building 53';

-- D Building 54 readings
INSERT INTO electricity_readings (meter_id, month, consumption)
SELECT id, month, consumption FROM electricity_meters, 
(VALUES 
    ('Apr-24', 717), ('May-24', 2904), ('Jun-24', 1961), ('Jul-24', 2449), ('Aug-24', 3031),
    ('Sep-24', 1453), ('Oct-24', 1261), ('Nov-24', 1777), ('Dec-24', 834), ('Jan-25', 681),
    ('Feb-25', 559), ('Mar-25', 531), ('Apr-25', 1042), ('May-25', 1616), ('Jun-25', 2652),
    ('Jul-25', 1672), ('Aug-25', 1402), ('Sep-25', 1655), ('Oct-25', 1521)
) AS readings(month, consumption)
WHERE name = 'D Building 54';

-- D Building 55 readings
INSERT INTO electricity_readings (meter_id, month, consumption)
SELECT id, month, consumption FROM electricity_meters, 
(VALUES 
    ('Apr-24', 693), ('May-24', 2550), ('Jun-24', 1735), ('Jul-24', 2430), ('Aug-24', 2250),
    ('Sep-24', 2100), ('Oct-24', 1947), ('Nov-24', 1828), ('Dec-24', 1035), ('Jan-25', 677),
    ('Feb-25', 616), ('Mar-25', 719), ('Apr-25', 1417), ('May-25', 2087), ('Jun-25', 2703),
    ('Jul-25', 1385), ('Aug-25', 1245), ('Sep-25', 1554), ('Oct-25', 1493)
) AS readings(month, consumption)
WHERE name = 'D Building 55';

-- D Building 56 readings
INSERT INTO electricity_readings (meter_id, month, consumption)
SELECT id, month, consumption FROM electricity_meters, 
(VALUES 
    ('Apr-24', 938), ('May-24', 3099), ('Jun-24', 1617), ('Jul-24', 2384), ('Aug-24', 2185),
    ('Sep-24', 2190), ('Oct-24', 2055), ('Nov-24', 1805), ('Dec-24', 937), ('Jan-25', 683),
    ('Feb-25', 731), ('Mar-25', 765), ('Apr-25', 1536), ('May-25', 2052), ('Jun-25', 2938),
    ('Jul-25', 2391), ('Aug-25', 2330), ('Sep-25', 2724), ('Oct-25', 2863)
) AS readings(month, consumption)
WHERE name = 'D Building 56';

-- D Building 57 readings
INSERT INTO electricity_readings (meter_id, month, consumption)
SELECT id, month, consumption FROM electricity_meters, 
(VALUES 
    ('Apr-24', 574), ('May-24', 2704), ('Jun-24', 1816), ('Jul-24', 2477), ('Aug-24', 2429),
    ('Sep-24', 1935), ('Oct-24', 2260), ('Nov-24', 2262), ('Dec-24', 1332), ('Jan-25', 990),
    ('Feb-25', 846), ('Mar-25', 795), ('Apr-25', 1732), ('May-25', 2996), ('Jun-25', 3064),
    ('Jul-25', 1544), ('Aug-25', 2325), ('Sep-25', 2203), ('Oct-25', 1875)
) AS readings(month, consumption)
WHERE name = 'D Building 57';

-- D Building 58 readings
INSERT INTO electricity_readings (meter_id, month, consumption)
SELECT id, month, consumption FROM electricity_meters, 
(VALUES 
    ('Apr-24', 568), ('May-24', 2430), ('Jun-24', 1555), ('Jul-24', 2233), ('Aug-24', 1860),
    ('Sep-24', 1688), ('Oct-24', 1469), ('Nov-24', 1534), ('Dec-24', 778), ('Jan-25', 593),
    ('Feb-25', 535), ('Mar-25', 594), ('Apr-25', 1415), ('May-25', 1613), ('Jun-25', 2307),
    ('Jul-25', 532), ('Aug-25', 864), ('Sep-25', 1881), ('Oct-25', 1971)
) AS readings(month, consumption)
WHERE name = 'D Building 58';

-- D Building 59 readings
INSERT INTO electricity_readings (meter_id, month, consumption)
SELECT id, month, consumption FROM electricity_meters, 
(VALUES 
    ('Apr-24', 546), ('May-24', 1847), ('Jun-24', 1514), ('Jul-24', 2112), ('Aug-24', 1691),
    ('Sep-24', 1792), ('Oct-24', 1790), ('Nov-24', 1634), ('Dec-24', 998), ('Jan-25', 628),
    ('Feb-25', 582), ('Mar-25', 697), ('Apr-25', 1138), ('May-25', 1871), ('Jun-25', 2511),
    ('Jul-25', 1561), ('Aug-25', 2106), ('Sep-25', 1703), ('Oct-25', 1581)
) AS readings(month, consumption)
WHERE name = 'D Building 59';

-- D Building 60 readings
INSERT INTO electricity_readings (meter_id, month, consumption)
SELECT id, month, consumption FROM electricity_meters, 
(VALUES 
    ('Apr-24', 628), ('May-24', 1935), ('Jun-24', 1327), ('Jul-24', 1762), ('Aug-24', 1269),
    ('Sep-24', 1360), ('Oct-24', 1260), ('Nov-24', 1275), ('Dec-24', 705), ('Jan-25', 674),
    ('Feb-25', 612), ('Mar-25', 679), ('Apr-25', 1069), ('May-25', 1554), ('Jun-25', 2330),
    ('Jul-25', 1390), ('Aug-25', 2814), ('Sep-25', 2406), ('Oct-25', 2239)
) AS readings(month, consumption)
WHERE name = 'D Building 60';

-- D Building 61 readings
INSERT INTO electricity_readings (meter_id, month, consumption)
SELECT id, month, consumption FROM electricity_meters, 
(VALUES 
    ('Apr-24', 532), ('May-24', 2022), ('Jun-24', 1662), ('Jul-24', 2255), ('Aug-24', 1929),
    ('Sep-24', 1958), ('Oct-24', 1704), ('Nov-24', 1734), ('Dec-24', 977), ('Jan-25', 767),
    ('Feb-25', 800), ('Mar-25', 719), ('Apr-25', 1394), ('May-25', 2168), ('Jun-25', 2606),
    ('Jul-25', 2227), ('Aug-25', 3163), ('Sep-25', 2877), ('Oct-25', 2079)
) AS readings(month, consumption)
WHERE name = 'D Building 61';

-- D Building 62 readings
INSERT INTO electricity_readings (meter_id, month, consumption)
SELECT id, month, consumption FROM electricity_meters, 
(VALUES 
    ('Apr-24', 858), ('May-24', 2297), ('Jun-24', 1744), ('Jul-24', 2425), ('Aug-24', 2018),
    ('Sep-24', 1950), ('Oct-24', 1768), ('Nov-24', 1630), ('Dec-24', 957), ('Jan-25', 715),
    ('Feb-25', 677), ('Mar-25', 595), ('Apr-25', 800), ('May-25', 1788), ('Jun-25', 2886),
    ('Jul-25', 2181), ('Aug-25', 1953), ('Sep-25', 1743), ('Oct-25', 1800)
) AS readings(month, consumption)
WHERE name = 'D Building 62';

-- D Building 74 readings
INSERT INTO electricity_readings (meter_id, month, consumption)
SELECT id, month, consumption FROM electricity_meters, 
(VALUES 
    ('Apr-24', 718), ('May-24', 2495), ('Jun-24', 1291), ('Jul-24', 1895), ('Aug-24', 1339),
    ('Sep-24', 840), ('Oct-24', 1147), ('Nov-24', 1303), ('Dec-24', 766), ('Jan-25', 639),
    ('Feb-25', 566), ('Mar-25', 463), ('Apr-25', 1079), ('May-25', 2338), ('Jun-25', 3153),
    ('Jul-25', 1320), ('Aug-25', 1648), ('Sep-25', 1044), ('Oct-25', 701)
) AS readings(month, consumption)
WHERE name = 'D Building 74';

-- D Building 75 readings
INSERT INTO electricity_readings (meter_id, month, consumption)
SELECT id, month, consumption FROM electricity_meters, 
(VALUES 
    ('Apr-24', 795), ('May-24', 6744), ('Jun-24', 983), ('Jul-24', 1438), ('Aug-24', 1268),
    ('Sep-24', 1225), ('Oct-24', 1125), ('Nov-24', 1169), ('Dec-24', 702), ('Jan-25', 475),
    ('Feb-25', 508), ('Mar-25', 554), ('Apr-25', 912), ('May-25', 1510), ('Jun-25', 2005),
    ('Jul-25', 1851), ('Aug-25', 2072), ('Sep-25', 2262), ('Oct-25', 2418)
) AS readings(month, consumption)
WHERE name = 'D Building 75';

-- Actuator DB 01 (Z8) readings
INSERT INTO electricity_readings (meter_id, month, consumption)
SELECT id, month, consumption FROM electricity_meters, 
(VALUES 
    ('Apr-24', 39), ('May-24', 49), ('Jun-24', 43), ('Jul-24', 43), ('Aug-24', 45),
    ('Sep-24', 43), ('Oct-24', 36), ('Nov-24', 34), ('Dec-24', 29), ('Jan-25', 7),
    ('Feb-25', 28), ('Mar-25', 24), ('Apr-25', 27.1), ('May-25', 22.5), ('Jun-25', 31),
    ('Jul-25', 23), ('Aug-25', 427), ('Sep-25', 7), ('Oct-25', 3)
) AS readings(month, consumption)
WHERE name = 'Actuator DB 01 (Z8)';

-- Actuator DB 02 readings
INSERT INTO electricity_readings (meter_id, month, consumption)
SELECT id, month, consumption FROM electricity_meters, 
(VALUES 
    ('Apr-24', 285), ('May-24', 335), ('Jun-24', 275), ('Jul-24', 220), ('Aug-24', 210),
    ('Sep-24', 219), ('Oct-24', 165), ('Nov-24', 232), ('Dec-24', 161), ('Jan-25', 33),
    ('Feb-25', 134), ('Mar-25', 139), ('Apr-25', 211), ('May-25', 234.5), ('Jun-25', 363),
    ('Jul-25', 145), ('Aug-25', 157), ('Sep-25', 215), ('Oct-25', 213)
) AS readings(month, consumption)
WHERE name = 'Actuator DB 02';

-- Actuator DB 03 readings
INSERT INTO electricity_readings (meter_id, month, consumption)
SELECT id, month, consumption FROM electricity_meters, 
(VALUES 
    ('Apr-24', 188), ('May-24', 226), ('Jun-24', 197), ('Jul-24', 203), ('Aug-24', 212),
    ('Sep-24', 203), ('Oct-24', 196), ('Nov-24', 220), ('Dec-24', 199), ('Jan-25', 56),
    ('Feb-25', 203), ('Mar-25', 196), ('Apr-25', 211.6), ('May-25', 188.4), ('Jun-25', 217),
    ('Jul-25', 133), ('Aug-25', 124), ('Sep-25', 130), ('Oct-25', 127)
) AS readings(month, consumption)
WHERE name = 'Actuator DB 03';

-- Actuator DB 04 readings
INSERT INTO electricity_readings (meter_id, month, consumption)
SELECT id, month, consumption FROM electricity_meters, 
(VALUES 
    ('Apr-24', 159), ('May-24', 275), ('Jun-24', 258), ('Jul-24', 210), ('Aug-24', 184),
    ('Sep-24', 201), ('Oct-24', 144), ('Nov-24', 172), ('Dec-24', 173), ('Jan-25', 186),
    ('Feb-25', 161), ('Mar-25', 227), ('Apr-25', 253), ('May-25', 163), ('Jun-25', 255),
    ('Jul-25', 211), ('Aug-25', 196), ('Sep-25', 228), ('Oct-25', 224)
) AS readings(month, consumption)
WHERE name = 'Actuator DB 04';

-- Actuator DB 05 readings
INSERT INTO electricity_readings (meter_id, month, consumption)
SELECT id, month, consumption FROM electricity_meters, 
(VALUES 
    ('Apr-24', 15), ('May-24', 18), ('Jun-24', 15), ('Jul-24', 16), ('Aug-24', 16),
    ('Sep-24', 16), ('Oct-24', 15), ('Nov-24', 18), ('Dec-24', 16), ('Jan-25', 4),
    ('Feb-25', 18), ('Mar-25', 14), ('Apr-25', 17.7), ('May-25', 15.3), ('Jun-25', 21),
    ('Jul-25', 17), ('Aug-25', 18), ('Sep-25', 16), ('Oct-25', 18)
) AS readings(month, consumption)
WHERE name = 'Actuator DB 05';

-- Actuator DB 06 readings
INSERT INTO electricity_readings (meter_id, month, consumption)
SELECT id, month, consumption FROM electricity_meters, 
(VALUES 
    ('Apr-24', 39), ('May-24', 50), ('Jun-24', 42), ('Jul-24', 48), ('Aug-24', 46),
    ('Sep-24', 129), ('Oct-24', 43), ('Nov-24', 49), ('Dec-24', 44), ('Jan-25', 47),
    ('Feb-25', 45), ('Mar-25', 38), ('Apr-25', 46.9), ('May-25', 44.1), ('Jun-25', 56),
    ('Jul-25', 42), ('Aug-25', 50), ('Sep-25', 45), ('Oct-25', 47)
) AS readings(month, consumption)
WHERE name = 'Actuator DB 06';

-- Guard House readings
INSERT INTO electricity_readings (meter_id, month, consumption)
SELECT id, month, consumption FROM electricity_meters, 
(VALUES 
    ('Apr-24', 823), ('May-24', 1489), ('Jun-24', 1574), ('Jul-24', 1586), ('Aug-24', 1325),
    ('Sep-24', 1391), ('Oct-24', 1205), ('Nov-24', 1225), ('Dec-24', 814), ('Jan-25', 798),
    ('Feb-25', 936), ('Mar-25', 879), ('Apr-25', 1467), ('May-25', 1764), ('Jun-25', 2249),
    ('Jul-25', 1481), ('Aug-25', 1657), ('Sep-25', 1404), ('Oct-25', 1325)
) AS readings(month, consumption)
WHERE name = 'Guard House';

-- Helipad readings (all zeros)
INSERT INTO electricity_readings (meter_id, month, consumption)
SELECT id, month, consumption FROM electricity_meters, 
(VALUES 
    ('Apr-24', 0), ('May-24', 0), ('Jun-24', 0), ('Jul-24', 0), ('Aug-24', 0),
    ('Sep-24', 0), ('Oct-24', 0), ('Nov-24', 0), ('Dec-24', 0), ('Jan-25', 0),
    ('Feb-25', 0), ('Mar-25', 0), ('Apr-25', 0), ('May-25', 0), ('Jun-25', 0),
    ('Jul-25', 0), ('Aug-25', 0), ('Sep-25', 0), ('Oct-25', 0)
) AS readings(month, consumption)
WHERE name = 'Helipad';

-- Zone-3 landscape light 17 readings (all zeros)
INSERT INTO electricity_readings (meter_id, month, consumption)
SELECT id, month, consumption FROM electricity_meters, 
(VALUES 
    ('Apr-24', 0), ('May-24', 0), ('Jun-24', 0), ('Jul-24', 0), ('Aug-24', 0),
    ('Sep-24', 0), ('Oct-24', 0), ('Nov-24', 0), ('Dec-24', 0), ('Jan-25', 0),
    ('Feb-25', 0), ('Mar-25', 0), ('Apr-25', 0), ('May-25', 0), ('Jun-25', 0),
    ('Jul-25', 0), ('Aug-25', 0), ('Sep-25', 0), ('Oct-25', 0)
) AS readings(month, consumption)
WHERE name = 'Zone-3 landscape light 17';

-- Zone-3 landscape light 21 readings
INSERT INTO electricity_readings (meter_id, month, consumption)
SELECT id, month, consumption FROM electricity_meters, 
(VALUES 
    ('Apr-24', 42), ('May-24', 67), ('Jun-24', 37), ('Jul-24', 42), ('Aug-24', 40),
    ('Sep-24', 33), ('Oct-24', 28), ('Nov-24', 40), ('Dec-24', 48), ('Jan-25', 13),
    ('Feb-25', 57), ('Mar-25', 47), ('Apr-25', 55), ('May-25', 41), ('Jun-25', 74),
    ('Jul-25', 59), ('Aug-25', 53), ('Sep-25', 55), ('Oct-25', 51)
) AS readings(month, consumption)
WHERE name = 'Zone-3 landscape light 21';

-- Zone-3 landscape light 22 readings
INSERT INTO electricity_readings (meter_id, month, consumption)
SELECT id, month, consumption FROM electricity_meters, 
(VALUES 
    ('Apr-24', 5), ('May-24', 10), ('Jun-24', 3), ('Jul-24', 5), ('Aug-24', 4),
    ('Sep-24', 5), ('Oct-24', 12), ('Nov-24', 6), ('Dec-24', 8), ('Jan-25', 0),
    ('Feb-25', 0), ('Mar-25', 0), ('Apr-25', 0), ('May-25', 0), ('Jun-25', 0),
    ('Jul-25', 0), ('Aug-25', 0), ('Sep-25', 0), ('Oct-25', 0)
) AS readings(month, consumption)
WHERE name = 'Zone-3 landscape light 22';

-- Irrigation Tank 01 readings
INSERT INTO electricity_readings (meter_id, month, consumption)
SELECT id, month, consumption FROM electricity_meters, 
(VALUES 
    ('Apr-24', 1543), ('May-24', 2673), ('Jun-24', 2763), ('Jul-24', 2623), ('Aug-24', 1467),
    ('Sep-24', 1290), ('Oct-24', 1244), ('Nov-24', 1432), ('Dec-24', 1268), ('Jan-25', 1689),
    ('Feb-25', 2214), ('Mar-25', 1718), ('Apr-25', 1663), ('May-25', 1980), ('Jun-25', 2380),
    ('Jul-25', 3457), ('Aug-25', 4004), ('Sep-25', 3800), ('Oct-25', 2726)
) AS readings(month, consumption)
WHERE name = 'Irrigation Tank 01';

-- Irrigation Tank 02 readings
INSERT INTO electricity_readings (meter_id, month, consumption)
SELECT id, month, consumption FROM electricity_meters, 
(VALUES 
    ('Apr-24', 1272), ('May-24', 2839), ('Jun-24', 3118), ('Jul-24', 2330), ('Aug-24', 2458),
    ('Sep-24', 1875), ('Oct-24', 893), ('Nov-24', 974), ('Dec-24', 1026), ('Jan-25', 983),
    ('Feb-25', 1124), ('Mar-25', 1110), ('Apr-25', 1830), ('May-25', 2282), ('Jun-25', 3260),
    ('Jul-25', 2681), ('Aug-25', 2100), ('Sep-25', 1260), ('Oct-25', 1225)
) AS readings(month, consumption)
WHERE name = 'Irrigation Tank 02';

-- Irrigation Tank 03 readings
INSERT INTO electricity_readings (meter_id, month, consumption)
SELECT id, month, consumption FROM electricity_meters, 
(VALUES 
    ('Apr-24', 894), ('May-24', 866), ('Jun-24', 1869), ('Jul-24', 1543), ('Aug-24', 1793),
    ('Sep-24', 524), ('Oct-24', 266), ('Nov-24', 269), ('Dec-24', 417), ('Jan-25', 840),
    ('Feb-25', 1009), ('Mar-25', 845), ('Apr-25', 1205), ('May-25', 1305), ('Jun-25', 2266),
    ('Jul-25', 1479), ('Aug-25', 1979), ('Sep-25', 1891), ('Oct-25', 1221)
) AS readings(month, consumption)
WHERE name = 'Irrigation Tank 03';

-- Irrigation Tank 04 readings
INSERT INTO electricity_readings (meter_id, month, consumption)
SELECT id, month, consumption FROM electricity_meters, 
(VALUES 
    ('Apr-24', 880), ('May-24', 827), ('Jun-24', 555), ('Jul-24', 443), ('Aug-24', 336),
    ('Sep-24', 195), ('Oct-24', 183), ('Nov-24', 212), ('Dec-24', 213), ('Jan-25', 40),
    ('Feb-25', 233), ('Mar-25', 235), ('Apr-25', 447.2), ('May-25', 1648), ('Jun-25', 1394),
    ('Jul-25', 884), ('Aug-25', 545), ('Sep-25', 1525), ('Oct-25', 870)
) AS readings(month, consumption)
WHERE name = 'Irrigation Tank 04';

-- Lifting Station 02 readings
INSERT INTO electricity_readings (meter_id, month, consumption)
SELECT id, month, consumption FROM electricity_meters, 
(VALUES 
    ('Apr-24', 44), ('May-24', 0), ('Jun-24', 0), ('Jul-24', 0), ('Aug-24', 153),
    ('Sep-24', 125), ('Oct-24', 0), ('Nov-24', 0), ('Dec-24', 0), ('Jan-25', 0),
    ('Feb-25', 0), ('Mar-25', 0), ('Apr-25', 0), ('May-25', 0), ('Jun-25', 0),
    ('Jul-25', 0), ('Aug-25', 0), ('Sep-25', 0), ('Oct-25', 0)
) AS readings(month, consumption)
WHERE name = 'Lifting Station 02';

-- Lifting Station 03 readings
INSERT INTO electricity_readings (meter_id, month, consumption)
SELECT id, month, consumption FROM electricity_meters, 
(VALUES 
    ('Apr-24', 198), ('May-24', 269), ('Jun-24', 122), ('Jul-24', 203), ('Aug-24', 208),
    ('Sep-24', 257), ('Oct-24', 196), ('Nov-24', 91), ('Dec-24', 185), ('Jan-25', 28),
    ('Feb-25', 40), ('Mar-25', 58), ('Apr-25', 83), ('May-25', 70), ('Jun-25', 85),
    ('Jul-25', 66), ('Aug-25', 68), ('Sep-25', 63.65), ('Oct-25', 64.35)
) AS readings(month, consumption)
WHERE name = 'Lifting Station 03';

-- Lifting Station 04 readings
INSERT INTO electricity_readings (meter_id, month, consumption)
SELECT id, month, consumption FROM electricity_meters, 
(VALUES 
    ('Apr-24', 644), ('May-24', 865), ('Jun-24', 791), ('Jul-24', 768), ('Aug-24', 747),
    ('Sep-24', 723), ('Oct-24', 628), ('Nov-24', 686), ('Dec-24', 631), ('Jan-25', 701),
    ('Feb-25', 638), ('Mar-25', 572), ('Apr-25', 750.22), ('May-25', 659.78), ('Jun-25', 698),
    ('Jul-25', 623), ('Aug-25', 636), ('Sep-25', 781), ('Oct-25', 786)
) AS readings(month, consumption)
WHERE name = 'Lifting Station 04';

-- Lifting Station 05 readings
INSERT INTO electricity_readings (meter_id, month, consumption)
SELECT id, month, consumption FROM electricity_meters, 
(VALUES 
    ('Apr-24', 2056), ('May-24', 2577), ('Jun-24', 2361), ('Jul-24', 3016), ('Aug-24', 3684),
    ('Sep-24', 5866), ('Oct-24', 1715), ('Nov-24', 2413), ('Dec-24', 2643), ('Jan-25', 2873),
    ('Feb-25', 3665), ('Mar-25', 3069), ('Apr-25', 4201.4), ('May-25', 5868.6), ('Jun-25', 8461),
    ('Jul-25', 6572), ('Aug-25', 6180), ('Sep-25', 3158), ('Oct-25', 3076)
) AS readings(month, consumption)
WHERE name = 'Lifting Station 05';

-- Pumping Station 01 readings
INSERT INTO electricity_readings (meter_id, month, consumption)
SELECT id, month, consumption FROM electricity_meters, 
(VALUES 
    ('Apr-24', 1608), ('May-24', 1940), ('Jun-24', 1783), ('Jul-24', 1874), ('Aug-24', 1662),
    ('Sep-24', 3822), ('Oct-24', 6876), ('Nov-24', 1629), ('Dec-24', 1640), ('Jan-25', 1903),
    ('Feb-25', 2095), ('Mar-25', 3032), ('Apr-25', 3940), ('May-25', 2982), ('Jun-25', 3420),
    ('Jul-25', 2284), ('Aug-25', 2332), ('Sep-25', 2314), ('Oct-25', 2373)
) AS readings(month, consumption)
WHERE name = 'Pumping Station 01';

-- Pumping Station 03 readings
INSERT INTO electricity_readings (meter_id, month, consumption)
SELECT id, month, consumption FROM electricity_meters, 
(VALUES 
    ('Apr-24', 31), ('May-24', 47), ('Jun-24', 25), ('Jul-24', 3), ('Aug-24', 0),
    ('Sep-24', 0), ('Oct-24', 33), ('Nov-24', 0), ('Dec-24', 179), ('Jan-25', 33),
    ('Feb-25', 137), ('Mar-25', 131), ('Apr-25', 276.6), ('May-25', 397), ('Jun-25', 278),
    ('Jul-25', 60), ('Aug-25', 63), ('Sep-25', 66.7), ('Oct-25', 66.3)
) AS readings(month, consumption)
WHERE name = 'Pumping Station 03';

-- Pumping Station 04 readings
INSERT INTO electricity_readings (meter_id, month, consumption)
SELECT id, month, consumption FROM electricity_meters, 
(VALUES 
    ('Apr-24', 830), ('May-24', 818), ('Jun-24', 720), ('Jul-24', 731), ('Aug-24', 857),
    ('Sep-24', 1176), ('Oct-24', 445), ('Nov-24', 919), ('Dec-24', 921), ('Jan-25', 245),
    ('Feb-25', 870), ('Mar-25', 646), ('Apr-25', 984.9), ('May-25', 880.6), ('Jun-25', 1049.7),
    ('Jul-25', 999.1), ('Aug-25', 975), ('Sep-25', 1014.3), ('Oct-25', 896.7)
) AS readings(month, consumption)
WHERE name = 'Pumping Station 04';

-- Pumping Station 05 readings
INSERT INTO electricity_readings (meter_id, month, consumption)
SELECT id, month, consumption FROM electricity_meters, 
(VALUES 
    ('Apr-24', 1774), ('May-24', 2216), ('Jun-24', 2011), ('Jul-24', 2059), ('Aug-24', 2229),
    ('Sep-24', 5217), ('Oct-24', 2483), ('Nov-24', 2599), ('Dec-24', 1952), ('Jan-25', 2069),
    ('Feb-25', 2521), ('Mar-25', 2601), ('Apr-25', 3317), ('May-25', 3582), ('Jun-25', 3254),
    ('Jul-25', 2354), ('Aug-25', 2702), ('Sep-25', 2737), ('Oct-25', 2642)
) AS readings(month, consumption)
WHERE name = 'Pumping Station 05';

-- Bank muscat readings
INSERT INTO electricity_readings (meter_id, month, consumption)
SELECT id, month, consumption FROM electricity_meters, 
(VALUES 
    ('Apr-24', 0), ('May-24', 0), ('Jun-24', 0), ('Jul-24', 3), ('Aug-24', 71),
    ('Sep-24', -2), ('Oct-24', 1407), ('Nov-24', 148), ('Dec-24', 72), ('Jan-25', 59),
    ('Feb-25', 98), ('Mar-25', 88), ('Apr-25', 163), ('May-25', 175), ('Jun-25', 222),
    ('Jul-25', 191), ('Aug-25', 154), ('Sep-25', 93), ('Oct-25', 67)
) AS readings(month, consumption)
WHERE name = 'Bank muscat';

-- CIF kitchen readings
INSERT INTO electricity_readings (meter_id, month, consumption)
SELECT id, month, consumption FROM electricity_meters, 
(VALUES 
    ('Apr-24', 0), ('May-24', 0), ('Jun-24', 0), ('Jul-24', 17895), ('Aug-24', 16532),
    ('Sep-24', 18955), ('Oct-24', 15071), ('Nov-24', 16742), ('Dec-24', 15554), ('Jan-25', 16788),
    ('Feb-25', 16154), ('Mar-25', 14971), ('Apr-25', 18446), ('May-25', 17185), ('Jun-25', 23503),
    ('Jul-25', 20608), ('Aug-25', 20471), ('Sep-25', 17902), ('Oct-25', 14659)
) AS readings(month, consumption)
WHERE name = 'CIF kitchen';

-- OUA Store (BTU Meter) readings
INSERT INTO electricity_readings (meter_id, month, consumption)
SELECT id, month, consumption FROM electricity_meters, 
(VALUES 
    ('Apr-24', 0), ('May-24', 0), ('Jun-24', 0), ('Jul-24', 0), ('Aug-24', 0),
    ('Sep-24', 0), ('Oct-24', 0), ('Nov-24', 0), ('Dec-24', 0), ('Jan-25', 0),
    ('Feb-25', 0), ('Mar-25', 0), ('Apr-25', 0), ('May-25', 0), ('Jun-25', 0),
    ('Jul-25', 0), ('Aug-25', 0), ('Sep-25', 0), ('Oct-25', 1242)
) AS readings(month, consumption)
WHERE name = 'OUA Store (BTU Meter)';

-- Street Light FP 01 (Z8) readings
INSERT INTO electricity_readings (meter_id, month, consumption)
SELECT id, month, consumption FROM electricity_meters, 
(VALUES 
    ('Apr-24', 2773), ('May-24', 3276), ('Jun-24', 3268), ('Jul-24', 3040), ('Aug-24', 3203),
    ('Sep-24', 3225), ('Oct-24', 3064), ('Nov-24', 3593), ('Dec-24', 3147), ('Jan-25', 787),
    ('Feb-25', 3228), ('Mar-25', 2663), ('Apr-25', 3230), ('May-25', 3089), ('Jun-25', 3804),
    ('Jul-25', 2834), ('Aug-25', 3342), ('Sep-25', 3413), ('Oct-25', 3129)
) AS readings(month, consumption)
WHERE name = 'Street Light FP 01 (Z8)';

-- Street Light FP 02 readings
INSERT INTO electricity_readings (meter_id, month, consumption)
SELECT id, month, consumption FROM electricity_meters, 
(VALUES 
    ('Apr-24', 1705), ('May-24', 2076), ('Jun-24', 1758), ('Jul-24', 1738), ('Aug-24', 1940),
    ('Sep-24', 2006), ('Oct-24', 1944), ('Nov-24', 2361), ('Dec-24', 2258), ('Jan-25', 633),
    ('Feb-25', 2298), ('Mar-25', 1812), ('Apr-25', 2153), ('May-25', 1900), ('Jun-25', 2435),
    ('Jul-25', 1838), ('Aug-25', 2146), ('Sep-25', 2172), ('Oct-25', 2317)
) AS readings(month, consumption)
WHERE name = 'Street Light FP 02';

-- Street Light FP 03 readings
INSERT INTO electricity_readings (meter_id, month, consumption)
SELECT id, month, consumption FROM electricity_meters, 
(VALUES 
    ('Apr-24', 1399), ('May-24', 1608), ('Jun-24', 1365), ('Jul-24', 1380), ('Aug-24', 1457),
    ('Sep-24', 1499), ('Oct-24', 1561), ('Nov-24', 2060), ('Dec-24', 1966), ('Jan-25', 1868),
    ('Feb-25', 1974), ('Mar-25', 1562), ('Apr-25', 1847), ('May-25', 1637), ('Jun-25', 1984),
    ('Jul-25', 1571), ('Aug-25', 1735), ('Sep-25', 1783), ('Oct-25', 1893)
) AS readings(month, consumption)
WHERE name = 'Street Light FP 03';

-- Street Light FP 04 readings
INSERT INTO electricity_readings (meter_id, month, consumption)
SELECT id, month, consumption FROM electricity_meters, 
(VALUES 
    ('Apr-24', 861), ('May-24', 1045), ('Jun-24', 1051), ('Jul-24', 2268), ('Aug-24', 2478),
    ('Sep-24', 2513), ('Oct-24', 2341), ('Nov-24', 2299), ('Dec-24', 1389), ('Jan-25', 325),
    ('Feb-25', 1406), ('Mar-25', 1401), ('Apr-25', 2412.9), ('May-25', 3047.1), ('Jun-25', 4099),
    ('Jul-25', 3072), ('Aug-25', 3180), ('Sep-25', 2847), ('Oct-25', 2420)
) AS readings(month, consumption)
WHERE name = 'Street Light FP 04';

-- Street Light FP 05 readings
INSERT INTO electricity_readings (meter_id, month, consumption)
SELECT id, month, consumption FROM electricity_meters, 
(VALUES 
    ('Apr-24', 532), ('May-24', 587), ('Jun-24', 575), ('Jul-24', 770), ('Aug-24', 1341),
    ('Sep-24', 1895), ('Oct-24', 1844), ('Nov-24', 1477), ('Dec-24', 1121), ('Jan-25', 449),
    ('Feb-25', 2070), ('Mar-25', 1870), ('Apr-25', 3233), ('May-25', 4796), ('Jun-25', 5406),
    ('Jul-25', 3769), ('Aug-25', 3953), ('Sep-25', 3402), ('Oct-25', 2790)
) AS readings(month, consumption)
WHERE name = 'Street Light FP 05';

-- ================================================
-- VERIFICATION QUERIES
-- ================================================

-- Check meter count
SELECT COUNT(*) as meter_count FROM electricity_meters;

-- Check readings count
SELECT COUNT(*) as reading_count FROM electricity_readings;

-- Check sample data
SELECT m.name, m.meter_type, m.account_number, COUNT(r.id) as readings_count
FROM electricity_meters m
LEFT JOIN electricity_readings r ON m.id = r.meter_id
GROUP BY m.id, m.name, m.meter_type, m.account_number
ORDER BY m.name
LIMIT 10;
