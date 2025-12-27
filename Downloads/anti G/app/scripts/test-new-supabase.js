// Test script to verify the NEW Supabase tables
// Run with: node scripts/test-new-supabase.js

const { createClient } = require('@supabase/supabase-js');

// NEW Supabase credentials
const supabaseUrl = 'https://utnlgeuqajmwibqmdmgt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0bmxnZXVxYWptd2licW1kbWd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3ODUzMDAsImV4cCI6MjA4MTM2MTMwMH0.W7SuJF5Ka0IhkCz4RwfaGuEboVrmR2tK9FqTxBb7kxM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    console.log('========================================');
    console.log('Testing NEW AMC Contractor Tables');
    console.log('Project: utnlgeuqajmwibqmdmgt');
    console.log('========================================\n');

    // Test 1: Check amc_contractor_summary table
    console.log('1. Testing amc_contractor_summary table...');
    const { data: summary, error: summaryError } = await supabase
        .from('amc_contractor_summary')
        .select('*')
        .limit(5);

    if (summaryError) {
        console.log('   ❌ Error:', summaryError.message);
    } else {
        console.log('   ✅ amc_contractor_summary accessible');
        console.log('   Records found:', summary?.length || 0);
        if (summary && summary.length > 0) {
            console.log('   First contractor:', summary[0].contractor);
        }
    }

    // Test 2: Check amc_contractor_details table
    console.log('\n2. Testing amc_contractor_details table...');
    const { data: details, error: detailsError } = await supabase
        .from('amc_contractor_details')
        .select('*')
        .limit(5);

    if (detailsError) {
        console.log('   ❌ Error:', detailsError.message);
    } else {
        console.log('   ✅ amc_contractor_details accessible');
        console.log('   Records found:', details?.length || 0);
    }

    // Test 3: Check amc_contractor_expiry table
    console.log('\n3. Testing amc_contractor_expiry table...');
    const { data: expiry, error: expiryError } = await supabase
        .from('amc_contractor_expiry')
        .select('*')
        .limit(5);

    if (expiryError) {
        console.log('   ❌ Error:', expiryError.message);
    } else {
        console.log('   ✅ amc_contractor_expiry accessible');
        console.log('   Records found:', expiry?.length || 0);
    }

    // Test 4: Check amc_contractor_pricing table
    console.log('\n4. Testing amc_contractor_pricing table...');
    const { data: pricing, error: pricingError } = await supabase
        .from('amc_contractor_pricing')
        .select('*')
        .limit(5);

    if (pricingError) {
        console.log('   ❌ Error:', pricingError.message);
    } else {
        console.log('   ✅ amc_contractor_pricing accessible');
        console.log('   Records found:', pricing?.length || 0);
    }

    console.log('\n========================================');
    console.log('Summary:');
    console.log('  amc_contractor_summary:', summary?.length || 0, 'records');
    console.log('  amc_contractor_details:', details?.length || 0, 'records');
    console.log('  amc_contractor_expiry:', expiry?.length || 0, 'records');
    console.log('  amc_contractor_pricing:', pricing?.length || 0, 'records');
    console.log('========================================');
}

testConnection().catch(console.error);
