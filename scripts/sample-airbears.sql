-- Sample AirBears Data for AirBear PWA
-- Run this in your Supabase SQL Editor to populate sample AirBears

-- Insert Sample AirBears
INSERT INTO public.airbears (id, current_spot_id, latitude, longitude, battery_level, is_available, is_charging, heading) VALUES
('airbear-001', 'court-street-downtown', 42.099118, -75.917538, 85, true, false, 45.5),
('airbear-002', 'riverwalk-bu-center', 42.098765, -75.916543, 92, true, false, 123.8),
('airbear-003', 'confluence-park', 42.090123, -75.912345, 67, false, false, 270.2),
('airbear-004', 'southside-walking-bridge', 42.091409, -75.914568, 100, false, true, 0.0),
('airbear-005', 'general-hospital', 42.086741, -75.915711, 78, true, false, 180.5),
('airbear-006', 'mcarthur-park', 42.086165, -75.926153, 55, true, false, 315.7),
('airbear-007', 'vestal-center', 42.091851, -75.951729, 93, true, false, 90.3),
('airbear-008', 'innovation-park', 42.093877, -75.958331, 41, false, false, 22.1)
ON CONFLICT (id) DO NOTHING;

-- Create a function to update AirBear location
CREATE OR REPLACE FUNCTION update_airbear_location(
  p_airbear_id TEXT,
  p_latitude DECIMAL,
  p_longitude DECIMAL,
  p_battery_level INTEGER DEFAULT NULL,
  p_is_available BOOLEAN DEFAULT NULL,
  p_is_charging BOOLEAN DEFAULT NULL,
  p_heading DECIMAL DEFAULT NULL
)
RETURNS TABLE (
  success BOOLEAN,
  message TEXT,
  airbear_id TEXT
) AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE public.airbears 
  SET 
    latitude = p_latitude,
    longitude = p_longitude,
    battery_level = COALESCE(p_battery_level, battery_level),
    is_available = COALESCE(p_is_available, is_available),
    is_charging = COALESCE(p_is_charging, is_charging),
    heading = COALESCE(p_heading, heading),
    updated_at = NOW()
  WHERE id = p_airbear_id;
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  
  RETURN QUERY SELECT 
    (updated_count > 0) as success,
    CASE 
      WHEN updated_count > 0 THEN 'AirBear location updated successfully'
      ELSE 'AirBear not found or no changes made'
    END as message,
    p_airbear_id as airbear_id;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to airbears table
DROP TRIGGER IF EXISTS update_airbears_updated_at ON public.airbears;
CREATE TRIGGER update_airbears_updated_at
    BEFORE UPDATE ON public.airbears
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create driver users and assign AirBears
-- First, create driver profiles (these would normally be created via auth signup)
INSERT INTO public.users (id, email, username, full_name, role, assigned_airbear_id) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'driver1@airbear.me', 'driver1', 'Alex Driver', 'driver', 'airbear-001'),
('550e8400-e29b-41d4-a716-446655440002', 'driver2@airbear.me', 'driver2', 'Sam Driver', 'driver', 'airbear-002'),
('550e8400-e29b-41d4-a716-446655440003', 'driver3@airbear.me', 'driver3', 'Jordan Driver', 'driver', 'airbear-005'),
('550e8400-e29b-41d4-a716-446655440004', 'driver4@airbear.me', 'driver4', 'Casey Driver', 'driver', 'airbear-006'),
('550e8400-e29b-41d4-a716-446655440005', 'driver5@airbear.me', 'driver5', 'Morgan Driver', 'driver', 'airbear-007')
ON CONFLICT (id) DO NOTHING;

-- Add RLS policy for drivers to update their assigned airbear location
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Drivers can update their airbear location') THEN
    CREATE POLICY "Drivers can update their airbear location" ON public.airbears
      FOR UPDATE USING (
        EXISTS (
          SELECT 1 FROM public.users 
          WHERE users.id = auth.uid() 
          AND users.role = 'driver' 
          AND users.assigned_airbear_id = airbears.id
        )
      );
  END IF;
END $$;

-- Grant execute permission on the function to authenticated users
GRANT EXECUTE ON FUNCTION update_airbear_location TO authenticated;

-- Create a view for available AirBears with driver info
CREATE OR REPLACE VIEW available_airbears_with_drivers AS
SELECT 
  a.id,
  a.latitude,
  a.longitude,
  a.battery_level,
  a.is_available,
  a.is_charging,
  a.heading,
  a.current_spot_id,
  s.name as current_spot_name,
  u.username as driver_username,
  u.full_name as driver_name,
  a.updated_at
FROM public.airbears a
LEFT JOIN public.spots s ON a.current_spot_id = s.id
LEFT JOIN public.users u ON u.assigned_airbear_id = a.id
WHERE a.is_available = true AND a.is_charging = false;

-- Grant select permission on the view
GRANT SELECT ON available_airbears_with_drivers TO authenticated, anon;

COMMIT;
