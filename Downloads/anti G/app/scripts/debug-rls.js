// More detailed debug for RLS and permissions
// Run with: node scripts/debug-rls.js

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('=== RLS Debug for Contractor_Tracker ===\n');

const supabase = createClient(supabaseUrl, supabaseKey);

async function debug() {
    // Test 1: Simple select
    console.log('Test 1: Simple SELECT *');
    const { data: data1, error: error1 } = await supabase
        .from('Contractor_Tracker')
        .select('*');

    console.log('  Error:', error1?.message || 'None');
    console.log('  Data length:', data1?.length || 0);
    console.log('  Data:', JSON.stringify(data1, null, 2).substring(0, 500));

    // Test 2: Count
    console.log('\nTest 2: Count rows');
    const { count, error: error2 } = await supabase
        .from('Contractor_Tracker')
        .select('*', { count: 'exact', head: true });

    console.log('  Error:', error2?.message || 'None');
    console.log('  Count:', count);

    // Test 3: Check if table has data by checking other tables
    console.log('\nTest 3: Check mb_assets table (known working)');
    const { data: assets, error: error3 } = await supabase
        .from('mb_assets')
        .select('id')
        .limit(1);

    console.log('  Error:', error3?.message || 'None');
    console.log('  Has data:', assets && assets.length > 0);

    // Test 4: Try insert and select to check RLS
    console.log('\nTest 4: Try minimal select');
    const { data: data4, error: error4 } = await supabase
        .from('Contractor_Tracker')
        .select('Contractor')
        .limit(5);

    console.log('  Error:', error4?.message || 'None');
    console.log('  Data:', data4);

    // Summary
    console.log('\n=== Summary ===');
    if (data1 && data1.length === 0) {
        console.log('⚠️  The table is accessible but returns 0 rows.');
        console.log('   Possible causes:');
        console.log('   1. RLS policy is blocking SELECT for anon users');
        console.log('   2. Table is actually empty');
        console.log('   3. RLS policy requires authentication');
        console.log('\n   To fix: In Supabase Dashboard → Contractor_Tracker → RLS');
        console.log('   Either disable RLS or add a policy: (true) for SELECT');
    }
}

debug();
