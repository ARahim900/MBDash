-- STP Operations Table for Supabase
-- Run this SQL in your Supabase SQL Editor

-- Drop table if exists (uncomment if needed)
-- DROP TABLE IF EXISTS stp_operations;

-- Create the STP Operations table
CREATE TABLE IF NOT EXISTS stp_operations (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    inlet_sewage NUMERIC,
    tse_for_irrigation NUMERIC,
    tanker_trips INTEGER,
    generated_income NUMERIC,
    water_savings NUMERIC,
    total_impact NUMERIC,
    monthly_volume_input NUMERIC,
    monthly_volume_output NUMERIC,
    monthly_income NUMERIC,
    monthly_savings NUMERIC,
    original_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on date for efficient queries
CREATE INDEX IF NOT EXISTS idx_stp_operations_date ON stp_operations(date);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE stp_operations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access for anonymous users
CREATE POLICY "Allow anonymous read access" ON stp_operations
    FOR SELECT USING (true);
