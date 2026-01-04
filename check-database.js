import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fofmrqgcidfenbevayrg.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvZm1ycWdjaWRmZW5iZXZheXJnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzYzNDcyOCwiZXhwIjoyMDc5MjEwNzI4fQ.89Y4IOCpB-Ky1qjTJLmotMBe8RqQyN8bk6Xp5F43MMA';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function checkDatabaseSchema() {
  console.log('🔍 Checking database schema...');
  
  try {
    // Check if rides table exists
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'rides');
    
    if (tablesError) {
      console.error('Error checking tables:', tablesError);
      return;
    }
    
    console.log('Tables found:', tables);
    
    // Check rides table structure
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_schema', 'public')
      .eq('table_name', 'rides')
      .order('ordinal_position');
    
    if (columnsError) {
      console.error('Error checking columns:', columnsError);
      return;
    }
    
    console.log('Rides table columns:', columns);
    
    // Check if we need to create the table
    if (!columns || columns.length === 0) {
      console.log('🚨 Rides table does not exist. Creating it...');
      
      const { error: createError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS public.rides (
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
      } else {
        console.log('✅ Rides table created successfully!');
      }
    } else {
      console.log('✅ Rides table exists with columns:', columns.map(c => c.column_name));
      
      // Check for missing distance column
      const hasDistance = columns.some(col => col.column_name === 'distance');
      const hasDropoff = columns.some(col => col.column_name === 'dropoff_spot_id');
      
      if (!hasDistance) {
        console.log('🔧 Adding missing distance column...');
        const { error: addDistanceError } = await supabase.rpc('exec_sql', {
          sql: 'ALTER TABLE rides ADD COLUMN distance DECIMAL(8,2);'
        });
        
        if (addDistanceError) {
          console.error('Error adding distance column:', addDistanceError);
        } else {
          console.log('✅ Distance column added!');
        }
      }
      
      if (!hasDropoff) {
        console.log('🔧 Adding missing dropoff_spot_id column...');
        const { error: addDropoffError } = await supabase.rpc('exec_sql', {
          sql: 'ALTER TABLE rides ADD COLUMN dropoff_spot_id TEXT REFERENCES public.spots(id);'
        });
        
        if (addDropoffError) {
          console.error('Error adding dropoff_spot_id column:', addDropoffError);
        } else {
          console.log('✅ Dropoff spot column added!');
        }
      }
    }
    
  } catch (error) {
    console.error('Database check failed:', error);
  }
}

checkDatabaseSchema();
