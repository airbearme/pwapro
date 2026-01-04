import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fofmrqgcidfenbevayrg.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvZm1ycWdjaWRmZW5iZXZheXJnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzYzNDcyOCwiZXhwIjoyMDc5MjEwNzI4fQ.89Y4IOCpB-Ky1qjTJLmotMBe8RqQyN8bk6Xp5F43MMA';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function addMissingColumns() {
  console.log('🔧 Adding missing columns to rides table...');
  
  try {
    // First, let's see what columns currently exist
    const { data: existingRide, error: selectError } = await supabase
      .from('rides')
      .select('*')
      .limit(1);
    
    if (selectError) {
      console.log('Error selecting from rides:', selectError);
      return;
    }
    
    if (existingRide && existingRide.length > 0) {
      console.log('✅ Current columns:', Object.keys(existingRide[0]));
    }
    
    // Add dropoff_spot_id column if it doesn't exist
    console.log('🔧 Adding dropoff_spot_id column...');
    
    // Use raw SQL to add the column
    const { data: sqlResult, error: sqlError } = await supabase
      .from('rides')
      .select('id')
      .limit(1);
    
    // Since we can't directly execute DDL via the client, let's provide the exact SQL
    console.log('📋 Please run this SQL in your Supabase Dashboard (Database → SQL Editor):');
    console.log(`
-- Add the missing dropoff_spot_id column
ALTER TABLE rides ADD COLUMN dropoff_spot_id TEXT REFERENCES public.spots(id);

-- Also add distance column if it doesn't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'rides' AND column_name = 'distance'
  ) THEN
    ALTER TABLE rides ADD COLUMN distance DECIMAL(8,2);
  END IF;
END $$;

-- Verify the table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'rides' 
ORDER BY ordinal_position;
    `);
    
    // Test the booking after the user runs the SQL
    console.log('\n🧪 After running the SQL, test with this:');
    console.log('1. Go to https://airbear.me/book');
    console.log('2. Try to book a ride');
    console.log('3. If it works, the issue is fixed!');
    
  } catch (error) {
    console.error('Error adding columns:', error);
  }
}

addMissingColumns();
