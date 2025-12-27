
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 1. Load env vars
const envPath = path.resolve(__dirname, '../.env.local');
let supabaseUrl = '';
let supabaseKey = '';

try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split(/\r?\n/);
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const equalsIndex = trimmed.indexOf('=');
        if (equalsIndex > 0) {
            const key = trimmed.substring(0, equalsIndex).trim();
            const value = trimmed.substring(equalsIndex + 1).trim().replace(/^["']|["']$/g, '');
            if (key === 'NEXT_PUBLIC_SUPABASE_URL') supabaseUrl = value;
            if (key === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') supabaseKey = value;
        }
    }
} catch (e) {
    console.error('Error reading .env.local');
}

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing credentials. Please check your .env.local file.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    console.log('--- SUPABASE INTEGRATION HEALTH CHECK ---');
    let allPassed = true;

    // Helper function to test a table
    async function testTable(tableName, label) {
        process.stdout.write(`Testing ${label} ('${tableName}')... `);
        const { data, error, count } = await supabase
            .from(tableName)
            .select('*', { count: 'exact', head: true }); // Head request for speed

        if (error) {
            console.log('❌ FAILED');
            console.error(`   Error: ${error.message}`);
            allPassed = false;
        } else {
            console.log(`✅ OK (Count: ${count !== null ? count : 'Unknown'})`);
        }
    }

    // 1. Assets
    await testTable('mb_assets', 'Assets');

    // 2. AMC Contractors (Summary)
    await testTable('amc_contractor_summary', 'Contractors');

    // 3. Electricity Meters
    await testTable('electricity_meters', 'Electricity');

    // 4. STP Operations
    await testTable('stp_operations', 'STP');

    // 5. Water System
    await testTable('Water System', 'Water');

    console.log('\n--- DIAGNOSTIC COMPLETE ---');
    if (allPassed) {
        console.log('✅ BACKEND LINK: HEALTHY. All tables are accessible.');
    } else {
        console.log('⚠️ BACKEND LINK: ISSUES DETECTED. See above for details.');
    }
}

test();
