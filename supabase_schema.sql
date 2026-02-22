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
  rating NUMERIC DEFAULT 0,
  review_count INTEGER DEFAULT 0,
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

CREATE POLICY "Public profiles are viewable by everyone" 
ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE USING (auth.uid() = id);

-- Products: Everyone can view, Admins can edit
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone" 
ON products FOR SELECT USING (true);

CREATE POLICY "Admins can insert products" 
ON products FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can update products" 
ON products FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Orders: Users can view/create their own, Admins can view/edit all
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders" 
ON orders FOR SELECT USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users can create orders" 
ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update orders" 
ON orders FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Order Items: Same as orders
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items" 
ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Users can create order items" 
ON order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

-- Wishlist: Users can manage their own
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wishlist" 
ON wishlist FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into own wishlist" 
ON wishlist FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from own wishlist" 
ON wishlist FOR DELETE USING (auth.uid() = user_id);

-- Cart Items: Users can manage their own
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cart"
ON cart_items FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart"
ON cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart"
ON cart_items FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart"
ON cart_items FOR DELETE USING (auth.uid() = user_id);

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
CREATE POLICY "Users can upload own prescriptions"
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'prescriptions' AND 
  auth.uid() = owner
);

CREATE POLICY "Users can view own prescriptions"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'prescriptions' AND 
  auth.uid() = owner
);

CREATE POLICY "Admins can view all prescriptions"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'prescriptions' AND 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

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

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
