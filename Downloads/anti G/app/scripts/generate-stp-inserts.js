// Script to generate SQL INSERT statements from STP CSV data
// Run: node scripts/generate-stp-inserts.js > sql/stp_operations_data.sql

const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '../app/stp/STPOperation_export (1).csv');
const csv = fs.readFileSync(csvPath, 'utf-8');
const lines = csv.trim().split('\n');

// Skip header
const dataLines = lines.slice(1);

console.log('-- STP Operations Data Insert Statements');
console.log('-- Generated from STPOperation_export (1).csv');
console.log('-- Total records: ' + dataLines.length);
console.log('');
console.log('INSERT INTO stp_operations (date, inlet_sewage, tse_for_irrigation, tanker_trips, generated_income, water_savings, total_impact, monthly_volume_input, monthly_volume_output, monthly_income, monthly_savings, original_id) VALUES');

const values = [];

dataLines.forEach((line, idx) => {
    // Parse CSV line (handle quoted values)
    const parts = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
    const cleanParts = parts.map(p => p.replace(/^"|"$/g, '').trim());

    const [
        date, inlet_sewage, tse_for_irrigation, tanker_trips,
        generated_income, water_savings, total_impact,
        monthly_volume_input, monthly_volume_output, monthly_income, monthly_savings,
        original_id
    ] = cleanParts;

    // Convert empty strings to NULL
    const toNum = (v) => v === '' ? 'NULL' : v;
    const toStr = (v) => v === '' ? 'NULL' : `'${v}'`;

    const row = `('${date}', ${toNum(inlet_sewage)}, ${toNum(tse_for_irrigation)}, ${toNum(tanker_trips)}, ${toNum(generated_income)}, ${toNum(water_savings)}, ${toNum(total_impact)}, ${toNum(monthly_volume_input)}, ${toNum(monthly_volume_output)}, ${toNum(monthly_income)}, ${toNum(monthly_savings)}, ${toStr(original_id)})`;

    values.push(row);
});

// Print in batches of 50 for better performance
const batchSize = 50;
for (let i = 0; i < values.length; i += batchSize) {
    const batch = values.slice(i, i + batchSize);
    if (i > 0) {
        console.log(',');
    }
    console.log(batch.join(',\n'));
}

console.log(';');
console.log('');
console.log('-- Verify inserted data');
console.log('SELECT COUNT(*) as total_records, MIN(date) as earliest_date, MAX(date) as latest_date FROM stp_operations;');
