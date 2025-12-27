
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
    console.log('--- TEST PRICING START ---');

    const { data, error } = await supabase
        .from('amc_pricing')
        .select('*');

    if (error) {
        console.log('PRICING_ERROR:', JSON.stringify(error, null, 2));
    } else {
        console.log('PRICING_SUCCESS: Found ' + data.length + ' records');
        console.log('Sample:', data[0]);
    }

    console.log('--- TEST PRICING END ---');
}

test();
