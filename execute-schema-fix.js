import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fofmrqgcidfenbevayrg.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvZm1ycWdjaWRmZW5iZXZheXJnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzYzNDcyOCwiZXhwIjoyMDc5MjEwNzI4fQ.89Y4IOCpB-Ky1qjTJLmotMBe8RqQyN8bk6Xp5F43MMA';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function executeSchemaFix() {
  console.log('🔧 Executing rides table schema fix...');
  
  try {
    // Use raw SQL via PostgREST - we'll use a workaround
    console.log('⚠️  Direct SQL execution not available via client');
    console.log('📋 Please manually run this SQL in Supabase Dashboard:');
    console.log(`
-- Fix rides table schema - Add missing columns
ALTER TABLE public.rides ADD COLUMN IF NOT EXISTS airbear_id TEXT REFERENCES public.airbears(id);
ALTER TABLE public.rides ADD COLUMN IF NOT EXISTS distance_km DECIMAL(10, 2);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_rides_airbear_id ON public.rides(airbear_id);
CREATE INDEX IF NOT EXISTS idx_rides_user_id ON public.rides(user_id);
CREATE INDEX IF NOT EXISTS idx_rides_status ON public.rides(status);
    `);
    
    // Test if we can create a simple ride without the missing columns
    console.log('\n🧪 Testing minimal ride creation...');
    const { data: testRide, error: testError } = await supabase
      .from('rides')
      .insert({
        user_id: '00000000-0000-0000-0000-000000000000',
        pickup_spot_id: 'test-pickup',
        dropoff_spot_id: 'test-destination',
        fare: 4.0,
        status: 'pending'
      })
      .select()
      .single();
    
    if (testError) {
      console.log('❌ Minimal ride test failed:', testError.message);
    } else {
      console.log('✅ Minimal ride works - missing columns confirmed');
      console.log('📋 Working columns:', Object.keys(testRide));
      
      // Clean up
      await supabase.from('rides').delete().eq('id', testRide.id);
    }
    
  } catch (error) {
    console.error('Schema fix execution failed:', error);
  }
}

executeSchemaFix();
