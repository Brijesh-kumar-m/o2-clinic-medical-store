-- Blood Test Module Schema

-- 1. Create blood_tests table
CREATE TABLE IF NOT EXISTS public.blood_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_name TEXT NOT NULL,
    category TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    preparation TEXT,
    sample_type TEXT,
    report_time TEXT,
    lab_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create test_bookings table
CREATE TABLE IF NOT EXISTS public.test_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    test_id UUID REFERENCES public.blood_tests(id) ON DELETE SET NULL,
    patient_name TEXT NOT NULL,
    age INTEGER NOT NULL,
    gender TEXT NOT NULL,
    mobile TEXT NOT NULL,
    address TEXT,
    booking_date DATE NOT NULL,
    time_slot TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, confirmed, collected, result_ready, cancelled
    report_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable RLS
ALTER TABLE public.blood_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_bookings ENABLE ROW LEVEL SECURITY;

-- 4. RLS Polices for blood_tests
-- Anyone can view blood tests
CREATE POLICY "Public read blood_tests" ON public.blood_tests
    FOR SELECT USING (true);

-- Only admin can manage blood tests
CREATE POLICY "Admin manage blood_tests" ON public.blood_tests
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- 5. RLS Policies for test_bookings
-- Doctors can see their own bookings
CREATE POLICY "Doctor view own bookings" ON public.test_bookings
    FOR SELECT USING (auth.uid() = doctor_id);

-- Doctors can create bookings
CREATE POLICY "Doctor create bookings" ON public.test_bookings
    FOR INSERT WITH CHECK (auth.uid() = doctor_id);

-- Admins can see all bookings
CREATE POLICY "Admin view all bookings" ON public.test_bookings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- Admins can update bookings (e.g., status, report_url)
CREATE POLICY "Admin update bookings" ON public.test_bookings
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- 6. Add Indexes
CREATE INDEX IF NOT EXISTS idx_blood_tests_test_name ON public.blood_tests (test_name);
CREATE INDEX IF NOT EXISTS idx_test_bookings_doctor_id ON public.test_bookings (doctor_id);
CREATE INDEX IF NOT EXISTS idx_test_bookings_status ON public.test_bookings (status);
