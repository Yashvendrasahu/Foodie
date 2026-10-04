-- =========================================================================
-- FOODIE SURPLUS FOOD RESCUE PLATFORM - REAL PRODUCTION SUPABASE SCHEMA
-- Execute this script in your Supabase Project's SQL Editor:
-- (Supabase Dashboard -> Project -> SQL Editor -> New Query -> Run)
-- =========================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES / USERS TABLE (Linked with Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'diner' CHECK (role IN ('diner', 'partner', 'admin')),
  restaurant_name TEXT,
  fssai_license TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
  kyc_status TEXT DEFAULT 'verified',
  meals_rescued INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Backward-compatibility view/table for applet queries
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'diner',
  kyc_status TEXT DEFAULT 'Verified',
  status TEXT DEFAULT 'Active',
  meals_rescued INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger: Automatically create public.profiles when a new user signs up in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, phone, restaurant_name, fssai_license)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'role', 'diner'),
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'restaurant_name',
    new.raw_user_meta_data->>'fssai_license'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone,
    restaurant_name = EXCLUDED.restaurant_name,
    fssai_license = EXCLUDED.fssai_license,
    updated_at = NOW();

  INSERT INTO public.users (id, name, email, phone, role, kyc_status, status)
  VALUES (
    new.id::text,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    COALESCE(new.raw_user_meta_data->>'phone', '+91 98765 43210'),
    COALESCE(new.raw_user_meta_data->>'role', 'diner'),
    'Verified',
    'Active'
  )
  ON CONFLICT (email) DO UPDATE SET
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    updated_at = NOW();

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2. MEALS TABLE (Surplus batches from commercial kitchens)
CREATE TABLE IF NOT EXISTS public.meals (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  sub_title TEXT,
  restaurant TEXT NOT NULL,
  restaurant_address TEXT NOT NULL,
  rating NUMERIC(2,1) DEFAULT 4.8,
  review_count INTEGER DEFAULT 0,
  category TEXT NOT NULL,
  original_price NUMERIC(10,2) NOT NULL,
  rescue_price NUMERIC(10,2) NOT NULL,
  discount TEXT NOT NULL,
  pickup_window TEXT NOT NULL,
  pickup_counter TEXT DEFAULT 'Takeaway Counter #1',
  portion_count INTEGER NOT NULL DEFAULT 1,
  portions_count INTEGER DEFAULT 1,
  image TEXT NOT NULL,
  fssai_verified BOOLEAN DEFAULT TRUE,
  fssai_number TEXT DEFAULT 'FSSAI #1001901100234',
  dietary_type TEXT DEFAULT 'Veg',
  co2_saved_kg NUMERIC(4,1) DEFAULT 2.1,
  status TEXT DEFAULT 'Available',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BOOKINGS TABLE (Customer reservations & pickup tokens)
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY,
  token_code TEXT NOT NULL UNIQUE,
  otp TEXT NOT NULL,
  meal_id TEXT REFERENCES public.meals(id) ON DELETE SET NULL,
  meal_title TEXT NOT NULL,
  sub_title TEXT,
  restaurant_name TEXT NOT NULL,
  restaurant_address TEXT NOT NULL,
  pickup_counter TEXT DEFAULT 'Takeaway Counter #1',
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  customer_rescue_tier TEXT DEFAULT 'Level 3 Rescuer',
  portions INTEGER NOT NULL DEFAULT 1,
  original_amount NUMERIC(10,2) NOT NULL,
  meal_subtotal NUMERIC(10,2) NOT NULL,
  packaging_fee NUMERIC(10,2) DEFAULT 0,
  food_waste_credit NUMERIC(10,2) DEFAULT 0,
  total_paid NUMERIC(10,2) NOT NULL,
  payment_method TEXT DEFAULT 'Paid via UPI',
  status TEXT DEFAULT 'Ready for Pickup',
  pickup_window TEXT,
  pickup_countdown TEXT,
  distance TEXT DEFAULT '1.4 km away',
  booking_date TEXT DEFAULT 'Today',
  fssai_verified BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. HOTEL VERIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.hotel_verifications (
  id TEXT PRIMARY KEY,
  hotel_name TEXT NOT NULL,
  trade_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  fssai_license_number TEXT NOT NULL,
  fssai_expiry TEXT NOT NULL,
  gstin TEXT NOT NULL,
  kitchen_category TEXT NOT NULL,
  audit_inspection_date TEXT,
  audit_score TEXT DEFAULT '96/100',
  temperature_log_compliant BOOLEAN DEFAULT TRUE,
  waste_management_sop BOOLEAN DEFAULT TRUE,
  status TEXT DEFAULT 'Pending Verification',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SUPPORT TICKETS TABLE
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id TEXT PRIMARY KEY,
  booking_id TEXT,
  user_name TEXT NOT NULL,
  user_phone TEXT,
  hotel_name TEXT NOT NULL,
  issue_category TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT DEFAULT 'High',
  status TEXT DEFAULT 'Open',
  refund_requested BOOLEAN DEFAULT FALSE,
  refund_amount NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.transactions (
  id TEXT PRIMARY KEY,
  booking_id TEXT,
  partner_name TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  gross_amount NUMERIC(10,2) NOT NULL,
  commission_fee NUMERIC(10,2) NOT NULL,
  net_payout NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'Escrow Held',
  payout_mode TEXT DEFAULT 'UPI Auto-Settle',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PLATFORM SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.platform_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES (Idempotent - Safe to re-run anytime)
-- =========================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotel_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Meals policies
DROP POLICY IF EXISTS "Public read on meals" ON public.meals;
DROP POLICY IF EXISTS "Allow all on meals" ON public.meals;
CREATE POLICY "Public read on meals" ON public.meals FOR SELECT USING (true);
CREATE POLICY "Allow all on meals" ON public.meals FOR ALL USING (true) WITH CHECK (true);

-- Bookings policies
DROP POLICY IF EXISTS "Public read on bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow all on bookings" ON public.bookings;
CREATE POLICY "Public read on bookings" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Allow all on bookings" ON public.bookings FOR ALL USING (true) WITH CHECK (true);

-- Profiles policies
DROP POLICY IF EXISTS "Public read on profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow all on profiles" ON public.profiles;
CREATE POLICY "Public read on profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow all on profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

-- Users policies
DROP POLICY IF EXISTS "Public read on users" ON public.users;
DROP POLICY IF EXISTS "Allow all on users" ON public.users;
CREATE POLICY "Public read on users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow all on users" ON public.users FOR ALL USING (true) WITH CHECK (true);

-- Hotel verifications policies
DROP POLICY IF EXISTS "Public read on hotel_verifications" ON public.hotel_verifications;
DROP POLICY IF EXISTS "Allow all on hotel_verifications" ON public.hotel_verifications;
CREATE POLICY "Public read on hotel_verifications" ON public.hotel_verifications FOR SELECT USING (true);
CREATE POLICY "Allow all on hotel_verifications" ON public.hotel_verifications FOR ALL USING (true) WITH CHECK (true);

-- Support tickets policies
DROP POLICY IF EXISTS "Public read on support_tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Allow all on support_tickets" ON public.support_tickets;
CREATE POLICY "Public read on support_tickets" ON public.support_tickets FOR SELECT USING (true);
CREATE POLICY "Allow all on support_tickets" ON public.support_tickets FOR ALL USING (true) WITH CHECK (true);

-- Transactions & settings policies
DROP POLICY IF EXISTS "Allow all on transactions" ON public.transactions;
DROP POLICY IF EXISTS "Allow all on platform_settings" ON public.platform_settings;
CREATE POLICY "Allow all on transactions" ON public.transactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on platform_settings" ON public.platform_settings FOR ALL USING (true) WITH CHECK (true);

-- =========================================================================
-- REALTIME REPLICATION CONFIGURATION (Idempotent - Safe against 42710 error)
-- =========================================================================
DO $$
BEGIN
  -- Safe idempotent addition of tables to supabase_realtime publication
  -- Handles ERROR 42710 (duplicate_object) gracefully if table is already a member
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.meals;
  EXCEPTION
    WHEN duplicate_object THEN NULL;
    WHEN OTHERS THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
  EXCEPTION
    WHEN duplicate_object THEN NULL;
    WHEN OTHERS THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.support_tickets;
  EXCEPTION
    WHEN duplicate_object THEN NULL;
    WHEN OTHERS THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.hotel_verifications;
  EXCEPTION
    WHEN duplicate_object THEN NULL;
    WHEN OTHERS THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
  EXCEPTION
    WHEN duplicate_object THEN NULL;
    WHEN OTHERS THEN NULL;
  END;
END $$;

-- =========================================================================
-- PRODUCTION INITIAL SEED DATA
-- Populate live meals, verified hotels, and system parameters
-- =========================================================================

INSERT INTO public.meals (id, name, sub_title, restaurant, restaurant_address, rating, review_count, category, original_price, rescue_price, discount, pickup_window, pickup_counter, portion_count, image, fssai_verified, fssai_number, dietary_type, co2_saved_kg, status)
VALUES
  ('meal-1', 'Executive North Indian Deluxe Thali', '4 Butter Rotis, Paneer Makhani, Dal Tadka, Jeera Rice, Gulab Jamun', 'Grand Palace Banquet & Suites', 'Plot 12, Vijay Nagar Commercial Hub, Indore', 4.9, 142, 'Meals & Thalis', 320, 99, '69% OFF', 'Tonight: 7:00 PM – 9:00 PM', 'Takeaway Counter #1', 12, 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80', true, 'FSSAI #1001901100234', 'Pure Veg', 2.8, 'Available'),
  ('meal-2', 'Dum Handi Biryani Surprise Box', 'Fragrant Basmati Rice, Spiced Soya Chunks, Mirchi Ka Salan, Burani Raita', 'Hyderabadi Shahi Rasoi', 'MG Road Boulevard, Opp. Metro Pillar 42, Indore', 4.8, 98, 'Biryani & Rice', 280, 89, '68% OFF', 'Tonight: 6:30 PM – 8:30 PM', 'Express Counter 2', 8, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80', true, 'FSSAI #1002001100582', 'Pure Veg', 2.3, 'Available'),
  ('meal-3', 'Artisan Bakery Surprise Mystery Bag', 'Sourdough Loaf, 2 Butter Croissants, 2 Chocolate Danish Pastries', 'Le Petit Boulangerie & Café', '5th Avenue Market, Old Palasia, Indore', 4.9, 210, 'Bakery & Breads', 350, 110, '68% OFF', 'Tonight: 7:30 PM – 9:30 PM', 'Bakery Counter', 6, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80', true, 'FSSAI #1001801100412', 'Eggless', 1.9, 'Available'),
  ('meal-4', 'South Indian Deluxe Tiffin Feast', 'Ghee Podi Idli (4 pcs), Medu Vada (2 pcs), Masala Upma, Coconut Chutney & Sambar', 'Sri Krishna Sagar Tiffin Center', 'Sapna Sangeeta Main Road, Indore', 4.7, 76, 'Snacks & Starters', 220, 69, '69% OFF', 'Tonight: 6:00 PM – 8:00 PM', 'Counter #3', 15, 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=800&q=80', true, 'FSSAI #1001901100877', 'Pure Veg', 1.7, 'Available')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.hotel_verifications (id, hotel_name, trade_name, owner_name, email, phone, address, city, fssai_license_number, fssai_expiry, gstin, kitchen_category, audit_inspection_date, audit_score, temperature_log_compliant, waste_management_sop, status)
VALUES
  ('APP-8841', 'Sharma Pure Veg Restaurant & Banquets', 'Sharma Hospitality Pvt Ltd', 'Rajesh Sharma', 'sharma.sweets@foodie-partner.in', '+91 98260 12345', 'Plot 42, University Commercial Complex, MG Road', 'Indore', '1001901100234', '2027-12-31', '23AABCS1429B1Z2', 'Multi-Cuisine Family Dining', '2026-09-15', '98/100', true, true, 'Approved'),
  ('APP-8842', 'Sayaji Premier Banquet & Catering', 'Sayaji Hotels Ltd', 'Anand Rao', 'sayaji.kitchen@foodie-partner.in', '+91 98260 98765', 'H-1 Scheme 54, Vijay Nagar', 'Indore', '1001801100991', '2028-06-30', '23AAACS5512D1Z9', '5-Star Commercial Kitchen', '2026-09-20', '99/100', true, true, 'Approved')
ON CONFLICT (id) DO NOTHING;

-- Safe migrations in case tables were previously created without these columns:
ALTER TABLE IF EXISTS public.bookings ADD COLUMN IF NOT EXISTS booking_date TEXT DEFAULT 'Today';
ALTER TABLE IF EXISTS public.meals ADD COLUMN IF NOT EXISTS portion_count INTEGER DEFAULT 1;
ALTER TABLE IF EXISTS public.meals ADD COLUMN IF NOT EXISTS portions_count INTEGER DEFAULT 1;
ALTER TABLE IF EXISTS public.meals ADD COLUMN IF NOT EXISTS latitude NUMERIC(9,6) DEFAULT 22.7196;
ALTER TABLE IF EXISTS public.meals ADD COLUMN IF NOT EXISTS longitude NUMERIC(9,6) DEFAULT 75.8577;

