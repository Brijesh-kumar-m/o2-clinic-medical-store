-- ============================================================
-- Fix: Admin RLS Policy for Profiles Table
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- Step 1: Check existing policies on profiles table
-- (Run this first to see what exists)
-- SELECT policyname, cmd, qual FROM pg_policies WHERE tablename = 'profiles';

-- Step 2: Drop any conflicting old update policy on profiles (if exists)
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON public.profiles;

-- Step 3: Allow users to update their OWN profile only
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Step 4: Allow ADMIN to update ANY user's profile (status changes, etc.)
CREATE POLICY "Admin can update all profiles"
ON public.profiles
FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.profiles AS admin_check
        WHERE admin_check.id = auth.uid()
          AND admin_check.role = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles AS admin_check
        WHERE admin_check.id = auth.uid()
          AND admin_check.role = 'admin'
    )
);

-- Step 5: Also ensure admin can SELECT all profiles (needed for Users list)
DROP POLICY IF EXISTS "Admin can view all profiles" ON public.profiles;

CREATE POLICY "Admin can view all profiles"
ON public.profiles
FOR SELECT
USING (
    auth.uid() = id  -- user can see own profile
    OR EXISTS (
        SELECT 1 FROM public.profiles AS admin_check
        WHERE admin_check.id = auth.uid()
          AND admin_check.role = 'admin'
    )
);

-- Step 6: Verify the policies are created
-- SELECT policyname, cmd FROM pg_policies WHERE tablename = 'profiles' ORDER BY cmd;
