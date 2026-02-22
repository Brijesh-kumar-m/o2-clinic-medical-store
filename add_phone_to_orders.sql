-- Add phone column to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Update RLS policies if needed (usually not needed for adding a column if policies are row-based)
-- But we might want to ensure the new column is accessible. 
-- Existing policies are:
-- "Users can view own orders" (SELECT)
-- "Users can create orders" (INSERT)
-- "Admins can update orders" (UPDATE)

-- These policies should automatically cover the new column for the row owner/admin.
