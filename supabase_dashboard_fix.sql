
-- Run this entire script in the Supabase SQL Editor to fix missing data and permissions.

-- 1. Insert Initial Products (if not already present)
INSERT INTO public.products (
    name, generic_name, brand, manufacturer, category, sub_category, 
    composition, dosage_form, pack_sizes, stock, prescription_required, 
    description, images, featured
) VALUES 
(
    'Paracetamol 500mg', 'Paracetamol', 'Dolo 650', '{"name":"Micro Labs Ltd","logo":""}', 
    'Analgesic', 'Fever & Pain', 'Paracetamol IP 650mg', 'Tablet', 
    '[{"size":"15 Tabs","price":30,"mrp":35,"discount":14}]', 5000, false, 
    'Effective for fever and mild to moderate pain relief.', 
    '{"https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400"}', true
),
(
    'Amoxycillin 500mg', 'Amoxycillin', 'Mox 500', '{"name":"Sun Pharma","logo":""}', 
    'Antibiotic', 'Penicillin', 'Amoxycillin Trihydrate IP 500mg', 'Capsule', 
    '[{"size":"10 Caps","price":65,"mrp":85,"discount":23}]', 2000, true, 
    'Broad-spectrum antibiotic used to treat bacterial infections.', 
    '{"https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=400"}', true
),
(
    'Cetirizine 10mg', 'Cetirizine', 'Cetzine', '{"name":"Dr. Reddy''s","logo":""}', 
    'Antihistamine', 'Allergy', 'Cetirizine Hydrochloride IP 10mg', 'Tablet', 
    '[{"size":"10 Tabs","price":18,"mrp":22,"discount":18}]', 8000, false, 
    'Relief from allergy symptoms like runny nose, sneezing, and itching.', 
    '{"https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&q=80&w=400"}', false
),
(
    'Pantoprazole 40mg', 'Pantoprazole', 'Pan 40', '{"name":"Alkem","logo":""}', 
    'Gastrointestinal', 'Acid Reflux', 'Pantoprazole Sodium IP 40mg', 'Tablet', 
    '[{"size":"15 Tabs","price":140,"mrp":165,"discount":15}]', 3000, true, 
    'Treats acid reflux, heartburn, and gastro-oesophageal reflux disease (GERD).', 
    '{"https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400"}', true
),
(
    'Montelukast 10mg', 'Montelukast', 'Montek LC', '{"name":"Sun Pharma","logo":""}', 
    'Respiratory', 'Asthma', 'Montelukast Sodium IP 10mg', 'Tablet', 
    '[{"size":"10 Tabs","price":180,"mrp":210,"discount":14}]', 1200, true, 
    'Prevents asthma attacks and treats allergic rhinitis.', 
    '{"https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400"}', false
)
ON CONFLICT DO NOTHING;

-- 2. Fix Permissions (Optional: Allow anyone to insert products temporarily if needed, otherwise rely on Admin role)
-- DROP POLICY IF EXISTS "Admins can insert products" ON products;
-- CREATE POLICY "Allow insert for all authenticated users" ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 3. Update your user to be an admin (Replace 'your-email@example.com' with your actual email)
-- UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
