import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fofmrqgcidfenbevayrg.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvZm1ycWdjaWRmZW5iZXZheXJnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzYzNDcyOCwiZXhwIjoyMDc5MjEwNzI4fQ.89Y4IOCpB-Ky1qjTJLmotMBe8RqQyN8bk6Xp5F43MMA';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function fixRidesTable() {
  console.log('🔧 Fixing rides table...');
  
  try {
    // Try to query the rides table to see if it exists
    const { data: rides, error: ridesError } = await supabase
      .from('rides')
      .select('*')
      .limit(1);
    
    if (ridesError) {
      console.log('🚨 Rides table error:', ridesError);
      
      if (ridesError.message.includes('relation "public.rides" does not exist')) {
        console.log('🔨 Creating rides table...');
        
        // Create the rides table using raw SQL
        const { error: createError } = await supabase
          .rpc('exec_sql', {
            sql: `
              CREATE TABLE public.rides (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                user_id UUID REFERENCES public.users(id),
                pickup_spot_id TEXT REFERENCES public.spots(id),
                dropoff_spot_id TEXT REFERENCES public.spots(id),
                airbear_id TEXT REFERENCES public.airbears(id),
                status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'booked', 'in_progress', 'completed', 'cancelled')),
                fare DECIMAL(10, 2),
                distance DECIMAL(8, 2),
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
            `
          });
        
        if (createError) {
          console.error('Error creating rides table:', createError);
          
          // Try direct SQL approach
          console.log('🔄 Trying direct SQL approach...');
          const { data: sqlResult, error: sqlError } = await supabase
            .from('rides')
            .select('id')
            .limit(1);
            
          if (sqlError && sqlError.message.includes('does not exist')) {
            console.log('📋 Please run this SQL manually in Supabase Dashboard:');
            console.log(`
-- Create rides table
CREATE TABLE public.rides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id),
  pickup_spot_id TEXT REFERENCES public.spots(id),
  dropoff_spot_id TEXT REFERENCES public.spots(id),
  airbear_id TEXT REFERENCES public.airbears(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'booked', 'in_progress', 'completed', 'cancelled')),
  fare DECIMAL(10, 2),
  distance DECIMAL(8, 2),
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
            `);
          } else {
            console.log('✅ Rides table might exist or was created');
          }
        } else {
          console.log('✅ Rides table created successfully!');
        }
      } else {
        console.log('🤔 Other error:', ridesError);
      }
    } else {
      console.log('✅ Rides table exists!');
      
      // Check if it has the right columns
      if (rides && rides.length > 0) {
        console.log('✅ Rides table columns:', Object.keys(rides[0]));
      }
      
      // Try to insert a test ride to verify structure
      const { data: testRide, error: testError } = await supabase
        .from('rides')
        .insert({
          user_id: '00000000-0000-0000-0000-000000000000', // dummy user ID for testing
          pickup_spot_id: 'test-pickup',
          dropoff_spot_id: 'test-dropoff',
          fare: 4.00,
          distance: 1.5,
          status: 'pending'
        })
        .select()
        .single();
      
      if (testError) {
        console.log('🔍 Test insert error:', testError);
        
        if (testError.message.includes('column') && testError.message.includes('does not exist')) {
          console.log('🔧 Missing column detected. Please check table structure.');
        }
      } else {
        console.log('✅ Test ride created successfully!');
        
        // Clean up test ride
        await supabase
          .from('rides')
          .delete()
          .eq('id', testRide.id);
      }
    }
    
  } catch (error) {
    console.error('Database fix failed:', error);
  }
}

fixRidesTable();
