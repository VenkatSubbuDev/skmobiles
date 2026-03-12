
-- Mobile brands table
CREATE TABLE public.mobile_brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  logo_url text,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.mobile_brands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Brands viewable by everyone" ON public.mobile_brands FOR SELECT USING (true);
CREATE POLICY "Admins can manage brands" ON public.mobile_brands FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Mobile models table
CREATE TABLE public.mobile_models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid REFERENCES public.mobile_brands(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.mobile_models ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Models viewable by everyone" ON public.mobile_models FOR SELECT USING (true);
CREATE POLICY "Admins can manage models" ON public.mobile_models FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Custom case orders table
CREATE TABLE public.custom_case_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  order_number text NOT NULL,
  brand_id uuid REFERENCES public.mobile_brands(id) NOT NULL,
  model_id uuid REFERENCES public.mobile_models(id) NOT NULL,
  image_url text NOT NULL,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text,
  shipping_address text NOT NULL,
  quantity integer DEFAULT 1,
  price numeric NOT NULL DEFAULT 199,
  status text DEFAULT 'pending',
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.custom_case_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create case orders" ON public.custom_case_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view own case orders" ON public.custom_case_orders FOR SELECT USING (user_id = auth.uid() OR customer_email IS NOT NULL);
CREATE POLICY "Admins can manage case orders" ON public.custom_case_orders FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Generate order number for custom cases
CREATE OR REPLACE FUNCTION public.generate_case_order_number()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  NEW.order_number := 'CSE' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_case_order_number
  BEFORE INSERT ON public.custom_case_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_case_order_number();
