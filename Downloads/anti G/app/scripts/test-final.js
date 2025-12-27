
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

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
} catch (e) { }

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    const results = [];
    results.push('--- START ---');

    // Test AMC Contracts
    const { data, error } = await supabase
        .from('amc_contracts')
        .select('*');

    if (error) {
        results.push('AMC_CONTRACTS_ERROR: ' + JSON.stringify(error));
    } else {
        results.push('AMC_CONTRACTS_SUCCESS: Found ' + data.length + ' records');
    }

    results.push('--- END ---');
    fs.writeFileSync(path.resolve(__dirname, 'result.txt'), results.join('\n'));
}

test();
