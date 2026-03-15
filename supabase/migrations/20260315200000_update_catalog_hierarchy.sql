-- Rename existing tables
ALTER TABLE public.mobile_brands RENAME TO brands;
ALTER TABLE public.mobile_models RENAME TO models;

-- Update custom cases foreign keys
ALTER TABLE public.custom_case_orders DROP CONSTRAINT custom_case_orders_brand_id_fkey;
ALTER TABLE public.custom_case_orders ADD CONSTRAINT custom_case_orders_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands(id);

ALTER TABLE public.custom_case_orders DROP CONSTRAINT custom_case_orders_model_id_fkey;
ALTER TABLE public.custom_case_orders ADD CONSTRAINT custom_case_orders_model_id_fkey FOREIGN KEY (model_id) REFERENCES public.models(id);

-- Update RLS policies to reflect new table names
-- Since RLS policies are tied to table names, renaming the table keeps policies, but we drop and recreate for clarity and safety if needed.
-- PostgreSQL auto-updates policy targets upon table rename, so we just add the new relationships.

-- 1. Brands depend on Categories
ALTER TABLE public.brands ADD COLUMN category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE;

-- Update existing brands to reference the 'Cases & Covers' category temporarily to fulfill the constraint if existing data exists.
-- It's safer to allow null momentarily or just update them manually. We'll leave it nullable if some brands are global.
-- But the requirement is: "Category -> Brand".

-- 2. Products belong to Category, Brand, and Model
ALTER TABLE public.products ADD COLUMN brand_id UUID REFERENCES public.brands(id) ON DELETE SET NULL;
ALTER TABLE public.products ADD COLUMN model_id UUID REFERENCES public.models(id) ON DELETE SET NULL;

-- 3. Add Tags to products
ALTER TABLE public.products ADD COLUMN tags TEXT[] DEFAULT '{}';
ALTER TABLE public.products ADD COLUMN discount_price DECIMAL(10, 2);

-- Also add stock_quantity if not already present (it's present in initial migration)
-- the original original_price is effectively discount price conceptually, or original_price is MSRP, and price is current. Let's use the new discount_price field to be explicit.

-- Enable real-time for new associations if needed
-- (Assuming realtime publication already includes public schema broadly or we can add it later)
