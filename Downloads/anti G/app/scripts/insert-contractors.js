// Script to insert contractor data directly into Supabase
// Run with: node scripts/insert-contractors.js

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Contractor data extracted from the screenshot
const contractors = [
    // Active Contracts
    {
        "Contractor": "ACME Arabian LLC",
        "Service Provided": "Fit Maintenance Services",
        "Status": "Active",
        "Contract Type": "Contract",
        "Start Date": "1/9/2023",
        "End Date": "12/31/2028",
        "Contract (OMR)/Month": "913.500 OMR",
        "Contract Total (OMR)/Year": "11,316 OMR (inc VAT)",
        "Annual Value (OMR)": 11316,
        "Renewal Plan": "5 year contract",
        "Note": null
    },
    {
        "Contractor": "Oman Water Treatment Company LLC",
        "Service Provided": "Extensive Water STP Operations And Maintenance",
        "Status": "Active",
        "Contract Type": "Contract",
        "Start Date": "1/8/2024",
        "End Date": "1/7/2029",
        "Contract (OMR)/Month": null,
        "Contract Total (OMR)/Year": "389,400 OMR (inc VAT)",
        "Annual Value (OMR)": 389400,
        "Renewal Plan": "5 year contract - via RFP",
        "Note": null
    },
    {
        "Contractor": "Akkas",
        "Service Provided": "Fire/Firefighting SIL",
        "Status": "Active",
        "Contract Type": "PO",
        "Start Date": "9/4/2023",
        "End Date": "9/4/2024",
        "Contract (OMR)/Month": null,
        "Contract Total (OMR)/Year": "15,943.100 OMR",
        "Annual Value (OMR)": 15943.10,
        "Renewal Plan": "View contract and replace EFIC",
        "Note": null
    },
    {
        "Contractor": "Nama Elect (MEDC) / TANWEER",
        "Service Provided": "Supply and Maintenance EVSE (Power Meters, Bill)",
        "Status": "Active",
        "Contract Type": "Contract",
        "Start Date": null,
        "End Date": null,
        "Contract (OMR)/Month": null,
        "Contract Total (OMR)/Year": null,
        "Annual Value (OMR)": null,
        "Renewal Plan": "View contract and replace EFIC",
        "Note": null
    },
    {
        "Contractor": "Muscat Waste Mgt (Beaah)",
        "Service Provided": "Pest Control Services",
        "Status": "Active",
        "Contract Type": "PO",
        "Start Date": "7/2/2023",
        "End Date": "6/22/2024",
        "Contract (OMR)/Month": null,
        "Contract Total (OMR)/Year": "4,640 OMR/Year",
        "Annual Value (OMR)": 4640,
        "Renewal Plan": null,
        "Note": null
    },
    {
        "Contractor": "Gulf Egypt",
        "Service Provided": "Chiller, BMCS & Preventive Maint only",
        "Status": "Active",
        "Contract Type": "Contract",
        "Start Date": "6/7/2022",
        "End Date": "6/7/2025",
        "Contract (OMR)/Month": null,
        "Contract Total (OMR)/Year": "17,820.350 OMR",
        "Annual Value (OMR)": 17820.35,
        "Renewal Plan": "2 year contract for fire alarm & fire fighting systems",
        "Note": null
    },
    {
        "Contractor": "Bahwan Engineering Company LLC",
        "Service Provided": "Maintenance of Fire Alarm & Fire Fighting Equipment",
        "Status": "Active",
        "Contract Type": "Contract",
        "Start Date": "1/1/2024",
        "End Date": "12/31/2025",
        "Contract (OMR)/Month": null,
        "Contract Total (OMR)/Year": "4,546.192 OMR/Year",
        "Annual Value (OMR)": 4546.19,
        "Renewal Plan": null,
        "Note": null
    },
    {
        "Contractor": "Gulf Expert",
        "Service Provided": "CCTV Access & Staff Accommodation",
        "Status": "Active",
        "Contract Type": "Contract",
        "Start Date": "7/1/2024",
        "End Date": "6/30/2027",
        "Contract (OMR)/Month": null,
        "Contract Total (OMR)/Year": "1,079,500 OMR",
        "Annual Value (OMR)": 1079500,
        "Renewal Plan": null,
        "Note": null
    },
    {
        "Contractor": "COSMO",
        "Service Provided": "Facility Management (FM)",
        "Status": "Active",
        "Contract Type": "Contract",
        "Start Date": "2/1/2022",
        "End Date": "2/28/2025",
        "Contract (OMR)/Month": "46,882 OMR/Month",
        "Contract Total (OMR)/Year": "562,584 OMR",
        "Annual Value (OMR)": 562584,
        "Renewal Plan": null,
        "Note": null
    },
    {
        "Contractor": "Future Cities S.A.O.C (Estidama)",
        "Service Provided": "Supply and Installation of Smart Control S.",
        "Status": "Active",
        "Contract Type": "Contract",
        "Start Date": null,
        "End Date": null,
        "Contract (OMR)/Month": null,
        "Contract Total (OMR)/Year": "1,474 OMR/milestone onetime",
        "Annual Value (OMR)": 1474,
        "Renewal Plan": "New comments applied",
        "Note": null
    },
    {
        "Contractor": "Garaloo",
        "Service Provided": "Park AC Chillers/Core Pit Maintenance & Details",
        "Status": "Active",
        "Contract Type": "Contract",
        "Start Date": null,
        "End Date": null,
        "Contract (OMR)/Month": null,
        "Contract Total (OMR)/Year": null,
        "Annual Value (OMR)": null,
        "Renewal Plan": "Details to be confirmed/uploaded",
        "Note": null
    },
    {
        "Contractor": "Ras Mountain / ARAMEX",
        "Service Provided": "Offsite Record Storage",
        "Status": "Active",
        "Contract Type": "Contract",
        "Start Date": null,
        "End Date": "5/17/2025",
        "Contract (OMR)/Month": null,
        "Contract Total (OMR)/Year": null,
        "Annual Value (OMR)": null,
        "Renewal Plan": "Changes on next calendar year January",
        "Note": null
    },
    {
        "Contractor": "Nasco",
        "Service Provided": "Facility Management (FM)",
        "Status": "Active",
        "Contract Type": "Contract",
        "Start Date": "6/1/2024",
        "End Date": null,
        "Contract (OMR)/Month": null,
        "Contract Total (OMR)/Year": "389,468 OMR/hr VTE",
        "Annual Value (OMR)": 389468,
        "Renewal Plan": "1 year contract to be evaluated with COSMO",
        "Note": null
    },
    {
        "Contractor": "KONE Hiessen LLC",
        "Service Provided": "Lift Maintenance Services",
        "Status": "Active",
        "Contract Type": "Contract",
        "Start Date": "7/1/2024",
        "End Date": "2/28/2025",
        "Contract (OMR)/Month": null,
        "Contract Total (OMR)/Year": "16,200 OMR/hr (inc VTE)",
        "Annual Value (OMR)": 16200,
        "Renewal Plan": "New contract - As Omanized WITH COSMO",
        "Note": null
    },
    {
        "Contractor": "Mann Appel (Frankland) LLC",
        "Service Provided": "Pest Control Services",
        "Status": "Active",
        "Contract Type": "Contract",
        "Start Date": "2/1/2024",
        "End Date": "1/31/2025",
        "Contract (OMR)/Month": null,
        "Contract Total (OMR)/Year": "9,488 OMR",
        "Annual Value (OMR)": 9488,
        "Renewal Plan": null,
        "Note": null
    },
    {
        "Contractor": "Warner Electricals LLC",
        "Service Provided": "Interim AC (Delete Now Completed/Instrumentation)",
        "Status": "Active",
        "Contract Type": "Contract",
        "Start Date": "1/1/2024",
        "End Date": "12/31/2025",
        "Contract (OMR)/Month": null,
        "Contract Total (OMR)/Year": null,
        "Annual Value (OMR)": null,
        "Renewal Plan": "Awaiting agreement, evaluation for external",
        "Note": null
    },
    {
        "Contractor": "Muscat Electronics LLC",
        "Service Provided": "Delete AC of Sela Center",
        "Status": "Active",
        "Contract Type": "PO",
        "Start Date": "1/1/2024",
        "End Date": "1/25/2025",
        "Contract (OMR)/Month": null,
        "Contract Total (OMR)/Year": null,
        "Annual Value (OMR)": null,
        "Renewal Plan": null,
        "Note": null
    },
    {
        "Contractor": "Hayward Marine Services LLC",
        "Service Provided": "Display Services",
        "Status": "Active",
        "Contract Type": "PO",
        "Start Date": "4/1/2024",
        "End Date": null,
        "Contract (OMR)/Month": null,
        "Contract Total (OMR)/Year": null,
        "Annual Value (OMR)": null,
        "Renewal Plan": null,
        "Note": null
    },
    {
        "Contractor": "Ocean Prime Manufacturing Om",
        "Service Provided": "Supply, Installation, and Commissioning",
        "Status": "Active",
        "Contract Type": "Contract",
        "Start Date": null,
        "End Date": null,
        "Contract (OMR)/Month": null,
        "Contract Total (OMR)/Year": "22,080 OMR on delivery",
        "Annual Value (OMR)": 22080,
        "Renewal Plan": "Done - review & note on qty. temperature",
        "Note": null
    },
    // Expired Contracts
    {
        "Contractor": "Color Vision",
        "Service Provided": "Comprehensive STP Operation and Maintenance",
        "Status": "Expired",
        "Contract Type": "Contract",
        "Start Date": "4/2/2019",
        "End Date": "4/25/2023",
        "Contract (OMR)/Month": "4,682 OMR /Month",
        "Contract Total (OMR)/Year": null,
        "Annual Value (OMR)": null,
        "Renewal Plan": null,
        "Note": null
    },
    {
        "Contractor": "Advance Technology and Financial",
        "Service Provided": "BMS Maintenance (prev Aspect Control Group)",
        "Status": "Expired",
        "Contract Type": "Contract",
        "Start Date": null,
        "End Date": "4/12/2023",
        "Contract (OMR)/Month": null,
        "Contract Total (OMR)/Year": null,
        "Annual Value (OMR)": null,
        "Renewal Plan": "Not Renewing - Service covered by others",
        "Note": "Transferred to Radfield before contract end"
    },
    {
        "Contractor": "Al Water Services LLC",
        "Service Provided": "Drainage/Flooded Rain Water",
        "Status": "Expired",
        "Contract Type": "Contract",
        "Start Date": "4/2/2019",
        "End Date": null,
        "Contract (OMR)/Month": null,
        "Contract Total (OMR)/Year": null,
        "Annual Value (OMR)": null,
        "Renewal Plan": null,
        "Note": null
    },
    {
        "Contractor": "Saeed Dabal",
        "Service Provided": "Provision of Services",
        "Status": "Expired",
        "Contract Type": "Contract",
        "Start Date": "1/5/2020",
        "End Date": "1/5/2021",
        "Contract (OMR)/Month": "10,927 OMR per annum",
        "Contract Total (OMR)/Year": "12,073 OMR",
        "Annual Value (OMR)": 12073,
        "Renewal Plan": null,
        "Note": "Due to termination / note - no documentation"
    },
    {
        "Contractor": "Muscat Electricity LLC",
        "Service Provided": "Sales AC Controls (Basic Control) Maintenance",
        "Status": "Expired",
        "Contract Type": "Contract",
        "Start Date": "8/15/2021",
        "End Date": "8/14/2023",
        "Contract (OMR)/Month": null,
        "Contract Total (OMR)/Year": "8,100 OMR",
        "Annual Value (OMR)": 8100,
        "Renewal Plan": null,
        "Note": null
    },
    // Retaining
    {
        "Contractor": "Oman Water Treatment Company (CWAN)",
        "Service Provided": "Comprehensive STP Operation and Maintenance",
        "Status": "Retaining",
        "Contract Type": "Contract",
        "Start Date": "1/8/2024",
        "End Date": "1/7/2028",
        "Contract (OMR)/Month": null,
        "Contract Total (OMR)/Year": null,
        "Annual Value (OMR)": null,
        "Renewal Plan": null,
        "Note": null
    },
    {
        "Contractor": "Mr Plus",
        "Service Provided": "Use Settling/to Please Quarter or Master Bay M",
        "Status": "Expired",
        "Contract Type": "NC",
        "Start Date": null,
        "End Date": null,
        "Contract (OMR)/Month": null,
        "Contract Total (OMR)/Year": null,
        "Annual Value (OMR)": null,
        "Renewal Plan": "Details to be confirmed/uploaded",
        "Note": null
    }
];

async function insertData() {
    console.log('=== Inserting Contractor Data ===\n');

    // First, check current count
    const { count: beforeCount } = await supabase
        .from('Contractor_Tracker')
        .select('*', { count: 'exact', head: true });
    console.log('Rows before insert:', beforeCount || 0);

    // Insert data
    console.log(`\nInserting ${contractors.length} contractors...`);

    const { data, error } = await supabase
        .from('Contractor_Tracker')
        .insert(contractors)
        .select();

    if (error) {
        console.error('❌ Insert error:', error.message);
        console.error('Error details:', error);
        return;
    }

    console.log(`✅ Successfully inserted ${data?.length || 0} rows`);

    // Verify final count
    const { count: afterCount } = await supabase
        .from('Contractor_Tracker')
        .select('*', { count: 'exact', head: true });
    console.log('Rows after insert:', afterCount);

    // Show sample
    const { data: sample } = await supabase
        .from('Contractor_Tracker')
        .select('*')
        .limit(3);
    console.log('\nSample data:');
    sample?.forEach((row, i) => {
        console.log(`  ${i + 1}. ${row.Contractor} (${row.Status})`);
    });
}

insertData().then(() => console.log('\n=== Done ==='));
