// Water System Data - Muscat Bay
// Complete meter database with consumption data

export interface WaterMeter {
  label: string;
  accountNumber: string;
  level: 'L1' | 'L2' | 'L3' | 'L4' | 'DC' | 'N/A';
  zone: string;
  parentMeter: string;
  type: string;
  consumption: Record<string, number | null>;
}

export interface ZoneConfig {
  code: string;
  name: string;
  bulkMeterAccount: string;
  hasBuildings: boolean;
}

export interface WaterAnalysis {
  A1: number;
  A2: number;
  A3Bulk: number;
  A3Individual: number;
  stage1Loss: number;
  stage2Loss: number;
  stage3Loss: number;
  totalLoss: number;
  efficiency: number;
  lossPercentage: number;
}

export interface ZoneAnalysis {
  zone: string;
  zoneName: string;
  bulkMeterReading: number;
  individualTotal: number;
  loss: number;
  lossPercentage: number;
  efficiency: number;
  meterCount: number;
}

export interface BuildingAnalysis {
  building: string;
  zone: string;
  bulkMeterReading: number;
  apartmentTotal: number;
  loss: number;
  lossPercentage: number;
  apartmentCount: number;
}

export const ZONE_CONFIG: ZoneConfig[] = [
  { code: 'Zone_01_(FM)', name: 'Zone FM', bulkMeterAccount: '4300346', hasBuildings: true },
  { code: 'Zone_03_(A)', name: 'Zone 3A', bulkMeterAccount: '4300343', hasBuildings: true },
  { code: 'Zone_03_(B)', name: 'Zone 3B', bulkMeterAccount: '4300344', hasBuildings: true },
  { code: 'Zone_05', name: 'Zone 5', bulkMeterAccount: '4300345', hasBuildings: false },
  { code: 'Zone_08', name: 'Zone 8', bulkMeterAccount: '4300342', hasBuildings: false },
  { code: 'Zone_VS', name: 'Village Square', bulkMeterAccount: '4300335', hasBuildings: false },
  { code: 'Zone_SC', name: 'Sales Center', bulkMeterAccount: '4300295', hasBuildings: false },
];

export const AVAILABLE_MONTHS = ['Jan-25', 'Feb-25', 'Mar-25', 'Apr-25', 'May-25', 'Jun-25', 'Jul-25', 'Aug-25', 'Sep-25', 'Oct-25', 'Nov-25'];

export const TYPE_CATEGORIES: Record<string, string[]> = {
  Commercial: ['Retail', 'Building'],
  Residential: ['Residential (Villa)', 'Residential (Apart)', 'D_Building_Bulk', 'D_Building_Common'],
  Irrigation: ['IRR_Servies'],
  Common: ['MB_Common', 'Zone Bulk', 'Main BULK']
};

const c = (vals: (number | null)[]): Record<string, number | null> => {
  const result: Record<string, number | null> = {};
  AVAILABLE_MONTHS.forEach((m, i) => { result[m] = vals[i] ?? null; });
  return result;
};

export const WATER_METERS: WaterMeter[] = [
  // L1 - Main Source
  { label: 'Main Bulk (NAMA)', accountNumber: 'C43659', level: 'L1', zone: 'Main Bulk', parentMeter: 'NAMA', type: 'Main BULK', consumption: c([32580, 44043, 34915, 46039, 58425, 41840, 41475, 41743, 42088, 46049, 47347]) },
  
  // L2 - Zone Bulks
  { label: 'ZONE 8 (Bulk Zone 8)', accountNumber: '4300342', level: 'L2', zone: 'Zone_08', parentMeter: 'Main Bulk (NAMA)', type: 'Zone Bulk', consumption: c([1547, 1498, 2605, 3203, 2937, 3142, 3542, 3840, 3385, 14550, null]) },
  { label: 'ZONE 3A (Bulk Zone 3A)', accountNumber: '4300343', level: 'L2', zone: 'Zone_03_(A)', parentMeter: 'Main Bulk (NAMA)', type: 'Zone Bulk', consumption: c([4235, 4273, 3591, 4041, 4898, 6484, 6440, 6212, 6075, 7219, 5208]) },
  { label: 'ZONE 3B (Bulk Zone 3B)', accountNumber: '4300344', level: 'L2', zone: 'Zone_03_(B)', parentMeter: 'Main Bulk (NAMA)', type: 'Zone Bulk', consumption: c([3256, 2962, 3331, 2157, 3093, 3231, 3243, 2886, 3466, 5467, 11824]) },
  { label: 'ZONE 5 (Bulk Zone 5)', accountNumber: '4300345', level: 'L2', zone: 'Zone_05', parentMeter: 'Main Bulk (NAMA)', type: 'Zone Bulk', consumption: c([4267, 4231, 3862, 3737, 3849, 4116, 3497, 3968, 3823, 4218, 4433]) },
  { label: 'ZONE FM ( BULK ZONE FM )', accountNumber: '4300346', level: 'L2', zone: 'Zone_01_(FM)', parentMeter: 'Main Bulk (NAMA)', type: 'Zone Bulk', consumption: c([2008, 1740, 1880, 1880, 1693, 1659, 1974, 2305, 1966, 2002, 2059]) },
  { label: 'Village Square (Zone Bulk)', accountNumber: '4300335', level: 'L2', zone: 'Zone_VS', parentMeter: 'Main Bulk (NAMA)', type: 'Zone Bulk', consumption: c([14, 12, 21, 13, 21, 19, 60, 77, 75, 122, 126]) },
  { label: 'Sales Center Common Building', accountNumber: '4300295', level: 'L2', zone: 'Zone_SC', parentMeter: 'Main Bulk (NAMA)', type: 'Zone Bulk', consumption: c([76, 68, 37, 67, 63, 55, 60, 61, 82, 78, 78]) },
  
  // DC - Direct Connections
  { label: 'Hotel Main Building', accountNumber: '4300334', level: 'DC', zone: 'Direct Connection', parentMeter: 'Main Bulk (NAMA)', type: 'Retail', consumption: c([18048, 19482, 22151, 27676, 26963, 17379, 14713, 16249, 16249, 18876, 18876]) },
  { label: 'Al Adrak Camp', accountNumber: '4300348', level: 'DC', zone: 'Direct Connection', parentMeter: 'Main Bulk (NAMA)', type: 'Retail', consumption: c([1038, 702, 1161, 1000, 1228, 1015, 972, 924, 769, 879, 875]) },
  { label: 'Al Adrak Company', accountNumber: '4300349', level: 'DC', zone: 'Direct Connection', parentMeter: 'Main Bulk (NAMA)', type: 'Retail', consumption: c([0, 0, 0, 0, 0, 1758, 1802, 1511, 1776, 1687, 1448]) },
  { label: 'Community Mgmt - Technical Zone, STP', accountNumber: '4300336', level: 'DC', zone: 'Direct Connection', parentMeter: 'Main Bulk (NAMA)', type: 'MB_Common', consumption: c([29, 37, 25, 35, 29, 53, 50, 56, 50, 62, 42]) },
  { label: 'Building (Security)', accountNumber: '4300297', level: 'DC', zone: 'Direct Connection', parentMeter: 'Main Bulk (NAMA)', type: 'MB_Common', consumption: c([17, 18, 13, 16, 16, 13, 19, 16, 16, 20, 25]) },
  { label: 'Building (ROP)', accountNumber: '4300299', level: 'DC', zone: 'Direct Connection', parentMeter: 'Main Bulk (NAMA)', type: 'MB_Common', consumption: c([23, 21, 19, 20, 20, 17, 22, 20, 20, 23, 31]) },
  { label: 'PHASE 02, MAIN ENTRANCE', accountNumber: '4300338', level: 'DC', zone: 'Direct Connection', parentMeter: 'Main Bulk (NAMA)', type: 'MB_Common', consumption: c([11, 8, 6, 7, 6, 6, 7, 8, 7, 12, 10]) },
  { label: 'Irrigation Tank 01 (Inlet)', accountNumber: '4300323', level: 'DC', zone: 'Direct Connection', parentMeter: 'Main Bulk (NAMA)', type: 'IRR_Servies', consumption: c([0, 0, 0, 0, 2, 0, 1, 0, 0, 0, 0]) },
  { label: 'Irrigation- Controller UP', accountNumber: '4300340', level: 'DC', zone: 'Direct Connection', parentMeter: 'Main Bulk (NAMA)', type: 'IRR_Servies', consumption: c([0, 0, 0, 1000, 313, 491, 554, 272, 266, 181, 328]) },
  { label: 'Irrigation- Controller DOWN', accountNumber: '4300341', level: 'DC', zone: 'Direct Connection', parentMeter: 'Main Bulk (NAMA)', type: 'IRR_Servies', consumption: c([159, 239, 283, 411, 910, 511, 611, 394, 0, 0, 0]) },
  
  // L3 - Zone FM
  { label: 'Building FM', accountNumber: '4300296', level: 'L3', zone: 'Zone_01_(FM)', parentMeter: 'ZONE FM ( BULK ZONE FM )', type: 'MB_Common', consumption: c([37, 39, 49, 40, 41, 32, 44, 40, 34, 39, 44]) },
  { label: 'Building B1', accountNumber: '4300300', level: 'L3', zone: 'Zone_01_(FM)', parentMeter: 'ZONE FM ( BULK ZONE FM )', type: 'Retail', consumption: c([228, 225, 235, 253, 233, 144, 229, 298, 256, 265, 250]) },
  { label: 'Building B2', accountNumber: '4300301', level: 'L3', zone: 'Zone_01_(FM)', parentMeter: 'ZONE FM ( BULK ZONE FM )', type: 'Retail', consumption: c([236, 213, 202, 187, 199, 171, 191, 240, 212, 248, 256]) },
  { label: 'Building B3', accountNumber: '4300302', level: 'L3', zone: 'Zone_01_(FM)', parentMeter: 'ZONE FM ( BULK ZONE FM )', type: 'Retail', consumption: c([169, 165, 132, 134, 160, 151, 170, 149, 156, 210, 257]) },
  { label: 'Building B4', accountNumber: '4300303', level: 'L3', zone: 'Zone_01_(FM)', parentMeter: 'ZONE FM ( BULK ZONE FM )', type: 'Retail', consumption: c([108, 108, 148, 148, 121, 149, 159, 179, 201, 175, 169]) },
  { label: 'Building B5', accountNumber: '4300304', level: 'L3', zone: 'Zone_01_(FM)', parentMeter: 'ZONE FM ( BULK ZONE FM )', type: 'Retail', consumption: c([1, 2, 1, 1, 0, 179, 62, 54, 39, 42, 37]) },
  { label: 'Building B6', accountNumber: '4300305', level: 'L3', zone: 'Zone_01_(FM)', parentMeter: 'ZONE FM ( BULK ZONE FM )', type: 'Retail', consumption: c([254, 228, 268, 281, 214, 194, 196, 210, 210, 229, 231]) },
  { label: 'Building B7', accountNumber: '4300306', level: 'L3', zone: 'Zone_01_(FM)', parentMeter: 'ZONE FM ( BULK ZONE FM )', type: 'Retail', consumption: c([178, 190, 174, 201, 200, 154, 192, 155, 158, 200, 201]) },
  { label: 'Building B8', accountNumber: '4300307', level: 'L3', zone: 'Zone_01_(FM)', parentMeter: 'ZONE FM ( BULK ZONE FM )', type: 'Retail', consumption: c([268, 250, 233, 0, 413, 213, 62, 84, 371, 579, 281]) },
  { label: 'Building CIF/CB', accountNumber: '4300324', level: 'L3', zone: 'Zone_01_(FM)', parentMeter: 'ZONE FM ( BULK ZONE FM )', type: 'Retail', consumption: c([420, 331, 306, 307, 284, 241, 443, 731, 484, 274, 270]) },
  
  // L3 - Zone 3A Villas (sample)
  { label: 'Z3-31 (Villa)', accountNumber: '4300052', level: 'L3', zone: 'Zone_03_(A)', parentMeter: 'ZONE 3A (BULK ZONE 3A)', type: 'Residential (Villa)', consumption: c([165, 133, 30, 306, 527, 240, 109, 235, 205, 242, 233]) },
  { label: 'Z3-35 (Villa)', accountNumber: '4300075', level: 'L3', zone: 'Zone_03_(A)', parentMeter: 'ZONE 3A (BULK ZONE 3A)', type: 'Residential (Villa)', consumption: c([65, 61, 52, 74, 68, 86, 70, 65, 65, 79, 74]) },
  { label: 'Z3-36 (Villa)', accountNumber: '4300084', level: 'L3', zone: 'Zone_03_(A)', parentMeter: 'ZONE 3A (BULK ZONE 3A)', type: 'Residential (Villa)', consumption: c([81, 83, 69, 83, 170, 166, 157, 115, 103, 89, 87]) },
  { label: 'Z3-42 (Villa)', accountNumber: '4300002', level: 'L3', zone: 'Zone_03_(A)', parentMeter: 'ZONE 3A (BULK ZONE 3A)', type: 'Residential (Villa)', consumption: c([32, 46, 19, 62, 87, 59, 53, 65, 44, 25, 24]) },
  
  // L3 - Zone 3A Building Bulks
  { label: 'D-44 Building Bulk Meter', accountNumber: '4300178', level: 'L3', zone: 'Zone_03_(A)', parentMeter: 'ZONE 3A (BULK ZONE 3A)', type: 'D_Building_Bulk', consumption: c([180, 198, 92, 87, 62, 49, 52, 59, 60, 68, 66]) },
  { label: 'D-45 Building Bulk Meter', accountNumber: '4300179', level: 'L3', zone: 'Zone_03_(A)', parentMeter: 'ZONE 3A (BULK ZONE 3A)', type: 'D_Building_Bulk', consumption: c([20, 32, 44, 56, 55, 10, 12, 11, 35, 29, 39]) },
  { label: 'D-46 Building Bulk Meter', accountNumber: '4300180', level: 'L3', zone: 'Zone_03_(A)', parentMeter: 'ZONE 3A (BULK ZONE 3A)', type: 'D_Building_Bulk', consumption: c([61, 46, 29, 68, 69, 55, 65, 85, 114, 134, 68]) },
  { label: 'D-47 Building Bulk Meter', accountNumber: '4300181', level: 'L3', zone: 'Zone_03_(A)', parentMeter: 'ZONE 3A (BULK ZONE 3A)', type: 'D_Building_Bulk', consumption: c([103, 70, 55, 69, 57, 83, 121, 62, 72, 96, 83]) },
  { label: 'D-51 Building Bulk Meter', accountNumber: '4300185', level: 'L3', zone: 'Zone_03_(A)', parentMeter: 'ZONE 3A (BULK ZONE 3A)', type: 'D_Building_Bulk', consumption: c([92, 108, 152, 166, 111, 100, 149, 154, 164, 202, 107]) },
  { label: 'D-74 Building Bulk Meter', accountNumber: '4300177', level: 'L3', zone: 'Zone_03_(A)', parentMeter: 'ZONE 3A (BULK ZONE 3A)', type: 'D_Building_Bulk', consumption: c([41, 35, 36, 54, 51, 62, 101, 106, 128, 116, 66]) },
  { label: 'D-75 Building Bulk Meter', accountNumber: '4300176', level: 'L3', zone: 'Zone_03_(A)', parentMeter: 'ZONE 3A (BULK ZONE 3A)', type: 'D_Building_Bulk', consumption: c([63, 60, 66, 71, 59, 62, 67, 101, 66, 65, 64]) },
  
  // L4 - D-44 Apartments
  { label: 'Z3-44(1A)', accountNumber: '4300030', level: 'L4', zone: 'Zone_03_(A)', parentMeter: 'D-44 Building Bulk Meter', type: 'Residential (Apart)', consumption: c([11, 11, 10, 6, 11, 8, 2, 7, 9, 9, 11]) },
  { label: 'Z3-44(2A)', accountNumber: '4300032', level: 'L4', zone: 'Zone_03_(A)', parentMeter: 'D-44 Building Bulk Meter', type: 'Residential (Apart)', consumption: c([9, 3, 5, 10, 7, 2, 3, 5, 6, 7, 3]) },
  { label: 'Z3-44(5)', accountNumber: '4300034', level: 'L4', zone: 'Zone_03_(A)', parentMeter: 'D-44 Building Bulk Meter', type: 'Residential (Apart)', consumption: c([118, 139, 38, 25, 6, 6, 9, 8, 7, 4, 1]) },
  { label: 'Z3-44(6)', accountNumber: '4300035', level: 'L4', zone: 'Zone_03_(A)', parentMeter: 'D-44 Building Bulk Meter', type: 'Residential (Apart)', consumption: c([34, 37, 31, 37, 35, 32, 37, 38, 37, 40, 44]) },
  { label: 'D 44-Building Common', accountNumber: '4300144', level: 'L4', zone: 'Zone_03_(A)', parentMeter: 'D-44 Building Bulk Meter', type: 'D_Building_Common', consumption: c([1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1]) },
  
  // L3 - Zone 3B Villas
  { label: 'Z3-3 (Villa)', accountNumber: '4300088', level: 'L3', zone: 'Zone_03_(B)', parentMeter: 'ZONE 3B (BULK ZONE 3B)', type: 'Residential (Villa)', consumption: c([66, 59, 63, 73, 176, 192, 136, 118, 106, 119, 96]) },
  { label: 'Z3-8 (Villa)', accountNumber: '4300105', level: 'L3', zone: 'Zone_03_(B)', parentMeter: 'ZONE 3B (BULK ZONE 3B)', type: 'Residential (Villa)', consumption: c([83, 106, 196, 358, 414, 346, 132, 54, 48, 53, 54]) },
  { label: 'Z3-12 (Villa)', accountNumber: '4300076', level: 'L3', zone: 'Zone_03_(B)', parentMeter: 'ZONE 3B (BULK ZONE 3B)', type: 'Residential (Villa)', consumption: c([73, 59, 54, 181, 178, 249, 188, 179, 161, 77, 114]) },
  
  // L3 - Zone 3B Building Bulks
  { label: 'D-52 Building Bulk Meter', accountNumber: '4300186', level: 'L3', zone: 'Zone_03_(B)', parentMeter: 'ZONE 3B (BULK ZONE 3B)', type: 'D_Building_Bulk', consumption: c([40, 35, 25, 37, 48, 46, 52, 47, 26, 104, 41]) },
  { label: 'D-53 Building Bulk Meter', accountNumber: '4300311', level: 'L3', zone: 'Zone_03_(B)', parentMeter: 'ZONE 3B (BULK ZONE 3B)', type: 'D_Building_Bulk', consumption: c([18, 27, 26, 39, 21, 27, 26, 30, 45, 94, 106]) },
  { label: 'D-54 Building Bulk Meter', accountNumber: '4300312', level: 'L3', zone: 'Zone_03_(B)', parentMeter: 'ZONE 3B (BULK ZONE 3B)', type: 'D_Building_Bulk', consumption: c([63, 52, 66, 95, 51, 55, 76, 55, 50, 45, 67]) },
  
  // L3 - Zone 5 Villas
  { label: 'Z5-3', accountNumber: '4300170', level: 'L3', zone: 'Zone_05', parentMeter: 'ZONE 5 (Bulk Zone 5)', type: 'Residential (Villa)', consumption: c([149, 86, 67, 100, 70, 82, 95, 100, 135, 120, 114]) },
  { label: 'Z5-13', accountNumber: '4300058', level: 'L3', zone: 'Zone_05', parentMeter: 'ZONE 5 (Bulk Zone 5)', type: 'Residential (Villa)', consumption: c([72, 106, 89, 120, 109, 115, 155, 146, 123, 168, 67]) },
  { label: 'Z5-17', accountNumber: '4300001', level: 'L3', zone: 'Zone_05', parentMeter: 'ZONE 5 (Bulk Zone 5)', type: 'Residential (Villa)', consumption: c([112, 80, 81, 90, 58, 72, 88, 74, 103, 84, 83]) },
  { label: 'Z5-22', accountNumber: '4300163', level: 'L3', zone: 'Zone_05', parentMeter: 'ZONE 5 (Bulk Zone 5)', type: 'Residential (Villa)', consumption: c([15, 40, 186, 243, 201, 186, 192, 175, 80, 108, 78]) },
  { label: 'Z5-30', accountNumber: '4300147', level: 'L3', zone: 'Zone_05', parentMeter: 'ZONE 5 (Bulk Zone 5)', type: 'Residential (Villa)', consumption: c([65, 87, 71, 113, 203, 238, 212, 155, 76, 73, 110]) },
  
  // L3 - Zone 8 Villas
  { label: 'Z8-5', accountNumber: '4300287', level: 'L3', zone: 'Zone_08', parentMeter: 'BULK ZONE 8', type: 'Residential (Villa)', consumption: c([208, 341, 313, 336, 325, 236, 224, 98, 326, 203, 155]) },
  { label: 'Z8-12', accountNumber: '4300196', level: 'L3', zone: 'Zone_08', parentMeter: 'BULK ZONE 8', type: 'Residential (Villa)', consumption: c([236, 192, 249, 267, 295, 386, 466, 550, 302, 233, 199]) },
  { label: 'Z8-15', accountNumber: '4300198', level: 'L3', zone: 'Zone_08', parentMeter: 'BULK ZONE 8', type: 'Residential (Villa)', consumption: c([99, 61, 70, 125, 112, 121, 123, 126, 106, 107, 129]) },
  { label: 'Z8-17', accountNumber: '4300200', level: 'L3', zone: 'Zone_08', parentMeter: 'BULK ZONE 8', type: 'Residential (Villa)', consumption: c([164, 162, 171, 207, 238, 211, 192, 200, 177, 206, 200]) },
  
  // L3 - Village Square & Sales Center
  { label: 'Coffee 2 (GF Shop No.594 A)', accountNumber: '4300329', level: 'L3', zone: 'Zone_VS', parentMeter: 'Village Square (Zone Bulk)', type: 'Retail', consumption: c([2, 3, 5, 5, 5, 4, 9, 5, 15, 10, 11]) },
  { label: 'Laundry Services', accountNumber: '4300332', level: 'L3', zone: 'Zone_VS', parentMeter: 'Village Square (Zone Bulk)', type: 'Retail', consumption: c([33, 25, 22, 0, 44, 28, 44, 42, 42, 49, 61]) },
  { label: 'Sale Centre Caffe & Bar', accountNumber: '4300328', level: 'L3', zone: 'Zone_SC', parentMeter: 'Sale Centre (Zone Bulk)', type: 'Retail', consumption: c([0, 2, 3, 5, 12, 5, 20, 33, 27, 43, 40]) },
];

// Calculation Functions
export function getConsumption(meter: WaterMeter, month: string): number {
  const val = meter.consumption[month];
  return val !== null && val !== undefined && val >= 0 ? val : 0;
}

export function getMetersByLevel(level: string): WaterMeter[] {
  return WATER_METERS.filter(m => m.level === level);
}

export function getMetersByZone(zone: string): WaterMeter[] {
  return WATER_METERS.filter(m => m.zone === zone);
}

export function getMetersByParent(parentMeter: string): WaterMeter[] {
  return WATER_METERS.filter(m => m.parentMeter === parentMeter);
}

export function getMetersByType(type: string): WaterMeter[] {
  return WATER_METERS.filter(m => m.type === type);
}

export function getMeterByAccount(accountNumber: string): WaterMeter | undefined {
  return WATER_METERS.find(m => m.accountNumber === accountNumber);
}

export function calculateMonthlyAnalysis(month: string): WaterAnalysis {
  const l1Meters = getMetersByLevel('L1');
  const l2Meters = getMetersByLevel('L2');
  const l3Meters = getMetersByLevel('L3');
  const l4Meters = getMetersByLevel('L4');
  const dcMeters = getMetersByLevel('DC');
  
  const A1 = l1Meters.reduce((sum, m) => sum + getConsumption(m, month), 0);
  const A2 = l2Meters.reduce((sum, m) => sum + getConsumption(m, month), 0) +
             dcMeters.reduce((sum, m) => sum + getConsumption(m, month), 0);
  const A3Bulk = l3Meters.reduce((sum, m) => sum + getConsumption(m, month), 0) +
                 dcMeters.reduce((sum, m) => sum + getConsumption(m, month), 0);
  const l3NonBuildings = l3Meters.filter(m => !m.type.includes('Building_Bulk'));
  const A3Individual = l3NonBuildings.reduce((sum, m) => sum + getConsumption(m, month), 0) +
                       l4Meters.reduce((sum, m) => sum + getConsumption(m, month), 0) +
                       dcMeters.reduce((sum, m) => sum + getConsumption(m, month), 0);
  
  const stage1Loss = A1 - A2;
  const stage2Loss = A2 - A3Individual;
  const stage3Loss = A3Bulk - A3Individual;
  const totalLoss = A1 - A3Individual;
  const efficiency = A1 > 0 ? (A3Individual / A1) * 100 : 0;
  const lossPercentage = A1 > 0 ? (totalLoss / A1) * 100 : 0;
  
  return {
    A1, A2, A3Bulk, A3Individual, stage1Loss, stage2Loss, stage3Loss, totalLoss,
    efficiency: Math.round(efficiency * 10) / 10,
    lossPercentage: Math.round(lossPercentage * 10) / 10
  };
}

export function calculateRangeAnalysis(startMonth: string, endMonth: string): WaterAnalysis {
  const startIdx = AVAILABLE_MONTHS.indexOf(startMonth);
  const endIdx = AVAILABLE_MONTHS.indexOf(endMonth);
  if (startIdx === -1 || endIdx === -1 || startIdx > endIdx) return calculateMonthlyAnalysis(startMonth);
  
  const months = AVAILABLE_MONTHS.slice(startIdx, endIdx + 1);
  const analyses = months.map(m => calculateMonthlyAnalysis(m));
  
  const totals: WaterAnalysis = {
    A1: analyses.reduce((sum, a) => sum + a.A1, 0),
    A2: analyses.reduce((sum, a) => sum + a.A2, 0),
    A3Bulk: analyses.reduce((sum, a) => sum + a.A3Bulk, 0),
    A3Individual: analyses.reduce((sum, a) => sum + a.A3Individual, 0),
    stage1Loss: analyses.reduce((sum, a) => sum + a.stage1Loss, 0),
    stage2Loss: analyses.reduce((sum, a) => sum + a.stage2Loss, 0),
    stage3Loss: analyses.reduce((sum, a) => sum + a.stage3Loss, 0),
    totalLoss: 0, efficiency: 0, lossPercentage: 0
  };
  
  totals.totalLoss = totals.A1 - totals.A3Individual;
  totals.efficiency = totals.A1 > 0 ? Math.round((totals.A3Individual / totals.A1) * 1000) / 10 : 0;
  totals.lossPercentage = totals.A1 > 0 ? Math.round((totals.totalLoss / totals.A1) * 1000) / 10 : 0;
  
  return totals;
}

export function calculateZoneAnalysis(zone: string, month: string): ZoneAnalysis {
  const config = ZONE_CONFIG.find(z => z.code === zone);
  if (!config) return { zone, zoneName: zone, bulkMeterReading: 0, individualTotal: 0, loss: 0, lossPercentage: 0, efficiency: 0, meterCount: 0 };
  
  const bulkMeter = getMeterByAccount(config.bulkMeterAccount);
  const bulkMeterReading = bulkMeter ? getConsumption(bulkMeter, month) : 0;
  const zoneMeters = getMetersByZone(zone).filter(m => m.level === 'L3' || m.level === 'L4');
  const l3Meters = zoneMeters.filter(m => m.level === 'L3' && !m.type.includes('Building_Bulk'));
  const l4Meters = zoneMeters.filter(m => m.level === 'L4');
  const individualTotal = l3Meters.reduce((sum, m) => sum + getConsumption(m, month), 0) +
                          l4Meters.reduce((sum, m) => sum + getConsumption(m, month), 0);
  
  const loss = bulkMeterReading - individualTotal;
  const lossPercentage = bulkMeterReading > 0 ? (loss / bulkMeterReading) * 100 : 0;
  const efficiency = bulkMeterReading > 0 ? (individualTotal / bulkMeterReading) * 100 : 0;
  
  return {
    zone, zoneName: config.name, bulkMeterReading, individualTotal, loss,
    lossPercentage: Math.round(lossPercentage * 10) / 10,
    efficiency: Math.round(efficiency * 10) / 10,
    meterCount: zoneMeters.length
  };
}

export function calculateBuildingAnalysis(buildingBulkAccount: string, month: string): BuildingAnalysis {
  const bulkMeter = getMeterByAccount(buildingBulkAccount);
  if (!bulkMeter) return { building: '', zone: '', bulkMeterReading: 0, apartmentTotal: 0, loss: 0, lossPercentage: 0, apartmentCount: 0 };
  
  const bulkMeterReading = getConsumption(bulkMeter, month);
  const apartments = getMetersByParent(bulkMeter.label);
  const apartmentTotal = apartments.reduce((sum, m) => sum + getConsumption(m, month), 0);
  const loss = bulkMeterReading - apartmentTotal;
  const lossPercentage = bulkMeterReading > 0 ? (loss / bulkMeterReading) * 100 : 0;
  
  return {
    building: bulkMeter.label, zone: bulkMeter.zone, bulkMeterReading, apartmentTotal, loss,
    lossPercentage: Math.round(lossPercentage * 10) / 10,
    apartmentCount: apartments.length
  };
}

export function getConsumptionByType(month: string): { type: string; total: number; percentage: number; color: string }[] {
  const typeColors: Record<string, string> = {
    Commercial: '#3B82F6', Residential: '#10B981', Irrigation: '#F59E0B', Common: '#8B5CF6'
  };
  
  const results: { type: string; total: number; percentage: number; color: string }[] = [];
  let grandTotal = 0;
  
  for (const [category, types] of Object.entries(TYPE_CATEGORIES)) {
    const meters = WATER_METERS.filter(m => types.includes(m.type));
    const total = meters.reduce((sum, m) => sum + getConsumption(m, month), 0);
    grandTotal += total;
    results.push({ type: category, total, percentage: 0, color: typeColors[category] || '#6B7280' });
  }
  
  results.forEach(r => { r.percentage = grandTotal > 0 ? Math.round((r.total / grandTotal) * 1000) / 10 : 0; });
  return results;
}

export function getMonthlyTrends(startMonth: string, endMonth: string) {
  const startIdx = AVAILABLE_MONTHS.indexOf(startMonth);
  const endIdx = AVAILABLE_MONTHS.indexOf(endMonth);
  if (startIdx === -1 || endIdx === -1) return [];
  
  const months = AVAILABLE_MONTHS.slice(startIdx, endIdx + 1);
  return months.map(month => {
    const analysis = calculateMonthlyAnalysis(month);
    return { month, ...analysis };
  });
}

export function getAllZonesAnalysis(month: string): ZoneAnalysis[] {
  return ZONE_CONFIG.map(config => calculateZoneAnalysis(config.code, month));
}

export function getAllBuildingsAnalysis(month: string): BuildingAnalysis[] {
  const buildingBulks = WATER_METERS.filter(m => m.type === 'D_Building_Bulk');
  return buildingBulks.map(b => calculateBuildingAnalysis(b.accountNumber, month));
}

export function getPerformanceRating(lossPercentage: number): { status: string; color: string; emoji: string } {
  if (lossPercentage < 10) return { status: 'Excellent', color: '#10B981', emoji: '🟢' };
  if (lossPercentage < 20) return { status: 'Good', color: '#3B82F6', emoji: '🟡' };
  if (lossPercentage < 30) return { status: 'Average', color: '#F59E0B', emoji: '🟠' };
  return { status: 'Poor', color: '#EF4444', emoji: '🔴' };
}

export function formatNumber(num: number): string {
  return num.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

export function getMeterCountsByLevel(): { level: string; count: number }[] {
  return ['L1', 'L2', 'L3', 'L4', 'DC'].map(level => ({ level, count: getMetersByLevel(level).length }));
}
