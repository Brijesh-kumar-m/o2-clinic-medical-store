-- SQL to add missing columns to products table
-- Run this in the Supabase SQL Editor

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS rating NUMERIC DEFAULT 0;

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;

-- Optional: Update existing products with random ratings for demo purposes
UPDATE products 
SET 
  rating = floor(random() * (5 - 3 + 1) + 3)::numeric,
  review_count = floor(random() * 50)::int
WHERE rating = 0;
