import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fofmrqgcidfenbevayrg.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvZm1ycWdjaWRmZW5iZXZheXJnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzYzNDcyOCwiZXhwIjoyMDc5MjEwNzI4fQ.89Y4IOCpB-Ky1qjTJLmotMBe8RqQyN8bk6Xp5F43MMA';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function fixRidesSchema() {
  console.log('🔧 Fixing rides table schema...');
  
  try {
    // First, try to insert a ride without airbear_id to see what columns exist
    console.log('\n🧪 Testing current schema...');
    const { data: testRide, error: testError } = await supabase
      .from('rides')
      .insert({
        user_id: '00000000-0000-0000-0000-000000000000',
        pickup_spot_id: 'test-pickup',
        dropoff_spot_id: 'test-destination',
        fare: 4.0,
        distance_km: 1.5,
        status: 'pending'
      })
      .select()
      .single();
    
    if (testError) {
      console.log('❌ Current schema error:', testError.message);
      
      if (testError.message.includes('column') && testError.message.includes('does not exist')) {
        console.log('🔧 Missing columns detected. Adding airbear_id column...');
        
        // Add the missing airbear_id column
        const { error: alterError } = await supabase
          .from('rides')
          .select('id')
          .limit(1);
        
        if (alterError && !alterError.message.includes('does not exist')) {
          console.log('ℹ️  Table exists, need to add column via SQL');
          console.log(`
📋 Please run this SQL in Supabase Dashboard:

ALTER TABLE public.rides 
ADD COLUMN airbear_id TEXT REFERENCES public.airbears(id);

-- Also add index for performance
CREATE INDEX IF NOT EXISTS idx_rides_airbear_id ON public.rides(airbear_id);
          `);
        }
      }
    } else {
      console.log('✅ Test ride created successfully');
      console.log('📋 Columns that work:', Object.keys(testRide));
      
      // Clean up
      await supabase.from('rides').delete().eq('id', testRide.id);
      console.log('🧹 Test data cleaned up');
    }
    
  } catch (error) {
    console.error('Schema fix failed:', error);
  }
}

fixRidesSchema();
