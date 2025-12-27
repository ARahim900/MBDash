// Test script to verify Contractor_Tracker data fetching
// Run with: node scripts/test-contractor-tracker.js

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testContractorTracker() {
    console.log('=== Testing Contractor_Tracker Data Fetch ===\n');

    try {
        const { data, error } = await supabase
            .from('Contractor_Tracker')
            .select('*')
            .order('Contractor');

        if (error) {
            console.error('❌ Error fetching data:', error.message);
            return;
        }

        if (!data || data.length === 0) {
            console.log('⚠️  No data found in Contractor_Tracker table');
            return;
        }

        console.log(`✅ Successfully fetched ${data.length} contractors\n`);

        // Show summary stats
        const statuses = data.reduce((acc, c) => {
            const status = c.Status || 'Unknown';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});

        console.log('Status breakdown:');
        Object.entries(statuses).forEach(([status, count]) => {
            console.log(`  - ${status}: ${count}`);
        });

        const totalAnnual = data.reduce((sum, c) => sum + (c['Annual Value (OMR)'] || 0), 0);
        console.log(`\nTotal Annual Value: ${totalAnnual.toLocaleString()} OMR`);

        console.log('\n--- Sample Row ---');
        console.log(JSON.stringify(data[0], null, 2));

    } catch (err) {
        console.error('❌ Unexpected error:', err.message);
    }
}

testContractorTracker();
