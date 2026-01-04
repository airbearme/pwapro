-- Complete rides table recreation with all required columns
-- Run this in Supabase SQL Editor to fix booking errors

-- Drop existing table (will be recreated)
DROP TABLE IF EXISTS public.rides CASCADE;

-- Recreate rides table with correct schema
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

-- Enable Row Level Security
ALTER TABLE public.rides ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Rides
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

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_rides_airbear_id ON public.rides(airbear_id);
CREATE INDEX IF NOT EXISTS idx_rides_user_id ON public.rides(user_id);
CREATE INDEX IF NOT EXISTS idx_rides_status ON public.rides(status);
CREATE INDEX IF NOT EXISTS idx_rides_pickup_spot ON public.rides(pickup_spot_id);
CREATE INDEX IF NOT EXISTS idx_rides_dropoff_spot ON public.rides(dropoff_spot_id);

-- Verify the table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'rides' AND table_schema = 'public'
ORDER BY ordinal_position;
