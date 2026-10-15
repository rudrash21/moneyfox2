-- ==============================================================================
-- MONEYFOX LUXURY REALTIME SCHEMA FOR SUPABASE
-- Run this script in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- Project: https://qxwqemlsxjvdpnxjkezr.supabase.co
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PRODUCTS TABLE (Full Admin Product & Inventory Manipulation)
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE,
  sku TEXT UNIQUE,
  name TEXT NOT NULL,
  series TEXT DEFAULT 'Cyber Streetwear Series · 001',
  lot TEXT DEFAULT 'Lot #MF-240 • Obsidian Noir',
  gsm INTEGER DEFAULT 240,
  price NUMERIC NOT NULL DEFAULT 2000,
  taxable_price NUMERIC DEFAULT 1785.71,
  gst_percentage NUMERIC DEFAULT 12,
  color TEXT DEFAULT 'Obsidian Black / Cyan Accent',
  edition_tag TEXT DEFAULT 'Signature Drop',
  image TEXT,
  thumbnails TEXT[] DEFAULT ARRAY[]::TEXT[],
  angles JSONB DEFAULT '{}'::JSONB,
  description TEXT,
  details TEXT[] DEFAULT ARRAY[]::TEXT[],
  specs TEXT DEFAULT 'Direct Selling Registered · Binary Tree Node · HSN 6109',
  sizes TEXT[] DEFAULT ARRAY['S', 'M', 'L', 'XL']::TEXT[],
  available_sizes TEXT[] DEFAULT ARRAY['S', 'M', 'L', 'XL']::TEXT[],
  size_s_stock INTEGER DEFAULT 18,
  size_m_stock INTEGER DEFAULT 22,
  size_l_stock INTEGER DEFAULT 30,
  size_xl_stock INTEGER DEFAULT 15,
  status TEXT DEFAULT 'Published' CHECK (status IN ('Published', 'Draft', 'Low stock', 'Archived')),
  is_active BOOLEAN DEFAULT true,
  category TEXT DEFAULT 'apparel',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. INVENTORY ADJUSTMENTS LOG TABLE (Admin Stock Audit Trail)
CREATE TABLE IF NOT EXISTS public.inventory_adjustments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  sku TEXT NOT NULL,
  size TEXT NOT NULL,
  operator_email TEXT NOT NULL DEFAULT 'admin@moneyfox.co.in',
  adjustment_quantity INTEGER NOT NULL,
  previous_stock INTEGER NOT NULL,
  new_stock INTEGER NOT NULL,
  reason TEXT NOT NULL,
  audit_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. USERS / MEMBERS & ADMINS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id TEXT UNIQUE,
  moneyfox_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  payment_completed BOOLEAN DEFAULT false,
  payment_method TEXT,
  payment_date TIMESTAMPTZ,
  parent_id TEXT,
  left_child_id TEXT,
  right_child_id TEXT,
  has_joined_tree BOOLEAN DEFAULT false,
  referral_code TEXT UNIQUE NOT NULL,
  referred_by TEXT,
  is_in_waiting_bench BOOLEAN DEFAULT false,
  waiting_bench_type TEXT,
  waiting_bench_entry_date TIMESTAMPTZ,
  waiting_in_bench_of TEXT,
  wallet_balance NUMERIC DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PAYMENTS TABLE (Realtime UTR Reconciliation & Approval)
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  moneyfox_id TEXT NOT NULL,
  order_id TEXT NOT NULL,
  transaction_id TEXT NOT NULL,
  upi_id TEXT,
  amount NUMERIC NOT NULL DEFAULT 2000,
  payment_method TEXT DEFAULT 'upi',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  idempotency_key TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ORDERS & SHIPMENTS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT UNIQUE NOT NULL,
  user_id TEXT,
  moneyfox_id TEXT NOT NULL,
  product_id TEXT,
  product_name TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 2000,
  size TEXT DEFAULT 'L',
  quantity INTEGER DEFAULT 1,
  shipment_status TEXT DEFAULT 'Preparing' CHECK (shipment_status IN ('Preparing', 'In transit', 'Delivered', 'Verification pending')),
  tracking_number TEXT,
  carrier TEXT DEFAULT 'Bluedart Express',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. DELIVERY ADDRESSES TABLE
CREATE TABLE IF NOT EXISTS public.delivery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT,
  moneyfox_id TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT,
  state TEXT,
  pincode TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. GLOBAL WAITING BENCH TABLE
CREATE TABLE IF NOT EXISTS public.global_waiting_bench (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  moneyfox_id TEXT NOT NULL,
  name TEXT NOT NULL,
  entry_date TIMESTAMPTZ DEFAULT NOW(),
  left_date TIMESTAMPTZ,
  status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'allocated', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_adjustments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.global_waiting_bench ENABLE ROW LEVEL SECURITY;

-- Products Policies: Public read, Admin full CRUD manipulation
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admin Insert Products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin Update Products" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Admin Delete Products" ON public.products FOR DELETE USING (true);

-- Inventory Adjustments Policies
CREATE POLICY "Public Read Inventory Adjustments" ON public.inventory_adjustments FOR SELECT USING (true);
CREATE POLICY "Admin Manage Inventory Adjustments" ON public.inventory_adjustments FOR ALL USING (true);

-- Users Policies: Public read/insert/update
CREATE POLICY "Public Read Users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Public Insert Users" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Users" ON public.users FOR UPDATE USING (true);

-- Payments Policies
CREATE POLICY "Public Read Payments" ON public.payments FOR SELECT USING (true);
CREATE POLICY "Public Insert Payments" ON public.payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Payments" ON public.payments FOR UPDATE USING (true);

-- Orders Policies
CREATE POLICY "Public Read Orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public Insert Orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Orders" ON public.orders FOR UPDATE USING (true);

-- Delivery Policies
CREATE POLICY "Public Read Delivery" ON public.delivery FOR SELECT USING (true);
CREATE POLICY "Public Insert Delivery" ON public.delivery FOR INSERT WITH CHECK (true);

-- Waiting Bench Policies
CREATE POLICY "Public Read Bench" ON public.global_waiting_bench FOR SELECT USING (true);
CREATE POLICY "Public Manage Bench" ON public.global_waiting_bench FOR ALL USING (true);

-- ==============================================================================
-- 10. ENABLE REALTIME BROADCASTING ON ALL TABLES
-- ==============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.inventory_adjustments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.payments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
ALTER PUBLICATION supabase_realtime ADD TABLE public.global_waiting_bench;

-- ==============================================================================
-- 11. SEED SINGLE SOLE ADMINISTRATOR (Supabase Auth Target)
-- ==============================================================================
INSERT INTO public.users (
  moneyfox_id,
  email,
  name,
  phone,
  role,
  payment_completed,
  payment_method,
  payment_date,
  has_joined_tree,
  referral_code,
  wallet_balance,
  current_level
)
VALUES
(
  'MF-OPS-ROOT',
  'admin@moneyfox.co.in',
  'Apex Administrator',
  '+91 98200 00001',
  'admin',
  true,
  'system',
  NOW(),
  true,
  'ADMINMFX',
  100000,
  9
)
ON CONFLICT (email) DO UPDATE SET
  moneyfox_id = 'MF-OPS-ROOT',
  role = 'admin',
  name = 'Apex Administrator',
  payment_completed = true,
  has_joined_tree = true;

-- Automatically link auth_user_id if admin@moneyfox.co.in already exists in Supabase auth.users
DO $$
BEGIN
  UPDATE public.users u
  SET auth_user_id = a.id::text
  FROM auth.users a
  WHERE LOWER(a.email) = 'admin@moneyfox.co.in' AND LOWER(u.email) = 'admin@moneyfox.co.in';
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- ==============================================================================
-- 11B. ATOMIC INVENTORY & PRODUCT MANIPULATION STORED PROCEDURE
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.adjust_product_inventory(
  p_sku TEXT,
  p_size TEXT,
  p_adjustment INTEGER,
  p_reason TEXT,
  p_operator_email TEXT DEFAULT 'admin@moneyfox.co.in',
  p_audit_note TEXT DEFAULT ''
)
RETURNS JSONB AS $$
DECLARE
  v_product RECORD;
  v_prev_stock INTEGER := 0;
  v_new_stock INTEGER := 0;
BEGIN
  -- Find product by SKU
  SELECT * INTO v_product FROM public.products WHERE sku = p_sku;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Product SKU not found');
  END IF;

  -- Get and update stock according to specified size
  IF UPPER(p_size) = 'S' THEN
    v_prev_stock := COALESCE(v_product.size_s_stock, 0);
    v_new_stock := GREATEST(0, v_prev_stock + p_adjustment);
    UPDATE public.products SET size_s_stock = v_new_stock, updated_at = NOW() WHERE id = v_product.id;
  ELSIF UPPER(p_size) = 'M' THEN
    v_prev_stock := COALESCE(v_product.size_m_stock, 0);
    v_new_stock := GREATEST(0, v_prev_stock + p_adjustment);
    UPDATE public.products SET size_m_stock = v_new_stock, updated_at = NOW() WHERE id = v_product.id;
  ELSIF UPPER(p_size) = 'L' THEN
    v_prev_stock := COALESCE(v_product.size_l_stock, 0);
    v_new_stock := GREATEST(0, v_prev_stock + p_adjustment);
    UPDATE public.products SET size_l_stock = v_new_stock, updated_at = NOW() WHERE id = v_product.id;
  ELSIF UPPER(p_size) = 'XL' THEN
    v_prev_stock := COALESCE(v_product.size_xl_stock, 0);
    v_new_stock := GREATEST(0, v_prev_stock + p_adjustment);
    UPDATE public.products SET size_xl_stock = v_new_stock, updated_at = NOW() WHERE id = v_product.id;
  ELSE
    RETURN jsonb_build_object('success', false, 'error', 'Invalid size');
  END IF;

  -- Re-evaluate status based on total remaining stock
  UPDATE public.products
  SET status = CASE 
    WHEN (size_s_stock + size_m_stock + size_l_stock + size_xl_stock) <= 5 THEN 'Low stock'
    ELSE 'Published'
  END
  WHERE id = v_product.id;

  -- Record audit trail entry
  INSERT INTO public.inventory_adjustments (
    product_id,
    sku,
    size,
    operator_email,
    adjustment_quantity,
    previous_stock,
    new_stock,
    reason,
    audit_note
  ) VALUES (
    v_product.id,
    p_sku,
    UPPER(p_size),
    p_operator_email,
    p_adjustment,
    v_prev_stock,
    v_new_stock,
    p_reason,
    p_audit_note
  );

  RETURN jsonb_build_object(
    'success', true,
    'sku', p_sku,
    'size', UPPER(p_size),
    'previous_stock', v_prev_stock,
    'new_stock', v_new_stock
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- 11C. SUPABASE AUTH SYNC TRIGGER FOR ADMIN & USERS
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger AS $$
DECLARE
  is_admin BOOLEAN;
BEGIN
  is_admin := (LOWER(NEW.email) = 'admin@moneyfox.co.in' OR LOWER(NEW.email) LIKE '%admin%');

  INSERT INTO public.users (
    auth_user_id,
    moneyfox_id,
    email,
    name,
    phone,
    role,
    payment_completed,
    payment_method,
    payment_date,
    has_joined_tree,
    referral_code,
    wallet_balance,
    current_level
  )
  VALUES (
    NEW.id::text,
    CASE 
      WHEN is_admin THEN 'MF-OPS-ROOT'
      ELSE 'MFX-' || UPPER(SUBSTRING(NEW.id::text, 1, 8))
    END,
    LOWER(NEW.email),
    CASE 
      WHEN is_admin THEN 'Apex Administrator'
      ELSE COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1))
    END,
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    CASE WHEN is_admin THEN 'admin' ELSE 'user' END,
    is_admin,
    'system',
    NOW(),
    is_admin,
    CASE WHEN is_admin THEN 'ADMINMFX' ELSE UPPER(SUBSTRING(MD5(NEW.email), 1, 8)) END,
    CASE WHEN is_admin THEN 100000 ELSE 0 END,
    CASE WHEN is_admin THEN 9 ELSE 1 END
  )
  ON CONFLICT (email) DO UPDATE SET
    auth_user_id = EXCLUDED.auth_user_id,
    role = CASE WHEN is_admin THEN 'admin' ELSE public.users.role END,
    moneyfox_id = CASE WHEN is_admin THEN 'MF-OPS-ROOT' ELSE public.users.moneyfox_id END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- ==============================================================================
-- 12. SEED COMPLETE LUXURY STREETWEAR COLLECTION
-- ==============================================================================
INSERT INTO public.products (
  slug,
  sku,
  name,
  series,
  lot,
  gsm,
  price,
  taxable_price,
  gst_percentage,
  color,
  edition_tag,
  image,
  thumbnails,
  description,
  details,
  specs,
  sizes,
  available_sizes,
  size_s_stock,
  size_m_stock,
  size_l_stock,
  size_xl_stock,
  status,
  is_active,
  category
)
VALUES
(
  'chill-black',
  'MF-240CB',
  'MoneyFox "Chill Out" Cyber Bear Heavyweight Tee',
  'Cyber Streetwear Series · 001',
  'Lot #MF-240CB • Obsidian Noir',
  240,
  2000,
  1785.71,
  12,
  'Obsidian Black / Cyan Accent',
  'Cyber Bear',
  '/images/products/chill-black/front.jpg',
  ARRAY[
    '/images/products/chill-black/front.jpg',
    '/images/products/chill-black/back.jpg',
    '/images/products/chill-black/left.jpg',
    '/images/products/chill-black/right.jpg'
  ],
  'Architectural oversized silhouette in 240 GSM luxury combed cotton. Features the signature cyan "CHILL OUT" cyber bear front chest emblem and explosive back graffiti mural.',
  ARRAY[
    '240 GSM luxury combed compact ring-spun cotton jersey',
    'Drop-shoulder boxy streetwear drape with ribbed collar',
    'Dual-side graphics: Front chest icon + Full-back graffiti art',
    'Pre-shrunk bio-wash treatment for maximum durability'
  ],
  'Direct Selling Registered · Binary Tree Node · HSN 6109',
  ARRAY['S', 'M', 'L', 'XL'],
  ARRAY['S', 'M', 'L', 'XL'],
  18, 22, 30, 15,
  'Published',
  true,
  'apparel'
),
(
  'corner-black',
  'MF-240CS',
  'MoneyFox "Corner Street Rural" Typographic Tee (Noir)',
  'Youth Section Heritage · 002',
  'Lot #MF-240CS • Midnight Noir',
  240,
  2000,
  1785.71,
  12,
  'Midnight Black / Chalk White',
  'Corner Street Noir',
  '/images/products/corner-black/front.jpg',
  ARRAY[
    '/images/products/corner-black/front.jpg',
    '/images/products/corner-black/back.jpg',
    '/images/products/corner-black/left.jpg',
    '/images/products/corner-black/right.jpg'
  ],
  'Heritage street typography on 240 GSM midnight black cotton. Front pocket "Youth Section Corner Street Rural" circular crest paired with large arch typography on the back.',
  ARRAY[
    '240 GSM premium combed cotton with soft handfeel',
    'Screen-printed chalk white typography (front & back)',
    'Double-stitched seamless hems and reinforced shoulders',
    'Statutory 12% GST invoice with verified tracking'
  ],
  'Direct Selling Registered · Binary Tree Node · HSN 6109',
  ARRAY['S', 'M', 'L', 'XL'],
  ARRAY['S', 'M', 'L', 'XL'],
  16, 24, 18, 12,
  'Published',
  true,
  'apparel'
),
(
  'better-black',
  'MF-240BD',
  'MoneyFox "Better Days Ahead" Dripping Smiley Tee (Noir)',
  'Neo-Psychedelic Drop · 003',
  'Lot #MF-240BD • Pitch Noir',
  240,
  2000,
  1785.71,
  12,
  'Pitch Black / Neon Pink & Cream',
  'Better Days Noir',
  '/images/products/better-black/front.jpg',
  ARRAY[
    '/images/products/better-black/front.jpg',
    '/images/products/better-black/back.jpg',
    '/images/products/better-black/left.jpg',
    '/images/products/better-black/right.jpg'
  ],
  'Statement streetwear piece featuring the iconic neon pink melting dripping smiley on the front and bold typography with dual smileys across the back.',
  ARRAY[
    '240 GSM heavyweight combed compact cotton',
    'Vibrant multi-color high-density screen print',
    'Relaxed modern street fit with dropped shoulders',
    'Free nationwide door-to-door express delivery'
  ],
  'Direct Selling Registered · Binary Tree Node · HSN 6109',
  ARRAY['S', 'M', 'L', 'XL'],
  ARRAY['S', 'M', 'L', 'XL'],
  20, 20, 25, 10,
  'Published',
  true,
  'apparel'
),
(
  'better-purple',
  'MF-240BDP',
  'MoneyFox "Better Days Ahead" Dripping Smiley Tee (Purple)',
  'Neo-Psychedelic Drop · 004',
  'Lot #MF-240BDP • Imperial Plum',
  240,
  2000,
  1785.71,
  12,
  'Imperial Plum / Neon Pink Accent',
  'Better Days Purple',
  '/images/products/better-purple/front.jpg',
  ARRAY[
    '/images/products/better-purple/front.jpg',
    '/images/products/better-purple/back.jpg',
    '/images/products/better-purple/left.jpg',
    '/images/products/better-purple/right.jpg'
  ],
  'Rich royal plum pigment wash on 240 GSM premium ringspun jersey. Contrasting neon pink melting smiley crest and bold back typography.',
  ARRAY[
    '240 GSM imperial plum reactive-dyed combed cotton',
    'Vivid neon pink & cream pigment detailing',
    'Architectural unisex drop-shoulder streetwear cut',
    'Instant commission allocation to binary waiting bench'
  ],
  'Direct Selling Registered · Binary Tree Node · HSN 6109',
  ARRAY['S', 'M', 'L', 'XL'],
  ARRAY['S', 'M', 'L', 'XL'],
  12, 18, 22, 8,
  'Published',
  true,
  'apparel'
),
(
  'corner-navy',
  'MF-240CSN',
  'MoneyFox "Corner Street Rural" Typographic Tee (Navy)',
  'Coastal Maritime Drop · 005',
  'Lot #MF-240CSN • Deep Navy',
  240,
  2000,
  1785.71,
  12,
  'Deep Sea Navy / Chalk White',
  'Corner Street Navy',
  '/images/products/corner-navy/front.jpg',
  ARRAY[
    '/images/products/corner-navy/front.jpg',
    '/images/products/corner-navy/back.jpg',
    '/images/products/corner-navy/left.jpg',
    '/images/products/corner-navy/right.jpg'
  ],
  'Deep oceanic navy 240 GSM combed cotton with crisp chalk-white "Youth Section Corner Street Rural" circular pocket crest and back arch artwork.',
  ARRAY[
    '240 GSM oceanic navy compact combed cotton',
    'High-contrast crisp chalk white screen printing',
    'Anti-shrink, anti-pilling bio-wash luxury finish',
    'Includes GST invoice and optional referral activation'
  ],
  'Direct Selling Registered · Binary Tree Node · HSN 6109',
  ARRAY['S', 'M', 'L', 'XL'],
  ARRAY['S', 'M', 'L', 'XL'],
  14, 20, 16, 10,
  'Published',
  true,
  'apparel'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  status = EXCLUDED.status,
  size_s_stock = EXCLUDED.size_s_stock,
  size_m_stock = EXCLUDED.size_m_stock,
  size_l_stock = EXCLUDED.size_l_stock,
  size_xl_stock = EXCLUDED.size_xl_stock;
