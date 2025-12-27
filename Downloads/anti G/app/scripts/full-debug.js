// Comprehensive debug - test direct API call
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('=== FULL DEBUG ===\n');
console.log('URL present:', !!supabaseUrl);
console.log('Key present:', !!supabaseKey);

const supabase = createClient(supabaseUrl, supabaseKey);

async function fullDebug() {
    // Test 1: Check Contractor_Tracker
    console.log('\n1. Testing Contractor_Tracker table...');
    const r1 = await supabase.from('Contractor_Tracker').select('*');
    console.log('   Error:', r1.error?.message || 'None');
    console.log('   Row count:', r1.data?.length);
    if (r1.data && r1.data.length > 0) {
        console.log('   First row:', JSON.stringify(r1.data[0], null, 2));
    }

    // Test 2: Check if other tables work (mb_assets as known working)
    console.log('\n2. Testing mb_assets (known working table)...');
    const r2 = await supabase.from('mb_assets').select('id, asset_name').limit(2);
    console.log('   Error:', r2.error?.message || 'None');
    console.log('   Row count:', r2.data?.length);

    // Test 3: Check Water System (another table with spaces)
    console.log('\n3. Testing "Water System" table...');
    const r3 = await supabase.from('Water System').select('*').limit(1);
    console.log('   Error:', r3.error?.message || 'None');
    console.log('   Row count:', r3.data?.length);

    // Test 4: List all accessible tables via a trick
    console.log('\n4. Getting table info via manual REST call...');
    try {
        const response = await fetch(`${supabaseUrl}/rest/v1/Contractor_Tracker?select=*&limit=5`, {
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`
            }
        });
        const data = await response.json();
        console.log('   HTTP Status:', response.status);
        console.log('   Response:', JSON.stringify(data, null, 2).substring(0, 1000));
    } catch (e) {
        console.log('   Fetch error:', e.message);
    }
}

fullDebug().then(() => console.log('\n=== DEBUG COMPLETE ==='));
