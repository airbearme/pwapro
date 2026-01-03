-- Create 16 Numbered Spots + 1 Merchandise Spot for AirBear PWA
-- Run this in your Supabase SQL Editor to populate spots

-- Clear existing spots to ensure clean setup
DELETE FROM public.spots;

-- Insert 16 numbered ride spots
INSERT INTO public.spots (id, name, latitude, longitude, description, amenities, is_active) VALUES
-- Spot 1-8: Core Downtown Area
('spot-01', 'Spot 1 - Court Street Downtown', 42.099118, -75.917538, 'Main downtown pickup location near shops and restaurants', ARRAY['shelter', 'lighting', 'bench'], true),
('spot-02', 'Spot 2 - Riverwalk BU Center', 42.098765, -75.916543, 'Binghamton University area pickup', ARRAY['shelter', 'lighting', 'bench', 'wifi'], true),
('spot-03', 'Spot 3 - Confluence Park', 42.090123, -75.912345, 'Scenic park location with river views', ARRAY['shelter', 'lighting', 'bench', 'water'], true),
('spot-04', 'Spot 4 - Southside Walking Bridge', 42.091409, -75.914568, 'Pedestrian bridge access point', ARRAY['lighting', 'bench'], true),
('spot-05', 'Spot 5 - General Hospital', 42.086741, -75.915711, 'Medical center pickup location', ARRAY['shelter', 'lighting', 'bench', 'wheelchair-access'], true),
('spot-06', 'Spot 6 - McArthur Park', 42.086165, -75.926153, 'Recreation area with parking', ARRAY['shelter', 'lighting', 'bench', 'parking'], true),
('spot-07', 'Spot 7 - Vestal Center', 42.091851, -75.951729, 'Vestal shopping district', ARRAY['shelter', 'lighting', 'bench', 'parking'], true),
('spot-08', 'Spot 8 - Innovation Park', 42.093877, -75.958331, 'Tech park and business district', ARRAY['shelter', 'lighting', 'bench', 'wifi', 'parking'], true),

-- Spot 9-12: Extended Coverage
('spot-09', 'Spot 9 - Binghamton Plaza', 42.102345, -75.923456, 'Shopping plaza with multiple stores', ARRAY['shelter', 'lighting', 'bench', 'parking'], true),
('spot-10', 'Spot 10 - Oakdale Mall', 42.104567, -75.934567, 'Regional shopping mall', ARRAY['shelter', 'lighting', 'bench', 'parking', 'indoor-waiting'], true),
('spot-11', 'Spot 11 - SUNY Broome', 42.098765, -75.945678, 'Community college campus', ARRAY['shelter', 'lighting', 'bench', 'wifi'], true),
('spot-12', 'Spot 12 - Johnson City', 42.115678, -75.956789, 'Johnson City downtown area', ARRAY['shelter', 'lighting', 'bench'], true),

-- Spot 13-16: Outer Coverage
('spot-13', 'Spot 13 - Endicott', 42.123456, -75.967890, 'Endicott business district', ARRAY['shelter', 'lighting', 'bench', 'parking'], true),
('spot-14', 'Spot 14 - Union Center', 42.078901, -75.923456, 'Union shopping and dining', ARRAY['shelter', 'lighting', 'bench', 'parking'], true),
('spot-15', 'Spot 15 - Kirkwood', 42.089012, -75.934567, 'Kirkwood community area', ARRAY['shelter', 'lighting', 'bench'], true),
('spot-16', 'Spot 16 - Port Dickinson', 42.067890, -75.945678, 'Port Dickinson residential area', ARRAY['lighting', 'bench'], true),

-- Merchandise Only Spot (Not for rides)
('merchandise-spot', '🛍️ AirBear Merchandise Shop', 42.098700, -75.917000, 'Official AirBear merchandise and apparel store - Visit for exclusive gear!', ARRAY['indoor-shopping', 'fitting-rooms', 'parking', 'atm'], true);

-- Update AirBears to use new spot IDs
UPDATE public.airbears SET current_spot_id = 'spot-01' WHERE id = 'airbear-001';
UPDATE public.airbears SET current_spot_id = 'spot-02' WHERE id = 'airbear-002';
UPDATE public.airbears SET current_spot_id = 'spot-03' WHERE id = 'airbear-003';
UPDATE public.airbears SET current_spot_id = 'spot-04' WHERE id = 'airbear-004';
UPDATE public.airbears SET current_spot_id = 'spot-05' WHERE id = 'airbear-005';
UPDATE public.airbears SET current_spot_id = 'spot-06' WHERE id = 'airbear-006';
UPDATE public.airbears SET current_spot_id = 'spot-07' WHERE id = 'airbear-007';
UPDATE public.airbears SET current_spot_id = 'spot-08' WHERE id = 'airbear-008';

-- Create a view for ride spots only (excludes merchandise)
CREATE OR REPLACE VIEW ride_spots AS
SELECT id, name, latitude, longitude, description, amenities, is_active, created_at
FROM public.spots
WHERE id != 'merchandise-spot' AND is_active = true;

-- Create a view for merchandise spot
CREATE OR REPLACE VIEW merchandise_spots AS
SELECT id, name, latitude, longitude, description, amenities, is_active, created_at
FROM public.spots
WHERE id = 'merchandise-spot' AND is_active = true;

-- Add comments for clarity
COMMENT ON VIEW ride_spots IS 'View of 16 numbered spots available for ride booking';
COMMENT ON VIEW merchandise_spots IS 'View of merchandise-only spot for shopping';

-- Success message
SELECT 'Successfully created 16 numbered ride spots + 1 merchandise spot' as setup_status;
