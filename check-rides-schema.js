import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fofmrqgcidfenbevayrg.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvZm1ycWdjaWRmZW5iZXZheXJnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzYzNDcyOCwiZXhwIjoyMDc5MjEwNzI4fQ.89Y4IOCpB-Ky1qjTJLmotMBe8RqQyN8bk6Xp5F43MMA';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function checkRidesSchema() {
  console.log('🔍 Checking rides table schema...');
  
  try {
    // Get column information
    const { data, error } = await supabase
      .from('rides')
      .select('*')
      .limit(0);
    
    if (error) {
      console.error('Error:', error);
      return;
    }
    
    // Try to get a sample ride to see actual columns
    const { data: sampleRide, error: sampleError } = await supabase
      .from('rides')
      .select('*')
      .limit(1);
    
    if (sampleError && !sampleError.message.includes('does not exist')) {
      console.log('Sample error (expected if no rides):', sampleError.message);
    }
    
    if (sampleRide && sampleRide.length > 0) {
      console.log('📋 Rides table columns:', Object.keys(sampleRide[0]));
      console.log('📄 Sample ride:', sampleRide[0]);
    } else {
      console.log('ℹ️  No rides in table, checking schema via information_schema...');
      
      // Check information schema
      const { data: columns, error: columnError } = await supabase
        .rpc('exec_sql', {
          sql: `
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'rides' AND table_schema = 'public'
            ORDER BY ordinal_position
          `
        });
      
      if (columnError) {
        console.error('Column check error:', columnError);
      } else {
        console.log('📋 Rides table columns from information_schema:', columns);
      }
    }
    
  } catch (error) {
    console.error('Schema check failed:', error);
  }
}

checkRidesSchema();
