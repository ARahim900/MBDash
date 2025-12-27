import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase configuration - these should be set via environment variables
// To connect to Supabase:
// 1. Create a .env.local file in the app root
// 2. Add: NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
// 3. Add: NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key (starts with "eyJ...")

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Debug: Log configuration status (enable for troubleshooting)
// if (typeof window !== 'undefined') {
//     console.log('Supabase Config:', {
//         url: supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'NOT SET',
//         keyPresent: supabaseAnonKey ? 'YES' : 'NOT SET'
//     });
// }

// Validate that the anon key looks like a valid Supabase JWT (they start with "eyJ")
function isValidSupabaseKey(key: string): boolean {
    return key.length > 0 && key.startsWith('eyJ');
}

// Check if Supabase is properly configured
export function isSupabaseConfigured(): boolean {
    const urlValid = supabaseUrl.length > 0 && supabaseUrl.startsWith('https://');
    const keyValid = isValidSupabaseKey(supabaseAnonKey);
    return urlValid && keyValid;
}

// Lazy-initialized client to prevent build-time errors
let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
    if (!isSupabaseConfigured()) {
        // Supabase not configured - will use mock data fallback
        return null;
    }
    if (!supabaseClient) {
        supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    }
    return supabaseClient;
}

// Asset type matching the mb_assets table schema in Supabase
export interface SupabaseAsset {
    id: number;
    row_id: number | null;
    asset_id: string | null;
    asset_tag: string | null;
    asset_name: string | null;
    asset_description: string | null;
    asset_type: string | null;
    category: string | null;
    sub_category: string | null;
    system_area: string | null;
    location_name: string | null;
    location_tag: string | null;
    floor_area: string | null;
    building: string | null;
    make_brand: string | null;
    model: string | null;
    capacity_size: string | null;
    country_origin: string | null;
    supplier: string | null;
    install_date: string | null;
    life_expectancy_years: number | null;
    current_age_years: number | null;
    erl_years: number | null;
    status: string | null;
    condition: string | null;
    ppm_frequency: string | null;
    is_active: string | null;
    quantity: number | null;
    om_volume: string | null;
    responsibility: string | null;
    amc_contractor: string | null;
    floors_served: string | null;
    notes: string | null;
    source_sheet: string | null;
    created_at?: string;
    updated_at?: string;
}

// Transform Supabase asset to match the app's Asset interface
export function transformAsset(dbAsset: SupabaseAsset): import('./mock-data').Asset {
    return {
        id: String(dbAsset.id),
        name: dbAsset.asset_name || 'Unknown Asset',
        type: dbAsset.asset_type || dbAsset.category || 'General',
        location: dbAsset.location_name || dbAsset.building || 'Unknown Location',
        status: (dbAsset.status as any) || 'Active',
        purchaseDate: dbAsset.install_date || '',
        value: 0,
        serialNumber: dbAsset.asset_tag || dbAsset.asset_id || '',
        lastService: '',
    };
}

// Fetch assets from Supabase with pagination and search
export async function getAssetsFromSupabase(
    page: number = 1,
    pageSize: number = 50,
    search: string = ''
): Promise<{ data: import('./mock-data').Asset[], count: number }> {
    const client = getSupabaseClient();

    if (!client) {
        return { data: [], count: 0 };
    }

    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    try {
        let query = client
            .from('mb_assets')
            .select('*', { count: 'exact' });

        // Apply search filter if provided
        if (search) {
            query = query.or(`asset_name.ilike.%${search}%,location_name.ilike.%${search}%,asset_tag.ilike.%${search}%,category.ilike.%${search}%`);
        }

        const { data, error, count } = await query
            .order('asset_name', { ascending: true })
            .range(start, end);

        if (error) {
            throw new Error(`Supabase error: ${error.message || error.code || 'Unknown error'}`);
        }

        const transformedData = (data || []).map((item: any) => transformAsset(item));

        return {
            data: transformedData,
            count: count || 0
        };
    } catch (err) {
        throw err;
    }
}

// --- Contractor Tracker Types ---
// New unified schema for Contractor_Tracker table

export interface ContractorTracker {
    Contractor: string | null;
    "Service Provided": string | null;
    Status: string | null;
    "Contract Type": string | null;
    "Start Date": string | null;
    "End Date": string | null;
    "Contract (OMR)/Month": string | null;
    "Contract Total (OMR)/Year": string | null;
    "Annual Value (OMR)": number | null;
    "Renewal Plan": string | null;
    Note: string | null;
}

// Fetch all contractor tracker data from Supabase
export async function getContractorTrackerData(): Promise<ContractorTracker[]> {
    const client = getSupabaseClient();
    if (!client) return [];

    const { data, error } = await client
        .from('Contractor_Tracker')
        .select('*')
        .order('Contractor');

    if (error) {
        console.error('Error fetching Contractor_Tracker:', error.message);
        return [];
    }
    return data || [];
}

// Legacy AMC types kept for backward compatibility (deprecated)
export interface AmcContractorSummary {
    id: string;
    no: number;
    contractor: string;
    service_category: string | null;
    contract_ref: string | null;
    contract_type: string | null;
    start_date: string | null;
    end_date: string | null;
    duration: string | null;
    monthly_fee_omr: string | null;
    annual_fee_omr: string | null;
    total_contract_value_omr: string | null;
    status: string | null;
    alert: string | null;
    document_status: string | null;
    created_at?: string;
}

export interface AmcContractorDetails {
    id: string;
    contractor: string;
    contract_ref: string | null;
    scope_of_work: string | null;
    ppm_frequency: string | null;
    response_time_emergency: string | null;
    response_time_normal: string | null;
    liquidated_damages: string | null;
    performance_bond: string | null;
    payment_terms: string | null;
    warranty_period: string | null;
    key_exclusions: string | null;
    contact_person: string | null;
    created_at?: string;
}

export interface AmcContractorExpiry {
    id: string;
    contractor: string;
    end_date: string | null;
    days_remaining: number | null;
    renewal_action_required_by: string | null;
    priority: string | null;
    renewal_status: string | null;
    created_at?: string;
}

export interface AmcContractorPricing {
    id: string;
    contractor: string;
    year_1_omr: string | null;
    year_2_omr: string | null;
    year_3_omr: string | null;
    year_4_omr: string | null;
    year_5_omr: string | null;
    total_omr: string | null;
    notes: string | null;
    created_at?: string;
}

// Legacy types for backward compatibility
export interface AmcContract {
    id: string;
    name: string;
    company: string | null;
    category: string;
    status: string;
    start_date: string | null;
    created_at?: string;
}

export interface AmcExpiry {
    id: string;
    contract_id: string;
    expiry_date: string;
    notification_sent: boolean;
    amc_contracts?: AmcContract;
}

export interface AmcContact {
    id: string;
    contract_id: string;
    contact_name: string;
    role: string | null;
    phone: string | null;
    email: string | null;
    amc_contracts?: AmcContract;
}

export interface AmcPricing {
    id: string;
    contract_id: string;
    contract_value: number;
    currency: string;
    payment_terms: string | null;
    amc_contracts?: AmcContract;
}

// --- AMC Fetch Functions (New Schema) ---

export async function getContractorSummary(): Promise<AmcContractorSummary[]> {
    const client = getSupabaseClient();
    if (!client) return [];

    const { data, error } = await client
        .from('amc_contractor_summary')
        .select('*')
        .order('no');

    if (error) {
        // console.error('Error fetching contractor summary:', error);
        return [];
    }
    return data || [];
}

export async function getContractorDetails(): Promise<AmcContractorDetails[]> {
    const client = getSupabaseClient();
    if (!client) return [];

    const { data, error } = await client
        .from('amc_contractor_details')
        .select('*')
        .order('contractor');

    if (error) {
        console.error('Error fetching contractor details:', error);
        return [];
    }
    return data || [];
}

export async function getContractorExpiry(): Promise<AmcContractorExpiry[]> {
    const client = getSupabaseClient();
    if (!client) return [];

    const { data, error } = await client
        .from('amc_contractor_expiry')
        .select('*')
        .order('days_remaining');

    if (error) {
        console.error('Error fetching contractor expiry:', error);
        return [];
    }
    return data || [];
}

export async function getContractorPricing(): Promise<AmcContractorPricing[]> {
    const client = getSupabaseClient();
    if (!client) return [];

    const { data, error } = await client
        .from('amc_contractor_pricing')
        .select('*')
        .order('contractor');

    if (error) {
        // console.error('Error fetching contractor pricing:', error);
        return [];
    }
    return data || [];
}

// Legacy fetch functions (kept for backward compatibility)
export async function getAmcContracts(): Promise<AmcContract[]> {
    const client = getSupabaseClient();
    if (!client) return [];

    const { data, error } = await client
        .from('amc_contracts')
        .select('*')
        .order('name');

    if (error) {
        return [];
    }
    return data || [];
}

export async function getAmcExpiry(): Promise<AmcExpiry[]> {
    const client = getSupabaseClient();
    if (!client) return [];

    const { data, error } = await client
        .from('amc_expiry')
        .select('*, amc_contracts(name, company)')
        .order('expiry_date');

    if (error) {
        return [];
    }
    return data || [];
}

export async function getAmcContacts(): Promise<AmcContact[]> {
    const client = getSupabaseClient();
    if (!client) return [];

    const { data, error } = await client
        .from('amc_contacts')
        .select('*, amc_contracts(name)')
        .order('contact_name');

    if (error) {
        return [];
    }
    return data || [];
}

export async function getAmcPricing(): Promise<AmcPricing[]> {
    const client = getSupabaseClient();
    if (!client) return [];

    const { data, error } = await client
        .from('amc_pricing')
        .select('*, amc_contracts(name)')
        .order('contract_value', { ascending: false });

    if (error) {
        return [];
    }
    return data || [];
}

// Combined fetch for the main view using new schema
export async function getCombinedContractors(): Promise<import('./mock-data').Contractor[]> {
    const summaryData = await getContractorSummary();

    // Transform to match the UI Contractor interface
    return summaryData.map((item) => ({
        id: item.id,
        name: item.contractor,
        company: item.contractor,
        status: (item.status as "Active" | "Expired" | "On-Hold") || 'Active',
        expiryDate: item.end_date || '',
        category: item.service_category || ''
    }));
}



// --- Electricity Meters Types ---

export interface ElectricityMeter {
    id: string;
    name: string;
    meter_type: string;
    account_number: string | null;
    created_at?: string;
}

export interface ElectricityReading {
    id: string;
    meter_id: string;
    month: string;
    consumption: number;
    created_at?: string;
}

// Fetch electricity meters with readings from Supabase
export async function getElectricityMetersFromSupabase(): Promise<import('./mock-data').MeterReading[]> {
    const client = getSupabaseClient();
    if (!client) {
        // console.log('Supabase not configured for electricity meters');
        return [];
    }

    try {
        // Fetch all meters
        const { data: meters, error: metersError } = await client
            .from('electricity_meters')
            .select('*')
            .order('name');

        if (metersError) {
            // console.error('Error fetching electricity meters:', metersError);
            return [];
        }

        if (!meters || meters.length === 0) {
            // console.log('No electricity meters found in database');
            return [];
        }

        // Fetch all readings
        const { data: readings, error: readingsError } = await client
            .from('electricity_readings')
            .select('*');

        if (readingsError) {
            // console.error('Error fetching electricity readings:', readingsError);
            return [];
        }

        // Group readings by meter_id
        const readingsByMeter: Record<string, Record<string, number>> = {};
        (readings || []).forEach((reading: ElectricityReading) => {
            if (!readingsByMeter[reading.meter_id]) {
                readingsByMeter[reading.meter_id] = {};
            }
            readingsByMeter[reading.meter_id][reading.month] = Number(reading.consumption) || 0;
        });

        // Transform to MeterReading interface
        const result: import('./mock-data').MeterReading[] = meters.map((meter: ElectricityMeter) => ({
            id: meter.id,
            name: meter.name,
            account_number: meter.account_number || '',
            type: meter.meter_type,
            readings: readingsByMeter[meter.id] || {}
        }));

        // console.log(`Successfully fetched ${result.length} electricity meters from Supabase`);
        return result;
    } catch (err) {
        // console.error('Error in getElectricityMetersFromSupabase:', err);
        return [];
    }
}

// --- STP Operations Types ---

export interface SupabaseSTPOperation {
    id: number;
    date: string;
    inlet_sewage: number | null;
    tse_for_irrigation: number | null;
    tanker_trips: number | null;
    generated_income: number | null;
    water_savings: number | null;
    total_impact: number | null;
    monthly_volume_input: number | null;
    monthly_volume_output: number | null;
    monthly_income: number | null;
    monthly_savings: number | null;
    original_id: string | null;
    created_at?: string;
    updated_at?: string;
}

// Transform Supabase STP record to match the app's STPOperation interface
export function transformSTPOperation(dbRecord: SupabaseSTPOperation): import('./mock-data').STPOperation {
    return {
        id: String(dbRecord.id),
        date: dbRecord.date,
        inlet_sewage: Number(dbRecord.inlet_sewage) || 0,
        tse_for_irrigation: Number(dbRecord.tse_for_irrigation) || 0,
        tanker_trips: Number(dbRecord.tanker_trips) || 0,
        generated_income: dbRecord.generated_income != null ? Number(dbRecord.generated_income) : undefined,
        water_savings: dbRecord.water_savings != null ? Number(dbRecord.water_savings) : undefined,
        total_impact: dbRecord.total_impact != null ? Number(dbRecord.total_impact) : undefined,
    };
}

// Fetch STP operations from Supabase
export async function getSTPOperationsFromSupabase(): Promise<import('./mock-data').STPOperation[]> {
    const client = getSupabaseClient();
    if (!client) {
        // console.log('Supabase not configured for STP operations');
        return [];
    }

    try {
        const { data, error } = await client
            .from('stp_operations')
            .select('*')
            .order('date', { ascending: true });

        if (error) {
            // console.error('Error fetching STP operations:', error);
            return [];
        }

        if (!data || data.length === 0) {
            // console.log('No STP operations found in database');
            return [];
        }

        const result = data.map((record: SupabaseSTPOperation) => transformSTPOperation(record));
        // console.log(`Successfully fetched ${result.length} STP operations from Supabase`);
        return result;
    } catch (err) {
        // console.error('Error in getSTPOperationsFromSupabase:', err);
        return [];
    }
}

// --- Water System Types ---

export interface SupabaseWaterMeter {
    id: number;
    label: string;
    account_number: string;
    level: string;
    zone: string;
    parent_meter: string;
    type: string;
    // Monthly consumption columns
    jan_25: number | null;
    feb_25: number | null;
    mar_25: number | null;
    apr_25: number | null;
    may_25: number | null;
    jun_25: number | null;
    jul_25: number | null;
    aug_25: number | null;
    sep_25: number | null;
    oct_25: number | null;
    nov_25: number | null;
    dec_25: number | null;
    created_at?: string;
    updated_at?: string;
}

// Transform Supabase water meter to match the app's WaterMeter interface
export function transformWaterMeter(dbMeter: SupabaseWaterMeter): import('./water-data').WaterMeter {
    const consumption: Record<string, number | null> = {
        'Jan-25': dbMeter.jan_25,
        'Feb-25': dbMeter.feb_25,
        'Mar-25': dbMeter.mar_25,
        'Apr-25': dbMeter.apr_25,
        'May-25': dbMeter.may_25,
        'Jun-25': dbMeter.jun_25,
        'Jul-25': dbMeter.jul_25,
        'Aug-25': dbMeter.aug_25,
        'Sep-25': dbMeter.sep_25,
        'Oct-25': dbMeter.oct_25,
        'Nov-25': dbMeter.nov_25,
    };

    return {
        label: dbMeter.label || 'Unknown Meter',
        accountNumber: dbMeter.account_number || '',
        level: (dbMeter.level as 'L1' | 'L2' | 'L3' | 'L4' | 'DC' | 'N/A') || 'N/A',
        zone: dbMeter.zone || '',
        parentMeter: dbMeter.parent_meter || '',
        type: dbMeter.type || '',
        consumption,
    };
}

// Fetch water meters from Supabase
export async function getWaterMetersFromSupabase(): Promise<import('./water-data').WaterMeter[]> {
    const client = getSupabaseClient();
    if (!client) {
        console.log('Supabase not configured for Water System');
        return [];
    }

    try {
        const { data, error } = await client
            .from('Water System')
            .select('*');

        if (error) {
            console.error('Error fetching water meters:', error.message);
            return [];
        }

        if (!data || data.length === 0) {
            console.log('No water meters found in database');
            return [];
        }

        const result = data.map((record: SupabaseWaterMeter) => transformWaterMeter(record));
        console.log(`Successfully fetched ${result.length} water meters from Supabase`);
        return result;
    } catch (err) {
        console.error('Error in getWaterMetersFromSupabase:', err);
        return [];
    }
}

