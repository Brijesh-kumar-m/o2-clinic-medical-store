-- COMBINED SETUP SCRIPT
-- This script will:
-- 1. Create all necessary tables (if they don't exist)
-- 2. Create security policies and functions
-- 3. Insert initial sample product data

-- ==========================================
-- PART 1: SCHEMA SETUP
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  role TEXT DEFAULT 'user',
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  practice_name TEXT,
  practice_address TEXT,
  license_number TEXT,
  phone TEXT,
  specialization TEXT,
  address TEXT, -- Added address field to match usage
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  generic_name TEXT,
  brand TEXT,
  manufacturer JSONB, -- { name: "Apex Labs", logo: "..." }
  category TEXT,
  sub_category TEXT,
  composition TEXT,
  dosage_form TEXT,
  pack_sizes JSONB, -- [{ size: "10x10", price: 100, mrp: 120 }]
  stock INTEGER DEFAULT 0,
  prescription_required BOOLEAN DEFAULT FALSE,
  description TEXT,
  images TEXT[],
  indications TEXT,
  side_effects TEXT,
  storage TEXT,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id), -- Changed to profiles(id) for easier joins
  total_amount NUMERIC,
  status TEXT DEFAULT 'pending', -- pending, processing, shipped, delivered, cancelled
  shipping_address TEXT,
  prescription_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  product_id UUID REFERENCES products(id),
  product_name TEXT,
  pack_size TEXT,
  quantity INTEGER,
  price NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wishlist table
CREATE TABLE IF NOT EXISTS wishlist (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  product_id UUID REFERENCES products(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Cart Items table
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  product_id UUID REFERENCES products(id) NOT NULL,
  quantity INTEGER DEFAULT 1,
  pack_size TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id, pack_size)
);

-- RLS Policies

-- Profiles: Users can view/edit their own, Admins can view/edit all
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public profiles are viewable by everyone') THEN
        CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own profile') THEN
        CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own profile') THEN
        CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
    END IF;
END $$;

-- Products: Everyone can view, Admins can edit
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Products are viewable by everyone') THEN
        CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can insert products') THEN
        CREATE POLICY "Admins can insert products" ON products FOR INSERT WITH CHECK (
          EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can update products') THEN
        CREATE POLICY "Admins can update products" ON products FOR UPDATE USING (
          EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
        );
    END IF;
END $$;

-- Orders: Users can view/create their own, Admins can view/edit all
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own orders') THEN
        CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can create orders') THEN
        CREATE POLICY "Users can create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can update orders') THEN
        CREATE POLICY "Admins can update orders" ON orders FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
    END IF;
END $$;

-- Order Items: Same as orders
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own order items') THEN
        CREATE POLICY "Users can view own order items" ON order_items FOR SELECT USING (
          EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
          OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can create order items') THEN
        CREATE POLICY "Users can create order items" ON order_items FOR INSERT WITH CHECK (
          EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
        );
    END IF;
END $$;

-- Wishlist: Users can manage their own
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own wishlist') THEN
        CREATE POLICY "Users can view own wishlist" ON wishlist FOR SELECT USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert into own wishlist') THEN
        CREATE POLICY "Users can insert into own wishlist" ON wishlist FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete from own wishlist') THEN
        CREATE POLICY "Users can delete from own wishlist" ON wishlist FOR DELETE USING (auth.uid() = user_id);
    END IF;
END $$;

-- Cart Items: Users can manage their own
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own cart') THEN
        CREATE POLICY "Users can view own cart" ON cart_items FOR SELECT USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own cart') THEN
        CREATE POLICY "Users can insert own cart" ON cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own cart') THEN
        CREATE POLICY "Users can update own cart" ON cart_items FOR UPDATE USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete own cart') THEN
        CREATE POLICY "Users can delete own cart" ON cart_items FOR DELETE USING (auth.uid() = user_id);
    END IF;
END $$;

-- RPCs

-- Decrement stock
CREATE OR REPLACE FUNCTION decrement_stock(product_id UUID, qty INT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE products
  SET stock = stock - qty
  WHERE id = product_id AND stock >= qty;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient stock';
  END IF;
END;
$$;

-- Search medicines
CREATE OR REPLACE FUNCTION search_medicines(search_query TEXT)
RETURNS SETOF products
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT *
  FROM products
  WHERE 
    name ILIKE '%' || search_query || '%' OR
    generic_name ILIKE '%' || search_query || '%' OR
    brand ILIKE '%' || search_query || '%' OR
    composition ILIKE '%' || search_query || '%';
$$;

-- Get category stats
CREATE OR REPLACE FUNCTION get_category_stats()
RETURNS TABLE (category text, count bigint)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT category, count(*)
  FROM products
  GROUP BY category
  ORDER BY count(*) DESC
  LIMIT 8;
$$;

-- Storage: Prescriptions Bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('prescriptions', 'prescriptions', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can upload own prescriptions') THEN
        CREATE POLICY "Users can upload own prescriptions" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'prescriptions' AND auth.uid() = owner);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own prescriptions') THEN
        CREATE POLICY "Users can view own prescriptions" ON storage.objects FOR SELECT USING (bucket_id = 'prescriptions' AND auth.uid() = owner);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can view all prescriptions') THEN
        CREATE POLICY "Admins can view all prescriptions" ON storage.objects FOR SELECT USING (bucket_id = 'prescriptions' AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
    END IF;
END $$;

-- Triggers for User Creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    first_name, 
    last_name, 
    role,
    phone,
    license_number
  )
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    COALESCE(new.raw_user_meta_data->>'role', 'user'),
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'license_number'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ==========================================
-- PART 2: SEED DATA
-- ==========================================

-- Check if products exist, if so, we skip (to avoid duplicates on multiple runs)
-- Or you can uncomment the next line to clear existing products
-- TRUNCATE TABLE products CASCADE;

INSERT INTO products (
    name, generic_name, brand, manufacturer, category, sub_category, 
    composition, dosage_form, pack_sizes, stock, prescription_required, 
    description, images, featured
  ) VALUES (
    'Paracetamol 500mg',
    'Paracetamol',
    'Dolo 650',
    '{"name":"Micro Labs Ltd","logo":""}',
    'Analgesic',
    'Fever & Pain',
    'Paracetamol IP 650mg',
    'Tablet',
    '[{"size":"15 Tabs","price":30,"mrp":35,"discount":14}]',
    5000,
    false,
    'Effective for fever and mild to moderate pain relief.',
    '{"https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400"}',
    true
  );

INSERT INTO products (
    name, generic_name, brand, manufacturer, category, sub_category, 
    composition, dosage_form, pack_sizes, stock, prescription_required, 
    description, images, featured
  ) VALUES (
    'Amoxycillin 500mg',
    'Amoxycillin',
    'Mox 500',
    '{"name":"Sun Pharma","logo":""}',
    'Antibiotic',
    'Penicillin',
    'Amoxycillin Trihydrate IP 500mg',
    'Capsule',
    '[{"size":"10 Caps","price":65,"mrp":85,"discount":23}]',
    2000,
    true,
    'Broad-spectrum antibiotic used to treat bacterial infections.',
    '{"https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=400"}',
    true
  );

INSERT INTO products (
    name, generic_name, brand, manufacturer, category, sub_category, 
    composition, dosage_form, pack_sizes, stock, prescription_required, 
    description, images, featured
  ) VALUES (
    'Azithromycin 500mg',
    'Azithromycin',
    'Azithral 500',
    '{"name":"Alembic","logo":""}',
    'Antibiotic',
    'Macrolide',
    'Azithromycin IP 500mg',
    'Tablet',
    '[{"size":"5 Tabs","price":105,"mrp":130,"discount":19}]',
    1500,
    true,
    'Used for various bacterial infections including respiratory infections.',
    '{"https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=400"}',
    true
  );

INSERT INTO products (
    name, generic_name, brand, manufacturer, category, sub_category, 
    composition, dosage_form, pack_sizes, stock, prescription_required, 
    description, images, featured
  ) VALUES (
    'Cetirizine 10mg',
    'Cetirizine',
    'Cetzine',
    '{"name":"Dr. Reddy''s","logo":""}',
    'Antihistamine',
    'Allergy',
    'Cetirizine Hydrochloride IP 10mg',
    'Tablet',
    '[{"size":"10 Tabs","price":18,"mrp":22,"discount":18}]',
    8000,
    false,
    'Relief from allergy symptoms like runny nose, sneezing, and itching.',
    '{"https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&q=80&w=400"}',
    false
  );

INSERT INTO products (
    name, generic_name, brand, manufacturer, category, sub_category, 
    composition, dosage_form, pack_sizes, stock, prescription_required, 
    description, images, featured
  ) VALUES (
    'Pantoprazole 40mg',
    'Pantoprazole',
    'Pan 40',
    '{"name":"Alkem","logo":""}',
    'Gastrointestinal',
    'Acid Reflux',
    'Pantoprazole Sodium IP 40mg',
    'Tablet',
    '[{"size":"15 Tabs","price":140,"mrp":165,"discount":15}]',
    3000,
    true,
    'Reduces stomach acid, used for GERD and ulcers.',
    '{"https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&q=80&w=400"}',
    true
  );

INSERT INTO products (
    name, generic_name, brand, manufacturer, category, sub_category, 
    composition, dosage_form, pack_sizes, stock, prescription_required, 
    description, images, featured
  ) VALUES (
    'Metformin 500mg',
    'Metformin',
    'Glycomet 500',
    '{"name":"USV Ltd","logo":""}',
    'Antidiabetic',
    'Type 2 Diabetes',
    'Metformin Hydrochloride IP 500mg',
    'Tablet',
    '[{"size":"20 Tabs","price":45,"mrp":55,"discount":18}]',
    4000,
    true,
    'First-line medication for the treatment of type 2 diabetes.',
    '{"https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=400"}',
    false
  );

INSERT INTO products (
    name, generic_name, brand, manufacturer, category, sub_category, 
    composition, dosage_form, pack_sizes, stock, prescription_required, 
    description, images, featured
  ) VALUES (
    'Atorvastatin 10mg',
    'Atorvastatin',
    'Atorva 10',
    '{"name":"Zydus Cadila","logo":""}',
    'Cardiovascular',
    'Cholesterol',
    'Atorvastatin Calcium IP 10mg',
    'Tablet',
    '[{"size":"15 Tabs","price":90,"mrp":110,"discount":18}]',
    2500,
    true,
    'Lowers bad cholesterol and fats (triglycerides) in the blood.',
    '{"https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80&w=400"}',
    false
  );

INSERT INTO products (
    name, generic_name, brand, manufacturer, category, sub_category, 
    composition, dosage_form, pack_sizes, stock, prescription_required, 
    description, images, featured
  ) VALUES (
    'Vitamin C 500mg',
    'Ascorbic Acid',
    'Limcee',
    '{"name":"Abbott","logo":""}',
    'Supplement',
    'Vitamins',
    'Ascorbic Acid IP 500mg',
    'Chewable Tablet',
    '[{"size":"15 Tabs","price":25,"mrp":30,"discount":16}]',
    6000,
    false,
    'Vitamin C supplement for immune support.',
    '{"https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400"}',
    true
  );

INSERT INTO products (
    name, generic_name, brand, manufacturer, category, sub_category, 
    composition, dosage_form, pack_sizes, stock, prescription_required, 
    description, images, featured
  ) VALUES (
    'Ibuprofen 400mg',
    'Ibuprofen',
    'Brufen 400',
    '{"name":"Abbott","logo":""}',
    'Analgesic',
    'NSAID',
    'Ibuprofen IP 400mg',
    'Tablet',
    '[{"size":"15 Tabs","price":35,"mrp":45,"discount":22}]',
    3500,
    false,
    'Pain reliever and anti-inflammatory medication.',
    '{"https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&q=80&w=400"}',
    false
  );

INSERT INTO products (
    name, generic_name, brand, manufacturer, category, sub_category, 
    composition, dosage_form, pack_sizes, stock, prescription_required, 
    description, images, featured
  ) VALUES (
    'Telmisartan 40mg',
    'Telmisartan',
    'Telma 40',
    '{"name":"Glenmark","logo":""}',
    'Cardiovascular',
    'Hypertension',
    'Telmisartan IP 40mg',
    'Tablet',
    '[{"size":"15 Tabs","price":110,"mrp":140,"discount":21}]',
    2200,
    true,
    'Used to treat high blood pressure (hypertension).',
    '{"https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80&w=400"}',
    true
  );

INSERT INTO products (
    name, generic_name, brand, manufacturer, category, sub_category, 
    composition, dosage_form, pack_sizes, stock, prescription_required, 
    description, images, featured
  ) VALUES (
    'Montelukast 10mg',
    'Montelukast',
    'Montek LC',
    '{"name":"Sun Pharma","logo":""}',
    'Respiratory',
    'Asthma/Allergy',
    'Montelukast Sodium IP 10mg + Levocetirizine 5mg',
    'Tablet',
    '[{"size":"10 Tabs","price":160,"mrp":190,"discount":15}]',
    1800,
    true,
    'Used to prevent asthma attacks and treat allergy symptoms.',
    '{"https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400"}',
    true
  );

INSERT INTO products (
    name, generic_name, brand, manufacturer, category, sub_category, 
    composition, dosage_form, pack_sizes, stock, prescription_required, 
    description, images, featured
  ) VALUES (
    'Calcium + Vitamin D3',
    'Calcium Carbonate + Vitamin D3',
    'Shelcal 500',
    '{"name":"Torrent Pharma","logo":""}',
    'Supplement',
    'Calcium',
    'Elemental Calcium 500mg + Vitamin D3 250 IU',
    'Tablet',
    '[{"size":"15 Tabs","price":115,"mrp":135,"discount":14}]',
    4500,
    false,
    'Calcium supplement for bone health.',
    '{"https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400"}',
    true
  );

INSERT INTO products (
    name, generic_name, brand, manufacturer, category, sub_category, 
    composition, dosage_form, pack_sizes, stock, prescription_required, 
    description, images, featured
  ) VALUES (
    'Thyroxine 100mcg',
    'Thyroxine Sodium',
    'Thyronorm 100',
    '{"name":"Abbott","logo":""}',
    'Hormonal',
    'Thyroid',
    'Thyroxine Sodium IP 100mcg',
    'Tablet',
    '[{"size":"120 Tabs (Bottle)","price":180,"mrp":220,"discount":18}]',
    1200,
    true,
    'Used to treat hypothyroidism (low thyroid hormone).',
    '{"https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=400"}',
    false
  );

INSERT INTO products (
    name, generic_name, brand, manufacturer, category, sub_category, 
    composition, dosage_form, pack_sizes, stock, prescription_required, 
    description, images, featured
  ) VALUES (
    'Domperidone 10mg',
    'Domperidone',
    'Domstal',
    '{"name":"Torrent Pharma","logo":""}',
    'Gastrointestinal',
    'Antiemetic',
    'Domperidone IP 10mg',
    'Tablet',
    '[{"size":"10 Tabs","price":35,"mrp":42,"discount":16}]',
    3000,
    true,
    'Used to relieve nausea and vomiting.',
    '{"https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&q=80&w=400"}',
    false
  );

INSERT INTO products (
    name, generic_name, brand, manufacturer, category, sub_category, 
    composition, dosage_form, pack_sizes, stock, prescription_required, 
    description, images, featured
  ) VALUES (
    'Pregabalin 75mg',
    'Pregabalin',
    'Lyrica 75',
    '{"name":"Pfizer","logo":""}',
    'Neurology',
    'Neuropathic Pain',
    'Pregabalin IP 75mg',
    'Capsule',
    '[{"size":"14 Caps","price":210,"mrp":260,"discount":19}]',
    800,
    true,
    'Used to treat nerve pain and seizures.',
    '{"https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=400"}',
    true
  );
