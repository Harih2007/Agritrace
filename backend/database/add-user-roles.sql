-- Add user roles to existing schema
-- Run this in Supabase SQL Editor

-- Drop existing users table if needed (WARNING: This will delete all user data)
-- DROP TABLE IF EXISTS public.users CASCADE;

-- Create user roles enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('farmer', 'distributor', 'retailer', 'consumer', 'admin', 'transporter');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Alter users table to add new columns
ALTER TABLE public.users 
  ADD COLUMN IF NOT EXISTS email TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS full_name TEXT,
  ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'consumer',
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_wallet ON public.users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_users_active ON public.users(is_active);

-- Update RLS policies for users table
DROP POLICY IF EXISTS "Users can view all users" ON public.users;
DROP POLICY IF EXISTS "Users can view all active users" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.users;

-- New RLS policies with role support
CREATE POLICY "Users can view all active users" ON public.users
  FOR SELECT USING (is_active = true);

CREATE POLICY "Users can insert their own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can update any profile" ON public.users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS user_role AS $$
  SELECT role FROM public.users WHERE id = user_id;
$$ LANGUAGE SQL STABLE;

-- Function to check if user has role
CREATE OR REPLACE FUNCTION public.has_role(user_id UUID, required_role user_role)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = user_id AND (role = required_role OR role = 'admin')
  );
$$ LANGUAGE SQL STABLE;

-- Comments for documentation
COMMENT ON TYPE user_role IS 'User roles in the supply chain system';
COMMENT ON COLUMN public.users.role IS 'User role: farmer, distributor, retailer, consumer, admin, or transporter';
COMMENT ON COLUMN public.users.is_active IS 'Whether the user account is active';
COMMENT ON FUNCTION public.get_user_role IS 'Get the role of a user by ID';
COMMENT ON FUNCTION public.has_role IS 'Check if a user has a specific role (admins always return true)';
