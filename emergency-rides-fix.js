import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fofmrqgcidfenbevayrg.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvZm1ycWdjaWRmZW5iZXZheXJnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzYzNDcyOCwiZXhwIjoyMDc5MjEwNzI4fQ.89Y4IOCpB-Ky1qjTJLmotMBe8RqQyN8bk6Xp5F43MMA';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function emergencyRidesFix() {
  console.log('🚨 EMERGENCY: Fixing rides table schema...');
  
  try {
    // Drop and recreate the rides table
    console.log('\n🗑️  Dropping existing rides table...');
    
    const { error: dropError } = await supabase
      .from('rides')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (dropError && !dropError.message.includes('does not exist')) {
      console.log('Drop error (expected):', dropError.message);
    }
    
    console.log('✅ Please run this SQL immediately in Supabase Dashboard:');
    console.log(`
-- EMERGENCY RIDES TABLE FIX
-- Copy and paste this entire block in Supabase SQL Editor

DROP TABLE IF EXISTS public.rides CASCADE;

CREATE TABLE public.rides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id),
  pickup_spot_id TEXT REFERENCES public.spots(id),
  dropoff_spot_id TEXT REFERENCES public.spots(id),
  airbear_id TEXT REFERENCES public.airbears(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'booked', 'in_progress', 'completed', 'cancelled')),
  fare DECIMAL(10, 2),
  distance_km DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.rides ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own rides') THEN
    CREATE POLICY "Users can view their own rides" ON public.rides
      FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can create their own rides') THEN
    CREATE POLICY "Users can create their own rides" ON public.rides
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_rides_airbear_id ON public.rides(airbear_id);
CREATE INDEX IF NOT EXISTS idx_rides_user_id ON public.rides(user_id);
CREATE INDEX IF NOT EXISTS idx_rides_status ON public.rides(status);
    `);
    
    console.log('\n⏳ After running the SQL, test with: node test-booking-flow.js');
    
  } catch (error) {
    console.error('Emergency fix failed:', error);
  }
}

emergencyRidesFix();
