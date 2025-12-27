
import { addDays, format } from "date-fns";

// --- Types ---

export interface WaterTrend {
    month: string;
    A1: number;
    A2: number;
    A3Ind: number;
    A3Bulk: number;
    stage1Vol: number;
    stage2Vol: number;
    totalLossVol: number;
    loss1: number;
    loss2: number;
    efficiency: number;
}

export interface ZonePerformance {
    zone: string;
    average: number;
    status: "Active" | "Low" | "Critical";
    [key: string]: string | number; // For dynamic month keys like 'Jul25'
}

export interface ConsumptionType {
    type: string;
    total: number;
    percentage: number;
    color: string;
}

export interface WaterSystemData {
    monthlyTrends: WaterTrend[];
    zonePerformance: ZonePerformance[];
    consumptionByType: ConsumptionType[];
}

export interface MeterReading {
    id: string;
    name: string;
    account_number: string;
    type: string;
    readings: Record<string, number>; // Key is "YYYY-MM" or "Mon-YY", we'll normalize
}

export interface STPOperation {
    id: string;
    date: string;
    inlet_sewage: number;
    tse_for_irrigation: number;
    tanker_trips: number;
    generated_income?: number;
    water_savings?: number;
    total_impact?: number;
}

export interface Contractor {
    id: string;
    name: string;
    company: string;
    status: "Active" | "Expired" | "On-Hold";
    expiryDate: string;
    category: string;
}

export interface FireSafetyEquipment {
    id: string;
    name: string;
    location: string;
    status: "Operational" | "Needs Attention" | "Expired" | "Maintenance Due";
    priority: "Critical" | "High" | "Medium" | "Low";
    battery: number | null;
    signal: number | null;
    next_maintenance: string;
    inspector: string;
    type: string;
    zone: string;
}

export interface FireQuotation {
    id: string;
    quote_code: string;
    date: string;
    provider: string;
    status: "draft" | "pending_approval" | "approved" | "rejected";
    subtotal_omr: number;
    vat_omr: number;
    total_omr: number;
}

export interface FireQuotationItem {
    id: string;
    quote_code: string;
    location: string;
    description: string;
    category: string;
    priority: "high" | "medium" | "low";
    cost_omr: number;
}

export interface Asset {
    id: string;
    name: string;
    type: string;
    location: string;
    status: "Active" | "Under Maintenance" | "Decommissioned" | "In Storage";
    purchaseDate: string;
    value: number;
    serialNumber: string;
    lastService: string;
}

// --- Mock Data ---

// Water Data (extracted from reference)
export const WATER_SYSTEM_DATA: WaterSystemData = {
    monthlyTrends: [
        { month: "Jan-25", A1: 32580, A2: 34677, A3Ind: 27225, A3Bulk: 27076, stage1Vol: -2097, stage2Vol: 7452, totalLossVol: 5355, loss1: -6.4, loss2: 21.5, efficiency: 83.6 },
        { month: "Feb-25", A1: 44043, A2: 35246, A3Ind: 27781, A3Bulk: 27637, stage1Vol: 8797, stage2Vol: 7465, totalLossVol: 16262, loss1: 20.0, loss2: 21.2, efficiency: 63.1 },
        { month: "Mar-25", A1: 34915, A2: 38982, A3Ind: 31647, A3Bulk: 32413, stage1Vol: -4067, stage2Vol: 7335, totalLossVol: 3268, loss1: -11.6, loss2: 18.8, efficiency: 90.6 },
        { month: "Apr-25", A1: 46039, A2: 45237, A3Ind: 38285, A3Bulk: 38191, stage1Vol: 802, stage2Vol: 6952, totalLossVol: 7754, loss1: 1.7, loss2: 15.4, efficiency: 83.2 },
        { month: "May-25", A1: 58425, A2: 46354, A3Ind: 41852, A3Bulk: 41932, stage1Vol: 12071, stage2Vol: 4502, totalLossVol: 16573, loss1: 20.7, loss2: 9.7, efficiency: 71.6 },
        { month: "Jun-25", A1: 41840, A2: 40010, A3Ind: 28713, A3Bulk: 28763, stage1Vol: 1830, stage2Vol: 11297, totalLossVol: 13127, loss1: 4.4, loss2: 28.2, efficiency: 68.6 },
        { month: "Jul-25", A1: 41475, A2: 37154, A3Ind: 31235, A3Bulk: 27503, stage1Vol: 4321, stage2Vol: 5919, totalLossVol: 10240, loss1: 10.4, loss2: 15.9, efficiency: 75.3 },
        { month: "Aug-25", A1: 41743, A2: 38843, A3Ind: 31654, A3Bulk: 28123, stage1Vol: 2900, stage2Vol: 7189, totalLossVol: 10089, loss1: 6.9, loss2: 18.5, efficiency: 75.8 },
        { month: "Sep-25", A1: 42088, A2: 39421, A3Ind: 32156, A3Bulk: 31987, stage1Vol: 2667, stage2Vol: 7265, totalLossVol: 9932, loss1: 6.3, loss2: 18.4, efficiency: 76.4 },
        { month: "Oct-25", A1: 43200, A2: 40100, A3Ind: 33500, A3Bulk: 33200, stage1Vol: 3100, stage2Vol: 6600, totalLossVol: 9700, loss1: 7.2, loss2: 16.5, efficiency: 77.5 }
    ],
    zonePerformance: [
        { zone: "Zone_08", average: 2789, status: "Active", Jul25: 3542, Aug25: 3840, Sep25: 3900, Oct25: 4000 },
        { zone: "Zone_03_(A)", average: 4970, status: "Active", Jul25: 6026, Aug25: 6212, Sep25: 6300, Oct25: 6400 },
        { zone: "Zone_03_(B)", average: 3020, status: "Active", Jul25: 3243, Aug25: 2886, Sep25: 2950, Oct25: 3050 },
        { zone: "Zone_05", average: 3941, status: "Active", Jul25: 3497, Aug25: 3968, Sep25: 4050, Oct25: 4150 },
        { zone: "Zone_01_(FM)", average: 1892, status: "Active", Jul25: 1974, Aug25: 2305, Sep25: 2400, Oct25: 2500 },
        { zone: "Zone_VS", average: 30, status: "Low", Jul25: 60, Aug25: 77, Sep25: 80, Oct25: 85 },
        { zone: "Zone_SC", average: 61, status: "Critical", Jul25: 60, Aug25: 61, Sep25: 65, Oct25: 70 }
    ],
    consumptionByType: [
        { type: "Commercial (Retail)", total: 173673, percentage: 52.4, color: "#3b82f6" },
        { type: "Zone Infrastructure", total: 134506, percentage: 40.6, color: "#10b981" },
        { type: "Residential (Villas)", total: 92871, percentage: 28.0, color: "#f59e0b" },
        { type: "Irrigation", total: 6149, percentage: 1.9, color: "#06b6d4" },
        { type: "Common Areas", total: 314, percentage: 0.1, color: "#8b5cf6" }
    ]
};

// Electricity Data Helper
const generateElectricityMeters = (): MeterReading[] => {
    const types = ["Residential", "Commercial", "Street Light", "HVAC", "Pump Station"];
    const meters: MeterReading[] = [];

    for (let i = 1; i <= 50; i++) {
        const type = types[Math.floor(Math.random() * types.length)];
        const readings: Record<string, number> = {};
        const baseConsumption = Math.random() * 5000 + 1000;

        // Generate readings for Jan-25 to Oct-25
        ["Jan-25", "Feb-25", "Mar-25", "Apr-25", "May-25", "Jun-25", "Jul-25", "Aug-25", "Sep-25", "Oct-25"].forEach((month, idx) => {
            // Add some seasonality/randomness
            const variance = Math.random() * 0.4 + 0.8; // 0.8 to 1.2 multiplier
            readings[month] = Math.round(baseConsumption * variance * (idx > 4 ? 1.5 : 1)); // Higher in summer
        });

        meters.push({
            id: `elec-${i}`,
            name: `Meter ${i}`,
            account_number: `ACC-${10000 + i}`,
            type,
            readings
        });
    }
    return meters;
};

export const ELECTRICITY_METERS = generateElectricityMeters();

// STP Data Helper
const generateSTPOperations = (): STPOperation[] => {
    const operations: STPOperation[] = [];
    const startDate = new Date(2025, 0, 1); // Jan 1 2025
    const endDate = new Date(2025, 9, 31); // Oct 31 2025

    // Generate days manually instead of using eachDayOfInterval
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        const dateStr = format(currentDate, 'yyyy-MM-dd');
        const inlet = Math.round(Math.random() * 500 + 4500); // 4500-5000 m3
        const tse = Math.round(inlet * 0.95); // 95% efficiency roughly
        const trips = Math.round(Math.random() * 5); // 0-5 trips

        operations.push({
            id: `stp-${dateStr}`,
            date: dateStr,
            inlet_sewage: inlet,
            tse_for_irrigation: tse,
            tanker_trips: trips,
            // derived fields can be calculated on fly or stored
        });

        currentDate = addDays(currentDate, 1);
    }

    return operations;
};

export const STP_OPERATIONS = generateSTPOperations();

// Contractors Data
export const CONTRACTORS_DATA: Contractor[] = [
    { id: "c1", name: "Oman National Engineering", company: "ONEIC", status: "Active", expiryDate: "2025-12-31", category: "Maintenance" },
    { id: "c2", name: "Muscat Bay Services", company: "MBS", status: "Active", expiryDate: "2026-06-30", category: "Facility Management" },
    { id: "c3", name: "Specialized Security", company: "Securitas", status: "Active", expiryDate: "2025-11-15", category: "Security" },
    { id: "c4", name: "Green World Landscaping", company: "Green World", status: "Expired", expiryDate: "2024-12-01", category: "Landscaping" },
    { id: "c5", name: "Rapid Response Plumbing", company: "RRP", status: "On-Hold", expiryDate: "2025-05-20", category: "Plumbing" },
];

// Firefighting Data
export const FIRE_EQUIPMENT: FireSafetyEquipment[] = [
    { id: "fe1", name: "Fire Alarm Panel", location: "B1", status: "Operational", priority: "High", battery: 95, signal: 98, next_maintenance: "2025-11-15", inspector: "Ahmed", type: "Fire Alarm Panel", zone: "Zone A" },
    { id: "fe2", name: "Smoke Detector 102", location: "B2", status: "Operational", priority: "Medium", battery: 88, signal: 90, next_maintenance: "2026-01-20", inspector: "Ali", type: "Smoke Detector", zone: "Zone B" },
    { id: "fe3", name: "Heat Detector 305", location: "B3", status: "Needs Attention", priority: "High", battery: 45, signal: 85, next_maintenance: "2025-10-30", inspector: "Ahmed", type: "Heat Detector", zone: "Zone C" },
    { id: "fe4", name: "Extinguisher 401", location: "B4", status: "Expired", priority: "Critical", battery: null, signal: null, next_maintenance: "2025-09-01", inspector: "Said", type: "Fire Extinguisher", zone: "Zone D" },
    { id: "fe5", name: "Sprinkler Pump", location: "Pump Station", status: "Maintenance Due", priority: "High", battery: null, signal: null, next_maintenance: "2025-10-15", inspector: "Ali", type: "Sprinkler System", zone: "Technical" },
];

export const FIRE_QUOTES: FireQuotation[] = [
    { id: "q1", quote_code: "Q-2025-001", date: "2025-10-01", provider: "Safety First LLC", status: "pending_approval", subtotal_omr: 1800, vat_omr: 90, total_omr: 1890 },
    { id: "q2", quote_code: "Q-2025-002", date: "2025-09-25", provider: "Oman Fire Tech", status: "approved", subtotal_omr: 500, vat_omr: 25, total_omr: 525 },
    { id: "q3", quote_code: "Q-2025-003", date: "2025-09-10", provider: "Gulf Safety", status: "rejected", subtotal_omr: 2000, vat_omr: 100, total_omr: 2100 },
];

export const FIRE_QUOTE_ITEMS: FireQuotationItem[] = [
    { id: "qi1", quote_code: "Q-2025-001", location: "B1", description: "Replace Backup Batteries", category: "Batteries", priority: "high", cost_omr: 717 },
    { id: "qi2", quote_code: "Q-2025-001", location: "B1", description: "Fix Diesel Starter", category: "Critical Repairs", priority: "high", cost_omr: 500 },
    { id: "qi3", quote_code: "Q-2025-001", location: "B4", description: "Refill Extinguishers", category: "Fire Extinguishers", priority: "medium", cost_omr: 91.4 },
    { id: "qi4", quote_code: "Q-2025-002", location: "B2", description: "Replace Smoke Detectors", category: "Detectors & Modules", priority: "medium", cost_omr: 232 },
];

// Assets Data
export const ASSETS_DATA: Asset[] = [
    { id: "a1", name: "Main Pump A", type: "Mechanical", location: "Pump Room", status: "Active", purchaseDate: "2023-01-15", value: 15000, serialNumber: "PUMP-001-A", lastService: "2025-08-01" },
    { id: "a2", name: "Main Pump B", type: "Mechanical", location: "Pump Room", status: "Under Maintenance", purchaseDate: "2023-01-15", value: 15000, serialNumber: "PUMP-001-B", lastService: "2025-09-15" },
    { id: "a3", name: "Generator 500kVA", type: "Electrical", location: "Power Plant", status: "Active", purchaseDate: "2024-05-20", value: 45000, serialNumber: "GEN-500-X", lastService: "2025-09-01" },
    { id: "a4", name: "Golf Cart 04", type: "Vehicle", location: "Club House", status: "In Storage", purchaseDate: "2024-02-10", value: 3500, serialNumber: "GC-04", lastService: "2025-06-20" },
    { id: "a5", name: "Irrigation Controller", type: "Electronics", location: "Zone A", status: "Active", purchaseDate: "2023-11-05", value: 1200, serialNumber: "IC-ZA-01", lastService: "2025-07-10" },
];

// --- API Simulation Functions ---

export async function getWaterSystemData(): Promise<WaterSystemData> {
    return new Promise((resolve) => setTimeout(() => resolve(WATER_SYSTEM_DATA), 500));
}

export async function getElectricityMeters(): Promise<MeterReading[]> {
    return new Promise((resolve) => setTimeout(() => resolve(ELECTRICITY_METERS), 600));
}

export async function getSTPOperations(): Promise<STPOperation[]> {
    return new Promise((resolve) => setTimeout(() => resolve(STP_OPERATIONS), 700));
}

export async function getContractors(): Promise<Contractor[]> {
    return new Promise((resolve) => setTimeout(() => resolve(CONTRACTORS_DATA), 400));
}

export async function getFireSafetyEquipment(): Promise<FireSafetyEquipment[]> {
    return new Promise((resolve) => setTimeout(() => resolve(FIRE_EQUIPMENT), 500));
}

export async function getFireQuotations(): Promise<{ quotes: FireQuotation[], items: FireQuotationItem[] }> {
    return new Promise((resolve) => setTimeout(() => resolve({ quotes: FIRE_QUOTES, items: FIRE_QUOTE_ITEMS }), 600));
}

export async function getAssets(): Promise<Asset[]> {
    return new Promise((resolve) => setTimeout(() => resolve(ASSETS_DATA), 400));
}
