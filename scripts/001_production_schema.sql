-- AirBear Production Database Schema
-- Version: 1.0.0
-- This script creates all tables needed for the AirBear PWA

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- SPOTS TABLE - 17 GPS locations in Binghamton
-- =====================================================
CREATE TABLE IF NOT EXISTS public.spots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  description TEXT,
  address TEXT,
  amenities TEXT[],
  spot_number INTEGER UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert the 17 Binghamton GPS spots
INSERT INTO public.spots (name, latitude, longitude, description, spot_number, amenities, address) VALUES
  ('Spot 1 - Downtown Transit Hub', 42.0987, -75.9179, 'Main downtown pickup point near the transit center', 1, ARRAY['Covered Waiting', 'Wheelchair Access', 'Real-time Display'], '85 Court St, Binghamton, NY'),
  ('Spot 2 - Binghamton University', 42.0877, -75.9661, 'Main campus entrance at BU', 2, ARRAY['Student Services', 'Bike Racks', 'Food Nearby'], '4400 Vestal Pkwy E, Vestal, NY'),
  ('Spot 3 - Vestal Parkway Plaza', 42.0858, -75.9889, 'Shopping center with multiple stores', 3, ARRAY['Shopping', 'Restaurants', 'Parking'], '2433 Vestal Pkwy E, Vestal, NY'),
  ('Spot 4 - Oakdale Mall Area', 42.1027, -76.0077, 'Near Oakdale Commons shopping', 4, ARRAY['Shopping', 'Entertainment', 'Dining'], '601 Harry L Dr, Johnson City, NY'),
  ('Spot 5 - Johnson City Plaza', 42.1165, -75.9621, 'Main Johnson City commercial area', 5, ARRAY['Retail', 'Services', 'Parking'], '218 Main St, Johnson City, NY'),
  ('Spot 6 - Broome Community College', 42.1187, -75.9167, 'SUNY Broome campus entrance', 6, ARRAY['Education', 'Library', 'Cafeteria'], '907 Front St, Binghamton, NY'),
  ('Spot 7 - Greater Binghamton Airport', 42.2087, -75.9797, 'Airport terminal pickup/dropoff', 7, ARRAY['Airport', 'Rental Cars', '24/7 Service'], '2534 Airport Rd, Johnson City, NY'),
  ('Spot 8 - Chenango Bridge', 42.1432, -75.8623, 'Chenango Bridge shopping area', 8, ARRAY['Shopping', 'Grocery', 'Pharmacy'], '692 NY-12A, Chenango Bridge, NY'),
  ('Spot 9 - Endwell', 42.1141, -76.0210, 'Endwell village center', 9, ARRAY['Residential', 'Parks', 'Schools'], '3211 Watson Blvd, Endwell, NY'),
  ('Spot 10 - Ross Park Zoo', 42.0876, -75.9089, 'Historic zoo and park entrance', 10, ARRAY['Zoo', 'Park', 'Carousel'], '60 Morgan Rd, Binghamton, NY'),
  ('Spot 11 - Recreation Park', 42.1098, -75.9234, 'City recreation area', 11, ARRAY['Sports', 'Playground', 'Pool'], 'Beethoven St, Binghamton, NY'),
  ('Spot 12 - Southside', 42.0821, -75.9098, 'Southside neighborhood hub', 12, ARRAY['Residential', 'Church', 'Community Center'], '89 Walnut St, Binghamton, NY'),
  ('Spot 13 - West Side', 42.1012, -75.9334, 'West side commercial district', 13, ARRAY['Grocery', 'Bank', 'Medical'], '175 Main St, Binghamton, NY'),
  ('Spot 14 - North Side', 42.1156, -75.9089, 'North Binghamton area', 14, ARRAY['Industrial', 'Warehouse', 'Office'], '1 Chenango St, Binghamton, NY'),
  ('Spot 15 - First Ward', 42.0923, -75.9267, 'Historic First Ward neighborhood', 15, ARRAY['Historic', 'Dining', 'Art Gallery'], '83 State St, Binghamton, NY'),
  ('Spot 16 - Town Square Mall', 42.1089, -75.9823, 'Town Square Mall area', 16, ARRAY['Mall', 'Movies', 'Food Court'], '4853 Vestal Pkwy E, Vestal, NY'),
  ('Spot 17 - Riverside Drive', 42.1034, -75.9112, 'Scenic riverside pickup point', 17, ARRAY['Scenic', 'Walking Path', 'River View'], '50 Riverside Dr, Binghamton, NY')
ON CONFLICT (spot_number) DO UPDATE SET
  name = EXCLUDED.name,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  description = EXCLUDED.description,
  amenities = EXCLUDED.amenities,
  address = EXCLUDED.address;

-- Enable RLS for spots
ALTER TABLE public.spots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "spots_read_all" ON public.spots FOR SELECT USING (true);

-- =====================================================
-- AIRBEARS TABLE - Fleet vehicles
-- =====================================================
CREATE TABLE IF NOT EXISTS public.airbears (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100),
  current_spot_id UUID REFERENCES public.spots(id),
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  battery_level INTEGER DEFAULT 100 CHECK (battery_level >= 0 AND battery_level <= 100),
  is_available BOOLEAN DEFAULT true,
  is_charging BOOLEAN DEFAULT false,
  heading DECIMAL(5, 2) DEFAULT 0,
  speed DECIMAL(5, 2) DEFAULT 0,
  driver_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert 5 initial AirBears
INSERT INTO public.airbears (id, name, latitude, longitude, battery_level, is_available, heading) VALUES
  (uuid_generate_v4(), 'AirBear Alpha', 42.0987, -75.9179, 95, true, 45),
  (uuid_generate_v4(), 'AirBear Beta', 42.0877, -75.9661, 87, true, 90),
  (uuid_generate_v4(), 'AirBear Gamma', 42.1165, -75.9621, 72, true, 180),
  (uuid_generate_v4(), 'AirBear Delta', 42.1027, -76.0077, 100, false, 270),
  (uuid_generate_v4(), 'AirBear Epsilon', 42.0876, -75.9089, 45, true, 0)
ON CONFLICT DO NOTHING;

-- Enable RLS for airbears
ALTER TABLE public.airbears ENABLE ROW LEVEL SECURITY;
CREATE POLICY "airbears_read_all" ON public.airbears FOR SELECT USING (true);
CREATE POLICY "airbears_update_driver" ON public.airbears FOR UPDATE USING (
  auth.uid() = driver_id OR 
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('driver', 'admin'))
);

-- =====================================================
-- USERS TABLE - Extended auth.users
-- =====================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(100),
  full_name VARCHAR(255),
  phone VARCHAR(20),
  avatar_url TEXT,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'driver', 'admin')),
  eco_points INTEGER DEFAULT 0,
  total_rides INTEGER DEFAULT 0,
  co2_saved DECIMAL(10, 2) DEFAULT 0,
  has_ceo_tshirt BOOLEAN DEFAULT false,
  assigned_airbear_id UUID REFERENCES public.airbears(id),
  stripe_customer_id VARCHAR(255),
  push_subscription JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_read_own" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_insert_own" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "users_update_own" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "users_admin_all" ON public.users FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- =====================================================
-- RIDES TABLE - Ride bookings
-- =====================================================
CREATE TABLE IF NOT EXISTS public.rides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  driver_id UUID REFERENCES public.users(id),
  airbear_id UUID REFERENCES public.airbears(id),
  pickup_spot_id UUID NOT NULL REFERENCES public.spots(id),
  dropoff_spot_id UUID NOT NULL REFERENCES public.spots(id),
  status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'in_progress', 'completed', 'cancelled')),
  fare DECIMAL(10, 2) NOT NULL,
  distance DECIMAL(10, 2),
  estimated_duration INTEGER, -- in minutes
  payment_method VARCHAR(30) CHECK (payment_method IN ('stripe', 'apple_pay', 'google_pay', 'cash')),
  payment_status VARCHAR(20) DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
  stripe_payment_intent_id VARCHAR(255),
  pickup_time TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for rides
ALTER TABLE public.rides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rides_read_own" ON public.rides FOR SELECT USING (
  auth.uid() = user_id OR auth.uid() = driver_id OR
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('driver', 'admin'))
);
CREATE POLICY "rides_insert_own" ON public.rides FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "rides_update_involved" ON public.rides FOR UPDATE USING (
  auth.uid() = user_id OR auth.uid() = driver_id OR
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('driver', 'admin'))
);

-- =====================================================
-- BODEGA_ITEMS TABLE - Products for sale
-- =====================================================
CREATE TABLE IF NOT EXISTS public.bodega_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  category VARCHAR(100),
  is_eco_friendly BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  stock INTEGER DEFAULT 0,
  stripe_price_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample bodega items
INSERT INTO public.bodega_items (name, description, price, category, is_eco_friendly, stock, image_url) VALUES
  ('Organic Water Bottle', 'Eco-friendly reusable water bottle', 12.99, 'Drinks', true, 50, '/images/bodega/water-bottle.jpg'),
  ('AirBear Energy Bar', 'Sustainable energy snack', 3.99, 'Snacks', true, 100, '/images/bodega/energy-bar.jpg'),
  ('Local Coffee', 'Locally roasted fair-trade coffee', 4.50, 'Drinks', true, 75, '/images/bodega/coffee.jpg'),
  ('Organic Chips', 'Sustainably sourced potato chips', 2.99, 'Snacks', true, 80, '/images/bodega/chips.jpg'),
  ('Bamboo Sunglasses', 'Eco-friendly bamboo frame sunglasses', 24.99, 'Accessories', true, 30, '/images/bodega/sunglasses.jpg'),
  ('Phone Charger', 'Portable solar phone charger', 29.99, 'Electronics', true, 25, '/images/bodega/charger.jpg'),
  ('Granola Bar', 'Organic granola snack bar', 2.49, 'Snacks', true, 120, '/images/bodega/granola.jpg'),
  ('Fresh Fruit Cup', 'Local seasonal fruit cup', 5.99, 'Fresh', true, 40, '/images/bodega/fruit.jpg'),
  ('Iced Tea', 'Organic unsweetened iced tea', 3.49, 'Drinks', true, 60, '/images/bodega/iced-tea.jpg'),
  ('Trail Mix', 'Premium organic trail mix', 4.99, 'Snacks', true, 90, '/images/bodega/trail-mix.jpg')
ON CONFLICT DO NOTHING;

-- Enable RLS for bodega_items
ALTER TABLE public.bodega_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "bodega_items_read_all" ON public.bodega_items FOR SELECT USING (true);
CREATE POLICY "bodega_items_admin_write" ON public.bodega_items FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- =====================================================
-- ORDERS TABLE - Bodega purchases
-- =====================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  ride_id UUID REFERENCES public.rides(id),
  airbear_id UUID REFERENCES public.airbears(id),
  items JSONB NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')),
  payment_method VARCHAR(30),
  stripe_payment_intent_id VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orders_read_own" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "orders_insert_own" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "orders_update_own" ON public.orders FOR UPDATE USING (auth.uid() = user_id);

-- =====================================================
-- PAYMENTS TABLE - All payment records
-- =====================================================
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  ride_id UUID REFERENCES public.rides(id),
  order_id UUID REFERENCES public.orders(id),
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'usd',
  payment_method VARCHAR(30) NOT NULL CHECK (payment_method IN ('stripe', 'apple_pay', 'google_pay', 'cash')),
  stripe_payment_intent_id VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "payments_read_own" ON public.payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "payments_insert_own" ON public.payments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- INDEXES for performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_rides_user_id ON public.rides(user_id);
CREATE INDEX IF NOT EXISTS idx_rides_driver_id ON public.rides(driver_id);
CREATE INDEX IF NOT EXISTS idx_rides_status ON public.rides(status);
CREATE INDEX IF NOT EXISTS idx_airbears_available ON public.airbears(is_available) WHERE is_available = true;
CREATE INDEX IF NOT EXISTS idx_spots_active ON public.spots(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- =====================================================
-- REALTIME subscriptions
-- =====================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.airbears;
ALTER PUBLICATION supabase_realtime ADD TABLE public.rides;

-- =====================================================
-- TRIGGER: Auto-create user profile on signup
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, username, full_name, avatar_url, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture'),
    NEW.phone
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.users.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.users.avatar_url),
    phone = COALESCE(EXCLUDED.phone, public.users.phone),
    updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- TRIGGER: Update AirBear location timestamp
-- =====================================================
CREATE OR REPLACE FUNCTION public.update_airbear_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS airbear_location_update ON public.airbears;
CREATE TRIGGER airbear_location_update
  BEFORE UPDATE ON public.airbears
  FOR EACH ROW
  EXECUTE FUNCTION public.update_airbear_timestamp();
