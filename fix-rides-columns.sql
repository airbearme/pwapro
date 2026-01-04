-- Fix rides table schema - Add missing columns
-- Run this in Supabase SQL Editor

-- Add missing columns to rides table
ALTER TABLE public.rides 
ADD COLUMN IF NOT EXISTS airbear_id TEXT REFERENCES public.airbears(id);

ALTER TABLE public.rides 
ADD COLUMN IF NOT EXISTS distance_km DECIMAL(10, 2);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_rides_airbear_id ON public.rides(airbear_id);
CREATE INDEX IF NOT EXISTS idx_rides_user_id ON public.rides(user_id);
CREATE INDEX IF NOT EXISTS idx_rides_status ON public.rides(status);

-- Update RLS policies to handle new columns
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

-- Verify the changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'rides' AND table_schema = 'public'
ORDER BY ordinal_position;
