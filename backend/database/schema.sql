-- Supabase Database Schema for Supply Chain Backend

-- User roles enum
CREATE TYPE user_role AS ENUM ('farmer', 'distributor', 'retailer', 'consumer', 'admin', 'transporter');

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role user_role NOT NULL DEFAULT 'consumer',
  wallet_address TEXT UNIQUE,
  phone TEXT,
  address TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_wallet ON public.users(wallet_address);

-- Products table
CREATE TABLE IF NOT EXISTS public.products (
  id BIGSERIAL PRIMARY KEY,
  blockchain_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  ipfs_hash TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  price DECIMAL(20, 8),
  owner_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  blockchain_hash TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_products_owner ON public.products(owner_id);
CREATE INDEX idx_products_blockchain_id ON public.products(blockchain_id);
CREATE INDEX idx_products_active ON public.products(is_active);

-- Escrows table
CREATE TABLE IF NOT EXISTS public.escrows (
  id BIGSERIAL PRIMARY KEY,
  blockchain_id TEXT NOT NULL,
  product_id BIGINT REFERENCES public.products(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  seller_address TEXT NOT NULL,
  amount TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('created', 'funded', 'delivered', 'completed', 'disputed', 'cancelled', 'refunded')),
  blockchain_hash TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_escrows_buyer ON public.escrows(buyer_id);
CREATE INDEX idx_escrows_product ON public.escrows(product_id);
CREATE INDEX idx_escrows_status ON public.escrows(status);

-- QR Codes table
CREATE TABLE IF NOT EXISTS public.qr_codes (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT REFERENCES public.products(id) ON DELETE CASCADE,
  qr_data JSONB NOT NULL,
  qr_image_url TEXT NOT NULL,
  scans_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_qr_codes_product ON public.qr_codes(product_id);

-- IPFS Files table
CREATE TABLE IF NOT EXISTS public.ipfs_files (
  id BIGSERIAL PRIMARY KEY,
  ipfs_hash TEXT NOT NULL UNIQUE,
  gateway_url TEXT NOT NULL,
  filename TEXT NOT NULL,
  content_type TEXT,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  metadata JSONB DEFAULT '{}',
  is_pinned BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ipfs_files_user ON public.ipfs_files(user_id);
CREATE INDEX idx_ipfs_files_hash ON public.ipfs_files(ipfs_hash);

-- Supply Chain Events table (for tracking blockchain events)
CREATE TABLE IF NOT EXISTS public.supply_chain_events (
  id BIGSERIAL PRIMARY KEY,
  product_code TEXT NOT NULL,
  event_type TEXT NOT NULL,
  blockchain_hash TEXT NOT NULL,
  block_number BIGINT,
  actor_address TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_events_product_code ON public.supply_chain_events(product_code);
CREATE INDEX idx_events_type ON public.supply_chain_events(event_type);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escrows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ipfs_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supply_chain_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for products
CREATE POLICY "Users can view all products" ON public.products
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own products" ON public.products
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own products" ON public.products
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own products" ON public.products
  FOR DELETE USING (auth.uid() = owner_id);

-- RLS Policies for escrows
CREATE POLICY "Users can view their escrows" ON public.escrows
  FOR SELECT USING (auth.uid() = buyer_id);

CREATE POLICY "Users can create escrows" ON public.escrows
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- RLS Policies for IPFS files
CREATE POLICY "Users can view all IPFS files" ON public.ipfs_files
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own files" ON public.ipfs_files
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Functions for updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_escrows_updated_at BEFORE UPDATE ON public.escrows
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
