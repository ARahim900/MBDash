// Script to discover all tables and get Contractor_Tracker column info
// Run with: node scripts/discover-contractor-tracker.js

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function discoverSchema() {
    console.log('=== Discovering Available Tables and Contractor_Tracker Schema ===\n');

    // List of possible table name variations to try
    const tableNames = [
        'Contractor_Tracker',
        'contractor_tracker',
        'ContractorTracker',
        'contractortracker',
        'Contractor Tracker',
        'contractor tracker'
    ];

    for (const tableName of tableNames) {
        console.log(`\nTrying table: "${tableName}"...`);
        try {
            const { data, error } = await supabase
                .from(tableName)
                .select('*')
                .limit(1);

            if (error) {
                console.log(`  ❌ Error: ${error.message}`);
                continue;
            }

            console.log(`  ✅ Table found!`);

            if (data && data.length > 0) {
                const columns = Object.keys(data[0]);
                console.log(`\n  Columns (${columns.length}):`);
                columns.forEach((col, i) => {
                    const value = data[0][col];
                    console.log(`    ${i + 1}. ${col}: ${JSON.stringify(value)?.substring(0, 80)}`);
                });
            } else {
                console.log('  Table is empty - attempting to get column info via a test insert...');

                // Try an invalid insert to get column names from error
                const { error: insertError } = await supabase
                    .from(tableName)
                    .insert({ _test_nonexistent_column_: 'test' });

                if (insertError) {
                    console.log(`  Insert attempt returned: ${insertError.message}`);
                    // The error message might reveal column info
                }
            }

            // If we found a valid table, break
            return tableName;

        } catch (err) {
            console.log(`  ❌ Exception: ${err.message}`);
        }
    }

    console.log('\n\nNo matching contractor tracker table found.');
    console.log('Please verify the exact table name in Supabase dashboard.');
}

discoverSchema();
