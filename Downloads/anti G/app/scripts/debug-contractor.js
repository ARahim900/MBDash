// Debug script to troubleshoot Contractor_Tracker fetch issue
// Run with: node scripts/debug-contractor.js

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('=== Contractor_Tracker Debug ===\n');
console.log('Supabase URL:', supabaseUrl ? supabaseUrl.substring(0, 40) + '...' : 'NOT SET');
console.log('Supabase Key:', supabaseKey ? 'Present (starts with ' + supabaseKey.substring(0, 10) + '...)' : 'NOT SET');

if (!supabaseUrl || !supabaseKey) {
    console.error('\n❌ Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debug() {
    // Try different table name variations
    const tableNames = [
        'Contractor_Tracker',
        '"Contractor_Tracker"',
        'contractor_tracker'
    ];

    for (const tableName of tableNames) {
        console.log(`\n--- Testing table: ${tableName} ---`);
        try {
            const { data, error, count } = await supabase
                .from(tableName.replace(/"/g, ''))
                .select('*', { count: 'exact' });

            if (error) {
                console.log('Error:', error.message);
                console.log('Error code:', error.code);
                console.log('Error details:', error.details);
            } else {
                console.log('✅ Success! Row count:', data?.length || 0);
                if (data && data.length > 0) {
                    console.log('Columns:', Object.keys(data[0]).join(', '));
                    console.log('\nFirst row:');
                    console.log(JSON.stringify(data[0], null, 2));
                }
            }
        } catch (e) {
            console.log('Exception:', e.message);
        }
    }

    // Also try to list all tables
    console.log('\n--- Checking RLS policies ---');
    const { data: testData, error: testError } = await supabase
        .from('Contractor_Tracker')
        .select('Contractor')
        .limit(1);

    if (testError) {
        console.log('RLS check error:', testError.message);
        if (testError.message.includes('permission') || testError.message.includes('RLS')) {
            console.log('\n⚠️  This might be a Row Level Security (RLS) issue.');
            console.log('Please check if RLS is enabled on the Contractor_Tracker table.');
        }
    } else {
        console.log('RLS check passed, data:', testData);
    }
}

debug();
